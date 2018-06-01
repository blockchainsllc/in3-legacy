import * as fs from 'fs'
// defaults for the config
const config = {
  //  rpcUrl: 'https://mainnet.infura.io/HVtVmCIHVgqHGUgihfhX',
  rpcUrl: 'https://kovan.infura.io/HVtVmCIHVgqHGUgihfhX', //'http://localhost:8545',
  privateKey: '',
  port: 8500,
  minBlockHeight: 6,
  registry: '0x013b82355a066A31427df3140C5326cdE9c64e3A', // registry-contract
  registryRPC: 'https://kovan.infura.io/HVtVmCIHVgqHGUgihfhX',
  client: 'parity', // parity_proofed,
  chainIds: ['0x2a']
}

// take the config from config.json and overwrite it
try {
  Object.assign(config, JSON.parse(fs.readFileSync('config.json', 'utf-8')))
}
catch (err) {
  console.error('no config found (' + err + ')! using defaults')
}

export default config