import { Transport, AxiosTransport } from '../../src/types/transport';
import { RPCRequest, RPCResponse, IN3NodeConfig } from '../../src/types/config';
import { RPCHandler } from '../../src/server/rpc';
import EthHandler from '../../src/server/chains/eth';
import NodeList from '../../src/client/nodeList';
import { toBuffer, privateToAddress, toChecksumAddress } from 'ethereumjs-util'
import * as request from 'request'
import Client from '../../src/client/Client'
import { IN3Config } from '../../src/types/config'
import * as logger from './memoryLogger'
import * as crypto from 'crypto'
import { getAddress, sendTransaction } from '../../src/server/tx';

export type ResponseModifier = (RPCRequest, RPCResponse) => RPCResponse

export const devPk = '0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7'
export class TestTransport implements Transport {
  handlers: {
    [url: string]: RPCHandler
  }
  url: string

  nodeList: NodeList
  randomList: number[][]
  lastRandom: number
  injectedResponses: {
    request: Partial<RPCRequest>,
    response: Partial<RPCResponse> | ResponseModifier,
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
        chainIds: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
        deposit: i,
        props: 255
      });
      (this.handlers['#' + (i + 1)] = new EthHandler({
        rpcUrl: 'http://localhost:8545',
        privateKey,
      }, this)).chainId = '0x0000000000000000000000000000000000000000000000000000000000000001'
    }
    this.url = 'http://localhost:8545'

    this.nodeList.update(nodes, 0)
  }

  injectRandom(randomVals: number[]) {
    this.randomList.push(randomVals)
  }
  injectResponse(request: Partial<RPCRequest>, response: (Partial<RPCResponse> | ResponseModifier), url = '') {
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
    logger.debug('Request for ' + url + ' : ', r)

    const responseModifiers: ResponseModifier[] = []

    for (const ir of this.injectedResponses) {
      if (ir.url && ir.url !== url) continue
      if (ir.request && ir.request.method !== r.method) continue
      if (ir.request && ir.request.params && JSON.stringify(ir.request.params) != JSON.stringify(r.params)) continue
      if (typeof ir.response === 'function')
        responseModifiers.push(ir.response)
      else {
        logger.debug('Response (injected) : ', { id: r.id, ...ir.response })
        return { jsonrpc: '2.0', id: r.id, ...ir.response }
      }
    }

    let res: RPCResponse
    if (r.method === 'in3_nodeList')
      res = {
        id: r.id,
        result: {
          lastBlockNumber: 0,
          nodes: this.nodeList.nodes,
          contract: '0x00000000',
          totalServers: this.nodeList.nodes.length
        } as any,
        jsonrpc: r.jsonrpc
      } as RPCResponse
    else
      res = await handler.handle(r)

    logger.debug('Response  : ', res)
    return responseModifiers.reduce((p, m) => m(r, p), res)
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

  async createClient(conf?: Partial<IN3Config>): Promise<Client> {
    const client = new Client({
      chainId: '0x0000000000000000000000000000000000000000000000000000000000000001',
      timeout: 9999999,
      servers: {
        '0x0000000000000000000000000000000000000000000000000000000000000001': {
          contract: 'dummy',
          nodeList: this.nodeList.nodes
        }
      },
      ...(conf || {})
    }, this)
    await client.updateNodeList(client.defConfig.chainId, { proof: false })
    return client
  }

  /** creates a random private key and transfers some ether to this address */
  async createAccount(seed?: string, eth = 100000): Promise<string> {
    const pkBuffer = seed
      ? seed.startsWith('0x')
        ? Buffer.from(seed.substr(2).padStart(64, '0'), 'hex')
        : Buffer.from(seed.padStart(64, '0'), 'hex')
      : crypto.randomBytes(32)

    const pk = '0x' + pkBuffer.toString('hex')
    const adr = getAddress(pk)

    if (eth)
      await sendTransaction('http://localhost:8545', {
        privateKey: devPk,
        gas: 222000,
        to: adr,
        data: '',
        value: eth,
        confirm: true
      })

    return pk
  }


}


export class LoggingAxiosTransport extends AxiosTransport {
  async handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]> {
    logger.debug('Request for ' + url + ' : ', data)
    try {
      const res = await super.handle(url, data, timeout)
      logger.debug('Result : ', res)
      return res
    }
    catch (ex) {
      logger.error('Error handling the request :', ex)
      throw ex
    }


  }

}