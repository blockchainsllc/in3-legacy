import { RPCRequest, RPCResponse, Signature } from '../../types/config'
import axios from 'axios'
//import config from '../config'
import * as util from 'ethereumjs-util'
import *  as verify from '../../client/verify'
import * as evm from './evm'
import * as request from 'request';
import { RPCHandler } from '../rpc';
import NodeList from '../../client/nodeList'
import { checkNodeList, getNodeListProof } from '../nodeListUpdater'
import { Transport, AxiosTransport } from '../../types/transport';

const NOT_SUPPORTED = {
  eth_sign: 'a in3-node can not sign Messages, because the no unlocked key is allowed!',
  eth_sendTransaction: 'a in3-node can not sign Transactions, because the no unlocked key is allowed!',
}

/**
 * handles EVM-Calls
 */
export default class EthHandler {
  counter: number
  config: any
  nodeList: NodeList
  transport: Transport

  constructor(config: any, transport?: Transport) {
    this.config = config
    this.transport = transport || new AxiosTransport()
  }

  async handle(request: RPCRequest): Promise<RPCResponse> {
    // check if supported
    const error = NOT_SUPPORTED[request.method]
    if (error) return { id: request.id, error, jsonrpc: request.jsonrpc }

    const in3 = request.in3 || {}
    const proof = in3.verification || 'never'

    // handle special jspn-rpc
    if (proof === 'proof' || proof === 'proofWithSignature') {
      if (request.method === 'eth_getTransactionByHash')
        return this.handeGetTransaction(request)
      if (request.method === 'eth_call')
        return this.handleCall(request)
      if (request.method === 'eth_getCode' || request.method === 'eth_getBalance' || request.method === 'eth_getTransactionCount' || request.method === 'eth_getStorageAt')
        return this.handleAccount(request)
    }

    if (request.method === 'in3_sign')
      return this.handleSign(request)

    return this.getFromServer(request)
  }


  getFromServer(request: Partial<RPCRequest>): Promise<RPCResponse> {
    if (!request.id) request.id = this.counter++
    if (!request.jsonrpc) request.jsonrpc = '2.0'
    return axios.post(this.config.rpcUrl, request).then(_ => _.data)
  }

  getAllFromServer(request: Partial<RPCRequest>[]): Promise<RPCResponse[]> {
    console.log('req:', JSON.stringify(request, null, 2))
    return request.length
      ? axios.post(this.config.rpcUrl, request.filter(_ => _).map(_ => ({ id: this.counter++, jsonrpc: '2.0', ..._ }))).then(_ => _.data)
      : Promise.resolve([])
  }

  async collectSignatures(addresses: string[], blockNumber: number, hash?: string): Promise<Signature[]> {
    if (!addresses || addresses.length === 0)
      return this.handleSign({ params: [blockNumber, hash] } as any).then(_ => [_.result] as Signature[]).catch(_ => [])
    const nodes = await this.getNodeList(false)
    return Promise.all(addresses.map(address => {
      const config = nodes.getAddress(address)
      if (config)
        return this.transport.handle(config.url, { id: this.counter++, jsonrpc: '2.0', method: 'in3_sign', params: [blockNumber] })
          .then((_: RPCResponse) => _.error ? Promise.reject(_.error) as any : _.result as Signature).catch(_ => '')
    })).then(a => a.filter(_ => _))
  }

  sign(blockHash: string, blockNumber: number): Signature {
    const msgHash = util.sha3('0x' + verify.toHex(blockHash).substr(2).padStart(64, '0') + verify.toHex(blockNumber).substr(2).padStart(64, '0'))
    const sig = util.ecsign(msgHash, util.toBuffer(this.config.privateKey))
    return {
      blockHash,
      block: blockNumber,
      r: '0x' + sig.r.toString('hex'),
      s: '0x' + sig.s.toString('hex'),
      v: sig.v,
      msgHash: '0x' + msgHash.toString('hex')
    }
  }

  getNodeList(includeProof: boolean): Promise<NodeList> {
    if (includeProof)
      return getNodeListProof(this, this.nodeList).then(_ => ({ ...this.nodeList, proof: _ }) as any)
    else
      return checkNodeList(this, this.nodeList).then(_ => this.nodeList)
  }


  async  handleSign(request: RPCRequest): Promise<RPCResponse> {
    const [blockNumber, blockResult] = await this.getAllFromServer([
      { method: 'eth_blockNumber', params: [] },
      { method: 'eth_getBlockByNumber', params: [parseInt(request.params[0]), false] },
    ])
    if (blockNumber.error || !blockNumber.result) throw new Error('no current blocknumber detectable ' + blockNumber.error)
    if (blockResult.error || !blockResult.result) throw new Error('requested block could not be found ' + blockResult.error)
    const block = blockResult.result as any
    const age = parseInt(blockNumber.result as any) - parseInt(block.number)
    if (age <= (this.config.minBlockHeight || 6))
      return {
        id: request.id,
        jsonrpc: request.jsonrpc,
        result: this.sign(block.hash, parseInt(block.number)) as any
      }
    else
      throw new Error(' cannot sign for block ' + block.number + ', because the blockHeight is only ' + age + ' but must be at least ' + (this.config.minBlockHeight || 6))
  }



  async  handeGetTransaction(request: RPCRequest): Promise<RPCResponse> {
    // ask the server for the tx
    const response = await this.getFromServer(request)
    const tx = response && response.result as any
    // if we have a blocknumber, it is mined and we can provide a proof over the blockhash
    if (tx && tx.blockNumber) {
      // get the block including all transactions from the server
      const block = await this.getFromServer({ method: 'eth_getBlockByNumber', params: [verify.toHex(tx.blockNumber), true] }).then(_ => _ && _.result as any)
      if (block)
        // create the proof
        response.in3 = {
          proof: await verify.createTransactionProof(block, request.params[0] as string,
            await this.collectSignatures(request.in3.signatures, tx.blockNumber, block.hash)) as any
        }
    }
    return response
  }



  async  handleCall(request: RPCRequest): Promise<RPCResponse> {
    // read the response,blockheader and trace from server
    const [response, blockResponse, trace] = await this.getAllFromServer([
      request,
      { method: 'eth_getBlockByNumber', params: [request.params[1] || 'latest', false] },
      { method: 'trace_call', params: [request.params[0], ['vmTrace'], request.params[1] || 'latest'] }
    ])

    // error checking
    if (response.error) return response
    if (blockResponse.error) throw new Error('Could not get the block for ' + request.params[1] + ':' + blockResponse.error)
    if (trace.error) throw new Error('Could not get the trace :' + trace.error)

    // anaylse the transaction in order to find all needed storage
    const block = blockResponse.result as any
    const neededProof = evm.analyse((trace.result as any).vmTrace, request.params[0].to)

    // ask for proof for the storage
    const [accountProofs, signatures] = await Promise.all([
      this.getAllFromServer(Object.keys(neededProof.accounts).map(adr => (
        { method: 'eth_getProof', params: [toHex(adr, 20), Object.keys(neededProof.accounts[adr].storage).map(_ => toHex(_, 32)), block.number] }
      ))),
      this.collectSignatures(request.in3.signatures, block.number, block.hash)
    ])

    // add the codes to the accounts
    if (request.in3.includeCode) {
      const accounts = accountProofs
        .filter(a => (a.result as any).codeHash !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
      const codes = await this.getAllFromServer(accounts.map(a => ({ method: 'eth_getCode', params: [toHex((a.result as any).address, 20), request.params[1] || 'latest'] })))
      accounts.forEach((r, i) => (accounts[i].result as any).code = codes[i])
    }

    // bundle the answer
    return {
      ...response,
      in3: {
        proof: {
          type: 'callProof',
          block: verify.blockToHex(block),
          signatures,
          accounts: Object.keys(neededProof.accounts).reduce((p, v, i) => { p[v] = accountProofs[i].result; return p }, {})
        }
      }
    }
  }


  /**
   * handle account-base requests.
   */
  async  handleAccount(request: RPCRequest): Promise<RPCResponse> {

    const address = request.params[0] as string
    const blockNr = request.params[request.method === 'eth_getStorageAt' ? 2 : 1] || 'latest'
    const storage = request.method === 'eth_getStorageAt' ? [request.params[1]] : []

    // read the response,blockheader and trace from server
    const [blockResponse, proof, code] = await this.getAllFromServer([
      { method: 'eth_getBlockByNumber', params: [blockNr, false] },
      { method: 'eth_getProof', params: [toHex(address, 20), storage.map(_ => toHex(_, 32)), blockNr] },
      request.method === 'eth_getCode' ? request : null
    ])

    // error checking
    if (blockResponse.error) throw new Error('Could not get the block for ' + request.params[1] + ':' + blockResponse.error)
    if (proof.error) throw new Error('Could not get the proof :' + proof.error)

    // anaylse the transaction in order to find all needed storage
    const block = blockResponse.result as any
    const account = proof.result as any
    let result;
    if (request.method === 'eth_getBalance')
      result = account.balance
    else if (request.method === 'eth_getCode')
      result = code.result
    else if (request.method === 'eth_getTransactionCount')
      result = account.nonce
    else if (request.method === 'eth_getStorageAt')
      result = account.storageProof[0].value

    // bundle the answer
    return {
      id: request.id,
      jsonrpc: '2.0',
      result,
      in3: {
        proof: {
          type: 'accountProof',
          block: verify.blockToHex(block),
          signatures: await this.collectSignatures(request.in3.signatures, block.number, block.hash),
          account: proof.result
        }
      }
    }
  }
}


function toHex(adr: string, len: number) {
  let a = adr.startsWith('0x') ? adr.substr(2) : adr
  if (a.length > len * 2) a = a.substr(0, len * 2)
  while (a.length < len * 2)
    a += '0'
  return '0x' + a
}



