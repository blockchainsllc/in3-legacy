import { IN3NodeConfig } from '../types/types'
import keccak256 from 'ethereumjs-util'

export default class NodeList {

  lastBlockNumber: number
  nodes: IN3NodeConfig[]
  proof: any
  contract: string
  totalServers: number

  update(nodes: IN3NodeConfig[], lastBlock: number) {
    this.nodes = nodes
    this.lastBlockNumber = lastBlock
  }

  getAddress(adr: string) {
    return this.nodes.find(_ => _.address === adr)
  }

}

export function canProof(node: IN3NodeConfig) {
  return (node.props & 0x01) > 0
}

export function canMultiChain(node: IN3NodeConfig) {
  return (node.props & 0x02) > 0
}

export function createRandomIndexes(len: number, limit: number, seed: string, result: number[] = []) {
  let step = parseInt(seed.substr(0, 14))  // first 6 bytes
  let pos = parseInt('0x' + seed.substr(14, 12)) // next 6 bytes
  while (result.length < limit) {
    if (result.indexOf(pos) >= 0) {
      seed = keccak256(seed)
      step = parseInt(seed.substr(0, 14))
      continue
    }
    result.push(pos)
    pos = (pos + step) % len
  }
  return result
}
