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

import EthChainContext from './EthChainContext'
import * as util from 'ethereumjs-util'
import { AccountProof, Proof, RPCRequest, RPCResponse, ServerList, Signature, ChainSpec } from '../../types/types';
import { BlockData, Block, createTx, blockFromHex, toAccount, toReceipt, hash, serialize, LogData, bytes32, bytes8, uint, address, bytes, Receipt, TransactionData, toTransaction, ReceiptData, Transaction, rlp, uint64 } from './serialize';
import { toHex, toNumber, promisify, toMinHex, toBN, toBuffer } from '../../util/util'
import { executeCall } from './call'
import { createRandomIndexes } from '../../client/serverList'
import verifyMerkleProof from '../../util/merkleProof'
import { getStorageArrayKey, getStringValue } from './storage'
import * as Trie from 'merkle-patricia-tree'
import * as ethUtil from 'ethereumjs-util'
import ChainContext from '../../client/ChainContext'
import { verifyIPFSHash } from '../ipfs/ipfs'
import { checkBlockSignatures, getChainSpec } from './header'
import { BlackListError } from '../../client/Client'
import * as BN from 'bn.js'

// these method are accepted without proof
const allowedWithoutProof = ['ipfs_get', 'ipfs_put', 'eth_blockNumber', 'web3_clientVersion', 'web3_sha3', 'net_version', 'net_peerCount', 'net_listening', 'eth_protocolVersion', 'eth_syncing', 'eth_coinbase', 'eth_mining', 'eth_hashrate', 'eth_gasPrice', 'eth_accounts', 'eth_sign', 'eth_sendRawTransaction', 'eth_estimateGas', 'eth_getCompilers', 'eth_compileLLL', 'eth_compileSolidity', 'eth_compileSerpent', 'eth_getWork', 'eth_submitWork', 'eth_submitHashrate']
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

export interface BlockHeaderProof {
  finality?: number
  proof: Proof
  expectedSigners?: Buffer[]
  expectedBlockHash?: Buffer
}

/** verify the signatures of a blockhash */
export async function verifyBlock(b: Block, proof: BlockHeaderProof, ctx: ChainContext) {

  // calculate the blockHash
  const blockHash = b.hash()
  if (proof.expectedBlockHash && !blockHash.equals(proof.expectedBlockHash))
    throw new Error('The BlockHash is not the expected one!')

  // if we don't expect signatures
  if (!proof.expectedSigners || proof.expectedSigners.length === 0) {

    // for proof of authorities we can verify the signatures
    if (ctx && ctx.chainSpec && (ctx.chainSpec.engine === 'authorityRound' || ctx.chainSpec.engine === 'clique')) {
      const finality = await checkBlockSignatures([b, ...(proof.proof && proof.proof.finalityBlocks || [])], _ => getChainSpec(_, ctx))
      if (proof.finality && proof.finality > finality)
        throw new Error('we have only a finality of ' + finality + ' but expected was ' + proof.finality)
    }
    // no expected signatures - no need to verify here
    return
  }

  // we are not allowing block verification without signature
  if (!proof.proof.signatures) throw new Error('No signatures found ')

  const existing = ctx && ctx instanceof EthChainContext && ctx.getBlockHeaderByHash(blockHash)

  // filter valid signatures for the current block
  const signaturesForBlock = proof.proof.signatures.filter(_ => _ && toNumber(_.block) === toNumber(b.number) && (!_.blockHash || blockHash.equals(bytes32(_.blockHash))))
  if (signaturesForBlock.length === 0) {
    // if the blockhash is already verified, we don't need a signature
    if (existing) return

    throw new BlackListError('No signatures found for block ', proof.expectedSigners.map(_ => ethUtil.toChecksumAddress(toHex(_))))
  }


  // verify the signatures for only the blocks matching the given
  const messageHash: Buffer = util.keccak(Buffer.concat([blockHash, bytes32(b.number)]))
  if (!signaturesForBlock.reduce((p, signature, i) => {

    if (!messageHash.equals(bytes32(signature.msgHash)))
      throw new BlackListError('The signature signed the wrong message!', proof.expectedSigners.map(_ => ethUtil.toChecksumAddress(toHex(_))))

    // recover the signer from the signature
    const signer: Buffer = util.pubToAddress(util.ecrecover(messageHash, toNumber(signature.v), bytes(signature.r), bytes(signature.s)))

    // make sure the signer is the expected one
    if (!signer.equals(proof.expectedSigners[i]))
      throw new Error('The signature was not signed by ' + proof.expectedSigners[i])

    // we have at least one valid signature, so we can try to cache it.
    if (ctx && ctx instanceof EthChainContext && ctx.client.defConfig.maxBlockCache)
      ctx.addBlockHeader(toNumber(b.number), b.serializeHeader())

    // looks good ;-)
    return true
  }, true))
    throw new Error('No valid signature')
}



/** verifies a TransactionProof */
export async function verifyTransactionProof(txHash: Buffer, headerProof: BlockHeaderProof, txData: TransactionData, ctx: ChainContext) {

  if (!txData) throw new Error('No TransactionData!')

  // decode the blockheader
  const block = blockFromHex(headerProof.proof.block)

  // verify the blockhash and the signatures
  await verifyBlock(block, { ...headerProof, expectedBlockHash: bytes32(txData.blockHash) }, ctx)

  verifyTransaction(txData)

  const tx = toTransaction(txData)
  const txHashofData = hash(tx)

  if (toNumber(block.number) != toNumber(txData.blockNumber)) throw new Error('invalid blockNumber')
  if (!bytes32(txData.hash).equals(txHashofData)) throw new Error('invalid txhash')
  if (headerProof.proof.txIndex != toNumber(txData.transactionIndex)) throw new Error('invalid txIndex')

  if (!txHashofData.equals(txHash))
    throw new Error('The transactiondata were manipulated')

  // verifiy the proof
  await verifyMerkleProof(
    block.transactionsTrie, // expected merkle root
    util.rlp.encode(toNumber(headerProof.proof.txIndex)), // path, which is the transsactionIndex
    headerProof.proof.merkleProof.map(bytes), // array of Buffer with the merkle-proof-data
    serialize(tx),
    'The Transaction can not be verified'
  )
}

/** verifies a TransactionProof */
export async function verifyTransactionByBlockProof(request: RPCRequest, headerProof: BlockHeaderProof, txData: TransactionData, ctx: ChainContext) {

  // decode the blockheader
  const block = blockFromHex(headerProof.proof.block)

  const txIndex = bytes32(request.params[1])

  if (!txData) {
    await verifyMerkleProof(
      block.transactionsTrie, // expected merkle root
      util.rlp.encode(toNumber(txIndex)), // path, which is the transsactionIndex
      headerProof.proof.merkleProof.map(bytes), // array of Buffer with the merkle-proof-data
      null,
      'The Transaction can not be verified'
    )
  }
  else {
    // verify the blockhash and the signatures
    verifyTransaction(txData)

    const tx = toTransaction(txData)
    const txHashofData = hash(tx)

    if (request.method == "eth_getTransactionByBlockHashAndIndex") {
      if (!bytes32(txData.blockHash).equals(bytes32(request.params[0])))
        throw new Error('invalid blockHash in transaction data')
      await verifyBlock(block, { ...headerProof, expectedBlockHash: bytes32(request.params[0]) }, ctx)
    }
    else if (request.method == "eth_getTransactionByBlockNumberAndIndex") {
      if (toNumber(bytes32(request.params[0])) != toNumber(block.number))
        throw new Error('invalid blockNumber in request')
      await verifyBlock(block, { ...headerProof, expectedBlockHash: bytes32(txData.blockHash) }, ctx)
    }

    if (toNumber(block.number) != toNumber(txData.blockNumber)) throw new Error('invalid blockNumber')
    if (!bytes32(txData.hash).equals(txHashofData)) throw new Error('invalid txhash')
    if (toNumber(txIndex) != toNumber(headerProof.proof.txIndex)) throw new Error('invalid txIndex in request')
    if (toNumber(txIndex) != toNumber(txData.transactionIndex)) throw new Error('invalid txIndex in transaction data')

    // verifiy the proof
    await verifyMerkleProof(
      block.transactionsTrie, // expected merkle root
      util.rlp.encode(toNumber(txIndex)), // path, which is the transsactionIndex
      headerProof.proof.merkleProof.map(bytes), // array of Buffer with the merkle-proof-data
      serialize(tx),
      'The Transaction can not be verified'
    )
  }

}

function verifyLog(l: LogData, block: Block, blockHash: string, index: number, txIndex: number, txHash: string) {
  if (l.blockHash !== blockHash) throw new Error('invalid blockhash')
  if (toNumber(l.blockNumber) !== toNumber(block.number)) throw new Error('invalid blocknumber')
  if (toNumber(l.logIndex) !== index) throw new Error('invalid logIndex')
  if (l.transactionHash != txHash) throw new Error('invalid txHash')
  if (toNumber(l.transactionIndex) != txIndex) throw new Error('invalid txIndex')

}

/** verifies a TransactionProof */
export async function verifyTransactionReceiptProof(txHash: Buffer, headerProof: BlockHeaderProof, receipt: ReceiptData, ctx: ChainContext, useFullProof: boolean) {

  if (!receipt) throw new Error('No ReceiptData!')
  if (useFullProof && headerProof.proof.txIndex > 0 && !headerProof.proof.merkleProofPrev)
    throw new Error('For Fullproof we expect the merkleProofPrev, which is missing!')

  // decode the blockheader
  const block = blockFromHex(headerProof.proof.block)

  // verify the blockhash and the signatures
  await verifyBlock(block, { ...headerProof, expectedBlockHash: bytes32(receipt.blockHash) }, ctx)

  if (headerProof.proof.txIndex === 0 && receipt.cumulativeGasUsed !== receipt.gasUsed)
    throw new Error('gasUsed must match cumulativeGasUsed')

  // since the blockhash is verified, we have the correct transaction root
  // we use the txIndex, so only if both (the transaction matches the hash and ther receiptproof is verified, we know it is the right receipt)

  if (toNumber(receipt.blockNumber) != toNumber(block.number)) throw new Error('Invalid BlockNumber')
  if (!bytes32(receipt.transactionHash).equals(txHash)) throw new Error('Invalid txHash')
  if (toNumber(receipt.transactionIndex) !== headerProof.proof.txIndex) throw new Error('Invalid txIndex')

  // make sure the data in the receipts are correct
  receipt.logs.forEach((t, i) => verifyLog(t, block, receipt.blockHash, i, toNumber(receipt.transactionIndex), receipt.transactionHash))

  // verifiy the proof
  return Promise.all([
    verifyMerkleProof(
      block.receiptTrie, // expected merkle root
      util.rlp.encode(toNumber(headerProof.proof.txIndex)), // path, which is the transsactionIndex
      headerProof.proof.merkleProof.map(bytes), // array of Buffer with the merkle-proof-data
      serialize(toReceipt(receipt)),
      'The TransactionReceipt can not be verified'
    ),
    // prev
    useFullProof && headerProof.proof.txIndex > 0 && verifyMerkleProof(
      block.receiptTrie, // expected merkle root
      util.rlp.encode(toNumber(headerProof.proof.txIndex - 1)), // path, which is the transsactionIndex
      headerProof.proof.merkleProof.map(bytes), undefined)
      .then(r => {
        const prevReceipt = rlp.decode(r) as Buffer
        const gasUsed = toNumber(receipt.cumulativeGasUsed) - toNumber(prevReceipt[prevReceipt.length - 3])
        if (toNumber(receipt.gasUsed) != gasUsed)
          throw new Error('The Transaction did consumed ' + gasUsed)
      })
    ,
    verifyMerkleProof(
      block.transactionsTrie, // expected merkle root
      util.rlp.encode(toNumber(headerProof.proof.txIndex)), // path, which is the transsactionIndex
      headerProof.proof.txProof.map(bytes), // array of Buffer with the merkle-proof-data
      undefined,
      'The TransactionIndex can not be verified'
    ).then(val => {
      if (!hash(val).equals(txHash))
        throw new Error('The TransactionHash does not match the prooved one')
    })
  ])


}



/** verifies a TransactionProof */
export async function verifyLogProof(headerProof: BlockHeaderProof, logs: LogData[], ctx: ChainContext) {

  if (!logs) throw new Error('No Logs!')
  if (!logs.length) return

  if (!headerProof.proof.logProof) throw new Error('Missing LogProof')

  const receiptData: { [txHash: string]: Receipt } = {}
  const blockHashes: { [blockNumber: string]: Buffer } = {}

  await Promise.all(Object.keys(headerProof.proof.logProof).map(async bn => {

    const blockProof = headerProof.proof.logProof[bn]

    // decode the blockheader
    const block = blockFromHex(blockProof.block)
    blockHashes[bn] = block.hash()

    if (toHex(blockProof.number) !== bn) throw new Error('wrong blocknumber')

    // verify the blockhash and the signatures
    await verifyBlock(block, headerProof, ctx)

    // verifiy all merkle-Trees of the receipts
    await Promise.all(Object.keys(blockProof.receipts).map(txHash =>
      verifyMerkleProof(
        block.receiptTrie, // expected merkle root
        util.rlp.encode(blockProof.receipts[txHash].txIndex), // path, which is the transsactionIndex
        blockProof.receipts[txHash].proof.map(bytes), // array of Buffer with the merkle-proof-data
        undefined // we don't want to check, but use the found value in the next step
      ).then(value => receiptData[txHash] = util.rlp.decode(value) as any)
    )),
      // verifiy all merkle-Trees of the receipts
      await Promise.all(Object.keys(blockProof.receipts).map(txHash =>
        verifyMerkleProof(
          block.transactionsTrie, // expected merkle root
          util.rlp.encode(blockProof.receipts[txHash].txIndex), // path, which is the transsactionIndex
          blockProof.receipts[txHash].txProof.map(bytes), // array of Buffer with the merkle-proof-data
          undefined // we don't want to check, but use the found value in the next step
        ).then(value => bytes32(txHash).equals(hash(value)) && bytes32(txHash).equals(bytes32(blockProof.receipts[txHash].txHash)) || Promise.reject(new Error('wrong txhash')))
      ))
  }))

  // now verify the logdata
  logs.forEach(l => {
    const receipt = receiptData[l.transactionHash]
    if (!receipt) throw new Error('The receipt ' + l.transactionHash + 'is missing in the proof')

    const logData = receipt[3][toNumber(l.transactionLogIndex)]
    if (!logData) throw new Error('Log not found in Transaction')

    if (!logData[0].equals(address(l.address)))
      throw new Error('Wrong address in log ')

    if (logData[1].map(toHex).join() !== l.topics.join())
      throw new Error('Wrong Topics in log ')

    if (!logData[2].equals(bytes(l.data)))
      throw new Error('Wrong data in log ')

    const bp = headerProof.proof.logProof[toHex(l.blockNumber)]
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
export async function verifyBlockProof(request: RPCRequest, data: string | BlockData, headerProof: BlockHeaderProof, ctx: ChainContext) {
  // decode the blockheader
  const block = new Block(headerProof.proof.block || data)
  if (headerProof.proof.transactions) block.transactions = headerProof.proof.transactions.map(createTx)

  let requiredHash: Buffer = null

  if (request.method.endsWith('ByHash'))
    requiredHash = bytes32(request.params[0])
  else if (parseInt(request.params[0]) && toNumber(request.params[0]) !== toNumber(block.number))
    throw new Error('The Block does not contain the required blocknumber')
  if (!requiredHash && request.method.indexOf('Count') < 0 && data)
    requiredHash = bytes32((data as BlockData).hash)

  // we only need to verify the uncles, if they are actually part of the data
  if (data && (data as BlockData).uncles) {
    const bd = data as BlockData

    if (bd.uncles.length === 0) {
      if (!bytes32(bd.sha3Uncles).equals(bytes('0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347')))
        throw new Error('Wrong uncle-hash')
    }
    else if (request.in3.useFullProof) {
      if (!headerProof.proof.uncles || headerProof.proof.uncles.length != bd.uncles.length)
        throw new Error('The Uncles are missing or wrong size!')

      // we only verify uncles for full proof
      const trie = new Trie()
      await Promise.all(headerProof.proof.uncles.map((b, i) => {
        const header = toBuffer(b)
        if (!hash(header).equals(toBuffer(bd.uncles[i])))
          throw new Error('The uncle hash of uncle ' + i + ' is wrong')
        return promisify(trie, trie.put, util.rlp.encode(i), header)
      }))
      if (!trie.root.equals(block.uncleHash))
        throw new Error('The UncleRoot do not match uncles!')
    }
  }

  // verify the blockhash and the signatures
  await verifyBlock(block, { ...headerProof, expectedBlockHash: requiredHash }, ctx)

  // verify additional fields
  if (data && request.method.indexOf('Count') < 0) {
    const bd: BlockData = data as BlockData
    const d = data as any
    if (d.author && d.author !== bd.miner) throw new Error('Invalid author')
    if (d.hash && !bytes32(d.hash).equals(requiredHash || block.hash())) throw new Error('Invalid hash')
    if (d.mixHash && !bytes32(d.mixHash).equals(block.sealedFields[0])) throw new Error('Invalid mixHash')
    if (d.nonce && !bytes8(d.nonce).equals(block.sealedFields[1])) throw new Error('Invalid nonce')
  }

  // verify the transactions
  if (block.transactions) {
    const trie = new Trie()
    await Promise.all(block.transactions.map((tx, i) =>
      promisify(trie, trie.put, util.rlp.encode(i), tx.serialize())
    ))
    const thash: Buffer = block.transactions.length ? trie.root : util.KECCAK256_RLP
    if (!thash.equals(block.transactionsTrie))
      throw new Error('The Transactions do not match transactionRoot!')
  }

  if (data && (data as any).transactions) {
    const rtransactions = (data as any).transactions as any[]
    if (rtransactions.length != block.transactions.length) throw new Error('wrong number of transactions in block')
    if (request.params.length == 2 && request.params[1])
      rtransactions.forEach((t: TransactionData, i: number) => {
        if (t.blockHash && !bytes32(t.blockHash).equals(requiredHash || block.hash())) throw new Error('Invalid hash in tx')
        if (t.blockNumber && toNumber(t.blockNumber) != toNumber(block.number)) throw new Error('Invalid blocknumber')
        if (toNumber(t.transactionIndex) != i) throw new Error('Wrong transactionIndex')
        verifyTransaction(t)
      })
    else
      rtransactions.forEach((t: string, i: number) => {
        if (!block.transactions[i].hash().equals(bytes32(t))) throw new Error('Invalid TransactionHash')
      })
  }

  if (request.method.indexOf('Count') > 0 && toHex(block.transactions.length) != toHex(data))
    throw new Error('The number of transaction does not match')
}

export function verifyTransaction(t: TransactionData) {
  const raw = toTransaction(t)
  let rawHash: Buffer, v = ethUtil.bufferToInt(bytes(t.v))
  if (t.chainId) {  // use  EIP155 spec
    rawHash = hash([...raw.slice(0, 6), uint(t.chainId), Buffer.allocUnsafe(0), Buffer.allocUnsafe(0)])
    v -= toNumber(t.chainId) * 2 + 8
  }
  else
    rawHash = hash(raw.slice(0, 6))

  if (new BN(t.s).cmp(N_DIV_2) === 1) throw new Error('Invalid signature')
  const senderPubKey = ethUtil.ecrecover(rawHash, v, bytes(t.r), bytes(t.s))
  if (!bytes(t.publicKey).equals(senderPubKey)) throw new Error('Invalid public key')
  if (!address(t.from).equals(ethUtil.publicToAddress(senderPubKey))) throw new Error('Invalid from')
  if (t.raw && !bytes(t.raw).equals(ethUtil.rlp.encode(raw))) throw new Error('Invalid Raw data')
  if (t.standardV && toNumber(t.standardV) != v - 27) throw new Error('Invalid stanardV ')
}

/** verifies a TransactionProof */
export async function verifyAccountProof(request: RPCRequest, value: string | ServerList, headerProof: BlockHeaderProof, ctx: ChainContext) {
  if (!value) throw new Error('No Accountdata!')

  // get the account this proof is based on
  const account = address(request.method === 'in3_nodeList' ? (value as ServerList).contract : request.params[0])

  // verify the blockhash and the signatures
  const block = new Block(headerProof.proof.block)
  // TODO if we expect a specific block in the request, we should also check if the block is the one requested
  await verifyBlock(block, headerProof, ctx)

  // get the account-proof
  const accountProof = headerProof.proof.accounts[Object.keys(headerProof.proof.accounts)[0]]
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
      verifyNodeListData(value as ServerList, headerProof.proof, block, request)
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
    checkStorage(accountProof, getStorageArrayKey(0, n.index, 6, 1), bytes32(Buffer.concat([uint64(n.timeout ? n.timeout : 0), address(n.address)])), 'wrong owner ')
    // when checking the deposit we have to take into account the fact, that anumber only support 53bits and may not be able to hit the exact ammount, but it should always be equals
    const deposit = getStorageValue(accountProof, getStorageArrayKey(0, n.index, 6, 2))
    if (parseInt(toBN(deposit).toString()) != parseInt(n.deposit as any))
      throw new Error('wrong deposit ')
    //    checkStorage(accountProof, getStorageArrayKey(0, n.index, 6, 2), bytes32(n.deposit), 'wrong deposit ')
    const props: Buffer = bytes32(n.props)
    if (n.capacity) props.writeUInt32BE(n.capacity, 12)
    checkStorage(accountProof, getStorageArrayKey(0, n.index, 6, 3), props, 'wrong props ')
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
export async function verifyCallProof(request: RPCRequest, value: Buffer, headerProof: BlockHeaderProof, ctx: ChainContext) {

  // verify the blockhash and the signatures
  const block = new Block(headerProof.proof.block)
  // TODO if we expect a specific block in the request, we should also check if the block is the one requested
  await verifyBlock(block, headerProof, ctx)

  if (!headerProof.proof.accounts) throw new Error('No Accounts to verify')

  // make sure, we have all codes
  const missingCode = Object.keys(headerProof.proof.accounts)
    .filter(ac => !headerProof.proof.accounts[ac].code && headerProof.proof.accounts[ac].codeHash !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')

  // in case there are some missing codes, we fetch them with one unproved request through the cache, since they will be verified later anyway.
  if (missingCode.length && ctx && ctx instanceof EthChainContext)
    await ctx.getCodeFor(missingCode.map(address), toHex(block.number)).then(_ => _.forEach((c, i) =>
      headerProof.proof.accounts[missingCode[i]].code = c as any
    ))

  // verify all accounts
  await Promise.all(Object.keys(headerProof.proof.accounts).map(adr => verifyAccount(headerProof.proof.accounts[adr], block)))

  // now create a vm and run the transaction
  const result = await executeCall(request.params[0], headerProof.proof.accounts, new Block({ parentHash: block.parentHash, sha3Uncles: block.uncleHash, miner: block.coinbase, stateRoot: block.stateRoot, transactionsRoot: block.transactionsTrie, receiptRoot: block.receiptTrie, logsBloom: block.bloom, difficulty: block.difficulty, number: block.number, gasLimit: block.gasLimit, gasUsed: block.gasUsed, timestamp: block.timestamp, extraData: block.extra } as any).serializeHeader())

  if (!result.equals(value))
    throw new Error('The result does not match the execution !')

}

/** verify a an account */
async function verifyAccount(accountProof: AccountProof, block: Block) {

  // if we received the code, make sure the codeHash is correct!
  if (accountProof.code && !util.keccak(accountProof.code).equals(bytes32(accountProof.codeHash)))
    throw new Error('The code does not math the correct codehash! ')

  const emptyAccount = isNotExistend(accountProof)
  if (emptyAccount && accountProof.storageHash !== '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421') throw new Error('Invalid storageHash')

  return Promise.all([

    verifyMerkleProof(
      block.stateRoot, // expected merkle root
      util.keccak(accountProof.address), // path, which is the transsactionIndex
      accountProof.accountProof.map(bytes), // array of Buffer with the merkle-proof-data
      emptyAccount ? null : serialize(toAccount(accountProof)),
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

function checkBlock(block: string, ctx: ChainContext, blockNumber?: number): any {
  if (!block) return block
  if (typeof block === 'string' && !block.startsWith('0x') && ctx instanceof EthChainContext) {
    const bh = ctx.getBlockHeader(toNumber(block))
    if (!bh) throw new Error('The server returned a not supported blockheader : ' + block)
    return bh
  }
  return block
}

function handleBlockCache(proof: Proof, ctx: ChainContext) {
  if (!ctx || !ctx.client.defConfig.maxBlockCache) return

  if (proof.block) proof.block = checkBlock(proof.block, ctx)
  if (proof.logProof)
    Object.keys(proof.logProof).forEach(bn => {
      const v = proof.logProof[bn]
      v.block = checkBlock(v.block, ctx, toNumber(bn))
    })
}

/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof = true, ctx?: ChainContext): Promise<boolean> {


  // make sure we ignore errors caused by sending a trnasaction to multiple servers.
  if (request.method === 'eth_sendRawTransaction' && response.error && ((response.error as any).code === -32010 || response.error.toString().indexOf('already imported') >= 0)) {
    delete response.error
    response.result = toHex(hash(bytes(request.params[0])), 20)
  }


  // handle verification with implicit proof (like ipfs)
  if (request.method === 'ipfs_get' && response.result)
    return verifyIPFSHash(response.result, request.params[1] || 'base64', request.params[0])

  // make sure we only throw an exception for missing proof, if the proof is possible
  const proof = response && response.in3 && response.in3.proof
  if (!proof) {
    if (allowedWithoutProof.indexOf(request.method) >= 0) return true
    // exceptions
    if (request.method === 'eth_getLogs' && response.result && (response.result as any).length === 0) return true
    if (request.method.startsWith('eth_getTransaction') && !response.result) return true
    if (!allowWithoutProof && !response.error) throw new Error('the response does not contain any proof!')
    return !!response.error || allowWithoutProof
  }

  // check BlockCache and convert all blockheaders to buffer
  handleBlockCache(proof, ctx)

  // convert all signatures into buffer
  const headerProof: BlockHeaderProof = { proof, expectedSigners: request.in3 && request.in3.signatures && request.in3.signatures.map(address), finality: request.in3 && request.in3.finality }

  switch (proof.type) {
    case 'transactionProof':
      if (request.method == "eth_getTransactionByBlockHashAndIndex" || request.method == "eth_getTransactionByBlockNumberAndIndex")
        await verifyTransactionByBlockProof(request, headerProof, response.result, ctx)
      else
        await verifyTransactionProof(bytes32(request.params[0]), headerProof, response.result, ctx)
      break
    case 'logProof':
      await verifyLogProof(headerProof, response.result && response.result as LogData[], ctx)
      break
    case 'receiptProof':
      await verifyTransactionReceiptProof(bytes32(request.params[0]), headerProof, response.result && response.result as any, ctx, request.in3.useFullProof)
      break
    case 'blockProof':
      await verifyBlockProof(request, response.result, headerProof, ctx)
      break
    case 'accountProof':
      await verifyAccountProof(request, response.result as string, headerProof, ctx)
      break
    case 'callProof':
      await verifyCallProof(request, bytes(response.result), headerProof, ctx)
      break
    default:
      throw new Error('Unsupported proof-type : ' + proof.type)
  }
  return true
}
