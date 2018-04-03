import * as p2p from 'ethereumjs-devp2p'
//import * as Buffer from 'buffer'

const key = '012345678901234567890123456789012345678901234567890123456789abcd'
const bootnode = 'enode://3fd3304226ee8446c0b5dd3335d20f36bff930d015f0e5fa7023a63907c14849c39813edcb72f5411d231438a1b4c460bebf8217599396cf5d342008223d8e30@188.68.54.252:30333'
const Buffer = require('safe-buffer').Buffer

const BOOTNODES = require('ethereum-common').bootstrapNodes.map((node) => {
  return {
    address: node.ip,
    udpPort: node.port,
    tcpPort: node.port
  }
})

const dpt = new p2p.DPT(Buffer.from(key, 'hex'), {
  endpoint: {
    address: '0.0.0.0',
    udpPort: null,
    tcpPort: null
  }
})

dpt.on('error', (err) => console.error(err.stack || err))

dpt.on('peer:added', (peer) => {
  const info = `(${peer.id.toString('hex')},${peer.address},${peer.udpPort},${peer.tcpPort})`
  console.log(`New peer: ${info} (total: ${dpt.getPeers().length})`)
})

dpt.on('peer:removed', (peer) => {
  console.log(`Remove peer: ${peer.id.toString('hex')} (total: ${dpt.getPeers().length})`)
})

// for accept incoming connections uncomment next line
// dpt.bind(30303, '0.0.0.0')

for (let bootnode of BOOTNODES) {
  dpt.bootstrap(bootnode).catch((err) => console.error(err.stack || err))
}










async function run() {
  const peer = new p2p.DPT(Buffer.from(key, 'hex'), {
    endpoint: {
      address: '0.0.0.0'
    }
  })
  peer.on('peer:added', _ => console.log('peer-added :', _))
  peer.on('peer:removed', _ => console.log('peer-removed :', _))
  peer.on('peer:new', _ => console.log('peer-new :', _))
  peer.on('listening', _ => console.log('listening :', _))
  peer.on('error', _ => console.log('perror :', _))
  console.log('created')

  await peer.addPeer({ address: '188.68.54.252', udpPort: 30333, tcpPort: 30333 })
}

//run().then(console.log, console.log)