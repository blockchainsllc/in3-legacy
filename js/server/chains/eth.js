"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const axios_1 = require("axios");
const ethereumjs_util_1 = require("ethereumjs-util");
const verify = require("../../client/verify");
let counter = 1;
async function handle(request) {
    if (request.method === 'eth_getTransactionByHash')
        return handeGetTransaction(request);
    return getFromServer(request);
}
exports.handle = handle;
function getFromServer(request) {
    if (!request.id)
        request.id = counter++;
    if (!request.jsonrpc)
        request.jsonrpc = '2.0';
    return axios_1.default.post(config_1.default.rpcUrl, request).then(_ => _.data);
}
async function handeGetTransaction(request) {
    const response = await getFromServer(request);
    const result = response && response.result;
    if (result.blockNumber) {
        const block = await getFromServer({ method: 'eth_getBlockByNumber', params: [verify.toHex(result.blockNumber), true] }).then(_ => _ && _.result);
        if (block)
            result.in3Proof = await verify.createTransactionProof(block, request.params[0], sign(block.hash, result.blockNumber));
    }
    return result;
}
function sign(blockHash, blockNumber) {
    const msgHash = ethereumjs_util_1.default.sha3('0x' + verify.toHex(blockHash).substr(2).padStart(64, '0') + verify.toHex(blockNumber).substr(2).padStart(64, '0'));
    return Object.assign({}, ethereumjs_util_1.default.ecsign(msgHash, ethereumjs_util_1.default.toBuffer(config_1.default.privateKey)), { msgHash: '0x' + msgHash.toString('hex') });
}
//# sourceMappingURL=eth.js.map