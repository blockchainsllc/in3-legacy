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

import Client from '../../client/Client';
import { RPCRequest, RPCResponse } from '../../types/types'
import { util, serialize} from 'in3-common'
export type FilterType = 'event' | 'block' | 'pending'
export interface FilterOptions {
  fromBlock?: number | string
  toBlock?: number | string
  address?: string | string[]
  topics?: (string | string[])[]
}

export interface Filter {
  type: 'event' | 'block' | 'pending'
  options: FilterOptions
  lastBlock: number
}

export default class Filters {

  filters: { [id: string]: Filter }

  constructor() {
    this.filters = {}
  }

  async addFilter(client: Client, type: FilterType, options: FilterOptions) {
    if (type === 'pending') throw new Error('Pending Transactions are not supported')
    const id = '0x' + (Object.keys(this.filters).reduce((a, b) => Math.max(a, parseInt(b)), 0) + 1).toString(16)
    this.filters[id] = { type, options, lastBlock: parseInt(await client.call('eth_blockNumber', [])) }
    return id
  }

  handleIntern(request: RPCRequest, client: Client): Promise<RPCResponse> {
    switch (request.method) {
      case 'eth_newFilter':
        return this.addFilter(client, 'event', request.params[0])
          .then(result => ({
            id: request.id,
            jsonrpc: request.jsonrpc,
            result
          }))
      case 'eth_newBlockFilter':
        return this.addFilter(client, 'block', {})
          .then(result => ({
            id: request.id,
            jsonrpc: request.jsonrpc,
            result
          }))
      case 'eth_newPendingTransactionFilter':
        return this.addFilter(client, 'pending', {})
          .then(result => ({
            id: request.id,
            jsonrpc: request.jsonrpc,
            result
          }))
      case 'eth_uninstallFilter':
        return Promise.resolve({
          id: request.id,
          jsonrpc: request.jsonrpc,
          result: !!this.removeFilter(request.params[0])
        })
      case 'eth_getFilterChanges':
        return this.getFilterChanges(client, request.params[0])
          .then(result => ({
            id: request.id,
            jsonrpc: request.jsonrpc,
            result
          }))

      default:
        return null
    }
  }

  async getFilterChanges(client: Client, id: string) {
    const filter = this.filters[id]
    if (!filter) throw new Error('Filter with id ' + id + ' not found!')
    if (filter.type === 'event') {
      const [blockNumber, logs] = await (client.send([
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: []
        },
        {
          jsonrpc: '2.0',
          id: 2,
          method: 'eth_getLogs',
          params: [{ ...filter.options, fromBlock: '0x' + filter.lastBlock.toString(16) }]
        }
      ]) as Promise<RPCResponse[]>)
        .then(all => all[1].result ? all : [all[0], { result: [] } as any])
        .then(util.checkForError)
        .then(all => [parseInt(all[0].result), all[1].result] as [number, serialize.LogData])

      filter.lastBlock = blockNumber + 1
      return logs
    }
    else if (filter.type === 'block') {
      const bN = parseInt(await client.call('eth_blockNumber', []))
      if (bN > filter.lastBlock) {
        const requests: RPCRequest[] = []
        for (let i = filter.lastBlock + 1; i <= bN; i++)
          requests.push({
            jsonrpc: '2.0',
            id: requests.length + 1,
            method: 'eth_getBlockByNumber',
            params: ['0x' + i.toString(16), false]
          })
        filter.lastBlock = bN
        return (client.send(requests) as Promise<RPCResponse[]>).then(r => r.map(_ => _.result.hash))
      }
      return []
    }
  }

  removeFilter(id: string) {
    const res = !!this.filters[id]
    delete this.filters[id]
    return res
  }






}