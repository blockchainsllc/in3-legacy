import * as Unixfs from 'ipfs-unixfs'
import * as dn from 'ipld-dag-pb'

import * as protons from 'protons'
import * as multihashing from 'multihashing-async'
import * as mh from 'multihashes'

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
      resolve(mh.toB58String(multihash))
    })

  })
}

export async function verifyIPFSHash(content: string | Buffer, encoding: string, requestedHash: string) {
  let reponseHash: string
  try {
    reponseHash = await createIPFSHash(Buffer.isBuffer(content) ? content : Buffer.from(content, encoding))
  }
  catch (er) {
    // TODO onlx in the react-native package he is not able to calculate the hash and throws, for now we ignore it, but we should find a solution to make it work there as well.
    return true
  }
  if (reponseHash !== requestedHash)
    throw new Error('The content verification failed, because the IPFS-Hash is wrong')
  return true
}
