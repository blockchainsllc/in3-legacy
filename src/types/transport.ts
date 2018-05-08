import { RPCRequest, RPCResponse } from './config';
import axios from 'axios'

export interface Transport {
  handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]>

  random(count: number): number[]

}


export class AxiosTransport implements Transport {

  async handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]> {
    const res = await axios.post(url, data, { timeout: timeout || 1000 })
    if (res.status > 200) throw new Error('Invalid response ' + url + ' : ' + res.statusText)
    return res.data
  }

  random(count: number): number[] {
    const result = []
    for (let i = 0; i < count; i++)
      result.push(Math.random())
    return result
  }

}