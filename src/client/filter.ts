import Client from './Client';
import { RPCRequest, RPCResponse } from '../types/config'

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

  async addFilter(client: Client, type: 'event' | 'block' | 'pending', options: FilterOptions) {
    if (type === 'pending') throw new Error('Pending Transactions are not supported')
    const id = '0x' + (Object.keys(this.filters).reduce((a, b) => Math.max(a, parseInt(b)), 0) + 1).toString(16)
    this.filters[id] = { type, options, lastBlock: parseInt(await client.call('eth_blockNumber', [])) }
    return id
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
      ]) as any).then(all => all.find(_ => _.error) ? Promise.reject(all.find(_ => _.error).error) as any : [parseInt(all[0].result), all[1].result as any])
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
        return (client.send(requests) as any).then(r => r.map(_ => _.result.hash))
      }
      return []
    }
  }

  removeFilter(id: string) {
    delete this.filters[id]
    return id
  }






}