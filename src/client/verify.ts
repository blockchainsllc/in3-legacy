import * as util from 'ethereumjs-util'
import * as Transaction from 'ethereumjs-tx'
import * as Trie from 'merkle-patricia-tree'
import { RPCRequest, RPCResponse } from '../types/config';
import { Signature } from '../types/config';
import Block, { toHex, createTx } from './block'

export interface Proof {
  type: 'transactionProof',
  block: string,
  merkelProof?: string[],
  txIndex?,
  signatures: Signature[]
}


export function blockToHex(block) {
  return new Block(block).serializeHeader().toString('hex')
}
export function blockFromHex(hex) {
  return new Block(hex)
}

export function verifyBlock(b, signatures: Signature[], expectedSigners: string[]) {

  // TODO in the future we are not allowing block verification without signature
  if (!signatures) return

  const blockHeader = b instanceof Block ? b : new Block(b)
  const blockHash = '0x' + blockHeader.hash().toString('hex').toLowerCase()
  const messageHash = util.sha3(blockHash + blockHeader.number.toString('hex').padStart(64, '0')).toString('hex')
  if (!signatures.reduce((p, signature, i) => {
    if (messageHash !== signature.msgHash)
      throw new Error('The signature signed the wrong message!')
    const signer = '0x' + util.pubToAddress(util.erecover(messageHash, signature.v, util.toBuffer(signature.r), util.toBuffer(signature.s))).toString('hex')
    if (signer.toLowerCase() !== expectedSigners[i].toLowerCase())
      throw new Error('The signature was not signed by ' + expectedSigners[i])
    return true
  }, true))
    throw new Error('No valid signature')


  //  if (blockHash !== b.hash.toLowerCase()) throw new Error('BlockHeader invalid! Wrong blockHash!')
}

export async function createTransactionProof(block, txHash, signatures: Signature[]): Promise<Proof> {
  const txIndex = block.transactions.findIndex(_ => _.hash === txHash)
  if (txIndex < 0) throw new Error('tx not found')

  // create trie
  const trie = new Trie()
  await Promise.all(block.transactions.map(tx => new Promise((resolve, reject) =>
    trie.put(
      util.rlp.encode(parseInt(tx.transactionIndex)),
      createTx(tx).serialize(),
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

export async function verifyTransactionProof(txHash: string, proof: Proof, expectedSigners: string[]) {
  const block = blockFromHex(proof.block)

  verifyBlock(block, proof.signatures, expectedSigners)

  // since the blockhash is verified, we have the correct root
  return new Promise((resolve, reject) => {
    Trie.verifyProof(
      block.transactionsTrie,
      util.rlp.encode(proof.txIndex),
      proof.merkelProof.map(_ => util.toBuffer('0x' + _)),
      (err, value) => {
        if (err) return reject(err)
        if (txHash === '0x' + util.sha3(value).toString('hex'))
          resolve(value)
        else
          reject(new Error('The TransactionHash could not be verified, since the merkel-proof resolved to a different hash'))
      })
  })


}




export async function verifyProof(request: RPCRequest, response: RPCResponse): Promise<boolean> {
  const proof = response.in3.proof as any as Proof
  if (!proof) return false
  switch (proof.type) {
    case 'transactionProof':
      return verifyTransactionProof(request.params[0], proof, [response.in3Node.address]).then(_ => true, _ => false)
    default:
      return false
  }
}

