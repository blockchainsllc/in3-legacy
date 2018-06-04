import * as ethUtil from 'ethereumjs-util'
import * as Tx from 'ethereumjs-tx'
import * as Trie from 'merkle-patricia-tree'
import * as Transaction from 'ethereumjs-tx'

const BN = ethUtil.BN
const rlp = ethUtil.rlp

export interface BlockData {
  hash: string
  parentHash: string
  sha3Uncles: string
  miner: string
  stateRoot: string
  transactionsRoot: string
  receiptsRoot: string
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

/**
 * encodes and decodes the blockheader
 */
export default class Block {

  /** the raw Buffer fields of the BlockHeader */
  raw: Buffer[]

  /** the transaction-Object (if given) */
  transactions: Transaction[]

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
  constructor(data: any) {
    this.raw = []
    if (Buffer.isBuffer(data))
      this.raw = ethUtil.rlp.decode(data)
    else if (typeof data === 'string')
      this.raw = ethUtil.rlp.decode(Buffer.from(data.replace('0x', ''), 'hex'))
    else if (typeof data === 'object') {
      ['parentHash:32', 'sha3Uncles', 'miner,coinbase:20', 'stateRoot:32', 'transactionsRoot:32', 'receiptsRoot,receiptRoot', 'logsBloom', 'difficulty', 'number', 'gasLimit', 'gasUsed', 'timestamp', 'extraData:-1'].forEach(field => {
        this.raw.push(toBuffer(field.split(':')[0].split(',').map(_ => data[_]).find(_ => _) || ethUtil.SHA3_NULL, parseInt(field.split(':')[1] || '0')))
      })
      if (data.sealFields && data.sealFields.length)
        data.sealFields.forEach(s => this.raw.push(rlp.decode(toBuffer(s))))
      else {
        if (data.mixHash !== undefined)
          this.raw.push(toBuffer(data.mixHash))
        if (data.nonce !== undefined)
          this.raw.push(toBuffer(data.nonce, 8))
      }

      if (data.transactions && typeof data.transactions[0] === 'object')
        this.transactions = data.transactions.map(createTx)

    }

  }

  /** the blockhash as buffer */
  hash(): Buffer {
    return ethUtil.rlphash(this.raw)
  }

  /** the serialized header as buffer */
  serializeHeader(): Buffer {
    return ethUtil.rlp.encode(this.raw)
  }

}

/** converts any value as hex-string */
export function toHex(val: any, bytes?: number): string {
  if (val === undefined) return undefined
  let hex: string
  if (typeof val === 'string')
    hex = val.startsWith('0x') ? val.substr(2) : new BN(val).toString(16)
  else if (typeof val === 'number')
    hex = val.toString(16)
  else if (BN.isBN(val))
    hex = val.toString(16)
  else
    hex = ethUtil.bufferToHex(val).substr(2)
  if (bytes)
    hex = hex.padStart(bytes * 2, '0')
  if (hex.length % 2)
    hex = '0' + hex
  return '0x' + hex.toLowerCase()
}


/** converts any value as Buffer */
export function toBuffer(val, len = -1) {
  if (typeof val == 'string')
    val = val.startsWith('0x') ? Buffer.from((val.length % 2 ? '0' : '') + val.substr(2), 'hex') : new BN(val).toBuffer()
  if (typeof val == 'number')
    val = Buffer.from(fixLength(val.toString(16)), 'hex')

  if (len == 0 && val.toString('hex') === '00')
    return Buffer.allocUnsafe(0)
  if (len > 0 && Buffer.isBuffer(val) && val.length < len)
    val = Buffer.concat([Buffer.alloc(len - val.length), val])

  return val as Buffer

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
  const tx = new Transaction(txParams)
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

// encode the account
export function serializeAccount(nonce: string, balance: string, storageHash: string, codeHash: string): Buffer {
  return rlp.encode([
    nonce || '0x00',
    balance || '0x00',
    storageHash || '0x' + ethUtil.KECCAK256_RLP_S,
    codeHash || '0x' + ethUtil.KECCAK256_NULL_S
  ].map(toVariableBuffer))
}

export function serializeReceipt(txReceipt: any) {
  return rlp.encode([
    toBuffer(txReceipt.status || txReceipt.root),
    toBuffer(txReceipt.cumulativeGasUsed),
    toBuffer(txReceipt.logsBloom),
    txReceipt.logs.map(l => [l.address, l.topics.map(toBuffer), l.data].map(toBuffer))]
  )
}

// converts a string into a Buffer, but treating 0x00 as empty Buffer
const fixLength = (hex: string) => hex.length % 2 ? '0' + hex : hex
const toVariableBuffer = (val: string) => (val == '0x' || val === '0x0' || val === '0x00') ? Buffer.alloc(0) : ethUtil.toBuffer(val) as Buffer

export function promisify(self, fn, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    fn.apply(self, [...args, (err, res) => {
      if (err)
        reject(err)
      else
        resolve(res)
    }])
  })
}