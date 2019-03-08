# Data Structures

This page contains a list of all Datastructures and Classes used within the IN3 Client.


* [**AccountProof**](#type-accountproof) : `interface`  - the Proof-for a single Account

* [**BlockData**](#type-blockdata) : `interface`  - Block as returned by eth_getBlockByNumber

* [**ChainSpec**](#type-chainspec) : `interface`  - describes the chainspecific consensus params

* [**IN3Client**](#type-client) : `class`  - Client for N3.

* [**IN3Config**](#type-in3config) : `interface`  - the iguration of the IN3-Client. This can be paritally overriden for every request.

* [**IN3NodeConfig**](#type-in3nodeconfig) : `interface`  - a configuration of a in3-server.

* [**IN3NodeWeight**](#type-in3nodeweight) : `interface`  - a local weight of a n3-node. (This is used internally to weight the requests)

* [**IN3RPCConfig**](#type-in3rpcconfig) : `interface`  - the configuration for the rpc-handler

* [**IN3RPCHandlerConfig**](#type-in3rpchandlerconfig) : `interface`  - the configuration for the rpc-handler

* [**IN3RPCRequestConfig**](#type-in3rpcrequestconfig) : `interface`  - additional config for a IN3 RPC-Request

* [**IN3ResponseConfig**](#type-in3responseconfig) : `interface`  - additional data returned from a IN3 Server

* [**LogData**](#type-logdata) : `interface`  - LogData as part of the TransactionReceipt

* [**LogProof**](#type-logproof) : `interface`  - a Object holding proofs for event logs. The key is the blockNumber as hex

* [**Proof**](#type-proof) : `interface`  - the Proof-data as part of the in3-section

* [**RPCRequest**](#type-rpcrequest) : `interface`  - a JSONRPC-Request with N3-Extension

* [**RPCResponse**](#type-rpcresponse) : `interface`  - a JSONRPC-Responset with N3-Extension

* [**ReceiptData**](#type-receiptdata) : `interface`  - TransactionReceipt as returned by eth_getTransactionReceipt

* [**ServerList**](#type-serverlist) : `interface`  - a List of nodes

* [**Signature**](#type-signature) : `interface`  - Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.

* [**TransactionData**](#type-transactiondata) : `interface`  - Transaction as returned by eth_getTransactionByHash

* [**Transport**](#type-transport) : `interface`  - A Transport-object responsible to transport the message to the handler.

* [**AxiosTransport**](#type-axiostransport) : `class`  - Default Transport impl sending http-requests.

* **[cbor](https://github.com/slockit/in3/blob/master/src/index.ts#L33)**

    * **[createRefs](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L86)**(val :[`T`](#type-t), cache :`string`[] =  []) :[`T`](#type-t) 

    * **[decodeRequests](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L30)**(request :[`Buffer`](#type-buffer)) :[`RPCRequest`](#type-rpcrequest)[] 

    * **[decodeResponses](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L44)**(responses :[`Buffer`](#type-buffer)) :[`RPCResponse`](#type-rpcresponse)[] 

    * **[encodeRequests](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L26)**(requests :[`RPCRequest`](#type-rpcrequest)[]) :[`Buffer`](#type-buffer) - turn

    * **[encodeResponses](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L41)**(responses :[`RPCResponse`](#type-rpcresponse)[]) :[`Buffer`](#type-buffer) 

    * **[resolveRefs](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L107)**(val :[`T`](#type-t), cache :`string`[] =  []) :[`T`](#type-t) 

* **[chainAliases](https://github.com/slockit/in3/blob/master/src/index.ts#L81)**

    * **[goerli](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L674)** :`string` 

    * **[ipfs](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L674)** :`string` 

    * **[kovan](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L674)** :`string` 

    * **[main](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L674)** :`string` 

    * **[mainnet](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L674)** :`string` 

    * **[tobalaba](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L674)** :`string` 

* **[chainData](https://github.com/slockit/in3/blob/master/src/index.ts#L49)**

    * **[callContract](https://github.com/slockit/in3/blob/master/src/modules/eth/chainData.ts#L26)**(client :[`Client`](#type-client), contract :`string`, chainId :`string`, signature :`string`, args :`any`[], config :[`IN3Config`](#type-in3config)) :`Promise<any>` 

    * **[getChainData](https://github.com/slockit/in3/blob/master/src/modules/eth/chainData.ts#L35)**(client :[`Client`](#type-client), chainId :`string`, config :[`IN3Config`](#type-in3config)) :`Promise<>` 

* **[createRandomIndexes](https://github.com/slockit/in3/blob/master/src/client/serverList.ts#L32)**(len :`number`, limit :`number`, seed :[`Buffer`](#type-buffer), result :`number`[] =  []) :`number`[] 

* [**eth**](#type-api) : `class` 

* **[header](https://github.com/slockit/in3/blob/master/src/index.ts#L39)**

    * **[checkBlockSignatures](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L16)**(blockHeaders :`string`|[`Buffer`](#type-buffer)|[`Block`](#type-block)|[`BlockData`](#type-blockdata)[], getChainSpec :) :`Promise<number>` - verify a Blockheader and returns the percentage of finality

    * **[getAuthorities](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L81)**(chainSpec :[`ChainSpec`](#type-chainspec), blockNumner :`number`, handle :) :`Promise<>` -  find the authorities able to sign for the given blocknumber

    * **[getChainSpec](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L153)**(b :[`Block`](#type-block), ctx :[`ChainContext`](#type-chaincontext)) :`Promise<>` 

    * **[getSigner](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L69)**(data :[`Block`](#type-block)) :[`Buffer`](#type-buffer) 

* **[serialize](https://github.com/slockit/in3/blob/master/src/index.ts#L36)**

    * [**Block**](#type-block) :`class` - encodes and decodes the blockheader

    * [**AccountData**](#type-accountdata) :`interface` - Account-Object

    * [**BlockData**](#type-blockdata) :`interface` - Block as returned by eth_getBlockByNumber

    * [**LogData**](#type-logdata) :`interface` - LogData as part of the TransactionReceipt

    * [**ReceiptData**](#type-receiptdata) :`interface` - TransactionReceipt as returned by eth_getTransactionReceipt

    * [**TransactionData**](#type-transactiondata) :`interface` - Transaction as returned by eth_getTransactionByHash

    * **[Account](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L33)** :[`Buffer`](#type-buffer)[] - Buffer[] of the Account

    * **[BlockHeader](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L27)** :[`Buffer`](#type-buffer)[] - Buffer[] of the header

    * **[Receipt](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L36)** : - Buffer[] of the Receipt

    * **[Transaction](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L30)** :[`Buffer`](#type-buffer)[] - Buffer[] of the transaction

    * **[rlp](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L25)** :`any` - RLP-functions

    * **[address](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L144)**(val :`any`) :`any` - converts it to a Buffer with 20 bytes length

    * **[blockFromHex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L310)**(hex :`string`) :[`Block`](#type-block) - converts a hexstring to a block-object

    * **[blockToHex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L305)**(block :`any`) :`string` - converts blockdata to a hexstring

    * **[bytes](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L142)**(val :`any`) :`any` - converts it to a Buffer

    * **[bytes256](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L136)**(val :`any`) :`any` - converts it to a Buffer with 256 bytes length

    * **[bytes32](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L138)**(val :`any`) :`any` - converts it to a Buffer with 32 bytes length

    * **[bytes8](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L140)**(val :`any`) :`any` - converts it to a Buffer with 8 bytes length

    * **[createTx](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L277)**(transaction :`any`) :`any` - creates a Transaction-object from the rpc-transaction-data

    * **[hash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L130)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)|[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) - returns the hash of the object

    * **[serialize](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L127)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)) :[`Buffer`](#type-buffer) - serialize the data

    * **[toAccount](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L188)**(account :[`AccountData`](#type-accountdata)) :[`Buffer`](#type-buffer)[] 

    * **[toBlockHeader](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L149)**(block :[`BlockData`](#type-blockdata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[toReceipt](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L197)**(r :[`ReceiptData`](#type-receiptdata)) :`Object` - create a Buffer[] from RPC-Response

    * **[toTransaction](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L174)**(tx :[`TransactionData`](#type-transactiondata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[uint](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L146)**(val :`any`) :`any` - converts it to a Buffer with a variable length. 0 = length 0

* **[storage](https://github.com/slockit/in3/blob/master/src/index.ts#L42)**

    * **[getStorageArrayKey](https://github.com/slockit/in3/blob/master/src/modules/eth/storage.ts#L28)**(pos :`number`, arrayIndex :`number`, structSize :`number` = 1, structPos :`number` = 0) :`any` - calc the storrage array key

    * **[getStorageMapKey](https://github.com/slockit/in3/blob/master/src/modules/eth/storage.ts#L40)**(pos :`number`, key :`string`, structPos :`number` = 0) :`any` - calcs the storage Map key.

    * **[getStorageValue](https://github.com/slockit/in3/blob/master/src/modules/eth/storage.ts#L88)**(rpc :`string`, contract :`string`, pos :`number`, type :`'address'`|`'bytes32'`|`'bytes16'`|`'bytes4'`|`'int'`|`'string'`, keyOrIndex :`number`|`string`, structSize :`number`, structPos :`number`) :`Promise<any>` - get a storage value from the server

    * **[getStringValue](https://github.com/slockit/in3/blob/master/src/modules/eth/storage.ts#L50)**(data :[`Buffer`](#type-buffer), storageKey :[`Buffer`](#type-buffer)) :`string`| - creates a string from storage.

    * **[getStringValueFromList](https://github.com/slockit/in3/blob/master/src/modules/eth/storage.ts#L69)**(values :[`Buffer`](#type-buffer)[], len :`number`) :`string` - concats the storage values to a string.

    * **[toBN](https://github.com/slockit/in3/blob/master/src/modules/eth/storage.ts#L76)**(val :`any`) :`any` - converts any value to BN

* **[transport](https://github.com/slockit/in3/blob/master/src/index.ts#L45)**

    * [**AxiosTransport**](#type-axiostransport) :`class` - Default Transport impl sending http-requests.

    * [**Transport**](#type-transport) :`interface` - A Transport-object responsible to transport the message to the handler.

* **[typeDefs](https://github.com/slockit/in3/blob/master/src/index.ts#L79)**

    * **[AccountProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[ChainSpec](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[IN3Config](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[IN3NodeConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[IN3NodeWeight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[IN3RPCConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[IN3RPCHandlerConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[IN3RPCRequestConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[IN3ResponseConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[LogProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[Proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[RPCRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[RPCResponse](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[ServerList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


    * **[Signature](https://github.com/slockit/in3/blob/master/src/types/types.ts#L820)** : `Object`  


* **[util](https://github.com/slockit/in3/blob/master/src/index.ts#L28)**

    * **[checkForError](https://github.com/slockit/in3/blob/master/src/util/util.ts#L51)**(res :[`T`](#type-t)) :[`T`](#type-t) - check a RPC-Response for errors and rejects the promise if found

    * **[getAddress](https://github.com/slockit/in3/blob/master/src/util/util.ts#L151)**(pk :`string`) :`any` - returns a address from a private key

    * **[padEnd](https://github.com/slockit/in3/blob/master/src/util/util.ts#L184)**(val :`string`, minLength :`number`, fill :`string` = " ") :`string` - padEnd for legacy

    * **[padStart](https://github.com/slockit/in3/blob/master/src/util/util.ts#L177)**(val :`string`, minLength :`number`, fill :`string` = " ") :`string` - padStart for legacy

    * **[promisify](https://github.com/slockit/in3/blob/master/src/util/util.ts#L36)**(self :`any`, fn :`any`, args :`any`[]) :`Promise<any>` - simple promisy-function

    * **[toBN](https://github.com/slockit/in3/blob/master/src/util/util.ts#L60)**(val :`any`) :`any` - convert to BigNumber

    * **[toBuffer](https://github.com/slockit/in3/blob/master/src/util/util.ts#L112)**(val :`any`, len :`number` =  -1) :`any` - converts any value as Buffer
         if len === 0 it will return an empty Buffer if the value is 0 or '0x00', since this is the way rlpencode works wit 0-values.

    * **[toHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L70)**(val :`any`, bytes :`number`) :`string` - converts any value as hex-string

    * **[toMinHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L157)**(key :`string`|[`Buffer`](#type-buffer)|`number`) :`string` - removes all leading 0 in the hexstring

    * **[toNumber](https://github.com/slockit/in3/blob/master/src/util/util.ts#L91)**(val :`any`) :`number` - converts to a js-number

    * **[toSimpleHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L140)**(val :`string`) :`string` - removes all leading 0 in a hex-string

* **[validate](https://github.com/slockit/in3/blob/master/src/util/validate.ts#L55)**(ob :`any`, def :`any`) :`void` 


## Type AccountProof


the Proof-for a single Account


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L6)



* **[accountProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L10)** :`string`[] - the serialized merle-noodes beginning with the root-node

* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L14)** :`string` - the address of this account

* **[balance](https://github.com/slockit/in3/blob/master/src/types/types.ts#L18)** :`string` - the balance of this account as hex

* **[code](https://github.com/slockit/in3/blob/master/src/types/types.ts#L26)** :`string` *(optional)*  - the code of this account as hex ( if required)

* **[codeHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L22)** :`string` - the codeHash of this account as hex

* **[nonce](https://github.com/slockit/in3/blob/master/src/types/types.ts#L30)** :`string` - the nonce of this account as hex

* **[storageHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L34)** :`string` - the storageHash of this account as hex

* **[storageProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L38)** :[] - proof for requested storage-data


## Type BlockData


Block as returned by eth_getBlockByNumber


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L39)



* **[coinbase](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L44)** :`string` *(optional)*  

* **[difficulty](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L50)** :`string`|`number` 

* **[extraData](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L55)** :`string` 

* **[gasLimit](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L52)** :`string`|`number` 

* **[gasUsed](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L53)** :`string`|`number` 

* **[hash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L40)** :`string` 

* **[logsBloom](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L49)** :`string` 

* **[miner](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L43)** :`string` 

* **[mixHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L57)** :`string` *(optional)*  

* **[nonce](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L58)** :`string`|`number` *(optional)*  

* **[number](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L51)** :`string`|`number` 

* **[parentHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L41)** :`string` 

* **[receiptRoot](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L48)** :`string` *(optional)*  

* **[receiptsRoot](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L47)** :`string` 

* **[sealFields](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L56)** :`string`[] *(optional)*  

* **[sha3Uncles](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L42)** :`string` 

* **[stateRoot](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L45)** :`string` 

* **[timestamp](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L54)** :`string`|`number` 

* **[transactions](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L59)** :`any`[] *(optional)*  

* **[transactionsRoot](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L46)** :`string` 

* **[uncles](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L60)** :`string`[] *(optional)*  


## Type ChainSpec


describes the chainspecific consensus params


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L56)



* **[engine](https://github.com/slockit/in3/blob/master/src/types/types.ts#L60)** :`string` *(optional)*  - the engine type (like Ethhash, authorityRound, ... )

* **[validatorContract](https://github.com/slockit/in3/blob/master/src/types/types.ts#L64)** :`string` *(optional)*  - the aura contract to get the validators

* **[validatorList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L68)** :`any`[] *(optional)*  - the list of validators


## Type Client


Client for N3.


Source: [client/Client.ts](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L53)



* **[defaultMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L8)** :`number` 

* `static` **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L7)**(emitter :[`EventEmitter`](#type-eventemitter), event :`string`|`symbol`) :`number` 

* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L62)**(config :[`Partial<IN3Config>`](#type-partial) =  {}, transport :[`Transport`](#type-transport)) :[`Client`](#type-client) - creates a new Client.

* **[defConfig](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L60)** :[`IN3Config`](#type-in3config) - the iguration of the IN3-Client. This can be paritally overriden for every request.

* **[eth](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L56)** :[`EthAPI`](#type-ethapi) 

*  **config()** 

* **[addListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L10)**(event :`string`|`symbol`, listener :) :`this` 

* **[call](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L197)**(method :`string`, params :`any`, chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :`Promise<any>` - sends a simply RPC-Request

* **[clearStats](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L229)**() :`void` - clears all stats and weights, like blocklisted nodes

* **[createWeb3Provider](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L90)**() :[`EthereumProvider`](#type-ethereumprovider) 

* **[emit](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L22)**(event :`string`|`symbol`, args :`any`[]) :`boolean` 

* **[eventNames](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L23)**() :[`Array<>`](#type-array) 

* **[getChainContext](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L97)**(chainId :`string`) :[`ChainContext`](#type-chaincontext) 

* **[getMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L19)**() :`number` 

* **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L24)**(type :`string`|`symbol`) :`number` 

* **[listeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L20)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[off](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L16)**(event :`string`|`symbol`, listener :) :`this` 

* **[on](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L11)**(event :`string`|`symbol`, listener :) :`this` 

* **[once](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L12)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L13)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependOnceListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L14)**(event :`string`|`symbol`, listener :) :`this` 

* **[rawListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L21)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[removeAllListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L17)**(event :`string`|`symbol`) :`this` 

* **[removeListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L15)**(event :`string`|`symbol`, listener :) :`this` 

* **[send](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L209)**(request :[`RPCRequest`](#type-rpcrequest)[]|[`RPCRequest`](#type-rpcrequest), callback :, config :[`Partial<IN3Config>`](#type-partial)) :`Promise<>` - sends one or a multiple requests.
    if the request is a array the response will be a array as well.
    If the callback is given it will be called with the response, if not a Promise will be returned.
    This function supports callback so it can be used as a Provider for the web3.

* **[sendRPC](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L186)**(method :`string`, params :`any`[] =  [], chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :[`Promise<RPCResponse>`](#type-rpcresponse) - sends a simply RPC-Request

* **[setMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L18)**(n :`number`) :`this` 

* **[updateNodeList](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L120)**(chainId :`string`, conf :[`Partial<IN3Config>`](#type-partial), retryCount :`number` = 5) :`Promise<void>` - fetches the nodeList from the servers.


## Type IN3Config


the iguration of the IN3-Client. This can be paritally overriden for every request.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L73)



* **[autoConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L100)** :`boolean` *(optional)*  - if true the config will be adjusted depending on the request

* **[autoUpdateList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L182)** :`boolean` *(optional)*  - if true the nodelist will be automaticly updated if the lastBlock is newer
    example: true

* **[cacheStorage](https://github.com/slockit/in3/blob/master/src/types/types.ts#L186)** :`any` *(optional)*  - a cache handler offering 2 functions ( setItem(string,string), getItem(string) )

* **[cacheTimeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L77)** :`number` *(optional)*  - number of seconds requests can be cached.

* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L167)** :`string` - servers to filter for the given chain. The chain-id based on EIP-155.
    example: 0x1

* **[chainRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L172)** :`string` *(optional)*  - main chain-registry contract
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945

* **[finality](https://github.com/slockit/in3/blob/master/src/types/types.ts#L157)** :`number` *(optional)*  - the number in percent needed in order reach finality (% of signature of the validators)
    example: 50

* **[format](https://github.com/slockit/in3/blob/master/src/types/types.ts#L91)** :`'json'`|`'jsonRef'`|`'cbor'` *(optional)*  - the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding
    example: json

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L114)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[keepIn3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L86)** :`boolean` *(optional)*  - if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.

* **[key](https://github.com/slockit/in3/blob/master/src/types/types.ts#L96)** :`any` *(optional)*  - the client key to sign requests
    example: 0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7

* **[loggerUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L190)** :`string` *(optional)*  - a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }

* **[mainChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L177)** :`string` *(optional)*  - main chain-id, where the chain registry is running.
    example: 0x1

* **[maxAttempts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L109)** :`number` *(optional)*  - max number of attempts in case a response is rejected
    example: 10

* **[maxBlockCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L124)** :`number` *(optional)*  - number of number of blocks cached  in memory
    example: 100

* **[maxCodeCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L119)** :`number` *(optional)*  - number of max bytes used to cache the code in memory
    example: 100000

* **[minDeposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L142)** :`number` - min stake of the server. Only nodes owning at least this amount will be chosen.

* **[nodeLimit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L82)** :`number` *(optional)*  - the limit of nodes to store in the client.
    example: 150

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L133)** :`'none'`|`'standard'`|`'full'` *(optional)*  - if true the nodes should send a proof of the response
    example: true

* **[replaceLatestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L147)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[requestCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L152)** :`number` - the number of request send when getting a first answer
    example: 3

* **[retryWithoutProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L104)** :`boolean` *(optional)*  - if true the the request may be handled without proof in case of an error. (use with care!)

* **[servers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L194)** *(optional)*  - the nodelist per chain

* **[signatureCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L138)** :`number` *(optional)*  - number of signatures requested
    example: 2

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L162)** :`number` *(optional)*  - specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.
    example: 3000

* **[verifiedHashes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L128)** :`string`[] *(optional)*  - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number. This is automaticly updated by the cache, but can be overriden per request.


## Type IN3NodeConfig


a configuration of a in3-server.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L253)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L263)** :`string` - the address of the node, which is the public address it iis signing with.
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[capacity](https://github.com/slockit/in3/blob/master/src/types/types.ts#L283)** :`number` *(optional)*  - the capacity of the node.
    example: 100

* **[chainIds](https://github.com/slockit/in3/blob/master/src/types/types.ts#L273)** :`string`[] - the list of supported chains
    example: 0x1

* **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L278)** :`number` - the deposit of the node in wei
    example: 12350000

* **[index](https://github.com/slockit/in3/blob/master/src/types/types.ts#L258)** :`number` *(optional)*  - the index within the contract
    example: 13

* **[props](https://github.com/slockit/in3/blob/master/src/types/types.ts#L288)** :`number` *(optional)*  - the properties of the node.
    example: 3

* **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L268)** :`string` - the endpoint to post to
    example: https://in3.slock.it


## Type IN3NodeWeight


a local weight of a n3-node. (This is used internally to weight the requests)


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L293)



* **[avgResponseTime](https://github.com/slockit/in3/blob/master/src/types/types.ts#L308)** :`number` *(optional)*  - average time of a response in ms
    example: 240

* **[blacklistedUntil](https://github.com/slockit/in3/blob/master/src/types/types.ts#L322)** :`number` *(optional)*  - blacklisted because of failed requests until the timestamp
    example: 1529074639623

* **[lastRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L317)** :`number` *(optional)*  - timestamp of the last request in ms
    example: 1529074632623

* **[pricePerRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L312)** :`number` *(optional)*  - last price

* **[responseCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L303)** :`number` *(optional)*  - number of uses.
    example: 147

* **[weight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L298)** :`number` *(optional)*  - factor the weight this noe (default 1.0)
    example: 0.5


## Type IN3RPCConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L327)



* **[chains](https://github.com/slockit/in3/blob/master/src/types/types.ts#L420)** *(optional)*  - a definition of the Handler per chain

* **[db](https://github.com/slockit/in3/blob/master/src/types/types.ts#L340)** *(optional)* 

    * **[database](https://github.com/slockit/in3/blob/master/src/types/types.ts#L360)** :`string` *(optional)*  - name of the database

    * **[host](https://github.com/slockit/in3/blob/master/src/types/types.ts#L352)** :`string` *(optional)*  - db-host (default = localhost)

    * **[password](https://github.com/slockit/in3/blob/master/src/types/types.ts#L348)** :`string` *(optional)*  - password for db-access

    * **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L356)** :`number` *(optional)*  - the database port

    * **[user](https://github.com/slockit/in3/blob/master/src/types/types.ts#L344)** :`string` *(optional)*  - username for the db

* **[defaultChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L335)** :`string` *(optional)*  - the default chainId in case the request does not contain one.

* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L331)** :`string` *(optional)*  - a identifier used in logfiles as also for reading the config from the database

* **[logging](https://github.com/slockit/in3/blob/master/src/types/types.ts#L387)** *(optional)*  - logger config

    * **[colors](https://github.com/slockit/in3/blob/master/src/types/types.ts#L399)** :`boolean` *(optional)*  - if true colors will be used

    * **[file](https://github.com/slockit/in3/blob/master/src/types/types.ts#L391)** :`string` *(optional)*  - the path to the logile

    * **[host](https://github.com/slockit/in3/blob/master/src/types/types.ts#L415)** :`string` *(optional)*  - the host for custom logging

    * **[level](https://github.com/slockit/in3/blob/master/src/types/types.ts#L395)** :`string` *(optional)*  - Loglevel

    * **[name](https://github.com/slockit/in3/blob/master/src/types/types.ts#L403)** :`string` *(optional)*  - the name of the provider

    * **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L411)** :`number` *(optional)*  - the port for custom logging

    * **[type](https://github.com/slockit/in3/blob/master/src/types/types.ts#L407)** :`string` *(optional)*  - the module of the provider

* **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L339)** :`number` *(optional)*  - the listeneing port for the server

* **[profile](https://github.com/slockit/in3/blob/master/src/types/types.ts#L362)** *(optional)* 

    * **[comment](https://github.com/slockit/in3/blob/master/src/types/types.ts#L378)** :`string` *(optional)*  - comments for the node

    * **[icon](https://github.com/slockit/in3/blob/master/src/types/types.ts#L366)** :`string` *(optional)*  - url to a icon or logo of company offering this node

    * **[name](https://github.com/slockit/in3/blob/master/src/types/types.ts#L374)** :`string` *(optional)*  - name of the node or company

    * **[noStats](https://github.com/slockit/in3/blob/master/src/types/types.ts#L382)** :`boolean` *(optional)*  - if active the stats will not be shown (default:false)

    * **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L370)** :`string` *(optional)*  - url of the website of the company


## Type IN3RPCHandlerConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L427)



* **[autoRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L488)** *(optional)* 

    * **[capabilities](https://github.com/slockit/in3/blob/master/src/types/types.ts#L505)** *(optional)* 

        * **[multiChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L513)** :`boolean` *(optional)*  - if true, this node is able to deliver multiple chains

        * **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L509)** :`boolean` *(optional)*  - if true, this node is able to deliver proofs

    * **[capacity](https://github.com/slockit/in3/blob/master/src/types/types.ts#L500)** :`number` *(optional)*  - max number of parallel requests

    * **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L496)** :`number` - the deposit you want ot store

    * **[depositUnit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L504)** :`'ether'`|`'finney'`|`'szabo'`|`'wei'` *(optional)*  - unit of the deposit value

    * **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L492)** :`string` - the public url to reach this node

* **[clientKeys](https://github.com/slockit/in3/blob/master/src/types/types.ts#L447)** :`string` *(optional)*  - a comma sepearted list of client keys to use for simulating clients for the watchdog

* **[freeScore](https://github.com/slockit/in3/blob/master/src/types/types.ts#L455)** :`number` *(optional)*  - the score for requests without a valid signature

* **[handler](https://github.com/slockit/in3/blob/master/src/types/types.ts#L431)** :`'eth'`|`'ipfs'`|`'btc'` *(optional)*  - the impl used to handle the calls

* **[ipfsUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L435)** :`string` *(optional)*  - the url of the ipfs-client

* **[minBlockHeight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L459)** :`number` *(optional)*  - the minimal blockheight in order to sign

* **[persistentFile](https://github.com/slockit/in3/blob/master/src/types/types.ts#L463)** :`string` *(optional)*  - the filename of the file keeping track of the last handled blocknumber

* **[privateKey](https://github.com/slockit/in3/blob/master/src/types/types.ts#L475)** :`string` - the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.

* **[privateKeyPassphrase](https://github.com/slockit/in3/blob/master/src/types/types.ts#L479)** :`string` *(optional)*  - the password used to decrpyt the private key

* **[registry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L483)** :`string` - the address of the server registry used in order to update the nodeList

* **[registryRPC](https://github.com/slockit/in3/blob/master/src/types/types.ts#L487)** :`string` *(optional)*  - the url of the client in case the registry is not on the same chain.

* **[rpcUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L443)** :`string` - the url of the client

* **[startBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L467)** :`number` *(optional)*  - blocknumber to start watching the registry

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L439)** :`number` *(optional)*  - number of milliseconds to wait before a request gets a timeout

* **[watchInterval](https://github.com/slockit/in3/blob/master/src/types/types.ts#L471)** :`number` *(optional)*  - the number of seconds of the interval for checking for new events

* **[watchdogInterval](https://github.com/slockit/in3/blob/master/src/types/types.ts#L451)** :`number` *(optional)*  - average time between sending requests to the same node. 0 turns it off (default)


## Type IN3RPCRequestConfig


additional config for a IN3 RPC-Request


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L520)



* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L525)** :`string` - the requested chainId
    example: 0x1

* **[clientSignature](https://github.com/slockit/in3/blob/master/src/types/types.ts#L564)** :`any` *(optional)*  - the signature of the client

* **[finality](https://github.com/slockit/in3/blob/master/src/types/types.ts#L555)** :`number` *(optional)*  - if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L530)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[latestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L539)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L569)** :`string`[] *(optional)*  - a list of addresses requested to sign the blockhash
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[useBinary](https://github.com/slockit/in3/blob/master/src/types/types.ts#L547)** :`boolean` *(optional)*  - if true binary-data will be used.

* **[useFullProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L551)** :`boolean` *(optional)*  - if true all data in the response will be proven, which leads to a higher payload.

* **[useRef](https://github.com/slockit/in3/blob/master/src/types/types.ts#L543)** :`boolean` *(optional)*  - if true binary-data (starting with a 0x) will be refered if occuring again.

* **[verification](https://github.com/slockit/in3/blob/master/src/types/types.ts#L560)** :`'never'`|`'proof'`|`'proofWithSignature'` *(optional)*  - defines the kind of proof the client is asking for
    example: proof

* **[verifiedHashes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L534)** :`string`[] *(optional)*  - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.


## Type IN3ResponseConfig


additional data returned from a IN3 Server


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L574)



* **[currentBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L592)** :`number` *(optional)*  - the current blocknumber.
    example: 320126478

* **[lastNodeList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L583)** :`number` *(optional)*  - the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.
    example: 326478

* **[lastValidatorChange](https://github.com/slockit/in3/blob/master/src/types/types.ts#L587)** :`number` *(optional)*  - the blocknumber of gthe last change of the validatorList

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L578)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data


## Type LogData


LogData as part of the TransactionReceipt


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L99)



* **[address](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L106)** :`string` 

* **[blockHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L104)** :`string` 

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L105)** :`string` 

* **[data](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L107)** :`string` 

* **[logIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L101)** :`string` 

* **[removed](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L100)** :`boolean` 

* **[topics](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L108)** :`string`[] 

* **[transactionHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L103)** :`string` 

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L102)** :`string` 


## Type LogProof


a Object holding proofs for event logs. The key is the blockNumber as hex


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L597)




## Type Proof


the Proof-data as part of the in3-section


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L640)



* **[accounts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L685)** *(optional)*  - a map of addresses and their AccountProof

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L650)** :`string` *(optional)*  - the serialized blockheader as hex, required in most proofs
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[finalityBlocks](https://github.com/slockit/in3/blob/master/src/types/types.ts#L655)** :`any`[] *(optional)*  - the serialized blockheader as hex, required in case of finality asked
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[logProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L681)** :[`LogProof`](#type-logproof) *(optional)*  - the Log Proof in case of a Log-Request

* **[merkleProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L669)** :`string`[] *(optional)*  - the serialized merle-noodes beginning with the root-node

* **[merkleProofPrev](https://github.com/slockit/in3/blob/master/src/types/types.ts#L673)** :`string`[] *(optional)*  - the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L696)** :[`Signature`](#type-signature)[] *(optional)*  - requested signatures

* **[transactions](https://github.com/slockit/in3/blob/master/src/types/types.ts#L660)** :`any`[] *(optional)*  - the list of transactions of the block
    example:

* **[txIndex](https://github.com/slockit/in3/blob/master/src/types/types.ts#L692)** :`number` *(optional)*  - the transactionIndex within the block
    example: 4

* **[txProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L677)** :`string`[] *(optional)*  - the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex

* **[type](https://github.com/slockit/in3/blob/master/src/types/types.ts#L645)** :`'transactionProof'`|`'receiptProof'`|`'blockProof'`|`'accountProof'`|`'callProof'`|`'logProof'` - the type of the proof
    example: accountProof

* **[uncles](https://github.com/slockit/in3/blob/master/src/types/types.ts#L665)** :`any`[] *(optional)*  - the list of uncle-headers of the block
    example:


## Type RPCRequest


a JSONRPC-Request with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L701)



* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L715)** :`number`|`string` *(optional)*  - the identifier of the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L724)** :[`IN3RPCRequestConfig`](#type-in3rpcrequestconfig) *(optional)*  - the IN3-Config

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L705)** :`'2.0'` - the version

* **[method](https://github.com/slockit/in3/blob/master/src/types/types.ts#L710)** :`string` - the method to call
    example: eth_getBalance

* **[params](https://github.com/slockit/in3/blob/master/src/types/types.ts#L720)** :`any`[] *(optional)*  - the params
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,latest


## Type RPCResponse


a JSONRPC-Responset with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L729)



* **[error](https://github.com/slockit/in3/blob/master/src/types/types.ts#L742)** :`string` *(optional)*  - in case of an error this needs to be set

* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L738)** :`string`|`number` - the id matching the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L751)** :[`IN3ResponseConfig`](#type-in3responseconfig) *(optional)*  - the IN3-Result

* **[in3Node](https://github.com/slockit/in3/blob/master/src/types/types.ts#L755)** :[`IN3NodeConfig`](#type-in3nodeconfig) *(optional)*  - the node handling this response (internal only)

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L733)** :`'2.0'` - the version

* **[result](https://github.com/slockit/in3/blob/master/src/types/types.ts#L747)** :`any` *(optional)*  - the params
    example: 0xa35bc


## Type ReceiptData


TransactionReceipt as returned by eth_getTransactionReceipt


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L112)



* **[blockHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L116)** :`string` *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L115)** :`string`|`number` *(optional)*  

* **[cumulativeGasUsed](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L119)** :`string`|`number` *(optional)*  

* **[gasUsed](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L120)** :`string`|`number` *(optional)*  

* **[logs](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L122)** :[`LogData`](#type-logdata)[] 

* **[logsBloom](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L121)** :`string` *(optional)*  

* **[root](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L118)** :`string` *(optional)*  

* **[status](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L117)** :`string`|`boolean` *(optional)*  

* **[transactionHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L113)** :`string` *(optional)*  

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L114)** :`number` *(optional)*  


## Type ServerList


a List of nodes


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L760)



* **[contract](https://github.com/slockit/in3/blob/master/src/types/types.ts#L772)** :`string` *(optional)*  - IN3 Registry

* **[lastBlockNumber](https://github.com/slockit/in3/blob/master/src/types/types.ts#L764)** :`number` *(optional)*  - last Block number

* **[nodes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L768)** :[`IN3NodeConfig`](#type-in3nodeconfig)[] - the list of nodes

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L777)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data as part of the in3-section

* **[totalServers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L776)** :`number` *(optional)*  - number of servers


## Type Signature


Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L782)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L787)** :`string` *(optional)*  - the address of the signing node
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L792)** :`number` - the blocknumber
    example: 3123874

* **[blockHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L797)** :`string` - the hash of the block
    example: 0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679

* **[msgHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L802)** :`string` - hash of the message
    example: 0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D

* **[r](https://github.com/slockit/in3/blob/master/src/types/types.ts#L807)** :`string` - Positive non-zero Integer signature.r
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f

* **[s](https://github.com/slockit/in3/blob/master/src/types/types.ts#L812)** :`string` - Positive non-zero Integer signature.s
    example: 0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda

* **[v](https://github.com/slockit/in3/blob/master/src/types/types.ts#L817)** :`number` - Calculated curve point, or identity element O.
    example: 28


## Type TransactionData


Transaction as returned by eth_getTransactionByHash


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L64)



* **[blockHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L66)** :`string` *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L67)** :`number`|`string` *(optional)*  

* **[chainId](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L68)** :`number`|`string` *(optional)*  

* **[condition](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L69)** :`string` *(optional)*  

* **[creates](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L70)** :`string` *(optional)*  

* **[data](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L76)** :`string` *(optional)*  

* **[from](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L71)** :`string` *(optional)*  

* **[gas](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L72)** :`number`|`string` *(optional)*  

* **[gasLimit](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L73)** :`number`|`string` *(optional)*  

* **[gasPrice](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L74)** :`number`|`string` *(optional)*  

* **[hash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L65)** :`string` 

* **[input](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L75)** :`string` 

* **[nonce](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L77)** :`number`|`string` 

* **[publicKey](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L78)** :`string` *(optional)*  

* **[r](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L83)** :`string` *(optional)*  

* **[raw](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L79)** :`string` *(optional)*  

* **[s](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L84)** :`string` *(optional)*  

* **[standardV](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L80)** :`string` *(optional)*  

* **[to](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L81)** :`string` 

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L82)** :`number` 

* **[v](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L85)** :`string` *(optional)*  

* **[value](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L86)** :`number`|`string` 


## Type Transport


A Transport-object responsible to transport the message to the handler.


Source: [util/transport.ts](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L27)



* **[handle](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L31)**(url :`string`, data :[`RPCRequest`](#type-rpcrequest)|[`RPCRequest`](#type-rpcrequest)[], timeout :`number`) :`Promise<>` - handles a request by passing the data to the handler

* **[isOnline](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L36)**() :`Promise<boolean>` - check whether the handler is onlne.

* **[random](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L41)**(count :`number`) :`number`[] - generates random numbers (between 0-1)


## Type AxiosTransport


Default Transport impl sending http-requests.


Source: [util/transport.ts](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L49)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L51)**(format :`'json'`|`'jsonRef'`|`'cbor'` = "json") :[`AxiosTransport`](#type-axiostransport) 

* **[format](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L51)** :`'json'`|`'jsonRef'`|`'cbor'` 

* **[handle](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L61)**(url :`string`, data :[`RPCRequest`](#type-rpcrequest)|[`RPCRequest`](#type-rpcrequest)[], timeout :`number`) :`Promise<>` 

* **[isOnline](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L57)**() :`Promise<boolean>` 

* **[random](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L90)**(count :`number`) :`number`[] 


## Type API


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L203)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L204)**(client :[`Client`](#type-client)) :[`API`](#type-api) 

* **[client](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L204)** :[`Client`](#type-client) - Client for N3.

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L218)**() :`Promise<number>` - Returns the number of most recent block. (as number)

* **[call](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L231)**(tx :[`Transaction`](#type-transaction), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<string>` - Executes a new message call immediately without creating a transaction on the block chain.

* **[callFn](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L238)**(to :[`Address`](#type-address), method :`string`, args :`any`[]) :`Promise<any>` - Executes a new message call immediately without creating a transaction on the block chain.

* **[chainId](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L246)**() :`Promise<string>` - Returns the EIP155 chain ID used for transaction signing at the current best block. Null is returned if not available.

* **[estimateGas](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L253)**(tx :[`Transaction`](#type-transaction), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<number>` - Makes a call or transaction, which won’t be added to the blockchain and returns the used gas, which can be used for estimating the used gas.

* **[eth_getCode](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L267)**(address :[`Address`](#type-address), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<string>` - Returns code at a given address.

* **[gasPrice](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L224)**() :`Promise<number>` - Returns the current price per gas in wei. (as number)

* **[getBalance](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L260)**(address :[`Address`](#type-address), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<string>` - Returns the balance of the account of given address in wei (as hex).

* **[getBlockByHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L283)**(hash :[`Hash`](#type-hash), includeTransactions :`boolean` = false) :`Promise<>` - Returns information about a block by hash.

* **[getBlockByNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L290)**(block :[`BlockType`](#type-blocktype) = "latest", includeTransactions :`boolean` = false) :`Promise<>` - Returns information about a block by block number.

* **[getBlockTransactionCountByHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L298)**(block :[`Hash`](#type-hash)) :`Promise<number>` - Returns the number of transactions in a block from a block matching the given block hash.

* **[getBlockTransactionCountByNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L306)**(block :[`Hash`](#type-hash)) :`Promise<number>` - Returns the number of transactions in a block from a block matching the given block number.

* **[getFilterChanges](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L313)**(id :[`Quantity`](#type-quantity)) :`Promise<>` - Polling method for a filter, which returns an array of logs which occurred since last poll.

* **[getFilterLogs](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L320)**(id :[`Quantity`](#type-quantity)) :`Promise<>` - Returns an array of all logs matching filter with given id.

* **[getLogs](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L327)**(filter :[`LogFilter`](#type-logfilter)) :`Promise<>` - Returns an array of all logs matching a given filter object.

* **[getStorageAt](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L275)**(address :[`Address`](#type-address), pos :[`Quantity`](#type-quantity), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<string>` - Returns the value from a storage position at a given address.

* **[getTransactionByBlockHashAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L337)**(hash :[`Hash`](#type-hash), pos :[`Quantity`](#type-quantity)) :`Promise<>` - Returns information about a transaction by block hash and transaction index position.

* **[getTransactionByBlockNumberAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L345)**(block :[`BlockType`](#type-blocktype), pos :[`Quantity`](#type-quantity)) :`Promise<>` - Returns information about a transaction by block number and transaction index position.

* **[getTransactionByHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L352)**(hash :[`Hash`](#type-hash)) :`Promise<>` - Returns the information about a transaction requested by transaction hash.

* **[getTransactionCount](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L359)**(address :[`Address`](#type-address), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<number>` - Returns the number of transactions sent from an address. (as number)

* **[getTransactionReceipt](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L367)**(hash :[`Hash`](#type-hash)) :`Promise<>` - Returns the receipt of a transaction by transaction hash.
    Note That the receipt is available even for pending transactions.

* **[getUncleByBlockHashAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L375)**(hash :[`Hash`](#type-hash), pos :[`Quantity`](#type-quantity)) :`Promise<>` - Returns information about a uncle of a block by hash and uncle index position.
    Note: An uncle doesn’t contain individual transactions.

* **[getUncleByBlockNumberAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L384)**(block :[`BlockType`](#type-blocktype), pos :[`Quantity`](#type-quantity)) :`Promise<>` - Returns information about a uncle of a block number and uncle index position.
    Note: An uncle doesn’t contain individual transactions.

* **[getUncleCountByBlockHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L391)**(hash :[`Hash`](#type-hash)) :`Promise<number>` - Returns the number of uncles in a block from a block matching the given block hash.

* **[getUncleCountByBlockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L398)**(block :[`BlockType`](#type-blocktype)) :`Promise<number>` - Returns the number of uncles in a block from a block matching the given block hash.

* **[newBlockFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L406)**() :`Promise<string>` - Creates a filter in the node, to notify when a new block arrives. To check if the state has changed, call eth_getFilterChanges.

* **[newFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L423)**(filter :[`LogFilter`](#type-logfilter)) :`Promise<string>` - Creates a filter object, based on filter options, to notify when the state changes (logs). To check if the state has changed, call eth_getFilterChanges.

* **[newPendingTransactionFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L432)**() :`Promise<string>` - Creates a filter in the node, to notify when new pending transactions arrive.

* **[protocolVersion](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L447)**() :`Promise<string>` - Returns the current ethereum protocol version.

* **[sendRawTransaction](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L469)**(data :[`Data`](#type-data)) :`Promise<string>` - Creates new message call transaction or a contract creation for signed transactions.

* **[sendTransaction](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L474)**(args :[`TxRequest`](#type-txrequest)) :`Promise<>` - sends a Transaction

* **[syncing](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L454)**() :`Promise<>` - Returns the current ethereum protocol version.

* **[uninstallFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L440)**(id :[`Quantity`](#type-quantity)) :`Promise<>` - Uninstalls a filter with given id. Should always be called when watch is no longer needed. Additonally Filters timeout when they aren’t requested with eth_getFilterChanges for a period of time.


## Type Block


encodes and decodes the blockheader


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L221)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L242)**(data :[`Buffer`](#type-buffer)|`string`|[`BlockData`](#type-blockdata)) :[`Block`](#type-block) - creates a Block-Onject from either the block-data as returned from rpc, a buffer or a hex-string of the encoded blockheader

* **[raw](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L224)** :[`BlockHeader`](#type-blockheader) - the raw Buffer fields of the BlockHeader

* **[transactions](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L227)** :[`Tx`](#type-tx)[] - the transaction-Object (if given)

*  **bloom()** 

*  **coinbase()** 

*  **difficulty()** 

*  **extra()** 

*  **gasLimit()** 

*  **gasUsed()** 

*  **number()** 

*  **parentHash()** 

*  **receiptTrie()** 

*  **sealedFields()** 

*  **stateRoot()** 

*  **timestamp()** 

*  **transactionsTrie()** 

*  **uncleHash()** 

* **[bareHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L265)**() :[`Buffer`](#type-buffer) - the blockhash as buffer without the seal fields

* **[hash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L260)**() :[`Buffer`](#type-buffer) - the blockhash as buffer

* **[serializeHeader](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L270)**() :[`Buffer`](#type-buffer) - the serialized header as buffer


## Type ChainContext


Context for a specific chain including cache and chainSpecs.


Source: [client/ChainContext.ts](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L27)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L32)**(client :[`Client`](#type-client), chainId :`string`, chainSpec :[`ChainSpec`](#type-chainspec)) :[`ChainContext`](#type-chaincontext) 

* **[chainId](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L31)** :`string` 

* **[chainSpec](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L29)** :[`ChainSpec`](#type-chainspec) - describes the chainspecific consensus params

* **[client](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L28)** :[`Client`](#type-client) - Client for N3.

* **[genericCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L32)**

* **[module](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L30)** :[`Module`](#type-module) 

* **[getFromCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L95)**(key :`string`) :`string` 

* **[handleIntern](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L58)**(request :[`RPCRequest`](#type-rpcrequest)) :[`Promise<RPCResponse>`](#type-rpcresponse) - this function is calleds before the server is asked.
    If it returns a promise than the request is handled internally otherwise the server will handle the response.
    this function should be overriden by modules that want to handle calls internally

* **[initCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L63)**() :`void` 

* **[putInCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L99)**(key :`string`, value :`string`) :`void` 

* **[updateCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L89)**() :`void` 


## Type AccountData


Account-Object


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L90)



* **[balance](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L92)** :`string` 

* **[code](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L95)** :`string` *(optional)*  

* **[codeHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L94)** :`string` 

* **[nonce](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L91)** :`string` 

* **[storageHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L93)** :`string` 


## Type Transaction


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L12)



* **[Transaction](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L12)**

    * **[data](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L24)** :`string` - 4 byte hash of the method signature followed by encoded parameters. For details see Ethereum Contract ABI.

    * **[Address](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L8)** :`number`|`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L8)** :`number`|`string` 

    * **[Address](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L8)** :`number`|`string` 


## Type Receipt


Buffer[] of the Receipt


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L36)



* **[Receipt](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L36)** : - Buffer[] of the Receipt


## Type Account


Buffer[] of the Account


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L33)



* **[Account](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L33)** :[`Buffer`](#type-buffer)[] - Buffer[] of the Account


## Type EthereumProvider


Source: [client/provider.ts](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L3)



* **[IN3Client](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L4)** :[`Client`](#type-client) - Client for N3.

* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L5)**(client :[`Client`](#type-client), _host :`string`) :[`EthereumProvider`](#type-ethereumprovider) 

* **[host](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L5)** :`string` 

* **[clearSubscriptions](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L39)**(unsubscribeMethod :`string`) :`Promise<boolean>` 

* **[on](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L43)**(type :`string`, callback :) :`void` 

* **[registerEventListeners](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L27)**() :`void` 

* **[removeAllListeners](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L51)**(type :`string`) :`void` 

* **[removeListener](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L47)**(type :`string`, callback :) :`void` 

* **[reset](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L55)**() :`void` 

* **[send](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L12)**(method :`any`, parameters :`any`) :`Promise<any>` 

* **[sendBatch](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L16)**(methods :`any`, moduleInstance :`any`) :`Promise<>` 

* **[subscribe](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L31)**(subscribeMethod :`string`, subscriptionMethod :`string`, parameters :`any`[]) :`Promise<string>` 

* **[unsubscribe](https://github.com/slockit/in3/blob/master/src/client/provider.ts#L35)**(subscriptionId :`string`, unsubscribeMethod :`string`) :`Promise<boolean>` 


## Type BlockType


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L7)



* **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L7)** :`number`|`'latest'`|`'earliest'`|`'pending'` 


## Type Address


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)



* **[Address](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 


## Type Hash


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)



* **[Hash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)** :`string` 


## Type Quantity


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L8)



* **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L8)** :`number`|`string` 


## Type LogFilter


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L160)



* **[LogFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L160)**

    * **[Address](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L7)** :`number`|`'latest'`|`'earliest'`|`'pending'` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L8)** :`number`|`string` 

    * **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L7)** :`number`|`'latest'`|`'earliest'`|`'pending'` 

    * **[topics](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L168)** :`string`|`string`[][] - (optional) Array of 32 Bytes Data topics. Topics are order-dependent. It’s possible to pass in null to match any topic, or a subarray of multiple topics of which one should be matching.


## Type Data


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)



* **[Data](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`string` 


## Type TxRequest


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L173)



* **[TxRequest](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L173)**

    * **[args](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L193)** :`any`[] - the argument to pass to the method

    * **[confirmations](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L199)** :`number` - number of block to wait before confirming

    * **[gas](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L178)** :`number` - the gas needed

    * **[gasPrice](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L181)** :`number` - the gasPrice used

    * **[method](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L190)** :`string` - the ABI of the method to be used

    * **[nonce](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L184)** :`number` - the nonce

    * **[Hash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)** :`string` 

    * **[Address](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L8)** :`number`|`string` 


## Type BlockHeader


Buffer[] of the header


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L27)



* **[BlockHeader](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L27)** :[`Buffer`](#type-buffer)[] - Buffer[] of the header


## Type Module


Source: [client/modules.ts](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L7)



* **[name](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L8)** :`string` 

* **[createChainContext](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L10)**(client :[`Client`](#type-client), chainId :`string`, spec :[`ChainSpec`](#type-chainspec)) :[`ChainContext`](#type-chaincontext) 

* **[verifyProof](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L12)**(request :[`RPCRequest`](#type-rpcrequest), response :[`RPCResponse`](#type-rpcresponse), allowWithoutProof :`boolean`, ctx :[`ChainContext`](#type-chaincontext)) :`Promise<boolean>` - general verification-function which handles it according to its given type.

