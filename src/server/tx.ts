import { simpleEncode, simpleDecode, methodID } from 'ethereumjs-abi'
import { toBuffer, toChecksumAddress, privateToAddress } from 'ethereumjs-util'
import { toHex } from '../client/block'
import { Transport, AxiosTransport } from '../types/transport';
import { RPCResponse } from '../types/config';
import * as ETx from 'ethereumjs-tx'

let idCount = 1
export async function deployContract(url: string, bin: string, txargs?: {
  privateKey: string
  gas: number
  nonce?: number
  gasPrice?: number
  to?: string
  data?: string
  value?: number
  confirm?: boolean
}, transport?: Transport) {
  return sendTransaction(url, { value: 0, ...txargs, data: bin }, transport)
}


export async function callContract(url: string, contract: string, signature: string, args: any[], txargs?: {
  privateKey: string
  gas: number
  nonce?: number
  gasPrice?: number
  to?: string
  data?: string
  value: number
  confirm?: boolean
}, transport?: Transport) {
  if (!transport) transport = new AxiosTransport()
  const data = signature.indexOf('()') >= 0 ? '0x' + methodID(signature.substr(0, signature.length - 2), []).toString('hex') : simpleEncode(signature, ...args)

  if (txargs)
    return sendTransaction(url, { ...txargs, to: contract, data }, transport)

  return simpleDecode(signature, toBuffer(await transport.handle(url, {
    jsonrpc: '2.0',
    id: idCount++,
    method: 'eth_call', params: [{
      to: contract,
      data
    },
      'latest']
  }).then((_: RPCResponse) => _.result + '')))
}

export async function sendTransaction(url: string, txargs: {
  privateKey: string
  gas: number
  nonce?: number
  gasPrice?: number
  to?: string
  data: string
  value: number
  confirm?: boolean
}, transport?: Transport): Promise<{
  blockHash: string,
  blockNumber: string,
  contractAddress: string,
  cumulativeGasUsed: string,
  gasUsed: string,
  logs: string[],
  logsBloom: string,
  root: string,
  status: string,
  transactionHash: string,
  transactionIndex: string
}> {

  if (!transport) transport = new AxiosTransport()
  const key = toBuffer(txargs.privateKey)
  const from = toChecksumAddress(privateToAddress(key).toString('hex'))

  // get the nonce
  if (!txargs.nonce)
    txargs.nonce = await transport.handle(url, {
      jsonrpc: '2.0',
      id: idCount++,
      method: 'eth_getTransactionCount',
      params: [from, 'latest']
    }).then((_: RPCResponse) => parseInt(_.result as any))

  // get the nonce
  if (!txargs.gasPrice)
    txargs.gasPrice = await transport.handle(url, {
      jsonrpc: '2.0',
      id: idCount++,
      method: 'eth_gasPrice',
      params: []
    }).then((_: RPCResponse) => parseInt(_.result as any))

  // create Transaction
  const tx = new ETx({
    nonce: toHex(txargs.nonce),
    gasPrice: toHex(txargs.gasPrice),
    gasLimit: toHex(txargs.gas),
    gas: toHex(txargs.gas),
    to: txargs.to ? toHex(txargs.to, 20) : undefined,
    value: toHex(txargs.value || 0),
    data: toHex(txargs.data)
  })
  tx.sign(key)


  const txHash = await transport.handle(url, {
    jsonrpc: '2.0',
    id: idCount++,
    method: 'eth_sendRawTransaction',
    params: [toHex(tx.serialize())]
  }).then((_: RPCResponse) => _.error ? Promise.reject(new Error('Error sending the tx ' + JSON.stringify(txargs) + ':' + JSON.stringify(_.error))) as any : _.result + '')

  return txargs.confirm ? waitForReceipt(url, txHash, 4, txargs.gas, transport) : txHash
}


export async function waitForReceipt(url: string, txHash: string, timeout = 4, sentGas = 0, transport?: Transport) {
  if (!transport) transport = new AxiosTransport()

  let steps = 200
  const start = Date.now()
  while (Date.now() - start < timeout * 1000) {
    const r = await transport.handle(url, {
      jsonrpc: '2.0',
      id: idCount++,
      method: 'eth_getTransactionReceipt',
      params: [txHash]
    }) as RPCResponse

    if (r.error) throw new Error('Error fetching the receipt for ' + txHash + ' : ' + JSON.stringify(r.error))
    if (r.result) {
      const receipt = r.result as any
      if (sentGas && parseInt(sentGas as any) === parseInt(receipt.gasUsed))
        throw new Error('Transaction failed and all gas was used up')
      return receipt
    }

    // wait a second and try again
    await new Promise(_ => setTimeout(_, Math.min(timeout * 200, steps *= 2)))
  }

  throw new Error('Error waiting for the transaction to confirm')



}

export function getAddress(pk: string) {
  const key = toBuffer(pk)
  return toChecksumAddress(privateToAddress(key).toString('hex'))


}