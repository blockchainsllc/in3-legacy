import * as fs from 'fs'

const config = {
  //  rpcUrl: 'https://mainnet.infura.io/HVtVmCIHVgqHGUgihfhX',
  rpcUrl: 'http://localhost:8545',
  privateKey: '',
  port: 8500,
  minBlockHeight: 6,
  registry: '' // registry-contract
}

try {
  Object.assign(config, JSON.parse(fs.readFileSync('config.json', 'utf-8')))
}
catch (err) {
  console.error('no config found (' + err + ')! using defaults')
}

export default config