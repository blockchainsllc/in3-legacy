import * as ethUtil from 'ethereumjs-util'
import { RPCResponse } from '../types/types'

const BN = ethUtil.BN


export const fixLength = (hex: string) => hex.length % 2 ? '0' + hex : hex

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


export function checkForError<T extends RPCResponse | RPCResponse[]>(res: T): T {
  if (Array.isArray(res))
    return res.find(_ => !!_.error) ? Promise.reject(new Error(res.find(_ => !!_.error).error)) as any : res as T
  return (res as RPCResponse).error ? Promise.reject(new Error((res as RPCResponse).error)) as any : res as T
}

export function toBN(val: any) {
  if (BN.isBN(val)) return val
  if (typeof val === 'number') return new BN(val)
  if (Buffer.isBuffer(val)) return new BN(val)
  return new BN(toHex(val).substr(2), 16)
}

/** converts any value as hex-string */
export function toHex(val: any, bytes?: number): string {
  if (val === undefined) return undefined
  let hex: string
  if (typeof val === 'string')
    hex = val.startsWith('0x') ? val.substr(2) : new BN(val).toString(16)
  else if (typeof val === 'number')
    hex = val.toString(16)
  else if (BN.isBN(val))
    hex = val.toString(16)
  else
    hex = ethUtil.bufferToHex(val).substr(2)
  if (bytes)
    hex = hex.padStart(bytes * 2, '0')
  if (hex.length % 2)
    hex = '0' + hex
  return '0x' + hex.toLowerCase()
}

export function toNumber(val: any): number {
  switch (typeof val) {
    case 'number':
      return val
    case 'string':
      return parseInt(val)
    default:
      if (Buffer.isBuffer(val))
        return val.length == 0 ? 0 : val.readUIntBE(0, val.length)
      else if (BN.isBN(val))
        return val.bitLength() > 53 ? toNumber(val.toBuffer()) : val.toNumber()
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
  if (typeof val == 'string')
    val = val.startsWith('0x') ? Buffer.from((val.length % 2 ? '0' : '') + val.substr(2), 'hex') : new BN(val).toBuffer()
  else if (typeof val == 'number')
    val = val === 0 && len === 0 ? Buffer.allocUnsafe(0) : Buffer.from(fixLength(val.toString(16)), 'hex')
  else if (BN.isBN(val))
    val = val.toBuffer()

  if (!val) val = Buffer.allocUnsafe(0)

  if (len == 0 && val.length == 1 && val[0] === 0)
    return Buffer.allocUnsafe(0)
  if (len > 0 && Buffer.isBuffer(val) && val.length < len)
    val = Buffer.concat([Buffer.alloc(len - val.length), val])

  return val as Buffer

}
// TODO do we need this anymore?
export function toSimpleHex(val: string) {
  let hex = val.replace('0x', '')
  while (hex.startsWith('00') && hex.length > 2)
    hex = hex.substr(2)
  return '0x' + hex

}

/** returns a address from a private key */
export function getAddress(pk: string) {
  const key = toBuffer(pk)
  return ethUtil.toChecksumAddress(ethUtil.privateToAddress(key).toString('hex'))
}

/** removes all leading 0 in the hexstring */
export function toMinHex(key: string | Buffer) {
  if (typeof key === 'string') {
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