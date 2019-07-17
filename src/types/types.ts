import {ajv, validateAndThrow} from '../util/validate'
import * as Ajv from 'ajv'
/**
 * the Proof-for a single Account
 */
export interface AccountProof {
    /**
     * the serialized merle-noodes beginning with the root-node
     */
    accountProof: string /* ^0x[0-9a-fA-F]+$ */ []
    /**
     * the address of this account
     */
    address: string // ^0x[0-9a-fA-F]+$
    /**
     * the balance of this account as hex
     */
    balance: string // ^0x[0-9a-fA-F]+$
    /**
     * the codeHash of this account as hex
     */
    codeHash: string // ^0x[0-9a-fA-F]+$
    /**
     * the code of this account as hex ( if required)
     */
    code?: string // ^0x[0-9a-fA-F]+$
    /**
     * the nonce of this account as hex
     */
    nonce: string // ^0x[0-9a-fA-F]+$
    /**
     * the storageHash of this account as hex
     */
    storageHash: string // ^0x[0-9a-fA-F]+$
    /**
     * proof for requested storage-data
     */
    storageProof: {
        /**
         * the storage key
         */
        key: string // ^0x[0-9a-fA-F]+$
        /**
         * the serialized merkle-noodes beginning with the root-node ( storageHash )
         */
        proof: string /* ^0x[0-9a-fA-F]+$ */ []
        /**
         * the stored value
         */
        value: string // ^0x[0-9a-fA-F]+$
    }[]
}
/**
 * a Object holding proofs for validator logs. The key is the blockNumber as hex
 */
export interface AuraValidatoryProof {
    /**
     * the transaction log index
     */
    logIndex: number
    /**
     * the serialized blockheader
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
     */
    block: string
    /**
     * the transactionIndex within the block
     */
    txIndex: number
    /**
     * the merkleProof
     */
    proof: string /* ^0x[0-9a-fA-F]+$ */ []
    /**
     * the serialized blockheader as hex, required in case of finality asked
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
     */
    finalityBlocks?: any[]
}
/**
 * describes the chainspecific consensus params
 */
export interface ChainSpec {
    /**
     * the blocknumnber when this configuration should apply
     */
    block?: number
    /**
     * the engine type (like Ethhash, authorityRound, ... )
     */
    engine?: 'ethHash' | 'authorityRound' | 'clique'
    /**
     * The list of validators at the particular block
     */
    list?: string /* address */ []
    /**
     * The validator contract at the block
     */
    contract?: string
    /**
     * indicates whether the transition requires a finality check
     * example: true
     */
    requiresFinality?: boolean
    /**
     * Bypass finality check for transition to contract based Aura Engines
     * example: bypassFinality = 10960502 -> will skip the finality check and add the list at block 10960502
     */
    bypassFinality?: number
}
/**
 * the iguration of the IN3-Client. This can be paritally overriden for every request.
 */
export interface IN3Config {
    /**
     * number of seconds requests can be cached.
     */
    cacheTimeout?: number
    /**
     * the limit of nodes to store in the client.
     * example: 150
     */
    nodeLimit?: number
    /**
     * if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.
     */
    keepIn3?: boolean
    /**
     * the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding
     * example: json
     */
    format?: 'json' | 'jsonRef' | 'cbor'
    /**
     * the client key to sign requests
     * example: 0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7
     */
    key?: any
    /**
     * if true the config will be adjusted depending on the request
     */
    autoConfig?: boolean
    /**
     * if true the the request may be handled without proof in case of an error. (use with care!)
     */
    retryWithoutProof?: boolean
    /**
     * max number of attempts in case a response is rejected
     * example: 10
     */
    maxAttempts?: number
    /**
     * if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
     * example: true
     */
    includeCode?: boolean
    /**
     * number of max bytes used to cache the code in memory
     * example: 100000
     */
    maxCodeCache?: number
    /**
     * number of number of blocks cached  in memory
     * example: 100
     */
    maxBlockCache?: number
    /**
     * if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number. This is automaticly updated by the cache, but can be overriden per request.
     */
    verifiedHashes?: string /* bytes32 */ []
    /**
     * if true the nodes should send a proof of the response
     * example: true
     */
    proof?: 'none' | 'standard' | 'full'
    /**
     * number of signatures requested
     * example: 2
     */
    signatureCount?: number
    /**
     * min stake of the server. Only nodes owning at least this amount will be chosen.
     */
    minDeposit: number
    /**
     * if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
     * example: 6
     */
    replaceLatestBlock?: number
    /**
     * the number of request send when getting a first answer
     * example: 3
     */
    requestCount: number
    /**
     * the number in percent needed in order reach finality (% of signature of the validators)
     * example: 50
     */
    finality?: number
    /**
     * specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.
     * example: 3000
     */
    timeout?: number
    /**
     * servers to filter for the given chain. The chain-id based on EIP-155.
     * example: 0x1
     */
    chainId: string // ^0x[0-9a-fA-F]+$
    /**
     * main chain-registry contract
     * example: 0xe36179e2286ef405e929C90ad3E70E649B22a945
     */
    chainRegistry?: string // ^0x[0-9a-fA-F]+$
    /**
     * main chain-id, where the chain registry is running.
     * example: 0x1
     */
    mainChain?: string // ^0x[0-9a-fA-F]+$
    /**
     * if true the nodelist will be automaticly updated if the lastBlock is newer
     * example: true
     */
    autoUpdateList?: boolean
    /**
     * a cache handler offering 2 functions ( setItem(string,string), getItem(string) )
     */
    cacheStorage?: any
    /**
     * a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }
     */
    loggerUrl?: string
    /**
     * url of one or more rpc-endpoints to use. (list can be comma seperated)
     */
    rpc?: string
    /**
     * the nodelist per chain
     */
    servers?: {
        [name: string]: {
            /**
             * name of the module responsible for handling the verification
             */
            verifier?: string
            /**
             * a alias for the chain
             */
            name?: string
            /**
             * chain definitions
             */
            chainSpec?: ChainSpec[]
            /**
             * a list of addresses which should always be part of the nodelist when getting an update
             * example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b1
             */
            initAddresses?: string[]
            /**
             * the blockNumber of the last event in the registry
             * example: 23498798
             */
            lastBlock?: number
            /**
             * the address of the registry contract
             * example: 0xe36179e2286ef405e929C90ad3E70E649B22a945
             */
            contract?: string
            /**
             * if true the nodelist should be updated.
             */
            needsUpdate?: boolean
            /**
             * the chainid for the contract
             * example: 0x8
             */
            contractChain?: string
            /**
             * the list of nodes
             */
            nodeList?: IN3NodeConfig[]
            /**
             * the list of authority nodes for handling conflicts
             * example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b1
             */
            nodeAuthorities?: string[]
            /**
             * the weights of nodes depending on former performance which is used internally
             */
            weights?: {
                [name: string]: IN3NodeWeight
            }
        }
    }
}
/**
 * a configuration of a in3-server.
 */
export interface IN3NodeConfig {
    /**
     * the index within the contract
     * example: 13
     */
    index?: number
    /**
     * the address of the node, which is the public address it iis signing with.
     * example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679
     */
    address: string // address
    /**
     * the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself
     * example: 3600
     */
    timeout?: number
    /**
     * the endpoint to post to
     * example: https://in3.slock.it
     */
    url: string
    /**
     * the list of supported chains
     * example: 0x1
     */
    chainIds: string /* hex */ []
    /**
     * the deposit of the node in wei
     * example: 12350000
     */
    deposit: number
    /**
     * the capacity of the node.
     * example: 100
     */
    capacity?: number
    /**
     * the properties of the node.
     * example: 3
     */
    props?: number
}
/**
 * a local weight of a n3-node. (This is used internally to weight the requests)
 */
export interface IN3NodeWeight {
    /**
     * factor the weight this noe (default 1.0)
     * example: 0.5
     */
    weight?: number
    /**
     * number of uses.
     * example: 147
     */
    responseCount?: number
    /**
     * average time of a response in ms
     * example: 240
     */
    avgResponseTime?: number
    /**
     * last price
     */
    pricePerRequest?: number
    /**
     * timestamp of the last request in ms
     * example: 1529074632623
     */
    lastRequest?: number
    /**
     * blacklisted because of failed requests until the timestamp
     * example: 1529074639623
     */
    blacklistedUntil?: number
}
/**
 * the configuration for the rpc-handler
 */
export interface IN3RPCConfig {
    /**
     * a identifier used in logfiles as also for reading the config from the database
     */
    id?: string
    /**
     * the default chainId in case the request does not contain one.
     */
    defaultChain?: string
    /**
     * the listeneing port for the server
     */
    port?: number
    db?: {
        /**
         * username for the db
         */
        user?: string
        /**
         * password for db-access
         */
        password?: string
        /**
         * db-host (default = localhost)
         */
        host?: string
        /**
         * the database port
         */
        port?: number
        /**
         * name of the database
         */
        database?: string
    }
    profile?: {
        /**
         * url to a icon or logo of company offering this node
         */
        icon?: string
        /**
         * url of the website of the company
         */
        url?: string
        /**
         * name of the node or company
         */
        name?: string
        /**
         * comments for the node
         */
        comment?: string
        /**
         * if active the stats will not be shown (default:false)
         */
        noStats?: boolean
    }
    /**
     * logger config
     */
    logging?: {
        /**
         * the path to the logile
         */
        file?: string
        /**
         * Loglevel
         */
        level?: string
        /**
         * if true colors will be used
         */
        colors?: boolean
        /**
         * the name of the provider
         */
        name?: string
        /**
         * the module of the provider
         */
        type?: string
        /**
         * the port for custom logging
         */
        port?: number
        /**
         * the host for custom logging
         */
        host?: string
    }
    /**
     * a definition of the Handler per chain
     */
    chains?: {
        [name: string]: IN3RPCHandlerConfig
    }
}
/**
 * the configuration for the rpc-handler
 */
export interface IN3RPCHandlerConfig {
    /**
     * the impl used to handle the calls
     */
    handler?: 'eth' | 'ipfs' | 'btc'
    /**
     * the url of the ipfs-client
     */
    ipfsUrl?: string
    /**
     * number of milliseconds to wait before a request gets a timeout
     */
    timeout?: number
    /**
     * the url of the client
     */
    rpcUrl: string
    /**
     * a comma sepearted list of client keys to use for simulating clients for the watchdog
     */
    clientKeys?: string
    /**
     * average time between sending requests to the same node. 0 turns it off (default)
     */
    watchdogInterval?: number
    /**
     * the score for requests without a valid signature
     */
    freeScore?: number
    /**
     * the minimal blockheight in order to sign
     */
    minBlockHeight?: number
    /**
     * the maximal number of threads ofr running parallel processes
     */
    maxThreads?: number
    /**
     * the filename of the file keeping track of the last handled blocknumber
     */
    persistentFile?: string
    /**
     * blocknumber to start watching the registry
     */
    startBlock?: number
    /**
     * the number of seconds of the interval for checking for new events
     */
    watchInterval?: number
    /**
     * the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.
     */
    privateKey: string
    /**
     * the password used to decrpyt the private key
     */
    privateKeyPassphrase?: string
    /**
     * the address of the server registry used in order to update the nodeList
     */
    registry: string
    /**
     * the url of the client in case the registry is not on the same chain.
     */
    registryRPC?: string
    autoRegistry?: {
        /**
         * the public url to reach this node
         */
        url: string
        /**
         * the deposit you want ot store
         */
        deposit: number
        /**
         * max number of parallel requests
         */
        capacity?: number
        /**
         * unit of the deposit value
         */
        depositUnit?: 'ether' | 'finney' | 'szabo' | 'wei'
        capabilities?: {
            /**
             * if true, this node is able to deliver proofs
             */
            proof?: boolean
            /**
             * if true, this node is able to deliver multiple chains
             */
            multiChain?: boolean
        }
    }
}
/**
 * additional config for a IN3 RPC-Request
 */
export interface IN3RPCRequestConfig {
    /**
     * the requested chainId
     * example: 0x1
     */
    chainId: string // hex
    /**
     * if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
     * example: true
     */
    includeCode?: boolean
    /**
     * if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.
     */
    verifiedHashes?: string /* bytes32 */ []
    /**
     * if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
     * example: 6
     */
    latestBlock?: number
    /**
     * if true binary-data (starting with a 0x) will be refered if occuring again.
     */
    useRef?: boolean
    /**
     * if true binary-data will be used.
     */
    useBinary?: boolean
    /**
     * if true all data in the response will be proven, which leads to a higher payload.
     */
    useFullProof?: boolean
    /**
     * if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.
     */
    finality?: number
    /**
     * defines the kind of proof the client is asking for
     * example: proof
     */
    verification?: 'never' | 'proof' | 'proofWithSignature'
    /**
     * the signature of the client
     */
    clientSignature?: any
    /**
     * a list of addresses requested to sign the blockhash
     * example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679
     */
    signatures?: string /* address */ []
}
/**
 * additional data returned from a IN3 Server
 */
export interface IN3ResponseConfig {
    /**
     * the Proof-data
     */
    proof?: Proof
    /**
     * the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.
     * example: 326478
     */
    lastNodeList?: number
    /**
     * the blocknumber of gthe last change of the validatorList
     */
    lastValidatorChange?: number
    /**
     * the current blocknumber.
     * example: 320126478
     */
    currentBlock?: number
}
/**
 * a Object holding proofs for event logs. The key is the blockNumber as hex
 */
export interface LogProof {
    [name: string]: {
        /**
         * the blockNumber
         */
        number?: number
        /**
         * the serialized blockheader
         * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
         */
        block: string
        /**
         * temp. list of all receipts, which is not included in the final proof
         */
        allReceipts?: any[]
        /**
         * the map of existing receipts with the txHash as key
         */
        receipts: {
            [name: string]: {
                /**
                 * the transactionHash
                 */
                txHash?: string
                /**
                 * the transactionIndex within the block
                 */
                txIndex: number
                /**
                 * the merkleProof
                 */
                txProof?: string /* ^0x[0-9a-fA-F]+$ */ []
                /**
                 * the merkleProof
                 */
                proof: string /* ^0x[0-9a-fA-F]+$ */ []
            }
        }
    }
}
/**
 * the Proof-data as part of the in3-section
 */
export interface Proof {
    /**
     * the type of the proof
     * example: accountProof
     */
    type: 'transactionProof' | 'receiptProof' | 'blockProof' | 'accountProof' | 'callProof' | 'logProof'
    /**
     * the serialized blockheader as hex, required in most proofs
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
     */
    block?: string
    /**
     * the serialized blockheader as hex, required in case of finality asked
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
     */
    finalityBlocks?: any[]
    /**
     * the list of transactions of the block
     * example: 
     */
    transactions?: any[]
    /**
     * the list of uncle-headers of the block
     * example: 
     */
    uncles?: any[]
    /**
     * the serialized merle-noodes beginning with the root-node
     */
    merkleProof?: string /* ^0x[0-9a-fA-F]+$ */ []
    /**
     * the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)
     */
    merkleProofPrev?: string /* ^0x[0-9a-fA-F]+$ */ []
    /**
     * the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex
     */
    txProof?: string /* ^0x[0-9a-fA-F]+$ */ []
    /**
     * the Log Proof in case of a Log-Request
     */
    logProof?: LogProof
    /**
     * a map of addresses and their AccountProof
     */
    accounts?: {
        [name: string]: AccountProof
    }
    /**
     * the transactionIndex within the block
     * example: 4
     */
    txIndex?: number
    /**
     * requested signatures
     */
    signatures?: Signature[]
}
/**
 * a JSONRPC-Request with N3-Extension
 */
export interface RPCRequest {
    /**
     * the version
     */
    jsonrpc: '2.0'
    /**
     * the method to call
     * example: eth_getBalance
     */
    method: string
    /**
     * the identifier of the request
     * example: 2
     */
    id?: number | string
    /**
     * the params
     * example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,latest
     */
    params?: any[]
    /**
     * the IN3-Config
     */
    in3?: IN3RPCRequestConfig
}
/**
 * a JSONRPC-Responset with N3-Extension
 */
export interface RPCResponse {
    /**
     * the version
     */
    jsonrpc: '2.0'
    /**
     * the id matching the request
     * example: 2
     */
    id: string | number
    /**
     * in case of an error this needs to be set
     */
    error?: string
    /**
     * the params
     * example: 0xa35bc
     */
    result?: any
    /**
     * the IN3-Result
     */
    in3?: IN3ResponseConfig
    /**
     * the node handling this response (internal only)
     */
    in3Node?: IN3NodeConfig
}
/**
 * a List of nodes
 */
export interface ServerList {
    /**
     * last Block number
     */
    lastBlockNumber?: number
    /**
     * the list of nodes
     */
    nodes: IN3NodeConfig[]
    /**
     * IN3 Registry
     */
    contract?: string // ^0x[0-9a-fA-F]+$
    /**
     * number of servers
     */
    totalServers?: number
    proof?: Proof
}
/**
 * Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.
 */
export interface Signature {
    /**
     * the address of the signing node
     * example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679
     */
    address?: string // address
    /**
     * the blocknumber
     * example: 3123874
     */
    block: number
    /**
     * the hash of the block
     * example: 0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679
     */
    blockHash: string // bytes32
    /**
     * hash of the message
     * example: 0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D
     */
    msgHash: string // bytes32
    /**
     * Positive non-zero Integer signature.r
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f
     */
    r: string // hex
    /**
     * Positive non-zero Integer signature.s
     * example: 0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda
     */
    s: string // hex
    /**
     * Calculated curve point, or identity element O.
     * example: 28
     */
    v: number // hex
}
/* tslint:disable */
export const validationDef = {IN3NodeWeight:{description:'a local weight of a n3-node. (This is used internally to weight the requests)',type:'object',properties:{weight:{description:'factor the weight this noe (default 1.0)',type:'number',example:0.5},responseCount:{description:'number of uses.',type:'integer',example:147},avgResponseTime:{description:'average time of a response in ms',type:'number',example:240},pricePerRequest:{description:'last price',type:'integer'},lastRequest:{description:'timestamp of the last request in ms',type:'integer',example:1529074632623},blacklistedUntil:{description:'blacklisted because of failed requests until the timestamp',type:'integer',example:1529074639623}}},IN3NodeConfig:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},timeout:{description:'the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself',type:'integer',example:3600},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',format:'hex'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},capacity:{description:'the capacity of the node.',type:'integer',example:100},props:{description:'the properties of the node.',type:'integer',example:3}}},IN3RPCRequestConfig:{description:'additional config for a IN3 RPC-Request',required:['chainId'],properties:{chainId:{description:'the requested chainId',type:'string',example:'0x1',format:'hex'},includeCode:{description:'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards',type:'boolean',example:true},verifiedHashes:{description:'if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.',type:'array',items:{type:'string',format:'bytes32'}},latestBlock:{description:'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value',type:'integer',example:6},useRef:{description:'if true binary-data (starting with a 0x) will be refered if occuring again.',type:'boolean'},useBinary:{description:'if true binary-data will be used.',type:'boolean'},useFullProof:{description:'if true all data in the response will be proven, which leads to a higher payload.',type:'boolean'},finality:{description:'if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.',type:'number'},verification:{description:'defines the kind of proof the client is asking for',type:'string',enum:['never','proof','proofWithSignature'],example:'proof'},clientSignature:{description:'the signature of the client'},signatures:{description:'a list of addresses requested to sign the blockhash',type:'array',example:['0x6C1a01C2aB554930A937B0a2E8105fB47946c679'],items:{type:'string',format:'address'}}}},Signature:{description:'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.',type:'object',required:['r','s','v','msgHash','block','blockHash'],properties:{address:{type:'string',description:'the address of the signing node',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},block:{type:'number',description:'the blocknumber',example:3123874},blockHash:{type:'string',description:'the hash of the block',example:'0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',format:'bytes32'},msgHash:{type:'string',description:'hash of the message',format:'bytes32',example:'0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex',example:'0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda'},v:{type:'integer',description:'Calculated curve point, or identity element O.',format:'hex',example:28}}},IN3ResponseConfig:{type:'object',description:'additional data returned from a IN3 Server',properties:{proof:{description:'the Proof-data as part of the in3-section',type:'object',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof'],example:'accountProof'},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},finalityBlocks:{type:'array',description:'the serialized blockheader as hex, required in case of finality asked',example:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b']},transactions:{type:'array',description:'the list of transactions of the block',example:[]},uncles:{type:'array',description:'the list of uncle-headers of the block',example:[]},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},merkleProofPrev:{type:'array',description:'the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{number:{description:'the blockNumber',type:'number'},block:{description:'the serialized blockheader',type:'string',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txHash:{type:'string',description:'the transactionHash'},txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block',example:4},signatures:{type:'array',description:'requested signatures',items:{description:'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.',type:'object',required:['r','s','v','msgHash','block','blockHash'],properties:{address:{type:'string',description:'the address of the signing node',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},block:{type:'number',description:'the blocknumber',example:3123874},blockHash:{type:'string',description:'the hash of the block',example:'0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',format:'bytes32'},msgHash:{type:'string',description:'hash of the message',format:'bytes32',example:'0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex',example:'0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda'},v:{type:'integer',description:'Calculated curve point, or identity element O.',format:'hex',example:28}}}}}},lastNodeList:{description:'the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.',type:'number',example:326478},lastValidatorChange:{description:'the blocknumber of gthe last change of the validatorList',type:'number'},currentBlock:{description:'the current blocknumber.',type:'number',example:320126478}}},ChainSpec:{type:'object',description:'describes the chainspecific consensus params',properties:{block:{description:'the blocknumnber when this configuration should apply',type:'number'},engine:{description:'the engine type (like Ethhash, authorityRound, ... )',type:'string',enum:['ethHash','authorityRound','clique']},list:{description:'The list of validators at the particular block',type:'array',items:{type:'string',format:'address'}},contract:{description:'The validator contract at the block',type:'string'},requiresFinality:{description:'indicates whether the transition requires a finality check',type:'boolean',example:true},bypassFinality:{description:'Bypass finality check for transition to contract based Aura Engines',type:'number',example:'bypassFinality = 10960502 -> will skip the finality check and add the list at block 10960502'}}},IN3Config:{description:'the iguration of the IN3-Client. This can be paritally overriden for every request.',type:'object',required:['minDeposit','requestCount','chainId'],properties:{cacheTimeout:{type:'number',description:'number of seconds requests can be cached.'},nodeLimit:{description:'the limit of nodes to store in the client.',type:'number',example:150},keepIn3:{description:'if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data. This is useful for debugging or if the proof should be used afterwards.',type:'boolean',example:false},format:{description:'the format for sending the data to the client. Default is json, but using cbor means using only 30-40% of the payload since it is using binary encoding',type:'string',enum:['json','jsonRef','cbor'],example:'json'},key:{description:'the client key to sign requests',example:'0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7'},autoConfig:{description:'if true the config will be adjusted depending on the request',type:'boolean',example:false},retryWithoutProof:{description:'if true the the request may be handled without proof in case of an error. (use with care!)',type:'boolean',example:false},maxAttempts:{description:'max number of attempts in case a response is rejected',type:'number',example:10},includeCode:{description:'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards',type:'boolean',example:true},maxCodeCache:{description:'number of max bytes used to cache the code in memory',type:'integer',example:100000},maxBlockCache:{description:'number of number of blocks cached  in memory',type:'integer',example:100},verifiedHashes:{description:'if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number. This is automaticly updated by the cache, but can be overriden per request.',type:'array',items:{type:'string',format:'bytes32'}},proof:{description:'if true the nodes should send a proof of the response',type:'string',enum:['none','standard','full'],example:true},signatureCount:{description:'number of signatures requested',type:'number',example:2},minDeposit:{type:'number',description:'min stake of the server. Only nodes owning at least this amount will be chosen.',example:0},replaceLatestBlock:{description:'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value',type:'integer',example:6},requestCount:{type:'number',min:1,default:1,description:'the number of request send when getting a first answer',example:3},finality:{type:'number',min:0,max:100,default:0,description:'the number in percent needed in order reach finality (% of signature of the validators)',example:50},timeout:{type:'number',min:1,default:2000,description:'specifies the number of milliseconds before the request times out. increasing may be helpful if the device uses a slow connection.',example:3000},chainId:{type:'string',pattern:'^0x[0-9a-fA-F]+$',description:'servers to filter for the given chain. The chain-id based on EIP-155.',example:'0x1'},chainRegistry:{type:'string',pattern:'^0x[0-9a-fA-F]+$',description:'main chain-registry contract',example:'0xe36179e2286ef405e929C90ad3E70E649B22a945'},mainChain:{type:'string',pattern:'^0x[0-9a-fA-F]+$',description:'main chain-id, where the chain registry is running.',example:'0x1'},autoUpdateList:{type:'boolean',description:'if true the nodelist will be automaticly updated if the lastBlock is newer',example:true},cacheStorage:{description:'a cache handler offering 2 functions ( setItem(string,string), getItem(string) )'},loggerUrl:{type:'string',description:'a url of RES-Endpoint, the client will log all errors to. The client will post to this endpoint JSON like { id?, level, message, meta? }'},rpc:{type:'string',description:'url of one or more rpc-endpoints to use. (list can be comma seperated)'},servers:{type:'object',description:'the nodelist per chain',additionalProperties:{type:'object',properties:{verifier:{type:'string',description:'name of the module responsible for handling the verification'},name:{type:'string',description:'a alias for the chain'},chainSpec:{type:'array',items:{type:'object',description:'describes the chainspecific consensus params',properties:{block:{description:'the blocknumnber when this configuration should apply',type:'number'},engine:{description:'the engine type (like Ethhash, authorityRound, ... )',type:'string',enum:['ethHash','authorityRound','clique']},list:{description:'The list of validators at the particular block',type:'array',items:{type:'string',format:'address'}},contract:{description:'The validator contract at the block',type:'string'},requiresFinality:{description:'indicates whether the transition requires a finality check',type:'boolean',example:true},bypassFinality:{description:'Bypass finality check for transition to contract based Aura Engines',type:'number',example:'bypassFinality = 10960502 -> will skip the finality check and add the list at block 10960502'}}},description:'chain definitions'},initAddresses:{description:'a list of addresses which should always be part of the nodelist when getting an update',type:'array',example:['0xe36179e2286ef405e929C90ad3E70E649B22a945','0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b1'],items:{type:'string'}},lastBlock:{type:'integer',description:'the blockNumber of the last event in the registry',example:23498798},contract:{type:'string',description:'the address of the registry contract',example:'0xe36179e2286ef405e929C90ad3E70E649B22a945'},needsUpdate:{type:'boolean',description:'if true the nodelist should be updated.'},contractChain:{type:'string',description:'the chainid for the contract',example:'0x8'},nodeList:{description:'the list of nodes',type:'array',items:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},timeout:{description:'the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself',type:'integer',example:3600},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',format:'hex'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},capacity:{description:'the capacity of the node.',type:'integer',example:100},props:{description:'the properties of the node.',type:'integer',example:3}}}},nodeAuthorities:{description:'the list of authority nodes for handling conflicts',type:'array',example:['0xe36179e2286ef405e929C90ad3E70E649B22a945','0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b1'],items:{type:'string'}},weights:{description:'the weights of nodes depending on former performance which is used internally',type:'object',additionalProperties:{description:'a local weight of a n3-node. (This is used internally to weight the requests)',type:'object',properties:{weight:{description:'factor the weight this noe (default 1.0)',type:'number',example:0.5},responseCount:{description:'number of uses.',type:'integer',example:147},avgResponseTime:{description:'average time of a response in ms',type:'number',example:240},pricePerRequest:{description:'last price',type:'integer'},lastRequest:{description:'timestamp of the last request in ms',type:'integer',example:1529074632623},blacklistedUntil:{description:'blacklisted because of failed requests until the timestamp',type:'integer',example:1529074639623}}}}}}}}},RPCRequest:{type:'object',description:'a JSONRPC-Request with N3-Extension',required:['jsonrpc','method'],properties:{jsonrpc:{description:'the version',type:'string',enum:['2.0']},method:{description:'the method to call',type:'string',example:'eth_getBalance'},id:{description:'the identifier of the request',type:['number','string'],example:2},params:{description:'the params',type:'array',example:['0xe36179e2286ef405e929C90ad3E70E649B22a945','latest']},in3:{description:'additional config for a IN3 RPC-Request',required:['chainId'],properties:{chainId:{description:'the requested chainId',type:'string',example:'0x1',format:'hex'},includeCode:{description:'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards',type:'boolean',example:true},verifiedHashes:{description:'if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.',type:'array',items:{type:'string',format:'bytes32'}},latestBlock:{description:'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value',type:'integer',example:6},useRef:{description:'if true binary-data (starting with a 0x) will be refered if occuring again.',type:'boolean'},useBinary:{description:'if true binary-data will be used.',type:'boolean'},useFullProof:{description:'if true all data in the response will be proven, which leads to a higher payload.',type:'boolean'},finality:{description:'if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.',type:'number'},verification:{description:'defines the kind of proof the client is asking for',type:'string',enum:['never','proof','proofWithSignature'],example:'proof'},clientSignature:{description:'the signature of the client'},signatures:{description:'a list of addresses requested to sign the blockhash',type:'array',example:['0x6C1a01C2aB554930A937B0a2E8105fB47946c679'],items:{type:'string',format:'address'}}}}}},RPCResponse:{type:'object',description:'a JSONRPC-Responset with N3-Extension',required:['jsonrpc','id'],properties:{jsonrpc:{description:'the version',type:'string',enum:['2.0']},id:{description:'the id matching the request',type:['string','number'],example:2},error:{description:'in case of an error this needs to be set',type:'string'},result:{description:'the params',example:'0xa35bc'},in3:{description:'additional data returned from a IN3 Server',type:'object',properties:{proof:{description:'the Proof-data as part of the in3-section',type:'object',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof'],example:'accountProof'},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},finalityBlocks:{type:'array',description:'the serialized blockheader as hex, required in case of finality asked',example:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b']},transactions:{type:'array',description:'the list of transactions of the block',example:[]},uncles:{type:'array',description:'the list of uncle-headers of the block',example:[]},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},merkleProofPrev:{type:'array',description:'the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{number:{description:'the blockNumber',type:'number'},block:{description:'the serialized blockheader',type:'string',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txHash:{type:'string',description:'the transactionHash'},txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block',example:4},signatures:{type:'array',description:'requested signatures',items:{description:'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.',type:'object',required:['r','s','v','msgHash','block','blockHash'],properties:{address:{type:'string',description:'the address of the signing node',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},block:{type:'number',description:'the blocknumber',example:3123874},blockHash:{type:'string',description:'the hash of the block',example:'0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',format:'bytes32'},msgHash:{type:'string',description:'hash of the message',format:'bytes32',example:'0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex',example:'0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda'},v:{type:'integer',description:'Calculated curve point, or identity element O.',format:'hex',example:28}}}}}},lastNodeList:{description:'the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.',type:'number',example:326478},lastValidatorChange:{description:'the blocknumber of gthe last change of the validatorList',type:'number'},currentBlock:{description:'the current blocknumber.',type:'number',example:320126478}}},in3Node:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},timeout:{description:'the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself',type:'integer',example:3600},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',format:'hex'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},capacity:{description:'the capacity of the node.',type:'integer',example:100},props:{description:'the properties of the node.',type:'integer',example:3}}}}},AuraValidatoryProof:{type:'object',description:'a Object holding proofs for validator logs. The key is the blockNumber as hex',required:['logIndex','block','txIndex','proof'],properties:{logIndex:{description:'the transaction log index',type:'number'},block:{description:'the serialized blockheader',type:'string',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},txIndex:{type:'integer',description:'the transactionIndex within the block'},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},finalityBlocks:{type:'array',description:'the serialized blockheader as hex, required in case of finality asked',example:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b']}}},LogProof:{type:'object',description:'a Object holding proofs for event logs. The key is the blockNumber as hex',additionalProperties:{type:'object',required:['block','receipts'],properties:{number:{description:'the blockNumber',type:'number'},block:{description:'the serialized blockheader',type:'string',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txHash:{type:'string',description:'the transactionHash'},txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},Proof:{type:'object',description:'the Proof-data as part of the in3-section',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof'],example:'accountProof'},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},finalityBlocks:{type:'array',description:'the serialized blockheader as hex, required in case of finality asked',example:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b']},transactions:{type:'array',description:'the list of transactions of the block',example:[]},uncles:{type:'array',description:'the list of uncle-headers of the block',example:[]},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},merkleProofPrev:{type:'array',description:'the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{number:{description:'the blockNumber',type:'number'},block:{description:'the serialized blockheader',type:'string',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txHash:{type:'string',description:'the transactionHash'},txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block',example:4},signatures:{type:'array',description:'requested signatures',items:{description:'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.',type:'object',required:['r','s','v','msgHash','block','blockHash'],properties:{address:{type:'string',description:'the address of the signing node',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},block:{type:'number',description:'the blocknumber',example:3123874},blockHash:{type:'string',description:'the hash of the block',example:'0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',format:'bytes32'},msgHash:{type:'string',description:'hash of the message',format:'bytes32',example:'0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex',example:'0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda'},v:{type:'integer',description:'Calculated curve point, or identity element O.',format:'hex',example:28}}}}}},AccountProof:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}},ServerList:{type:'object',description:'a List of nodes',required:['nodes'],properties:{lastBlockNumber:{type:'integer',description:'last Block number'},nodes:{type:'array',description:'the list of nodes',items:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},timeout:{description:'the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself',type:'integer',example:3600},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',format:'hex'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},capacity:{description:'the capacity of the node.',type:'integer',example:100},props:{description:'the properties of the node.',type:'integer',example:3}}}},contract:{type:'string',description:'IN3 Registry',pattern:'^0x[0-9a-fA-F]+$'},totalServers:{type:'integer',description:'number of servers'},proof:{type:'object',description:'the Proof-data as part of the in3-section',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof'],example:'accountProof'},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},finalityBlocks:{type:'array',description:'the serialized blockheader as hex, required in case of finality asked',example:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b']},transactions:{type:'array',description:'the list of transactions of the block',example:[]},uncles:{type:'array',description:'the list of uncle-headers of the block',example:[]},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},merkleProofPrev:{type:'array',description:'the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)',exmaple:['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b','0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1','0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'],items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{number:{description:'the blockNumber',type:'number'},block:{description:'the serialized blockheader',type:'string',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txHash:{type:'string',description:'the transactionHash'},txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block',example:4},signatures:{type:'array',description:'requested signatures',items:{description:'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.',type:'object',required:['r','s','v','msgHash','block','blockHash'],properties:{address:{type:'string',description:'the address of the signing node',format:'address',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},block:{type:'number',description:'the blocknumber',example:3123874},blockHash:{type:'string',description:'the hash of the block',example:'0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',format:'bytes32'},msgHash:{type:'string',description:'hash of the message',format:'bytes32',example:'0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex',example:'0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex',example:'0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda'},v:{type:'integer',description:'Calculated curve point, or identity element O.',format:'hex',example:28}}}}}}}},IN3RPCConfig:{type:'object',description:'the configuration for the rpc-handler',properties:{id:{type:'string',description:'a identifier used in logfiles as also for reading the config from the database'},defaultChain:{type:'string',description:'the default chainId in case the request does not contain one.'},port:{type:'integer',default:8500,description:'the listeneing port for the server'},db:{type:'object',properties:{user:{type:'string',description:'username for the db'},password:{type:'string',description:'password for db-access'},host:{type:'string',description:'db-host (default = localhost)'},port:{type:'integer',description:'the database port'},database:{type:'string',description:'name of the database'}}},profile:{type:'object',properties:{icon:{type:'string',description:'url to a icon or logo of company offering this node'},url:{type:'string',description:'url of the website of the company'},name:{type:'string',description:'name of the node or company'},comment:{type:'string',description:'comments for the node'},noStats:{type:'boolean',description:'if active the stats will not be shown (default:false)'}}},logging:{type:'object',description:'logger config',required:[],properties:{file:{type:'string',description:'the path to the logile'},level:{type:'string',description:'Loglevel'},colors:{type:'boolean',description:'if true colors will be used'},name:{type:'string',description:'the name of the provider'},type:{type:'string',description:'the module of the provider'},port:{type:'integer',description:'the port for custom logging'},host:{type:'string',description:'the host for custom logging'}}},chains:{type:'object',description:'a definition of the Handler per chain',additionalProperties:{type:'object',description:'the configuration for the rpc-handler',required:['rpcUrl','privateKey','registry'],properties:{handler:{type:'string',description:'the impl used to handle the calls',enum:['eth','ipfs','btc']},ipfsUrl:{type:'string',description:'the url of the ipfs-client'},timeout:{type:'integer',description:'number of milliseconds to wait before a request gets a timeout'},rpcUrl:{type:'string',description:'the url of the client'},clientKeys:{type:'string',description:'a comma sepearted list of client keys to use for simulating clients for the watchdog'},watchdogInterval:{type:'number',description:'average time between sending requests to the same node. 0 turns it off (default)'},freeScore:{type:'number',description:'the score for requests without a valid signature'},minBlockHeight:{type:'integer',description:'the minimal blockheight in order to sign'},maxThreads:{type:'integer',description:'the maximal number of threads ofr running parallel processes'},persistentFile:{type:'string',description:'the filename of the file keeping track of the last handled blocknumber'},startBlock:{type:'number',description:'blocknumber to start watching the registry'},watchInterval:{type:'integer',description:'the number of seconds of the interval for checking for new events'},privateKey:{type:'string',description:'the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.'},privateKeyPassphrase:{type:'string',description:'the password used to decrpyt the private key'},registry:{type:'string',description:'the address of the server registry used in order to update the nodeList'},registryRPC:{type:'string',description:'the url of the client in case the registry is not on the same chain.'},autoRegistry:{type:'object',required:['url','deposit'],properties:{url:{type:'string',description:'the public url to reach this node'},deposit:{type:'number',description:'the deposit you want ot store'},capacity:{type:'number',description:'max number of parallel requests'},depositUnit:{type:'string',description:'unit of the deposit value',enum:['ether','finney','szabo','wei']},capabilities:{type:'object',properties:{proof:{type:'boolean',description:'if true, this node is able to deliver proofs',flag:1},multiChain:{type:'boolean',description:'if true, this node is able to deliver multiple chains',flag:2}}}}}}}}}},IN3RPCHandlerConfig:{type:'object',description:'the configuration for the rpc-handler',required:['rpcUrl','privateKey','registry'],properties:{handler:{type:'string',description:'the impl used to handle the calls',enum:['eth','ipfs','btc']},ipfsUrl:{type:'string',description:'the url of the ipfs-client'},timeout:{type:'integer',description:'number of milliseconds to wait before a request gets a timeout'},rpcUrl:{type:'string',description:'the url of the client'},clientKeys:{type:'string',description:'a comma sepearted list of client keys to use for simulating clients for the watchdog'},watchdogInterval:{type:'number',description:'average time between sending requests to the same node. 0 turns it off (default)'},freeScore:{type:'number',description:'the score for requests without a valid signature'},minBlockHeight:{type:'integer',description:'the minimal blockheight in order to sign'},maxThreads:{type:'integer',description:'the maximal number of threads ofr running parallel processes'},persistentFile:{type:'string',description:'the filename of the file keeping track of the last handled blocknumber'},startBlock:{type:'number',description:'blocknumber to start watching the registry'},watchInterval:{type:'integer',description:'the number of seconds of the interval for checking for new events'},privateKey:{type:'string',description:'the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.'},privateKeyPassphrase:{type:'string',description:'the password used to decrpyt the private key'},registry:{type:'string',description:'the address of the server registry used in order to update the nodeList'},registryRPC:{type:'string',description:'the url of the client in case the registry is not on the same chain.'},autoRegistry:{type:'object',required:['url','deposit'],properties:{url:{type:'string',description:'the public url to reach this node'},deposit:{type:'number',description:'the deposit you want ot store'},capacity:{type:'number',description:'max number of parallel requests'},depositUnit:{type:'string',description:'unit of the deposit value',enum:['ether','finney','szabo','wei']},capabilities:{type:'object',properties:{proof:{type:'boolean',description:'if true, this node is able to deliver proofs',flag:1},multiChain:{type:'boolean',description:'if true, this node is able to deliver multiple chains',flag:2}}}}}}}}

/** validates the IN3NodeWeight and returns true | false. if it failes, use validateIN3NodeWeight.errors to get a list of errors. */
export const validateIN3NodeWeight = ajv.compile(validationDef.IN3NodeWeight)
export const IN3NodeWeightDefinition = validationDef.IN3NodeWeight
/** validates the IN3NodeWeight and throws in case of an a invalid object.*/
export function validateIN3NodeWeightAndThrow (data:IN3NodeWeight) { validateAndThrow(validateIN3NodeWeight,data) }
/** validates the IN3NodeConfig and returns true | false. if it failes, use validateIN3NodeConfig.errors to get a list of errors. */
export const validateIN3NodeConfig = ajv.compile(validationDef.IN3NodeConfig)
export const IN3NodeConfigDefinition = validationDef.IN3NodeConfig
/** validates the IN3NodeConfig and throws in case of an a invalid object.*/
export function validateIN3NodeConfigAndThrow (data:IN3NodeConfig) { validateAndThrow(validateIN3NodeConfig,data) }
/** validates the IN3RPCRequestConfig and returns true | false. if it failes, use validateIN3RPCRequestConfig.errors to get a list of errors. */
export const validateIN3RPCRequestConfig = ajv.compile(validationDef.IN3RPCRequestConfig)
export const IN3RPCRequestConfigDefinition = validationDef.IN3RPCRequestConfig
/** validates the IN3RPCRequestConfig and throws in case of an a invalid object.*/
export function validateIN3RPCRequestConfigAndThrow (data:IN3RPCRequestConfig) { validateAndThrow(validateIN3RPCRequestConfig,data) }
/** validates the Signature and returns true | false. if it failes, use validateSignature.errors to get a list of errors. */
export const validateSignature = ajv.compile(validationDef.Signature)
export const SignatureDefinition = validationDef.Signature
/** validates the Signature and throws in case of an a invalid object.*/
export function validateSignatureAndThrow (data:Signature) { validateAndThrow(validateSignature,data) }
/** validates the IN3ResponseConfig and returns true | false. if it failes, use validateIN3ResponseConfig.errors to get a list of errors. */
export const validateIN3ResponseConfig = ajv.compile(validationDef.IN3ResponseConfig)
export const IN3ResponseConfigDefinition = validationDef.IN3ResponseConfig
/** validates the IN3ResponseConfig and throws in case of an a invalid object.*/
export function validateIN3ResponseConfigAndThrow (data:IN3ResponseConfig) { validateAndThrow(validateIN3ResponseConfig,data) }
/** validates the ChainSpec and returns true | false. if it failes, use validateChainSpec.errors to get a list of errors. */
export const validateChainSpec = ajv.compile(validationDef.ChainSpec)
export const ChainSpecDefinition = validationDef.ChainSpec
/** validates the ChainSpec and throws in case of an a invalid object.*/
export function validateChainSpecAndThrow (data:ChainSpec) { validateAndThrow(validateChainSpec,data) }
/** validates the IN3Config and returns true | false. if it failes, use validateIN3Config.errors to get a list of errors. */
export const validateIN3Config = ajv.compile(validationDef.IN3Config)
export const IN3ConfigDefinition = validationDef.IN3Config
/** validates the IN3Config and throws in case of an a invalid object.*/
export function validateIN3ConfigAndThrow (data:IN3Config) { validateAndThrow(validateIN3Config,data) }
/** validates the RPCRequest and returns true | false. if it failes, use validateRPCRequest.errors to get a list of errors. */
export const validateRPCRequest = ajv.compile(validationDef.RPCRequest)
export const RPCRequestDefinition = validationDef.RPCRequest
/** validates the RPCRequest and throws in case of an a invalid object.*/
export function validateRPCRequestAndThrow (data:RPCRequest) { validateAndThrow(validateRPCRequest,data) }
/** validates the RPCResponse and returns true | false. if it failes, use validateRPCResponse.errors to get a list of errors. */
export const validateRPCResponse = ajv.compile(validationDef.RPCResponse)
export const RPCResponseDefinition = validationDef.RPCResponse
/** validates the RPCResponse and throws in case of an a invalid object.*/
export function validateRPCResponseAndThrow (data:RPCResponse) { validateAndThrow(validateRPCResponse,data) }
/** validates the AuraValidatoryProof and returns true | false. if it failes, use validateAuraValidatoryProof.errors to get a list of errors. */
export const validateAuraValidatoryProof = ajv.compile(validationDef.AuraValidatoryProof)
export const AuraValidatoryProofDefinition = validationDef.AuraValidatoryProof
/** validates the AuraValidatoryProof and throws in case of an a invalid object.*/
export function validateAuraValidatoryProofAndThrow (data:AuraValidatoryProof) { validateAndThrow(validateAuraValidatoryProof,data) }
/** validates the LogProof and returns true | false. if it failes, use validateLogProof.errors to get a list of errors. */
export const validateLogProof = ajv.compile(validationDef.LogProof)
export const LogProofDefinition = validationDef.LogProof
/** validates the LogProof and throws in case of an a invalid object.*/
export function validateLogProofAndThrow (data:LogProof) { validateAndThrow(validateLogProof,data) }
/** validates the Proof and returns true | false. if it failes, use validateProof.errors to get a list of errors. */
export const validateProof = ajv.compile(validationDef.Proof)
export const ProofDefinition = validationDef.Proof
/** validates the Proof and throws in case of an a invalid object.*/
export function validateProofAndThrow (data:Proof) { validateAndThrow(validateProof,data) }
/** validates the AccountProof and returns true | false. if it failes, use validateAccountProof.errors to get a list of errors. */
export const validateAccountProof = ajv.compile(validationDef.AccountProof)
export const AccountProofDefinition = validationDef.AccountProof
/** validates the AccountProof and throws in case of an a invalid object.*/
export function validateAccountProofAndThrow (data:AccountProof) { validateAndThrow(validateAccountProof,data) }
/** validates the ServerList and returns true | false. if it failes, use validateServerList.errors to get a list of errors. */
export const validateServerList = ajv.compile(validationDef.ServerList)
export const ServerListDefinition = validationDef.ServerList
/** validates the ServerList and throws in case of an a invalid object.*/
export function validateServerListAndThrow (data:ServerList) { validateAndThrow(validateServerList,data) }
/** validates the IN3RPCConfig and returns true | false. if it failes, use validateIN3RPCConfig.errors to get a list of errors. */
export const validateIN3RPCConfig = ajv.compile(validationDef.IN3RPCConfig)
export const IN3RPCConfigDefinition = validationDef.IN3RPCConfig
/** validates the IN3RPCConfig and throws in case of an a invalid object.*/
export function validateIN3RPCConfigAndThrow (data:IN3RPCConfig) { validateAndThrow(validateIN3RPCConfig,data) }
/** validates the IN3RPCHandlerConfig and returns true | false. if it failes, use validateIN3RPCHandlerConfig.errors to get a list of errors. */
export const validateIN3RPCHandlerConfig = ajv.compile(validationDef.IN3RPCHandlerConfig)
export const IN3RPCHandlerConfigDefinition = validationDef.IN3RPCHandlerConfig
/** validates the IN3RPCHandlerConfig and throws in case of an a invalid object.*/
export function validateIN3RPCHandlerConfigAndThrow (data:IN3RPCHandlerConfig) { validateAndThrow(validateIN3RPCHandlerConfig,data) }