# n3-ts
Typescript-version of the incubed client

[![Build Status](https://travis-ci.com/slockit/in3.svg?token=2HePjq6vsCVWSbiYxgEy&branch=master)](https://travis-ci.com/slockit/in3)

# getting started

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

# Verification

For a full documentation on how the verification works read this [document](https://github.com/slockit/in3/blob/master/doc/verification.md).