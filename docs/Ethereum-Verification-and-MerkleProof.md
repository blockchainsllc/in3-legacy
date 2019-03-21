# Technical Background 

## Ethereum Verification

The Incubed is also often called Minimal Verifying Client because it may not sync, but still is able to verify all incoming data. This is possible since ethereum is based on a technology allowing to verify almost any value.

Our goal was to verify at least all standard `eth_...` rpc methods as described in the [Specification](https://github.com/ethereum/wiki/wiki/JSON-RPC).

In order to prove something, you always need a starting value. In our case this is the BlockHash. Why do we use the BlockHash? If you know the BlockHash of a block, you can easily verify the full BlockHeader. And since the BlockHeader contains the stateRoot, transationRoot and receiptRoot, these can be verified as well. And the rest will simply depend on them.

There is also another reason why the BlockHash is so important. This is the only value you are able to access from within a SmartContract, because the evm supports a OpCode (`BLOCKHASH`), which allows you to read the last 256 Blockhashes, which gives us the chance to even verify the blockhash onchain.

Depending on the method, different proofs are needed, which are described in this document.

- **[Block Proof](#blockproof)** - verifies the content of the BlockHeader
- **[Transaction Proof](#transaction-proof)** - verifies the input data of a transaction
- **[Receipt Proof](#receipt-proof)** - verifies the outcome of a transaction
- **[Log Proof](#log-proof)** - verifies the response of `eth_getPastLogs`
- **[Account Proof](#account-proof)** - verifies the state of an account
- **[Call Proof](#call-proof)** - verifies the result of a `eth_call` - response


### BlockProof

BlockProofs are used whenever you want to read data of a Block and verify them. This would be:

- [eth_getBlockTransactionCountByHash
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblocktransactioncountbyhash)
- [eth_getBlockTransactionCountByNumber
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblocktransactioncountbynumber)
- [eth_getBlockByHash
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash)
- [eth_getBlockByNumber
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber)

The `eth_getBlockBy...` methods return the Block-Data. In this case all we need is somebody verifying the blockhash, which is don by requiring somebody who stored a deposit and would lose it, to sign this blockhash.

The Verification is then simply by creating the blockhash and comparing this to the signed one.

The Blockhash is calculated by [serializing the blockdata](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L120) with [rlp](https://github.com/ethereum/wiki/wiki/RLP) and hashing it:

```js
blockHeader = rlp.encode([
  bytes32( parentHash ),
  bytes32( sha3Uncles ),
  address( miner || coinbase ),
  bytes32( stateRoot ),
  bytes32( transactionsRoot ),
  bytes32( receiptsRoot || receiptRoot ),
  bytes256( logsBloom ),
  uint( difficulty ),
  uint( number ),
  uint( gasLimit ),
  uint( gasUsed ),
  uint( timestamp ),
  bytes( extraData ),

  ... sealFields
    ? sealFields.map( rlp.decode )
    : [
      bytes32( b.mixHash ),
      bytes8( b.nonce )
    ]
])
```

For POA-Chains the blockheader will use the `sealFields` (instead of mixHash and nonce) which are already rlp-encoded and should be added as raw data when using rlp.encode.

```js
if (keccak256(blockHeader) !== singedBlockHash) 
  throw new Error('Invalid Block')
```

In case of the `eth_getBlockTransactionCountBy...` the proof contains the full blockHeader already serilalized + all transactionHashes. This is needed in order to verify them in a merkleTree and compare them with the `transactionRoot`


### Transaction Proof

TransactionProofs are used for the following transaction-methods:

- [eth_getTransactionByHash
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyhash)
- [eth_getTransactionByBlockHashAndIndex
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyblockhashandindex)
- [eth_getTransactionByBlockNumberAndIndex](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyblocknumberandindex)

In order to verify we need :

1. serialize the blockheader and compare the blockhash with the signed hash as well as with the blockHash and number of the transaction. (See [BlockProof](#blockproof))


2. serialize the transaction-data

```js
transaction = rlp.encode([
  uint( tx.nonce ),
  uint( tx.gasPrice ),
  uint( tx.gas || tx.gasLimit ),
  address( tx.to ),
  uint( tx.value ),
  bytes( tx.input || tx.data ),
  uint( tx.v ),
  uint( tx.r ),
  uint( tx.s )
])
``` 

3. verify the merkleProof of the transaction with

```js
verifyMerkleProof(
  blockHeader.transactionRoot, /* root */,
  keccak256(proof.txIndex), /* key or path */
  proof.merkleProof, /* serialized nodes starting with the root-node */
  transaction /* expected value */
)
```


The Proof-Data will look like these:

```js
{
  "jsonrpc": "2.0",
  "id": 6,
  "result": {
    "blockHash": "0xf1a2fd6a36f27950c78ce559b1dc4e991d46590683cb8cb84804fa672bca395b",
    "blockNumber": "0xca",
    "from": "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
    "gas": "0x55f0",
    "gasPrice": "0x0",
    "hash": "0xe9c15c3b26342e3287bb069e433de48ac3fa4ddd32a31b48e426d19d761d7e9b",
    "input": "0x00",
    "value": "0x3e8"
    ...
  },
  "in3": {
    "proof": {
      "type": "transactionProof",
      "block": "0xf901e6a040997a53895b48...", // serialized blockheader
      "merkleProof": [  /* serialized nodes starting with the root-node */
        "f868822080b863f86136808255f0942b5ad5c4795c026514f8317c7a215e218dccd6cf8203e8001ca0dc967310342af5042bb64c34d3b92799345401b26713b43faf253bd4bf972cbba0464bade028ba54e0f78482757feeda354f3abedac35955ec07f822aad8d020c4"
      ],
      "txIndex": 0,
      "signatures": [...]
    }
  }
}
```


### Receipt Proof

Proofs for the transactionReceipt are used for the following transaction-method:

- [eth_getTransactionReceipt
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt)

In order to verify we need :

1. serialize the blockheader and compare the blockhash with the signed hash as well as with the blockHash and number of the transaction. (See [BlockProof](#blockproof))


2. serialize the transaction receipt

```js
transactionReceipt = rlp.encode([
  uint( r.status || r.root ),
  uint( r.cumulativeGasUsed ),
  bytes256( r.logsBloom ),
  r.logs.map(l => [
    address( l.address ),
    l.topics.map( bytes32 ),
    bytes( l.data )
  ])
].slice(r.status === null && r.root === null ? 1 : 0))
``` 

3. verify the merkleProof of the transaction receipt with

```js
verifyMerkleProof(
  blockHeader.transactionReceiptRoot, /* root */,
  keccak256(proof.txIndex), /* key or path */
  proof.merkleProof, /* serialized nodes starting with the root-node */
  transactionReceipt /* expected value */
)
```

4. Since the merkle-Proof is only proving the value for the given transactionIndex, we also need to prove that the transactionIndex matches the transactionHash requested. This is done by adding another MerkleProof for the Transaction itself as described in the [Transaction Proof](#transaction-proof)

### Log Proof

Proofs for logs are only for the one rpc-method:

- [eth_getLogs
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs)

Since logs or events are based on the TransactionReceipts, the only way to prove them is by proving the TransactionReceipt each event belongs to.

That's why this proof needs to provide
- all blockheaders where these events occured
- all TransactionReceipts + their MerkleProof of the logs
- all MerkleProofs for the transactions in order to prove the transactionIndex

The Proof data structure will look like this:

```ts
  Proof {
    type: 'logProof',
    logProof: {
      [blockNr: string]: {  // the blockNumber in hex as key
        block : string  // serialized blockheader
        receipts: {
          [txHash: string]: {  // the transactionHash as key
            txIndex: number // transactionIndex within the block
            txProof: string[] // the merkle Proof-Array for the transaction
            proof: string[] // the merkle Proof-Array for the receipts
          }
        }
      }
    }
  }
```


In order to verify we need :

1. deserialize each blockheader and compare the blockhash with the signed hashes. (See [BlockProof](#blockproof))

2. for each blockheader we verify all receipts by using 

```js
verifyMerkleProof(
  blockHeader.transactionReceiptRoot, /* root */,
  keccak256(proof.txIndex), /* key or path */
  proof.merkleProof, /* serialized nodes starting with the root-node */
  transactionReceipt /* expected value */
)
```

3. The resulting values are the receipts. For each log-entry, we are comparing the verified values of the receipt with the returned logs to ensure that they are correct. 

### Account Proof

Prooving an account-value applies to these functions:

- [eth_getBalance](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance)
- [eth_getCode](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getcode)
- [eth_getTransactionCount](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount)
- [eth_getStorageAt](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getstorageat)

#### eth_getProof

For the Transaction or Block Proofs all needed data can be found in the block itself and retrieved through standard rpc calls, but if we want to approve the values of an account, we need the MerkleTree of the state, which is not accessable through the standard rpc. That's why we have created a [EIP](https://github.com/ethereum/EIPs/issues/1186) to add this function and also implemented this in geth and parity:

- [parity](https://github.com/paritytech/parity/pull/9001) (Status: pending pull request) - [Docker](https://hub.docker.com/r/slockit/parity-in3/tags/)
- [geth](https://github.com/ethereum/go-ethereum/pull/17737) (Status: pending pull request) - [Docker](https://hub.docker.com/r/slockit/geth-in3/tags/)


This function accepts 3 parameter :
1. `account` - the address of the account to proof
2. `storage` - a array of storage-keys to include in the proof.
3. `block` - integer block number, or the string "latest", "earliest" or "pending"

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_getProof",
  "params": [
    "0x7F0d15C7FAae65896648C8273B6d7E43f58Fa842",
    [  "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421" ],
    "latest"
  ]
}
```

The result will look like this:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "accountProof": [
      "0xf90211a...0701bc80",
      "0xf90211a...0d832380",
      "0xf90211a...5fb20c80",
      "0xf90211a...0675b80",
      "0xf90151a0...ca08080"
    ],
    "address": "0x7f0d15c7faae65896648c8273b6d7e43f58fa842",
    "balance": "0x0",
    "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    "nonce": "0x0",
    "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "storageProof": [
      {
        "key": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "proof": [
          "0xf90211a...0701bc80",
          "0xf90211a...0d832380"
        ],
        "value": "0x1"
      }
    ]
  },
  "id": 1
}
```

In order to run the verification the blockheader is needed as well.

The Verification of such a proof is done in the following steps:

1. serialize the blockheader and compare the blockhash with the signed hash as well as with the blockHash and number of the transaction. (See [BlockProof](#blockproof))

2. Serialize the account, which holds the 4 values:

```js
account = rlp.encode([
  uint( nonce),
  uint( balance),
  bytes32( storageHash || ethUtil.KECCAK256_RLP),
  bytes32( codeHash || ethUtil.KECCAK256_NULL)
])
```

3. verify the merkle Proof for the account using the stateRoot of the blockHeader:

```js
verifyMerkleProof(
 block.stateRoot, // expected merkle root
 util.keccak(accountProof.address), // path, which is the hashed address
 accountProof.accountProof.map(bytes), // array of Buffer with the merkle-proof-data
 isNotExistend(accountProof) ? null : serializeAccount(accountProof), // the expected serialized account
)
```


In case the account does exist yet, (which is the case if `none` == `startNonce` and `codeHash` == `'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'`), the proof may end with one of these nodes:
    
- the last node is a branch, where the child of the next step does not exist.
    
- the last node is a leaf with different relative key

Both would prove, that this key does not exist.



4. Verify each merkle Proof for the storage using the storageHash of the account:

```js
verifyMerkleProof(
  bytes32( accountProof.storageHash ),   // the storageRoot of the account
  util.keccak(bytes32(s.key)),  // the path, which is the hash of the key
  s.proof.map(bytes), // array of Buffer with the merkle-proof-data
  s.value === '0x0' ? null : util.rlp.encode(s.value) // the expected value or none to proof non-existence
))
```



### Call Proof

Call Proofs are used whenever you are calling a read-only function of smart contract:

- [eth_call](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call)


Verifying the result of a `eth_call` is a little bit more complex. Because the response is a result of executing opcodes in the vm. The only way to do so, is to reproduce it and execute the same code. That's why a Call Proof needs to provide all data used within the call. This means :

- all referred accounts including the code (if it is a contract), storageHash, nonce and balance.
- all storage keys, which are used ( This can be found by tracing the transaction and collecting data based on th `SLOAD`-opcode )
- all blockdata, which are referred at (besides the current one, also the `BLOCKHASH`-opcodes are referring to former blocks) 

For Verifying you need to follow these steps:

1. serialize all used blockheaders and compare the blockhash with the signed hashes. (See [BlockProof](#blockproof))

2. Verify all used accounts and their storage as showed in [Account Proof](#account-proof)

3. create a new [VM](https://github.com/ethereumjs/ethereumjs-vm) with a MerkleTree as state and fill in all used value in the state:


```js 
  // create new state for a vm
  const state = new Trie()
  const vm = new VM({ state })

  // fill in values
  for (const adr of Object.keys(accounts)) {
    const ac = accounts[adr]

    // create an account-object
    const account = new Account([ac.nonce, ac.balance, ac.stateRoot, ac.codeHash])

    // if we have a code, we will set the code
    if (ac.code) account.setCode( state, bytes( ac.code ))

    // set all storage-values
    for (const s of ac.storageProof)
      account.setStorage( state, bytes32( s.key ), rlp.encode( bytes32( s.value )))

    // set the account data
    state.put( address( adr ), account.serialize())
  }

  // add listener on each step to make sure it uses only values found in the proof
  vm.on('step', ev => {
     if (ev.opcode.name === 'SLOAD') {
        const contract = toHex( ev.address ) // address of the current code
        const storageKey = bytes32( ev.stack[ev.stack.length - 1] ) // last element on the stack is the key
        if (!getStorageValue(contract, storageKey))
          throw new Error(`incomplete data: missing key ${storageKey}`)
     }
     /// ... check other opcodes as well
  })

  // create a transaction
  const tx = new Transaction(txData)

  // run it
  const result = await vm.runTx({ tx, block: new Block([block, [], []]) })

  // use the return value
  return result.vm.return
```

In the future we will be using the same approach to verify calls with ewasm.


