    /**
     * the definition of the config-file.
     */
    export interface IN3Config {
        /**
         * the address of the registry contract
         */
        contract?: string;
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
         * the requested chainId
         */
        in3ChainId?: string;
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
        in3Proof?: {
            [name: string]: any[] | {
            } | string | number;
        };
        /**
         * the node handling this response
         */
        in3Node?: IN3NodeConfig;
    }
