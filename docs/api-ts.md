# API Reference TS

This page contains a list of all Datastructures and Classes used within the TypeScript IN3 Client.


* [**AccountProof**](#type-accountproof) : `interface`  - the Proof-for a single Account

* [**AuraValidatoryProof**](#type-auravalidatoryproof) : `interface`  - a Object holding proofs for validator logs. The key is the blockNumber as hex

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

* **[chainAliases](https://github.com/slockit/in3/blob/master/src/index.ts#L82)**

    * **[goerli](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L698)** :`string` 

    * **[ipfs](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L698)** :`string` 

    * **[kovan](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L698)** :`string` 

    * **[main](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L698)** :`string` 

    * **[mainnet](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L698)** :`string` 

    * **[tobalaba](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L698)** :`string` 

* **[chainData](https://github.com/slockit/in3/blob/master/src/index.ts#L49)**

    * **[callContract](https://github.com/slockit/in3/blob/master/src/modules/eth/chainData.ts#L27)**(client :[`Client`](#type-client), contract :`string`, chainId :`string`, signature :`string`, args :`any`[], config :[`IN3Config`](#type-in3config)) :`Promise<any>` 

    * **[getChainData](https://github.com/slockit/in3/blob/master/src/modules/eth/chainData.ts#L36)**(client :[`Client`](#type-client), chainId :`string`, config :[`IN3Config`](#type-in3config)) :`Promise<>` 

* **[createRandomIndexes](https://github.com/slockit/in3/blob/master/src/client/serverList.ts#L32)**(len :`number`, limit :`number`, seed :[`Buffer`](#type-buffer), result :`number`[] =  []) :`number`[] 

* [**eth**](#type-api) : `class` 

* **[header](https://github.com/slockit/in3/blob/master/src/index.ts#L39)**

    * [**AuthSpec**](#type-authspec) :`interface` - Authority specification for proof of authority chains

    * **[checkBlockSignatures](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L27)**(blockHeaders :`string`|[`Buffer`](#type-buffer)|[`Block`](#type-block)|[`BlockData`](#type-blockdata)[], getChainSpec :) :`Promise<number>` - verify a Blockheader and returns the percentage of finality

    * **[getChainSpec](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L211)**(b :[`Block`](#type-block), ctx :[`ChainContext`](#type-chaincontext)) :[`Promise<AuthSpec>`](#type-authspec) 

    * **[getSigner](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L76)**(data :[`Block`](#type-block)) :[`Buffer`](#type-buffer) 

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

    * **[rlp](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L25)** - RLP-functions

    * **[address](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L145)**(val :`any`) :`any` - converts it to a Buffer with 20 bytes length

    * **[blockFromHex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L313)**(hex :`string`) :[`Block`](#type-block) - converts a hexstring to a block-object

    * **[blockToHex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L308)**(block :`any`) :`string` - converts blockdata to a hexstring

    * **[bytes](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L143)**(val :`any`) :`any` - converts it to a Buffer

    * **[bytes256](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L137)**(val :`any`) :`any` - converts it to a Buffer with 256 bytes length

    * **[bytes32](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L139)**(val :`any`) :`any` - converts it to a Buffer with 32 bytes length

    * **[bytes8](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L141)**(val :`any`) :`any` - converts it to a Buffer with 8 bytes length

    * **[createTx](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L280)**(transaction :`any`) :`any` - creates a Transaction-object from the rpc-transaction-data

    * **[hash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L131)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)|[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) - returns the hash of the object

    * **[serialize](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L128)**(val :[`Block`](#type-block)|[`Transaction`](#type-transaction)|[`Receipt`](#type-receipt)|[`Account`](#type-account)) :[`Buffer`](#type-buffer) - serialize the data

    * **[toAccount](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L191)**(account :[`AccountData`](#type-accountdata)) :[`Buffer`](#type-buffer)[] 

    * **[toBlockHeader](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L152)**(block :[`BlockData`](#type-blockdata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[toReceipt](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L200)**(r :[`ReceiptData`](#type-receiptdata)) :`Object` - create a Buffer[] from RPC-Response

    * **[toTransaction](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L177)**(tx :[`TransactionData`](#type-transactiondata)) :[`Buffer`](#type-buffer)[] - create a Buffer[] from RPC-Response

    * **[uint](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L147)**(val :`any`) :`any` - converts it to a Buffer with a variable length. 0 = length 0

    * **[uint64](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L149)**(val :`any`) :`any` 

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

* **[typeDefs](https://github.com/slockit/in3/blob/master/src/index.ts#L80)**

    * **[AccountProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[AuraValidatoryProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[ChainSpec](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[IN3Config](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[IN3NodeConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[IN3NodeWeight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[IN3RPCConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[IN3RPCHandlerConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[IN3RPCRequestConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[IN3ResponseConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[LogProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[Proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[RPCRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[RPCResponse](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[ServerList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


    * **[Signature](https://github.com/slockit/in3/blob/master/src/types/types.ts#L860)** : `Object`  


* **[util](https://github.com/slockit/in3/blob/master/src/index.ts#L28)**

    * **[checkForError](https://github.com/slockit/in3/blob/master/src/util/util.ts#L58)**(res :[`T`](#type-t)) :[`T`](#type-t) - check a RPC-Response for errors and rejects the promise if found

    * **[getAddress](https://github.com/slockit/in3/blob/master/src/util/util.ts#L162)**(pk :`string`) :`string` - returns a address from a private key

    * **[padEnd](https://github.com/slockit/in3/blob/master/src/util/util.ts#L195)**(val :`string`, minLength :`number`, fill :`string` = " ") :`string` - padEnd for legacy

    * **[padStart](https://github.com/slockit/in3/blob/master/src/util/util.ts#L188)**(val :`string`, minLength :`number`, fill :`string` = " ") :`string` - padStart for legacy

    * **[promisify](https://github.com/slockit/in3/blob/master/src/util/util.ts#L36)**(self :`any`, fn :`any`, args :`any`[]) :`Promise<any>` - simple promisy-function

    * **[toBN](https://github.com/slockit/in3/blob/master/src/util/util.ts#L67)**(val :`any`) :`any` - convert to BigNumber

    * **[toBuffer](https://github.com/slockit/in3/blob/master/src/util/util.ts#L119)**(val :`any`, len :`number` =  -1) :`any` - converts any value as Buffer
         if len === 0 it will return an empty Buffer if the value is 0 or '0x00', since this is the way rlpencode works wit 0-values.

    * **[toHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L77)**(val :`any`, bytes :`number`) :`string` - converts any value as hex-string

    * **[toMinHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L168)**(key :`string`|[`Buffer`](#type-buffer)|`number`) :`string` - removes all leading 0 in the hexstring

    * **[toNumber](https://github.com/slockit/in3/blob/master/src/util/util.ts#L98)**(val :`any`) :`number` - converts to a js-number

    * **[toSimpleHex](https://github.com/slockit/in3/blob/master/src/util/util.ts#L151)**(val :`string`) :`string` - removes all leading 0 in a hex-string

    * **[toUtf8](https://github.com/slockit/in3/blob/master/src/util/util.ts#L47)**(val :`any`) :`string` 

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


## Type AuraValidatoryProof


a Object holding proofs for validator logs. The key is the blockNumber as hex


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L56)



* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L65)** :`string` - the serialized blockheader
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[finalityBlocks](https://github.com/slockit/in3/blob/master/src/types/types.ts#L78)** :`any`[] *(optional)*  - the serialized blockheader as hex, required in case of finality asked
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[logIndex](https://github.com/slockit/in3/blob/master/src/types/types.ts#L60)** :`number` - the transaction log index

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L73)** :`string`[] - the merkleProof

* **[txIndex](https://github.com/slockit/in3/blob/master/src/types/types.ts#L69)** :`number` - the transactionIndex within the block


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


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L83)



* **[engine](https://github.com/slockit/in3/blob/master/src/types/types.ts#L87)** :`string` *(optional)*  - the engine type (like Ethhash, authorityRound, ... )

* **[validatorContract](https://github.com/slockit/in3/blob/master/src/types/types.ts#L91)** :`string` *(optional)*  - the aura contract to get the validators

* **[validatorList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L95)** :`any`[] *(optional)*  - the list of validators


## Type Client


Client for N3.


Source: [client/Client.ts](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L54)



* **[defaultMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L9)** :`number` 

* `static` **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L8)**(emitter :[`EventEmitter`](#type-eventemitter), event :`string`|`symbol`) :`number` 

* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L63)**(config :[`Partial<IN3Config>`](#type-partial) =  {}, transport :[`Transport`](#type-transport)) :[`Client`](#type-client) - creates a new Client.

* **[defConfig](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L61)** :[`IN3Config`](#type-in3config) - the iguration of the IN3-Client. This can be paritally overriden for every request.

* **[eth](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L57)** :[`EthAPI`](#type-ethapi) 

* **[ipfs](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L58)** :[`IpfsAPI`](#type-ipfsapi) 

*  **config()** 

* **[addListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L11)**(event :`string`|`symbol`, listener :) :`this` 

* **[call](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L217)**(method :`string`, params :`any`, chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :`Promise<any>` - sends a simply RPC-Request

* **[clearStats](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L249)**() :`void` - clears all stats and weights, like blocklisted nodes

* **[createWeb3Provider](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L110)**() :`any` 

* **[emit](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L23)**(event :`string`|`symbol`, args :`any`[]) :`boolean` 

* **[eventNames](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L24)**() :[`Array<>`](#type-array) 

* **[getChainContext](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L117)**(chainId :`string`) :[`ChainContext`](#type-chaincontext) 

* **[getMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L20)**() :`number` 

* **[listenerCount](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L25)**(type :`string`|`symbol`) :`number` 

* **[listeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L21)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[off](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L17)**(event :`string`|`symbol`, listener :) :`this` 

* **[on](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L12)**(event :`string`|`symbol`, listener :) :`this` 

* **[once](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L13)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L14)**(event :`string`|`symbol`, listener :) :`this` 

* **[prependOnceListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L15)**(event :`string`|`symbol`, listener :) :`this` 

* **[rawListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L22)**(event :`string`|`symbol`) :[`Function`](#type-function)[] 

* **[removeAllListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L18)**(event :`string`|`symbol`) :`this` 

* **[removeListener](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L16)**(event :`string`|`symbol`, listener :) :`this` 

* **[send](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L229)**(request :[`RPCRequest`](#type-rpcrequest)[]|[`RPCRequest`](#type-rpcrequest), callback :, config :[`Partial<IN3Config>`](#type-partial)) :`Promise<>` - sends one or a multiple requests.
    if the request is a array the response will be a array as well.
    If the callback is given it will be called with the response, if not a Promise will be returned.
    This function supports callback so it can be used as a Provider for the web3.

* **[sendRPC](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L206)**(method :`string`, params :`any`[] =  [], chain :`string`, config :[`Partial<IN3Config>`](#type-partial)) :[`Promise<RPCResponse>`](#type-rpcresponse) - sends a simply RPC-Request

* **[setMaxListeners](https://github.com/slockit/in3/blob/master/src//Users/simon/ws/in3/ts/in3/node_modules/@types/node/events.d.ts#L19)**(n :`number`) :`this` 

* **[updateNodeList](https://github.com/slockit/in3/blob/master/src/client/Client.ts#L140)**(chainId :`string`, conf :[`Partial<IN3Config>`](#type-partial), retryCount :`number` = 5) :`Promise<void>` - fetches the nodeList from the servers.


## Type IN3Config


the iguration of the IN3-Client. This can be paritally overriden for every request.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L100)



* **[autoConfig](https://github.com/slockit/in3/blob/master/src/types/types.ts#L127)** :`boolean` *(optional)*  - if true the config will be adjusted depending on the request

* **[autoUpdateList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L209)** :`boolean` *(optional)*  - if true the nodelist will be automaticly updated if the lastBlock is newer
    example: true

* **[cacheStorage](https://github.com/slockit/in3/blob/master/src/types/types.ts#L213)** :`any` *(optional)*  - a cache handler offering 2 functions ( setItem(string,string), getItem(string) )

* **[cacheTimeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L104)** :`number` *(optional)*  - number of seconds requests can be cached.

* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L194)** :`string` - servers to filter for the given chain. The chain-id based on EIP-155.
    example: 0x1

* **[chainRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L199)** :`string` *(optional)*  - main chain-registry contract
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945

* **[finality](https://github.com/slockit/in3/blob/master/src/types/types.ts#L184)** :`number` *(optional)*  - the number in percent needed in order reach finality (% of signature of the validators)
    example: 50

* **[format](https://github.com/slockit/in3/blob/master/src/types/types.ts#L118)** :`'json'`|`'jsonRef'`|`'cbor'` *(optional)*  - the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding
    example: json

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L141)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[keepIn3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L113)** :`boolean` *(optional)*  - if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.

* **[key](https://github.com/slockit/in3/blob/master/src/types/types.ts#L123)** :`any` *(optional)*  - the client key to sign requests
    example: 0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7

* **[loggerUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L217)** :`string` *(optional)*  - a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }

* **[mainChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L204)** :`string` *(optional)*  - main chain-id, where the chain registry is running.
    example: 0x1

* **[maxAttempts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L136)** :`number` *(optional)*  - max number of attempts in case a response is rejected
    example: 10

* **[maxBlockCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L151)** :`number` *(optional)*  - number of number of blocks cached  in memory
    example: 100

* **[maxCodeCache](https://github.com/slockit/in3/blob/master/src/types/types.ts#L146)** :`number` *(optional)*  - number of max bytes used to cache the code in memory
    example: 100000

* **[minDeposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L169)** :`number` - min stake of the server. Only nodes owning at least this amount will be chosen.

* **[nodeLimit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L109)** :`number` *(optional)*  - the limit of nodes to store in the client.
    example: 150

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L160)** :`'none'`|`'standard'`|`'full'` *(optional)*  - if true the nodes should send a proof of the response
    example: true

* **[replaceLatestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L174)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[requestCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L179)** :`number` - the number of request send when getting a first answer
    example: 3

* **[retryWithoutProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L131)** :`boolean` *(optional)*  - if true the the request may be handled without proof in case of an error. (use with care!)

* **[rpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L221)** :`string` *(optional)*  - url of one or more rpc-endpoints to use. (list can be comma seperated)

* **[servers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L225)** *(optional)*  - the nodelist per chain

* **[signatureCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L165)** :`number` *(optional)*  - number of signatures requested
    example: 2

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L189)** :`number` *(optional)*  - specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.
    example: 3000

* **[verifiedHashes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L155)** :`string`[] *(optional)*  - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number. This is automaticly updated by the cache, but can be overriden per request.


## Type IN3NodeConfig


a configuration of a in3-server.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L284)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L294)** :`string` - the address of the node, which is the public address it iis signing with.
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[capacity](https://github.com/slockit/in3/blob/master/src/types/types.ts#L319)** :`number` *(optional)*  - the capacity of the node.
    example: 100

* **[chainIds](https://github.com/slockit/in3/blob/master/src/types/types.ts#L309)** :`string`[] - the list of supported chains
    example: 0x1

* **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L314)** :`number` - the deposit of the node in wei
    example: 12350000

* **[index](https://github.com/slockit/in3/blob/master/src/types/types.ts#L289)** :`number` *(optional)*  - the index within the contract
    example: 13

* **[props](https://github.com/slockit/in3/blob/master/src/types/types.ts#L324)** :`number` *(optional)*  - the properties of the node.
    example: 3

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L299)** :`number` *(optional)*  - the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself
    example: 3600

* **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L304)** :`string` - the endpoint to post to
    example: https://in3.slock.it


## Type IN3NodeWeight


a local weight of a n3-node. (This is used internally to weight the requests)


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L329)



* **[avgResponseTime](https://github.com/slockit/in3/blob/master/src/types/types.ts#L344)** :`number` *(optional)*  - average time of a response in ms
    example: 240

* **[blacklistedUntil](https://github.com/slockit/in3/blob/master/src/types/types.ts#L358)** :`number` *(optional)*  - blacklisted because of failed requests until the timestamp
    example: 1529074639623

* **[lastRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L353)** :`number` *(optional)*  - timestamp of the last request in ms
    example: 1529074632623

* **[pricePerRequest](https://github.com/slockit/in3/blob/master/src/types/types.ts#L348)** :`number` *(optional)*  - last price

* **[responseCount](https://github.com/slockit/in3/blob/master/src/types/types.ts#L339)** :`number` *(optional)*  - number of uses.
    example: 147

* **[weight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L334)** :`number` *(optional)*  - factor the weight this noe (default 1.0)
    example: 0.5


## Type IN3RPCConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L363)



* **[chains](https://github.com/slockit/in3/blob/master/src/types/types.ts#L456)** *(optional)*  - a definition of the Handler per chain

* **[db](https://github.com/slockit/in3/blob/master/src/types/types.ts#L376)** *(optional)* 

    * **[database](https://github.com/slockit/in3/blob/master/src/types/types.ts#L396)** :`string` *(optional)*  - name of the database

    * **[host](https://github.com/slockit/in3/blob/master/src/types/types.ts#L388)** :`string` *(optional)*  - db-host (default = localhost)

    * **[password](https://github.com/slockit/in3/blob/master/src/types/types.ts#L384)** :`string` *(optional)*  - password for db-access

    * **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L392)** :`number` *(optional)*  - the database port

    * **[user](https://github.com/slockit/in3/blob/master/src/types/types.ts#L380)** :`string` *(optional)*  - username for the db

* **[defaultChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L371)** :`string` *(optional)*  - the default chainId in case the request does not contain one.

* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L367)** :`string` *(optional)*  - a identifier used in logfiles as also for reading the config from the database

* **[logging](https://github.com/slockit/in3/blob/master/src/types/types.ts#L423)** *(optional)*  - logger config

    * **[colors](https://github.com/slockit/in3/blob/master/src/types/types.ts#L435)** :`boolean` *(optional)*  - if true colors will be used

    * **[file](https://github.com/slockit/in3/blob/master/src/types/types.ts#L427)** :`string` *(optional)*  - the path to the logile

    * **[host](https://github.com/slockit/in3/blob/master/src/types/types.ts#L451)** :`string` *(optional)*  - the host for custom logging

    * **[level](https://github.com/slockit/in3/blob/master/src/types/types.ts#L431)** :`string` *(optional)*  - Loglevel

    * **[name](https://github.com/slockit/in3/blob/master/src/types/types.ts#L439)** :`string` *(optional)*  - the name of the provider

    * **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L447)** :`number` *(optional)*  - the port for custom logging

    * **[type](https://github.com/slockit/in3/blob/master/src/types/types.ts#L443)** :`string` *(optional)*  - the module of the provider

* **[port](https://github.com/slockit/in3/blob/master/src/types/types.ts#L375)** :`number` *(optional)*  - the listeneing port for the server

* **[profile](https://github.com/slockit/in3/blob/master/src/types/types.ts#L398)** *(optional)* 

    * **[comment](https://github.com/slockit/in3/blob/master/src/types/types.ts#L414)** :`string` *(optional)*  - comments for the node

    * **[icon](https://github.com/slockit/in3/blob/master/src/types/types.ts#L402)** :`string` *(optional)*  - url to a icon or logo of company offering this node

    * **[name](https://github.com/slockit/in3/blob/master/src/types/types.ts#L410)** :`string` *(optional)*  - name of the node or company

    * **[noStats](https://github.com/slockit/in3/blob/master/src/types/types.ts#L418)** :`boolean` *(optional)*  - if active the stats will not be shown (default:false)

    * **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L406)** :`string` *(optional)*  - url of the website of the company


## Type IN3RPCHandlerConfig


the configuration for the rpc-handler


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L463)



* **[autoRegistry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L528)** *(optional)* 

    * **[capabilities](https://github.com/slockit/in3/blob/master/src/types/types.ts#L545)** *(optional)* 

        * **[multiChain](https://github.com/slockit/in3/blob/master/src/types/types.ts#L553)** :`boolean` *(optional)*  - if true, this node is able to deliver multiple chains

        * **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L549)** :`boolean` *(optional)*  - if true, this node is able to deliver proofs

    * **[capacity](https://github.com/slockit/in3/blob/master/src/types/types.ts#L540)** :`number` *(optional)*  - max number of parallel requests

    * **[deposit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L536)** :`number` - the deposit you want ot store

    * **[depositUnit](https://github.com/slockit/in3/blob/master/src/types/types.ts#L544)** :`'ether'`|`'finney'`|`'szabo'`|`'wei'` *(optional)*  - unit of the deposit value

    * **[url](https://github.com/slockit/in3/blob/master/src/types/types.ts#L532)** :`string` - the public url to reach this node

* **[clientKeys](https://github.com/slockit/in3/blob/master/src/types/types.ts#L483)** :`string` *(optional)*  - a comma sepearted list of client keys to use for simulating clients for the watchdog

* **[freeScore](https://github.com/slockit/in3/blob/master/src/types/types.ts#L491)** :`number` *(optional)*  - the score for requests without a valid signature

* **[handler](https://github.com/slockit/in3/blob/master/src/types/types.ts#L467)** :`'eth'`|`'ipfs'`|`'btc'` *(optional)*  - the impl used to handle the calls

* **[ipfsUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L471)** :`string` *(optional)*  - the url of the ipfs-client

* **[maxThreads](https://github.com/slockit/in3/blob/master/src/types/types.ts#L499)** :`number` *(optional)*  - the maximal number of threads ofr running parallel processes

* **[minBlockHeight](https://github.com/slockit/in3/blob/master/src/types/types.ts#L495)** :`number` *(optional)*  - the minimal blockheight in order to sign

* **[persistentFile](https://github.com/slockit/in3/blob/master/src/types/types.ts#L503)** :`string` *(optional)*  - the filename of the file keeping track of the last handled blocknumber

* **[privateKey](https://github.com/slockit/in3/blob/master/src/types/types.ts#L515)** :`string` - the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.

* **[privateKeyPassphrase](https://github.com/slockit/in3/blob/master/src/types/types.ts#L519)** :`string` *(optional)*  - the password used to decrpyt the private key

* **[registry](https://github.com/slockit/in3/blob/master/src/types/types.ts#L523)** :`string` - the address of the server registry used in order to update the nodeList

* **[registryRPC](https://github.com/slockit/in3/blob/master/src/types/types.ts#L527)** :`string` *(optional)*  - the url of the client in case the registry is not on the same chain.

* **[rpcUrl](https://github.com/slockit/in3/blob/master/src/types/types.ts#L479)** :`string` - the url of the client

* **[startBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L507)** :`number` *(optional)*  - blocknumber to start watching the registry

* **[timeout](https://github.com/slockit/in3/blob/master/src/types/types.ts#L475)** :`number` *(optional)*  - number of milliseconds to wait before a request gets a timeout

* **[watchInterval](https://github.com/slockit/in3/blob/master/src/types/types.ts#L511)** :`number` *(optional)*  - the number of seconds of the interval for checking for new events

* **[watchdogInterval](https://github.com/slockit/in3/blob/master/src/types/types.ts#L487)** :`number` *(optional)*  - average time between sending requests to the same node. 0 turns it off (default)


## Type IN3RPCRequestConfig


additional config for a IN3 RPC-Request


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L560)



* **[chainId](https://github.com/slockit/in3/blob/master/src/types/types.ts#L565)** :`string` - the requested chainId
    example: 0x1

* **[clientSignature](https://github.com/slockit/in3/blob/master/src/types/types.ts#L604)** :`any` *(optional)*  - the signature of the client

* **[finality](https://github.com/slockit/in3/blob/master/src/types/types.ts#L595)** :`number` *(optional)*  - if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.

* **[includeCode](https://github.com/slockit/in3/blob/master/src/types/types.ts#L570)** :`boolean` *(optional)*  - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
    example: true

* **[latestBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L579)** :`number` *(optional)*  - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
    example: 6

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L609)** :`string`[] *(optional)*  - a list of addresses requested to sign the blockhash
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[useBinary](https://github.com/slockit/in3/blob/master/src/types/types.ts#L587)** :`boolean` *(optional)*  - if true binary-data will be used.

* **[useFullProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L591)** :`boolean` *(optional)*  - if true all data in the response will be proven, which leads to a higher payload.

* **[useRef](https://github.com/slockit/in3/blob/master/src/types/types.ts#L583)** :`boolean` *(optional)*  - if true binary-data (starting with a 0x) will be refered if occuring again.

* **[verification](https://github.com/slockit/in3/blob/master/src/types/types.ts#L600)** :`'never'`|`'proof'`|`'proofWithSignature'` *(optional)*  - defines the kind of proof the client is asking for
    example: proof

* **[verifiedHashes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L574)** :`string`[] *(optional)*  - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.


## Type IN3ResponseConfig


additional data returned from a IN3 Server


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L614)



* **[currentBlock](https://github.com/slockit/in3/blob/master/src/types/types.ts#L632)** :`number` *(optional)*  - the current blocknumber.
    example: 320126478

* **[lastNodeList](https://github.com/slockit/in3/blob/master/src/types/types.ts#L623)** :`number` *(optional)*  - the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.
    example: 326478

* **[lastValidatorChange](https://github.com/slockit/in3/blob/master/src/types/types.ts#L627)** :`number` *(optional)*  - the blocknumber of gthe last change of the validatorList

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L618)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data


## Type LogData


LogData as part of the TransactionReceipt


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L99)



* **[address](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L107)** :`string` 

* **[blockHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L105)** :`string` 

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L106)** :`string` 

* **[data](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L108)** :`string` 

* **[logIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L101)** :`string` 

* **[removed](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L100)** :`boolean` 

* **[topics](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L109)** :`string`[] 

* **[transactionHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L104)** :`string` 

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L103)** :`string` 

* **[transactionLogIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L102)** :`string` 


## Type LogProof


a Object holding proofs for event logs. The key is the blockNumber as hex


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L637)




## Type Proof


the Proof-data as part of the in3-section


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L680)



* **[accounts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L725)** *(optional)*  - a map of addresses and their AccountProof

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L690)** :`string` *(optional)*  - the serialized blockheader as hex, required in most proofs
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[finalityBlocks](https://github.com/slockit/in3/blob/master/src/types/types.ts#L695)** :`any`[] *(optional)*  - the serialized blockheader as hex, required in case of finality asked
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b

* **[logProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L721)** :[`LogProof`](#type-logproof) *(optional)*  - the Log Proof in case of a Log-Request

* **[merkleProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L709)** :`string`[] *(optional)*  - the serialized merle-noodes beginning with the root-node

* **[merkleProofPrev](https://github.com/slockit/in3/blob/master/src/types/types.ts#L713)** :`string`[] *(optional)*  - the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)

* **[signatures](https://github.com/slockit/in3/blob/master/src/types/types.ts#L736)** :[`Signature`](#type-signature)[] *(optional)*  - requested signatures

* **[transactions](https://github.com/slockit/in3/blob/master/src/types/types.ts#L700)** :`any`[] *(optional)*  - the list of transactions of the block
    example:

* **[txIndex](https://github.com/slockit/in3/blob/master/src/types/types.ts#L732)** :`number` *(optional)*  - the transactionIndex within the block
    example: 4

* **[txProof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L717)** :`string`[] *(optional)*  - the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex

* **[type](https://github.com/slockit/in3/blob/master/src/types/types.ts#L685)** :`'transactionProof'`|`'receiptProof'`|`'blockProof'`|`'accountProof'`|`'callProof'`|`'logProof'` - the type of the proof
    example: accountProof

* **[uncles](https://github.com/slockit/in3/blob/master/src/types/types.ts#L705)** :`any`[] *(optional)*  - the list of uncle-headers of the block
    example:


## Type RPCRequest


a JSONRPC-Request with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L741)



* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L755)** :`number`|`string` *(optional)*  - the identifier of the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L764)** :[`IN3RPCRequestConfig`](#type-in3rpcrequestconfig) *(optional)*  - the IN3-Config

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L745)** :`'2.0'` - the version

* **[method](https://github.com/slockit/in3/blob/master/src/types/types.ts#L750)** :`string` - the method to call
    example: eth_getBalance

* **[params](https://github.com/slockit/in3/blob/master/src/types/types.ts#L760)** :`any`[] *(optional)*  - the params
    example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,latest


## Type RPCResponse


a JSONRPC-Responset with N3-Extension


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L769)



* **[error](https://github.com/slockit/in3/blob/master/src/types/types.ts#L782)** :`string` *(optional)*  - in case of an error this needs to be set

* **[id](https://github.com/slockit/in3/blob/master/src/types/types.ts#L778)** :`string`|`number` - the id matching the request
    example: 2

* **[in3](https://github.com/slockit/in3/blob/master/src/types/types.ts#L791)** :[`IN3ResponseConfig`](#type-in3responseconfig) *(optional)*  - the IN3-Result

* **[in3Node](https://github.com/slockit/in3/blob/master/src/types/types.ts#L795)** :[`IN3NodeConfig`](#type-in3nodeconfig) *(optional)*  - the node handling this response (internal only)

* **[jsonrpc](https://github.com/slockit/in3/blob/master/src/types/types.ts#L773)** :`'2.0'` - the version

* **[result](https://github.com/slockit/in3/blob/master/src/types/types.ts#L787)** :`any` *(optional)*  - the params
    example: 0xa35bc


## Type ReceiptData


TransactionReceipt as returned by eth_getTransactionReceipt


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L113)



* **[blockHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L117)** :`string` *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L116)** :`string`|`number` *(optional)*  

* **[cumulativeGasUsed](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L120)** :`string`|`number` *(optional)*  

* **[gasUsed](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L121)** :`string`|`number` *(optional)*  

* **[logs](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L123)** :[`LogData`](#type-logdata)[] 

* **[logsBloom](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L122)** :`string` *(optional)*  

* **[root](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L119)** :`string` *(optional)*  

* **[status](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L118)** :`string`|`boolean` *(optional)*  

* **[transactionHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L114)** :`string` *(optional)*  

* **[transactionIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L115)** :`number` *(optional)*  


## Type ServerList


a List of nodes


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L800)



* **[contract](https://github.com/slockit/in3/blob/master/src/types/types.ts#L812)** :`string` *(optional)*  - IN3 Registry

* **[lastBlockNumber](https://github.com/slockit/in3/blob/master/src/types/types.ts#L804)** :`number` *(optional)*  - last Block number

* **[nodes](https://github.com/slockit/in3/blob/master/src/types/types.ts#L808)** :[`IN3NodeConfig`](#type-in3nodeconfig)[] - the list of nodes

* **[proof](https://github.com/slockit/in3/blob/master/src/types/types.ts#L817)** :[`Proof`](#type-proof) *(optional)*  - the Proof-data as part of the in3-section

* **[totalServers](https://github.com/slockit/in3/blob/master/src/types/types.ts#L816)** :`number` *(optional)*  - number of servers


## Type Signature


Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.


Source: [types/types.ts](https://github.com/slockit/in3/blob/master/src/types/types.ts#L822)



* **[address](https://github.com/slockit/in3/blob/master/src/types/types.ts#L827)** :`string` *(optional)*  - the address of the signing node
    example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679

* **[block](https://github.com/slockit/in3/blob/master/src/types/types.ts#L832)** :`number` - the blocknumber
    example: 3123874

* **[blockHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L837)** :`string` - the hash of the block
    example: 0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679

* **[msgHash](https://github.com/slockit/in3/blob/master/src/types/types.ts#L842)** :`string` - hash of the message
    example: 0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D

* **[r](https://github.com/slockit/in3/blob/master/src/types/types.ts#L847)** :`string` - Positive non-zero Integer signature.r
    example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f

* **[s](https://github.com/slockit/in3/blob/master/src/types/types.ts#L852)** :`string` - Positive non-zero Integer signature.s
    example: 0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda

* **[v](https://github.com/slockit/in3/blob/master/src/types/types.ts#L857)** :`number` - Calculated curve point, or identity element O.
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


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L255)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L257)**(client :[`Client`](#type-client)) :[`API`](#type-api) 

* **[client](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L256)** :[`Client`](#type-client) - Client for N3.

* **[signer](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L257)** :[`Signer`](#type-signer) *(optional)*  

* **[blockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L272)**() :`Promise<number>` - Returns the number of most recent block. (as number)

* **[call](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L285)**(tx :[`Transaction`](#type-transaction), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<string>` - Executes a new message call immediately without creating a transaction on the block chain.

* **[callFn](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L292)**(to :[`Address`](#type-address), method :`string`, args :`any`[]) :`Promise<any>` - Executes a function of a contract, by passing a [method-signature](https://github.com/ethereumjs/ethereumjs-abi/blob/master/README.md#simple-encoding-and-decoding) and the arguments, which will then be ABI-encoded and send as eth_call.

* **[chainId](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L300)**() :`Promise<string>` - Returns the EIP155 chain ID used for transaction signing at the current best block. Null is returned if not available.

* **[contractAt](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L592)**(abi :[`ABI`](#type-abi)[], address :[`Address`](#type-address)) : 

* **[decodeEventData](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L673)**(log :[`Log`](#type-log), d :[`ABI`](#type-abi)) :`any` 

* **[estimateGas](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L307)**(tx :[`Transaction`](#type-transaction)) :`Promise<number>` - Makes a call or transaction, which won’t be added to the blockchain and returns the used gas, which can be used for estimating the used gas.

* **[gasPrice](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L278)**() :`Promise<number>` - Returns the current price per gas in wei. (as number)

* **[getBalance](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L314)**(address :[`Address`](#type-address), block :[`BlockType`](#type-blocktype) = "latest") :[`Promise<BN>`](#type-bn) - Returns the balance of the account of given address in wei (as hex).

* **[getBlockByHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L337)**(hash :[`Hash`](#type-hash), includeTransactions :`boolean` = false) :[`Promise<Block>`](#type-block) - Returns information about a block by hash.

* **[getBlockByNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L344)**(block :[`BlockType`](#type-blocktype) = "latest", includeTransactions :`boolean` = false) :[`Promise<Block>`](#type-block) - Returns information about a block by block number.

* **[getBlockTransactionCountByHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L352)**(block :[`Hash`](#type-hash)) :`Promise<number>` - Returns the number of transactions in a block from a block matching the given block hash.

* **[getBlockTransactionCountByNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L360)**(block :[`Hash`](#type-hash)) :`Promise<number>` - Returns the number of transactions in a block from a block matching the given block number.

* **[getCode](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L321)**(address :[`Address`](#type-address), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<string>` - Returns code at a given address.

* **[getFilterChanges](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L367)**(id :[`Quantity`](#type-quantity)) :`Promise<>` - Polling method for a filter, which returns an array of logs which occurred since last poll.

* **[getFilterLogs](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L374)**(id :[`Quantity`](#type-quantity)) :`Promise<>` - Returns an array of all logs matching filter with given id.

* **[getLogs](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L381)**(filter :[`LogFilter`](#type-logfilter)) :`Promise<>` - Returns an array of all logs matching a given filter object.

* **[getStorageAt](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L329)**(address :[`Address`](#type-address), pos :[`Quantity`](#type-quantity), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<string>` - Returns the value from a storage position at a given address.

* **[getTransactionByBlockHashAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L394)**(hash :[`Hash`](#type-hash), pos :[`Quantity`](#type-quantity)) :[`Promise<TransactionDetail>`](#type-transactiondetail) - Returns information about a transaction by block hash and transaction index position.

* **[getTransactionByBlockNumberAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L402)**(block :[`BlockType`](#type-blocktype), pos :[`Quantity`](#type-quantity)) :[`Promise<TransactionDetail>`](#type-transactiondetail) - Returns information about a transaction by block number and transaction index position.

* **[getTransactionByHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L409)**(hash :[`Hash`](#type-hash)) :[`Promise<TransactionDetail>`](#type-transactiondetail) - Returns the information about a transaction requested by transaction hash.

* **[getTransactionCount](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L416)**(address :[`Address`](#type-address), block :[`BlockType`](#type-blocktype) = "latest") :`Promise<number>` - Returns the number of transactions sent from an address. (as number)

* **[getTransactionReceipt](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L424)**(hash :[`Hash`](#type-hash)) :[`Promise<TransactionReceipt>`](#type-transactionreceipt) - Returns the receipt of a transaction by transaction hash.
    Note That the receipt is available even for pending transactions.

* **[getUncleByBlockHashAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L436)**(hash :[`Hash`](#type-hash), pos :[`Quantity`](#type-quantity)) :[`Promise<Block>`](#type-block) - Returns information about a uncle of a block by hash and uncle index position.
    Note: An uncle doesn’t contain individual transactions.

* **[getUncleByBlockNumberAndIndex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L445)**(block :[`BlockType`](#type-blocktype), pos :[`Quantity`](#type-quantity)) :[`Promise<Block>`](#type-block) - Returns information about a uncle of a block number and uncle index position.
    Note: An uncle doesn’t contain individual transactions.

* **[getUncleCountByBlockHash](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L452)**(hash :[`Hash`](#type-hash)) :`Promise<number>` - Returns the number of uncles in a block from a block matching the given block hash.

* **[getUncleCountByBlockNumber](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L459)**(block :[`BlockType`](#type-blocktype)) :`Promise<number>` - Returns the number of uncles in a block from a block matching the given block hash.

* **[hashMessage](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L676)**(data :[`Data`](#type-data)|[`Buffer`](#type-buffer)) :[`Buffer`](#type-buffer) 

* **[newBlockFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L467)**() :`Promise<string>` - Creates a filter in the node, to notify when a new block arrives. To check if the state has changed, call eth_getFilterChanges.

* **[newFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L484)**(filter :[`LogFilter`](#type-logfilter)) :`Promise<string>` - Creates a filter object, based on filter options, to notify when the state changes (logs). To check if the state has changed, call eth_getFilterChanges.

* **[newPendingTransactionFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L493)**() :`Promise<string>` - Creates a filter in the node, to notify when new pending transactions arrive.

* **[protocolVersion](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L508)**() :`Promise<string>` - Returns the current ethereum protocol version.

* **[sendRawTransaction](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L537)**(data :[`Data`](#type-data)) :`Promise<string>` - Creates new message call transaction or a contract creation for signed transactions.

* **[sendTransaction](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L564)**(args :[`TxRequest`](#type-txrequest)) :`Promise<>` - sends a Transaction

* **[sign](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L546)**(account :[`Address`](#type-address), data :[`Data`](#type-data)) :[`Promise<Signature>`](#type-signature) - signs any kind of message using the `\x19Ethereum Signed Message:\n`-prefix

* **[syncing](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L515)**() :`Promise<>` - Returns the current ethereum protocol version.

* **[uninstallFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L501)**(id :[`Quantity`](#type-quantity)) :[`Promise<Quantity>`](#type-quantity) - Uninstalls a filter with given id. Should always be called when watch is no longer needed. Additonally Filters timeout when they aren’t requested with eth_getFilterChanges for a period of time.


## Type AuthSpec


Authority specification for proof of authority chains


Source: [modules/eth/header.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L13)



* **[authorities](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L15)** :[`Buffer`](#type-buffer)[] - List of validator addresses storead as an buffer array

* **[proposer](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L19)** :[`Buffer`](#type-buffer) - proposer of the block this authspec belongs

* **[spec](https://github.com/slockit/in3/blob/master/src/modules/eth/header.ts#L17)** :[`ChainSpec`](#type-chainspec) - chain specification


## Type Block


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L130)



* **[Block](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L130)**

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[sealFields](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L172)** :[`Data`](#type-data)[] - PoA-Fields

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[transactions](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L168)** :`string`|[] - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[uncles](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L170)** :[`Hash`](#type-hash)[] - Array of uncle hashes


## Type ChainContext


Context for a specific chain including cache and chainSpecs.


Source: [client/ChainContext.ts](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L27)



* `constructor` **[constructor](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L33)**(client :[`Client`](#type-client), chainId :`string`, chainSpec :[`ChainSpec`](#type-chainspec)) :[`ChainContext`](#type-chaincontext) 

* **[chainId](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L31)** :`string` 

* **[chainSpec](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L29)** :[`ChainSpec`](#type-chainspec) - describes the chainspecific consensus params

* **[client](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L28)** :[`Client`](#type-client) - Client for N3.

* **[genericCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L33)**

* **[lastValidatorChange](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L32)** :`number` 

* **[module](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L30)** :[`Module`](#type-module) 

* **[clearCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L108)**(prefix :`string`) :`void` 

* **[getFromCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L98)**(key :`string`) :`string` 

* **[handleIntern](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L61)**(request :[`RPCRequest`](#type-rpcrequest)) :[`Promise<RPCResponse>`](#type-rpcresponse) - this function is calleds before the server is asked.
    If it returns a promise than the request is handled internally otherwise the server will handle the response.
    this function should be overriden by modules that want to handle calls internally

* **[initCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L66)**() :`void` 

* **[putInCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L102)**(key :`string`, value :`string`) :`void` 

* **[updateCache](https://github.com/slockit/in3/blob/master/src/client/ChainContext.ts#L92)**() :`void` 


## Type AccountData


Account-Object


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L90)



* **[balance](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L92)** :`string` 

* **[code](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L95)** :`string` *(optional)*  

* **[codeHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L94)** :`string` 

* **[nonce](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L91)** :`string` 

* **[storageHash](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L93)** :`string` 


## Type Transaction


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L41)



* **[Transaction](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L41)**

    * **[chainId](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L57)** :`any` *(optional)*  - optional chain id

    * **[data](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L53)** :`string` - 4 byte hash of the method signature followed by encoded parameters. For details see Ethereum Contract ABI.

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 


## Type Receipt


Buffer[] of the Receipt


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L36)



* **[Receipt](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L36)** : - Buffer[] of the Receipt


## Type Account


Buffer[] of the Account


Source: [modules/eth/serialize.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L33)



* **[Account](https://github.com/slockit/in3/blob/master/src/modules/eth/serialize.ts#L33)** :[`Buffer`](#type-buffer)[] - Buffer[] of the Account


## Type Signer


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L243)



* **[prepareTransaction](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L245)** *(optional)*  - optiional method which allows to change the transaction-data before sending it. This can be used for redirecting it through a multisig.

* **[sign](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L251)** - signing of any data.

* **[hasAccount](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L248)**(account :[`Address`](#type-address)) :`Promise<boolean>` - returns true if the account is supported (or unlocked)


## Type BlockType


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)



* **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)** :`number`|`'latest'`|`'earliest'`|`'pending'` 


## Type Address


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L13)



* **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 


## Type ABI


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L30)



* **[ABI](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L30)**

    * **[anonymous](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L31)** :`boolean` *(optional)*  

    * **[constant](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L32)** :`boolean` *(optional)*  

    * **[inputs](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L36)** :[`ABIField`](#type-abifield)[] *(optional)*  

    * **[name](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L38)** :`string` *(optional)*  

    * **[outputs](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L37)** :[`ABIField`](#type-abifield)[] *(optional)*  

    * **[payable](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L33)** :`boolean` *(optional)*  

    * **[stateMutability](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L34)** :`'nonpayable'`|`'payable'`|`'view'`|`'pure'` *(optional)*  

    * **[type](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L39)** :`'event'`|`'function'`|`'constructor'`|`'fallback'` 


## Type Log


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L174)



* **[Log](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L174)**

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[removed](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L176)** :`boolean` - true when the log was removed, due to a chain reorganization. false if its a valid log.

    * **[topics](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L192)** :[`Data`](#type-data)[] - - Array of 0 to 4 32 Bytes DATA of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier.)

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 


## Type BN


Source: [util/util.ts](https://github.com/slockit/in3/blob/master/src/util/util.ts#L26)




## Type Hash


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L12)



* **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 


## Type Quantity


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)



* **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 


## Type LogFilter


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L195)



* **[LogFilter](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L195)**

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)** :`number`|`'latest'`|`'earliest'`|`'pending'` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)** :`number`|`'latest'`|`'earliest'`|`'pending'` 

    * **[topics](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L203)** :`string`|`string`[][] - (optional) Array of 32 Bytes Data topics. Topics are order-dependent. It’s possible to pass in null to match any topic, or a subarray of multiple topics of which one should be matching.


## Type TransactionDetail


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L87)



* **[TransactionDetail](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L87)**

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)** :`number`|`'latest'`|`'earliest'`|`'pending'` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[condition](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L125)** :`any` - (optional) conditional submission, Block number in block or timestamp in time or null. (parity-feature)

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[pk](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L127)** :`any` *(optional)*  - optional: the private key to use for signing

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 


## Type TransactionReceipt


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L59)



* **[TransactionReceipt](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L59)**

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[BlockType](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L9)** :`number`|`'latest'`|`'earliest'`|`'pending'` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[logs](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L75)** :[`Log`](#type-log)[] - Array of log objects, which this transaction generated.

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 


## Type Data


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L14)



* **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 


## Type TxRequest


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L208)



* **[TxRequest](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L208)**

    * **[args](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L234)** :`any`[] *(optional)*  - the argument to pass to the method

    * **[confirmations](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L240)** :`number` *(optional)*  - number of block to wait before confirming

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[gas](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L219)** :`number` *(optional)*  - the gas needed

    * **[gasPrice](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L222)** :`number` *(optional)*  - the gasPrice used

    * **[method](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L231)** :`string` *(optional)*  - the ABI of the method to be used

    * **[nonce](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L225)** :`number` *(optional)*  - the nonce

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 

    * **[Quantity](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L11)** :`number`|[`Hex`](#type-hex) 


## Type Hex


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)



* **[Hex](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L10)** :`string` 


## Type Module


Source: [client/modules.ts](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L7)



* **[name](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L8)** :`string` 

* **[createChainContext](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L10)**(client :[`Client`](#type-client), chainId :`string`, spec :[`ChainSpec`](#type-chainspec)) :[`ChainContext`](#type-chaincontext) 

* **[verifyProof](https://github.com/slockit/in3/blob/master/src/client/modules.ts#L12)**(request :[`RPCRequest`](#type-rpcrequest), response :[`RPCResponse`](#type-rpcresponse), allowWithoutProof :`boolean`, ctx :[`ChainContext`](#type-chaincontext)) :`Promise<boolean>` - general verification-function which handles it according to its given type.


## Type ABIField


Source: [modules/eth/api.ts](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L25)



* **[ABIField](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L25)**

    * **[indexed](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L26)** :`boolean` *(optional)*  

    * **[name](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L27)** :`string` 

    * **[type](https://github.com/slockit/in3/blob/master/src/modules/eth/api.ts#L28)** :`string` 

