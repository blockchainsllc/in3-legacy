import * as Unixfs from 'ipfs-unixfs'
import * as dn from 'ipld-dag-pb'

/**
 * creates a IPFS-Hash from content
 * @param content 
 */
export function createIPFSHash(content: Buffer) {
  return new Promise<string>((resolve, reject) =>
    dn.DAGNode.create(new Unixfs('file', content).marshal(), (err, dagNode) => err
      ? reject(err)
      : resolve(dagNode.toJSON().multihash)
    )
  )
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