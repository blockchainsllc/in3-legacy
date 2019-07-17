
## Types

configuration-data for the Incubed-client / server

*  [IN3NodeWeight](#in3nodeweight)
*  [IN3NodeConfig](#in3nodeconfig)
*  [IN3RPCRequestConfig](#in3rpcrequestconfig)
*  [Signature](#signature)
*  [IN3ResponseConfig](#in3responseconfig)
*  [ChainSpec](#chainspec)
*  [IN3Config](#in3config)
*  [RPCRequest](#rpcrequest)
*  [RPCResponse](#rpcresponse)
*  [AuraValidatoryProof](#auravalidatoryproof)
*  [LogProof](#logproof)
*  [Proof](#proof)
*  [AccountProof](#accountproof)
*  [ServerList](#serverlist)
*  [IN3RPCConfig](#in3rpcconfig)
*  [IN3RPCHandlerConfig](#in3rpchandlerconfig)

## Errors

*  [Error Keys](#error-keys)

## Types

configuration-data for the Incubed-client / server

### IN3NodeWeight

a local weight of a n3-node. (This is used internally to weight the requests)

```javascript
import {types} from 'in3'
const iN3NodeWeight:types.IN3NodeWeight = {
  weight: 0.5,
  responseCount: 147,
  avgResponseTime: 240,
  lastRequest: 1529074632623,
  blacklistedUntil: 1529074639623
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **weight** `number` - factor the weight this noe (default 1.0)   
*  **responseCount** `integer` - number of uses.   
*  **avgResponseTime** `number` - average time of a response in ms   
*  **pricePerRequest** `integer` - last price   
*  **lastRequest** `integer` - timestamp of the last request in ms   
*  **blacklistedUntil** `integer` - blacklisted because of failed requests until the timestamp   

### IN3NodeConfig

a configuration of a in3-server.

```javascript
import {types} from 'in3'
const iN3NodeConfig:types.IN3NodeConfig = {
  index: 13,
  address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
  timeout: 3600,
  url: 'https://in3.slock.it',
  chainIds: [
    '0x1'
  ],
  deposit: 12350000,
  capacity: 100,
  props: 3
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **index** `integer` - the index within the contract   
*  **address** `string<address>` (required)  - the address of the node, which is the public address it iis signing with.   
*  **timeout** `integer` - the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself   
*  **url** `string` (required)  - the endpoint to post to   
*  **chainIds** `string<hex>[]` (required)  - the list of supported chains   
*  **deposit** `integer` (required)  - the deposit of the node in wei   
*  **capacity** `integer` - the capacity of the node.   
*  **props** `integer` - the properties of the node.   

### IN3RPCRequestConfig

additional config for a IN3 RPC-Request

```javascript
import {types} from 'in3'
const iN3RPCRequestConfig:types.IN3RPCRequestConfig = {
  chainId: '0x1',
  includeCode: true,
  verifiedHashes: [
    null
  ],
  latestBlock: 6,
  verification: 'proof',
  signatures: [
    '0x6C1a01C2aB554930A937B0a2E8105fB47946c679'
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **chainId** `string<hex>` (required)  - the requested chainId   
*  **includeCode** `boolean` - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards   
*  **verifiedHashes** `string<bytes32>[]` - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.   
*  **latestBlock** `integer` - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value   
*  **useRef** `boolean` - if true binary-data (starting with a 0x) will be refered if occuring again.   
*  **useBinary** `boolean` - if true binary-data will be used.   
*  **useFullProof** `boolean` - if true all data in the response will be proven, which leads to a higher payload.   
*  **finality** `number` - if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.   
*  **verification** `string` - defines the kind of proof the client is asking for   
 Must be one of the these values : `'never`', `'proof`', `'proofWithSignature`'
*  **clientSignature** [{"description":"the signature of the client"}](#{"description":"the signature of the client"}) - the signature of the client   
*  **signatures** `string<address>[]` - a list of addresses requested to sign the blockhash   

### Signature

Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.

```javascript
import {types} from 'in3'
const signature:types.Signature = {
  address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
  block: 3123874,
  blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
  msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
  r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
  s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
  v: 28
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **address** `string<address>` - the address of the signing node   
*  **block** `number` (required)  - the blocknumber   
*  **blockHash** `string<bytes32>` (required)  - the hash of the block   
*  **msgHash** `string<bytes32>` (required)  - hash of the message   
*  **r** `string<hex>` (required)  - Positive non-zero Integer signature.r   
*  **s** `string<hex>` (required)  - Positive non-zero Integer signature.s   
*  **v** `integer<hex>` (required)  - Calculated curve point, or identity element O.   

### IN3ResponseConfig

additional data returned from a IN3 Server

```javascript
import {types} from 'in3'
const iN3ResponseConfig:types.IN3ResponseConfig = {
  proof: {
    type: 'accountProof',
    block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
    finalityBlocks: [
      '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
    ],
    transactions: [],
    uncles: [],
    merkleProof: [
      null
    ],
    merkleProofPrev: [
      null
    ],
    txProof: [
      null
    ],
    txIndex: 4,
    signatures: [
      {
        address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
        block: 3123874,
        blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
        msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
        r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
        s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
        v: 28
      }
    ]
  },
  lastNodeList: 326478,
  currentBlock: 320126478
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **proof** [Proof](#proof) - the Proof-data   
*  **lastNodeList** `number` - the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.   
*  **lastValidatorChange** `number` - the blocknumber of gthe last change of the validatorList   
*  **currentBlock** `number` - the current blocknumber.   

### ChainSpec

describes the chainspecific consensus params

```javascript
import {types} from 'in3'
const chainSpec:types.ChainSpec = {
  engine: 'ethHash',
  list: [
    null
  ],
  requiresFinality: true,
  bypassFinality: 'bypassFinality = 10960502 -> will skip the finality check and add the list at block 10960502'
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **block** `number` - the blocknumnber when this configuration should apply   
*  **engine** `string` - the engine type (like Ethhash, authorityRound, ... )   
 Must be one of the these values : `'ethHash`', `'authorityRound`', `'clique`'
*  **list** `string<address>[]` - The list of validators at the particular block   
*  **contract** `string` - The validator contract at the block   
*  **requiresFinality** `boolean` - indicates whether the transition requires a finality check   
*  **bypassFinality** `number` - Bypass finality check for transition to contract based Aura Engines   

### IN3Config

the iguration of the IN3-Client. This can be paritally overriden for every request.

```javascript
import {types} from 'in3'
const iN3Config:types.IN3Config = {
  nodeLimit: 150,
  keepIn3: false,
  format: 'json',
  key: '0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7',
  autoConfig: false,
  retryWithoutProof: false,
  maxAttempts: 10,
  includeCode: true,
  maxCodeCache: 100000,
  maxBlockCache: 100,
  verifiedHashes: [
    null
  ],
  proof: true,
  signatureCount: 2,
  minDeposit: 0,
  replaceLatestBlock: 6,
  requestCount: 3,
  finality: 50,
  timeout: 3000,
  chainId: '0x1',
  chainRegistry: '0xe36179e2286ef405e929C90ad3E70E649B22a945',
  mainChain: '0x1',
  autoUpdateList: true
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **cacheTimeout** `number` - number of seconds requests can be cached.   
*  **nodeLimit** `number` - the limit of nodes to store in the client.   
*  **keepIn3** `boolean` - if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.   
*  **format** `string` - the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding   
 Must be one of the these values : `'json`', `'jsonRef`', `'cbor`'
*  **key** [{"description":"the client key to sign requests","example":"0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7"}](#{"description":"the client key to sign requests","example":"0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7"}) - the client key to sign requests   
*  **autoConfig** `boolean` - if true the config will be adjusted depending on the request   
*  **retryWithoutProof** `boolean` - if true the the request may be handled without proof in case of an error. (use with care!)   
*  **maxAttempts** `number` - max number of attempts in case a response is rejected   
*  **includeCode** `boolean` - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards   
*  **maxCodeCache** `integer` - number of max bytes used to cache the code in memory   
*  **maxBlockCache** `integer` - number of number of blocks cached  in memory   
*  **verifiedHashes** `string<bytes32>[]` - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number. This is automaticly updated by the cache, but can be overriden per request.   
*  **proof** `string` - if true the nodes should send a proof of the response   
 Must be one of the these values : `'none`', `'standard`', `'full`'
*  **signatureCount** `number` - number of signatures requested   
*  **minDeposit** `number` (required)  - min stake of the server. Only nodes owning at least this amount will be chosen.   
*  **replaceLatestBlock** `integer` - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value   
*  **requestCount** `number` (required)  - the number of request send when getting a first answer   
*  **finality** `number` - the number in percent needed in order reach finality (% of signature of the validators)   
*  **timeout** `number` - specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.   
*  **chainId** `string` (required)  - servers to filter for the given chain. The chain-id based on EIP-155.   
*  **chainRegistry** `string` - main chain-registry contract   
*  **mainChain** `string` - main chain-id, where the chain registry is running.   
*  **autoUpdateList** `boolean` - if true the nodelist will be automaticly updated if the lastBlock is newer   
*  **cacheStorage** [{"description":"a cache handler offering 2 functions ( setItem(string,string), getItem(string) )"}](#{"description":"a cache handler offering 2 functions ( setitem(string,string), getitem(string) )"}) - a cache handler offering 2 functions ( setItem(string,string), getItem(string) )   
*  **loggerUrl** `string` - a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }   
*  **rpc** `string` - url of one or more rpc-endpoints to use. (list can be comma seperated)   
*  **servers** `object` - the nodelist per chain   
    each key in this object will structure its value like: 
    *  **verifier** `string` - name of the module responsible for handling the verification   
    *  **name** `string` - a alias for the chain   
    *  **chainSpec** `ChainSpec[]` - chain definitions   
    *  **initAddresses** `string[]` - a list of addresses which should always be part of the nodelist when getting an update   
    *  **lastBlock** `integer` - the blockNumber of the last event in the registry   
    *  **contract** `string` - the address of the registry contract   
    *  **needsUpdate** `boolean` - if true the nodelist should be updated.   
    *  **contractChain** `string` - the chainid for the contract   
    *  **nodeList** `IN3NodeConfig[]` - the list of nodes   
    *  **nodeAuthorities** `string[]` - the list of authority nodes for handling conflicts   
    *  **weights** `object` - the weights of nodes depending on former performance which is used internally   
        each key in this object will structure its value like: 

### RPCRequest

a JSONRPC-Request with N3-Extension

```javascript
import {types} from 'in3'
const rPCRequest:types.RPCRequest = {
  jsonrpc: '2.0',
  method: 'eth_getBalance',
  id: 2,
  params: [
    '0xe36179e2286ef405e929C90ad3E70E649B22a945',
    'latest'
  ],
  in3: {
    chainId: '0x1',
    includeCode: true,
    verifiedHashes: [
      null
    ],
    latestBlock: 6,
    verification: 'proof',
    signatures: [
      '0x6C1a01C2aB554930A937B0a2E8105fB47946c679'
    ]
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **jsonrpc** `string` (required)  - the version   
 Must be one of the these values : `'2.0`'
*  **method** `string` (required)  - the method to call   
*  **id** `number,string` - the identifier of the request   
*  **params** `array` - the params   
*  **in3** [IN3RPCRequestConfig](#in3rpcrequestconfig) - the IN3-Config   

### RPCResponse

a JSONRPC-Responset with N3-Extension

```javascript
import {types} from 'in3'
const rPCResponse:types.RPCResponse = {
  jsonrpc: '2.0',
  id: 2,
  result: '0xa35bc',
  in3: {
    proof: {
      type: 'accountProof',
      block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
      finalityBlocks: [
        '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
      ],
      transactions: [],
      uncles: [],
      merkleProof: [
        null
      ],
      merkleProofPrev: [
        null
      ],
      txProof: [
        null
      ],
      txIndex: 4,
      signatures: [
        {
          address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
          block: 3123874,
          blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
          msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
          r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
          s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
          v: 28
        }
      ]
    },
    lastNodeList: 326478,
    currentBlock: 320126478
  },
  in3Node: {
    index: 13,
    address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
    timeout: 3600,
    url: 'https://in3.slock.it',
    chainIds: [
      '0x1'
    ],
    deposit: 12350000,
    capacity: 100,
    props: 3
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **jsonrpc** `string` (required)  - the version   
 Must be one of the these values : `'2.0`'
*  **id** `string,number` (required)  - the id matching the request   
*  **error** `string` - in case of an error this needs to be set   
*  **result** [{"description":"the params","example":"0xa35bc"}](#{"description":"the params","example":"0xa35bc"}) - the params   
*  **in3** [IN3ResponseConfig](#in3responseconfig) - the IN3-Result   
*  **in3Node** [IN3NodeConfig](#in3nodeconfig) - the node handling this response (internal only)   

### AuraValidatoryProof

a Object holding proofs for validator logs. The key is the blockNumber as hex

```javascript
import {types} from 'in3'
const auraValidatoryProof:types.AuraValidatoryProof = {
  block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
  proof: [
    null
  ],
  finalityBlocks: [
    '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **logIndex** `number` (required)  - the transaction log index   
*  **block** `string` (required)  - the serialized blockheader   
*  **txIndex** `integer` (required)  - the transactionIndex within the block   
*  **proof** `string[]` (required)  - the merkleProof   
*  **finalityBlocks** `array` - the serialized blockheader as hex, required in case of finality asked   

### LogProof

a Object holding proofs for event logs. The key is the blockNumber as hex

```javascript
import {types} from 'in3'
const logProof:types.LogProof = 
```
 See [types.yaml](../blob/develop/src/types/types.yaml)


### Proof

the Proof-data as part of the in3-section

```javascript
import {types} from 'in3'
const proof:types.Proof = {
  type: 'accountProof',
  block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
  finalityBlocks: [
    '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
  ],
  transactions: [],
  uncles: [],
  merkleProof: [
    null
  ],
  merkleProofPrev: [
    null
  ],
  txProof: [
    null
  ],
  txIndex: 4,
  signatures: [
    {
      address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
      block: 3123874,
      blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
      msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
      r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
      s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
      v: 28
    }
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **type** `string` (required)  - the type of the proof   
 Must be one of the these values : `'transactionProof`', `'receiptProof`', `'blockProof`', `'accountProof`', `'callProof`', `'logProof`'
*  **block** `string` - the serialized blockheader as hex, required in most proofs   
*  **finalityBlocks** `array` - the serialized blockheader as hex, required in case of finality asked   
*  **transactions** `array` - the list of transactions of the block   
*  **uncles** `array` - the list of uncle-headers of the block   
*  **merkleProof** `string[]` - the serialized merle-noodes beginning with the root-node   
*  **merkleProofPrev** `string[]` - the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)   
*  **txProof** `string[]` - the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex   
*  **logProof** [LogProof](#logproof) - the Log Proof in case of a Log-Request   
*  **accounts** `object` - a map of addresses and their AccountProof   
    each key in this object will structure its value like: 
*  **txIndex** `integer` - the transactionIndex within the block   
*  **signatures** `Signature[]` - requested signatures   

### AccountProof

the Proof-for a single Account

```javascript
import {types} from 'in3'
const accountProof:types.AccountProof = {
  accountProof: [
    null
  ],
  storageProof: [
    {
      proof: [
        null
      ]
    }
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **accountProof** `string[]` (required)  - the serialized merle-noodes beginning with the root-node   
*  **address** `string` (required)  - the address of this account   
*  **balance** `string` (required)  - the balance of this account as hex   
*  **codeHash** `string` (required)  - the codeHash of this account as hex   
*  **code** `string` - the code of this account as hex ( if required)   
*  **nonce** `string` (required)  - the nonce of this account as hex   
*  **storageHash** `string` (required)  - the storageHash of this account as hex   
*  **storageProof** `object[]` (required)  - proof for requested storage-data   
    the array must contain object of : 
    *  **key** `string` (required)  - the storage key   
    *  **proof** `string[]` (required)  - the serialized merkle-noodes beginning with the root-node ( storageHash )   
    *  **value** `string` (required)  - the stored value   

### ServerList

a List of nodes

```javascript
import {types} from 'in3'
const serverList:types.ServerList = {
  nodes: [
    {
      index: 13,
      address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
      timeout: 3600,
      url: 'https://in3.slock.it',
      chainIds: [
        '0x1'
      ],
      deposit: 12350000,
      capacity: 100,
      props: 3
    }
  ],
  proof: {
    type: 'accountProof',
    block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
    finalityBlocks: [
      '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
    ],
    transactions: [],
    uncles: [],
    merkleProof: [
      null
    ],
    merkleProofPrev: [
      null
    ],
    txProof: [
      null
    ],
    txIndex: 4,
    signatures: [
      {
        address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
        block: 3123874,
        blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
        msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
        r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
        s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
        v: 28
      }
    ]
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **lastBlockNumber** `integer` - last Block number   
*  **nodes** `IN3NodeConfig[]` (required)  - the list of nodes   
*  **contract** `string` - IN3 Registry   
*  **totalServers** `integer` - number of servers   
*  **proof** [Proof](#proof)   

### IN3RPCConfig

the configuration for the rpc-handler

```javascript
import {types} from 'in3'
const iN3RPCConfig:types.IN3RPCConfig = {
  db: {},
  profile: {},
  logging: {}
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **id** `string` - a identifier used in logfiles as also for reading the config from the database   
*  **defaultChain** `string` - the default chainId in case the request does not contain one.   
*  **port** `integer` - the listeneing port for the server   
*  **db** `object`   
    properties: 
    *  **user** `string` - username for the db   
    *  **password** `string` - password for db-access   
    *  **host** `string` - db-host (default = localhost)   
    *  **port** `integer` - the database port   
    *  **database** `string` - name of the database   
*  **profile** `object`   
    properties: 
    *  **icon** `string` - url to a icon or logo of company offering this node   
    *  **url** `string` - url of the website of the company   
    *  **name** `string` - name of the node or company   
    *  **comment** `string` - comments for the node   
    *  **noStats** `boolean` - if active the stats will not be shown (default:false)   
*  **logging** `object` - logger config   
    properties: 
    *  **file** `string` - the path to the logile   
    *  **level** `string` - Loglevel   
    *  **colors** `boolean` - if true colors will be used   
    *  **name** `string` - the name of the provider   
    *  **type** `string` - the module of the provider   
    *  **port** `integer` - the port for custom logging   
    *  **host** `string` - the host for custom logging   
*  **chains** `object` - a definition of the Handler per chain   
    each key in this object will structure its value like: 

### IN3RPCHandlerConfig

the configuration for the rpc-handler

```javascript
import {types} from 'in3'
const iN3RPCHandlerConfig:types.IN3RPCHandlerConfig = {
  handler: 'eth',
  autoRegistry: {
    depositUnit: 'ether',
    capabilities: {}
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **handler** `string` - the impl used to handle the calls   
 Must be one of the these values : `'eth`', `'ipfs`', `'btc`'
*  **ipfsUrl** `string` - the url of the ipfs-client   
*  **timeout** `integer` - number of milliseconds to wait before a request gets a timeout   
*  **rpcUrl** `string` (required)  - the url of the client   
*  **clientKeys** `string` - a comma sepearted list of client keys to use for simulating clients for the watchdog   
*  **watchdogInterval** `number` - average time between sending requests to the same node. 0 turns it off (default)   
*  **freeScore** `number` - the score for requests without a valid signature   
*  **minBlockHeight** `integer` - the minimal blockheight in order to sign   
*  **maxThreads** `integer` - the maximal number of threads ofr running parallel processes   
*  **persistentFile** `string` - the filename of the file keeping track of the last handled blocknumber   
*  **startBlock** `number` - blocknumber to start watching the registry   
*  **watchInterval** `integer` - the number of seconds of the interval for checking for new events   
*  **privateKey** `string` (required)  - the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.   
*  **privateKeyPassphrase** `string` - the password used to decrpyt the private key   
*  **registry** `string` (required)  - the address of the server registry used in order to update the nodeList   
*  **registryRPC** `string` - the url of the client in case the registry is not on the same chain.   
*  **autoRegistry** `object`   
    properties: 
    *  **url** `string` (required)  - the public url to reach this node   
    *  **deposit** `number` (required)  - the deposit you want ot store   
    *  **capacity** `number` - max number of parallel requests   
    *  **depositUnit** `string` - unit of the deposit value   
     Must be one of the these values : `'ether`', `'finney`', `'szabo`', `'wei`'
    *  **capabilities** `object`   
        properties: 
        *  **proof** `boolean` - if true, this node is able to deliver proofs   
        *  **multiChain** `boolean` - if true, this node is able to deliver multiple chains   


## Error Keys 
Each Error returned has 3 properties:

|Property|type|description|
|--|--|--|
|message|String|the english description of the error|
|key|String|a id which may be used to translate the message|
|stack|String|the error-stack used for internal debugging|

### List of error-keys : 

|key|message|
|--|--|
|invalid_data| |

