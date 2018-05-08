
import { assert, expect, should } from 'chai'
import 'mocha'
import Client from '../../src/client/Client'
import { TestTransport } from '../utils/transport'
import { deployChainRegistry } from '../../src/server/registry';

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

  it('deploy', async () => {
    const pk = '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
    console.log('chainRegistry:', await deployChainRegistry(pk))
  })
})

