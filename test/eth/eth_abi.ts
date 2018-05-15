
import { assert, expect, should } from 'chai'
import 'mocha'
import Client from '../../src/client/Client'
import { TestTransport } from '../utils/transport'
import { deployChainRegistry, registerServers } from '../../src/server/registry';
import { getChainData } from '../../src/client/abi'
import * as tx from '../../src/server/tx'
import * as logger from '../utils/memoryLogger'
import * as verify from '../../src/client/verify'
import Block from '../../src/client/block'
import { RPCResponse } from '../../src/types/config';

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
    const client = await test.createClient({ proof: true, requestCount: 1 })

    // create 2 accounts
    const pk1 = await test.createAccount('0x01')
    const pk2 = await test.createAccount('0x02')

    // send 1000 wei from a to b
    const receipt = await tx.sendTransaction(test.url, {
      privateKey: pk1,
      gas: 22000,
      to: tx.getAddress(pk2),
      data: '',
      value: 1000,
      confirm: true
    })

    const res = await client.sendRPC('eth_getTransactionByHash', [receipt.transactionHash], null, { keepIn3: true })
    const result = res.result as any
    assert.exists(res.in3)
    assert.exists(res.in3.proof)
    const proof = res.in3.proof as any
    assert.equal(proof.type, 'transactionProof')
    assert.exists(proof.block)


    const b = await client.sendRPC('eth_getBlockByNumber', [result.blockNumber, true], null, { keepIn3: true })
    logger.info('found Block:', b.result)
    const block = new Block(b.result)

    assert.equal('0x' + block.hash().toString('hex').toLowerCase(), (res.result as any).blockHash, 'the hash of the blockheader in the proof must be the same as the blockHash in the Transactiondata')

    // check blocknumber
    assert.equal(parseInt('0x' + block.number.toString('hex')), parseInt(result.blockNumber), 'we must use the same blocknumber as in the transactiondata')

    logger.info('result', res)


    // now manipulate the result
    test.injectResponse({ method: 'eth_getTransactionByHash' }, (req, re: RPCResponse) => {
      // we change a property
      (re.result as any).to = (re.result as any).from
      return re
    })


    let failed = false
    try {
      await client.sendRPC('eth_getTransactionByHash', [receipt.transactionHash])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated transaction must fail!')




  })

})

