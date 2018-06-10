# Incubed - Verification

The Incubed is also often called Minimal Verifying Client, because he may not be syncing, but still is able to verify all incomming data. This is possible because the ethereum is based a technology allowing to verify almost any value.

Our goal was to verify at least all standard `eth_...` rpc methods as desribed in the [Specification](https://github.com/ethereum/wiki/wiki/JSON-RPC).

In order to proof anything, you always need a starting value. In our case this is the BlockHash. Why do we use the BlockHash? If you know the BlockHash of a block, you can easily verify the full BlockHeader. And since the BlockHeader contains the stateRoot, transationRoot and receiptRoot, these can be verified as well. And the rest will simply depend on them.

And there is another reason the BlockHash is so important. This is the only Value you are able to access from within a SmartContract, because the evm supports a OpCode (`BLOCKHASH`), which allows you to read the last 256 Blockhashes, which gives us the chance to even verify the blockhash onchain.

Depending on the Method different Proofs would be needed, which are described in this document.

- **[Block Proof](#blockproof)** - verifies the content of the BlockHeader
- **[Transaction Proof](#transaction-proof)** - verifies the input data of a transaction
- **[Receipt Proof](#receipt-proof)** - verifies the outcome of a transaction
- **[Log Proof](#log-proof)** - verifies the response of `eth_getPastLogs`
- **[Account Proof](#account-proof)** - verifies the state of an account
- **[Call Proof](#call-proof)** - verifies the result of a `eth_call` - response






## BlockProof

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

The Blockhash is calculated by serializing the blockdata with [rlp](https://github.com/ethereum/wiki/wiki/RLP) and hashing it:

```js
blockHeader = rlp.encode([
	parentHash: BlockHash,
	uncleHash: BlockHash[],
	minerAddress: Address,
	stateRoot: StateRoot,
	transactionRoot: TransactionRoot,
	transactionReceiptRoot: TransactionReceiptRoot,
	logsBloom: BloomFilter,
	difficulty: UInt256,
	number: UInt256,
	gasLimit: UInt64,
	gasUsed: UInt64,
	timestamp: UInt256,
	extraData: UInt8[32],
	proofOfWork: Keccak256, // AKA: MixHash; AKA: MixDigest
	nonce: UInt8[8]
])
```

For POA-Chains the blockheader will use the `sealFields` (instead of ProofOfWork and Nonce) which are already rlp-encoded and should be added as raw data when using rlp.encode.

```js
if (keccak256(blockHeader) !== singedBlockHash) 
  throw new Error('Invalid Block')
```

In case of the `eth_getBlockTransactionCountBy...` the proof contains the full blockHeader already serilalized + all transactionHashes. This is needed in order to verify them in a merkleTree and compare them with the `TransactionRoot`


## Transaction Proof

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
	accountNonce: UInt64
	price: UInt256
	gasLimit: UInt64
	amount: UInt256
	payload: UInt8[]
	v: UInt256
	r: UInt256
	s: UInt256
])
``` 

3. verify the merkleProof of the transaction with

```js
key = keccak256(in3.proof.txIndex),
root = blockHeader.transactionRoot,
proof = in3.proof.merkleProof
expectedValue = transaction
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
    "nonce": "0x36",
    "publicKey": "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
    "r": "0xdc967310342af5042bb64c34d3b92799345401b26713b43faf253bd4bf972cbb",
    "raw": "0xf86136808255f0942b5ad5c4795c026514f8317c7a215e218dccd6cf8203e8001ca0dc967310342af5042bb64c34d3b92799345401b26713b43faf253bd4bf972cbba0464bade028ba54e0f78482757feeda354f3abedac35955ec07f822aad8d020c4",
    "s": "0x464bade028ba54e0f78482757feeda354f3abedac35955ec07f822aad8d020c4",
    "standardV": "0x1",
    "to": "0x2b5ad5c4795c026514f8317c7a215e218dccd6cf",
    "transactionIndex": "0x0",
    "v": "0x1c",
    "value": "0x3e8"
  },
  "in3": {
    "proof": {
      "type": "transactionProof",
      "block": "0xf901e6a040997a53895b48...", // serialized blockheader
      "merkleProof": [
        "f868822080b863f86136808255f0942b5ad5c4795c026514f8317c7a215e218dccd6cf8203e8001ca0dc967310342af5042bb64c34d3b92799345401b26713b43faf253bd4bf972cbba0464bade028ba54e0f78482757feeda354f3abedac35955ec07f822aad8d020c4"
      ],
      "txIndex": 0,
      "signatures": [...]
    }
  }
}
```


## Receipt Proof

Proofs for the transactionReceipt are used for the following transaction-method:

- [eth_getTransactionReceipt
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt)

In order to verify we need :

1. serialize the blockheader and compare the blockhash with the signed hash as well as with the blockHash and number of the transaction. (See [BlockProof](#blockproof))


2. serialize the transaction receipt

```js
transactionReceipt = rlp.encode([
	postStateOrStatus: stateRoot|UInt32, 
	cumulativeGasUsed: UInt64,
	logsBloom: BloomFilter,
	logs: Log[]
])
``` 

3. verify the merkleProof of the transaction receipt with

```js
key = keccak256(in3.proof.txIndex),
root = blockHeader.transactionReceiptRoot,
proof = in3.proof.merkleProof
expectedValue = transactionReceipt
```

## Log Proof

Proofs for logs are only for the one transaction-method:

- [eth_getPastLogs
](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getpastlogs)

Since logs or events are based on the TransactionReceipts, the only way to prove them is by proving the TransactionReceipt each event belongs to.

That's why this proof needs to offer 
- all blockheaders where these events occured
- all TransactionReceipts + their MerkleProof of the logs

The Proof datastructure will look like this:

```ts
  Proof {
    type: 'logProof',
    logProof: {
      [blockNr: string]: {  // the blockNumber in hex as key
        block : string  // serialized blockheader
        receipts: {
          [txHash: string]: {  // the transactionHash as key
            txIndex: number // transactionIndex within the block
            proof: string[] // the merkle Proof-Array
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
key = keccak256(receipt.txIndex),
root = blockHeader.transactionReceiptRoot,
proof = receipt.proof
```

3. The resulting values are the receipts. For each log-entry, we are comparing the verified values of the receipt and ensuring that they are correct. 
