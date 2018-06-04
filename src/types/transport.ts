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
    // convertto array
    const requests = Array.isArray(data) ? data : [data]

    // add cbor-config
    const conf = {}
    if (this.format === 'cbor')
      Object.assign(conf, {
        transformRequest: cbor.encodeRequests,
        transformResponse: cbor.decodeResponses /*{
          console.log('received size:', r.length)
          const decodec = cbor.decodeResponses(r)
          console.log('decodec size:', JSON.stringify(decodec).length)
          console.log('replaced refs size:', JSON.stringify(cbor.resolveRefs(decodec)).length)
          return decodec

        }*/,
        headers: { 'Content-Type': 'application/cbor' },
        responseType: 'arraybuffer'
      })

    // execute request
    try {
      const res = await axios.post(url, requests, { ...conf, timeout: timeout || 5000 })

      // throw if the status is an error
      if (res.status > 200) throw new Error('Invalid status')

      // if this was not given as array, we need to convert it back to a single object
      return Array.isArray(data) ? res.data : res.data[0]
    } catch (err) {
      throw new Error('Invalid response from ' + url + '(' + JSON.stringify(requests, null, 2) + ')' + ' : ' + err.message + (err.response ? err.response.statusText : ''))
    }
  }

  random(count: number): number[] {
    const result = []
    for (let i = 0; i < count; i++)
      result.push(Math.random())
    return result
  }

}