const ipfsClient = require('ipfs-http-client')
const bs58 = require('bs58')
import {verifyIPFSHash} from './ipfs'

export default class API{
  ipfs: any

  constructor(url: string){
    this.ipfs = new ipfsClient(url)
  }

  get(hash: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.ipfs.get(hash, (err, files) => {
        if(!err) {
          resolve(files[0].content)
        }
        else {
          reject(err)
        }
      })
    })
  }

  put(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.ipfs.add(data, (err, results) => {
        if(!err){
          const hash = results[0].hash
          if(verifyIPFSHash(data, 'buffer', hash))
            resolve(bs58.decode(hash))
          else
            reject('verification failed')
        }
        else {
          reject(err)
        }
      })
    })
  }
}
