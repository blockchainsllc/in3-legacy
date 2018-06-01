import { simpleEncode, simpleDecode, methodID } from 'ethereumjs-abi'
import { toBuffer, toChecksumAddress, privateToAddress, BN, keccak256 } from 'ethereumjs-util'
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
  const data = '0x' + (signature.indexOf('()') >= 0 ? methodID(signature.substr(0, signature.indexOf('(')), []) : simpleEncode(signature, ...args)).toString('hex')

  if (txargs)
    return sendTransaction(url, { ...txargs, to: contract, data }, transport)

  return simpleDecode(signature.replace('()', '(uint)'), toBuffer(await transport.handle(url, {
    jsonrpc: '2.0',
    id: idCount++,
    method: 'eth_call', params: [{
      to: contract,
      data
    },
      'latest']
  }).then((_: RPCResponse) => _.error
    ? Promise.reject(new Error('Could not call ' + contract + ' with ' + signature + ' params=' + JSON.stringify(args) + ':' + _.error)) as any
    : _.result + ''
  )))
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

export function getStorageArrayKey(pos: number, arrayIndex?: number, structSize = 1, structPos = 0) {
  return arrayIndex === undefined
    ? leftPad(pos, 64)
    : '0x' + toBN(keccak256(leftPad(pos, 64))).add(toBN(leftPad(arrayIndex * structSize + structPos, 64))).toString(16)
}

export function getStorageMapKey(pos: number, key: string, structPos = 0) {
  return '0x' + toBN(keccak256(leftPad(pos, 64) + leftPad(pos, 64).substr(2))).add(toBN(structPos)).toString(16)
}

export function getStringValue(storageValue: string, storageKey: string): string | { len: number, storageKeys: string[] } {
  const data = Buffer.from(leftPad(storageValue, 64).substr(2), 'hex')
  if (data.length > 32) throw new Error('storrage value is too long. Must be 32bytes!')
  if (data[31] % 2 === 0)
    return data.slice(0, data[31] / 2).toString('utf8')

  const len = toBN(storageValue).div(toBN(2)).toNumber()
  const slot = toBN(keccak256(storageKey))
  const storageKeys: string[] = []

  for (let i = 0; i < len / 32; i++)
    storageKeys.push(leftPad('0x' + slot.add(toBN(i)).toString(16), 64))
  return { len, storageKeys }
}

export function getStringValueFromList(values: string[], len: number): string {
  return Buffer.concat(values.map(toBuffer)).slice(0, len).toString('utf8')
}

export const leftPad = (val: any, len: number) => toHex(val, len / 2)
export const toBN = val => new BN(toHex(val).substr(2), 16)

export async function getStorageValue(rpc: string, contract: string, pos: number, type: 'address' | 'bytes32' | 'bytes16' | 'bytes4' | 'int' | 'string', keyOrIndex?: number | string, structSize?: number, structPos?: number) {
  const t = new AxiosTransport()
  const storageKey = keyOrIndex === undefined
    ? getStorageArrayKey(pos)
    : structSize
      ? getStorageArrayKey(pos, keyOrIndex as number, structSize, structPos)
      : getStorageMapKey(pos, keyOrIndex as string, structPos)

  const val = await t.handle(rpc, {
    id: 1, jsonrpc: '2.0', method: 'eth_getStorageAt', params: [contract, storageKey]
  }).then(_ => (_ as any).result as string)


  if (type === 'int')
    return toBN(val)
  else if (type === 'bytes32')
    return val
  else if (type === 'bytes16')
    return val.substr(34, 32)
  else if (type === 'bytes4')
    return val.substr(58, 8)
  else if (type === 'address')
    return toChecksumAddress('0x' + val.substr(26))

  const stringValue = getStringValue(val, storageKey)
  if (typeof stringValue === 'string')
    return stringValue
  else
    return t.handle(rpc, stringValue.storageKeys.map((sk, i) => ({
      id: i + 1, jsonrpc: '2.0', method: 'eth_getStorageAt', params: [contract, sk]
    } as any))).then((all: any[]) => getStringValueFromList(all.map(_ => _.result as string), stringValue.len))
}