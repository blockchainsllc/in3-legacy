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
import { toBuffer, toChecksumAddress } from 'ethereumjs-util'
import { util } from 'in3-common'
import { IN3Config } from '../../types/types';
import { RPCResponse } from '../..';
import { encodeFunction, decodeFunction } from './api';

export async function callContract(client: Client, contract: string, chainId: string, signature: string, args: any[], config?: IN3Config) {
  return decodeFunction(signature, await client.sendRPC('eth_call', [{
    to: contract,
    data: '0x' + encodeFunction(signature, args)
  },
    'latest'], chainId, config)
    .then(_ => (_.error ? Promise.reject(new Error('Error handling call to ' + contract + ' :' + JSON.stringify(_.error))) : toBuffer(_.result + '')) as any as RPCResponse))
}

export async function getChainData(client: Client, chainId: string, config?: IN3Config) {
  return callContract(client, client.defConfig.chainRegistry, client.defConfig.mainChain, 'chains(bytes32):(address,string,string,address,bytes32)', [util.toHex(chainId, 32)], config).then(_ => ({
    owner: toChecksumAddress(_[0]) as string,
    bootNodes: _[1].split(',') as string[],
    meta: _[2] as string,
    registryContract: toChecksumAddress(_[3]) as string,
    contractChain: util.toSimpleHex(util.toHex(_[4])) as string
  }))
}


