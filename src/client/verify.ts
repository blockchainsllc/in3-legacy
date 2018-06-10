import * as util from 'ethereumjs-util'
import { AccountProof, Proof, RPCRequest, RPCResponse, ServerList, Signature } from '../types/types'
import { Block, createTx, blockFromHex, toAccount, toReceipt, hash, serialize, LogData, Bytes32, Address } from '../util/serialize'
import { toHex, toBuffer, promisify, toMinHex } from '../util/util'
import { executeCall } from './call'
import { createRandomIndexes } from './serverList'
import verifyMerkleProof from '../util/merkleProof'
import { getStorageArrayKey, getStringValue } from '../util/storage'
import * as Trie from 'merkle-patricia-tree'


const allowedWithoutProof = ['eth_blockNumber']


/** verify the signatures of a blockhash */
export function verifyBlock(b: Block, signatures: Signature[], expectedSigners: Buffer[], expectedBlockHash: Buffer) {

  // calculate the blockHash
  const blockHash = b.hash()
  if (expectedBlockHash && !blockHash.equals(expectedBlockHash))
    throw new Error('The BlockHash is not the expected one!')

  // TODO in the future we are not allowing block verification without signature
  if (!signatures) return

  // verify the signatures for only the blocks matching the given
  const messageHash: Buffer = util.sha3(Buffer.concat([blockHash, Bytes32(b.number)]))
  if (!signatures.filter(_ => _.block.toString(16) === b.number.toString('hex')).reduce((p, signature, i) => {

    if (!messageHash.equals(Bytes32(signature.msgHash)))
      throw new Error('The signature signed the wrong message!')

    // recover the signer from the signature
    const signer: Buffer = util.pubToAddress(util.ecrecover(messageHash, parseInt(signature.v), util.toBuffer(signature.r), util.toBuffer(signature.s)))

    // make sure the signer is the expected one
    if (!signer.equals(toBuffer(expectedSigners[i])))
      throw new Error('The signature was not signed by ' + expectedSigners[i])

    // looks good ;-)
    return true
  }, true))
    throw new Error('No valid signature')
}



/** verifies a TransactionProof */
export async function verifyTransactionProof(txHash: string, proof: Proof, expectedSigners: Buffer[], txData: any) {

  if (!txData) throw new Error('No TransactionData!')

  // decode the blockheader
  const block = blockFromHex(proof.block)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, Bytes32(txData.blockHash))

  // TODO the from-address is not directly part of the hash, so manipulating this property would not be detected! 
  // we would have to take the from-address from the signature
  const tx = createTx(txData)
  const txHashofData = '0x' + tx.hash().toString('hex')
  //  const txHashofData = '0x' + createTx(txData).hash().toString('hex')
  if (txHashofData !== txHash)
    throw new Error('The transactiondata were manipulated')

  // verifiy the proof
  await verifyMerkleProof(
    block.transactionsTrie, // expected merkle root
    util.rlp.encode(proof.txIndex), // path, which is the transsactionIndex
    proof.merkleProof.map(_ => util.toBuffer('0x' + _)), // array of Buffer with the merkle-proof-data
    tx.serialize(),
    'The Transaction can not be verified'
  )

}

/** verifies a TransactionProof */
export async function verifyTransactionReceiptProof(txHash: string, proof: Proof, expectedSigners: Buffer[], receipt: any) {

  if (!receipt) throw new Error('No TransactionData!')

  // decode the blockheader
  const block = blockFromHex(proof.block)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, Bytes32(receipt.blockHash))

  // since the blockhash is verified, we have the correct transaction root
  // verifiy the proof
  await verifyMerkleProof(
    block.receiptTrie, // expected merkle root
    util.rlp.encode(proof.txIndex), // path, which is the transsactionIndex
    proof.merkleProof.map(_ => util.toBuffer('0x' + _)), // array of Buffer with the merkle-proof-data
    serialize(toReceipt(receipt)),
    'The TransactionReceipt can not be verified'
  )
}



/** verifies a TransactionProof */
export async function verifyLogProof(proof: Proof, expectedSigners: Buffer[], logs: LogData[]) {

  if (!logs) throw new Error('No Logs!')
  if (!logs.length) return

  if (!proof.logProof) throw new Error('Missing LogProof')

  const receiptData: { [txHash: string]: Buffer[] } = {}
  const blockHashes: { [blockNumber: string]: string } = {}

  await Promise.all(Object.keys(proof.logProof).map(async bn => {

    const blockProof = proof.logProof[bn]

    // decode the blockheader
    const block = blockFromHex(blockProof.block)
    blockHashes[bn] = '0x' + block.hash().toString('hex')

    // verify the blockhash and the signatures
    verifyBlock(block, proof.signatures, expectedSigners, null)

    // verifiy all merkle-Trees of the receipts
    await Promise.all(Object.keys(blockProof.receipts).map(txHash =>
      verifyMerkleProof(
        block.receiptTrie, // expected merkle root
        util.rlp.encode(blockProof.receipts[txHash].txIndex), // path, which is the transsactionIndex
        blockProof.receipts[txHash].proof.map(_ => util.toBuffer('0x' + _)), // array of Buffer with the merkle-proof-data
        undefined // we don't want to check, but use the found value in the next step
      ).then(value => receiptData[txHash] = util.rlp.decode(value))
    ))

  }))


  // now verify the logdata
  logs.forEach(l => {
    const receipt = receiptData[l.transactionHash]
    if (!receipt) throw new Error('The receipt ' + l.transactionHash + 'is missing in the proof')

    const logData = (receipt[3] as any)[parseInt(l.logIndex)] as Buffer[]
    if (!logData) throw new Error('Log not found in Transaction')

    /// txReceipt.logs.map(l => [l.address, l.topics.map(toBuffer), l.data].map(toBuffer))]
    if (logData[0].toString('hex') !== l.address.toLowerCase().substr(2))
      throw new Error('Wrong address in log ')

    if ((logData[1] as any as Buffer[]).map(toHex).join() !== l.topics.join())
      throw new Error('Wrong Topics in log ')

    if (logData[2].toString('hex') !== l.data.substr(2))
      throw new Error('Wrong data in log ')

    const bp = proof.logProof[toHex(l.blockNumber)]
    if (!bp)
      throw new Error('wrong blockNumber')

    if (blockHashes[toHex(l.blockNumber)] !== l.blockHash)
      throw new Error('wrong blockhash')

    if (!bp.receipts[l.transactionHash])
      throw new Error('wrong transactionHash')

    if (bp.receipts[l.transactionHash].txIndex !== parseInt(l.transactionIndex as string))
      throw new Error('wrong transactionIndex')
  })
}



/** verifies a TransactionProof */
export async function verifyBlockProof(request: RPCRequest, data: any, proof: Proof, expectedSigners: Buffer[]) {
  // decode the blockheader
  const block = new Block(proof.block || data)
  if (proof.transactions) block.transactions = proof.transactions.map(createTx)

  let requiredHash: Buffer = null

  if (request.method.endsWith('ByHash'))
    requiredHash = Bytes32(request.params[0])
  else if (parseInt(request.params[0]) && parseInt(request.params[0]) !== parseInt('0x' + block.number.toString('hex')))
    throw new Error('The Block does not contain the required blocknumber')
  if (!requiredHash && request.method.indexOf('Count') < 0 && data)
    requiredHash = Bytes32(data.hash)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, requiredHash)

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

  if (request.method.indexOf('Count') > 0 && toHex(block.transactions.length) != toHex(data))
    throw new Error('The number of transaction does not match')
}



/** verifies a TransactionProof */
export async function verifyAccountProof(request: RPCRequest, value: any, proof: Proof, expectedSigners: Buffer[]) {
  if (!value) throw new Error('No Accountdata!')

  // get the account this proof is based on
  const account = request.method === 'in3_nodeList' ? value.contract : request.params[0]

  // verify the blockhash and the signatures
  const block = new Block(proof.block)
  // TODO if we expect a specific block in the request, we should also check if the block is the one requested
  verifyBlock(block, proof.signatures, expectedSigners, null)

  // get the account-proof
  const accountProof = proof.accounts[Object.keys(proof.accounts)[0]]
  if (!accountProof) throw new Error('Missing Account in Account-Proof')

  // verify the result
  if (account.toLowerCase() !== accountProof.address.toLowerCase()) throw new Error('The Account does not match the account in the proof')
  switch (request.method) {
    case 'eth_getBalance':
      if (value !== accountProof.balance) throw new Error('The Balance does not match the one in the proof')
      break
    case 'eth_getStorageAt':
      const entry = accountProof.storageProof.find(_ => toHex(_.key) === toHex(request.params[1]))
      if (!entry) throw new Error('The proof for the storage value ' + request.params[1] + ' can not be found ')
      if (toHex(entry.value) !== toHex(value)) throw new Error('The Value does not match the one in the proof')
      break
    case 'eth_getCode':
      if (accountProof.codeHash !== '0x' + util.keccak(value).toString('hex')) throw new Error('The codehash in the proof does not match the code')
      break
    case 'eth_getTransactionCount':
      if (accountProof.nonce !== value) throw new Error('The nonce in the proof does not match the returned')
      break
    case 'in3_nodeList':
      verifyNodeListData(value, proof, block, request)
      // the contract must be checked later in the updateList -function
      break
    default:
      throw new Error('Unsupported Account-Proof for ' + request.method)
  }

  // verify the merkle tree of the account proof
  await verifyAccount(accountProof, block)
}

function verifyNodeListData(nl: ServerList, proof: Proof, block: Block, request: RPCRequest) {

  // get the one account to check with
  const accountProof = proof.accounts[Object.keys(proof.accounts)[0]]
  if (!accountProof) throw new Error('Missing Account in Account-Proof')

  // check the total servercount
  checkStorage(accountProof, toHex(getStorageArrayKey(0), 32), toHex(nl.totalServers, 32), 'wrong number of servers ')

  // check blocknumber
  if (parseInt('0x' + block.number.toString('hex')) !== nl.lastBlockNumber)
    throw new Error('The signature is based on a different blockhash!')

  // if we requested a limit, we need to find out if the correct nodes where send.
  const limit = request.params[0] as number
  if (limit && limit < nl.totalServers) {
    if (limit !== nl.nodes.length)
      throw new Error('The number of returned nodes must be ' + limit + ', since this was required and there are ' + nl.totalServers + ' servers')

    // try to find the addresses in the node list
    const idxs: number[] = (request.params[2] || []).map(adr => {
      const a = nl.nodes.find(_ => _.address === adr)
      if (!a)
        throw new Error('The required address ' + adr + ' is not part of the list!')
      return a.index
    });

    // create the index the same way the server should
    createRandomIndexes(nl.totalServers, limit, request.params[1] as string, idxs)

    // veryfy the index is in the same order 
    if (idxs.length !== limit)
      throw new Error('wrong number of index')
    idxs.forEach((index, i) => {
      if (nl.nodes[i].index !== index)
        throw new Error('the index of node nr. ' + (i + 1) + ' needs to be ' + index)
    });
  }

  // we got the complete list in the correct order
  else {

    // check server count
    if (nl.nodes.length !== nl.totalServers)
      throw new Error('Wrong number of nodes!');

    // check the index of the result
    const failedNode = nl.nodes.find((n, i) => n.index !== i);
    if (failedNode)
      throw new Error('The node ' + failedNode.url + ' has the wrong index!');
  }

  // verify the values of the proof
  for (const n of nl.nodes) {
    checkStorage(accountProof, getStorageArrayKey(0, n.index, 5, 1), toHex(n.address.toLowerCase(), 32), 'wrong owner ');
    checkStorage(accountProof, getStorageArrayKey(0, n.index, 5, 2), toHex(n.deposit, 32), 'wrong deposit ');
    checkStorage(accountProof, getStorageArrayKey(0, n.index, 5, 3), toHex(n.props, 32), 'wrong props ');
    const urlKey = getStorageArrayKey(0, n.index, 5, 0);
    const urlVal = getStringValue(getStorageValue(accountProof, urlKey), urlKey);
    if (typeof urlVal === 'string') {
      if (urlVal !== n.url)
        throw new Error('Wrong url in proof ' + n.url);
    }
    else {
      const url = Buffer.concat(urlVal.storageKeys.map(_ => toBuffer(getStorageValue(accountProof, _)))).slice(0, urlVal.len).toString('utf8');
      if (url !== n.url)
        throw new Error('Wrong url in proof ' + n.url);
    }
  }
}

function checkStorage(ap: AccountProof, key: string, value: string, msg?: string) {
  if (toMinHex(getStorageValue(ap, key)) !== toMinHex(value))
    throw new Error(msg + ('The key has the wrong value (expected: ' + toMinHex(value) + ' proven:' + toMinHex(getStorageValue(ap, key))))
}



export function getStorageValue(ap: AccountProof, key: string) {

  key = toMinHex(key)
  let entry = ap.storageProof.find(_ => _.key === key)
  if (!entry && key.length % 2) {
    key = '0x0' + key.substr(2)
    entry = ap.storageProof.find(_ => _.key === key)
  }

  if (!entry) throw new Error(' There is no storrage key ' + key + ' in the storage proof!')
  return entry.value
}

/** verifies a TransactionProof */
export async function verifyCallProof(request: RPCRequest, value: string, proof: Proof, expectedSigners: Buffer[]) {

  // verify the blockhash and the signatures
  const block = new Block(proof.block)
  // TODO if we expect a specific block in the request, we should also check if the block is the one requested
  verifyBlock(block, proof.signatures, expectedSigners, null)

  if (!proof.accounts) throw new Error('No Accounts to verify')

  // verify all accounts
  await Promise.all(Object.keys(proof.accounts).map(adr => verifyAccount(proof.accounts[adr], block)))

  // now create a vm and run the transaction
  const result = await executeCall(request.params[0], proof.accounts, block.serializeHeader())

  if (result !== value)
    throw new Error('The result does not match the execution !')

}


async function verifyAccount(accountProof: AccountProof, block: Block) {

  // if we received the code, make sure the codeHash is correct!
  if (accountProof.code && util.keccak(accountProof.code).toString('hex') !== accountProof.codeHash.substr(2))
    throw new Error('The code does not math the correct codehash! ')

  //  return Promise.all([
  return Promise.all([


    verifyMerkleProof(
      block.stateRoot, // expected merkle root
      util.keccak(accountProof.address), // path, which is the transsactionIndex
      accountProof.accountProof.map(util.toBuffer), // array of Buffer with the merkle-proof-data
      isNotExistend(accountProof) ? null : serialize(toAccount(accountProof)),
      'The Account could not be verified'
    ),

    // and all storage proofs
    ...accountProof.storageProof.map(s =>
      verifyMerkleProof(
        toBuffer(accountProof.storageHash),   // the storageRoot of the account
        util.keccak(toHex(s.key, 32)),  // the path, which is the hash of the key
        s.proof.map(util.toBuffer), // array of Buffer with the merkle-proof-data
        parseInt(s.value) === 0 ? null : util.rlp.encode(s.value),
        'The Srorage could not be verified'
      ))
  ])
}

function isNotExistend(account: AccountProof) {
  // TODO how do I determine the default nonce? It is in the genesis-bock!
  return parseInt(account.balance) === 0 && account.codeHash == '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' && parseInt(account.nonce) === 0
}

/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof = true, throwException = true): Promise<boolean> {
  const proof = response && response.in3 && response.in3.proof
  if (!proof) {
    if (allowedWithoutProof.indexOf(request.method) >= 0) return true
    // exceptions
    if (request.method === 'eth_getLogs' && response.result && (response.result as any).length === 0) return true
    if (request.method.startsWith('eth_getTransaction') && !response.result) return true
    if (throwException && !allowWithoutProof) throw new Error('the response does not contain any proof!')
    return allowWithoutProof
  }
  const signatures: Buffer[] = request.in3 && request.in3.signatures && request.in3.signatures.map(Address)
  try {
    switch (proof.type) {
      case 'transactionProof':
        await verifyTransactionProof(request.params[0], proof, signatures, response.result && response.result as any)
        break
      case 'logProof':
        await verifyLogProof(proof, signatures, response.result && response.result as LogData[])
        break
      case 'receiptProof':
        await verifyTransactionReceiptProof(request.params[0], proof, signatures, response.result && response.result as any)
        break
      case 'blockProof':
        await verifyBlockProof(request, response.result, proof, signatures)
        break
      case 'accountProof':
        await verifyAccountProof(request, response.result as string, proof, signatures)
        break
      case 'callProof':
        await verifyCallProof(request, response.result as string, proof, signatures)
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

