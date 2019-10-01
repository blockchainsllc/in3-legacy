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

import Client from './Client'

export class HttpProvider {
  IN3Client: Client
  host: string
  connected: boolean

  constructor(_host: string, options = {}, client: Client) {
    this.IN3Client = client
    this.host = _host
    this.connected = true;
  }

  send(method, parameters): Promise<object> {
    let request

    if (typeof (method) == "string")
      request = { method: method, params: parameters }
    else
      request = method

    if (typeof parameters == "function")
      return this.IN3Client.send(request, parameters)
    else
      return this.IN3Client.send(request)

  }

  sendBatch(methods, moduleInstance): Promise<object[]> {
    let methodCalls = [];

    methods.forEach((method) => {
      method.beforeExecution(moduleInstance);
      methodCalls.push(this.send(method.rpcMethod, method.parameters));
    });

    return Promise.all(methodCalls);
  }

  supportsSubscriptions(): boolean {
    return false
  }

  disconnect(): boolean {
    return true;
  }
}
