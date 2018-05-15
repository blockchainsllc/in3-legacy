import { IN3Config, RPCRequest, RPCResponse, IN3NodeConfig, IN3NodeWeight, IN3RPCRequestConfig } from '../types/config';
import { verifyProof } from './verify'
import NodeList, { canMultiChain, canProof } from './nodeList'
import { Transport, AxiosTransport } from '../types/transport';
import { getChainData } from './abi'
import { toChecksumAddress } from 'ethereumjs-util';




/**
 * Client for N3.
 * 
 */
export default class Client {

  public defConfig: IN3Config
  private transport: Transport

  public constructor(config?: Partial<IN3Config>, transport?: Transport) {
    this.transport = transport || new AxiosTransport()
    this.defConfig = {
      proof: false,
      signatureCount: 0,
      minDeposit: 0,
      requestCount: 3,
      chainId: '0x2a',
      mainChain: '0x2a',
      ... (config || {}),
      servers: {
        '0x2a': {
          contract: '0xF88e75205BcD029C897700E8ad03050C78611A37',
          nodeList: [
            {
              address: '0x01',
              chainIds: ['0x2a'],
              url: 'https://rpc-kovan.slock.it',
              deposit: 0

            },
            {
              address: '0x02',
              chainIds: ['0x2a'],
              url: 'https://kovan.infura.io/HVtVmCIHVgqHGUgihfhX',
              deposit: 0
            },
            {
              address: '0x03',
              chainIds: ['0x2a'],
              url: 'https://kovan.infura.io/HVtVmCIHVsqHGUgihfhX',
              deposit: 0
            },
            {
              address: '0x04',
              chainIds: ['0x2a'],
              url: 'https://kovan.infura.io/HVtVmCIHVaqHGUgihfhX',
              deposit: 0
            },
            {
              address: '0x05',
              chainIds: ['0x2a'],
              url: 'https://koasdfjojoi.com',
              deposit: 0
            }],
        },
        ...((config && config.servers) || {})
      }
    }
  }

  public async updateNodeList(chainId?: string) {
    const chain = chainId || this.defConfig.chainId || '0x01'
    if (!chain) throw new Error('No ChainId found to update')

    // step one
    const servers = this.defConfig.servers[chain] || (this.defConfig.servers[chain] = {})
    if (!servers.contract) {

      // find main bootNodes
      if (!this.defConfig.servers[this.defConfig.mainChain])
        throw new Error('There are no bootnodes configured for chain ' + this.defConfig.mainChain)

      const chainData = await getChainData(this, chain)

      // fill the data
      servers.contract = chainData.registryContract
      servers.contractChain = chainData.contractChain
      servers.nodeList = chainData.bootNodes.map(_ => ({
        address: toChecksumAddress(_.split(':')[0]),
        chainIds: [chain],
        url: _.substr(_.indexOf(':') + 1),
        deposit: 0
      }))
    }

    servers.nodeList = await this.sendRPC('in3_nodeList', [], chain).then(_ => _.result as any as IN3NodeConfig[])
  }

  public async call(request: RPCRequest, config?: Partial<IN3Config>): Promise<string> {
    return (this.send(request, null, { minDeposit: 0 }) as Promise<RPCResponse>)
      .then(_ => _.error ? Promise.reject(new Error('Error handling ' + JSON.stringify(request) + ':' + JSON.stringify(_.error))) as any : _.result + '')
  }

  public async sendRPC(method: string, params: any, chain = '0x01', config?: Partial<IN3Config>) {
    return this.send({ jsonrpc: '2.0', method, params, id: idCount++ }, null, config) as Promise<RPCResponse>
  }



  /**
   * sends a request.
   * If the callback is given it will be called with the response, if not a Promise will be returned.
   */
  public send(request: RPCRequest[] | RPCRequest, callback?: (err: Error, response: RPCResponse | RPCResponse[]) => void, config?: Partial<IN3Config>): void | Promise<RPCResponse | RPCResponse[]> {
    const p = this.sendIntern(Array.isArray(request) ? request : [request], config ? { ...this.defConfig, ...config } : this.defConfig)
    if (callback)
      p.then(_ => callback(null, Array.isArray(request) ? _ : _[0]), callback as any)
    else
      return p.then(_ => Array.isArray(request) ? _ : _[0])
  }

  private async getNodeList(conf: IN3Config) {
    const c = { ...this.defConfig, ...(conf || {}) }
    if (!c.chainId) throw new Error('no chainId')
    const server = c.servers[c.chainId]

    if (!server)
      await this.updateNodeList(c.chainId)
    const list = c.servers[c.chainId].nodeList
    if (!list || list.length == 0) throw new Error('No NodeList found for chain ' + c.chainId)

    return list

  }


  private async sendIntern(requests: RPCRequest[], conf: IN3Config, prevExcludes?: string[]): Promise<RPCResponse[]> {

    // check nodeList
    await this.getNodeList(conf)

    // find some random nodes
    const nodes = getNodes(conf, conf.requestCount, this.transport)
    const excludes = [...(prevExcludes || []), ...nodes.map(_ => _.address)].filter((e, i, a) => a.indexOf(e) === i)

    // merge config
    const responses = await Promise.all(nodes.map(_ => handleRequest(requests, _, conf, this.transport, excludes)))

    // now compare the result
    return await Promise.all(requests.map((req, i) => mergeResults(req, responses.map(_ => _[i]), conf, this.transport))).then(_ => conf.keepIn3 ? _ : _.map(cleanResult))
  }


}


let idCount = 1

function prepareCall(contract: string, methodHash: string, params?: string): RPCRequest {
  return {
    method: 'eth_call',
    params: [{
      to: contract,
      data: methodHash + (params || '')
    }, 'latest']
  } as any
}


/**
 * merges the results of all responses to one valid one.
 */
async function mergeResults(request: RPCRequest, responses: RPCResponse[], conf: IN3Config, transport: Transport) {
  if (responses.length == 1) return responses[0]

  // for blocknumbers, we simply ake the highest! 
  // TODO check error and maybe even blocknumbers in the future
  if (request.method === 'eth_blockNumber')
    return { ...responses[0], result: '0x' + Math.max(...responses.map(_ => parseInt(_.result as any))).toString(16) }


  // how many different results do we have?
  const groups = responses.reduce((g, r) => {
    const k = JSON.stringify(r.result || (r.error && 'error'))
    const list = g[k] || (g[k] = [])
    list.push(r)
    return g
  }, {})

  // if a result contains a proof, we need to verify it
  // TODO handle wrong verification and maybe accept the first verifiable response
  const verified = (await Promise.all(responses.filter(_ => _.in3 && _.in3.proof).map(r => verifyProof(request, r)))).reduce((p, v) => p && v, true)


  if (Object.keys(groups).length > 1 || !verified) {
    // there are more then one answers!
    // how are we going to handle the conflict?
    if (conf.servers[conf.chainId].nodeAuthorities && conf.servers[conf.chainId].nodeAuthorities.length) {
      const aconf = { ...conf, nodeList: conf.servers[conf.chainId].nodeAuthorities.map(a => conf.servers[conf.chainId].nodeList.find(_ => _.address === a)).filter(_ => _) }
      const anodes = getNodes(aconf, 1, transport)
      if (anodes.length) {
        // we simply ask the authrority node
        const res = await handleRequest([request], anodes[0], aconf, transport)
        return res[0]
      }
    }
    throw new Error('The nodes responded with ' + Object.keys(groups).length + ' different answers and there is no authroityNode to resolve the conflict! ')
  }
  return responses[0]
}

/**
 * handles a one single request and updates the stats
 */
async function handleRequest(request: RPCRequest[], node: IN3NodeConfig, conf: IN3Config, transport: Transport, excludes?: string[]): Promise<RPCResponse[]> {
  const start = Date.now()
  const weights = conf.servers[conf.chainId].weights || (conf.servers[conf.chainId].weights = {})
  const stats: IN3NodeWeight = weights[node.address] || (weights[node.address] = {})

  try {
    // make sure the requests are valid
    request.forEach(r => {
      r.jsonrpc = r.jsonrpc || '2.0'
      r.id = r.id || idCount++

      const in3: IN3RPCRequestConfig = {}
      if (conf.chainId && canMultiChain(node))
        in3.chainId = conf.chainId

      // if we request proof ...
      if (conf.proof && canProof(node)) {
        // .. we set the verificationtype
        in3.verification = conf.signatureCount ? 'proofWithSignature' : 'proof'
        if (conf.signatureCount)
          // if signatures are requested, we choose some random nodes and create a list of their addresses
          in3.signatures = getNodes(conf, conf.signatureCount, transport).map(_ => _.address)
      }

      if (Object.keys(in3).length)
        r.in3 = { ...in3, ...(r.in3 || {}) }
    })

    // send the request to the server with a timeout
    const res = await transport.handle(node.url, request, conf.timeout)
    const responses = (Array.isArray(res) ? res : [res]) as RPCResponse[]

    // update stats
    stats.responseCount = (stats.responseCount || 0) + 1
    stats.avgResponseTime = ((stats.avgResponseTime || 0) * (stats.responseCount - 1) + Date.now() - start) / stats.responseCount
    stats.lastRequest = start
    responses.forEach(_ => _.in3Node = node)
    return responses
  }
  catch (err) {
    // locally blacklist this node for one hour
    stats.blacklistedUntil = Date.now() + 3600000

    // so the node did not answer, let's find a different one
    const other = getNodes(conf, 1, transport, excludes)
    if (!other.length)
      throw new Error('The node ' + node.url + ' did not respond correctly (' + err + ') but there is no other node to ask now!')
    return handleRequest(request, other[0], conf, transport, [...excludes, other[0].address])
  }
}



/**
 * calculates the weight of a node 
 */
function getWeight(weight: IN3NodeWeight, node: IN3NodeConfig) {
  return (weight.weight === undefined ? 1 : weight.weight)
    * (node.deposit || 1)
    * (weight.avgResponseTime ? 1 / (weight.avgResponseTime / 500) : 1)
}

/**
 * finds nodes based on the config
 */
function getNodes(config: IN3Config, count: number, transport: Transport, excludes?: string[]) {
  const now = Date.now()

  const chain = config.servers[config.chainId]

  // prefilter for chain && minDeposit && excludes
  const nodes = chain.nodeList.filter(n =>
    n.chainIds.indexOf(config.chainId) >= 0 && // check chain
    n.deposit >= config.minDeposit &&  // check deposit
    (!excludes || excludes.indexOf(n.address) === -1) && // check excluded addresses (because of recursive calls)
    (!chain.weights || ((chain.weights[n.address] || {}).blacklistedUntil || 0) < now) // check blacklist
  )

  if (nodes.length === 0)
    throw new Error('No nodes found that fullfill the filter criteria ')

  // in case we don't have enough nodes to randomize, we just need to accept the list as is
  if (nodes.length <= count)
    return nodes

  // get the chain specifig config
  const s = config.servers[config.chainId]

  // create weights for the nodes
  const weights = nodes.map(_ => ({ s: 0, w: getWeight((s.weights && s.weights[_.address]) || {}, _) }))
  weights.forEach((_, i) => _.s = i && weights[i - 1].s + weights[i - 1].w)
  const total = weights[nodes.length - 1].s + weights[nodes.length - 1].w

  // fill from random picks
  const res: IN3NodeConfig[] = []
  const random = transport.random(count)

  for (let i = 0; i < count; i++) {
    let r = random[i] * total
    const index = weights.findIndex(_ => _.s > r) - 1
    const node = index < 0 ? nodes[nodes.length - 1] : nodes[index]
    if (res.indexOf(node) >= 0)
      i--
    else
      res.push(node)
  }

  return res
}

function cleanResult(r: RPCResponse) {
  return r.error
    ? { jsonrpc: r.jsonrpc, id: r.id, error: r.error }
    : { jsonrpc: r.jsonrpc, id: r.id, result: r.result }
}