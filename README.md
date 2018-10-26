# INCUBED

INCUBED = A trustless INcentivized remote Node Network = IN3

This is the Typescript-version of the incubed client.

[![Build Status](https://travis-ci.com/slockit/in3.svg?token=2HePjq6vsCVWSbiYxgEy&branch=master)](https://travis-ci.com/slockit/in3)

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
    proof: true,
    signatureCount: 1,
    requestCount : 2,
    chainId: 'mainnet'
}))

// use the web3 
const block = await web.eth.getBlockByNumber('latest')
...


```

# Docker

In order to start the incubed-client as a standalone client (allowing others none-js-application to connect to it), you can start the container as

```
docker run -d -p 8545:8545  slockit/in3:latest --chainId=kovan
```

The application would then accept the following arguments:


|param|description|
|---|---|
|--nodeLimit|the limit of nodes to store in the client.|
|--keepIn3|if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.|
|--format|the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding|
|--autoConfig|if true the config will be adjusted depending on the request|
|--retryWithoutProof|if true the request may be handled without proof in case of an error. (use with care!)|
|--includeCode|if true, the request should include the codes of all accounts. otherwise only the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards|
|--maxCodeCache|number of max bytes used to cache the code in memory|
|--maxBlockCache|number of number of blocks cached  in memory|
|--verifiedHashes|if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number. This is automaticly updated by the cache, but can be overriden per request.|
|--proof|if true the nodes should send a proof of the response|
|--signatureCount|number of signatures requested|
|--minDeposit|min stake of the server. Only nodes owning at least this amount will be chosen.|
|--replaceLatestBlock|if specified, the blocknumber *latest* will be replaced by blockNumber- specified value|
|--requestCount|the number of request send when getting a first answer|
|--timeout|specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.|
|--chainId|servers to filter for the given chain. The chain-id based on EIP-155.|
|--chainRegistry|main chain-registry contract|
|--mainChain|main chain-id, where the chain registry is running.|
|--autoUpdateList|if true the nodelist will be automaticly updated if the lastBlock is newer|
|--cacheStorage|a cache handler offering 2 functions ( setItem(string,string), getItem(string) )|
|--loggerUrl|a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }|

# Documentation

The following docuemntations are available:

- [API](https://github.com/slockit/in3/blob/master/doc/README.md) - Definition of Classes and available functions.
- [DataTypes](https://github.com/slockit/in3/blob/master/src/types/README.md) - Defintion of datastructures used inside the client.
- [Verification](https://github.com/slockit/in3/wiki/Ethereum-Verification-and-MerkleProof). A documentaion about the varification of proofs send by a IN3-Server.
- [Wiki](https://github.com/slockit/in3/wiki). A wiki with examples and explanations of the protocol.
- [Whitepaper](https://download.slock.it/whitepaper_incubed_draft.pdf). The whitepaper describing the vision and idea.
