import * as util from 'ethereumjs-util'
import * as Transaction from 'ethereumjs-tx'
import * as Trie from 'merkle-patricia-tree'
import { RPCRequest, RPCResponse } from '../types/config';
import { Signature } from '../types/config';
import Block, { toHex, createTx, BlockData } from './block'

export interface Proof {
  type: 'transactionProof',
  block: string,
  merkelProof?: string[],
  txIndex?,
  signatures: Signature[]
}


/** converts blockdata to a hexstring*/
export function blockToHex(block) {
  return new Block(block).serializeHeader().toString('hex')
}

/** converts a hexstring to a block-object */
export function blockFromHex(hex) {
  return new Block(hex)
}

/** verify the signatures of a blockhash */
export function verifyBlock(b: Block, signatures: Signature[], expectedSigners: string[], expectedBlockHash: string) {

  const blockHash = '0x' + b.hash().toString('hex').toLowerCase()
  if (expectedBlockHash && blockHash !== expectedBlockHash.toLowerCase())
    throw new Error('The BlockHash is not the expected one!')

  // TODO in the future we are not allowing block verification without signature
  if (!signatures) return

  const messageHash = util.sha3(blockHash + b.number.toString('hex').padStart(64, '0')).toString('hex')
  if (!signatures.reduce((p, signature, i) => {
    if (messageHash !== signature.msgHash)
      throw new Error('The signature signed the wrong message!')
    const signer = '0x' + util.pubToAddress(util.erecover(messageHash, signature.v, util.toBuffer(signature.r), util.toBuffer(signature.s))).toString('hex')
    if (signer.toLowerCase() !== expectedSigners[i].toLowerCase())
      throw new Error('The signature was not signed by ' + expectedSigners[i])
    return true
  }, true))
    throw new Error('No valid signature')
}

/** creates the merkle-proof for a transation */
export async function createTransactionProof(block: BlockData, txHash: string, signatures: Signature[]): Promise<Proof> {
  // we always need the txIndex, since this is used as path inside the merkle-tree
  const txIndex = block.transactions.findIndex(_ => _.hash === txHash)
  if (txIndex < 0) throw new Error('tx not found')

  // create trie
  const trie = new Trie()
  // fill in all transactions
  await Promise.all(block.transactions.map(tx => new Promise((resolve, reject) =>
    trie.put(
      util.rlp.encode(parseInt(tx.transactionIndex)), // path as txIndex
      createTx(tx).serialize(),  // raw transactions
      error => error ? reject(error) : resolve(true)
    )
  )))

  // check roothash
  if (block.transactionsRoot !== '0x' + trie.root.toString('hex'))
    throw new Error('The transactionHash is wrong! : ' + block.transactionsRoot + '!==0x' + trie.root.toString('hex'))

  // create prove
  return new Promise<Proof>((resolve, reject) =>
    Trie.prove(trie, util.rlp.encode(txIndex), (err, prove) => {
      if (err) return reject(err)
      resolve({
        type: 'transactionProof',
        block: blockToHex(block),
        merkelProof: prove.map(_ => _.toString('hex')),
        txIndex, signatures
      })
    }))
}

/** verifies a TransactionProof */
export async function verifyTransactionProof(txHash: string, proof: Proof, expectedSigners: string[], txData: any) {

  if (!txData) throw new Error('No TransactionData!')

  // decode the blockheader
  const block = blockFromHex(proof.block)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, txData.blockHash)

  const txHashofData = '0x' + createTx(txData).hash().toString('hex')
  if (txHashofData !== txHash)
    throw new Error('The transactiondata were manipulated')

  // since the blockhash is verified, we have the correct transaction root
  return new Promise((resolve, reject) => {
    Trie.verifyProof(
      block.transactionsTrie, // expected merkle root
      util.rlp.encode(proof.txIndex), // path, which is the transsactionIndex
      proof.merkelProof.map(_ => util.toBuffer('0x' + _)), // array of Buffer with the merkle-proof-data
      (err, value) => { // callback
        if (err) return reject(err)
        // the value holds the Buffer of the transaction to proof
        // we can now simply hash this and compare it to the given txHas
        if (txHash === '0x' + util.sha3(value).toString('hex'))
          resolve(value)
        else
          reject(new Error('The TransactionHash could not be verified, since the merkel-proof resolved to a different hash'))
      })
  })


}



/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof = true): Promise<boolean> {
  const proof = response && response.in3 && response.in3.proof as any as Proof
  if (!proof) return allowWithoutProof
  switch (proof.type) {
    case 'transactionProof':
      return verifyTransactionProof(request.params[0], proof, request.in3 && request.in3.signatures, response.result && response.result as any).then(_ => true, _ => false)
    default:
      return false
  }
}

