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
        format?: "json" | "cbor"
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
     * a config of a n3-node.
     */
    export interface IN3NodeConfig {
        /**
         * the index within the contract
         */
        index?: number
        /**
         * the address of the node, which is the public address it iis signing with.
         */
        address: string
        /**
         * the endpoint to post to
         */
        url: string
        /**
         * the list of supported chains
         */
        chainIds: string /* ^0x[0-9a-fA-F]+$ */ []
        /**
         * the deposit of the node
         */
        deposit: number
        /**
         * the properties of the node
         */
        props?: number
    }
    /**
     * a local weight of a n3-node.
     */
    export interface IN3NodeWeight {
        /**
         * factor the weight this noe (default 1.0)
         */
        weight?: number
        /**
         * number of uses.
         */
        responseCount?: number
        /**
         * average time of a response
         */
        avgResponseTime?: number
        /**
         * last price
         */
        pricePerRequest?: number
        /**
         * timestamp of the last request in ms
         */
        lastRequest?: number
        /**
         * blacklisted because of failed requests until the timestamp
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
        handler?: "eth" | "ipfs" | "btc"
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
         * the private key used to sign blockhashes
         */
        privateKey: string
        /**
         * the address of the server registry used in order to update the nodeList
         */
        registry: string
        /**
         * the url of the client in case the registry is not on the same chain.
         */
        registryRPC?: string
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
         * defines the kind of proof the client is asking for
         */
        verification?: "never" | "proof" | "proofWithSignature"
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
        type: "transactionProof" | "receiptProof" | "blockProof" | "accountProof" | "callProof" | "logProof"
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
        jsonrpc: "2.0"
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
        jsonrpc: "2.0"
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
