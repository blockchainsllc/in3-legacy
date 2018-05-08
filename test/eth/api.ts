
import { assert, expect, should } from 'chai'
import 'mocha'
import Client from '../../src/client/Client'
import { TestTransport } from '../utils/transport'
import { deployChainRegistry, registerServers } from '../../src/server/registry';
import { getChainData } from '../../src/client/abi'
import * as tx from '../../src/server/tx'

describe('ETH Standard JSON-RPC', () => {
  it('eth_blockNumber', async () => {
    const test = new TestTransport(2) // create a network of 5 nodes
    const client = new Client({
      chainId: '0x01', servers: {
        '0x01': {
          contract: 'dummy',
          nodeList: test.nodeList.nodes
        }
      }
    }, test)
    await client.updateNodeList()

    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x1' }, '#1') // first node says 1
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x4' }, '#2') // second node says 2


    const result = await client.sendRPC('eth_blockNumber', [])
    assert.equal(result.result, '0x4')





  })

  it('deploy and register servers', async () => {
    const pk = '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
    const registers = await registerServers(pk, null, [{
      url: '#1',
      pk,
      props: '0xFF',
      deposit: 0
    }], '0x99', null)

    const client = new Client({
      chainId: '0x99',
      mainChain: '0x99',
      chainRegistry: registers.chainRegistry,
      servers: {
        '0x99': {
          contract: registers.registry,
          contractChain: '0x99',
          nodeList: [{
            address: tx.getAddress(pk),
            url: 'http://localhost:8545',
            chainIds: ['0x99'],
            deposit: 0
          }]
        }
      }
    })

    const data = await getChainData(client, '0x99')



    console.log('registers:', registers)
    console.log('data:', data)
  })
})

