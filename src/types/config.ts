    /**
     * the definition of the config-file.
     */
    export interface IN3Config {
        /**
         * if true, the in3-section of thr response will be kept. Otherwise it will be removed after validating the data.
         */
        keepIn3?: boolean;
        /**
         * if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
         */
        includeCode?: boolean;
        /**
         * if true the nodes should send a proof of the response
         */
        proof?: boolean;
        /**
         * number of signatures requested
         */
        signatureCount?: number;
        /**
         * min stake of the server. Only nodes owning at least this amount will be chosen.
         */
        minDeposit: number;
        /**
         * the number of request send when getting a first answer
         */
        requestCount: number;
        /**
         * specifies the number of milliseconds before the request times out.
         */
        timeout?: number;
        /**
         * servers to filter for the given chain. The chain-id based on EIP-155.
         */
        chainId: string; // ^0x[0-9a-fA-F]+$
        /**
         * main chain-registry contract
         */
        chainRegistry?: string; // ^0x[0-9a-fA-F]+$
        /**
         * main chain-id, where the chain registry is running.
         */
        mainChain?: string; // ^0x[0-9a-fA-F]+$
        /**
         * the nodelist per chain
         */
        servers?: {
            [name: string]: {
                /**
                 * the address of the registry contract
                 */
                contract?: string;
                /**
                 * the chainid for the contract
                 */
                contractChain?: string;
                /**
                 * the list of nodes
                 */
                nodeList?: IN3NodeConfig[];
                /**
                 * the list of authority nodes for handling conflicts
                 */
                nodeAuthorities?: string[];
                /**
                 * the weights of nodes depending on former performance
                 */
                weights?: {
                    [name: string]: IN3NodeWeight;
                };
            };
        };
    }
    /**
     * a config of a n3-node.
     */
    export interface IN3NodeConfig {
        /**
         * the address of the node, which is the public address it iis signing with.
         */
        address: string;
        /**
         * the endpoint to post to
         */
        url: string;
        /**
         * the list of supported chains
         */
        chainIds: string /* ^0x[0-9a-fA-F]+$ */ [];
        /**
         * the deposit of the node
         */
        deposit: number;
        /**
         * the properties of the node
         */
        props?: number;
    }
    /**
     * a local weight of a n3-node.
     */
    export interface IN3NodeWeight {
        /**
         * factor the weight this noe (default 1.0)
         */
        weight?: number;
        /**
         * number of uses.
         */
        responseCount?: number;
        /**
         * average time of a response
         */
        avgResponseTime?: number;
        /**
         * last price
         */
        pricePerRequest?: number;
        /**
         * timestamp of the last request in ms
         */
        lastRequest?: number;
        /**
         * blacklisted because of failed requests until the timestamp
         */
        blacklistedUntil?: number;
    }
    /**
     * additional config for a IN§ RPC-Request
     */
    export interface IN3RPCRequestConfig {
        /**
         * the requested chainId
         */
        chainId?: string;
        /**
         * if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
         */
        includeCode?: boolean;
        /**
         * defines the kind of proof the client is asking for
         */
        verification?: "never" | "proof" | "proofWithSignature";
        /**
         * a list of addresses requested to sign the blockhash
         */
        signatures?: string /* ^0x[0-9a-fA-F]+$ */ [];
    }
    /**
     * additional config for a IN§ RPC-Request
     */
    export interface IN3ResponseConfig {
        proof?: {
            [name: string]: any[] | {
            } | string | number;
        };
        /**
         * the blocknumber for the last block updating the nodelist
         */
        lastNodeList?: number;
        /**
         * a list of addresses requested to sign the blockhash
         */
        signatures?: Signature[];
    }
    /**
     * a JSONRPC-Request with N3-Extension
     */
    export interface RPCRequest {
        /**
         * the version
         */
        jsonrpc: "2.0";
        /**
         * the method to call
         */
        method: string;
        /**
         * the id
         */
        id?: string | number;
        /**
         * the params
         */
        params?: any[] | {
        };
        /**
         * the IN3-Config
         */
        in3?: IN3RPCRequestConfig;
    }
    /**
     * a JSONRPC-Responset with N3-Extension
     */
    export interface RPCResponse {
        /**
         * the version
         */
        jsonrpc: "2.0";
        /**
         * the id matching the request
         */
        id: string | number;
        /**
         * in case of an error this needs to be set
         */
        error?: string;
        /**
         * the params
         */
        result?: any[] | {
            [name: string]: any[] | {
            } | string | number;
        } | string | number;
        /**
         * the IN3-Result
         */
        in3?: IN3ResponseConfig;
        /**
         * the node handling this response (internal only)
         */
        in3Node?: IN3NodeConfig;
    }
    export interface Signature {
        /**
         * the address of the signing node
         */
        address?: string;
        /**
         * the blocknumber
         */
        block?: number;
        /**
         * the hash of the block
         */
        blockHash?: string;
        /**
         * hash of the message
         */
        msgHash?: string; // bytes32
        /**
         * Positive non-zero Integer signature.r
         */
        r?: string; // hex
        /**
         * Positive non-zero Integer signature.s
         */
        s?: string; // hex
        /**
         * Calculated curve point, or identity element O.
         */
        v?: string; // hex
    }
