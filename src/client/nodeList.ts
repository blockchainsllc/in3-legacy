import { IN3NodeConfig } from '../types/config'

export default class NodeList {

  lastBlockNumber: number
  nodes: IN3NodeConfig[]

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