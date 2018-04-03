const devp2p = require('ethereumjs-devp2p')
const util = require('ethereumjs-util')
const EthereumBlock = require('ethereumjs-block')
const ms = require('ms')
const chalk = require('chalk')
const assert = require('assert')
const { randomBytes } = require('crypto')


const PRIVATE_KEY = randomBytes(32)
const CHAIN_ID = 42 // Kovan
const GENESIS_TD = 1
const GENESIS_HASH = Buffer.from('a3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9', 'hex')

const BOOTNODES = [{ address: '188.68.54.252', udpPort: 30333, tcpPort: 30333 }]

//const REMOTE_CLIENTID_FILTER = ['go1.5', 'go1.6', 'go1.7', 'Geth/v1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain']

const getPeerAddr = peer => `${peer._socket.remoteAddress}:${peer._socket.remotePort}`

// DPT
const dpt = new devp2p.DPT(PRIVATE_KEY, {
  refreshInterval: 30000,
  endpoint: {
    address: '0.0.0.0',
    udpPort: null,
    tcpPort: null
  }
})

dpt.on('error', (err) => console.error(chalk.red(`DPT error: ${err}`)))

// RLPx
const rlpx = new devp2p.RLPx(PRIVATE_KEY, {
  dpt: dpt,
  maxPeers: 25,
  capabilities: [
    devp2p.ETH.eth63,
    devp2p.ETH.eth62
  ],
  listenPort: null
})

rlpx.on('error', (err) => console.error(chalk.red(`RLPx error: ${err.stack || err}`)))

rlpx.on('peer:added', (peer) => {
  const addr = getPeerAddr(peer)
  const les = peer.getProtocols()[0]
  const requests = { headers: [], bodies: [] }

  const clientId = peer.getHelloMessage().clientId
  console.log(chalk.green(`Add peer: ${addr} ${clientId} (les${les.getVersion()}) (total: ${rlpx.getPeers().length})`))

  les.on('message', async (code, payload) => {
    const pl = payload.map(_ => Buffer.from(_).toString('hex'))
    if (code === 0) {
      console.log('received Status for chain ' + parseInt('0x' + pl[1])
        + '\n   totalDifficulty: ' + parseInt('0x' + pl[2])
        + '\n   bestHash   : ' + pl[3]
        + '\n   genisisHash: ' + pl[4]
      )
    }
    else
      console.log('received 0x' + code.toString(16) + ' \n' + payload.map(_ => '  ' + Buffer.from(_).toString('hex')).join('\n'))
  })
})

rlpx.on('peer:removed', (peer, reasonCode, disconnectWe) => {
  const who = disconnectWe ? 'we disconnect' : 'peer disconnect'
  const total = rlpx.getPeers().length
  console.log(chalk.yellow(`Remove peer: ${getPeerAddr(peer)} - ${who}, reason: ${peer.getDisconnectPrefix(reasonCode)} (${String(reasonCode)}) (total: ${total})`))
})

rlpx.on('peer:error', (peer, err) => {
  if (err.code === 'ECONNRESET') return

  if (err instanceof assert.AssertionError) {
    const peerId = peer.getId()
    if (peerId !== null) dpt.banPeer(peerId, ms('5m'))

    console.error(chalk.red(`Peer error (${getPeerAddr(peer)}): ${err.message}`))
    return
  }

  console.error(chalk.red(`Peer error (${getPeerAddr(peer)}): ${err.stack || err}`))
})

for (let bootnode of BOOTNODES) {
  dpt.bootstrap(bootnode).catch((err) => {
    console.error(chalk.bold.red(`DPT bootstrap error: ${err.stack || err}`))
  })
}

setInterval(() => {
  const peersCount = dpt.getPeers().length
  const openSlots = rlpx._getOpenSlots()
  const queueLength = rlpx._peersQueue.length
  const queueLength2 = rlpx._peersQueue.filter((o) => o.ts <= Date.now()).length

  console.log(chalk.yellow(`Total nodes in DPT: ${peersCount}, open slots: ${openSlots}, queue: ${queueLength} / ${queueLength2}`))
}, ms('30s'))