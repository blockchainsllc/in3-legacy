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
import { Transport, AxiosTransport } from '../../types/transport'
import { toHex, BlockData } from '../../client/block';

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
      if (request.method === 'eth_getBlockByNumber' || request.method === 'eth_getBlockByHash')
        return this.handleBlock(request)
      if (request.method === 'eth_getTransactionByHash')
        return this.handeGetTransaction(request)
      if (request.method === 'eth_getTransactionReceipt')
        return this.handeGetTransactionReceipt(request)
      if (request.method === 'eth_call' && this.config.client === 'parity_proofed')
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
    return axios.post(this.config.rpcUrl, toCleanRequest(request)).then(_ => _.data)
  }

  getAllFromServer(request: Partial<RPCRequest>[]): Promise<RPCResponse[]> {
    return request.length
      ? axios.post(this.config.rpcUrl, request.filter(_ => _).map(_ => toCleanRequest({ id: this.counter++, jsonrpc: '2.0', ..._ }))).then(_ => _.data)
      : Promise.resolve([])
  }

  async collectSignatures(addresses: string[], blockNumber: number, hash?: string): Promise<Signature[]> {
    if (!addresses || addresses.length === 0)
      return []
    //      return this.handleSign({ params: [blockNumber, hash] } as any).then(_ => [_.result] as Signature[]).catch(_ => [])
    const nodes = await this.getNodeList(false)
    return Promise.all(addresses.map(address => {
      const config = nodes.getAddress(address)
      if (config)
        return this.transport.handle(config.url, { id: this.counter++, jsonrpc: '2.0', method: 'in3_sign', params: [blockNumber] })
          .then((_: RPCResponse) => _.error ? Promise.reject(_.error) as any : _.result as Signature).catch(_ => '')
    })).then(a => a.filter(_ => _))
  }

  sign(blockHash: string, blockNumber: number): Signature {
    const msgHash = util.sha3('0x' + toHex(blockHash).substr(2).padStart(64, '0') + toHex(blockNumber).substr(2).padStart(64, '0'))
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
      { method: 'eth_getBlockByNumber', params: [request.params[0], false] },
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


  async  handleBlock(request: RPCRequest): Promise<RPCResponse> {
    // ask the server for the block
    const response = await this.getFromServer({ ...request, params: [request.params[0], true] })

    const blockData = response && response.result as any as BlockData

    // if we found the block....
    if (blockData && blockData.number) {

      // create the proof
      response.in3 = {
        proof: {
          type: 'blockProof',
          signatures: await this.collectSignatures(request.in3.signatures, parseInt(blockData.number as any, 10), blockData.hash) as any
        }
      }

      const transactions = blockData.transactions
      if (!request.params[1]) {
        // since we fetched the block with all transactions, but the request said, we only want hashes, we put the full ransactions in the proof and only the hashes in the result.
        (response.in3.proof as any).transactions = transactions
        blockData.transactions = transactions.map(_ => _.hash)
      }
    }

    return response
  }

  async  handeGetTransaction(request: RPCRequest): Promise<RPCResponse> {
    // ask the server for the tx
    const response = await this.getFromServer(request)
    const tx = response && response.result as any
    // if we have a blocknumber, it is mined and we can provide a proof over the blockhash
    if (tx && tx.blockNumber) {
      // get the block including all transactions from the server
      const block = await this.getFromServer({ method: 'eth_getBlockByNumber', params: [toHex(tx.blockNumber), true] }).then(_ => _ && _.result as any)
      if (block)
        // create the proof
        response.in3 = {
          proof: await verify.createTransactionProof(block, request.params[0] as string,
            await this.collectSignatures(request.in3.signatures, tx.blockNumber, block.hash)) as any
        }
    }
    return response
  }


  async  handeGetTransactionReceipt(request: RPCRequest): Promise<RPCResponse> {
    // ask the server for the tx
    const response = await this.getFromServer(request)
    const tx = response && response.result as any
    // if we have a blocknumber, it is mined and we can provide a proof over the blockhash
    if (tx && tx.blockNumber) {
      // get the block including all transactions from the server
      const block = await this.getFromServer({ method: 'eth_getBlockByNumber', params: [toHex(tx.blockNumber), false] }).then(_ => _ && _.result as any)
      if (block) {

        const [signatures, receipts] = await Promise.all([
          this.collectSignatures(request.in3.signatures, tx.blockNumber, block.hash),
          this.getAllFromServer(block.transactions.map(_ => ({ method: 'eth_getTransactionReceipt', params: [_] }))).then(a => a.map(_ => _.result as any))
        ])

        // create the proof
        response.in3 = {
          proof: await verify.createTransactionReceiptProof(
            block,
            receipts,
            request.params[0] as string,
            signatures) as any
        }
      }
    }
    return response
  }



  async  handleCall(request: RPCRequest): Promise<RPCResponse> {
    console.log('handle call', this.config)
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




function toCleanRequest(request: Partial<RPCRequest>): RPCRequest {
  return {
    id: request.id,
    method: request.method,
    params: request.params,
    jsonrpc: request.jsonrpc
  }
}