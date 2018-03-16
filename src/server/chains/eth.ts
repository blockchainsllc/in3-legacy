import { RPCRequest, RPCResponse } from '../../types/config'
import config from '../config'
import axios from 'axios'
import util from 'ethereumjs-util'
import *  as verify from '../../client/verify'
let counter = 1
export async function handle(request: RPCRequest): Promise<RPCResponse> {
  if (request.method === 'eth_getTransactionByHash')
    return handeGetTransaction(request)

  return getFromServer(request)


}

function getFromServer(request: Partial<RPCRequest>): Promise<RPCResponse> {
  if (!request.id) request.id = counter++
  if (!request.jsonrpc) request.jsonrpc = '2.0'
  return axios.post(config.rpcUrl, request).then(_ => _.data)
}

async function handeGetTransaction(request: RPCRequest): Promise<RPCResponse> {
  const response = await getFromServer(request)
  const result = response && response.result as any
  if (result.blockNumber) {
    const block = await getFromServer({ method: 'eth_getBlockByNumber', params: [verify.toHex(result.blockNumber), true] }).then(_ => _ && _.result as any)
    if (block)
      result.in3Proof = await verify.createTransactionProof(block, request.params[0] as string, sign(block.hash, result.blockNumber))
  }
  return result
}



function sign(blockHash, blockNumber): any {
  const msgHash = util.sha3('0x' + verify.toHex(blockHash).substr(2).padStart(64, '0') + verify.toHex(blockNumber).substr(2).padStart(64, '0'))
  return {
    ...util.ecsign(msgHash, util.toBuffer(config.privateKey)),
    msgHash: '0x' + msgHash.toString('hex')
  }

}