import Client from '../../client/Client'
const bs58 = require('bs58')
import {verifyIPFSHash} from './ipfs'

export default class API{
  client: Client

  constructor(_client: Client){
    this.client = _client
  }

  get(hash: string, resultEncoding?: string): Promise<Buffer> {
    return this.client.sendRPC('ipfs_get', [hash, resultEncoding || 'base64'], '0x7d0').then(response => {
      if(response.result) return Buffer.from(response.result, 'base64')
      else Promise.reject(response.error || 'Hash not found')
    })
  }


  put(data: string, dataEncoding?: string): Promise<string> {
    return this.client.sendRPC('ipfs_put', [data, dataEncoding || 'base64'], '0x7d0').then(response => {
      if(response.result) return response.result
      else Promise.reject(response.error || 'Hash not found')
    })
  }
}
