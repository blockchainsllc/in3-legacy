## Examples

This is a collection of different incubed-examples.

### using Web3

Since incubed works with on a JSON-RPC-Level it can easily be used as Provider for Web3:

```js
// import in3-Module
import In3Client from 'in3'
import * as web3 from 'web3'

// use the In3Client as Http-Provider
const web3 = new Web3(new In3Client({
    proof         : 'standard',
    signatureCount: 1,
    requestCount  : 2,
    chainId       : 'mainnet'
}).createWeb3Provider())

// use the web3
const block = await web.eth.getBlockByNumber('latest')
...

```

### using Incubed API


Incubed includes a light API, allowinng not only to use all RPC-Methods in a typesafe way, but also to sign transactions and call funnctions of a contract without the web3-library.

For more details see the [API-Doc](api-ts.html#type-client)


```ts


// import in3-Module
import In3Client from 'in3'

// use the In3Client
const in3 = new In3Client({
    proof         : 'standard',
    signatureCount: 1,
    requestCount  : 2,
    chainId       : 'mainnet'
})

// use the api to call a funnction..
const myBalance = await in3.eth.callFn(myTokenContract, 'balanceOf(address):uint', myAccount)

// ot to send a transaction..
const receipt = await in3.eth.sendTransaction({ 
  to           : myTokenContract, 
  method       : 'transfer(address,uint256)',
  args         : [target,amount],
  confirmations: 2,
  pk           : myKey
})

...
```

### Reading event with incubed


```js

// import in3-Module
import In3Client from 'in3'

// use the In3Client
const in3 = new In3Client({
    proof         : 'standard',
    signatureCount: 1,
    requestCount  : 2,
    chainId       : 'mainnet'
})

// use the ABI-String of the smart contract
abi = [{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"cost","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"}],"name":"NameRegistered","type":"event"}]

// create a contract-object for a given address
const contract = in3.eth.contractAt(abi, '0xF0AD5cAd05e10572EfcEB849f6Ff0c68f9700455') // ENS contract.

// read all events starting from a specified block until the latest
const logs = await c.events.NameRegistered.getLogs({fromBlock:8022948})) 

// print out the properties of the event.
for (const ev of logs) 
  console.log(`${ev.owner} registered ${ev.name} for ${ev.cost} wei until ${new Date(ev.expires.toNumber()*1000).toString()}`)

...
```
