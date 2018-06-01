import Client from './Client'
import { simpleEncode, simpleDecode } from 'ethereumjs-abi'
import { toBuffer, toChecksumAddress } from 'ethereumjs-util'
import { toHex } from './block'
import { IN3Config } from '../types/config';



export async function callContract(client: Client, contract: string, chainId: string, signature: string, args: any[], config?: IN3Config) {
  return simpleDecode(signature, await client.sendRPC('eth_call', [{
    to: contract,
    data: '0x' + simpleEncode(signature, ...args).toString('hex')
  },
    'latest'], chainId, config)
    .then(_ => _.error ? Promise.reject(new Error('Error handling call to ' + contract + ' :' + JSON.stringify(_.error))) as any : toBuffer(_.result + '')))
}

export async function getChainData(client: Client, chainId: string, config?: IN3Config) {
  return callContract(client, client.defConfig.chainRegistry, client.defConfig.mainChain, 'chains(bytes32):(address,string,string,address,bytes32)', [toHex(chainId, 32)], config).then(_ => ({
    owner: toChecksumAddress(_[0]) as string,
    bootNodes: _[1].split(',') as string[],
    meta: _[2] as string,
    registryContract: toChecksumAddress(_[3]) as string,
    contractChain: toSimpleHex(toHex(_[4])) as string
  }))
}


function toSimpleHex(val: string) {
  let hex = val.replace('0x', '')
  while (hex.startsWith('00') && hex.length > 2)
    hex = hex.substr(2)
  return '0x' + hex

}