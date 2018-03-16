"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:missing-jsdoc
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const logger = require("winston");
const rpc = require("./rpc");
exports.app = new Koa();
const router = new Router();
exports.app.use(bodyParser());
router.post('/', async (ctx) => {
    try {
        const res = await rpc.handle(Array.isArray(ctx.request.body) ? ctx.request.body : [ctx.request.body]);
        ctx.body = Array.isArray(ctx.request.body) ? res : res[0];
    }
    catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        logger.error('Error handling ' + ctx.request.url + ' : (' + JSON.stringify(ctx.request.body, null, 2) + ') : ' + err + '\n' + err.stack);
        ctx.app.emit('error', err, ctx);
    }
});
//# sourceMappingURL=server.js.map