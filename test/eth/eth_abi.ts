
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
import { BlockData } from '../../src/client/block';
import { getAddress } from '../../src/server/tx';

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


    let failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getTransactionByHash' }, (req, re: RPCResponse) => {
        // we change a property
        (re.result as any).to = (re.result as any).from
        return re
      })
      await client.sendRPC('eth_getTransactionByHash', [receipt.transactionHash])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated transaction must fail!')
  })

  it('eth_getBlockByNumber', async () => {
    const test = new TestTransport(1) // create a network of 3 nodes
    const client = await test.createClient({ proof: true, requestCount: 1 })

    // create 2 accounts
    const pk1 = await test.createAccount('0x01')

    // send 1000 wei from a to b
    const receipt = await tx.sendTransaction(test.url, {
      privateKey: pk1,
      gas: 22000,
      to: pk1.substr(0, 42), // any address, we just need a simple transaction in the last block
      data: '',
      value: 1000,
      confirm: true
    })

    // get the last Block
    const b1 = await client.sendRPC('eth_getBlockByNumber', ['latest', false], null, { keepIn3: true })

    const result1 = b1.result as any as BlockData
    assert.exists(b1.in3)
    assert.exists(b1.in3.proof)
    const proof1 = b1.in3.proof as any
    assert.equal(proof1.type, 'blockProof')
    assert.notExists(proof1.block) // no block needed
    assert.exists(proof1.transactions) // transactions are needed to calc the transactionRoot

    const b = await client.sendRPC('eth_getBlockByNumber', ['latest', true], null, { keepIn3: true })

    const result = b.result as any as BlockData
    assert.exists(b.in3)
    assert.exists(b.in3.proof)
    const proof = b.in3.proof as any
    assert.equal(proof.type, 'blockProof')
    assert.notExists(proof.block) // no block needed
    assert.notExists(proof.transactions) // no block needed

    const block = new Block(b.result)

    assert.equal('0x' + block.hash().toString('hex').toLowerCase(), (b.result as any as BlockData).hash, 'the hash of the blockheader in the proof must be the same as the blockHash in the Transactiondata')


    let failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getBlockByNumber' }, (req, re: RPCResponse) => {
        // we change a property
        (re.result as any).gasUsed = (re.result as any).gasLimit
        return re
      })
      await client.sendRPC('eth_getBlockByNumber', [(b.result as any as BlockData).number, true])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated block must fail!')
  })

  it('eth_getBlockByHash', async () => {
    const test = new TestTransport(3) // create a network of 3 nodes
    const client = await test.createClient({ proof: true, requestCount: 1 })

    // create 2 accounts
    const pk1 = await test.createAccount('0x01')

    // send 1000 wei from a to b
    const receipt = await tx.sendTransaction(test.url, {
      privateKey: pk1,
      gas: 22000,
      to: pk1.substr(0, 42), // any address, we just need a simple transaction in the last block
      data: '',
      value: 1000,
      confirm: true
    })

    // get the last Block
    const b = await client.sendRPC('eth_getBlockByHash', [receipt.blockHash, true], null, { keepIn3: true })
    const result = b.result as any as BlockData
    assert.exists(b.in3)
    assert.exists(b.in3.proof)
    const proof = b.in3.proof as any
    assert.equal(proof.type, 'blockProof')
    assert.notExists(proof.block) // no block needed
    assert.notExists(proof.transactions) // no block needed

    const block = new Block(b.result)

    assert.equal('0x' + block.hash().toString('hex').toLowerCase(), receipt.blockHash, 'the hash of the blockheader in the proof must be the same as the blockHash in the Transactiondata')


    let failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getBlockByHash' }, (req, re: RPCResponse) => {
        // we change a property
        (re.result as any).gasUsed = (re.result as any).gasLimit
        return re
      })
      await client.sendRPC('eth_getBlockByHash', [receipt.blockHash, true])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated block must fail!')
  })


  it('eth_getBalance', async () => {
    let test = new TestTransport(1) // create a network of 3 nodes
    let client = await test.createClient({ proof: true, requestCount: 1 })

    // create 2 accounts
    const pk1 = await test.createAccount('0x01')
    const adr = getAddress(pk1)

    // get the last Block
    const b = await client.sendRPC('eth_getBalance', [adr, 'latest'], null, { keepIn3: true })
    const result = b.result as any as BlockData
    assert.exists(b.in3)
    assert.exists(b.in3.proof)
    const proof = b.in3.proof as any
    assert.equal(proof.type, 'accountProof')
    assert.exists(proof.block)
    assert.exists(proof.account)


    let failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getBalance' }, (req, re: RPCResponse) => {
        // we change the returned balance
        re.result = re.result + '00'
        return re
      })
      await client.sendRPC('eth_getBalance', [adr, 'latest'])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated balance must fail!')
    test.clearInjectedResponsed()

    // we need to create a new client since the old node is blacklisted
    test = new TestTransport(1) // create a network of 3 nodes
    client = await test.createClient({ proof: true, requestCount: 1 })

    failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getBalance' }, (req, re: RPCResponse) => {
        // we change the returned balance and the value in the proof
        (re.in3.proof as any).account.balance = re.result + '00';
        re.result = re.result + '00'
        return re
      })
      await client.sendRPC('eth_getBalance', [adr, 'latest'])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated balance must fail!')



  })

  it('eth_getTransactionCount', async () => {
    let test = new TestTransport(1) // create a network of 3 nodes
    let client = await test.createClient({ proof: true, requestCount: 1 })

    // create 2 accounts
    const pk1 = await test.createAccount('0x01')
    const adr = getAddress(pk1)

    // get the last Block
    const b = await client.sendRPC('eth_getTransactionCount', [adr, 'latest'], null, { keepIn3: true })
    const result = b.result as any as BlockData
    assert.exists(b.in3)
    assert.exists(b.in3.proof)
    const proof = b.in3.proof as any
    assert.equal(proof.type, 'accountProof')
    assert.exists(proof.block)
    assert.exists(proof.account)


    let failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getTransactionCount' }, (req, re: RPCResponse) => {
        // we change the returned balance
        re.result = re.result + '00'
        return re
      })
      await client.sendRPC('eth_getTransactionCount', [adr, 'latest'])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated nonce must fail!')
    test.clearInjectedResponsed()

    // we need to create a new client since the old node is blacklisted
    test = new TestTransport(1) // create a network of 3 nodes
    client = await test.createClient({ proof: true, requestCount: 1 })

    failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getTransactionCount' }, (req, re: RPCResponse) => {
        // we change the returned balance and the value in the proof
        (re.in3.proof as any).account.balance = re.result + '00';
        re.result = re.result + '00'
        return re
      })
      await client.sendRPC('eth_getTransactionCount', [adr, 'latest'])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated nonce must fail!')



  })



  it('eth_getCode', async () => {
    let test = new TestTransport(1) // create a network of 3 nodes
    let client = await test.createClient({ proof: true, requestCount: 1 })

    // create 2 accounts
    const pk1 = await test.createAccount('0x01')

    // check empty code
    await client.sendRPC('eth_getCode', [getAddress(pk1), 'latest'], null, { keepIn3: true })

    // check deployed code
    const adr = await deployChainRegistry(pk1)
    const b = await client.sendRPC('eth_getCode', [adr, 'latest'], null, { keepIn3: true })
    const result = b.result as any as BlockData
    assert.exists(b.in3)
    assert.exists(b.in3.proof)
    const proof = b.in3.proof as any
    assert.equal(proof.type, 'accountProof')
    assert.exists(proof.block)
    assert.exists(proof.account)


    let failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getCode' }, (req, re: RPCResponse) => {
        // we change the returned balance
        re.result = re.result + '00'
        return re
      })
      await client.sendRPC('eth_getCode', [adr, 'latest'])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated nonce must fail!')
    test.clearInjectedResponsed()

    // we need to create a new client since the old node is blacklisted
    test = new TestTransport(1) // create a network of 3 nodes
    client = await test.createClient({ proof: true, requestCount: 1 })

    failed = false
    try {
      // now manipulate the result
      test.injectResponse({ method: 'eth_getCode' }, (req, re: RPCResponse) => {
        // we change the returned balance and the value in the proof
        (re.in3.proof as any).account.balance = re.result + '00';
        re.result = re.result + '00'
        return re
      })
      await client.sendRPC('eth_getCode', [adr, 'latest'])
    }
    catch {
      failed = true
    }
    assert.isTrue(failed, 'The manipulated code must fail!')

  })


})

