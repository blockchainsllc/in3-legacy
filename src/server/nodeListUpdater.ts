import { RPCHandler } from './rpc';
import NodeList from '../client/nodeList'
import { RPCRequest, IN3Config, RPCResponse } from '../types/config';

export async function checkNodeList(handler: RPCHandler, nodeList: NodeList) {
  // TODO check blocknumber of last event.
  if (!nodeList.nodes)
    return getNodeListProof(handler, nodeList)

}

export async function getNodeListProof(handler: RPCHandler, nodeList: NodeList) {
  await checkNodeList(handler, nodeList)
  nodeList.nodes = await updateNodeList(handler)
  return {
    type: 'nodeListProof'
  }
}


function prepareCall(contract: string, methodHash: string, params?: string): RPCRequest {
  return {
    method: 'eth_call',
    params: [{
      to: contract,
      data: methodHash + (params || '')
    }, 'latest']
  } as any
}

async function updateNodeList(handler: RPCHandler) {
  const contract = handler.config.registry
  const count = await call(handler, prepareCall(contract, '0x15625c5e')).then(parseInt)

  const req: RPCRequest[] = []
  for (let i = 0; i < count; i++)
    req.push(prepareCall(contract, '0x5cf0f357', (i).toString(16).padStart(64, '0')))

  const nodes = await handler.getAllFromServer(req)
  console.log('nodes:', nodes.map(_ => _.result.toString().substr(2)))
  return nodes.map(_ => _.result.toString().substr(2)).map(data => ({
    address: '0x' + data.substr(24, 40),
    owner: '0x' + data.substr(64 + 24, 40),
    deposit: parseInt('0x' + data.substr(64 * 2, 64)),
    unregisterRequestTime: parseInt('0x' + data.substr(64 * 3, 64)),
    chainIds: [('0x' + data.substr(64 * 4, 64)).replace(/0x0+/, '0x')],
    url: decodeURIComponent(data.substr(64 * 7, 2 * parseInt('0x' + data.substr(64 * 6, 64))).replace(/[0-9a-f]{2}/g, '%$&'))
  })
  )
}

function call(handler: RPCHandler, request: RPCRequest): Promise<string> {
  return handler.getFromServer(request).then(_ => _.error ? Promise.reject(_.error) as any : _.result + '')
}

