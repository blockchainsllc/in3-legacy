
## Types

configuration-data for the Incubed-client / server

*  [IN3NodeWeight](#in3nodeweight)
*  [IN3NodeConfig](#in3nodeconfig)
*  [IN3RPCRequestConfig](#in3rpcrequestconfig)
*  [Signature](#signature)
*  [IN3ResponseConfig](#in3responseconfig)
*  [IN3Config](#in3config)
*  [RPCRequest](#rpcrequest)
*  [RPCResponse](#rpcresponse)
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
  url: 'https://in3.slock.it',
  chainIds: [
    '0x1'
  ],
  deposit: 12350000,
  props: 3
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **index** `integer` - the index within the contract   
*  **address** `string` (required)  - the address of the node, which is the public address it iis signing with.   
*  **url** `string` (required)  - the endpoint to post to   
*  **chainIds** `string[]` (required)  - the list of supported chains   
*  **deposit** `integer` (required)  - the deposit of the node in wei   
*  **props** `integer` - the properties of the node.   

### IN3RPCRequestConfig

additional config for a IN§ RPC-Request

```javascript
import {types} from 'in3'
const iN3RPCRequestConfig:types.IN3RPCRequestConfig = {
  chainId: '0x1',
  includeCode: true,
  verification: 'proof',
  signatures: [
    null
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **chainId** `string` (required)  - the requested chainId   
*  **includeCode** `boolean` - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards   
*  **latestBlock** `integer` - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value   
*  **verification** `string` - defines the kind of proof the client is asking for   
 Must be one of the these values : `'never`', `'proof`', `'proofWithSignature`'
*  **signatures** `string<address>[]` - a list of addresses requested to sign the blockhash   

### Signature


```javascript
import {types} from 'in3'
const signature:types.Signature = {}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **address** `string` - the address of the signing node   
*  **block** `number` - the blocknumber   
*  **blockHash** `string` - the hash of the block   
*  **msgHash** `string<bytes32>` - hash of the message   
*  **r** `string<hex>` - Positive non-zero Integer signature.r   
*  **s** `string<hex>` - Positive non-zero Integer signature.s   
*  **v** `string<hex>` - Calculated curve point, or identity element O.   

### IN3ResponseConfig

additional config for a IN§ RPC-Request

```javascript
import {types} from 'in3'
const iN3ResponseConfig:types.IN3ResponseConfig = {
  proof: {
    type: 'transactionProof',
    merkleProof: [
      null
    ],
    txProof: [
      null
    ],
    signatures: [
      {}
    ]
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **proof** [Proof](#proof) - the Proof-data   
*  **lastNodeList** `number` - the blocknumber for the last block updating the nodelist   

### IN3Config

the definition of the config-file.

```javascript
import {types} from 'in3'
const iN3Config:types.IN3Config = {
  format: 'json'
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **nodeLimit** `number` - the limit of nodes to store in the client   
*  **keepIn3** `boolean` - if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data.   
*  **format** `string` - the format for sending the data to the client   
 Must be one of the these values : `'json`', `'cbor`'
*  **includeCode** `boolean` - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards   
*  **proof** `boolean` - if true the nodes should send a proof of the response   
*  **signatureCount** `number` - number of signatures requested   
*  **minDeposit** `number` (required)  - min stake of the server. Only nodes owning at least this amount will be chosen.   
*  **replaceLatestBlock** `integer` - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value   
*  **requestCount** `number` (required)  - the number of request send when getting a first answer   
*  **timeout** `number` - specifies the number of milliseconds before the request times out.   
*  **chainId** `string` (required)  - servers to filter for the given chain. The chain-id based on EIP-155.   
*  **chainRegistry** `string` - main chain-registry contract   
*  **mainChain** `string` - main chain-id, where the chain registry is running.   
*  **autoUpdateList** `boolean` - if true the nodelist will be automaticly updated if the lastBlock is newer   
*  **servers** `object` - the nodelist per chain   
    each key in this object will structure its value like: 
    *  **initAddresses** `string[]` - a list of addresses which should always be part of the nodelist when getting an update   
    *  **lastBlock** `integer` - the blockNumber of the last event in the registry   
    *  **contract** `string` - the address of the registry contract   
    *  **contractChain** `string` - the chainid for the contract   
    *  **nodeList** `IN3NodeConfig[]` - the list of nodes   
    *  **nodeAuthorities** `string[]` - the list of authority nodes for handling conflicts   
    *  **weights** `object` - the weights of nodes depending on former performance   
        each key in this object will structure its value like: 

### RPCRequest

a JSONRPC-Request with N3-Extension

```javascript
import {types} from 'in3'
const rPCRequest:types.RPCRequest = {
  jsonrpc: '2.0',
  in3: {
    chainId: '0x1',
    includeCode: true,
    verification: 'proof',
    signatures: [
      null
    ]
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **jsonrpc** `string` (required)  - the version   
 Must be one of the these values : `'2.0`'
*  **method** `string` (required)  - the method to call   
*  **id** `string,number` - the id   
*  **params** `array,object` - the params   
*  **in3** [IN3RPCRequestConfig](#in3rpcrequestconfig) - the IN3-Config   

### RPCResponse

a JSONRPC-Responset with N3-Extension

```javascript
import {types} from 'in3'
const rPCResponse:types.RPCResponse = {
  jsonrpc: '2.0',
  in3: {
    proof: {
      type: 'transactionProof',
      merkleProof: [
        null
      ],
      txProof: [
        null
      ],
      signatures: [
        {}
      ]
    }
  },
  in3Node: {
    index: 13,
    address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
    url: 'https://in3.slock.it',
    chainIds: [
      '0x1'
    ],
    deposit: 12350000,
    props: 3
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **jsonrpc** `string` (required)  - the version   
 Must be one of the these values : `'2.0`'
*  **id** `string,number` (required)  - the id matching the request   
*  **error** `string` - in case of an error this needs to be set   
*  **result** [{"description":"the params"}](#{"description":"the params"}) - the params   
*  **in3** [IN3ResponseConfig](#in3responseconfig) - the IN3-Result   
*  **in3Node** [IN3NodeConfig](#in3nodeconfig) - the node handling this response (internal only)   

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
  type: 'transactionProof',
  merkleProof: [
    null
  ],
  txProof: [
    null
  ],
  signatures: [
    {}
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **type** `string` (required)  - the type of the proof   
 Must be one of the these values : `'transactionProof`', `'receiptProof`', `'blockProof`', `'accountProof`', `'callProof`', `'logProof`'
*  **block** `string` - the serialized blockheader as hex, required in most proofs   
*  **transactions** `array` - the list of transactions of the block   
*  **merkleProof** `string[]` - the serialized merle-noodes beginning with the root-node   
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
      url: 'https://in3.slock.it',
      chainIds: [
        '0x1'
      ],
      deposit: 12350000,
      props: 3
    }
  ],
  proof: {
    type: 'transactionProof',
    merkleProof: [
      null
    ],
    txProof: [
      null
    ],
    signatures: [
      {}
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
  logging: {}
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **defaultChain** `string` - the default chainId in case the request does not contain one.   
*  **port** `integer` - the listeneing port for the server   
*  **logging** `object` - logger config   
    properties: 
    *  **file** `string` - the path to the logile   
    *  **level** `string` - Loglevel   
    *  **colors** `boolean` - if true colors will be used   
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
*  **rpcUrl** `string` (required)  - the url of the client   
*  **minBlockHeight** `integer` - the minimal blockheight in order to sign   
*  **persistentFile** `string` - the filename of the file keeping track of the last handled blocknumber   
*  **watchInterval** `integer` - the number of seconds of the interval for checking for new events   
*  **privateKey** `string` (required)  - the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.   
*  **privateKeyPassphrase** `string` - the password used to decrpyt the private key   
*  **registry** `string` (required)  - the address of the server registry used in order to update the nodeList   
*  **registryRPC** `string` - the url of the client in case the registry is not on the same chain.   
*  **autoRegistry** `object`   
    properties: 
    *  **url** `string` (required)  - the public url to reach this node   
    *  **deposit** `number` (required)  - the deposit you want ot store   
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

