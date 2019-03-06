/***********************************************************
* This file is part of the Slock.it IoT Layer.             *
* The Slock.it IoT Layer contains:                         *
*   - USN (Universal Sharing Network)                      *
*   - INCUBED (Trustless INcentivized remote Node Network) *
************************************************************
* Copyright (C) 2016 - 2018 Slock.it GmbH                  *
* All Rights Reserved.                                     *
************************************************************
* You may use, distribute and modify this code under the   *
* terms of the license contract you have concluded with    *
* Slock.it GmbH.                                           *
* For information about liability, maintenance etc. also   *
* refer to the contract concluded with Slock.it GmbH.      *
************************************************************
* For more information, please refer to https://slock.it   *
* For questions, please contact info@slock.it              *
***********************************************************/

import { IN3Config, RPCRequest, RPCResponse, IN3NodeConfig, IN3NodeWeight, IN3RPCRequestConfig, ServerList } from '../types/types'
import { verifyProof, getModule } from './modules'
import { canMultiChain, canProof } from './serverList'
import { Transport, AxiosTransport } from '../util/transport'
import { getChainData } from '../modules/eth/chainData' // this is an exception, because if we don't know anything about the chain, we must use eth
import { toChecksumAddress, keccak256, hashPersonalMessage, ecsign, toRpcSig } from 'ethereumjs-util'
import { toHex, toNumber, toMinHex, toBuffer } from '../util/util'
import { resolveRefs } from '../util/cbor'
import { EventEmitter } from 'events'
import ChainContext from './ChainContext'
import { adjustConfig } from './configHandler'
import axios from 'axios'
import { EthereumProvider } from './provider'

import EthAPI from '../modules/eth/api'

const defaultConfig = require('./defaultConfig.json')
const CACHEABLE = ['ipfs_get', 'web3_clientVersion', 'web3_sha3', 'net_version', 'eth_protocolVersion', 'eth_coinbase', 'eth_gasPrice', 'eth_accounts', 'eth_getBalance', 'eth_getStorageAt', 'eth_getTransactionCount', 'eth_getBlockTransactionCountByHash', 'eth_getBlockTransactionCountByNumber',
  'eth_getUncleCountByBlockHash', 'eth_getUncleCountByBlockNumber', 'eth_getCode', 'eth_sign', 'eth_call', 'eth_estimateGas', 'eth_getBlockByHash', 'eth_getBlockByNumber', 'eth_getTransactionByHash', 'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex', 'eth_getTransactionReceipt', 'eth_getUncleByBlockHashAndIndex', 'eth_getUncleByBlockNumberAndIndex', 'eth_getCompilers', 'eth_compileLLL', 'eth_compileSolidity', 'eth_compileSerpent', 'eth_getLogs', 'eth_getProof']

/** special Error for making sure the correct node is blacklisted */
export class BlackListError extends Error {
  addresses: string[]
  constructor(msg: string, addresses: string[]) {
    super(msg)
    this.addresses = addresses
  }
}
/**
 * Client for N3.
 *
 */
export default class Client extends EventEmitter {

  // APIS
  public eth: EthAPI



  public defConfig: IN3Config
  private transport: Transport
  private chains: { [key: string]: ChainContext }



  /**
   * creates a new Client.
   * @param config the configuration
   * @param transport a optional transport-object. default: AxiosTransport
   */
  public constructor(config: Partial<IN3Config> = {}, transport?: Transport) {
    super()
    if (config && config.autoConfig)
      this.addListener('beforeRequest', adjustConfig)
    this.transport = transport || new AxiosTransport(config.format || 'json')
    this.defConfig = {
      ...defaultConfig,
      ...config,
      servers: {
        ...defaultConfig.servers,
        ...((config && config.servers) || {})
      }
    }
    verifyConfig(this.defConfig)
    this.eth = new EthAPI(this)
    this.chains = {}
  }

  //create a web3 Provider
  createWeb3Provider() {
    const provider = new EthereumProvider(this, 'EthProvider')
    return provider
  }



  getChainContext(chainId: string) {
    if (this.chains[chainId])
      return this.chains[chainId]

    const chainConf = this.defConfig.servers[chainId]
    if (!chainConf) throw new Error('chainid ' + chainId + ' does not exist in config!')

    return this.chains[chainId] = getModule(chainConf.verifier || 'eth').createChainContext(this, chainId, chainConf.chainSpec)
  }

  get config() {
    return this.defConfig
  }

  set config(val) {
    this.defConfig = val
    verifyConfig(this.defConfig)
  }

  /**
   * fetches the nodeList from the servers.
   * @param chainId if given, the list for the given chainId will be updated otherwise the chainId is taken from the config
   */
  public async updateNodeList(chainId?: string, conf?: Partial<IN3Config>, retryCount = 5): Promise<void> {
    this.emit('nodeUpdateStarted', { chainId, conf, retryCount })
    const config = { ...this.defConfig, ...verifyConfig(conf) }
    const chain = toMinHex(chainId || this.defConfig.chainId || '0x1')
    if (!chain) throw new Error('No ChainId found to update')

    const servers = this.defConfig.servers[chain] || (this.defConfig.servers[chain] = {})

    // step one : if we don't have the contract yet, we need to find the chain Registry
    if (!servers.contract) {

      // find main bootNodes
      if (!this.defConfig.servers[this.defConfig.mainChain])
        throw new Error('There are no bootnodes configured for chain ' + this.defConfig.mainChain)

      // fetch the chain-definition
      const chainData = await getChainData(this, chain, config)

      // fill the data
      servers.contract = chainData.registryContract
      servers.contractChain = chainData.contractChain

      // in the beginning we take the bootnodes as nodelist, but they will overridden after the update
      servers.nodeList = chainData.bootNodes.map(_ => ({
        address: toChecksumAddress(_.split(':')[0]),
        chainIds: [chain],
        url: _.substr(_.indexOf(':') + 1),
        deposit: 0
      }))
    }

    // create a random seed which ensures the deterministic nature of even a partly list.
    const seed = '0x' + keccak256('0x' + Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).toString('hex')

    const nlResponse = await this.sendRPC(
      'in3_nodeList',
      [this.defConfig.nodeLimit || 0, seed, servers.initAddresses || []],
      chain, conf)
    const nl = nlResponse.result as ServerList


    if (config.proof && config.proof != 'none' && nl.contract.toLowerCase() !== servers.contract.toLowerCase()) {
      // the server gave us the wrong contract!
      // should we retry?
      if (retryCount)
        return this.updateNodeList(chain, conf, retryCount - 1)
      throw new Error('The server responded with the wrong contract-address : ' + nl.contract)

    }

    if (servers.lastBlock && servers.lastBlock > nl.lastBlockNumber)
      throw new Error('The new nodelist has an older blockNumber than the last known!')

    servers.nodeList = nl.nodes
    servers.lastBlock = nl.lastBlockNumber

    this.emit('nodeUpdateFinished', { chainId, conf, retryCount, nodeList: nl, nlResponse })
  }

  /**
   * sends a simply RPC-Request
   * @param method the method
   * @param params the params
   * @param chain a optional chainId (default: chainId from config)
   * @param config optional config-params overridnig the client config
   */
  public async sendRPC(method: string, params: any[] = [], chain?: string, config?: Partial<IN3Config>) {
    return this.send({ jsonrpc: '2.0', method, params, id: idCount++ }, null, { chainId: chain || this.defConfig.chainId, ...config }) as Promise<RPCResponse>
  }

  /**
   * sends a simply RPC-Request
   * @param method the method
   * @param params the params
   * @param chain a optional chainId (default: chainId from config)
   * @param config optional config-params overridnig the client config
   */
  public async call(method: string, params: any, chain?: string, config?: Partial<IN3Config>) {
    return this.sendRPC(method, params, chain, config).then(_ => _.error ? Promise.reject(_.error) : _.result)
  }



  /**
   * sends one or a multiple requests.
   * if the request is a array the response will be a array as well.
   * If the callback is given it will be called with the response, if not a Promise will be returned.
   * This function supports callback so it can be used as a Provider for the web3.
   */
  public send(request: RPCRequest[] | RPCRequest, callback?: (err: Error, response: RPCResponse | RPCResponse[]) => void, config?: Partial<IN3Config>): Promise<RPCResponse | RPCResponse[]> {
    const p = this.sendIntern(Array.isArray(request) ? request : [request], config ? { ...this.defConfig, ...verifyConfig(config) } : { ...this.defConfig })
    if (callback)
      p.then(_ => {
        this.emit('afterRequest', { request, result: Array.isArray(request) ? _ : _[0] })
        callback(null, Array.isArray(request) ? _ : _[0])
      }, err => {
        this.emit('error', { request, err })
        callback(err, null)
      })
    else
      return p.then(_ => Array.isArray(request) ? _ : _[0]).then(result => {
        this.emit('afterRequest', { request, result })
        return result
      })
  }

  /**
   * clears all stats and weights, like blocklisted nodes
   */
  public clearStats() {
    Object.keys(this.defConfig.servers).forEach(s => delete this.defConfig.servers[s].weights)
  }

  /** returns the current nodeList for the chainId specified in the config. If needed it will fetch the nodelist from the server first. */
  private async getNodeList(conf: IN3Config) {
    const c = { ...this.defConfig, ...conf }
    if (!c.chainId)
      throw new Error('no chainId')
    const server = c.servers[c.chainId]

    if (!server || server.needsUpdate) {
      server && (server.needsUpdate = false)
      await this.updateNodeList(c.chainId)
    }
    const list = c.servers[c.chainId].nodeList
    if (!list || list.length === 0)
      throw new Error('No NodeList found for chain ' + c.chainId)

    return list

  }

  /**
   * executes the requests
   * @param requests requests
   * @param conf full configuration
   * @param prevExcludes list of nodes to exclude
   */
  private async sendIntern(requests: RPCRequest[], conf: IN3Config, prevExcludes?: string[]): Promise<RPCResponse[]> {

    // we trigger an event, so event-handlers can adjust the config
    this.emit('beforeRequest', { requests, conf })

    // filter requests are handled internally and externally
    const internResponses: Promise<RPCResponse>[] = []
    const externRequests: RPCRequest[] = []
    const ctx = this.getChainContext(conf.chainId)
    requests.forEach(r => {
      const res = ctx.handleIntern(r)
      if (res) internResponses.push(res)
      else externRequests.push(r)
    })

    // only intern Requests
    if (externRequests.length === 0)
      return Promise.all(internResponses)

    // check nodeList and update if needed
    await this.getNodeList(conf)

    // find some random nodes
    const nodes = getNodes(conf, conf.requestCount, this.transport)

    // merge the given excludes with the choosen nodes, so we know, we will ask them again later.
    const excludes = [...(prevExcludes || []), ...nodes.map(_ => _.address)].filter((e, i, a) => a.indexOf(e) === i)

    // get the verified responses from the nodes
    let responses: RPCResponse[][] = null
    try {
      responses = await Promise.all(nodes.map(_ => handleRequest(externRequests, _, conf, this.transport, this.getChainContext(conf.chainId), [...excludes])))
    }
    catch (ex) {
      // we may retry without proof in order to handle this error
      if (conf.proof && conf.proof != 'none' && conf.retryWithoutProof)
        responses = await Promise.all(nodes.map(_ => handleRequest(externRequests, _, { ...conf, proof: 'none' }, this.transport, this.getChainContext(conf.chainId), [...excludes])))
      else
        throw ex
    }

    // merge the result
    const result: RPCResponse[] = await Promise.all(
      externRequests.map((req, i) => mergeResults(req, responses.map(_ => _[i]), conf, this.transport, this.getChainContext(conf.chainId)))
    )

    checkForAutoUpdates(conf, result, this)

    // merge the intern and extern results
    if (internResponses.length) {
      const result2 = await Promise.all(internResponses)
      return requests.map(r => result.find(_ => _.id === r.id) || result2.find(_ => _.id === r.id)).map(conf.keepIn3 ? _ => _ : cleanResult)
    }
    else
      return conf.keepIn3 ? result : result.map(cleanResult)
  }

}

let idCount = 1

function checkForAutoUpdates(conf: IN3Config, responses: RPCResponse[], client: Client) {
  // do we have a lastNodelist? (and it's not a nodeList itself)
  if (conf.autoUpdateList && responses.find(_ =>
    _.result && !(_.result.contract && _.result.totalServers && _.result.nodes) && _.in3 && _.in3.lastNodeList > 0)) {

    const blockNumber = responses.reduce((p, c) => Math.max(toNumber(c.in3 && c.in3.lastNodeList), p), 0)
    const lastUpdate = conf.servers[conf.chainId].lastBlock
    if (blockNumber > lastUpdate) {
      conf.servers[conf.chainId].lastBlock = blockNumber
      client.updateNodeList(conf.chainId).catch(err => {
        client.emit('error', err)
        conf.servers[conf.chainId].lastBlock = lastUpdate
        console.error('Error updating the nodeList!')
      })
    }
  }
}

/**
 * merges the results of all responses to one valid one.
 */
async function mergeResults(request: RPCRequest, responses: RPCResponse[], conf: IN3Config, transport: Transport, cache: ChainContext) {

  // if only one left, this is the response
  if (responses.length === 1) return responses[0]

  // no valid response left, means we can not use it.
  // TODO maybe we should handle this differently by aquirung different nodes then.
  if (responses.length === 0) throw new Error('There are no valid responses left')

  // for blocknumbers, we simply ake the highest!
  // TODO check error and maybe even blocknumbers in the future
  if (request.method === 'eth_blockNumber')
    return { ...responses[0], result: '0x' + Math.max(...responses.map(_ => parseInt(_.result))).toString(16) }

  // how many different results do we have?
  const groups = responses.reduce((g, r) => {
    const k = JSON.stringify(r.result || (r.error && 'error'))
    const list = g[k] || (g[k] = [])
    list.push(r)
    return g
  }, {})

  // do we have responses with proofes?
  const verifiedResponse = responses.find(_ => _.in3 && !!_.in3.proof)

  // TODO, what if we get different verified responses (like somebody signed a different blockhash)
  // if we have different result and none if them has a proof, we may want to ask the authorities
  if (Object.keys(groups).length > 1 && !verifiedResponse) {
    // there are more then one answer!
    // how are we going to handle the conflict?
    if (conf.servers[conf.chainId].nodeAuthorities && conf.servers[conf.chainId].nodeAuthorities.length) {
      // if we have authroities set, we will choose from them
      const aconf = { ...conf, nodeList: conf.servers[conf.chainId].nodeAuthorities.map(a => conf.servers[conf.chainId].nodeList.find(_ => _.address === a)).filter(_ => _) }
      const anodes = getNodes(aconf, 1, transport)
      if (anodes.length)
        // we simply ask the authrority node
        return await handleRequest([request], anodes[0], aconf, transport, cache).then(_ => _[0])
    }

    // hmmm. what else can we do now?
    // TODO maybe we can support a simple consenus and go with the majority.
    throw new Error('The nodes responded with ' + Object.keys(groups).length + ' different answers and there is no authroityNode to resolve the conflict! ')
  }

  // if we have a verified Response, we return this, if not, we simply take the first.
  return verifiedResponse || responses[0]
}

/**
 * executes a one single request for one node and updates the stats
 */
async function handleRequest(request: RPCRequest[], node: IN3NodeConfig, conf: IN3Config, transport: Transport, ctx: ChainContext, excludes?: string[], retryCount = 0): Promise<RPCResponse[]> {
  if (!retryCount) retryCount = (conf.maxAttempts || 2) - 1
  // keep the timestamp in order to calc the avgResponseTime

  const start = Date.now()
  // get the existing weights
  const weights = conf.servers[conf.chainId].weights || (conf.servers[conf.chainId].weights = {})
  // and create one for the node if does not exist yet
  const stats: IN3NodeWeight = weights[node.address] || (weights[node.address] = {})

  try {
    const cacheEntries = request.map(r => {
      // make sure the requests are valid
      r.jsonrpc = r.jsonrpc || '2.0'
      r.id = r.id || idCount++

      // append the in3-config
      const in3: IN3RPCRequestConfig = {} as any

      // only if the node supports chainId, we add it, because if the node is a simple remote-server it might refuse the request with additional keys
      if (conf.chainId && canMultiChain(node))
        in3.chainId = conf.chainId

      // tell server to return finality blocks
      if (conf.finality)
        in3.finality = conf.finality

      // tell server to replace latest with a older block
      if (conf.replaceLatestBlock)
        in3.latestBlock = conf.replaceLatestBlock

      // if we request proof and the node can handle it ...
      if (conf.proof && conf.proof != 'none' && canProof(node) && r.params.indexOf('pending') < 0) {

        // activate Refs
        if (conf.format === 'jsonRef')
          in3.useRef = true

        if (conf.proof === 'full')
          in3.useFullProof = true

        // add existing blockhashes
        if (conf.verifiedHashes)
          in3.verifiedHashes = conf.verifiedHashes

        // .. we set the verificationtype
        in3.verification = conf.signatureCount ? 'proofWithSignature' : 'proof'
        if (conf.signatureCount)
          // if signatures are requested, we choose some random nodes and create a list of their addresses
          in3.signatures = getNodes(conf, conf.signatureCount, transport).map(_ => toChecksumAddress(_.address))

        // ask the server to include the code
        if (conf.includeCode)
          in3.includeCode = true
      }

      // only if there is something to set, we will add the in3-key and merge it
      if (Object.keys(in3).length)
        r.in3 = { ...in3, ...r.in3 }

      // sign it?
      if (conf.key) {
        const sig = ecsign(hashPersonalMessage(Buffer.from(JSON.stringify(r))), conf.key = toBuffer(conf.key), 1)
        r.in3.clientSignature = toRpcSig(sig.v, sig.r, sig.s, 1)
      }

      // prepare cache-entry
      if (conf.cacheTimeout && CACHEABLE.indexOf(r.method) >= 0) {
        const key = r.method + r.params.map(_ => _.toString()).join()
        const content = ctx.getFromCache(key)
        const json = content && JSON.parse(content)
        return { key, content: json && json.r, ts: json && json.t }
      }
      return null
    })

    // we will sennd all non cachable requests or the ones that timedout
    const toSend = request.filter((r, i) => !cacheEntries[i] || !cacheEntries[i].ts || cacheEntries[i].ts + conf.cacheTimeout * 1000 < start)
    let resultsFromCache = false

    // send the request to the server with a timeout
    const responses = toSend.length == 0 ? [] : resolveRefs(await transport.handle(node.url, toSend, conf.timeout)
      .then(
        _ => Array.isArray(_) ? _ : [_],
        err => transport.isOnline().then(o => {
          // if we are not online we can check if the cache still contains all the results and use it.
          if (o) throw err
          resultsFromCache = true
          return toSend.map(r => {
            const i = request.findIndex(_ => _.id === r.id)
            if (i >= 0 && cacheEntries[i] && cacheEntries[i].content)
              return {
                id: r.id,
                jsonrpc: r.jsonrpc,
                result: cacheEntries[i].content
              } as RPCResponse
            else
              throw err
          })
        })
      ))

    // update stats
    if (!resultsFromCache && responses.length) {
      stats.responseCount = (stats.responseCount || 0) + 1
      stats.avgResponseTime = ((stats.avgResponseTime || 0) * (stats.responseCount - 1) + Date.now() - start) / stats.responseCount
      stats.lastRequest = start

      // assign the used node to each response
      responses.forEach(_ => _.in3Node = node)

      // verify each response by checking the proof. This will throw if it can't be verified
      await Promise.all(responses.map((response, i) => verifyProof(
        request[i],
        response,
        // TODO if we ask for a proof of a transactionHash, which does exist, we will not get a proof, which means, this would fail.
        // maybe we can still deliver a proof, but without data
        !request[i].in3 || (request[i].in3.verification || 'never') === 'never',
        ctx)))

      // add them to cache
      if (conf.cacheTimeout)
        responses.filter(_ => _.result).forEach(res => {
          const cacheEntry = cacheEntries[request.findIndex(_ => _.id === res.id)]
          if (cacheEntry)
            ctx.putInCache(cacheEntry.key, JSON.stringify({ t: start, r: res.result }))
        })
    }

    // merge cache and reponses
    const allResponses = request.map((r, i) => responses.find(_ => _.id === r.id) || (cacheEntries[i] && cacheEntries[i].content && {
      id: r.id,
      jsonrpc: r.jsonrpc,
      result: cacheEntries[i].content
    }))

    // assign the used node to each response
    allResponses.forEach(_ => _.in3Node = node)

    return allResponses
  }
  catch (err) {
    // log errors
    if (conf.loggerUrl)
      axios.post(conf.loggerUrl, { level: 'error', message: 'error handling request for ' + node.url + ' : ' + err.message + ' (' + err.stack + ') ', meta: request })
        .then(_ => _, console.log('Error logging (' + err.message + ') : ', node.url, request) as any)

    if (err instanceof BlackListError) {

      const n = excludes.indexOf(node.address)
      if (n >= 0)
        excludes.splice(n, 1)

      err.addresses.forEach(adr => {
        conf.servers[conf.chainId].weights[adr].blacklistedUntil = Date.now() + 3600000 * 2
      })
    }
    else if (err.message.indexOf('cannot sign') >= 0 && err.message.indexOf('blockHeight') > 0) {
      // retry without signature
      let tryAgainWithoutSignature = false
      request.forEach(r => {
        if (r.in3 && r.in3.verification === 'proofWithSignature') {
          r.in3.verification = 'proof'
          delete r.in3.signatures
          tryAgainWithoutSignature = true
        }
      })

      if (tryAgainWithoutSignature && retryCount > 0)
        return handleRequest(request, node, { ...conf, signatureCount: 0 }, transport, ctx, excludes, retryCount - 1)

    }
    else {
      // let us check first, if we are the problem.

      // are we online?
      if (! await transport.isOnline())
        throw new Error('Currently there is no online-connection!')

      // locally blacklist this node for one hour if it did not respond within the timeout or could not be verified
      stats.blacklistedUntil = Date.now() + 3600000

    }

    let otherNodes: IN3NodeConfig[] = null

    try {
      // so the node did not answer, let's find a different one
      otherNodes = getNodes(conf, 1, transport, [...excludes, node.address])
    } catch (x) {
      // if we can't get nodes, it's because there none left to ask
      throw new Error('tried ' + request.map(_ => _.method).join() + ' but failed and can not recover (' + x.message + ') from wrong response of node ' + node.url + ' did not respond correctly : ' + err)
    }

    if (!otherNodes.length)
      throw new Error('The node ' + node.url + ' did not respond correctly (' + err + ') but there is no other node to ask now!')
    else if (!retryCount)
      throw new Error('The node ' + node.url + ' did not respond correctly (' + err + ') but we reached the max number of attempts!')
    // and we retry but keep a list of excludes to make sure we won't run into loops
    return handleRequest(request, otherNodes[0], conf, transport, ctx, [...excludes, node.address, otherNodes[0].address], retryCount - 1)
  }
}

/**
 * calculates the weight of a node
 * weight = customWeight * (1 + deposit) * 500/avgResponseTime
 */
function getWeight(weight: IN3NodeWeight, node: IN3NodeConfig) {
  return (weight.weight === undefined ? 1 : weight.weight)
    * (node.capacity || 1)
    * (500 / (weight.avgResponseTime || 500))
}

/**
 * finds nodes based on the config
 */
function getNodes(config: IN3Config, count: number, transport: Transport, excludes?: string[]) {

  const now = Date.now()
  // get the current chain-configuration, which was previously updated
  const chain = config.servers[config.chainId]

  // filter-function for the nodeList
  const filter = (n: IN3NodeConfig) =>
    n.deposit >= config.minDeposit &&  // check deposit
    (!excludes || excludes.indexOf(n.address) === -1) && // check excluded addresses (because of recursive calls)
    (!chain.weights || ((chain.weights[n.address] || {}).blacklistedUntil || 0) < now)

  // prefilter for minDeposit && excludes && blacklisted
  let nodes = chain.nodeList.filter(filter) // check blacklist

  if (nodes.length === 0) {
    const blackListed = Object.keys(chain.weights).filter(_ => (!excludes || excludes.indexOf(_) === -1) && chain.weights[_].blacklistedUntil > now)

    // if more than 50% of the available nodes are currently blacklisted, we might want to clean up our blacklist
    if (blackListed.length > chain.nodeList.length / 2) {
      blackListed.forEach(_ => chain.weights[_].blacklistedUntil = 0)
      nodes = chain.nodeList.filter(filter)
    }
    else
      throw new Error('No nodes found that fullfill the filter criteria ')
  }

  // in case we don't have enough nodes to randomize, we just need to accept the list as is
  if (nodes.length <= count)
    return nodes

  // create a arraw of weights for the nodes
  const weights = nodes.map(_ => ({ s: 0, w: getWeight((chain.weights && chain.weights[_.address]) || {}, _) }))
  weights.forEach((_, i) => _.s = i && weights[i - 1].s + weights[i - 1].w)
  // calculate the total weight
  const total = weights[nodes.length - 1].s + weights[nodes.length - 1].w

  // fill from random picks
  const res: IN3NodeConfig[] = []
  // ask the transport for a random array. This is done, so the tests may use fixed numbers
  let random = transport.random(count)

  for (let i = 0; i < count; i++) {
    // pick a random value based on the total weight
    const r = random[i] * total
    // find the index of the pick in the weight-array
    const index = weights.findIndex(_ => _.s > r) - 1
    const node = index < 0 ? nodes[nodes.length - 1] : nodes[index]

    // if this node was already picked we need to update our random numbers and try again
    if (res.indexOf(node) >= 0) {
      random = transport.random(count)
      i--
    }
    else
      res.push(node)
  }

  return res
}

function cleanResult(r: RPCResponse): RPCResponse {
  return r.error
    ? { jsonrpc: r.jsonrpc, id: r.id, error: r.error }
    : { jsonrpc: r.jsonrpc, id: r.id, result: r.result }
}

export const aliases = { kovan: '0x2a', tobalaba: '0x44d', main: '0x1', ipfs: '0x7d0', mainnet: '0x1', goerli: '0x5' }

function verifyConfig(conf: Partial<IN3Config>): Partial<IN3Config> {
  if (!conf) return {}
  if (!conf.chainId) return conf
  if (conf.chainId.startsWith('0x')) {
    if (conf.chainId[2] === '0')
      conf.chainId = toMinHex(conf.chainId)
  }
  else if (aliases[conf.chainId])
    conf.chainId = aliases[conf.chainId]
  else throw new Error('the chain ' + conf.chainId + ' can not be resolved')
  return conf
}
