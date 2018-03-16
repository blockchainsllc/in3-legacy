"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eth = require("./chains/eth");
async function handle(request) {
    return Promise.all(request.map(r => {
        const chainId = r.in3ChainId;
        //TODO check chainId....
        return eth.handle(r);
    }));
}
exports.handle = handle;
//# sourceMappingURL=rpc.js.map