/*******************************************************************************
 * This file is part of the Incubed project.
 * Sources: https://github.com/slockit/in3
 * 
 * Copyright (C) 2018-2019 slock.it GmbH, Blockchains LLC
 * 
 * 
 * COMMERCIAL LICENSE USAGE
 * 
 * Licensees holding a valid commercial license may use this file in accordance 
 * with the commercial license agreement provided with the Software or, alternatively, 
 * in accordance with the terms contained in a written agreement between you and 
 * slock.it GmbH/Blockchains LLC. For licensing terms and conditions or further 
 * information please contact slock.it at in3@slock.it.
 * 	
 * Alternatively, this file may be used under the AGPL license as follows:
 *    
 * AGPL LICENSE USAGE
 * 
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY 
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * [Permissions of this strong copyleft license are conditioned on making available 
 * complete source code of licensed works and modifications, which include larger 
 * works using a licensed work, under the same license. Copyright and license notices 
 * must be preserved. Contributors provide an express grant of patent rights.]
 * You should have received a copy of the GNU Affero General Public License along 
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/


import Client from '../src/client/Client'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { IN3Config } from '../src/types/types'
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
    //    show(IN3ConfigDefinition, '')

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
