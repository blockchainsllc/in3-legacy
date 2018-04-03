import { IN3Config, RPCRequest, RPCResponse, IN3NodeConfig, IN3NodeWeight } from '../types/config';
import axios from 'axios';
import { verifyProof } from './verify'


/**
 * Client for N3.
 * 
 */
export class Client {

  private defConfig: IN3Config

  public constructor(config?: Partial<IN3Config>) {
    this.defConfig = {
      minDeposit: 0,
      requestCount: 3,
      contract: '0xF88e75205BcD029C897700E8ad03050C78611A37',
      chainId: '0x2a',
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
      ... (config || {})
    }
  }

  public async updateNodeList() {
    const count = await this.call(prepareCall(this.defConfig.contract, '0x15625c5e')).then(parseInt)

    const req: RPCRequest[] = []
    for (let i = 0; i < count; i++)
      req.push(prepareCall(this.defConfig.contract, '0x5cf0f357', (i).toString(16).padStart(64, '0')))

    const nodes = await this.send(req, null, { minDeposit: 0 }) as RPCResponse[]
    console.log('nodes:', nodes.map(_ => _.result.toString().substr(2)))
    this.defConfig.nodeList = nodes.map(_ => _.result.toString().substr(2)).map(data => ({
      address: '0x' + data.substr(24, 40),
      owner: '0x' + data.substr(64 + 24, 40),
      deposit: parseInt('0x' + data.substr(64 * 2, 64)),
      unregisterRequestTime: parseInt('0x' + data.substr(64 * 3, 64)),
      chainIds: [('0x' + data.substr(64 * 4, 64)).replace(/0x0+/, '0x')],
      url: decodeURIComponent(data.substr(64 * 7, 2 * parseInt('0x' + data.substr(64 * 6, 64))).replace(/[0-9a-f]{2}/g, '%$&'))
    })
    )
  }

  public async call(request: RPCRequest, config?: Partial<IN3Config>): Promise<string> {
    return (this.send(request, null, { minDeposit: 0 }) as Promise<RPCResponse>)
      .then(_ => _.result + '')
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


  private async sendIntern(requests: RPCRequest[], conf: IN3Config, prevExcludes?: string[]): Promise<RPCResponse[]> {

    // check nodeList
    if (!this.defConfig.nodeList || !this.defConfig.nodeList.length)
      await this.updateNodeList()

    // find some random nodes
    const nodes = getNodes(conf, conf.requestCount)
    const excludes = [...(prevExcludes || []), ...nodes.map(_ => _.address)].filter((e, i, a) => a.indexOf(e) === i)

    // merge config
    const responses = await Promise.all(nodes.map(_ => handleRequest(requests, _, conf, excludes)))

    // now compare the result
    return await Promise.all(requests.map((req, i) => mergeResults(req, responses.map(_ => _[i]), conf))).then(_ => _.map(cleanResult))
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
async function mergeResults(request: RPCRequest, responses: RPCResponse[], conf: IN3Config) {
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
  const verified = (await Promise.all(responses.filter(_ => _.in3Proof).map(r => verifyProof(request, r)))).reduce((p, v) => p && v, true)


  if (Object.keys(groups).length > 1 || !verified) {
    // there are more then one answers!
    // how are we going to handle the conflict?
    if (conf.nodeAuthorities && conf.nodeAuthorities.length) {
      const aconf = { ...conf, nodeList: conf.nodeAuthorities.map(a => conf.nodeList.find(_ => _.address === a)).filter(_ => _) }
      const anodes = getNodes(aconf, 1)
      if (anodes.length) {
        // we simply ask the authrority node
        const res = await handleRequest([request], anodes[0], aconf)
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
async function handleRequest(request: RPCRequest[], node: IN3NodeConfig, conf: IN3Config, excludes?: string[]): Promise<RPCResponse[]> {
  const start = Date.now()
  const weights = conf.weights || (conf.weights = {})
  const stats: IN3NodeWeight = weights[node.address] || (weights[node.address] = {})

  try {
    // make sure the requests are valid
    request.forEach(r => {
      r.jsonrpc = r.jsonrpc || '2.0'
      r.id = r.id || idCount++
    })

    // send the request to the server with a timeout
    const res = await axios.post(node.url, request, { timeout: conf.timeout || 1000 })
    const responses = (Array.isArray(res.data) ? res.data : [res.data]) as RPCResponse[]

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
    const other = getNodes(conf, 1, excludes)
    if (!other.length)
      throw new Error('The node ' + node.url + ' did not respond correctly (' + err + ') but there is no other node to ask now!')
    return handleRequest(request, other[0], conf, [...excludes, other[0].address])
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
function getNodes(config: IN3Config, count: number, excludes?: string[]) {
  const now = Date.now()

  // prefilter for chain && minDeposit && excludes
  const nodes = config.nodeList.filter(n =>
    n.chainIds.indexOf(config.chainId) >= 0 && // check chain
    n.deposit >= config.minDeposit &&  // check deposit
    (!excludes || excludes.indexOf(n.address) === -1) && // check excluded addresses (because of recursive calls)
    (!config.weights || ((config.weights[n.address] || {}).blacklistedUntil || 0) < now) // check blacklist
  )

  // in case we don't have enough nodes to randomize, we just need to accept the list as is
  if (nodes.length <= count)
    return nodes

  // create weights for the nodes
  const weights = nodes.map(_ => ({ s: 0, w: getWeight((config.weights && config.weights[_.address]) || {}, _) }))
  weights.forEach((_, i) => _.s = i && weights[i - 1].s + weights[i - 1].w)
  const total = weights[nodes.length - 1].s + weights[nodes.length - 1].w

  // fill from random picks
  const res: IN3NodeConfig[] = []
  for (let i = 0; i < count; i++) {
    let r = Math.random() * total
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