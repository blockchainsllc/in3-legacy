import * as tx from './tx'
import { toHex } from '../client/verify';

const bin = require('../types/registry.json')

export function deployChainRegistry(pk: string, url = 'http://localhost:8545') {
  return tx.deployContract(url, '0x' + bin.contracts['contracts/ChainRegistry.sol:ChainRegistry'].bin, {
    privateKey: pk,
    gas: 3000000,
    confirm: true
  }).then(_ => _.contractAddress as string)

}

export function deployServerRegistry(pk: string, url = 'http://localhost:8545') {
  return tx.deployContract(url, '0x' + bin.contracts['contracts/ServerRegistry.sol:ServerRegistry'].bin, {
    privateKey: pk,
    gas: 3000000,
    confirm: true
  }).then(_ => _.contractAddress as string)

}


export async function registerServers(pk: string, registry: string, data: {
  url: string,
  pk: string
  props: string
  deposit: number
}[], chainId: string, chainRegistry?: string, url = 'http://localhost:8545') {
  if (!registry)
    registry = await deployServerRegistry(pk, url)

  for (const c of data)
    await tx.callContract(url, registry, 'registerServer(string,uint)', [
      c.url,
      toHex(c.props, 32)
    ], {
        privateKey: c.pk,
        gas: 3000000,
        confirm: true,
        value: c.deposit
      })

  chainRegistry = await registerChains(pk, chainRegistry, [{
    chainId,
    bootNodes: data.map(_ => tx.getAddress(_.pk) + ':' + _.url),
    meta: 'dummy',
    registryContract: registry,
    contractChain: chainId
  }], url)

  return {
    chainRegistry,
    chainId,
    registry
  }


}

export async function registerChains(pk: string, chainRegistry: string, data: {
  chainId: string,
  bootNodes: string[],
  meta: string,
  registryContract: string,
  contractChain: string
}[], url = 'http://localhost:8545') {
  if (!chainRegistry)
    chainRegistry = await deployChainRegistry(pk, url)

  for (const c of data)
    await tx.callContract(url, chainRegistry, 'registerChain(bytes32,string,string,address,bytes32)', [
      toHex(c.chainId, 32),
      c.bootNodes.join(','),
      c.meta,
      c.registryContract,
      toHex(c.contractChain, 32)
    ], {
        privateKey: pk,
        gas: 3000000,
        confirm: true,
        value: 0
      })



  return chainRegistry
}