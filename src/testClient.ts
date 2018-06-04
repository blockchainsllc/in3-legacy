import Client from './client/Client'

// in case you wanto tuse the local client
const localConfig = {
  format: 'json',
  servers: {
    '0x000000000000000000000000000000000000000000000000000000000000002a': {
      contractChain: '0x000000000000000000000000000000000000000000000000000000000000002a',
      contract: '0xb9a2bB17675206F3233bF426eB4b64900F63cd28',
      nodeList: [
        {
          deposit: 0,
          chainIds: ['0x000000000000000000000000000000000000000000000000000000000000002a'],
          address: '0xa1bB1860c4aBF6F050F36cf672679d940c916a18',
          url: 'http://localhost:8500',
          props: 65535
        }
      ]
    }
  }
}

const c = new Client({
  proof: true,
  signatureCount: 1,
  keepIn3: true,
  requestCount: 1,
  format: 'cbor',
  //  ...localConfig as any
})
test().then(_ => console.log('done'), e => console.error('ERROR ' + e))
async function test() {


  console.log('update nodelist ...')
  await c.updateNodeList()

  // check the current blocknumber - 10, because the current one will not get any signatures
  const bn = await c.sendRPC('eth_blockNumber').then(_ => '0x' + (parseInt(_.result as string) - 10).toString(16))

  console.log('get balance for block ' + bn)
  debugger

  console.log('balance:', await c.sendRPC('eth_getBalance', ['0x5338d77B5905CdEEa7c55a1F3A88d03559c36D73', bn]).then(_ => _.result))


}

