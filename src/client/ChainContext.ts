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
import { RPCRequest, RPCResponse, ChainSpec } from '../types/types';
import { getModule, Module } from './modules'

/**
 * Context for a specific chain including cache and chainSpecs.
 */
export default class ChainContext {
  client: Client
  chainSpec: ChainSpec
  module: Module
  chainId: string
  lastValidatorChange: number
  genericCache: {[key:string]:string}

  constructor(client: Client, chainId: string, chainSpec: ChainSpec) {
    this.client = client
    this.chainId = chainId
    this.chainSpec = chainSpec
    this.genericCache = {}
    this.lastValidatorChange = 0

    const s = this.client.defConfig.servers[this.chainId]
    this.module = getModule(s && s.verifier || 'eth')

    try {
      // if we are running in the browser we use to localStorage as cache
      if (client.defConfig.cacheStorage === undefined && window && window.localStorage)
        client.defConfig.cacheStorage = window.localStorage
    }
    catch (x) { }
    this.initCache()
    client.addListener('nodeUpdateFinished', () => this.updateCache())
  }

  /**
   * this function is calleds before the server is asked.
   * If it returns a promise than the request is handled internally otherwise the server will handle the response.
   * this function should be overriden by modules that want to handle calls internally
   * @param request
   */
  handleIntern(request: RPCRequest): Promise<RPCResponse> {
    return null
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
    }
  }

  updateCache() {
    if (this.client.defConfig.cacheStorage && this.chainId && this.client.defConfig.servers[this.chainId]) {
      this.client.defConfig.cacheStorage.setItem('in3.nodeList.' + this.chainId, JSON.stringify(this.client.defConfig.servers[this.chainId]))
    }
  }

  getFromCache(key: string): string {
    return this.genericCache[key]
  }

  putInCache(key: string, value: string) {
    this.genericCache[key] = value
    if (this.client.defConfig.cacheStorage && this.chainId)
      this.client.defConfig.cacheStorage.setItem('in3.cache.' + this.chainId, JSON.stringify(this.genericCache))
  }

  clearCache(prefix: string) {
    Object.keys(this.genericCache).filter(_ => !prefix || _.startsWith(prefix)).forEach(k => delete this.genericCache[k])
    if (this.client.defConfig.cacheStorage && this.chainId)
      this.client.defConfig.cacheStorage.setItem('in3.cache.' + this.chainId, JSON.stringify(this.genericCache))
  }

}
