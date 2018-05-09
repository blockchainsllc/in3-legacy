
import { assert, expect, should } from 'chai'
import 'mocha'
import Client from '../../src/client/Client'
import { TestTransport } from '../utils/transport'
import { deployChainRegistry, registerServers } from '../../src/server/registry';
import { getChainData } from '../../src/client/abi'
import * as tx from '../../src/server/tx'
import * as logger from '../utils/memoryLogger'

// our test private key
const pk = '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'


describe('ETH Standard JSON-RPC', () => {
  it('eth_blockNumber', async () => {
    const test = new TestTransport(3) // create a network of 3 nodes
    const client = await test.createClient()

    logger.info('3 different blocknumbers should result in the highest')

    // 3 different blocknumbers
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x1' }, '#1') // first node says 1
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x2' }, '#2') // second node says 4
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x4' }, '#3') // second node says 4


    // but we also ask for 3 answers
    const result = await client.sendRPC('eth_blockNumber', [], null, { requestCount: 3 })

    // so we must get the highest one
    assert.equal(result.result, '0x4')


    // 3 different blocknumbers
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x1' }, '#1') // first node says 1
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x2' }, '#2') // second node says 4
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x4' }, '#3') // second node says 4
    test.injectRandom([0, 0, 0]) // this should force him to chose the first


    // but we also ask only for one answer
    const result2 = await client.sendRPC('eth_blockNumber', [], null, { requestCount: 1 })

    // so we must get the highest one
    assert.equal(result2.result, '0x1')
  })


  it('eth_getTransactionByHash', async () => {
    const test = new TestTransport(3) // create a network of 3 nodes
    const client = await test.createClient()






    // 3 different blocknumbers
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x1' }, '#1') // first node says 1
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x2' }, '#2') // second node says 4
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x4' }, '#3') // second node says 4


    // but we also ask for 3 answers
    const result = await client.sendRPC('eth_blockNumber', [], null, { requestCount: 3 })

    // so we must get the highest one
    assert.equal(result.result, '0x4')


    // 3 different blocknumbers
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x1' }, '#1') // first node says 1
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x2' }, '#2') // second node says 4
    test.injectResponse({ method: 'eth_blockNumber' }, { result: '0x4' }, '#3') // second node says 4
    test.injectRandom([0, 0, 0]) // this should force him to chose the first


    // but we also ask only for one answer
    const result2 = await client.sendRPC('eth_blockNumber', [], null, { requestCount: 1 })

    // so we must get the highest one
    assert.equal(result2.result, '0x1')
  })

})

