# INCUBED

A trustless INcentivized remote Node Network or IN3.

This reposirotyr contains the Typescript version of the incubed client.

[![Build Status](https://travis-ci.com/slockit/in3.svg?token=2HePjq6vsCVWSbiYxgEy&branch=master)](https://travis-ci.com/slockit/in3)

# Getting started

```
npm install --save in3
```

In you code:

```js

// import in3-Module
import In3Client from 'in3'
import * as web3 from 'web3'

// use the In3Client as Http-Provider
const web3 = new Web3(new In3Client({
    proof: true,
    signatureCount: 1,
    requestCount : 2,
    chainId: '0x01'
}))

// use the web3 
const block = await web.eth.getBlockByNumber('latest')
...


```

# What is Incubed?

Targeting the mass scale applications of Smart Cities and the Sharing Economy, Incubed is a light client alternative for embedded computers and low energy devices. It is designed to enable electronics such as padlocks, door locks, suitcases, watches, and mobiles, to grant and check access rights, send and verify payments, and execute smart contracts. All with the same security level offered by other options but with significantly reduced footprint.

Incubed leverages an incentivized network running on top of full blockchain nodes that receive micropayments for yielding the blockchain transactions on behalf of the devices. After confirming these transactions, the nodes return proofs to the querying devices. These devices compute the validity of such proofs and will punish nodes providing wrong or outdated data. Thus the network behavior is analogous to insurance market models.

Read more on our [webpage](https://slock.it/incubed.html) or in the documentation section below.

# Documentation

- [API](https://github.com/slockit/in3/blob/master/doc/README.md) - Client API classes and functions.
- [DataTypes](https://github.com/slockit/in3/blob/master/src/types/README.md) - Defintion of data structures used by the client.
- [Verification](https://github.com/slockit/in3/wiki/Ethereum-Verification-and-MerkleProof) - About the process of proof verification. Proofs are sent by the [in3-server](https://github.com/slockit/in3-server) to after the in3 client requests chain data or sends a transaction.
- [Wiki](https://github.com/slockit/in3/wiki). A wiki with examples and explanation of the protocol.


# Tests

- Result of the last nightly tests for [in3](http://travis.slock.it/in3/) and [in3-server](http://travis.slock.it/in3-server/)
- [Code Coverage](http://travis.slock.it/in3-server/coverage/index.html) for client and server
