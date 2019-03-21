/***********************************************************
* This file is part of the Slock.it IoT Layer.             *
* The Slock.it IoT Layer contains:                         *
*   - USN (Universal Sharing Network)                      *
*   - INCUBED (Trustless INcentivized remote Node Network) *
************************************************************
* Copyright (C) 2016 - 2018 Slock.it GmbH                  *
* All Rights Reserved.                                     *
************************************************************
* You may use, distribute and modify this code under the   *
* terms of the license contract you have concluded with    *
* Slock.it GmbH.                                           *
* For information about liability, maintenance etc. also   *
* refer to the contract concluded with Slock.it GmbH.      *
************************************************************
* For more information, please refer to https://slock.it   *
* For questions, please contact info@slock.it              *
***********************************************************/

import Client from '../src/client/Client'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { IN3ConfigDefinition } from '../src/types/types'
import * as fs from 'fs'

const app = new Koa()

const config = {
  port: 8545,
  verbose: 2,
  rpccorsdomain: '*'
}

const initConf = {}
try {
  Object.assign(initConf, JSON.parse(fs.readFileSync('config.json', 'utf8')))
  console.log('read config.json')
}
catch  { }
const client = new Client(initConf)

if (process.argv.length > 2) {
  handleArgs(process.argv, client.config)
  client.config = client.config
}

//console.log('client config:' + JSON.stringify(client.defConfig, null, 2))

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
    const m = Array.isArray(r) ? r[0].method : r.method
    try {
      const s = Date.now()
      ctx.body = await client.send(r)
      ctx.status = 200
      if (config.verbose == 2)
        console.log('RPC ' + m + ' ' + (Date.now() - s) + ' ms')
    }
    catch (ex) {
      ctx.body = ex.message
      ctx.status = 500
      if (config.verbose)
        console.error('RPC ' + m + ' failed : ' + ex.message)
    }
    return
  }
  else {
    ctx.body = 'Invalid Method'
    ctx.status = 400
  }
})

app.listen(config.port || 8545, () => console.log(`in3-client started on ${config.port || 8545}`))

client.sendRPC('in3_nodeList').then(_ => console.log('NodeList updated for ' + _.result.nodes.length + ' nodes '), err => console.error('Error updateing the nodelist :' + err))

client.on('error', err => console.error('Error : ', err))

function handleArgs(params?: string[], clientConf: any = {}) {

  if ((params || process.argv).indexOf('help') >= 0) {
    const pad = a => {
      while (a.length < 20) a += ' '
      return a
    }
    const show = (o, pre) => {
      const req = o.required || [] as string[]
      if (!o.properties) return

      for (const p of Object.keys(o.properties)) {
        const d = o.properties[p]
        if (d.type === 'object')
          show(d, pre + p + '.')
        else
          console.log('  ' + pad('--' + pre + p) + ' : ' + (d.description || ''))
      }

    }
    show(IN3ConfigDefinition, '')

    process.exit(0)
  }

  (params || process.argv)
    .filter(_ => _.startsWith('--') && _.indexOf('=') > 0)
    .forEach(arg => {
      const [key, val] = arg.substr(2).split('=')
      if (key === 'v')
        config.verbose = parseInt(val)
      else if (key === 'cors')
        config.rpccorsdomain = val
      else
        key.split('.').reduce(
          (p, n, i, a) => a.length === i + 1
            ? (Array.isArray(p[n])
              ? p[n] = val.split(',')
              : (p[n] = typeof p[n] === 'number'
                ? parseInt(val)
                : typeof p[n] === 'boolean' ? val === 'true' : val))
            : (p[n] || (p[n] = {})),
          clientConf)
    })
}
