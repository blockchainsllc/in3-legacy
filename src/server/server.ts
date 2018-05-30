
// tslint:disable-next-line:missing-jsdoc
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import * as logger from 'winston'
import * as rpc from './rpc'
import { RPCRequest } from '../types/config'
import config from './config'

export const app = new Koa()
const router = new Router()
app.use(bodyParser())
router.post('/', async ctx => {
  try {
    const res = await rpc.handle(Array.isArray(ctx.request.body) ? ctx.request.body : [ctx.request.body])
    ctx.body = Array.isArray(ctx.request.body) ? res : res[0]
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    logger.error('Error handling ' + ctx.request.url + ' : (' + JSON.stringify(ctx.request.body, null, 2) + ') : ' + err + '\n' + err.stack)
    ctx.app.emit('error', err, ctx)
  }

})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.port || 8500, () => logger.info(`http server listening on ${config.port || 8500}`))


setTimeout(() => rpc.updateNodelists().catch(logger.error))