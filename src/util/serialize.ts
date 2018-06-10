import * as ethUtil from 'ethereumjs-util'
import * as Tx from 'ethereumjs-tx'
import { toBuffer, toHex, toVariableBuffer } from './util'

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

export const Bytes256 = val => toBuffer(val, 256)
export const Bytes32 = val => toBuffer(val, 32)
export const Bytes8 = val => toBuffer(val, 8)
export const Bytes = val => toBuffer(val)
export const Address = val => toBuffer(val, 20)
export const UInt = val => toBuffer(val, 0)

/** create a Buffer[] from RPC-Response */
export const toBlockHeader = (block: BlockData) => [
  Bytes32(block.parentHash),
  Bytes32(block.sha3Uncles),
  Address(block.miner || block.coinbase),
  Bytes32(block.stateRoot),
  Bytes32(block.transactionsRoot),
  Bytes32(block.receiptsRoot || block.receiptRoot),
  Bytes256(block.logsBloom),
  UInt(block.difficulty),
  UInt(block.number),
  UInt(block.gasLimit),
  UInt(block.gasUsed),
  UInt(block.timestamp),
  Bytes(block.extraData),

  ... (block.sealFields
    ? block.sealFields.map(s => rlp.decode(toBuffer(s)))
    : [
      Bytes32(block.mixHash),
      Bytes8(block.nonce)
    ]
  )
] as BlockHeader


/** create a Buffer[] from RPC-Response */
export const toTransaction = (tx: TransactionData) => [
  UInt(tx.nonce),
  UInt(tx.gasPrice),
  UInt(tx.gas || tx.gasLimit),
  UInt(tx.value),
  Bytes(tx.input || tx.data),
  UInt(tx.v),
  UInt(tx.r),
  UInt(tx.s)
] as Transaction


// encode the account
export const toAccount = (account: AccountData) => [
  UInt(account.nonce),
  UInt(account.balance),
  Bytes32(account.storageHash || ethUtil.KECCAK256_RLP),
  Bytes32(account.codeHash || ethUtil.KECCAK256_NULL)
] as Account



/** create a Buffer[] from RPC-Response */
export const toReceipt = (r: ReceiptData) => [
  UInt(r.status || r.root),
  UInt(r.cumulativeGasUsed),
  Bytes256(r.logsBloom),
  r.logs.map(l => [
    Address(l.address),
    l.topics.map(Bytes32),
    Bytes(l.data)
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




