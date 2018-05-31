import { RPCRequest, RPCResponse } from './config';
import axios from 'axios'
import * as cbor from './cbor'

export interface Transport {
  handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]>

  random(count: number): number[]

}


export class AxiosTransport implements Transport {

  format: ('json' | 'cbor')

  constructor(format: ('json' | 'cbor') = 'json') {
    this.format = format
  }

  async handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]> {
    const requests = Array.isArray(data) ? data : [data]
    const conf = {}
    if (this.format === 'cbor')
      Object.assign(conf, {
        transformRequest: cbor.encodeRequests,
        transformResponse: cbor.decodeResponses,
        headers: { 'Content-Type': 'application/cbor' },
        responseType: 'arraybuffer'
      })

    const res = await axios.post(url, requests, { ...conf, timeout: timeout || 5000 })
    if (res.status > 200) throw new Error('Invalid response ' + url + ' : ' + res.statusText)

    return Array.isArray(data) ? res.data : res.data[0]
  }

  random(count: number): number[] {
    const result = []
    for (let i = 0; i < count; i++)
      result.push(Math.random())
    return result
  }

}