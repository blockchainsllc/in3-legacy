import { RPCHandler } from './rpc'
import config from './config'
import * as tx from './tx'
import * as abi from 'ethereumjs-abi'
import NodeList from '../client/nodeList'
import { RPCRequest, IN3Config, RPCResponse, IN3NodeConfig } from '../types/config'
import { toBuffer, toHex } from '../client/block'
import { toChecksumAddress, BN, keccak256 } from 'ethereumjs-util'
import * as verify from '../client/verify'

export async function checkNodeList(handler: RPCHandler, nodeList: NodeList, includeProof = false, limit = 0, seed?: string, addresses: string[] = []): Promise<NodeList> {

  // TODO check blocknumber of last event.
  if (!nodeList.nodes)
    await updateNodeList(handler, nodeList)

  // if the client requires a portion of the list
  if (limit && limit < nodeList.nodes.length) {
    const nodes = nodeList.nodes
    const nl = new NodeList()
    nl.totalServers = nodeList.totalServers
    nl.contract = nodeList.contract
    nl.lastBlockNumber = nodeList.lastBlockNumber

    // try to find the addresses in the node list
    const result = addresses.map(adr => nodes.findIndex(_ => _.address === adr))
    if (result.indexOf(-1) >= 0) throw new Error('The given addresses ' + addresses.join() + ' are not registered in the serverlist')

    createRandomIndexes(nodes.length, limit, seed, result)
    nl.nodes = result.map(i => nodeList.nodes[i])

    if (includeProof) {
      const storageProof = nodeList.proof.account.storageProof
      nl.proof = {
        ...nodeList.proof, account: {
          ...nodeList.proof.account,
          storageProof: getStorageKeys(nl.nodes).map(k => storageProof.find(_ => _.key === k))
        }
      }
    }


    return nl
  }

  // clone result
  const list = { ...nodeList, proof: { ...nodeList.proof } }
  if (!includeProof) delete list.proof
  return list as any

}

function getStorageKeys(list: IN3NodeConfig[]) {
  // create the keys with the serverCount
  const keys: string[] = [tx.getStorageArrayKey(0)]

  for (const n of list) {
    for (let i = 0; i < 5; i++)
      tx.getStorageArrayKey(0, n.index, 5, i)
    const urlKey = tx.toBN(keccak256(keys[keys.length - 5]))
    for (let i = 0; i < n.url.length / 32; i++)
      keys.push(tx.leftPad('0x' + urlKey.add(tx.toBN(i)).toString(16), 64))
  }

  return keys
}

export async function createNodeListProof(handler: RPCHandler, nodeList: NodeList) {


  // create the keys with the serverCount
  const keys: string[] = getStorageKeys(nodeList.nodes)

  const address = nodeList.contract
  const blockNr = '0x' + nodeList.lastBlockNumber.toString(16)

  // read the response,blockheader and trace from server
  const [blockResponse, proof, code] = await this.getAllFromServer([
    { method: 'eth_getBlockByNumber', params: [blockNr, false] },
    { method: 'eth_getProof', params: [toHex(address, 20), keys, blockNr] }
  ])

  // error checking
  if (blockResponse.error) throw new Error('Could not get the block for ' + blockNr + ':' + blockResponse.error)
  if (proof.error) throw new Error('Could not get the proof :' + JSON.stringify(proof.error, null, 2) + ' for request ' + JSON.stringify({ method: 'eth_getProof', params: [toHex(address, 20), keys, blockNr] }, null, 2))

  // anaylse the transaction in order to find all needed storage
  const block = blockResponse.result as any
  const account = proof.result as any

  // bundle the answer
  return {
    type: 'accountProof',
    block: verify.blockToHex(block),
    account: proof.result
  }
}

export function createRandomIndexes(len: number, limit: number, seed: string, result: number[] = []) {
  let step = parseInt(seed.substr(0, 14))  // first 6 bytes
  let pos = parseInt('0x' + seed.substr(14, 12)) // next 6 bytes
  while (result.length < limit) {
    if (result.indexOf(pos) >= 0) {
      seed = keccak256(seed)
      step = parseInt(seed.substr(0, 14))
      continue
    }
    result.push(pos)
    pos = (pos + step) % len
  }
  return result
}


async function updateNodeList(handler: RPCHandler, list: NodeList) {

  // first get the registry
  const [owner, bootNodes, meta, registryContract, contractChain] = await tx.callContract(config.registryRPC || config.rpcUrl, config.registry, 'chains(bytes32):(address,string,string,address,bytes32)', [handler.chainId])

  // number of registered servers
  const [serverCount] = await tx.callContract(config.rpcUrl, '0x' + registryContract, 'totalServers():(uint)', [])

  list.contract = toChecksumAddress('0x' + registryContract)
  list.totalServers = serverCount.toNumber()

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

  list.nodes = await handler.getAllFromServer(nodeRequests).then(all => all.map((n, i) => {
    // invalid requests must be filtered out
    if (n.error) return null
    const [url, owner, deposit, props, unregisterRequestTime] = abi.simpleDecode('servers(uint):(string,address,uint,uint,uint)', toBuffer(n.result))

    return {
      address: toChecksumAddress(owner),
      url,
      index: i,
      deposit: deposit.toNumber(),
      props: props.toNumber(),
      chainIds: [handler.chainId],
      unregisterRequestTime: unregisterRequestTime.toNumber()
    } as IN3NodeConfig

  })).then(_ => _)

  // create the proof
  list.proof = await createNodeListProof(handler, list)


}

