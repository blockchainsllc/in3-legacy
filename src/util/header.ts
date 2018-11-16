import { bytes, rlp, Block, hash, address, BlockData } from './serialize';
import { recover } from 'secp256k1'
import { publicToAddress } from 'ethereumjs-util'
import ChainContext from '../client/chainContext';
import { ChainSpec } from '../../js/src/types/types';

/**
 * verify a Blockheader and returns the percentage of finality
 * @param blocks 
 * @param getChainSpec 
 */
export async function checkBlockSignatures(blockHeaders:(Buffer | string | BlockData)[], getChainSpec:(data:Block)=>Promise<{
  spec:ChainSpec
  authorities: Buffer[]
  proposer: Buffer
}>) {
  // parse blockHeaders
  const blocks = blockHeaders.map(_=>new Block(_))

  // authority_round
  const chainSpec = await getChainSpec(blocks[0])
  const signatures=[]

  // we only check signatures for authorityRound
  if (!chainSpec || !chainSpec.spec || chainSpec.spec.engine!=='authorityRound') return 0

  // process all blockheaders and collect their signatures
  await Promise.all(blocks.map(async data=> {

    // read the current Validators
    const chain = data === blocks[0] ? chainSpec : await getChainSpec(data)

    // author needs to be a authority
    if ((chain.proposer && !chain.proposer.equals(data.coinbase)) || !chain.authorities.find(_=>data.coinbase.equals(_)))
      throw new Error('the author is not part of the authorities')

    // check signature
    const signature:Buffer = data.sealedFields[1]
    const message = data.sealedFields.length === 3 ? hash( Buffer.concat([ data.bareHash(),rlp.encode(data.sealedFields[2]) ] ) ) : data.bareHash()
    const signer = publicToAddress ( recover(message, signature.slice(0,64), signature[64]), true )

    if (!signer || !data.coinbase.equals(signer))
      throw new Error('Wrong signature for the blockheader')

    const s = data.coinbase.toString('hex')
    if (signatures.indexOf(s)<0) signatures.push(s)
  }))

  // return the finality as percent
  return Math.round(signatures.length * 100 / chainSpec.authorities.length)
  
}



export async function getChainSpec(b:Block, ctx:ChainContext) {

  let authorities:string[] = null

  if (ctx.chainSpec && ctx.chainSpec.validatorList)
     authorities = ctx.chainSpec.validatorList
  else {
    const cache = ctx.getFromCache('validators')
    if (!cache) {
       ctx.client.sendRPC('eth_call')

    }


  }
  



  const res:any= {  }

  const nonce = b.sealedFields[0].readUInt32BE(0)
  a.proposer = a.authorities[nonce % a.authorities.length]
  return a
}