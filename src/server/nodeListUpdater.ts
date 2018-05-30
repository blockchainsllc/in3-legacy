import { RPCHandler } from './rpc'
import config from './config'
import * as tx from './tx'
import * as abi from 'ethereumjs-abi'
import NodeList from '../client/nodeList'
import { RPCRequest, IN3Config, RPCResponse, IN3NodeConfig } from '../types/config'
import { toBuffer, toHex } from '../client/block';
import { toChecksumAddress } from 'ethereumjs-util'

export async function checkNodeList(handler: RPCHandler, nodeList: NodeList) {
  // TODO check blocknumber of last event.
  if (!nodeList.nodes)
    return getNodeListProof(handler, nodeList)

}

export async function getNodeListProof(handler: RPCHandler, nodeList: NodeList) {
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

  // first get the registry
  const [owner, bootNodes, meta, registryContract, contractChain] = await tx.callContract(config.registryRPC || config.rpcUrl, config.registry, 'chains(bytes32):(address,string,string,address,bytes32)', [handler.chainId])

  // number of registered servers
  const [serverCount] = await tx.callContract(config.rpcUrl, '0x' + registryContract, 'totalServers():(uint)', [])

  // build the requests per server-entry
  const nodeRequests: RPCRequest[] = []
  for (let i = 0; i < serverCount.toNumber(); i++)
    nodeRequests.push({
      jsonrpc: '2.0',
      id: i + 1,
      method: 'eth_call', params: [{
        to: '0x' + registryContract,
        data: '0x' + abi.simpleEncode('servers(uint)', toHex(i, 32)).toString('hex')
      },
        'latest']
    })

  return await handler.getAllFromServer(nodeRequests).then(all => all.map(n => {
    // invalid requests must be filtered out
    if (n.error) return null
    const [url, owner, deposit, props, unregisterRequestTime] = abi.simpleDecode('servers(uint):(string,address,uint,uint,uint)', toBuffer(n.result))

    return {
      address: toChecksumAddress(owner),
      url,
      deposit: deposit.toNumber(),
      props: props.toNumber(),
      chainIds: [handler.chainId],
      unregisterRequestTime: unregisterRequestTime.toNumber()
    } as IN3NodeConfig

  })).then(_ => _)

}

