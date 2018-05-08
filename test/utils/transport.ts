import { Transport } from '../../src/types/transport';
import { RPCRequest, RPCResponse, IN3NodeConfig } from '../../src/types/config';
import { RPCHandler } from '../../src/server/rpc';
import EthHandler from '../../src/server/chains/eth';
import NodeList from '../../src/client/nodeList';
import { toBuffer, privateToAddress, toChecksumAddress } from 'ethereumjs-util'
import * as request from 'request';



export class TestTransport implements Transport {

  handlers: {
    [url: string]: RPCHandler
  }

  nodeList: NodeList
  randomList: number[][]
  lastRandom: number
  injectedResponses: {
    request: Partial<RPCRequest>,
    response: Partial<RPCResponse>,
    url: string
  }[]

  constructor(count = 5) {
    this.lastRandom = 0
    this.randomList = []
    this.handlers = {}
    this.injectedResponses = []
    this.nodeList = new NodeList()
    const nodes: IN3NodeConfig[] = []
    for (let i = 0; i < count; i++) {
      const privateKey = '0x7c4aa055bcee97a7b3132a2bf5ef2ca1f219564388c1b622000000000000000' + i
      const url = '#' + (i + 1)
      nodes.push({
        address: toChecksumAddress('0x' + privateToAddress(toBuffer(privateKey)).toString('hex')),
        url: url,
        chainIds: ['0x01'],
        deposit: i
      })
      this.handlers['#' + (i + 1)] = new EthHandler({
        rpcUrl: 'http://localhost:8545',
        privateKey
      }, this)
    }

    this.nodeList.update(nodes, 0)
  }

  injectResponse(request: Partial<RPCRequest>, response: Partial<RPCResponse>, url = '') {
    this.injectedResponses.push({
      request, response, url
    })
  }

  clearInjectedResponsed() {
    this.injectedResponses.length = 0
  }

  async handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]> {
    const requests = Array.isArray(data) ? data : [data]
    const results = await Promise.all(requests.map(_ => this.handleRequest(_, this.handlers[url], url)))
    return Array.isArray(data) ? results : results[0]
  }

  async handleRequest(r: RPCRequest, handler: RPCHandler, url: string): Promise<RPCResponse> {

    for (const ir of this.injectedResponses) {
      if (ir.url && ir.url !== url) continue
      if (ir.request && ir.request.method !== r.method) continue
      if (ir.request && ir.request.params && JSON.stringify(ir.request.params) != JSON.stringify(r.params)) continue
      return { jsonrpc: '2.0', id: r.id, ...ir.response }
    }

    if (r.method === 'in3_nodeList')
      return {
        id: r.id,
        result: this.nodeList.nodes,
        jsonrpc: r.jsonrpc,
        in3: {
          lastNodeList: this.nodeList.lastBlockNumber
        }
      } as RPCResponse
    return handler.handle(r)
  }

  nextRandom() {
    this.lastRandom += 0.2
    if (this.lastRandom >= 1) this.lastRandom -= 1
    return this.lastRandom
  }


  random(count: number): number[] {
    const result = this.randomList.pop() || []
    for (let i = result.length; i < count; i++)
      result.push(this.nextRandom())
    return result
  }
}