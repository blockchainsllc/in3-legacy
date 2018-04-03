import { RPCRequest, RPCResponse } from '../../types/config'
import config from '../config'
import axios from 'axios'
import * as util from 'ethereumjs-util'
import *  as verify from '../../client/verify'
import * as evm from './evm'
let counter = 1
export async function handle(request: RPCRequest): Promise<RPCResponse> {
  if (request.method === 'eth_getTransactionByHash')
    return handeGetTransaction(request)
  if (request.method === 'eth_call')
    return handleCall(request)

  return getFromServer(request)
}

function getFromServer(request: Partial<RPCRequest>): Promise<RPCResponse> {
  if (!request.id) request.id = counter++
  if (!request.jsonrpc) request.jsonrpc = '2.0'
  return axios.post(config.rpcUrl, request).then(_ => _.data)
}

function getAllFromServer(request: Partial<RPCRequest>[]): Promise<RPCResponse[]> {
  console.log('req:', JSON.stringify(request, null, 2))
  return axios.post(config.rpcUrl, request.map(_ => ({ id: counter++, jsonrpc: '2.0', ..._ }))).then(_ => _.data)
}

async function handeGetTransaction(request: RPCRequest): Promise<RPCResponse> {
  // ask the server for the tx
  const response = await getFromServer(request)
  const tx = response && response.result as any
  // if we have a blocknumber, it is mined and we can provide a proof over the blockhash
  if (tx && tx.blockNumber) {
    // get the block including all transactions from the server
    const block = await getFromServer({ method: 'eth_getBlockByNumber', params: [verify.toHex(tx.blockNumber), true] }).then(_ => _ && _.result as any)
    if (block)
      // create the proof
      response.in3Proof = await verify.createTransactionProof(block, request.params[0] as string, sign(block.hash, tx.blockNumber)) as any
  }
  return response
}

function toHex(adr: string, len: number) {
  let a = adr.startsWith('0x') ? adr.substr(2) : adr
  if (a.length > len * 2) a = a.substr(0, len * 2)
  while (a.length < len * 2)
    a += '0'
  return '0x' + a
}



function sign(blockHash, blockNumber): any {
  const msgHash = util.sha3('0x' + verify.toHex(blockHash).substr(2).padStart(64, '0') + verify.toHex(blockNumber).substr(2).padStart(64, '0'))
  const sig = util.ecsign(msgHash, util.toBuffer(config.privateKey))
  return {
    r: '0x' + sig.r.toString('hex'),
    s: '0x' + sig.s.toString('hex'),
    v: sig.v,
    msgHash: '0x' + msgHash.toString('hex')
  }

}






async function handleCall(request: RPCRequest): Promise<RPCResponse> {
  // read the response,blockheader and trace from server
  const [response, blockResponse, trace] = await getAllFromServer([
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
  const accountProofs = await getAllFromServer(Object.keys(neededProof.accounts).map(adr => (
    { method: 'eth_getProof', params: [toHex(adr, 20), Object.keys(neededProof.accounts[adr].storage).map(_ => toHex(_, 32)), block.number] }
  )))

  // bundle the answer
  return {
    ...response,
    in3Proof: {
      type: 'callProof',
      block: verify.blockToHex(block),
      signature: sign(block.hash, block.number),
      accounts: Object.keys(neededProof.accounts).reduce((p, v, i) => { p[v] = accountProofs[i].result; return p }, {})
    }
  }
} 