import { RPCRequest, RPCResponse, Signature, IN3ResponseConfig } from '../types/config'
import config from './config'
import EthHandler from './chains/eth'
import NodeList from '../client/nodeList';
import { toHex } from '../client/block';


const handlers: { [chain: string]: RPCHandler } = {}

export async function handle(request: RPCRequest[]): Promise<RPCResponse[]> {
  return Promise.all(request.map(r => {
    const in3Request = r.in3 || { chainId: toHex((config.chainIds && config.chainIds[0]) || '0x2a', 32) }
    const handler = handlers[in3Request.chainId] || handlers['']
    const in3: IN3ResponseConfig = {}

    if (r.method === 'in3_nodeList')
      return handler.getNodeList(
        in3Request.verification && in3Request.verification.startsWith('proof'),
        r.params[0] || 0,
        r.params[1],
        r.params[2] || [],
        in3Request.signatures
      ).then(async result => {
        const res = {
          id: r.id,
          result: result as any,
          jsonrpc: r.jsonrpc,
          in3: { ...in3 }
        }
        const proof = res.result.proof
        if (proof) {
          delete res.result.proof
          res.in3.proof = proof
        }
        return res as RPCResponse
      })

    return Promise.all([
      handler.getNodeList(false).then(_ => in3.lastNodeList = _.lastBlockNumber),
      handler.handle(r)
    ])
      .then(_ => ({ ..._[1], in3: { ...(_[1].in3 || {}), ...in3 } }))
  }))
}


export interface RPCHandler {
  chainId: string
  handle(request: RPCRequest): Promise<RPCResponse>
  sign(blocks: { blockNumber: number, hash: string }[]): Signature[]
  getFromServer(request: Partial<RPCRequest>): Promise<RPCResponse>
  getAllFromServer(request: Partial<RPCRequest>[]): Promise<RPCResponse[]>
  getNodeList(includeProof: boolean, limit?: number, seed?: string, addresses?: string[], signers?: string[]): Promise<NodeList>
  config: any
}

// register Handlers 
handlers[''] = handlers['0x00'] = new EthHandler({ ...config })


config.chainIds.forEach(id => {
  const chain = toHex(id, 32)
  handlers[chain] = new EthHandler({ ...config })
  handlers[chain].chainId = chain

})


export function updateNodelists() {
  return Promise.all(config.chainIds.map(id => handlers[toHex(id, 32)].getNodeList(true)))
}