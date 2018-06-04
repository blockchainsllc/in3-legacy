
// tslint:disable-next-line:missing-jsdoc
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import * as logger from 'winston'
import * as rpc from './rpc'
import { RPCRequest } from '../types/config'
import config from './config'
import * as cbor from '../types/cbor'

export const app = new Koa()
const router = new Router()

// handle cbor-encoding
app.use(async (ctx, next) => {
  const format = ctx.headers['content-type']
  if (format && format === 'application/cbor') {
    const body = await new Promise((res, rej) => {
      const bufs = []
      ctx.req.on('data', d => bufs.push(d))
      ctx.req.on('end', () => {
        res(ctx.request.body = cbor.decodeRequests(Buffer.concat(bufs)))
      })

    })
    await next()
    if ((ctx.status || 200) === 200) {
      ctx.set('content-type', 'application/cbor')
      ctx.body = cbor.encodeResponses(ctx.body)
    }
    return
  }
  await next()
})

// handle json
app.use(bodyParser())

router.post('/', async ctx => {
  try {
    const res = cbor.createRefs(await rpc.handle(Array.isArray(ctx.request.body) ? ctx.request.body : [ctx.request.body]))
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

// after starting the server, we should make sure our nodelist is up-to-date.
setTimeout(() => rpc.updateNodelists().catch(logger.error)


)