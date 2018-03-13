import { N3Config, RPCRequest, RPCResponse, N3NodeConfig, N3NodeWeight } from '../types/config';
import axios from 'axios';


/**
 * Client for N3.
 * 
 */
export class Client {

  private defConfig: N3Config

  public constructor(config?: Partial<N3Config>) {
    this.defConfig = {
      minDeposit: 0,
      requestCount: 3,
      chainId: '0x01',
      ... (config || {})
    }
  }

  public async updateNodeList() {
    throw new Error('updateNodeList is not implemented yet')
  }


  /**
   * sends a request.
   * If the callback is given it will be called with the response, if not a Promise will be returned.
   */
  public send(request: RPCRequest[] | RPCRequest, callback?: (err: Error, response: RPCResponse | RPCResponse[]) => void, config?: Partial<N3Config>): void | Promise<RPCResponse | RPCResponse[]> {
    const p = this.sendIntern(Array.isArray(request) ? request : [request], config ? { ...this.defConfig, ...config } : this.defConfig)
    if (callback)
      p.then(_ => callback(null, Array.isArray(request) ? _ : _[0]), callback as any)
    else
      return p.then(_ => Array.isArray(request) ? _ : _[0])
  }


  private async sendIntern(requests: RPCRequest[], conf: N3Config, prevExcludes?: string[]): Promise<RPCResponse[]> {

    // check nodeList
    if (!this.defConfig.nodeList || !this.defConfig.nodeList.length)
      await this.updateNodeList()

    // find some random nodes
    const nodes = getNodes(conf, conf.requestCount)
    const excludes = [...(prevExcludes || []), ...nodes.map(_ => _.address)].filter((e, i, a) => a.indexOf(e) === i)

    // merge config
    const responses = await Promise.all(nodes.map(_ => handleRequest(requests, _, conf, excludes)))

    // now compare the result
    const result = await Promise.all(requests.map((req, i) => mergeResults(req, responses.map(_ => _[i]), conf)))
    return result

  }


}


async function mergeResults(request: RPCRequest, responses: RPCResponse[], conf: N3Config) {
  if (responses.length == 1) return responses[0]
  if (request.method === 'eth_blockNumber')
    // we take the highest!
    return { ...responses[0], result: '0x' + responses.map(_ => parseInt(_.result as any)).reduce((p, v) => v > p ? v : p, 0).toString(16) }

  // how many different results do we have?
  const groups = responses.reduce((g, r) => {
    const k = JSON.stringify(r.result || (r.error && 'error'))
    const list = g[k] || (g[k] = [])
    list.push(r)
    return g
  }, {})

  if (Object.keys(groups).length > 1) {
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

async function handleRequest(request: RPCRequest[], node: N3NodeConfig, conf: N3Config, excludes?: string[]): Promise<RPCResponse[]> {
  const start = Date.now()
  const weights = conf.weights || (conf.weights = {})
  const stats: N3NodeWeight = weights[node.address] || (weights[node.address] = {})

  try {
    const res = await axios.post(node.url, request, { timeout: conf.timeout || 1000 })
    const responses = (Array.isArray(res.data) ? res.data : [res.data]) as RPCResponse[]
    stats.responseCount = (stats.responseCount || 0) + 1
    stats.avgResponseTime = ((stats.avgResponseTime || 0) * (stats.responseCount - 1) + Date.now()) / stats.responseCount
    stats.lastRequest = start
    responses.forEach(_ => _.w3Node = node)
    return responses
  }
  catch (err) {
    // so the node did not answer, let's find a different one
    const other = getNodes(conf, 1, excludes)
    if (!other.length)
      throw new Error('The node ' + node.url + ' did not respond correctly (' + err + ') but there is no other node to ask now!')
    return handleRequest(request, other[0], conf, [...excludes, other[0].address])
  }
}




function getWeight(weight: N3NodeWeight, node: N3NodeConfig) {
  return (weight.weight === undefined ? 1 : weight.weight)
    * (node.deposit || 1)
    * (weight.avgResponseTime ? 1 / (weight.avgResponseTime / 500) : 1)
}

function getNodes(config: N3Config, count: number, excludes?: string[]) {
  // prefilter for chain && minDeposit && excludes
  const nodes = config.nodeList.filter(n => n.chainIds.indexOf(config.chainId) >= 0 && n.deposit >= config.minDeposit && (!excludes || excludes.indexOf(n.address) === -1))

  if (nodes.length <= count)
    return nodes

  const weights = nodes.map(_ => ({ s: 0, w: getWeight((config.weights && config.weights[_.address]) || {}, _) }))
  weights.forEach((_, i) => _.s = i && weights[i - 1].s + weights[i - 1].w)
  const total = weights[nodes.length - 1].s + weights[nodes.length - 1].w

  const res: N3NodeConfig[] = []
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