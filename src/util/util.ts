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

// this is eded in order to run in browsers
const Buffer: any = require('buffer').Buffer

import * as ethUtil from 'ethereumjs-util'
import { RPCResponse } from '../types/types'

const BN = ethUtil.BN



const fixLength = (hex: string) => hex.length % 2 ? '0' + hex : hex

/**
 * 
 * simple promisy-function
 */
export function promisify(self, fn, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    fn.apply(self, [...args, (err, res) => {
      if (err)
        reject(err)
      else
        resolve(res)
    }])
  })
}

export function toUtf8(val: any): string {
  if (!val) return val
  if (typeof val === 'string')
    return val.startsWith('0x') ? Buffer.from(val.substr(2), 'hex').toString('utf8') : val
  return val.toString('utf8')
}


/**
 * check a RPC-Response for errors and rejects the promise if found
 */
export function checkForError<T extends RPCResponse | RPCResponse[]>(res: T): T {
  if (Array.isArray(res))
    return res.find(_ => !!_.error) ? Promise.reject(new Error(res.find(_ => !!_.error).error)) as any : res as T
  return (res as RPCResponse).error ? Promise.reject(new Error((res as RPCResponse).error)) as any : res as T
}

/**
 * convert to BigNumber
 */
export function toBN(val: any) {
  if (BN.isBN(val)) return val
  if (val && val._isBigNumber) val = val.toHexString();
  if (typeof val === 'number') return new BN(Math.round(val).toString())
  if (Buffer.isBuffer(val)) return new BN(val)
  return new BN(toHex(val).substr(2), 16)
}

/** 
 * converts any value as hex-string 
 */
export function toHex(val: any, bytes?: number): string {
  if (val === undefined) return undefined
  let hex: string
  if (typeof val === 'string')
    hex = val.startsWith('0x') ? val.substr(2) : (parseInt(val[0]) ? new BN(val).toString(16) : Buffer.from(val, 'utf8').toString('hex'))
  else if (typeof val === 'number')
    hex = val.toString(16)
  else if (BN.isBN(val))
    hex = val.toString(16)
  else if (val && val._isBigNumber)
    hex = val.toHexString();
  else
    hex = ethUtil.bufferToHex(val).substr(2)
  if (bytes)
    hex = padStart(hex, bytes * 2, '0') as string  // workarounf for ts-error in older js
  if (hex.length % 2)
    hex = '0' + hex
  return '0x' + hex.toLowerCase()
}

/**
 * converts to a js-number
 */
export function toNumber(val: any): number {
  switch (typeof val) {
    case 'number':
      return val
    case 'string':
      return parseInt(val)
    default:
      if (Buffer.isBuffer(val))
        return val.length == 0 ? 0 : parseInt(toMinHex(val))
      else if (BN.isBN(val))
        return val.bitLength() > 53 ? toNumber(val.toArrayLike(Buffer)) : val.toNumber()
      else if (val && val._isBigNumber)
        try {
          return val.toNumber()
        }
        catch (ex) {
          return toNumber(val.toHexString())
        }
      else if (val === undefined || val === null)
        return 0
      throw new Error('can not convert a ' + (typeof val) + ' to number')
  }
}

/** 
 * converts any value as Buffer
 *  if len === 0 it will return an empty Buffer if the value is 0 or '0x00', since this is the way rlpencode works wit 0-values.
 */
export function toBuffer(val, len = -1) {
  if (val && val._isBigNumber) val = val.toHexString()
  if (typeof val == 'string')
    val = val.startsWith('0x')
      ? Buffer.from((val.length % 2 ? '0' : '') + val.substr(2), 'hex')
      : val.length && (parseInt(val) || val == '0')
        ? new BN(val).toArrayLike(Buffer)
        : Buffer.from(val, 'utf8')
  else if (typeof val == 'number')
    val = val === 0 && len === 0 ? Buffer.allocUnsafe(0) : Buffer.from(fixLength(val.toString(16)), 'hex')
  else if (BN.isBN(val))
    val = val.toArrayLike(Buffer)

  if (!val) val = Buffer.allocUnsafe(0)

  // since rlp encodes an empty array for a 0 -value we create one if the required len===0
  if (len == 0 && val.length == 1 && val[0] === 0)
    return Buffer.allocUnsafe(0)


  // if we have a defined length, we should padLeft 00 or cut the left content to ensure length
  if (len > 0 && Buffer.isBuffer(val) && val.length !== len)
    return val.length < len
      ? Buffer.concat([Buffer.alloc(len - val.length), val])
      : val.slice(val.length - len)

  return val as Buffer

}

/**
 * removes all leading 0 in a hex-string
 */
export function toSimpleHex(val: string) {
  let hex = val.replace('0x', '')
  while (hex.startsWith('00') && hex.length > 2)
    hex = hex.substr(2)
  return '0x' + hex

}

/**
 * returns a address from a private key 
 */
export function getAddress(pk: string) {
  const key = toBuffer(pk)
  return ethUtil.toChecksumAddress(ethUtil.privateToAddress(key).toString('hex'))
}

/** removes all leading 0 in the hexstring */
export function toMinHex(key: string | Buffer | number) {
  if (typeof key === 'number')
    key = toHex(key)

  if (typeof key === 'string') {
    key = key.trim()

    if(key.length<3 || key[0]!='0' || key[1]!='x')
      throw new Error("Only Hex format is supported. Given value "+ key +" is not valid Hex ")

    for (let i = 2; i < key.length; i++) {
      if (key[i] !== '0')
        return '0x' + key.substr(i)
    }
  }
  else if (Buffer.isBuffer(key)) {
    const hex = key.toString('hex')
    for (let i = 0; i < hex.length; i++) {
      if (hex[i] !== '0')
        return '0x' + hex.substr(i)
    }
  }
  return '0x0'
}

/** padStart for legacy */
export function padStart(val: string, minLength: number, fill = ' ') {
  while (val.length < minLength)
    val = fill + val
  return val
}

/** padEnd for legacy */
export function padEnd(val: string, minLength: number, fill = ' ') {
  while (val.length < minLength)
    val = val + fill
  return val
}
