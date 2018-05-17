import * as util from 'ethereumjs-util'
import * as Transaction from 'ethereumjs-tx'
import * as Trie from 'merkle-patricia-tree'
import { RPCRequest, RPCResponse } from '../types/config';
import { Signature } from '../types/config';
import Block, { toHex, createTx, BlockData } from './block'
import { toBuffer } from './block';

export interface Proof {
  type: 'transactionProof' | 'blockProof' | 'accountProof' | 'nodeListProof',
  block?: string,
  merkelProof?: string[],
  transactions?: any[]
  account?: {
    accountProof: string[]
    address: string,
    balance: string
    codeHash: string
    nonce: string
    storageHash: string
    storageProof: {
      key: string
      proof: string
      value: string
    }[]
  },
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



/** verifies a TransactionProof */
export async function verifyBlockProof(blockData: BlockData, proof: Proof, expectedSigners: string[]) {
  if (!blockData) throw new Error('No Blockdata!')

  // decode the blockheader
  const block = new Block(proof.block || blockData)
  if (proof.transactions) block.transactions = proof.transactions.map(createTx)
  if (!blockData.hash) blockData.hash = toHex(block.hash(), 32)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, blockData.hash)

  // verify the transactions
  if (block.transactions) {
    const trie = new Trie()
    await Promise.all(block.transactions.map((tx, i) =>
      promisify(trie, trie.put, util.rlp.encode(i), tx.serialize())
    ))
    var txT = block.transactionsTrie.toString('hex')
    const thash = block.transactions.length ? trie.root.toString('hex') : util.SHA3_RLP.toString('hex')
    if (thash !== block.transactionsTrie.toString('hex'))
      throw new Error('The Transaction of do not hash to the given transactionHash!')
  }
}



/** verifies a TransactionProof */
export async function verifyAccountProof(request: RPCRequest, value: string, proof: Proof, expectedSigners: string[]) {
  if (!value) throw new Error('No Accountdata!')

  // verify the result
  if (request.params[0].toLowerCase() !== proof.account.address.toLowerCase()) throw new Error('The Account does not match the account in the proof')
  switch (request.method) {
    case 'eth_getBalance':
      if (value !== proof.account.balance) throw new Error('The Balance does not match the one in the proof')
      break
    case 'eth_getStorageAt':
      const entry = proof.account.storageProof.find(_ => _.key === request.params[1])
      if (!entry) throw new Error('The proof for the storage value ' + request.params[1] + ' can not be found ')
      if (entry.value !== value) throw new Error('The Value does not match the one in the proof')
      break
    case 'eth_getCode':
      if (proof.account.codeHash !== '0x' + util.keccak(value).toString('hex')) throw new Error('The codehash in the proof does not match the code')
      break
    case 'eth_getTransactionCount':
      if (proof.account.nonce !== value) throw new Error('The nonce in the proof does not match the returned')
      break
    default:
      throw new Error('Unsupported Account-Proof for ' + request.method)
  }

  // verify the blockhash and the signatures
  const block = new Block(proof.block)
  verifyBlock(block, proof.signatures, expectedSigners, null)

  // verify the proof
  await new Promise((resolve, reject) => {
    Trie.verifyProof(
      block.stateRoot, // expected merkle root
      util.keccak(proof.account.address), // path, which is the transsactionIndex
      proof.account.accountProof.map(util.toBuffer), // array of Buffer with the merkle-proof-data
      (err, value) => { // callback
        if (err) return reject(err)

        const account = util.rlp.encode([proof.account.nonce, proof.account.balance, proof.account.storageHash, proof.account.codeHash].map(toVariableBuffer))

        if (value.toString('hex') === account.toString('hex'))
          resolve(value)
        else
          reject(new Error('The Account could not be verified, since the merkel-proof resolved to a different hash'))

      })
  })


}



/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof = true, throwException = true): Promise<boolean> {
  const proof = response && response.in3 && response.in3.proof as any as Proof
  if (!proof) {
    if (throwException && !allowWithoutProof) throw new Error('the response does not contain any proof!')
    return allowWithoutProof
  }
  try {
    switch (proof.type) {
      case 'nodeListProof':
        // TODO implement proof for nodelist
        //        await verifyTransactionProof(request.params[0], proof, request.in3 && request.in3.signatures, response.result && response.result as any)
        break
      case 'transactionProof':
        await verifyTransactionProof(request.params[0], proof, request.in3 && request.in3.signatures, response.result && response.result as any)
        break
      case 'blockProof':
        await verifyBlockProof(response.result as any, proof, request.in3 && request.in3.signatures)
        break
      case 'accountProof':
        await verifyAccountProof(request, response.result as string, proof, request.in3 && request.in3.signatures)
        break
      default:
        throw new Error('Unsupported proof-type : ' + proof.type)
    }
    return true
  }
  catch (ex) {
    if (throwException) throw ex
    return false
  }
}




function promisify(self, fn, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    fn.apply(self, [...args, (res, err) => {
      if (err)
        reject(err)
      else
        resolve(res)
    }])
  })


}

function toVariableBuffer(val: string) {
  if (val == '0x' || val === '0x0' || val === '0x00')
    return Buffer.alloc(0)
  return util.toBuffer(val)
}