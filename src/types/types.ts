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
 * the definition of the config-file.
 */
export interface IN3Config {
    /**
     * the limit of nodes to store in the client
     */
    nodeLimit?: number
    /**
     * if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data.
     */
    keepIn3?: boolean
    /**
     * the format for sending the data to the client
     */
    format?: 'json' | 'cbor'
    /**
     * if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
     */
    includeCode?: boolean
    /**
     * if true the nodes should send a proof of the response
     */
    proof?: boolean
    /**
     * number of signatures requested
     */
    signatureCount?: number
    /**
     * min stake of the server. Only nodes owning at least this amount will be chosen.
     */
    minDeposit: number
    /**
     * if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
     */
    replaceLatestBlock?: number
    /**
     * the number of request send when getting a first answer
     */
    requestCount: number
    /**
     * specifies the number of milliseconds before the request times out.
     */
    timeout?: number
    /**
     * servers to filter for the given chain. The chain-id based on EIP-155.
     */
    chainId: string // ^0x[0-9a-fA-F]+$
    /**
     * main chain-registry contract
     */
    chainRegistry?: string // ^0x[0-9a-fA-F]+$
    /**
     * main chain-id, where the chain registry is running.
     */
    mainChain?: string // ^0x[0-9a-fA-F]+$
    /**
     * if true the nodelist will be automaticly updated if the lastBlock is newer
     */
    autoUpdateList?: boolean
    /**
     * the nodelist per chain
     */
    servers?: {
        [name: string]: {
            /**
             * a list of addresses which should always be part of the nodelist when getting an update
             */
            initAddresses?: string[]
            /**
             * the blockNumber of the last event in the registry
             */
            lastBlock?: number
            /**
             * the address of the registry contract
             */
            contract?: string
            /**
             * the chainid for the contract
             */
            contractChain?: string
            /**
             * the list of nodes
             */
            nodeList?: IN3NodeConfig[]
            /**
             * the list of authority nodes for handling conflicts
             */
            nodeAuthorities?: string[]
            /**
             * the weights of nodes depending on former performance
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
    address: string
    /**
     * the endpoint to post to
     * example: https://in3.slock.it
     */
    url: string
    /**
     * the list of supported chains
     * example: 0x1
     */
    chainIds: string /* ^0x[0-9a-fA-F]+$ */ []
    /**
     * the deposit of the node in wei
     * example: 12350000
     */
    deposit: number
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
     * the default chainId in case the request does not contain one.
     */
    defaultChain?: string
    /**
     * the listeneing port for the server
     */
    port?: number
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
     * the url of the client
     */
    rpcUrl: string
    /**
     * the minimal blockheight in order to sign
     */
    minBlockHeight?: number
    /**
     * the filename of the file keeping track of the last handled blocknumber
     */
    persistentFile?: string
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
 * additional config for a IN§ RPC-Request
 */
export interface IN3RPCRequestConfig {
    /**
     * the requested chainId
     */
    chainId?: string
    /**
     * if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
     */
    includeCode?: boolean
    /**
     * if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
     */
    latestBlock?: number
    /**
     * defines the kind of proof the client is asking for
     */
    verification?: 'never' | 'proof' | 'proofWithSignature'
    /**
     * a list of addresses requested to sign the blockhash
     */
    signatures?: string /* ^0x[0-9a-fA-F]+$ */ []
}
/**
 * additional config for a IN§ RPC-Request
 */
export interface IN3ResponseConfig {
    /**
     * the Proof-data
     */
    proof?: Proof
    /**
     * the blocknumber for the last block updating the nodelist
     */
    lastNodeList?: number
}
/**
 * a Object holding proofs for event logs. The key is the blockNumber as hex
 */
export interface LogProof {
    [name: string]: {
        /**
         * the serialized blockheader
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
     */
    type: 'transactionProof' | 'receiptProof' | 'blockProof' | 'accountProof' | 'callProof' | 'logProof'
    /**
     * the serialized blockheader as hex, required in most proofs
     */
    block?: string
    /**
     * the list of transactions of the block
     */
    transactions?: any[]
    /**
     * the serialized merle-noodes beginning with the root-node
     */
    merkleProof?: string /* ^0x[0-9a-fA-F]+$ */ []
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
     */
    method: string
    /**
     * the id
     */
    id?: string | number
    /**
     * the params
     */
    params?: any[] | {
    }
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
     */
    id: string | number
    /**
     * in case of an error this needs to be set
     */
    error?: string
    /**
     * the params
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
export interface Signature {
    /**
     * the address of the signing node
     */
    address?: string
    /**
     * the blocknumber
     */
    block?: number
    /**
     * the hash of the block
     */
    blockHash?: string
    /**
     * hash of the message
     */
    msgHash?: string // bytes32
    /**
     * Positive non-zero Integer signature.r
     */
    r?: string // hex
    /**
     * Positive non-zero Integer signature.s
     */
    s?: string // hex
    /**
     * Calculated curve point, or identity element O.
     */
    v?: string // hex
}
/* tslint:disable */
export const validationDef = {IN3NodeWeight:{description:'a local weight of a n3-node. (This is used internally to weight the requests)',type:'object',properties:{weight:{description:'factor the weight this noe (default 1.0)',type:'number',example:0.5},responseCount:{description:'number of uses.',type:'integer',example:147},avgResponseTime:{description:'average time of a response in ms',type:'number',example:240},pricePerRequest:{description:'last price',type:'integer'},lastRequest:{description:'timestamp of the last request in ms',type:'integer',example:1529074632623},blacklistedUntil:{description:'blacklisted because of failed requests until the timestamp',type:'integer',example:1529074639623}}},IN3NodeConfig:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},props:{description:'the properties of the node.',type:'integer',example:3}}},IN3RPCRequestConfig:{description:'additional config for a IN§ RPC-Request',properties:{chainId:{description:'the requested chainId',type:'string'},includeCode:{description:'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards',type:'boolean'},latestBlock:{description:'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value',type:'integer'},verification:{description:'defines the kind of proof the client is asking for',type:'string',enum:['never','proof','proofWithSignature']},signatures:{description:'a list of addresses requested to sign the blockhash',type:'array',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}},Signature:{type:'object',properties:{address:{type:'string',description:'the address of the signing node'},block:{type:'number',description:'the blocknumber'},blockHash:{type:'string',description:'the hash of the block'},msgHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'}}},IN3ResponseConfig:{type:'object',description:'additional config for a IN§ RPC-Request',properties:{proof:{description:'the Proof-data as part of the in3-section',type:'object',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof']},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs'},transactions:{type:'array',description:'the list of transactions of the block'},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{block:{description:'the serialized blockheader',type:'string'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block'},signatures:{type:'array',description:'requested signatures',items:{type:'object',properties:{address:{type:'string',description:'the address of the signing node'},block:{type:'number',description:'the blocknumber'},blockHash:{type:'string',description:'the hash of the block'},msgHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'}}}}}},lastNodeList:{description:'the blocknumber for the last block updating the nodelist',type:'number'}}},IN3Config:{description:'the definition of the config-file.',type:'object',required:['minDeposit','requestCount','chainId'],properties:{nodeLimit:{description:'the limit of nodes to store in the client',type:'number'},keepIn3:{description:'if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data.',type:'boolean'},format:{description:'the format for sending the data to the client',type:'string',enum:['json','cbor']},includeCode:{description:'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards',type:'boolean'},proof:{description:'if true the nodes should send a proof of the response',type:'boolean'},signatureCount:{description:'number of signatures requested',type:'number'},minDeposit:{type:'number',description:'min stake of the server. Only nodes owning at least this amount will be chosen.'},replaceLatestBlock:{description:'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value',type:'integer'},requestCount:{type:'number',min:1,default:1,description:'the number of request send when getting a first answer'},timeout:{type:'number',min:1,default:1,description:'specifies the number of milliseconds before the request times out.'},chainId:{type:'string',pattern:'^0x[0-9a-fA-F]+$',description:'servers to filter for the given chain. The chain-id based on EIP-155.'},chainRegistry:{type:'string',pattern:'^0x[0-9a-fA-F]+$',description:'main chain-registry contract'},mainChain:{type:'string',pattern:'^0x[0-9a-fA-F]+$',description:'main chain-id, where the chain registry is running.'},autoUpdateList:{type:'boolean',description:'if true the nodelist will be automaticly updated if the lastBlock is newer'},servers:{type:'object',description:'the nodelist per chain',additionalProperties:{type:'object',properties:{initAddresses:{description:'a list of addresses which should always be part of the nodelist when getting an update',type:'array',items:{type:'string'}},lastBlock:{type:'integer',description:'the blockNumber of the last event in the registry'},contract:{type:'string',description:'the address of the registry contract'},contractChain:{type:'string',description:'the chainid for the contract'},nodeList:{description:'the list of nodes',type:'array',items:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},props:{description:'the properties of the node.',type:'integer',example:3}}}},nodeAuthorities:{description:'the list of authority nodes for handling conflicts',type:'array',items:{type:'string'}},weights:{description:'the weights of nodes depending on former performance',type:'object',additionalProperties:{description:'a local weight of a n3-node. (This is used internally to weight the requests)',type:'object',properties:{weight:{description:'factor the weight this noe (default 1.0)',type:'number',example:0.5},responseCount:{description:'number of uses.',type:'integer',example:147},avgResponseTime:{description:'average time of a response in ms',type:'number',example:240},pricePerRequest:{description:'last price',type:'integer'},lastRequest:{description:'timestamp of the last request in ms',type:'integer',example:1529074632623},blacklistedUntil:{description:'blacklisted because of failed requests until the timestamp',type:'integer',example:1529074639623}}}}}}}}},RPCRequest:{type:'object',description:'a JSONRPC-Request with N3-Extension',required:['jsonrpc','method'],properties:{jsonrpc:{description:'the version',type:'string',enum:['2.0']},method:{description:'the method to call',type:'string'},id:{description:'the id',type:['string','number']},params:{description:'the params',type:['array','object']},in3:{description:'additional config for a IN§ RPC-Request',properties:{chainId:{description:'the requested chainId',type:'string'},includeCode:{description:'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards',type:'boolean'},latestBlock:{description:'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value',type:'integer'},verification:{description:'defines the kind of proof the client is asking for',type:'string',enum:['never','proof','proofWithSignature']},signatures:{description:'a list of addresses requested to sign the blockhash',type:'array',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}},RPCResponse:{type:'object',description:'a JSONRPC-Responset with N3-Extension',required:['jsonrpc','id'],properties:{jsonrpc:{description:'the version',type:'string',enum:['2.0']},id:{description:'the id matching the request',type:['string','number']},error:{description:'in case of an error this needs to be set',type:'string'},result:{description:'the params'},in3:{description:'additional config for a IN§ RPC-Request',type:'object',properties:{proof:{description:'the Proof-data as part of the in3-section',type:'object',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof']},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs'},transactions:{type:'array',description:'the list of transactions of the block'},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{block:{description:'the serialized blockheader',type:'string'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block'},signatures:{type:'array',description:'requested signatures',items:{type:'object',properties:{address:{type:'string',description:'the address of the signing node'},block:{type:'number',description:'the blocknumber'},blockHash:{type:'string',description:'the hash of the block'},msgHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'}}}}}},lastNodeList:{description:'the blocknumber for the last block updating the nodelist',type:'number'}}},in3Node:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},props:{description:'the properties of the node.',type:'integer',example:3}}}}},LogProof:{type:'object',description:'a Object holding proofs for event logs. The key is the blockNumber as hex',additionalProperties:{type:'object',required:['block','receipts'],properties:{block:{description:'the serialized blockheader',type:'string'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},Proof:{type:'object',description:'the Proof-data as part of the in3-section',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof']},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs'},transactions:{type:'array',description:'the list of transactions of the block'},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{block:{description:'the serialized blockheader',type:'string'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block'},signatures:{type:'array',description:'requested signatures',items:{type:'object',properties:{address:{type:'string',description:'the address of the signing node'},block:{type:'number',description:'the blocknumber'},blockHash:{type:'string',description:'the hash of the block'},msgHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'}}}}}},AccountProof:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}},ServerList:{type:'object',description:'a List of nodes',required:['nodes'],properties:{lastBlockNumber:{type:'integer',description:'last Block number'},nodes:{type:'array',description:'the list of nodes',items:{description:'a configuration of a in3-server.',type:'object',required:['address','url','deposit','chainIds'],properties:{index:{description:'the index within the contract',type:'integer',example:13},address:{description:'the address of the node, which is the public address it iis signing with.',type:'string',example:'0x6C1a01C2aB554930A937B0a2E8105fB47946c679'},url:{description:'the endpoint to post to',type:'string',example:'https://in3.slock.it'},chainIds:{description:'the list of supported chains',example:['0x1'],type:'array',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},deposit:{description:'the deposit of the node in wei',type:'integer',example:12350000},props:{description:'the properties of the node.',type:'integer',example:3}}}},contract:{type:'string',description:'IN3 Registry',pattern:'^0x[0-9a-fA-F]+$'},totalServers:{type:'integer',description:'number of servers'},proof:{type:'object',description:'the Proof-data as part of the in3-section',required:['type'],properties:{type:{description:'the type of the proof',type:'string',enum:['transactionProof','receiptProof','blockProof','accountProof','callProof','logProof']},block:{type:'string',description:'the serialized blockheader as hex, required in most proofs'},transactions:{type:'array',description:'the list of transactions of the block'},merkleProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},txProof:{type:'array',description:'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},logProof:{description:'a Object holding proofs for event logs. The key is the blockNumber as hex',type:'object',additionalProperties:{type:'object',required:['block','receipts'],properties:{block:{description:'the serialized blockheader',type:'string'},allReceipts:{description:'temp. list of all receipts, which is not included in the final proof',type:'array'},receipts:{description:'the map of existing receipts with the txHash as key',type:'object',additionalProperties:{type:'object',required:['txIndex','proof'],properties:{txIndex:{type:'integer',description:'the transactionIndex within the block'},txProof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},proof:{type:'array',description:'the merkleProof',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}}}}}}}},accounts:{type:'object',description:'a map of addresses and their AccountProof',additionalProperties:{type:'object',description:'the Proof-for a single Account',required:['accountProof','address','balance','codeHash','nonce','storageHash','storageProof'],properties:{accountProof:{type:'array',description:'the serialized merle-noodes beginning with the root-node',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},address:{type:'string',description:'the address of this account',pattern:'^0x[0-9a-fA-F]+$'},balance:{type:'string',description:'the balance of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},codeHash:{type:'string',description:'the codeHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},code:{type:'string',description:'the code of this account as hex ( if required)',pattern:'^0x[0-9a-fA-F]+$'},nonce:{type:'string',description:'the nonce of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageHash:{type:'string',description:'the storageHash of this account as hex',pattern:'^0x[0-9a-fA-F]+$'},storageProof:{type:'array',description:'proof for requested storage-data',items:{type:'object',required:['key','proof','value'],properties:{key:{type:'string',description:'the storage key',pattern:'^0x[0-9a-fA-F]+$'},proof:{type:'array',description:'the serialized merkle-noodes beginning with the root-node ( storageHash )',items:{type:'string',pattern:'^0x[0-9a-fA-F]+$'}},value:{type:'string',description:'the stored value',pattern:'^0x[0-9a-fA-F]+$'}}}}}}},txIndex:{type:'integer',description:'the transactionIndex within the block'},signatures:{type:'array',description:'requested signatures',items:{type:'object',properties:{address:{type:'string',description:'the address of the signing node'},block:{type:'number',description:'the blocknumber'},blockHash:{type:'string',description:'the hash of the block'},msgHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'}}}}}}}},IN3RPCConfig:{type:'object',description:'the configuration for the rpc-handler',properties:{defaultChain:{type:'string',description:'the default chainId in case the request does not contain one.'},port:{type:'integer',default:8500,description:'the listeneing port for the server'},logging:{type:'object',description:'logger config',properties:{file:{type:'string',description:'the path to the logile'},level:{type:'string',description:'Loglevel'},colors:{type:'boolean',description:'if true colors will be used'}}},chains:{type:'object',description:'a definition of the Handler per chain',additionalProperties:{type:'object',description:'the configuration for the rpc-handler',required:['rpcUrl','privateKey','registry'],properties:{handler:{type:'string',description:'the impl used to handle the calls',enum:['eth','ipfs','btc']},rpcUrl:{type:'string',description:'the url of the client'},minBlockHeight:{type:'integer',description:'the minimal blockheight in order to sign'},persistentFile:{type:'string',description:'the filename of the file keeping track of the last handled blocknumber'},watchInterval:{type:'integer',description:'the number of seconds of the interval for checking for new events'},privateKey:{type:'string',description:'the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.'},privateKeyPassphrase:{type:'string',description:'the password used to decrpyt the private key'},registry:{type:'string',description:'the address of the server registry used in order to update the nodeList'},registryRPC:{type:'string',description:'the url of the client in case the registry is not on the same chain.'},autoRegistry:{type:'object',required:['url','deposit'],properties:{url:{type:'string',description:'the public url to reach this node'},deposit:{type:'number',description:'the deposit you want ot store'},depositUnit:{type:'string',description:'unit of the deposit value',enum:['ether','finney','szabo','wei']},capabilities:{type:'object',properties:{proof:{type:'boolean',description:'if true, this node is able to deliver proofs',flag:1},multiChain:{type:'boolean',description:'if true, this node is able to deliver multiple chains',flag:2}}}}}}}}}},IN3RPCHandlerConfig:{type:'object',description:'the configuration for the rpc-handler',required:['rpcUrl','privateKey','registry'],properties:{handler:{type:'string',description:'the impl used to handle the calls',enum:['eth','ipfs','btc']},rpcUrl:{type:'string',description:'the url of the client'},minBlockHeight:{type:'integer',description:'the minimal blockheight in order to sign'},persistentFile:{type:'string',description:'the filename of the file keeping track of the last handled blocknumber'},watchInterval:{type:'integer',description:'the number of seconds of the interval for checking for new events'},privateKey:{type:'string',description:'the private key used to sign blockhashes. this can be either a 0x-prefixed string with the raw private key or the path to a key-file.'},privateKeyPassphrase:{type:'string',description:'the password used to decrpyt the private key'},registry:{type:'string',description:'the address of the server registry used in order to update the nodeList'},registryRPC:{type:'string',description:'the url of the client in case the registry is not on the same chain.'},autoRegistry:{type:'object',required:['url','deposit'],properties:{url:{type:'string',description:'the public url to reach this node'},deposit:{type:'number',description:'the deposit you want ot store'},depositUnit:{type:'string',description:'unit of the deposit value',enum:['ether','finney','szabo','wei']},capabilities:{type:'object',properties:{proof:{type:'boolean',description:'if true, this node is able to deliver proofs',flag:1},multiChain:{type:'boolean',description:'if true, this node is able to deliver multiple chains',flag:2}}}}}}}}

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