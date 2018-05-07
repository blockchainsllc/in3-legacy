import { RPCRequest, RPCResponse, Signature, IN3ResponseConfig } from '../types/config'
import config from './config'
import EthHandler from './chains/eth'
import NodeList from '../client/nodeList';


const handlers: { [chain: string]: RPCHandler } = {}

export async function handle(request: RPCRequest[]): Promise<RPCResponse[]> {
  return Promise.all(request.map(r => {
    const in3Request = r.in3 || {}
    const handler = handlers[in3Request.chainId] || handlers['']
    const in3: IN3ResponseConfig = {}

    if (r.method === 'in3_nodeList')
      return handler.getNodeList(true).then(result => ({
        id: r.id,
        result: result as any,
        jsonrpc: r.jsonrpc,
        in3
      }) as RPCResponse)

    return Promise.all([
      handler.getNodeList(false).then(_ => in3.lastNodeList = _.lastBlockNumber),
      handler.handle(r)
    ])
      .then(_ => ({ ..._[1], in3: { ...(_[1].in3 || {}), ...in3 } }))
  }))
}


export interface RPCHandler {

  handle(request: RPCRequest): Promise<RPCResponse>
  sign(blockHash: string, blockNumber: number): Signature
  getFromServer(request: Partial<RPCRequest>): Promise<RPCResponse>
  getAllFromServer(request: Partial<RPCRequest>[]): Promise<RPCResponse[]>
  getNodeList(includeProof: boolean): Promise<NodeList>
  config: any
}

// register Handlers 
handlers[''] = handlers['0x00'] = new EthHandler({ ...config })
