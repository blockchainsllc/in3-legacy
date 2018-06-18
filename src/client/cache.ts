import Client from './Client'
import { address, bytes } from '../util/serialize'
import { RPCRequest, RPCResponse } from '../types/types'

export default class Cache {
  client: Client

  codeCache: CacheNode<Buffer>
  blockCache: { number: number, header: Buffer }[]

  constructor(client: Client) {
    this.client = client
    this.codeCache = new CacheNode<Buffer>(client.defConfig.maxCodeCache || 50000)
    this.blockCache = []
  }

  async getCodeFor(addresses: Buffer[], block = 'latest'): Promise<Buffer[]> {
    const result = addresses.map(a => this.codeCache.get(a))
    const missing: RPCRequest[] = result.map((_, i) => _ ? null : { method: 'eth_getCode', params: [addresses[i], block], id: i + 1, jsonrpc: '2.0' as any }).filter(_ => _)
    if (missing.length)
      for (const r of await this.client.send(missing, undefined, { proof: false, signatureCount: 0 }) as RPCResponse[]) {
        const i = r.id as number - 1
        if (r.error) throw new Error(' could not get the code for address ' + addresses[i] + ' : ' + r.error)
        this.codeCache.put(addresses[i], bytes(result[i] = r.result))
      }

    return result
  }

  getLastBlockWithHash() {
    return this.blockCache.length ? this.blockCache[this.blockCache.length - 1].number : 0
  }

  getBlockHeader(blockNumber: number): Buffer {
    const b = this.blockCache.length && this.blockCache.find(_ => _.number === blockNumber)
    return b ? b.header : null
  }

  addBlockHeader(blockNumber: number, header: Buffer) {
    if (!this.client.defConfig.maxBlockCache || header.equals(this.getBlockHeader(blockNumber) || Buffer.allocUnsafe(0))) return header
    while (this.blockCache.length >= this.client.defConfig.maxBlockCache && this.blockCache.length)
      this.blockCache.splice(this.blockCache.reduce((p, c, i, a) => c.number < a[i].number ? i : p, 0), 1)

    this.blockCache.push({ number: blockNumber, header })
    return header
  }



}

export interface CacheEntry<T> {
  added: number
  data: T
}

export class CacheNode<T> {

  limit: number

  data: Map<Buffer, CacheEntry<T>>
  dataLength: number

  constructor(limit: number) {
    this.limit = limit
    this.dataLength = 0
  }

  get(key: Buffer): T {
    const entry = this.data.get(key)
    return entry ? entry.data : null
  }

  put(key: Buffer, val: T) {
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

  getByteLength(entry: T) {
    if (Buffer.isBuffer(entry)) return entry.length
    if (typeof entry === 'string') return entry.length * 2
    return 4
  }

}