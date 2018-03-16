export interface Proof {
    type: 'transactionProof';
    block: string;
    merkelProve?: string[];
    txIndex?: any;
    signature: {
        msgHash: string;
        v: string;
        r: string;
        s: string;
    };
}
export declare function getBlock(b: any): any;
export declare function blockToHex(block: any): any;
export declare function blockFromHex(hex: any): any;
export declare function verifyBlock(b: any, signature: any, expectedSigner: any): void;
export declare function createTransactionProof(block: any, txHash: any, signature: any): Promise<Proof>;
export declare function verifyTransactionProof(txHash: string, proof: Proof, expectedSigner: string): Promise<{}>;
export declare const dummy: {
    "difficulty": string;
    "extraData": string;
    "gasLimit": number;
    "gasUsed": number;
    "hash": string;
    "logsBloom": string;
    "miner": string;
    "mixHash": string;
    "nonce": string;
    "number": number;
    "parentHash": string;
    "receiptsRoot": string;
    "sha3Uncles": string;
    "size": number;
    "stateRoot": string;
    "timestamp": number;
    "totalDifficulty": string;
    "transactions": {
        "blockHash": string;
        "blockNumber": number;
        "from": string;
        "gas": number;
        "gasPrice": string;
        "hash": string;
        "input": string;
        "nonce": number;
        "to": string;
        "transactionIndex": number;
        "value": string;
        "v": string;
        "r": string;
        "s": string;
    }[];
    "transactionsRoot": string;
    "uncles": any[];
};
