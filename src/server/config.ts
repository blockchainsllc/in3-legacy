import * as fs from 'fs'

const config = {
  rpcUrl: 'https://mainnet.infura.io/HVtVmCIHVgqHGUgihfhX',
  privateKey: '',
  port: 8500
}

try {
  Object.assign(config, JSON.parse(fs.readFileSync('config.json', 'utf-8')))
}
catch (err) {
  console.error('no config found (' + err + ')! using defaults')
}

export default config