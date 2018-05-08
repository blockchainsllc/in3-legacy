import * as tx from './tx'

const bin = require('../types/registry.json')

export function deployChainRegistry(pk: string, url = 'http://localhost:8545') {
  return tx.deployContract(url, '0x' + bin.contracts['contracts/ChainRegistry.sol:ChainRegistry'].bin, {
    privateKey: pk,
    gas: 3000000,
    confirm: true
  }).then(_ => _.contractAddress as string)

}