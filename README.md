# INCUBED

The Minimal Verification Client

INCUBED = A trustless INcentivized remote Node Network = IN3

# Getting started

```
npm install --save in3
```

In your code:

```js

// import in3-Module
import In3Client from 'in3'
import * as web3 from 'web3'

// use the In3Client as Http-Provider
const web3 = new Web3(new In3Client({
    proof: 'standard',
    signatureCount: 1,
    requestCount : 2,
    chainId: 'mainnet'
}))

// use the web3
const block = await web.eth.getBlockByNumber('latest')
...


```

# Features

- **Failsafe Connection** - The Incubed client will connect to any ethereum-blockchain (providing in3-servers) by randomly selecting nodes within the incubed-network and automatically retry with different nodes, if the node cannot be reached or deliver verifiable responses.
- **Reputation Management** - Nodes which are not available will automatically temporarily blacklisted and loose reputation. The selection of a node is based on the weight (or performance) of the node and their availability.
- **Automatic Nodelist Updates** - ALl incubed nodes are registered in smart contracts on chain and will trigger events if the nodelist changes. Each request will always return the blocknumber of the last event, so client knows when to update its nodelist.
- **Partial Nodelist** - In order to support small devices, the nodelist can be limited and still be fully verified by basing the selection of nodes deterministicly on a client generated seed.
- **MultiChain Support** - Incubed is currently supporting any ethereum-based chain. The client can run even parallel requests to different networks without the need to synchronize first.
- **Preconfigured Boot Nodes** - While you can configure any registry-contract, the standard version contains configuration with boot nodes for `mainnet`, `kovan`, `evan`, `tobalaba` and `ipfs`.
- **Full Verification of JSON-RPC-Methods** - Incubed is able to fully verify all important JSPN-RPC-Methods. This even includes calling functions in smart contract and verifying their return-value (`eth_call`), which means executing each opcode locally in the client in order to confirm the result.  
- **IPFS-Support** - Incubed is able to write and read IPFS-content and verify the data by hashing and creating the the multihash.
- **Caching Support** - a optional cache allows to store the result of rpc-requests and automatically use it within again within a configurable timespan or if the client if offline. This also includes RPC-Requests, blocks, code and nodelists)
- **Custom Configuration** - The client is highly customizable. For each single request a configuration can be explicitly passed or by adjusting it through events (`client.on('beforeRequest',...)`). This allows  to optimize proof-level or number of requests to be send depending in the context.
- **Proof-Levels** Incubed support different proof-levels: `none` -  for no verification, `standard` - for verifying only relevant properties and  `full` - for complete vertification including uncle blocks or previous Transaction (higher payload) )
- **Security-Levels** - configurable number of signatures (for PoW) and minimal deposit stored.
- **PoW-Support** - For PoW blocks are verified based on blockhashes signed by incubed nodes storing a deposit which they would lose if this blockhash is not correct.
- **PoA-Support** - For PoA-Chains blockhashes are verified by extracting the signature from the sealed fields of the blockheader and using the aura-algorithm to determine the signer from the Validatorlist ( with static Validatorlist or contract based validators )
- **Finality-Support** - For PoA-Chains the client can require a configurable number of signatures (in percent) to accept it as final.
- **Flexible Transport-layer** - The communication-layer between clients and nodes can be overriden, but already support different transport-formats (json/cbor/in3)
- **Replace Latest-Blocks** - Since most application per default always ask request for the latest block, which can not be considered as final in a PoW-Chain, a configuration allows to automatically use a certain blockheight to run the request. (like 6 blocks)
- **Light Ethereum API** - Incubed comes with a typesafe simple API, which covers all standard JSON-RPC-Requests ( `in3.eth.getBalance('0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5')` ). This API also includes support for signing and sending transactions as well as calling methods in smart contracts without a complete ABI by simply passing the signature of thr method as argument.
- **TypeScript Support** - as Incubed is written 100% in typescript, you get all the advantages of a typesafe blockchain.
- **Integrations** -  Incubes has been successfully tested in all major Browsers, nodejs and even react-native.
- **Signed Requests** - Incubed supports the Incentivisation-Layer which requires signed requests in order to assign client-request to certain nodes.


# Docker

In order to start the incubed-client as a standalone client (allowing others none-js-application to connect to it), you can start the container as

```
docker run -d -p 8545:8545  slockit/in3:latest --chainId=mainnet
```

The application would then accept the following arguments:


|param|description|
|---|---|
|--nodeLimit|the limit of nodes to store in the client.|
|--keepIn3|if true, the in3-section of the response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.|
|--format|the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding|
|--autoConfig|if true the config will be adjusted depending on the request|
|--retryWithoutProof|if true the request may be handled without proof in case of an error. (use with care!)|
|--includeCode|if true, the request should include the codes of all accounts. otherwise only the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards|
|--maxCodeCache|number of max bytes used to cache the code in memory|
|--maxBlockCache|number of number of blocks cached  in memory|
|--proof|'none' for no verification, 'standard' for verifying all important fields, 'full'  verifying all fields even if this means a high payload.|
|--signatureCount|number of signatures requested|
|--finality|percenage of validators signed blockheaders - this is used for PoA (aura) |
|--minDeposit|min stake of the server. Only nodes owning at least this amount will be chosen.|
|--replaceLatestBlock|if specified, the blocknumber *latest* will be replaced by blockNumber- specified value|
|--requestCount|the number of request send when getting a first answer|
|--timeout|specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.|
|--chainId|servers to filter for the given chain. The chain-id based on EIP-155.|
|--chainRegistry|main chain-registry contract|
|--mainChain|main chain-id, where the chain registry is running.|
|--autoUpdateList|if true the nodelist will be automatically updated if the lastBlock is newer|
|--loggerUrl|a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }|

# Documentation

The following documentations are available:

- [API](https://github.com/slockit/in3/blob/master/doc/README.md) - Definition of Classes and available functions.
- [DataTypes](https://github.com/slockit/in3/blob/master/src/types/README.md) - Definition of datastructures used inside the client.
- [Verification](https://github.com/slockit/in3/wiki/Ethereum-Verification-and-MerkleProof). A documentation about the verification of proofs send by a IN3-Server.
- [Incubed concept explained by Chrisptoph Jentzsch (CEO) (youtube)](https://www.youtube.com/watch?v=_vodQubed2A)
- [Ethereum Verification explained by Simon Jentzsch (CTO) (youtube)](https://www.youtube.com/watch?v=wlUlypmt6Oo)
- [Wiki](https://github.com/slockit/in3/wiki). A wiki with examples and explanations of the protocol.
- [Whitepaper](https://download.slock.it/whitepaper_incubed_draft.pdf). The whitepaper describing the vision and idea.

# Chains

Currently incubed is deployed on the following chains:

### Mainnet

Registry : [0x2736D225f85740f42D17987100dc8d58e9e16252](https://eth.slock.it/#/main/0x2736D225f85740f42D17987100dc8d58e9e16252)    
ChainId : 0x1 (alias `mainnet`)    
Status : [https://in3.slock.it?n=mainnet](https://in3.slock.it?n=mainnet)    
NodeList: [https://in3.slock.it/mainnet/nd-3](https://in3.slock.it/mainnet/nd-3/api/in3_nodeList)


### Kovan

Registry : [0x27a37a1210df14f7e058393d026e2fb53b7cf8c1](https://eth.slock.it/#/kovan/0x27a37a1210df14f7e058393d026e2fb53b7cf8c1)    
ChainId : 0x2a (alias `kovan`)    
Status : [https://in3.slock.it?n=kovan](https://in3.slock.it?n=kovan)    
NodeList: [https://in3.slock.it/kovan/nd-3](https://in3.slock.it/kovan/nd-3/api/in3_nodeList)


### Tobalaba

Registry : [0x845E484b505443814B992Bf0319A5e8F5e407879](https://eth.slock.it/#/tobalaba/0x845E484b505443814B992Bf0319A5e8F5e407879)    
ChainId : 0x44d (alias `tobalaba`)    
Status : [https://in3.slock.it?n=tobalaba](https://in3.slock.it?n=tobalaba)    
NodeList: [https://in3.slock.it/tobalaba/nd-3](https://in3.slock.it/tobalaba/nd-3/api/in3_nodeList)



### Evan

Registry : [0x85613723dB1Bc29f332A37EeF10b61F8a4225c7e](https://eth.slock.it/#/evan/0x85613723dB1Bc29f332A37EeF10b61F8a4225c7e)    
ChainId : 0x4b1 (alias `evan`)    
Status : [https://in3.slock.it?n=evan](https://in3.slock.it?n=evan)    
NodeList: [https://in3.slock.it/evan/nd-3](https://in3.slock.it/evan/nd-3/api/in3_nodeList)


### IPFS

Registry : [0xf0fb87f4757c77ea3416afe87f36acaa0496c7e9](https://eth.slock.it/#/kovan/0xf0fb87f4757c77ea3416afe87f36acaa0496c7e9)    
ChainId : 0x7d0 (alias `ipfs`)    
Status : [https://in3.slock.it?n=ipfs](https://in3.slock.it?n=ipfs)    
NodeList: [https://in3.slock.it/ipfs/nd-3](https://in3.slock.it/ipfs/nd-3/api/in3_nodeList)


# Registering a own in3-node

If you want to participate in this network and also register a node, you need to send a transaction to the registry-contract calling `registerServer(string _url, uint _props)`.

ABI of the registry:

```js
[{"constant":true,"inputs":[],"name":"totalServers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_serverIndex","type":"uint256"},{"name":"_props","type":"uint256"}],"name":"updateServer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_url","type":"string"},{"name":"_props","type":"uint256"}],"name":"registerServer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"servers","outputs":[{"name":"url","type":"string"},{"name":"owner","type":"address"},{"name":"deposit","type":"uint256"},{"name":"props","type":"uint256"},{"name":"unregisterTime","type":"uint128"},{"name":"unregisterDeposit","type":"uint128"},{"name":"unregisterCaller","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_serverIndex","type":"uint256"}],"name":"cancelUnregisteringServer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_serverIndex","type":"uint256"},{"name":"_blockhash","type":"bytes32"},{"name":"_blocknumber","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"convict","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_serverIndex","type":"uint256"}],"name":"calcUnregisterDeposit","outputs":[{"name":"","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_serverIndex","type":"uint256"}],"name":"confirmUnregisteringServer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_serverIndex","type":"uint256"}],"name":"requestUnregisteringServer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"props","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"LogServerRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"caller","type":"address"}],"name":"LogServerUnregisterRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"owner","type":"address"}],"name":"LogServerUnregisterCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"owner","type":"address"}],"name":"LogServerConvicted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"url","type":"string"},{"indexed":false,"name":"owner","type":"address"}],"name":"LogServerRemoved","type":"event"}]
```


To run a incubed node, you simply use docker-compose:

```yml
version: '2'
services:
  incubed-server:
    image: slockit/in3-server:latest
    volumes:
    - $PWD/keys:/secure                                     # directory where the private key is stored
    ports:
    - 8500:8500/tcp                                         # open the port 8500 to be accessed by public
    command:
    - --privateKey=/secure/myKey.json                       # internal path to the key
    - --privateKeyPassphrase=dummy                          # passphrase to unlock the key
    - --chain=0x1                                           # chain (kovan)
    - --rpcUrl=http://incubed-parity:8545                   # url of the kovan-client
    - --registry=0xFdb0eA8AB08212A1fFfDB35aFacf37C3857083ca # url of the incubed-registry
    - --autoRegistry-url=http://in3.server:8500             # check or register this node for this url
    - --autoRegistry-deposit=2                              # deposit to use when registering

  incubed-parity:
    image: slockit/parity-in3:v2.2                          # parity-image with the getProof-function implemented
    command:
    - --auto-update=none                                    # do not automatically update the client
    - --pruning=archive
    - --pruning-memory=30000                                # limit storage
```
