import { toChecksumAddress, BN, keccak256 } from 'ethereumjs-util'
import { toHex, toBuffer, toNumber } from './util';
import { bytes32 } from './serialize'
import { AxiosTransport } from './transport'

export function getStorageArrayKey(pos: number, arrayIndex?: number, structSize = 1, structPos = 0) {
  return arrayIndex === undefined
    ? bytes32(pos)
    : bytes32(toBN(keccak256(bytes32(pos))).add(toBN(arrayIndex * structSize + structPos)))
}

export function getStorageMapKey(pos: number, key: string, structPos = 0) {
  return bytes32(toBN(keccak256(Buffer.concat([bytes32(key), bytes32(pos)]))).add(toBN(structPos)))
}

export function getStringValue(data: Buffer, storageKey: Buffer): string | { len: number, storageKeys: Buffer[] } {
  if (data.length > 32) throw new Error('storrage value is too long. Must be 32bytes!')
  if (data[31] % 2 === 0)
    return data.slice(0, data[31] / 2).toString('utf8')

  const len = (toNumber(data) - 1) / 2
  const slot = toBN(keccak256(storageKey))
  const storageKeys: Buffer[] = []

  for (let i = 0; i < len / 32; i++)
    storageKeys.push(bytes32(slot.add(toBN(i))))
  return { len, storageKeys }
}

export function getStringValueFromList(values: Buffer[], len: number): string {
  return Buffer.concat(values).slice(0, len).toString('utf8')
}

// TODO convert directly from Buffer
export const toBN = val => new BN(toHex(val).substr(2), 16)

export async function getStorageValue(rpc: string, contract: string, pos: number, type: 'address' | 'bytes32' | 'bytes16' | 'bytes4' | 'int' | 'string', keyOrIndex?: number | string, structSize?: number, structPos?: number) {
  const t = new AxiosTransport()
  const storageKey = keyOrIndex === undefined
    ? getStorageArrayKey(pos)
    : structSize
      ? getStorageArrayKey(pos, keyOrIndex as number, structSize, structPos)
      : getStorageMapKey(pos, keyOrIndex as string, structPos)

  const val = await t.handle(rpc, {
    id: 1, jsonrpc: '2.0', method: 'eth_getStorageAt', params: [contract, toHex(storageKey)]
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

  const stringValue = getStringValue(bytes32(val), storageKey)
  if (typeof stringValue === 'string')
    return stringValue
  else
    return t.handle(rpc, stringValue.storageKeys.map((sk, i) => ({
      id: i + 1, jsonrpc: '2.0', method: 'eth_getStorageAt', params: [contract, toHex(sk)]
    } as any))).then((all: any[]) => getStringValueFromList(all.map(bytes32), stringValue.len))
}