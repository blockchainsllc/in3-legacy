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
* For more information, please refer to https://slock.it    *
* For questions, please contact info@slock.it              *
***********************************************************/

import { toChecksumAddress, BN, keccak256 } from 'ethereumjs-util'
import { toHex, toBuffer, toNumber } from '../../util/util';
import { bytes32 } from './serialize'
import { AxiosTransport } from '../../util/transport'

/**
 * calc the storrage array key
 */
export function getStorageArrayKey(pos: number, arrayIndex?: number, structSize = 1, structPos = 0) {
  return arrayIndex === undefined
    ? bytes32(pos)
    : bytes32(toBN(keccak256(bytes32(pos))).add(toBN(arrayIndex * structSize + structPos)))
}

/**
 * calcs the storage Map key.
 * @param pos position of the map in the contract
 * @param key key to search for
 * @param structPos if the value is a struct - the position in the struct
 */
export function getStorageMapKey(pos: number, key: string, structPos = 0) {
  return bytes32(toBN(keccak256(Buffer.concat([bytes32(key), bytes32(pos)]))).add(toBN(structPos)))
}

/**
 * creates a string from storage.
 * @param data the data of the frst slot.
 * @param storageKey  the key.
 * if the length is bigger than 32, this function will return the keys needed in order to create the value, otherwise the string is returned.
 */
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

/**
 * concats the storage values to a string.
 * @param values 
 * @param len 
 */
export function getStringValueFromList(values: Buffer[], len: number): string {
  return Buffer.concat(values).slice(0, len).toString('utf8')
}

/**
 * converts any value to BN
 */
export const toBN = val => new BN(toHex(val).substr(2), 16)

/**
 * get a storage value from the server
 * @param rpc url of the client
 * @param contract address of the contract
 * @param pos position in the contract
 * @param type type of the value
 * @param keyOrIndex if number this is in the index in the array if hex, this is the key in the map
 * @param structSize size if the value in the array of map
 * @param structPos position in the struct-value in the array of map
 */
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