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

import Client from './Client'
import { address, bytes, hash, rlp, serialize } from '../util/serialize';
import { toHex, toMinHex } from '../util/util'
import { RPCRequest, RPCResponse, ChainSpec } from '../types/types';
import { sha3 } from 'ethereumjs-util'
const Buffer: any = require('buffer').Buffer

/**
 * Context for a specific chain including cache and chainSpecs.
 */
export default class ChainContext {
  client: Client
  chainSpec: ChainSpec
  chainId: string

  genericCache: {[key:string]:string}
  codeCache: CacheNode
  blockCache: { number: number, header: Buffer, hash: Buffer }[]

  constructor(client: Client, chainId:string, chainSpec:ChainSpec) {
    this.client = client
    this.chainId =chainId
    this.chainSpec = chainSpec
    this.genericCache = {}
    this.codeCache = new CacheNode(client.defConfig.maxCodeCache || 100000)
    this.blockCache = []
    try {
      // if we are running in the browser we use to localStorage as cache
      if (client.defConfig.cacheStorage === undefined && window && window.localStorage)
        client.defConfig.cacheStorage = window.localStorage
    }
    catch (x) { }
    this.initCache()
    client.addListener('nodeUpdateFinished', () => this.updateCache())
  }

  async getCodeFor(addresses: Buffer[], block = 'latest'): Promise<Buffer[]> {
    const result = addresses.map(a => this.codeCache.get(a))
    const missing: RPCRequest[] = result.map((_, i) => _ ? null : { method: 'eth_getCode', params: [toHex(addresses[i], 20), block[0]==='l'?block:toMinHex(block)], id: i + 1, jsonrpc: '2.0' as any }).filter(_ => _)
    if (missing.length) {
      for (const r of await this.client.send(missing, undefined, { proof: 'none', signatureCount: 0, chainId:this.chainId }) as RPCResponse[]) {
        const i = r.id as number - 1
        if (r.error) throw new Error(' could not get the code for address ' + addresses[i] + ' : ' + r.error)
        this.codeCache.put(addresses[i], bytes(result[i] = r.result))
      }
      if (this.client.defConfig.cacheStorage && this.chainId)
        this.client.defConfig.cacheStorage.setItem('in3.code.' + this.chainId, this.codeCache.toStorage())

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
    const chainId = this.chainId;
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

      // read cache
      const cache = this.client.defConfig.cacheStorage.getItem('in3.cache.' + chainId)
      try {
        if (cache)
          this.genericCache = JSON.parse(cache)
      }
      catch (ex) {
        this.client.defConfig.cacheStorage.setItem('in3.cache.' + chainId, '')
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
    if (this.client.defConfig.cacheStorage && this.chainId && this.client.defConfig.servers[this.chainId]) {
      this.client.defConfig.cacheStorage.setItem('in3.nodeList.' + this.chainId, JSON.stringify(this.client.defConfig.servers[this.chainId]))
    }
  }

  getFromCache(key:string):string {
    return this.genericCache[key]
  }

  putInCache(key:string, value:string) {
    this.genericCache[key]=value
    if (this.client.defConfig.cacheStorage && this.chainId) 
       this.client.defConfig.cacheStorage.setItem('in3.cache.' + this.chainId, JSON.stringify(this.genericCache))
  }


}

export interface CacheEntry {
  added: number
  data: Buffer
}

export class CacheNode {

  limit: number

  data: Map<string, CacheEntry>
  dataLength: number

  constructor(limit: number) {
    this.limit = limit
    this.dataLength = 0
    this.data = new Map()
  }

  get(key: Buffer): Buffer {
    const entry = this.data.get(key.toString('hex'))
    return entry ? entry.data : null
  }

  put(key: Buffer, val: Buffer) {
    const old = this.get(key)
    if (old) {
      this.dataLength -= this.getByteLength(old)
      this.data.delete(key.toString('hex'))
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
    this.data.set(key.toString('hex'), { added: Date.now(), data: val })
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
      entries.push(Buffer.from(key, 'hex'))
      entries.push(val.data)
    })
    return rlp.encode(entries).toString('base64')
  }

  fromStorage(data: string) {
    const entries: Buffer[] = rlp.decode(Buffer.from(data, 'base64'))
    for (let i = 0; i < entries.length; i += 2)
      this.put(entries[i], entries[i + 1])
  }

}


