import { RPCRequest, RPCResponse } from './config';
import { writeFileSync } from 'fs';
const cbor = require('cbor')

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
      return Array.isArray(val)
        ? val.map(convertToHex)
        : Object.keys(val).reduce((p, c) => { p[c] = convertToHex(val[c]); return p }, {})
    default:
      return val
  }
}
