import Client from './Client'
import { address, bytes, hash, rlp, serialize } from '../util/serialize';
import { toHex } from '../util/util'
import { RPCRequest, RPCResponse } from '../types/types'
import { sha3 } from 'ethereumjs-util'
const Buffer: any = require('buffer').Buffer


export default class Cache {
  client: Client

  codeCache: CacheNode
  blockCache: { number: number, header: Buffer, hash: Buffer }[]

  constructor(client: Client) {
    this.client = client
    this.codeCache = new CacheNode(client.defConfig.maxCodeCache || 50000)
    this.blockCache = []
    // if we are running in the browser we use to localStorage as cache
    if (client.defConfig.cacheStorage === undefined && window && window.localStorage)
      client.defConfig.cacheStorage = window.localStorage
    this.initCache()
    client.addListener('nodeUpdateFinished', () => this.updateCache())
  }

  async getCodeFor(addresses: Buffer[], block = 'latest'): Promise<Buffer[]> {
    const result = addresses.map(a => this.codeCache.get(a))
    const missing: RPCRequest[] = result.map((_, i) => _ ? null : { method: 'eth_getCode', params: [toHex(addresses[i], 20), block], id: i + 1, jsonrpc: '2.0' as any }).filter(_ => _)
    if (missing.length) {
      for (const r of await this.client.send(missing, undefined, { proof: 'none', signatureCount: 0 }) as RPCResponse[]) {
        const i = r.id as number - 1
        if (r.error) throw new Error(' could not get the code for address ' + addresses[i] + ' : ' + r.error)
        this.codeCache.put(addresses[i], bytes(result[i] = r.result))
      }
      if (this.client.defConfig.cacheStorage && this.client.defConfig.chainId)
        this.client.defConfig.cacheStorage.setItem('in3.code.' + this.client.defConfig.chainId, this.codeCache.toStorage())

    }

    return result
  }

  getLastBlockHashes() {
    return this.blockCache.map(_ => toHex(_.hash))
  }

  getBlockHeader(blockNumber: number): Buffer {
    const b = this.blockCache.length && this.blockCache.find(_ => _.number === blockNumber)
    return b ? b.header : null
  }

  getBlockHeaderByHash(blockHash: Buffer): Buffer {
    const b = this.blockCache.length && this.blockCache.find(_ => _.hash.equals(blockHash))
    return b ? b.header : null
  }

  addBlockHeader(blockNumber: number, header: Buffer) {
    if (!this.client.defConfig.maxBlockCache || header.equals(this.getBlockHeader(blockNumber) || Buffer.allocUnsafe(0))) return header
    while (this.blockCache.length >= this.client.defConfig.maxBlockCache && this.blockCache.length)
      this.blockCache.splice(this.blockCache.reduce((p, c, i, a) => c.number < a[i].number ? i : p, 0), 1)

    this.blockCache.push({ number: blockNumber, header, hash: sha3(header) })
    this.client.defConfig.verifiedHashes = this.getLastBlockHashes()
    return header
  }


  initCache() {
    const chainId = this.client.defConfig.chainId;
    if (this.client.defConfig.cacheStorage && chainId) {

      // read nodeList
      const nl = this.client.defConfig.cacheStorage.getItem('in3.nodeList.' + chainId)
      try {
        if (nl)
          this.client.defConfig.servers[chainId] = JSON.parse(nl)
      }
      catch (ex) {
        this.client.defConfig.cacheStorage.setItem('in3.nodeList.' + chainId, '')
      }

      // read codeCache
      const codeCache = this.client.defConfig.cacheStorage.getItem('in3.code.' + chainId)
      try {
        if (codeCache)
          this.codeCache.fromStorage(codeCache)
      }
      catch (ex) {
        this.client.defConfig.cacheStorage.setItem('in3.code.' + chainId, '')
      }


    }
  }

  updateCache() {
    if (this.client.defConfig.cacheStorage && this.client.defConfig.chainId && this.client.defConfig.servers[this.client.defConfig.chainId]) {
      this.client.defConfig.cacheStorage.setItem('in3.nodeList.' + this.client.defConfig.chainId, JSON.stringify(this.client.defConfig.servers[this.client.defConfig.chainId]))
    }
  }


}

export interface CacheEntry {
  added: number
  data: Buffer
}

export class CacheNode {

  limit: number

  data: Map<Buffer, CacheEntry>
  dataLength: number

  constructor(limit: number) {
    this.limit = limit
    this.dataLength = 0
    this.data = new Map()
  }

  get(key: Buffer): Buffer {
    const entry = this.data.get(key)
    return entry ? entry.data : null
  }

  put(key: Buffer, val: Buffer) {
    const old = this.get(key)
    if (old) {
      this.dataLength -= this.getByteLength(old)
      this.data.delete(key)
    }
    const size = this.getByteLength(val)
    while (this.limit && !old && this.dataLength + size >= this.limit) {
      let oldestKey = null
      let oldestVal = { added: Date.now(), data: null }
      for (const [k, v] of this.data.entries()) {
        if (v.added < oldestVal.added) {
          oldestVal = v
          oldestKey = k
        }
      }
      if (!oldestKey) break
      this.data.delete(oldestKey)
      this.dataLength -= this.getByteLength(oldestVal.data)
    }
    this.data.set(key, { added: Date.now(), data: val })
    this.dataLength += this.getByteLength(val)
  }

  getByteLength(entry: Buffer | string) {
    if (Buffer.isBuffer(entry)) return entry.length
    if (typeof entry === 'string') return entry.length * 2
    return 4
  }

  toStorage() {
    const entries = []
    this.data.forEach((val, key) => {
      entries.push(key)
      entries.push(val.data)
    })
    return rlp.encode(entries).toString('base64')
  }

  fromStorage(data: string) {
    const entries: Buffer[] = rlp.decode(Buffer.from(data, 'base64'))
    for (let i = 0; i < entries.length; i += 2) {
      this.put(entries[i], entries[i + 1] as any)
    }
  }

}


