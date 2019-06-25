import Client from '../../client/Client'

/**
 * simple API for IPFS
 */
export default class IpfsAPI {
  client: Client

  constructor(_client: Client) {
    this.client = _client
  }

  /**
   * retrieves the conent for a hash from IPFS.
   * @param hash  the IPFS-hash to fetch
   * @param resultEncoding the internal encoding to use
   * 
   */
  get(hash: string, resultEncoding?: string): Promise<Buffer> {
    return this.client.sendRPC('ipfs_get', [hash, resultEncoding || 'base64'], '0x7d0')
      .then(response => response.result ? Buffer.from(response.result, (resultEncoding || 'base64') as any) : Promise.reject(new Error(response.error || 'Hash not found')) as any)
  }


  /**
   * stores the data on ipfs and returns the IPFS-Hash.
   * @param data puts a IPFS content
   * @param dataEncoding 
   */
  put(data: Buffer, dataEncoding?: string): Promise<string> {
    return this.client.sendRPC('ipfs_put', [data.toString(dataEncoding || 'base64'), (dataEncoding || 'base64') as any], '0x7d0').then(response =>
      response.result ? response.result : Promise.reject(new Error(response.error || 'Hash not found'))
    )
  }
}
