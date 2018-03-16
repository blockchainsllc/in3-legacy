import { RPCRequest, RPCResponse } from '../types/config'
import * as eth from './chains/eth'


export async function handle(request: RPCRequest[]): Promise<RPCResponse[]> {
  return Promise.all(request.map(r => {
    const chainId = r.in3ChainId

    //TODO check chainId....
    return eth.handle(r)
  }))
}