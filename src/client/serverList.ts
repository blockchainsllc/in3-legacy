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

import { IN3NodeConfig } from '../types/types'
import { keccak256 } from 'ethereumjs-util'

/**
 * The node is able provide requested proof. 
 * if not this node is a simple rpc-node without proof.
 */
export function canProof(node: IN3NodeConfig) {
  return !!(node.props & 0x01)
}

/**
 * This node is able to handle multiple chains.
 * If not set the chainId is optional, since it will only serve for the one chain.
 */
export function canMultiChain(node: IN3NodeConfig) {
  return !!(node.props & 0x02)
}

/**
 * If true a archive node is running allowing proofs all the way down to the genesis block.
 */
export function canArchive(node: IN3NodeConfig) {
  return !!(node.props & 0x04)
}

/**
 * This node is able to handle requests through onion routing using the tor-network.
 */
export function canOnionRouting(node: IN3NodeConfig) {
  return !!(node.props & 0x08)
}

/** 
 * helper function creating deterministic random indexes used for limited nodelists
 */
export function createRandomIndexes(len: number, limit: number, seed: Buffer, result: number[] = []) {
  let step = seed.readUIntBE(0, 6) // first 6 bytes
  let pos = seed.readUIntBE(6, 6) % len// next 6 bytes
  while (result.length < limit) {
    if (result.indexOf(pos) >= 0)
      step = (seed = keccak256(seed)).readUIntBE(0, 6)
    else
      result.push(pos)
    pos = (pos + step) % len
  }
  return result
}
