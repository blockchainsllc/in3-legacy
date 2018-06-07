import * as TrieNode from 'merkle-patricia-tree/trieNode'
import * as ethUtil from 'ethereumjs-util'
import { matchingNibbleLength } from 'merkle-patricia-tree/util'


export default async function verify(rootHash: Buffer, path: Buffer, proof: Buffer[], expectedValue: Buffer, errorMsg?: string) {
  const errorPrefix = errorMsg ? errorMsg + ' : ' : ''
  // create the nibbles to iterate over the path
  const key = TrieNode.stringToNibbles(path) as number[]
  // start with the root-Hash
  let wantHash = rootHash

  for (let i = 0; i < proof.length; i++) {
    const p = proof[i]
    const hash = ethUtil.sha3(p) as Buffer
    if (Buffer.compare(hash, wantHash))
      throw new Error('Bad proof node ' + i + ': hash mismatch')

    // create the node
    const node = new TrieNode(ethUtil.rlp.decode(p))

    switch (node.type as string) {
      case 'branch':
        // we reached the end of the path
        if (key.length === 0) {
          if (i !== proof.length - 1)
            throw new Error(errorPrefix + 'Additional nodes at end of proof (branch)')

          // our value is a branch, but we can return the value
          // TODO does this make sense?
          return node.value as Buffer
        }

        // find the childHash
        const childHash = node.raw[key[0]] as Buffer
        // remove the first item
        key.splice(0, 1)


        if (childHash.length === 2) {
          const embeddedNode = new TrieNode(childHash)
          if (i !== proof.length - 1)
            throw new Error(errorPrefix + 'Additional nodes at end of proof (embeddedNode)')

          if (matchingNibbleLength(embeddedNode.key, key) !== embeddedNode.key.length)
            throw new Error(errorPrefix + 'Key length does not match with the proof one (embeddedNode)')

          key.splice(0, embeddedNode.key.length)
          if (key.length !== 0)
            throw new Error(errorPrefix + 'Key does not match with the proof one (embeddedNode)')

          // all is fine we return the value
          return embeddedNode.value as Buffer
        }
        else
          wantHash = childHash
        break


      case 'leaf':
      case 'extention':
        const val = node.value as Buffer

        // if the relativeKey in the leaf does not math our rest key, we throw!
        if (matchingNibbleLength(node.key, key) !== node.key.length) {
          // so we have a wrong leaf here, if we actually expected this node to not exist,
          // the last node in this path may be a different leaf or a branch with a empty hash
          if (key.length === node.key.length && i === proof.length - 1 && expectedValue === null)
            return val

          throw new Error(errorPrefix + 'Key does not match with the proof one (extention|leaf)')
        }

        // remove the items
        key.splice(0, node.key.length)

        if (key.length === 0) {
          if (i !== proof.length - 1)
            throw new Error(errorPrefix + 'Additional nodes at end of proof (extention|leaf)')

          if (expectedValue && expectedValue.compare(val))
            throw new Error(errorPrefix + ' The proven value was expected to be ' + expectedValue.toString('hex') + ' but is ' + val.toString('hex'))

          return val
        } else
          // we continue with the hash 
          wantHash = val
        break

      default:
        throw new Error(errorPrefix + 'Invalid node type')

    }

  }

  // if we expected this to be null and there is not further node since wantedHash is empty, than it is ok not to find leafs
  if (expectedValue === null && wantHash.length === 0)
    return null

  // we reached the end of the proof, but not of the path
  throw new Error('Unexpected end of proof')
}


