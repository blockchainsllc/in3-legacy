import { IN3NodeConfig } from '../types/types'
import { keccak256 } from 'ethereumjs-util'


export function canProof(node: IN3NodeConfig) {
  return (node.props & 0x01) > 0
}

export function canMultiChain(node: IN3NodeConfig) {
  return (node.props & 0x02) > 0
}

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
