# INCUBED API

This documentation contains a list of all Datastructures and Classes used within the IN3 Client.


* [**AccountProof**](#type-accountproof) : `interface`  - the Proof-for a single Account

* [**BlockData**](#type-blockdata) : `interface` 

* [**IN3Client**](#type-client) : `class`  - Client for N3.

* [**IN3Config**](#type-in3config) : `interface`  - the iguration of the IN3-Client. This can be paritally overriden for every request.

* [**IN3NodeConfig**](#type-in3nodeconfig) : `interface`  - a configuration of a in3-server.

* [**IN3NodeWeight**](#type-in3nodeweight) : `interface`  - a local weight of a n3-node. (This is used internally to weight the requests)

* [**IN3RPCConfig**](#type-in3rpcconfig) : `interface`  - the configuration for the rpc-handler

* [**IN3RPCHandlerConfig**](#type-in3rpchandlerconfig) : `interface`  - the configuration for the rpc-handler

* [**IN3RPCRequestConfig**](#type-in3rpcrequestconfig) : `interface`  - additional config for a IN3 RPC-Request

* [**IN3ResponseConfig**](#type-in3responseconfig) : `interface`  - additional data returned from a IN3 Server

* [**LogData**](#type-logdata) : `interface` 

* [**LogProof**](#type-logproof) : `interface`  - a Object holding proofs for event logs. The key is the blockNumber as hex

* [**Proof**](#type-proof) : `interface`  - the Proof-data as part of the in3-section

* [**RPCRequest**](#type-rpcrequest) : `interface`  - a JSONRPC-Request with N3-Extension

* [**RPCResponse**](#type-rpcresponse) : `interface`  - a JSONRPC-Responset with N3-Extension

* [**ReceiptData**](#type-receiptdata) : `interface` 

* [**ServerList**](#type-serverlist) : `interface`  - a List of nodes

* [**Signature**](#type-signature) : `interface`  - Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.

* [**TransactionData**](#type-transactiondata) : `interface` 

* [**Transport**](#type-transport) : `interface` 

* [**AxiosTransport**](#type-axiostransport) : `class` 

* **[cbor](https://github.com/slockit/in3/blob/master/src/index.ts#L11)**

    * **[createRefs](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L64)**(val :[`T`](#type-t), cache :`string`[] =  []) :[`T`](#type-t) 

    * **[decodeRequests](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L8)**(request :[`Buffer`](#type-buffer)) :[`RPCRequest`](#type-rpcrequest)[] 

    * **[decodeResponses](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L22)**(responses :[`Buffer`](#type-buffer)) :[`RPCResponse`](#type-rpcresponse)[] 

    * **[encodeRequests](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L4)**(requests :[`RPCRequest`](#type-rpcrequest)[]) :[`Buffer`](#type-buffer) 

    * **[encodeResponses](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L19)**(responses :[`RPCResponse`](#type-rpcresponse)[]) :[`Buffer`](#type-buffer) 

    * **[resolveRefs](https://github.com/slockit/in3/blob/master/src/util/cbor.ts#L85)**(val :[`T`](#type-t), cache :`string`[] =  []) :[`T`](#type-t) 

* **[chainData](https://github.com/slockit/in3/blob/master/src/index.ts#L24)**

    * **[callContract](https://github.com/slockit/in3/blob/master/src/client/chainData.ts#L7)**(client :[`Client`](#type-client), contract :`string`, chainId :`string`, signature :`string`, args :`any`[], config :[`IN3Config`](#type-in3config)) :`Promise<any>` 

    * **[getChainData](https://github.com/slockit/in3/blob/master/src/client/chainData.ts#L16)**(client :[`Client`](#type-client), chainId :`string`, config :[`IN3Config`](#type-in3config)) :`Promise<>` 

* **[createRandomIndexes](https://github.com/slockit/in3/blob/master/src/client/serverList.ts#L13)**(len :`number`, limit :`number`, seed :[`Buffer`](#type-buffer), result :`number`[] =  []) :`number`[] 

* **[serialize](https://github.com/slockit/in3/blob/master/src/index.ts#L14)**

    * [**Block**](#type-block) :`class` - encodes and decodes the blockheader

    * [**AccountData**](#type-accountdata) :`interface`

    * [**BlockData**](#type-blockdata) :`interface`

    * [**LogData**](#type-logdata) :`interface`

    * [**ReceiptData**](#type-receiptdata) :`interface`

    * [**TransactionData**](#type-transactiondata) :`interface`

    * **[Account](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L13)** :[`Buffer`](#type-buffer)[] - Buffer[] of the Account

    * **[BlockHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L7)** :[`Buffer`](#type-buffer)[] - Buffer[] of the header

    * **[Receipt](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L16)** : - Buffer[] of the Receipt

    * **[Transaction](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L10)** :[`Buffer`](#type-buffer)[] - Buffer[] of the transaction

    * **[address](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L115)**(val :`any`) :[`Buffer`](#type-buffer) - converts it to a Buffer with 20 bytes length

    * **[blockFromHex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L278)**(hex :`string`) :[`Block`](#type-block) - converts a hexstring to a block-object

    * **[blockToHex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L273)**(block :`any`) :`string` - converts blockdata to a hexstring

    * **[bytes](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L113)**(val :`any`) :[`Buffer`](#type-buffer) - converts it to a Buffer

    * **[bytes256](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L107)**(val :`any`) :[`Buffer`](#type-buffer) - converts it to a Buffer with 256 bytes length

    * **[bytes32](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L109)**(val :`any`) :[`Buffer`](#type-buffer) - converts it to a Buffer with 32 bytes length

    * **[bytes8](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L111)**(val :`any`) :[`Buffer`](#type-buffer) - converts it to a Buffer with 8 bytes length

    * **[createTx](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L245)**(transaction :`any`) :`any` - creates a Transaction-object from the rpc-transaction-data

    * **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L101)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)|[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) - returns the hash of the object

    * **[serialize](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L98)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)) :[`Buffer`](#type-buffer) - serialize the data

    * **[toAccount](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L159)**(account :[`AccountData`](#type-accountdata)) :[`Buffer`](#type-buffer)[] 

    * **[toBlockHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L120)**(block :[`BlockData`](#type-blockdata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[toReceipt](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L169)**(r :[`ReceiptData`](#type-receiptdata)) :`Object` - create a Buffer[] from RPC-Response

    * **[toTransaction](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L145)**(tx :[`TransactionData`](#type-transactiondata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[uint](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L117)**(val :`any`) :[`Buffer`](#type-buffer) - converts it to a Buffer with a variable length. 0 = length 0

* **[storage](https://github.com/slockit/in3/blob/master/src/index.ts#L17)**

    * **[getStorageArrayKey](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L6)**(pos :`number`, arrayIndex :`number`, structSize :`number` = 1, structPos :`number` = 0) :[`Buffer`](#type-buffer) 

    * **[getStorageMapKey](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L12)**(pos :`number`, key :`string`, structPos :`number` = 0) :[`Buffer`](#type-buffer) 

    * **[getStorageValue](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L37)**(rpc :`string`, contract :`string`, pos :`number`, type :`'address'`|`'bytes32'`|`'bytes16'`|`'bytes4'`|`'int'`|`'string'`, keyOrIndex :`number`|`string`, structSize :`number`, structPos :`number`) :`Promise<any>` 

    * **[getStringValue](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L16)**(data :[`Buffer`](#type-buffer), storageKey :[`Buffer`](#type-buffer)) :`string`| 

    * **[getStringValueFromList](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L30)**(values :[`Buffer`](#type-buffer)[], len :`number`) :`string` 

    * **[toBN](https://github.com/slockit/in3/blob/master/src/util/storage.ts#L35)**(val :`any`) :`any` 

* **[transport](https://github.com/slockit/in3/blob/master/src/index.ts#L20)**

    * [**AxiosTransport**](#type-axiostransport) :`class`

    * [**Transport**](#type-transport) :`interface`

* **[util](https://github.com/slockit/in3/blob/master/src/index.ts#L6)**

    * **[checkForError](https://github.com/slockit/in3/blob/master/src/util/util.ts#L22)**(res :[`T`](#type-t)) :[`T`](#type-t) 

    * **[getAddress](https://github.com/slockit/in3/blob/master/src/util/util.ts#L109)**(pk :`string`) :`any` - returns a address from a private key

    * **[promisify](https://github.com/slockit/in3/blob/master/src/util/util.ts#L10)**(self :`any`, fn :`any`, args :`any`[]) :`Promise<any>` 

    * **[toBN](https://github.com/slockit/in3/blob/master/src/util/util.ts#L28)**(val :`any`) :`any` 

    * **[toBuffer](https://github.com/slockit/in3/blob/master/src/util/util.ts#L75)**(val :`any`, len :`number` =  -1) :[`Buffer`](#type-buffer) - converts any value as Buffer
         if len === 0 it will return an empty Buffer if the value is 0 or '0x00', since this is the way rlpencode works wit 0-values.

    * **[toHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L36)**(val :`any`, bytes :`number`) :`string` - converts any value as hex-string

    * **[toMinHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L115)**(key :`string`|[`Buffer`](#type-buffer)|`number`) :`string` - removes all leading 0 in the hexstring

    * **[toNumber](https://github.com/slockit/in3/blob/master/src/util/util.ts#L54)**(val :`any`) :`number` 

    * **[toSimpleHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L100)**(val :`string`) :`string` 


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


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L18)



* **[coinbase](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L23)** :`string` *(optional)*  

* **[difficulty](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L29)** :`string`|`number` 

* **[extraData](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L34)** :`string` 

* **[gasLimit](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L31)** :`string`|`number` 

* **[gasUsed](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L32)** :`string`|`number` 

* **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L19)** :`string` 

* **[logsBloom](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L28)** :`string` 

* **[miner](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L22)** :`string` 

* **[mixHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L36)** :`string` *(optional)*  

* **[nonce](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L37)** :`string`|`number` *(optional)*  

* **[number](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L30)** :`string`|`number` 

* **[parentHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L20)** :`string` 

* **[receiptRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L27)** :`string` *(optional)*  

* **[receiptsRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L26)** :`string` 

* **[sealFields](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L35)** :`string`[] *(optional)*  

* **[sha3Uncles](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L21)** :`string` 

* **[stateRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L24)** :`string` 

* **[timestamp](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L33)** :`string`|`number` 

* **[transactions](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L38)** :`any`[] *(optional)*  

* **[transactionsRoot](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L25)** :`string` 


## Type Client


Client for N3.


Source: [client/Client.ts](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L18)



* **[defaultMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1012)** :`number` 

* `static` **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1011)**(emitter :[`EventEmitter`](#type-eventemitter), event :`string`|`symbol`) :`number` 

* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L23)**(config :[`Partial<IN3Config>`](#type-partial), transport :[`Transport`](#type-transport)) :[`Client`](#type-client) - creates a new Client.

* **[cache](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L23)** :[`Cache`](#type-cache) 

* **[defConfig](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L20)** :[`IN3Config`](#type-in3config) - the iguration of the IN3-Client. This can be paritally overriden for every request.

* **[addListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1014)**(event :`string`|`symbol`, listener :) :`this` 

* **[call](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L145)**(method :`string`, params :`any`, chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :`Promise<any>` - sends a simply RPC-Request

* **[clearStats](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L168)**() :`void` - clears all stats and weights, like blocklisted nodes

* **[emit](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1026)**(event :`string`|`symbol`, args :`any`[]) :`boolean` 

* **[eventNames](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1027)**() :[`Array<>`](#type-array) 

* **[getMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1023)**() :`number` 

* **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1028)**(type :`string`|`symbol`) :`number` 

* **[listeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1024)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[off](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1020)**(event :`string`|`symbol`, listener :) :`this` 

* **[on](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1015)**(event :`string`|`symbol`, listener :) :`this` 

* **[once](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1016)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1017)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependOnceListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1018)**(event :`string`|`symbol`, listener :) :`this` 

* **[rawListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1025)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[removeAllListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1021)**(event :`string`|`symbol`) :`this` 

* **[removeListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1019)**(event :`string`|`symbol`, listener :) :`this` 

* **[send](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L157)**(request :[`RPCRequest`](#type-rpcrequest)[]|[`RPCRequest`](#type-rpcrequest), callback :, config :[`Partial<IN3Config>`](#type-partial)) :`void`|`Promise<>` - sends one or a multiple requests.
    if the request is a array the response will be a array as well.
    If the callback is given it will be called with the response, if not a Promise will be returned.
    This function supports callback so it can be used as a Provider for the web3.

* **[sendRPC](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L134)**(method :`string`, params :`any`[] =  [], chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :[`Promise<RPCResponse>`](#type-rpcresponse) - sends a simply RPC-Request

* **[setMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/slock/n3/n3-ts/node_modules/@types/node/index.d.ts#L1022)**(n :`number`) :`this` 

* **[updateNodeList](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L68)**(chainId :`string`, conf :[`Partial<IN3Config>`](#type-partial), retryCount :`number` = 5) :`Promise<void>` - fetches the nodeList from the servers.


## Type IN3Config


the iguration of the IN3-Client. This can be paritally overriden for every request.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L56)



* **[autoUpdateList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L134)** :`boolean` *(optional)*  - if true the nodelist will be automaticly updated if the lastBlock is newer
    example: true

* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L119)** :`string` - servers to filter for the given chain. The chain-id based on EIP-155.
    example: 0x1

* **[chainRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L124)** :`string` *(optional)*  - main chain-registry contract
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945

* **[format](https://github.com/slockit/in3/blob/master/src/types/types.ts#L70)** :`'json'`|`'cbor'` *(optional)*  - the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding
    example: json

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L75)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[keepIn3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L65)** :`boolean` *(optional)*  - if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.

* **[mainChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L129)** :`string` *(optional)*  - main chain-id, where the chain registry is running.
    example: 0x1

* **[maxBlockCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L85)** :`number` *(optional)*  - number of number of blocks cached  in memory
    example: 100

* **[maxCodeCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L80)** :`number` *(optional)*  - number of max bytes used to cache the code in memory
    example: 100000

* **[minDeposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L99)** :`number` - min stake of the server. Only nodes owning at least this amount will be chosen.

* **[nodeLimit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L61)** :`number` *(optional)*  - the limit of nodes to store in the client.
    example: 150

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L90)** :`boolean` *(optional)*  - if true the nodes should send a proof of the response
    example: true

* **[replaceLatestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L104)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[requestCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L109)** :`number` - the number of request send when getting a first answer
    example: 3

* **[servers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L138)** *(optional)*  - the nodelist per chain

* **[signatureCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L95)** :`number` *(optional)*  - number of signatures requested
    example: 2

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L114)** :`number` *(optional)*  - specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.
    example: 3000


## Type IN3NodeConfig


a configuration of a in3-server.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L181)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L191)** :`string` - the address of the node, which is the public address it iis signing with.
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[chainIds](https://github.com/slockit/in3/blob/master/src/types/types.ts#L201)** :`string`[] - the list of supported chains
    example: 0x1

* **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L206)** :`number` - the deposit of the node in wei
    example: 12350000

* **[index](https://github.com/slockit/in3/blob/master/src/types/types.ts#L186)** :`number` *(optional)*  - the index within the contract
    example: 13

* **[props](https://github.com/slockit/in3/blob/master/src/types/types.ts#L211)** :`number` *(optional)*  - the properties of the node.
    example: 3

* **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L196)** :`string` - the endpoint to post to
    example: https://in3.slock.it


## Type IN3NodeWeight


a local weight of a n3-node. (This is used internally to weight the requests)


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L216)



* **[avgResponseTime](https://github.com/slockit/in3/blob/master/src/types/types.ts#L231)** :`number` *(optional)*  - average time of a response in ms
    example: 240

* **[blacklistedUntil](https://github.com/slockit/in3/blob/master/src/types/types.ts#L245)** :`number` *(optional)*  - blacklisted because of failed requests until the timestamp
    example: 1529074639623

* **[lastRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L240)** :`number` *(optional)*  - timestamp of the last request in ms
    example: 1529074632623

* **[pricePerRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L235)** :`number` *(optional)*  - last price

* **[responseCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L226)** :`number` *(optional)*  - number of uses.
    example: 147

* **[weight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L221)** :`number` *(optional)*  - factor the weight this noe (default 1.0)
    example: 0.5


## Type IN3RPCConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L250)



* **[chains](https://github.com/slockit/in3/blob/master/src/types/types.ts#L279)** *(optional)*  - a definition of the Handler per chain

* **[defaultChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L254)** :`string` *(optional)*  - the default chainId in case the request does not contain one.

* **[logging](https://github.com/slockit/in3/blob/master/src/types/types.ts#L262)** *(optional)*  - logger config

    * **[colors](https://github.com/slockit/in3/blob/master/src/types/types.ts#L274)** :`boolean` *(optional)*  - if true colors will be used

    * **[file](https://github.com/slockit/in3/blob/master/src/types/types.ts#L266)** :`string` *(optional)*  - the path to the logile

    * **[level](https://github.com/slockit/in3/blob/master/src/types/types.ts#L270)** :`string` *(optional)*  - Loglevel

* **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L258)** :`number` *(optional)*  - the listeneing port for the server


## Type IN3RPCHandlerConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L286)



* **[autoRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L323)** *(optional)* 

    * **[capabilities](https://github.com/slockit/in3/blob/master/src/types/types.ts#L336)** *(optional)* 

        * **[multiChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L344)** :`boolean` *(optional)*  - if true, this node is able to deliver multiple chains

        * **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L340)** :`boolean` *(optional)*  - if true, this node is able to deliver proofs

    * **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L331)** :`number` - the deposit you want ot store

    * **[depositUnit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L335)** :`'ether'`|`'finney'`|`'szabo'`|`'wei'` *(optional)*  - unit of the deposit value

    * **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L327)** :`string` - the public url to reach this node

* **[handler](https://github.com/slockit/in3/blob/master/src/types/types.ts#L290)** :`'eth'`|`'ipfs'`|`'btc'` *(optional)*  - the impl used to handle the calls

* **[minBlockHeight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L298)** :`number` *(optional)*  - the minimal blockheight in order to sign

* **[persistentFile](https://github.com/slockit/in3/blob/master/src/types/types.ts#L302)** :`string` *(optional)*  - the filename of the file keeping track of the last handled blocknumber

* **[privateKey](https://github.com/slockit/in3/blob/master/src/types/types.ts#L310)** :`string` - the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.

* **[privateKeyPassphrase](https://github.com/slockit/in3/blob/master/src/types/types.ts#L314)** :`string` *(optional)*  - the password used to decrpyt the private key

* **[registry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L318)** :`string` - the address of the server registry used in order to update the nodeList

* **[registryRPC](https://github.com/slockit/in3/blob/master/src/types/types.ts#L322)** :`string` *(optional)*  - the url of the client in case the registry is not on the same chain.

* **[rpcUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L294)** :`string` - the url of the client

* **[watchInterval](https://github.com/slockit/in3/blob/master/src/types/types.ts#L306)** :`number` *(optional)*  - the number of seconds of the interval for checking for new events


## Type IN3RPCRequestConfig


additional config for a IN3 RPC-Request


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L351)



* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L356)** :`string` - the requested chainId
    example: 0x1

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L361)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[latestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L366)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L376)** :`string`[] *(optional)*  - a list of addresses requested to sign the blockhash
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[verification](https://github.com/slockit/in3/blob/master/src/types/types.ts#L371)** :`'never'`|`'proof'`|`'proofWithSignature'` *(optional)*  - defines the kind of proof the client is asking for
    example: proof


## Type IN3ResponseConfig


additional data returned from a IN3 Server


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L381)



* **[lastNodeList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L390)** :`number` *(optional)*  - the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.
    example: 326478

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L385)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data


## Type LogData


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L73)



* **[address](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L80)** :`string` 

* **[blockHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L78)** :`string` 

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L79)** :`string` 

* **[data](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L81)** :`string` 

* **[logIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L75)** :`string` 

* **[removed](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L74)** :`boolean` 

* **[topics](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L82)** :`string`[] 

* **[transactionHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L77)** :`string` 

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L76)** :`string` 


## Type LogProof


a Object holding proofs for event logs. The key is the blockNumber as hex


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L395)




## Type Proof


the Proof-data as part of the in3-section


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L430)



* **[accounts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L461)** *(optional)*  - a map of addresses and their AccountProof

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L440)** :`string` *(optional)*  - the serialized blockheader as hex, required in most proofs
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[logProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L457)** :[`LogProof`](#type-logproof) *(optional)*  - the Log Proof in case of a Log-Request

* **[merkleProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L449)** :`string`[] *(optional)*  - the serialized merle-noodes beginning with the root-node

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L472)** :[`Signature`](#type-signature)[] *(optional)*  - requested signatures

* **[transactions](https://github.com/slockit/in3/blob/master/src/types/types.ts#L445)** :`any`[] *(optional)*  - the list of transactions of the block
    example:

* **[txIndex](https://github.com/slockit/in3/blob/master/src/types/types.ts#L468)** :`number` *(optional)*  - the transactionIndex within the block
    example: 4

* **[txProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L453)** :`string`[] *(optional)*  - the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex

* **[type](https://github.com/slockit/in3/blob/master/src/types/types.ts#L435)** :`'transactionProof'`|`'receiptProof'`|`'blockProof'`|`'accountProof'`|`'callProof'`|`'logProof'` - the type of the proof
    example: accountProof


## Type RPCRequest


a JSONRPC-Request with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L477)



* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L491)** :`number`|`string` *(optional)*  - the identifier of the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L500)** :[`IN3RPCRequestConfig`](#type-in3rpcrequestconfig) *(optional)*  - the IN3-Config

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L481)** :`'2.0'` - the version

* **[method](https://github.com/slockit/in3/blob/master/src/types/types.ts#L486)** :`string` - the method to call
    example: eth_getBalance

* **[params](https://github.com/slockit/in3/blob/master/src/types/types.ts#L496)** :`any`[] *(optional)*  - the params
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,latest


## Type RPCResponse


a JSONRPC-Responset with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L505)



* **[error](https://github.com/slockit/in3/blob/master/src/types/types.ts#L518)** :`string` *(optional)*  - in case of an error this needs to be set

* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L514)** :`string`|`number` - the id matching the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L527)** :[`IN3ResponseConfig`](#type-in3responseconfig) *(optional)*  - the IN3-Result

* **[in3Node](https://github.com/slockit/in3/blob/master/src/types/types.ts#L531)** :[`IN3NodeConfig`](#type-in3nodeconfig) *(optional)*  - the node handling this response (internal only)

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L509)** :`'2.0'` - the version

* **[result](https://github.com/slockit/in3/blob/master/src/types/types.ts#L523)** :`any` *(optional)*  - the params
    example: 0xa35bc


## Type ReceiptData


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L85)



* **[blockHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L88)** :`string` *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L87)** :`string`|`number` *(optional)*  

* **[cumulativeGasUsed](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L91)** :`string`|`number` *(optional)*  

* **[logs](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L93)** :[`LogData`](#type-logdata)[] 

* **[logsBloom](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L92)** :`string` *(optional)*  

* **[root](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L90)** :`string` *(optional)*  

* **[status](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L89)** :`string`|`boolean` *(optional)*  

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L86)** :`number` *(optional)*  


## Type ServerList


a List of nodes


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L536)



* **[contract](https://github.com/slockit/in3/blob/master/src/types/types.ts#L548)** :`string` *(optional)*  - IN3 Registry

* **[lastBlockNumber](https://github.com/slockit/in3/blob/master/src/types/types.ts#L540)** :`number` *(optional)*  - last Block number

* **[nodes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L544)** :[`IN3NodeConfig`](#type-in3nodeconfig)[] - the list of nodes

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L553)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data as part of the in3-section

* **[totalServers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L552)** :`number` *(optional)*  - number of servers


## Type Signature


Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L558)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L563)** :`string` *(optional)*  - the address of the signing node
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L568)** :`number` - the blocknumber
    example: 3123874

* **[blockHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L573)** :`string` - the hash of the block
    example: 0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679

* **[msgHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L578)** :`string` - hash of the message
    example: 0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D

* **[r](https://github.com/slockit/in3/blob/master/src/types/types.ts#L583)** :`string` - Positive non-zero Integer signature.r
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f

* **[s](https://github.com/slockit/in3/blob/master/src/types/types.ts#L588)** :`string` - Positive non-zero Integer signature.s
    example: 0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda

* **[v](https://github.com/slockit/in3/blob/master/src/types/types.ts#L593)** :`number` - Calculated curve point, or identity element O.
    example: 28


## Type TransactionData


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L40)



* **[blockHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L42)** :`string` *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L43)** :`number`|`string` *(optional)*  

* **[chainId](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L44)** :`number`|`string` *(optional)*  

* **[condition](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L45)** :`string` *(optional)*  

* **[creates](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L46)** :`string` *(optional)*  

* **[data](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L52)** :`string` *(optional)*  

* **[from](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L47)** :`string` *(optional)*  

* **[gas](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L48)** :`number`|`string` *(optional)*  

* **[gasLimit](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L49)** :`number`|`string` *(optional)*  

* **[gasPrice](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L50)** :`number`|`string` *(optional)*  

* **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L41)** :`string` 

* **[input](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L51)** :`string` 

* **[nonce](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L53)** :`number`|`string` 

* **[publicKey](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L54)** :`string` *(optional)*  

* **[r](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L59)** :`string` *(optional)*  

* **[raw](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L55)** :`string` *(optional)*  

* **[s](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L60)** :`string` *(optional)*  

* **[standardV](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L56)** :`string` *(optional)*  

* **[to](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L57)** :`string` 

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L58)** :`number` 

* **[v](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L61)** :`string` *(optional)*  

* **[value](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L62)** :`number`|`string` 


## Type Transport


Source: [util/transport.ts](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L5)



* **[handle](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L6)**(url :`string`, data :[`RPCRequest`](#type-rpcrequest)|[`RPCRequest`](#type-rpcrequest)[], timeout :`number`) :`Promise<>` 

* **[random](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L8)**(count :`number`) :`number`[] 


## Type AxiosTransport


Source: [util/transport.ts](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L13)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L15)**(format :`'json'`|`'cbor'` = "json") :[`AxiosTransport`](#type-axiostransport) 

* **[format](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L15)** :`'json'`|`'cbor'` 

* **[handle](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L21)**(url :`string`, data :[`RPCRequest`](#type-rpcrequest)|[`RPCRequest`](#type-rpcrequest)[], timeout :`number`) :`Promise<>` 

* **[random](https://github.com/slockit/in3/blob/master/src/util/transport.ts#L49)**(count :`number`) :`number`[] 


## Type Block


encodes and decodes the blockheader


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L194)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L215)**(data :[`Buffer`](#type-buffer)|`string`|[`BlockData`](#type-blockdata)) :[`Block`](#type-block) - creates a Block-Onject from either the block-data as returned from rpc, a buffer or a hex-string of the encoded blockheader

* **[raw](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L197)** :[`BlockHeader`](#type-blockheader) - the raw Buffer fields of the BlockHeader

* **[transactions](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L200)** :[`Tx`](#type-tx)[] - the transaction-Object (if given)

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

* **[hash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L233)**() :[`Buffer`](#type-buffer) - the blockhash as buffer

* **[serializeHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L238)**() :[`Buffer`](#type-buffer) - the serialized header as buffer


## Type AccountData


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L65)



* **[balance](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L67)** :`string` 

* **[code](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L70)** :`string` *(optional)*  

* **[codeHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L69)** :`string` 

* **[nonce](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L66)** :`string` 

* **[storageHash](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L68)** :`string` 


## Type Transaction


Buffer[] of the transaction


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L10)



* **[Transaction](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L10)** :[`Buffer`](#type-buffer)[] - Buffer[] of the transaction


## Type Receipt


Buffer[] of the Receipt


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L16)



* **[Receipt](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L16)** : - Buffer[] of the Receipt


## Type Account


Buffer[] of the Account


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L13)



* **[Account](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L13)** :[`Buffer`](#type-buffer)[] - Buffer[] of the Account


## Type Cache


Source: [client/cache.ts](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L5)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L9)**(client :[`Client`](#type-client)) :[`Cache`](#type-cache) 

* **[blockCache](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L9)** :[] 

* **[client](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L6)** :[`Client`](#type-client) - Client for N3.

* **[codeCache](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L8)** :[`CacheNode<Buffer>`](#type-cachenode) 

* **[addBlockHeader](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L39)**(blockNumber :`number`, header :[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) 

* **[getBlockHeader](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L34)**(blockNumber :`number`) :[`Buffer`](#type-buffer) 

* **[getCodeFor](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L17)**(addresses :[`Buffer`](#type-buffer)[], block :`string` = "latest") :`Promise<>` 

* **[getLastBlockWithHash](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L30)**() :`number` 


## Type BlockHeader


Buffer[] of the header


Source: [util/serialize.ts](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L7)



* **[BlockHeader](https://github.com/slockit/in3/blob/master/src/util/serialize.ts#L7)** :[`Buffer`](#type-buffer)[] - Buffer[] of the header


## Type CacheNode


Source: [client/cache.ts](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L57)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L62)**(limit :`number`) :[`CacheNode`](#type-cachenode) 

* **[data](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L61)** :[`Map<Buffer,CacheEntry>`](#type-map) 

* **[dataLength](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L62)** :`number` 

* **[limit](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L59)** :`number` 

* **[get](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L69)**(key :[`Buffer`](#type-buffer)) :[`T`](#type-t) 

* **[getByteLength](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L98)**(entry :[`T`](#type-t)) :`number` 

* **[put](https://github.com/slockit/in3/blob/master/src/client/cache.ts#L74)**(key :[`Buffer`](#type-buffer), val :[`T`](#type-t)) :`void` 

