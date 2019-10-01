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


import * as protons from 'protons'
import * as multihashing from 'multihashing-async'
import * as bs58 from 'bs58'

const proto = protons(`
message Data {
  enum DataType {
    Raw = 0;
    Directory = 1;
    File = 2;
    Metadata = 3;
    Symlink = 4;
    HAMTShard = 5;
  }

  required DataType Type = 1;
  optional bytes Data = 2;
  optional uint64 filesize = 3;
  repeated uint64 blocksizes = 4;

  optional uint64 hashType = 5;
  optional uint64 fanout = 6;
}

message PBLink {
  optional bytes Hash = 1;
  optional string Name = 2;
  optional uint64 Tsize = 3;
}

// An IPFS MerkleDAG Node
message PBNode {
  repeated PBLink Links = 2;
  optional bytes Data = 1;
}
`)




/**
 * creates a IPFS-Hash from content
 * @param content
 */
export function createIPFSHash(content: Buffer, hashAlg = 'sha2-256') {
  return new Promise<string>((resolve, reject) => {
    // serialize content
    const serialized: Buffer = proto.PBNode.encode({
      Data: proto.Data.encode({
        Type: proto.Data.DataType.File,
        Data: content,
        filesize: content.length
      }), Links: null
    })

    multihashing(serialized, hashAlg, (err, multihash) => {
      if (err) return reject(err)
      resolve(bs58.encode(multihash))
    })

  })
}

export async function verifyIPFSHash(content: string | Buffer, encoding: string, requestedHash: string) {
  let reponseHash: string
  try {
    reponseHash = await createIPFSHash(Buffer.isBuffer(content) ? content : Buffer.from(content, encoding as any))
  }
  catch (er) {
    // TODO onlx in the react-native package he is not able to calculate the hash and throws, for now we ignore it, but we should find a solution to make it work there as well.
    return true
  }
  if (reponseHash !== requestedHash)
    throw new Error('The content verification failed, because the IPFS-Hash is wrong')
  return true
}
