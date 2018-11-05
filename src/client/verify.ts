/***********************************************************
* This file is part of the Slock.it IoT Layer.             *
* The Slock.it IoT Layer contains:                         *
*   - USN (Universal Sharing Network)                      *
*   - INCUBED (Trustless INcentivized remote Node Network) *
************************************************************
* Copyright (C) 2016 - 2018 Slock.it GmbH                  *
* All Rights Reserved.                                     *
************************************************************
* You may use, distribute and modify this code under the   *
* terms of the license contract you have concluded with    *
* Slock.it GmbH.                                           *
* For information about liability, maintenance etc. also   *
* refer to the contract concluded with Slock.it GmbH.      *
************************************************************
* For more information, please refer to https://slock.it   *
* For questions, please contact info@slock.it              *
***********************************************************/


import * as util from 'ethereumjs-util'
import { AccountProof, Proof, RPCRequest, RPCResponse, ServerList, Signature } from '../types/types'
import { BlockData, Block, createTx, blockFromHex, toAccount, toReceipt, hash, serialize, LogData, bytes32, address, bytes, Receipt, TransactionData, toTransaction, ReceiptData, Transaction } from '../util/serialize';
import { toHex, toNumber, promisify, toMinHex, toBN } from '../util/util';
import { executeCall } from './call'
import { createRandomIndexes } from './serverList'
import verifyMerkleProof from '../util/merkleProof'
import { getStorageArrayKey, getStringValue } from '../util/storage'
import * as Trie from 'merkle-patricia-tree'
import * as ethUtil from 'ethereumjs-util'
import Client from './Client'
import Cache from './cache'
import { verifyIPFSHash } from './ipfs';

// these method are accepted without proof
const allowedWithoutProof = ['ipfs_get', 'ipfs_put', 'eth_blockNumber', 'web3_clientVersion', 'web3_sha3', 'net_version', 'net_peerCount', 'net_listening', 'eth_protocolVersion', 'eth_syncing', 'eth_coinbase', 'eth_mining', 'eth_hashrate', 'eth_gasPrice', 'eth_accounts', 'eth_sign', 'eth_sendRawTransaction', 'eth_estimateGas', 'eth_getCompilers', 'eth_compileLLL', 'eth_compileSolidity', 'eth_compileSerpent', 'eth_getWork', 'eth_submitWork', 'eth_submitHashrate']

/** special Error for making sure the correct node is blacklisted */
export class BlackListError extends Error {
  addresses: string[]
  constructor(msg: string, addresses: string[]) {
    super(msg)
    this.addresses = addresses
  }
}

/** verify the signatures of a blockhash */
export function verifyBlock(b: Block, signatures: Signature[], expectedSigners: Buffer[], expectedBlockHash: Buffer, cache: Cache) {

  // calculate the blockHash
  const blockHash = b.hash()
  if (expectedBlockHash && !blockHash.equals(expectedBlockHash))
    throw new Error('The BlockHash is not the expected one!')

  // if we don't expect signatures, we don't need to verify them.
  if (!expectedSigners || expectedSigners.length === 0) return

  // TODO in the future we are not allowing block verification without signature
  if (!signatures) throw new Error('No signatures found ')

  const existing = cache && cache.getBlockHeaderByHash(blockHash)

  // filter valid signatures for the current block
  const signaturesForBlock = signatures.filter(_ => _ && toNumber(_.block) === toNumber(b.number))
  if (signaturesForBlock.length === 0) {
    // if the blockhash is already verified, we don't need a signature
    if (existing) return

    throw new BlackListError('No signatures found for block ', expectedSigners.map(_ => ethUtil.toChecksumAddress(toHex(_))))
  }


  // verify the signatures for only the blocks matching the given
  const messageHash: Buffer = util.sha3(Buffer.concat([blockHash, bytes32(b.number)]))
  if (!signaturesForBlock.reduce((p, signature, i) => {

    if (!messageHash.equals(bytes32(signature.msgHash)))
      throw new BlackListError('The signature signed the wrong message!', expectedSigners.map(_ => ethUtil.toChecksumAddress(toHex(_))))

    // recover the signer from the signature
    const signer: Buffer = util.pubToAddress(util.ecrecover(messageHash, toNumber(signature.v), bytes(signature.r), bytes(signature.s)))

    // make sure the signer is the expected one
    if (!signer.equals(expectedSigners[i]))
      throw new Error('The signature was not signed by ' + expectedSigners[i])

    // we have at least one valid signature, so we can try to cache it.
    if (cache && cache.client.defConfig.maxBlockCache)
      cache.addBlockHeader(toNumber(b.number), b.serializeHeader())

    // looks good ;-)
    return true
  }, true))
    throw new Error('No valid signature')
}



/** verifies a TransactionProof */
export async function verifyTransactionProof(txHash: Buffer, proof: Proof, expectedSigners: Buffer[], txData: TransactionData, cache: Cache) {

  if (!txData) throw new Error('No TransactionData!')

  // decode the blockheader
  const block = blockFromHex(proof.block)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, bytes32(txData.blockHash), cache)

  // TODO the from-address is not directly part of the hash, so manipulating this property would not be detected! 
  // we would have to take the from-address from the signature
  const tx = toTransaction(txData)
  const txHashofData = hash(tx)

  //  const txHashofData = '0x' + createTx(txData).hash().toString('hex')
  if (!txHashofData.equals(txHash))
    throw new Error('The transactiondata were manipulated')

  // verifiy the proof
  await verifyMerkleProof(
    block.transactionsTrie, // expected merkle root
    util.rlp.encode(toNumber(proof.txIndex)), // path, which is the transsactionIndex
    proof.merkleProof.map(bytes), // array of Buffer with the merkle-proof-data
    serialize(tx),
    'The Transaction can not be verified'
  )

}

/** verifies a TransactionProof */
export async function verifyTransactionReceiptProof(txHash: Buffer, proof: Proof, expectedSigners: Buffer[], receipt: ReceiptData, cache: Cache) {

  if (!receipt) throw new Error('No ReceiptData!')

  // decode the blockheader
  const block = blockFromHex(proof.block)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, bytes32(receipt.blockHash), cache)

  // TODO how can we be sure, that the receipt matches the transactionHash? 
  // I guess we would need to also deliver the transaction and verify the txIndex and block

  // since the blockhash is verified, we have the correct transaction root
  // verifiy the proof
  return Promise.all([
    verifyMerkleProof(
      block.receiptTrie, // expected merkle root
      util.rlp.encode(toNumber(proof.txIndex)), // path, which is the transsactionIndex
      proof.merkleProof.map(bytes), // array of Buffer with the merkle-proof-data
      serialize(toReceipt(receipt)),
      'The TransactionReceipt can not be verified'
    ),
    verifyMerkleProof(
      block.transactionsTrie, // expected merkle root
      util.rlp.encode(toNumber(proof.txIndex)), // path, which is the transsactionIndex
      proof.txProof.map(bytes), // array of Buffer with the merkle-proof-data
      undefined,
      'The TransactionIndex can not be verified'
    ).then(val => {
      if (!hash(val).equals(txHash))
        throw new Error('The TransactionHash does not match the prooved one')
    })
  ])

}



/** verifies a TransactionProof */
export async function verifyLogProof(proof: Proof, expectedSigners: Buffer[], logs: LogData[], cache: Cache) {

  if (!logs) throw new Error('No Logs!')
  if (!logs.length) return

  if (!proof.logProof) throw new Error('Missing LogProof')

  const receiptData: { [txHash: string]: Receipt } = {}
  const blockHashes: { [blockNumber: string]: Buffer } = {}

  await Promise.all(Object.keys(proof.logProof).map(async bn => {

    const blockProof = proof.logProof[bn]

    // decode the blockheader
    const block = blockFromHex(blockProof.block)
    blockHashes[bn] = block.hash()

    // verify the blockhash and the signatures
    verifyBlock(block, proof.signatures, expectedSigners, null, cache)

    // verifiy all merkle-Trees of the receipts
    await Promise.all(Object.keys(blockProof.receipts).map(txHash =>
      verifyMerkleProof(
        block.receiptTrie, // expected merkle root
        util.rlp.encode(blockProof.receipts[txHash].txIndex), // path, which is the transsactionIndex
        blockProof.receipts[txHash].proof.map(bytes), // array of Buffer with the merkle-proof-data
        undefined // we don't want to check, but use the found value in the next step
      ).then(value => receiptData[txHash] = util.rlp.decode(value))
    ))
  }))

  // TODO the transactionHash itself is never verified! We cannot be sure the transactionIndex is correct.

  // now verify the logdata
  logs.forEach(l => {
    const receipt = receiptData[l.transactionHash]
    if (!receipt) throw new Error('The receipt ' + l.transactionHash + 'is missing in the proof')

    const logData = receipt[3][toNumber(l.logIndex)]
    if (!logData) throw new Error('Log not found in Transaction')

    if (!logData[0].equals(address(l.address)))
      throw new Error('Wrong address in log ')

    if (logData[1].map(toHex).join() !== l.topics.join())
      throw new Error('Wrong Topics in log ')

    if (!logData[2].equals(bytes(l.data)))
      throw new Error('Wrong data in log ')

    const bp = proof.logProof[toHex(l.blockNumber)]
    if (!bp)
      throw new Error('wrong blockNumber')

    if (!blockHashes[toHex(l.blockNumber)].equals(bytes32(l.blockHash)))
      throw new Error('wrong blockhash')

    if (!bp.receipts[l.transactionHash])
      throw new Error('wrong transactionHash')

    if (toNumber(bp.receipts[l.transactionHash].txIndex) !== toNumber(l.transactionIndex))
      throw new Error('wrong transactionIndex')
  })
}



/** verifies a TransactionProof */
export async function verifyBlockProof(request: RPCRequest, data: string | BlockData, proof: Proof, expectedSigners: Buffer[], cache: Cache) {
  // decode the blockheader
  const block = new Block(proof.block || data)
  if (proof.transactions) block.transactions = proof.transactions.map(createTx)

  let requiredHash: Buffer = null

  if (request.method.endsWith('ByHash'))
    requiredHash = bytes32(request.params[0])
  else if (parseInt(request.params[0]) && toNumber(request.params[0]) !== toNumber(block.number))
    throw new Error('The Block does not contain the required blocknumber')
  if (!requiredHash && request.method.indexOf('Count') < 0 && data)
    requiredHash = bytes32((data as BlockData).hash)

  // verify the blockhash and the signatures
  verifyBlock(block, proof.signatures, expectedSigners, requiredHash, cache)

  // verify the transactions
  if (block.transactions) {
    const trie = new Trie()
    await Promise.all(block.transactions.map((tx, i) =>
      promisify(trie, trie.put, util.rlp.encode(i), tx.serialize())
    ))
    const thash: Buffer = block.transactions.length ? trie.root : util.SHA3_RLP
    if (!thash.equals(block.transactionsTrie))
      throw new Error('The Transactions do not match transactionRoot!')
  }

  if (request.method.indexOf('Count') > 0 && toHex(block.transactions.length) != toHex(data))
    throw new Error('The number of transaction does not match')
}



/** verifies a TransactionProof */
export async function verifyAccountProof(request: RPCRequest, value: string | ServerList, proof: Proof, expectedSigners: Buffer[], cache: Cache) {
  if (!value) throw new Error('No Accountdata!')

  // get the account this proof is based on
  const account = address(request.method === 'in3_nodeList' ? (value as ServerList).contract : request.params[0])

  // verify the blockhash and the signatures
  const block = new Block(proof.block)
  // TODO if we expect a specific block in the request, we should also check if the block is the one requested
  verifyBlock(block, proof.signatures, expectedSigners, null, cache)

  // get the account-proof
  const accountProof = proof.accounts[Object.keys(proof.accounts)[0]]
  if (!accountProof) throw new Error('Missing Account in Account-Proof')

  // verify the result
  if (!account.equals(address(accountProof.address)))
    throw new Error('The Account does not match the account in the proof')
  switch (request.method) {
    case 'eth_getBalance':
      if (!toBN(value).eq(toBN(accountProof.balance))) throw new Error('The Balance does not match the one in the proof')
      break
    case 'eth_getStorageAt':
      checkStorage(accountProof, bytes32(request.params[1]), bytes32(value))
      break
    case 'eth_getCode':
      if (!bytes32(accountProof.codeHash).equals(util.keccak(value))) throw new Error('The codehash in the proof does not match the code')
      break
    case 'eth_getTransactionCount':
      if (!toBN(accountProof.nonce).eq(toBN(value))) throw new Error('The nonce in the proof does not match the returned')
      break
    case 'in3_nodeList':
      verifyNodeListData(value as ServerList, proof, block, request)
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
  checkStorage(accountProof, getStorageArrayKey(0), bytes32(nl.totalServers), 'wrong number of servers ')

  // check blocknumber
  if (toNumber(block.number) < nl.lastBlockNumber)
    throw new Error('The signature is based on older block!')

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
    createRandomIndexes(nl.totalServers, limit, bytes32(request.params[1]), idxs)

    // veryfy the index is in the same order 
    if (idxs.length !== limit)
      throw new Error('wrong number of index')
    idxs.forEach((index, i) => {
      if (nl.nodes[i].index !== index)
        throw new Error('the index of node nr. ' + (i + 1) + ' needs to be ' + index)
    })
  }

  // we got the complete list in the correct order
  else {

    // check server count
    if (nl.nodes.length !== nl.totalServers)
      throw new Error('Wrong number of nodes!')

    // check the index of the result
    const failedNode = nl.nodes.find((n, i) => n.index !== i)
    if (failedNode)
      throw new Error('The node ' + failedNode.url + ' has the wrong index!')
  }

  // verify the values of the proof
  for (const n of nl.nodes) {
    checkStorage(accountProof, getStorageArrayKey(0, n.index, 6, 1), bytes32(n.address), 'wrong owner ')
    // when checking the deposit we have to take into account the fact, that anumber only support 53bits and may not be able to hit the exact ammount, but it should always be equals 
    const deposit = getStorageValue(accountProof, getStorageArrayKey(0, n.index, 6, 2))
    if (parseInt(toBN(deposit).toString()) != parseInt(n.deposit as any))
      throw new Error('wrong deposit ')
    //    checkStorage(accountProof, getStorageArrayKey(0, n.index, 6, 2), bytes32(n.deposit), 'wrong deposit ')
    checkStorage(accountProof, getStorageArrayKey(0, n.index, 6, 3), bytes32(n.props), 'wrong props ')
    const urlKey = getStorageArrayKey(0, n.index, 6, 0)
    const urlVal = getStringValue(getStorageValue(accountProof, urlKey), urlKey)
    if (typeof urlVal === 'string') {
      if (urlVal !== n.url)
        throw new Error('Wrong url in proof ' + n.url)
    }
    else {
      const url = Buffer.concat(urlVal.storageKeys.map(_ => getStorageValue(accountProof, _))).slice(0, urlVal.len).toString('utf8')
      if (url !== n.url)
        throw new Error('Wrong url in proof ' + n.url)
    }
  }
}

function checkStorage(ap: AccountProof, key: Buffer, value: Buffer, msg?: string) {
  if (!getStorageValue(ap, key).equals(value))
    throw new Error(msg + ('The key has the wrong value (expected: ' + toMinHex(value) + ' proven:' + toMinHex(getStorageValue(ap, key))))
}



export function getStorageValue(ap: AccountProof, storageKey: Buffer): Buffer {

  let key = toMinHex(storageKey)
  let entry = ap.storageProof.find(_ => _.key === key)
  if (!entry && key.length % 2) {
    key = '0x0' + key.substr(2)
    entry = ap.storageProof.find(_ => _.key === key)
  }

  if (!entry) throw new Error(' There is no storrage key ' + key + ' in the storage proof!')
  return bytes32(entry.value)
}

/** verifies a TransactionProof */
export async function verifyCallProof(request: RPCRequest, value: Buffer, proof: Proof, expectedSigners: Buffer[], cache: Cache) {

  // verify the blockhash and the signatures
  const block = new Block(proof.block)
  // TODO if we expect a specific block in the request, we should also check if the block is the one requested
  verifyBlock(block, proof.signatures, expectedSigners, null, cache)

  if (!proof.accounts) throw new Error('No Accounts to verify')

  // make sure, we have all codes
  const missingCode = Object.keys(proof.accounts)
  .filter(ac=> !proof.accounts[ac].code && proof.accounts[ac].codeHash !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' )
  
  // in case there are some missing codes, we fetch them with one unproved request through the cache, since they will be verified later anyway.
  if (missingCode.length && cache)
    await cache.getCodeFor(missingCode.map(address), toHex(block.number)).then(_ => _.forEach((c, i) =>
      proof.accounts[missingCode[i]].code = c as any
    ))

  // verify all accounts
  await Promise.all(Object.keys(proof.accounts).map(adr => verifyAccount(proof.accounts[adr], block)))

  // now create a vm and run the transaction
  const result = await executeCall(request.params[0], proof.accounts, new Block({ parentHash: block.parentHash, sha3Uncles: block.uncleHash, miner: block.coinbase, stateRoot: block.stateRoot, transactionsRoot: block.transactionsTrie, receiptRoot: block.receiptTrie, logsBloom: block.bloom, difficulty: block.difficulty, number: block.number, gasLimit: block.gasLimit, gasUsed: block.gasUsed, timestamp: block.timestamp, extraData: block.extra } as any).serializeHeader())

  if (!result.equals(value))
    throw new Error('The result does not match the execution !')

}

/** verify a an account */
async function verifyAccount(accountProof: AccountProof, block: Block) {

  // if we received the code, make sure the codeHash is correct!
  if (accountProof.code && !util.keccak(accountProof.code).equals(bytes32(accountProof.codeHash)))
    throw new Error('The code does not math the correct codehash! ')

  return Promise.all([

    verifyMerkleProof(
      block.stateRoot, // expected merkle root
      util.keccak(accountProof.address), // path, which is the transsactionIndex
      accountProof.accountProof.map(bytes), // array of Buffer with the merkle-proof-data
      isNotExistend(accountProof) ? null : serialize(toAccount(accountProof)),
      'The Account could not be verified'
    ),

    // and all storage proofs
    ...accountProof.storageProof.map(s =>
      verifyMerkleProof(
        bytes32(accountProof.storageHash),   // the storageRoot of the account
        util.keccak(bytes32(s.key)),  // the path, which is the hash of the key
        s.proof.map(bytes), // array of Buffer with the merkle-proof-data
        toNumber(s.value) === 0 ? null : util.rlp.encode(s.value),
        'The Storage could not be verified'
      ))
  ])
}

function isNotExistend(account: AccountProof) {
  // TODO how do I determine the default nonce? It is in the chain-config
  return toNumber(account.balance) === 0 && account.codeHash == '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' && toNumber(account.nonce) === 0
}

function checkBlock(block: string, cache: Cache, blockNumber?: number): any {
  if (!block) return block
  if (typeof block === 'string' && !block.startsWith('0x')) {
    const bh = cache.getBlockHeader(toNumber(block))
    if (!bh) throw new Error('The server returned a not supported blockheader : ' + block)
    return bh
  }
  return block
}

function handleBlockCache(proof: Proof, cache: Cache) {
  if (!cache || !cache.client.defConfig.maxBlockCache) return

  if (proof.block) proof.block = checkBlock(proof.block, cache)
  if (proof.logProof)
    Object.keys(proof.logProof).forEach(bn=>{
      const v = proof.logProof[bn]
      v.block = checkBlock(v.block, cache, toNumber(bn))
    })
}

/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof = true, throwException = true, cache?: Cache): Promise<boolean> {

  // handle verification with implicit proof (like ipfs)
  try {
    if (request.method === 'ipfs_get' && response.result)
      return verifyIPFSHash(response.result, request.params[1] || 'base64', request.params[0])
  }
  catch (ex) {
    if (throwException) throw ex
    return false
  }


  // make sure we only throw an exception for missing proof, if the proof is possible
  const proof = response && response.in3 && response.in3.proof
  if (!proof) {
    if (allowedWithoutProof.indexOf(request.method) >= 0) return true
    // exceptions
    if (request.method === 'eth_getLogs' && response.result && (response.result as any).length === 0) return true
    if (request.method.startsWith('eth_getTransaction') && !response.result) return true
    if (throwException && !allowWithoutProof && !response.error) throw new Error('the response does not contain any proof!')
    return !!response.error  || allowWithoutProof
  }

  // check BlockCache and convert all blockheaders to buffer
  handleBlockCache(proof, cache)

  // convert all signatures into buffer
  const signatures: Buffer[] = request.in3 && request.in3.signatures && request.in3.signatures.map(address)
  try {
    switch (proof.type) {
      case 'transactionProof':
        await verifyTransactionProof(bytes32(request.params[0]), proof, signatures, response.result, cache)
        break
      case 'logProof':
        await verifyLogProof(proof, signatures, response.result && response.result as LogData[], cache)
        break
      case 'receiptProof':
        await verifyTransactionReceiptProof(bytes32(request.params[0]), proof, signatures, response.result && response.result as any, cache)
        break
      case 'blockProof':
        await verifyBlockProof(request, response.result, proof, signatures, cache)
        break
      case 'accountProof':
        await verifyAccountProof(request, response.result as string, proof, signatures, cache)
        break
      case 'callProof':
        await verifyCallProof(request, bytes(response.result), proof, signatures, cache)
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


