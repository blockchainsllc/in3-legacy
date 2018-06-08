import { toBuffer, toChecksumAddress, BN, keccak256 } from 'ethereumjs-util'
import { toHex } from './util'
import { AxiosTransport } from './transport'

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