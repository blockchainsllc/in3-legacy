import * as ethUtil from 'ethereumjs-util'
import { RPCResponse } from '../types/types'

const BN = ethUtil.BN


// converts a string into a Buffer, but treating 0x00 as empty Buffer
export const fixLength = (hex: string) => hex.length % 2 ? '0' + hex : hex
export const toVariableBuffer = (val: string) => (val == '0x' || val === '0x0' || val === '0x00') ? Buffer.alloc(0) : ethUtil.toBuffer(val) as Buffer
export const leftPad = (val: any, len: number) => toHex(val, len / 2)
export const toBN = val => new BN(toHex(val).substr(2), 16)

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


/** converts any value as Buffer */
export function toBuffer(val, len = -1) {
  if (typeof val == 'string')
    val = val.startsWith('0x') ? Buffer.from((val.length % 2 ? '0' : '') + val.substr(2), 'hex') : new BN(val).toBuffer()
  if (typeof val == 'number')
    val = Buffer.from(fixLength(val.toString(16)), 'hex')

  if (!val) val = Buffer.allocUnsafe(0)

  if (len == 0 && val.toString('hex') === '00')
    return Buffer.allocUnsafe(0)
  if (len > 0 && Buffer.isBuffer(val) && val.length < len)
    val = Buffer.concat([Buffer.alloc(len - val.length), val])

  return val as Buffer

}

export function toSimpleHex(val: string) {
  let hex = val.replace('0x', '')
  while (hex.startsWith('00') && hex.length > 2)
    hex = hex.substr(2)
  return '0x' + hex

}


export function getAddress(pk: string) {
  const key = toBuffer(pk)
  return ethUtil.toChecksumAddress(ethUtil.privateToAddress(key).toString('hex'))
}

export function toMinHex(key: string) {
  for (let i = 2; i < key.length; i++) {
    if (key[i] !== '0')
      return '0x' + key.substr(i)
  }
  return '0x0'
}