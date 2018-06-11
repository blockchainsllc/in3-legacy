import * as ethUtil from 'ethereumjs-util'
import * as Tx from 'ethereumjs-tx'
import { toBuffer, toHex } from './util'

const rlp = ethUtil.rlp
/** Buffer[] of the header */
export type BlockHeader = Buffer[]

/** Buffer[] of the transaction */
export type Transaction = Buffer[]

/** Buffer[] of the Account */
export type Account = Buffer[]

/** Buffer[] of the Receipt */
export type Receipt = [Buffer, Buffer, Buffer, [Buffer, Buffer[], Buffer][]]

export interface BlockData {
  hash: string
  parentHash: string
  sha3Uncles: string
  miner: string
  coinbase?: string
  stateRoot: string
  transactionsRoot: string
  receiptsRoot: string
  receiptRoot?: string
  logsBloom: string
  difficulty: string | number
  number: string | number
  gasLimit: string | number
  gasUsed: string | number
  timestamp: string | number
  extraData: string
  sealFields?: string[]
  mixHash?: string
  nonce?: string | number
  transactions?: any[]
}
export interface TransactionData {
  hash: string
  blockHash?: string
  blockNumber?: number | string
  chainId?: number | string
  condition?: string
  creates?: string
  from?: string
  gas?: number | string
  gasLimit?: number | string
  gasPrice?: number | string
  input: string
  data?: string
  nonce: number | string
  publicKey?: string
  raw?: string
  standardV?: string
  to: string
  transactionIndex: number,
  r?: string
  s?: string
  v?: string
  value: number | string
}

export interface AccountData {
  nonce: string
  balance: string
  storageHash: string
  codeHash: string
  code?: string
}

export interface LogData {
  removed: boolean // true when the log was removed, due to a chain reorganization. false if its a valid log.
  logIndex: string //  integer of the log index position in the block. null when its pending log.
  transactionIndex: string // of the transactions index position log was created from. null when its pending log.
  transactionHash: string // 32 Bytes - hash of the transactions this log was created from. null when its pending log.
  blockHash: string // 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log.
  blockNumber: string // - the block number where this log was in. null when its pending. null when its pending log.
  address: string //, 20 Bytes - address from which this log originated.
  data: string // contains one or more 32 Bytes non-indexed arguments of the log.
  topics: string[] //Array of DATA - Array of 0 to 4 32 Bytes DATA of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier.)
}

export interface ReceiptData {
  transactionIndex?: number
  blockNumber?: string | number
  blockHash?: string
  status?: string | boolean
  root?: string
  cumulativeGasUsed?: string | number
  logsBloom?: string
  logs: LogData[]
}


/** serialize the data  */
export const serialize = (val: Block | Transaction | Receipt | Account) => rlp.encode(val) as Buffer

/** returns the hash of the object */
export const hash = (val: Block | Transaction | Receipt | Account) => ethUtil.rlphash(val) as Buffer


// types ...

/** converts it to a Buffer with 256 bytes length */
export const bytes256 = val => toBuffer(val, 256)
/** converts it to a Buffer with 32 bytes length */
export const bytes32 = val => toBuffer(val, 32)
/** converts it to a Buffer with 8 bytes length */
export const bytes8 = val => toBuffer(val, 8)
/** converts it to a Buffer  */
export const bytes = val => toBuffer(val)
/** converts it to a Buffer with 20 bytes length */
export const address = val => toBuffer(val, 20)
/** converts it to a Buffer with a variable length. 0 = length 0*/
export const uint = val => toBuffer(val, 0)

/** create a Buffer[] from RPC-Response */
export const toBlockHeader = (block: BlockData) => [
  bytes32(block.parentHash),
  bytes32(block.sha3Uncles),
  address(block.miner || block.coinbase),
  bytes32(block.stateRoot),
  bytes32(block.transactionsRoot),
  bytes32(block.receiptsRoot || block.receiptRoot),
  bytes256(block.logsBloom),
  uint(block.difficulty),
  uint(block.number),
  uint(block.gasLimit),
  uint(block.gasUsed),
  uint(block.timestamp),
  bytes(block.extraData),

  ... (block.sealFields
    ? block.sealFields.map(s => rlp.decode(bytes(s)))
    : [
      bytes32(block.mixHash),
      bytes8(block.nonce)
    ]
  )
] as BlockHeader


/** create a Buffer[] from RPC-Response */
export const toTransaction = (tx: TransactionData) => [
  uint(tx.nonce),
  uint(tx.gasPrice),
  uint(tx.gas || tx.gasLimit),
  address(tx.to),
  uint(tx.value),
  bytes(tx.input || tx.data),
  uint(tx.v),
  uint(tx.r),
  uint(tx.s)
] as Transaction


// encode the account
export const toAccount = (account: AccountData) => [
  uint(account.nonce),
  uint(account.balance),
  bytes32(account.storageHash || ethUtil.KECCAK256_RLP),
  bytes32(account.codeHash || ethUtil.KECCAK256_NULL)
] as Account



/** create a Buffer[] from RPC-Response */
export const toReceipt = (r: ReceiptData) => [
  uint(r.status || r.root),
  uint(r.cumulativeGasUsed),
  bytes256(r.logsBloom),
  r.logs.map(l => [
    address(l.address),
    l.topics.map(bytes32),
    bytes(l.data)
  ])
] as Receipt












/**
 * encodes and decodes the blockheader
 */
export class Block {

  /** the raw Buffer fields of the BlockHeader */
  raw: BlockHeader

  /** the transaction-Object (if given) */
  transactions: Tx[]

  get parentHash() { return this.raw[0] }
  get uncleHash() { return this.raw[1] }
  get coinbase() { return this.raw[2] }
  get stateRoot() { return this.raw[3] }
  get transactionsTrie() { return this.raw[4] }
  get receiptTrie() { return this.raw[5] }
  get bloom() { return this.raw[6] }
  get difficulty() { return this.raw[7] }
  get number() { return this.raw[8] }
  get gasLimit() { return this.raw[9] }
  get gasUsed() { return this.raw[10] }
  get timestamp() { return this.raw[11] }
  get extra() { return this.raw[12] }
  get sealedFields() { return this.raw.slice(13) }

  /** creates a Block-Onject from either the block-data as returned from rpc, a buffer or a hex-string of the encoded blockheader */
  constructor(data: Buffer | string | BlockData) {
    if (Buffer.isBuffer(data))
      this.raw = ethUtil.rlp.decode(data)
    else if (typeof data === 'string')
      this.raw = ethUtil.rlp.decode(Buffer.from(data.replace('0x', ''), 'hex'))
    else if (typeof data === 'object') {
      this.raw = toBlockHeader(data)

      if (data.transactions && typeof data.transactions[0] === 'object')
        this.transactions = data.transactions.map(createTx)
    }

  }

  /** the blockhash as buffer */
  hash(): Buffer {
    return hash(this.raw)
  }

  /** the serialized header as buffer */
  serializeHeader(): Buffer {
    return serialize(this.raw)
  }

}

/** creates a Transaction-object from the rpc-transaction-data */
export function createTx(transaction) {
  const txParams = {
    ...transaction,
    nonce: toHex(transaction.nonce) || '0x00',
    gasPrice: toHex(transaction.gasPrice) || '0x00',
    value: toHex(transaction.value || 0),
    gasLimit: toHex(transaction.gasLimit === undefined ? transaction.gas : transaction.gasLimit),
    data: toHex(transaction.gasLimit === undefined ? transaction.input : transaction.data),
    to: transaction.to ? ethUtil.setLengthLeft(ethUtil.toBuffer(transaction.to), 20) : null,
    v: transaction.v < 27 ? transaction.v + 27 : transaction.v
  }
  const fromAddress = ethUtil.toBuffer(txParams.from)
  delete txParams.from
  const tx = new Tx(txParams)
  tx._from = fromAddress
  tx.getSenderAddress = function () { return fromAddress }
  if (txParams.hash && txParams.hash !== '0x' + ethUtil.sha3(tx.serialize()).toString('hex'))
    throw new Error('wrong txhash! : ' + (txParams.hash + '!== 0x' + ethUtil.sha3(tx.serialize()).toString('hex')) + '  full tx=' + tx.serialize().toString('hex'))

  // override hash
  const txHash = ethUtil.toBuffer(txParams.hash)
  if (txParams.hash)
    tx.hash = function () { return txHash }
  return tx
}


/** converts blockdata to a hexstring*/
export function blockToHex(block: any) {
  return toHex(new Block(block).serializeHeader())
}

/** converts a hexstring to a block-object */
export function blockFromHex(hex: string) {
  return new Block(hex)
}




