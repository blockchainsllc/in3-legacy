/*******************************************************************************
 * This file is part of the Incubed project.
 * Sources: https://github.com/slockit/in3
 * 
 * Copyright (C) 2018-2019 slock.it GmbH, Blockchains LLC
 * 
 * 
 * COMMERCIAL LICENSE USAGE
 * 
 * Licensees holding a valid commercial license may use this file in accordance 
 * with the commercial license agreement provided with the Software or, alternatively, 
 * in accordance with the terms contained in a written agreement between you and 
 * slock.it GmbH/Blockchains LLC. For licensing terms and conditions or further 
 * information please contact slock.it at in3@slock.it.
 * 	
 * Alternatively, this file may be used under the AGPL license as follows:
 *    
 * AGPL LICENSE USAGE
 * 
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY 
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * [Permissions of this strong copyleft license are conditioned on making available 
 * complete source code of licensed works and modifications, which include larger 
 * works using a licensed work, under the same license. Copyright and license notices 
 * must be preserved. Contributors provide an express grant of patent rights.]
 * You should have received a copy of the GNU Affero General Public License along 
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/

import Client from './Client'
import { RPCRequest, RPCResponse, ChainSpec } from '../types/types';
import { getModule, Module } from './modules'

/**
 * Context for a specific chain including cache and chainSpecs.
 */
export default class ChainContext {
  client: Client
  chainSpec: ChainSpec[]
  module: Module
  chainId: string
  lastValidatorChange: number
  genericCache: { [key: string]: string }
  registryId?: string

  constructor(client: Client, chainId: string, chainSpec: ChainSpec[]) {
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

  /**
   * returns the chainspec for th given block number
   */
  getChainSpec(block: number): ChainSpec {
    return this.chainSpec && this.chainSpec.filter(_ => _.block <= block).pop()
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
