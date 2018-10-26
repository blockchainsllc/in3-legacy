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
* For more information, please refer to https://slock.it   *
* For questions, please contact info@slock.it              *
***********************************************************/

import { RPCRequest, RPCResponse } from '../types/types'
import * as cbor from 'cbor'

/**
 * turn 
 */
export function encodeRequests(requests: RPCRequest[]): Buffer {
  return cbor.encode(requests.map(r => [r.id, r.method, convertToBuffer(r.params), convertToBuffer(r.in3)]))
}

export function decodeRequests(request: Buffer): RPCRequest[] {
  return cbor.decode(request).map(r => ({
    jsonrpc: '2.0',
    id: r[0],
    method: r[1],
    params: convertToHex(r[2]),
    in3: convertToHex(r[3])
  }))

}

export function encodeResponses(responses: RPCResponse[]): Buffer {
  return cbor.encode(responses.map(r => [r.id, convertToBuffer(r.result), r.error, convertToBuffer(r.in3)]))
}
export function decodeResponses(responses: Buffer): RPCResponse[] {
  return cbor.decode(responses).map(r => ({
    jsonrpc: '2.0',
    id: r[0],
    result: convertToHex(r[1]),
    error: r[2],
    in3: convertToHex(r[3])
  }))
}

function convertToBuffer(val: any): any {
  switch (typeof val) {
    case 'string':
      return val.startsWith('0x') ? Buffer.from((val.length % 2 ? '0' : '') + val.substr(2), 'hex') : val
    case 'object':
      if (val === null) return null
      return Array.isArray(val)
        ? val.map(convertToBuffer)
        : Object.keys(val).reduce((p, c) => { p[c] = convertToBuffer(val[c]); return p }, {})
    default:
      return val
  }
}

function convertToHex(val: any): any {
  if (Buffer.isBuffer(val)) return '0x' + val.toString('hex')

  switch (typeof val) {
    case 'object':
      if (val === null) return null
      return Array.isArray(val)
        ? val.map(convertToHex)
        : Object.keys(val).reduce((p, c) => { p[c] = convertToHex(val[c]); return p }, {})
    default:
      return val
  }
}





export function createRefs<T>(val: T, cache: string[] = []): T {
  switch (typeof val) {
    case 'string':
      const s = val as any as string
      if (s.startsWith('0x')) {
        const i = cache.indexOf(s)
        if (i >= 0) return (':' + i) as any as T
        cache.push(s)
      }
      return val

    case 'object':
      if (val === null) return null
      return (Array.isArray(val)
        ? val.map(_ => createRefs(_, cache))
        : Object.keys(val).reduce((p, c) => { p[c] = createRefs(val[c], cache); return p }, {})) as any as T
    default:
      return val
  }
}

export function resolveRefs<T>(val: T, cache: string[] = []): T {
  switch (typeof val) {
    case 'string':
      const s = val as any as string
      if (s.startsWith('0x'))
        cache.push(s)
      if (s.startsWith(':'))
        return cache[parseInt(s.substr(1))] as any as T
      return val
    case 'object':
      if (val === null) return null
      return (Array.isArray(val)
        ? val.map(_ => resolveRefs(_, cache))
        : Object.keys(val).reduce((p, c) => { p[c] = resolveRefs(val[c], cache); return p }, {})) as any as T
    default:
      return val
  }
}