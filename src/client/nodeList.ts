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