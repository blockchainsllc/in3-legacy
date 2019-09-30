/*******************************************************************************
 * This file is part of the Incubed project.
 * Sources: https://github.com/slockit/in3
 * 
 * Copyright (C) 2018-2019 slock.it GmbH, Blockchains LLC
 * 
 * 
 * COMMERCIAL LICENSE USAGE
 * 
 * Licensees holding a valid commercial license may use this file in accordance 
 * with the commercial license agreement provided with the Software or, alternatively, 
 * in accordance with the terms contained in a written agreement between you and 
 * slock.it GmbH/Blockchains LLC. For licensing terms and conditions or further 
 * information please contact slock.it at in3@slock.it.
 * 	
 * Alternatively, this file may be used under the AGPL license as follows:
 *    
 * AGPL LICENSE USAGE
 * 
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY 
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * [Permissions of this strong copyleft license are conditioned on making available 
 * complete source code of licensed works and modifications, which include larger 
 * works using a licensed work, under the same license. Copyright and license notices 
 * must be preserved. Contributors provide an express grant of patent rights.]
 * You should have received a copy of the GNU Affero General Public License along 
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/

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
