import Client from '../src/client/Client'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import args from 'args'

const app = new Koa()

const config = {
  port:8545,
  verbose : 2,
  rpccorsdomain:'*'
}
const client = new Client({})

app.use(bodyParser())
app.use(async (ctx, next) => {
   // handle cors
   ctx.set('Access-Control-Allow-Origin', config.rpccorsdomain)
   ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  
   if (ctx.request.method === 'OPTIONS') {
    ctx.body = ''
    ctx.status = 200
    return
  }

  if (ctx.request.method === 'POST') {
    const r = ctx.request.body
    const m =  Array.isArray(r)?r[0].method:r.method
    try {
      const s = Date.now()
      ctx.body = await client.send(r)
      ctx.status = 200
      if (config.verbose==2) 
        console.log('RPC '+m+' '+(Date.now()-s)+' ms')
    }
    catch ( ex ) {
      ctx.body = ex.message
      ctx.status = 500
      if (config.verbose) 
        console.error('RPC '+ m+' failed : '+ex.message)
    }
    return
  }
  else {
    ctx.body = 'Invalid Method'
    ctx.status = 400
  }
})

app.listen(config.port || 8545, () => console.log(`in3-client started on ${config.port || 8545}`))

client.sendRPC('in3_nodeList').then(_=>console.log(  'NodeList updated for '+_.result.nodes.length+' nodes '  ),err=>console.error('Error updateing the nodelist'))

client.on('error',err=>console.error('Error : ',err))
