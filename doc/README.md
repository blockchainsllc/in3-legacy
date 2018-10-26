# INCUBED API

This documentation contains a list of all Datastructures and Classes used within the IN3 Client.


* [**AccountProof**](#type-accountproof) : `interface`  - the Proof-for a single Account

* [**BlockData**](#type-blockdata) : `interface`  - Block as returned by eth_getBlockByNumber

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

* **[cbor](https://github.com/slockit/in3/blob/master/src/index.ts#L31)**

    * **[createRefs](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L86)**(val :[`T`](#type-t), cache :`string`[] =  []) :[`T`](#type-t) 

    * **[decodeRequests](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L30)**(request :[`Buffer`](#type-buffer)) :[`RPCRequest`](#type-rpcrequest)[] 

    * **[decodeResponses](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L44)**(responses :[`Buffer`](#type-buffer)) :[`RPCResponse`](#type-rpcresponse)[] 

    * **[encodeRequests](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L26)**(requests :[`RPCRequest`](#type-rpcrequest)[]) :[`Buffer`](#type-buffer) - turn

    * **[encodeResponses](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L41)**(responses :[`RPCResponse`](#type-rpcresponse)[]) :[`Buffer`](#type-buffer) 

    * **[resolveRefs](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L107)**(val :[`T`](#type-t), cache :`string`[] =  []) :[`T`](#type-t) 

* **[chainAliases](https://github.com/slockit/in3/blob/master/src/index.ts#L75)**

    * **[ipfs](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L673)** :`string` 

    * **[kovan](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L673)** :`string` 

    * **[main](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L673)** :`string` 

    * **[mainnet](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L673)** :`string` 

    * **[tobalaba](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L673)** :`string` 

* **[chainData](https://github.com/slockit/in3/blob/master/src/index.ts#L44)**

    * **[callContract](https://github.com/slockit/in3/blob/master/src/client/chainData.ts#L26)**(client :[`Client`](#type-client), contract :`string`, chainId :`string`, signature :`string`, args :`any`[], config :[`IN3Config`](#type-in3config)) :`Promise<any>` 

    * **[getChainData](https://github.com/slockit/in3/blob/master/src/client/chainData.ts#L35)**(client :[`Client`](#type-client), chainId :`string`, config :[`IN3Config`](#type-in3config)) :`Promise<>` 

* **[createRandomIndexes](https://github.com/slockit/in3/blob/master/src/client/serverList.ts#L32)**(len :`number`, limit :`number`, seed :[`Buffer`](#type-buffer), result :`number`[] =  []) :`number`[] 

* **[serialize](https://github.com/slockit/in3/blob/master/src/index.ts#L34)**

    * [**Block**](#type-block) :`class` - encodes and decodes the blockheader

    * [**AccountData**](#type-accountdata) :`interface` - Account-Object

    * [**BlockData**](#type-blockdata) :`interface` - Block as returned by eth_getBlockByNumber

    * [**LogData**](#type-logdata) :`interface` - LogData as part of the TransactionReceipt

    * [**ReceiptData**](#type-receiptdata) :`interface` - TransactionReceipt as returned by eth_getTransactionReceipt

    * [**TransactionData**](#type-transactiondata) :`interface` - Transaction as returned by eth_getTransactionByHash

    * **[Account](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L33)** :[`Buffer`](#type-buffer)[] - Buffer[] of the Account

    * **[BlockHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L27)** :[`Buffer`](#type-buffer)[] - Buffer[] of the header

    * **[Receipt](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L36)** : - Buffer[] of the Receipt

    * **[Transaction](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L30)** :[`Buffer`](#type-buffer)[] - Buffer[] of the transaction

    * **[rlp](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L25)** :`any` - RLP-functions

    * **[address](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L141)**(val :`any`) :`any` - converts it to a Buffer with 20 bytes length

    * **[blockFromHex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L304)**(hex :`string`) :[`Block`](#type-block) - converts a hexstring to a block-object

    * **[blockToHex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L299)**(block :`any`) :`string` - converts blockdata to a hexstring

    * **[bytes](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L139)**(val :`any`) :`any` - converts it to a Buffer

    * **[bytes256](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L133)**(val :`any`) :`any` - converts it to a Buffer with 256 bytes length

    * **[bytes32](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L135)**(val :`any`) :`any` - converts it to a Buffer with 32 bytes length

    * **[bytes8](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L137)**(val :`any`) :`any` - converts it to a Buffer with 8 bytes length

    * **[createTx](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L271)**(transaction :`any`) :`any` - creates a Transaction-object from the rpc-transaction-data

    * **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L127)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)|[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) - returns the hash of the object

    * **[serialize](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L124)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)) :[`Buffer`](#type-buffer) - serialize the data

    * **[toAccount](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L185)**(account :[`AccountData`](#type-accountdata)) :[`Buffer`](#type-buffer)[] 

    * **[toBlockHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L146)**(block :[`BlockData`](#type-blockdata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[toReceipt](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L195)**(r :[`ReceiptData`](#type-receiptdata)) :`Object` - create a Buffer[] from RPC-Response

    * **[toTransaction](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L171)**(tx :[`TransactionData`](#type-transactiondata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[uint](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L143)**(val :`any`) :`any` - converts it to a Buffer with a variable length. 0 = length 0

* **[storage](https://github.com/slockit/in3/blob/master/src/index.ts#L37)**

    * **[getStorageArrayKey](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L28)**(pos :`number`, arrayIndex :`number`, structSize :`number` = 1, structPos :`number` = 0) :`any` - calc the storrage array key

    * **[getStorageMapKey](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L40)**(pos :`number`, key :`string`, structPos :`number` = 0) :`any` - calcs the storage Map key.

    * **[getStorageValue](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L88)**(rpc :`string`, contract :`string`, pos :`number`, type :`'address'`|`'bytes32'`|`'bytes16'`|`'bytes4'`|`'int'`|`'string'`, keyOrIndex :`number`|`string`, structSize :`number`, structPos :`number`) :`Promise<any>` - get a storage value from the server

    * **[getStringValue](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L50)**(data :[`Buffer`](#type-buffer), storageKey :[`Buffer`](#type-buffer)) :`string`| - creates a string from storage.

    * **[getStringValueFromList](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L69)**(values :[`Buffer`](#type-buffer)[], len :`number`) :`string` - concats the storage values to a string.

    * **[toBN](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L76)**(val :`any`) :`any` - converts any value to BN

* **[transport](https://github.com/slockit/in3/blob/master/src/index.ts#L40)**

    * [**AxiosTransport**](#type-axiostransport) :`class` - Default Transport impl sending http-requests.

    * [**Transport**](#type-transport) :`interface` - A Transport-object responsible to transport the message to the handler.

* **[typeDefs](https://github.com/slockit/in3/blob/master/src/index.ts#L73)**

    * **[AccountProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[IN3Config](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[IN3NodeConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[IN3NodeWeight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[IN3RPCConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[IN3RPCHandlerConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[IN3RPCRequestConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[IN3ResponseConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[LogProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[Proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[RPCRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[RPCResponse](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[ServerList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


    * **[Signature](https://github.com/slockit/in3/blob/master/src/types/types.ts#L727)** : `Object`  


* **[util](https://github.com/slockit/in3/blob/master/src/index.ts#L26)**

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


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L25)



* **[accountProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L29)** :`string`[] - the serialized merle-noodes beginning with the root-node

* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L33)** :`string` - the address of this account

* **[balance](https://github.com/slockit/in3/blob/master/src/types/types.ts#L37)** :`string` - the balance of this account as hex

* **[code](https://github.com/slockit/in3/blob/master/src/types/types.ts#L45)** :`string` *(optional)*  - the code of this account as hex ( if required)

* **[codeHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L41)** :`string` - the codeHash of this account as hex

* **[nonce](https://github.com/slockit/in3/blob/master/src/types/types.ts#L49)** :`string` - the nonce of this account as hex

* **[storageHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L53)** :`string` - the storageHash of this account as hex

* **[storageProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L57)** :[] - proof for requested storage-data


## Type BlockData


Block as returned by eth_getBlockByNumber


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L39)



* **[coinbase](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L44)** :`string` *(optional)*  

* **[difficulty](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L50)** :`string`|`number` 

* **[extraData](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L55)** :`string` 

* **[gasLimit](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L52)** :`string`|`number` 

* **[gasUsed](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L53)** :`string`|`number` 

* **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L40)** :`string` 

* **[logsBloom](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L49)** :`string` 

* **[miner](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L43)** :`string` 

* **[mixHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L57)** :`string` *(optional)*  

* **[nonce](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L58)** :`string`|`number` *(optional)*  

* **[number](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L51)** :`string`|`number` 

* **[parentHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L41)** :`string` 

* **[receiptRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L48)** :`string` *(optional)*  

* **[receiptsRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L47)** :`string` 

* **[sealFields](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L56)** :`string`[] *(optional)*  

* **[sha3Uncles](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L42)** :`string` 

* **[stateRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L45)** :`string` 

* **[timestamp](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L54)** :`string`|`number` 

* **[transactions](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L59)** :`any`[] *(optional)*  

* **[transactionsRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L46)** :`string` 


## Type Client


Client for N3.


Source: [client/Client.ts](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L39)



* **[defaultMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1030)** :`number` 

* `static` **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1029)**(emitter :[`EventEmitter`](#type-eventemitter), event :`string`|`symbol`) :`number` 

* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L44)**(config :[`Partial<IN3Config>`](#type-partial) = {}, transport :[`Transport`](#type-transport)) :[`Client`](#type-client) - creates a new Client.

* **[cache](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L44)** :[`Cache`](#type-cache) 

* **[defConfig](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L41)** :[`IN3Config`](#type-in3config) - the iguration of the IN3-Client. This can be paritally overriden for every request.

*  **config()** 

* **[addListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1032)**(event :`string`|`symbol`, listener :) :`this` 

* **[call](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L263)**(method :`string`, params :`any`, chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :`Promise<any>` - sends a simply RPC-Request

* **[clearStats](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L295)**() :`void` - clears all stats and weights, like blocklisted nodes

* **[emit](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1044)**(event :`string`|`symbol`, args :`any`[]) :`boolean` 

* **[eventNames](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1045)**() :[`Array<>`](#type-array) 

* **[getMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1041)**() :`number` 

* **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1046)**(type :`string`|`symbol`) :`number` 

* **[listeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1042)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[off](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1038)**(event :`string`|`symbol`, listener :) :`this` 

* **[on](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1033)**(event :`string`|`symbol`, listener :) :`this` 

* **[once](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1034)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1035)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependOnceListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1036)**(event :`string`|`symbol`, listener :) :`this` 

* **[rawListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1043)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[removeAllListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1039)**(event :`string`|`symbol`) :`this` 

* **[removeListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1037)**(event :`string`|`symbol`, listener :) :`this` 

* **[send](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L275)**(request :[`RPCRequest`](#type-rpcrequest)[]|[`RPCRequest`](#type-rpcrequest), callback :, config :[`Partial<IN3Config>`](#type-partial)) :`void`|`Promise<>` - sends one or a multiple requests.
    if the request is a array the response will be a array as well.
    If the callback is given it will be called with the response, if not a Promise will be returned.
    This function supports callback so it can be used as a Provider for the web3.

* **[sendRPC](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L252)**(method :`string`, params :`any`[] =  [], chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :[`Promise<RPCResponse>`](#type-rpcresponse) - sends a simply RPC-Request

* **[setMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/in3/in3/node_modules/@types/node/index.d.ts#L1040)**(n :`number`) :`this` 

* **[updateNodeList](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L186)**(chainId :`string`, conf :[`Partial<IN3Config>`](#type-partial), retryCount :`number` = 5) :`Promise<void>` - fetches the nodeList from the servers.


## Type IN3Config


the iguration of the IN3-Client. This can be paritally overriden for every request.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L75)



* **[autoConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L93)** :`boolean` *(optional)*  - if true the config will be adjusted depending on the request

* **[autoUpdateList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L165)** :`boolean` *(optional)*  - if true the nodelist will be automaticly updated if the lastBlock is newer
    example: true

* **[cacheStorage](https://github.com/slockit/in3/blob/master/src/types/types.ts#L169)** :`any` *(optional)*  - a cache handler offering 2 functions ( setItem(string,string), getItem(string) )

* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L150)** :`string` - servers to filter for the given chain. The chain-id based on EIP-155.
    example: 0x1

* **[chainRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L155)** :`string` *(optional)*  - main chain-registry contract
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945

* **[format](https://github.com/slockit/in3/blob/master/src/types/types.ts#L89)** :`'json'`|`'jsonRef'`|`'cbor'` *(optional)*  - the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding
    example: json

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L102)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[keepIn3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L84)** :`boolean` *(optional)*  - if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.

* **[loggerUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L173)** :`string` *(optional)*  - a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }

* **[mainChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L160)** :`string` *(optional)*  - main chain-id, where the chain registry is running.
    example: 0x1

* **[maxBlockCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L112)** :`number` *(optional)*  - number of number of blocks cached  in memory
    example: 100

* **[maxCodeCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L107)** :`number` *(optional)*  - number of max bytes used to cache the code in memory
    example: 100000

* **[minDeposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L130)** :`number` - min stake of the server. Only nodes owning at least this amount will be chosen.

* **[nodeLimit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L80)** :`number` *(optional)*  - the limit of nodes to store in the client.
    example: 150

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L121)** :`'none'`|`'standard'`|`'full'` *(optional)*  - if true the nodes should send a proof of the response
    example: true

* **[replaceLatestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L135)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[requestCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L140)** :`number` - the number of request send when getting a first answer
    example: 3

* **[retryWithoutProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L97)** :`boolean` *(optional)*  - if true the the request may be handled without proof in case of an error. (use with care!)

* **[servers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L177)** *(optional)*  - the nodelist per chain

* **[signatureCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L126)** :`number` *(optional)*  - number of signatures requested
    example: 2

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L145)** :`number` *(optional)*  - specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.
    example: 3000

* **[verifiedHashes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L116)** :`string`[] *(optional)*  - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number. This is automaticly updated by the cache, but can be overriden per request.


## Type IN3NodeConfig


a configuration of a in3-server.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L224)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L234)** :`string` - the address of the node, which is the public address it iis signing with.
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[chainIds](https://github.com/slockit/in3/blob/master/src/types/types.ts#L244)** :`string`[] - the list of supported chains
    example: 0x1

* **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L249)** :`number` - the deposit of the node in wei
    example: 12350000

* **[index](https://github.com/slockit/in3/blob/master/src/types/types.ts#L229)** :`number` *(optional)*  - the index within the contract
    example: 13

* **[props](https://github.com/slockit/in3/blob/master/src/types/types.ts#L254)** :`number` *(optional)*  - the properties of the node.
    example: 3

* **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L239)** :`string` - the endpoint to post to
    example: https://in3.slock.it


## Type IN3NodeWeight


a local weight of a n3-node. (This is used internally to weight the requests)


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L259)



* **[avgResponseTime](https://github.com/slockit/in3/blob/master/src/types/types.ts#L274)** :`number` *(optional)*  - average time of a response in ms
    example: 240

* **[blacklistedUntil](https://github.com/slockit/in3/blob/master/src/types/types.ts#L288)** :`number` *(optional)*  - blacklisted because of failed requests until the timestamp
    example: 1529074639623

* **[lastRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L283)** :`number` *(optional)*  - timestamp of the last request in ms
    example: 1529074632623

* **[pricePerRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L278)** :`number` *(optional)*  - last price

* **[responseCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L269)** :`number` *(optional)*  - number of uses.
    example: 147

* **[weight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L264)** :`number` *(optional)*  - factor the weight this noe (default 1.0)
    example: 0.5


## Type IN3RPCConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L293)



* **[chains](https://github.com/slockit/in3/blob/master/src/types/types.ts#L386)** *(optional)*  - a definition of the Handler per chain

* **[db](https://github.com/slockit/in3/blob/master/src/types/types.ts#L306)** *(optional)* 

    * **[database](https://github.com/slockit/in3/blob/master/src/types/types.ts#L326)** :`string` *(optional)*  - name of the database

    * **[host](https://github.com/slockit/in3/blob/master/src/types/types.ts#L318)** :`string` *(optional)*  - db-host (default = localhost)

    * **[password](https://github.com/slockit/in3/blob/master/src/types/types.ts#L314)** :`string` *(optional)*  - password for db-access

    * **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L322)** :`number` *(optional)*  - the database port

    * **[user](https://github.com/slockit/in3/blob/master/src/types/types.ts#L310)** :`string` *(optional)*  - username for the db

* **[defaultChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L301)** :`string` *(optional)*  - the default chainId in case the request does not contain one.

* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L297)** :`string` *(optional)*  - a identifier used in logfiles as also for reading the config from the database

* **[logging](https://github.com/slockit/in3/blob/master/src/types/types.ts#L353)** *(optional)*  - logger config

    * **[colors](https://github.com/slockit/in3/blob/master/src/types/types.ts#L365)** :`boolean` *(optional)*  - if true colors will be used

    * **[file](https://github.com/slockit/in3/blob/master/src/types/types.ts#L357)** :`string` *(optional)*  - the path to the logile

    * **[host](https://github.com/slockit/in3/blob/master/src/types/types.ts#L381)** :`string` *(optional)*  - the host for custom logging

    * **[level](https://github.com/slockit/in3/blob/master/src/types/types.ts#L361)** :`string` *(optional)*  - Loglevel

    * **[name](https://github.com/slockit/in3/blob/master/src/types/types.ts#L369)** :`string` *(optional)*  - the name of the provider

    * **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L377)** :`number` *(optional)*  - the port for custom logging

    * **[type](https://github.com/slockit/in3/blob/master/src/types/types.ts#L373)** :`string` *(optional)*  - the module of the provider

* **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L305)** :`number` *(optional)*  - the listeneing port for the server

* **[profile](https://github.com/slockit/in3/blob/master/src/types/types.ts#L328)** *(optional)* 

    * **[comment](https://github.com/slockit/in3/blob/master/src/types/types.ts#L344)** :`string` *(optional)*  - comments for the node

    * **[icon](https://github.com/slockit/in3/blob/master/src/types/types.ts#L332)** :`string` *(optional)*  - url to a icon or logo of company offering this node

    * **[name](https://github.com/slockit/in3/blob/master/src/types/types.ts#L340)** :`string` *(optional)*  - name of the node or company

    * **[noStats](https://github.com/slockit/in3/blob/master/src/types/types.ts#L348)** :`boolean` *(optional)*  - if active the stats will not be shown (default:false)

    * **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L336)** :`string` *(optional)*  - url of the website of the company


## Type IN3RPCHandlerConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L393)



* **[autoRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L442)** *(optional)* 

    * **[capabilities](https://github.com/slockit/in3/blob/master/src/types/types.ts#L455)** *(optional)* 

        * **[multiChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L463)** :`boolean` *(optional)*  - if true, this node is able to deliver multiple chains

        * **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L459)** :`boolean` *(optional)*  - if true, this node is able to deliver proofs

    * **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L450)** :`number` - the deposit you want ot store

    * **[depositUnit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L454)** :`'ether'`|`'finney'`|`'szabo'`|`'wei'` *(optional)*  - unit of the deposit value

    * **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L446)** :`string` - the public url to reach this node

* **[handler](https://github.com/slockit/in3/blob/master/src/types/types.ts#L397)** :`'eth'`|`'ipfs'`|`'btc'` *(optional)*  - the impl used to handle the calls

* **[ipfsUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L401)** :`string` *(optional)*  - the url of the ipfs-client

* **[minBlockHeight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L413)** :`number` *(optional)*  - the minimal blockheight in order to sign

* **[persistentFile](https://github.com/slockit/in3/blob/master/src/types/types.ts#L417)** :`string` *(optional)*  - the filename of the file keeping track of the last handled blocknumber

* **[privateKey](https://github.com/slockit/in3/blob/master/src/types/types.ts#L429)** :`string` - the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.

* **[privateKeyPassphrase](https://github.com/slockit/in3/blob/master/src/types/types.ts#L433)** :`string` *(optional)*  - the password used to decrpyt the private key

* **[registry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L437)** :`string` - the address of the server registry used in order to update the nodeList

* **[registryRPC](https://github.com/slockit/in3/blob/master/src/types/types.ts#L441)** :`string` *(optional)*  - the url of the client in case the registry is not on the same chain.

* **[rpcUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L409)** :`string` - the url of the client

* **[startBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L421)** :`number` *(optional)*  - blocknumber to start watching the registry

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L405)** :`number` *(optional)*  - number of milliseconds to wait before a request gets a timeout

* **[watchInterval](https://github.com/slockit/in3/blob/master/src/types/types.ts#L425)** :`number` *(optional)*  - the number of seconds of the interval for checking for new events


## Type IN3RPCRequestConfig


additional config for a IN3 RPC-Request


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L470)



* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L475)** :`string` - the requested chainId
    example: 0x1

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L480)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[latestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L489)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L507)** :`string`[] *(optional)*  - a list of addresses requested to sign the blockhash
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[useFullProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L497)** :`boolean` *(optional)*  - if true all data in the response will be proven, which leads to a higher payload.

* **[useRef](https://github.com/slockit/in3/blob/master/src/types/types.ts#L493)** :`boolean` *(optional)*  - if true binary-data (starting with a 0x) will be refered if occuring again.

* **[verification](https://github.com/slockit/in3/blob/master/src/types/types.ts#L502)** :`'never'`|`'proof'`|`'proofWithSignature'` *(optional)*  - defines the kind of proof the client is asking for
    example: proof

* **[verifiedHashes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L484)** :`string`[] *(optional)*  - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.


## Type IN3ResponseConfig


additional data returned from a IN3 Server


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L512)



* **[lastNodeList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L521)** :`number` *(optional)*  - the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.
    example: 326478

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L516)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data


## Type LogData


LogData as part of the TransactionReceipt


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L98)



* **[address](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L105)** :`string` 

* **[blockHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L103)** :`string` 

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L104)** :`string` 

* **[data](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L106)** :`string` 

* **[logIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L100)** :`string` 

* **[removed](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L99)** :`boolean` 

* **[topics](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L107)** :`string`[] 

* **[transactionHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L102)** :`string` 

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L101)** :`string` 


## Type LogProof


a Object holding proofs for event logs. The key is the blockNumber as hex


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L526)




## Type Proof


the Proof-data as part of the in3-section


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L561)



* **[accounts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L592)** *(optional)*  - a map of addresses and their AccountProof

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L571)** :`string` *(optional)*  - the serialized blockheader as hex, required in most proofs
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[logProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L588)** :[`LogProof`](#type-logproof) *(optional)*  - the Log Proof in case of a Log-Request

* **[merkleProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L580)** :`string`[] *(optional)*  - the serialized merle-noodes beginning with the root-node

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L603)** :[`Signature`](#type-signature)[] *(optional)*  - requested signatures

* **[transactions](https://github.com/slockit/in3/blob/master/src/types/types.ts#L576)** :`any`[] *(optional)*  - the list of transactions of the block
    example:

* **[txIndex](https://github.com/slockit/in3/blob/master/src/types/types.ts#L599)** :`number` *(optional)*  - the transactionIndex within the block
    example: 4

* **[txProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L584)** :`string`[] *(optional)*  - the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex

* **[type](https://github.com/slockit/in3/blob/master/src/types/types.ts#L566)** :`'transactionProof'`|`'receiptProof'`|`'blockProof'`|`'accountProof'`|`'callProof'`|`'logProof'` - the type of the proof
    example: accountProof


## Type RPCRequest


a JSONRPC-Request with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L608)



* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L622)** :`number`|`string` *(optional)*  - the identifier of the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L631)** :[`IN3RPCRequestConfig`](#type-in3rpcrequestconfig) *(optional)*  - the IN3-Config

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L612)** :`'2.0'` - the version

* **[method](https://github.com/slockit/in3/blob/master/src/types/types.ts#L617)** :`string` - the method to call
    example: eth_getBalance

* **[params](https://github.com/slockit/in3/blob/master/src/types/types.ts#L627)** :`any`[] *(optional)*  - the params
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,latest


## Type RPCResponse


a JSONRPC-Responset with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L636)



* **[error](https://github.com/slockit/in3/blob/master/src/types/types.ts#L649)** :`string` *(optional)*  - in case of an error this needs to be set

* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L645)** :`string`|`number` - the id matching the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L658)** :[`IN3ResponseConfig`](#type-in3responseconfig) *(optional)*  - the IN3-Result

* **[in3Node](https://github.com/slockit/in3/blob/master/src/types/types.ts#L662)** :[`IN3NodeConfig`](#type-in3nodeconfig) *(optional)*  - the node handling this response (internal only)

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L640)** :`'2.0'` - the version

* **[result](https://github.com/slockit/in3/blob/master/src/types/types.ts#L654)** :`any` *(optional)*  - the params
    example: 0xa35bc


## Type ReceiptData


TransactionReceipt as returned by eth_getTransactionReceipt


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L111)



* **[blockHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L114)** :`string` *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L113)** :`string`|`number` *(optional)*  

* **[cumulativeGasUsed](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L117)** :`string`|`number` *(optional)*  

* **[logs](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L119)** :[`LogData`](#type-logdata)[] 

* **[logsBloom](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L118)** :`string` *(optional)*  

* **[root](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L116)** :`string` *(optional)*  

* **[status](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L115)** :`string`|`boolean` *(optional)*  

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L112)** :`number` *(optional)*  


## Type ServerList


a List of nodes


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L667)



* **[contract](https://github.com/slockit/in3/blob/master/src/types/types.ts#L679)** :`string` *(optional)*  - IN3 Registry

* **[lastBlockNumber](https://github.com/slockit/in3/blob/master/src/types/types.ts#L671)** :`number` *(optional)*  - last Block number

* **[nodes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L675)** :[`IN3NodeConfig`](#type-in3nodeconfig)[] - the list of nodes

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L684)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data as part of the in3-section

* **[totalServers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L683)** :`number` *(optional)*  - number of servers


## Type Signature


Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L689)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L694)** :`string` *(optional)*  - the address of the signing node
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L699)** :`number` - the blocknumber
    example: 3123874

* **[blockHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L704)** :`string` - the hash of the block
    example: 0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679

* **[msgHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L709)** :`string` - hash of the message
    example: 0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D

* **[r](https://github.com/slockit/in3/blob/master/src/types/types.ts#L714)** :`string` - Positive non-zero Integer signature.r
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f

* **[s](https://github.com/slockit/in3/blob/master/src/types/types.ts#L719)** :`string` - Positive non-zero Integer signature.s
    example: 0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda

* **[v](https://github.com/slockit/in3/blob/master/src/types/types.ts#L724)** :`number` - Calculated curve point, or identity element O.
    example: 28


## Type TransactionData


Transaction as returned by eth_getTransactionByHash


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L63)



* **[blockHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L65)** :`string` *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L66)** :`number`|`string` *(optional)*  

* **[chainId](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L67)** :`number`|`string` *(optional)*  

* **[condition](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L68)** :`string` *(optional)*  

* **[creates](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L69)** :`string` *(optional)*  

* **[data](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L75)** :`string` *(optional)*  

* **[from](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L70)** :`string` *(optional)*  

* **[gas](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L71)** :`number`|`string` *(optional)*  

* **[gasLimit](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L72)** :`number`|`string` *(optional)*  

* **[gasPrice](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L73)** :`number`|`string` *(optional)*  

* **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L64)** :`string` 

* **[input](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L74)** :`string` 

* **[nonce](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L76)** :`number`|`string` 

* **[publicKey](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L77)** :`string` *(optional)*  

* **[r](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L82)** :`string` *(optional)*  

* **[raw](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L78)** :`string` *(optional)*  

* **[s](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L83)** :`string` *(optional)*  

* **[standardV](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L79)** :`string` *(optional)*  

* **[to](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L80)** :`string` 

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L81)** :`number` 

* **[v](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L84)** :`string` *(optional)*  

* **[value](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L85)** :`number`|`string` 


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

* **[random](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L89)**(count :`number`) :`number`[] 


## Type Block


encodes and decodes the blockheader


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L220)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L241)**(data :[`Buffer`](#type-buffer)|`string`|[`BlockData`](#type-blockdata)) :[`Block`](#type-block) - creates a Block-Onject from either the block-data as returned from rpc, a buffer or a hex-string of the encoded blockheader

* **[raw](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L223)** :[`BlockHeader`](#type-blockheader) - the raw Buffer fields of the BlockHeader

* **[transactions](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L226)** :[`Tx`](#type-tx)[] - the transaction-Object (if given)

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

* **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L259)**() :[`Buffer`](#type-buffer) - the blockhash as buffer

* **[serializeHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L264)**() :[`Buffer`](#type-buffer) - the serialized header as buffer


## Type AccountData


Account-Object


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L89)



* **[balance](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L91)** :`string` 

* **[code](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L94)** :`string` *(optional)*  

* **[codeHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L93)** :`string` 

* **[nonce](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L90)** :`string` 

* **[storageHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L92)** :`string` 


## Type Transaction


Buffer[] of the transaction


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L30)



* **[Transaction](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L30)** :[`Buffer`](#type-buffer)[] - Buffer[] of the transaction


## Type Receipt


Buffer[] of the Receipt


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L36)



* **[Receipt](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L36)** : - Buffer[] of the Receipt


## Type Account


Buffer[] of the Account


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L33)



* **[Account](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L33)** :[`Buffer`](#type-buffer)[] - Buffer[] of the Account


## Type Cache


Source: [client/cache.ts](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L28)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L32)**(client :[`Client`](#type-client)) :[`Cache`](#type-cache) 

* **[blockCache](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L32)** :[] 

* **[client](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L29)** :[`Client`](#type-client) - Client for N3.

* **[codeCache](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L31)** :[`CacheNode`](#type-cachenode) 

* **[addBlockHeader](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L79)**(blockNumber :`number`, header :[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) 

* **[getBlockHeader](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L69)**(blockNumber :`number`) :[`Buffer`](#type-buffer) 

* **[getBlockHeaderByHash](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L74)**(blockHash :[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) 

* **[getCodeFor](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L48)**(addresses :[`Buffer`](#type-buffer)[], block :`string` = "latest") :`Promise<>` 

* **[getLastBlockHashes](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L65)**() :`string`[] 

* **[initCache](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L90)**() :`void` 

* **[updateCache](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L118)**() :`void` 


## Type BlockHeader


Buffer[] of the header


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L27)



* **[BlockHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L27)** :[`Buffer`](#type-buffer)[] - Buffer[] of the header


## Type CacheNode


Source: [client/cache.ts](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L132)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L137)**(limit :`number`) :[`CacheNode`](#type-cachenode) 

* **[data](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L136)** :[`Map<string,CacheEntry>`](#type-map) 

* **[dataLength](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L137)** :`number` 

* **[limit](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L134)** :`number` 

* **[fromStorage](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L189)**(data :`string`) :`void` 

* **[get](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L145)**(key :[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) 

* **[getByteLength](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L174)**(entry :[`Buffer`](#type-buffer)|`string`) :`number` 

* **[put](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L150)**(key :[`Buffer`](#type-buffer), val :[`Buffer`](#type-buffer)) :`void` 

* **[toStorage](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L180)**() :`any` 

