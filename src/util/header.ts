import { bytes, rlp, Block, hash, address, BlockData } from './serialize';
import { recover } from 'secp256k1'
import { publicToAddress } from 'ethereumjs-util'

/**
 * verify a Blockheader and returns the percentage of finality
 * @param blocks 
 * @param getChainSpec 
 */
export async function checkBlockSignatures(blockHeaders:(Buffer | string | BlockData)[], getChainSpec:(data:Block)=>Promise<{
  authorities: Buffer[]
  proposer: Buffer
}>) {
  // parse blockHeaders
  const blocks = blockHeaders.map(_=>new Block(_))

  // authority_round
  const chainSpec = await getChainSpec(blocks[0])
  const signatures=[]

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



export async function getChainSpec(b:Block) {
  const a:any= {
    authorities:[
'0x4ba15b56452521c0826a35a6f2022e1210fc519b',
'0xb5e8c1bf705f10bf4531941600f7d0a5bab7f5e8',
'0x6a2b1a140ad141ef571e91d9ed2b2fc6fa294317',
'0xd778a79ed8c7da5845bc3af0a14f4c73faede798',
'0xa0fc126bf3423e36001a33395ff42c14f2017733',
'0x68766b52c86b237dec0c334a5b9e4d825e265c8e',
'0x419d94ff81a1138710ddd98ef5743c2b3d31c4e0',
'0x23ef0e2552f07d793a8676c25350790a0116d68a',
'0xbe20508bf4c43688a8aa4ea45f0afcf4092d990b',
'0x3616ecf432fc1c075c50b10cdfecc3107236b6ff',
'0x78d0558d9489e7f846a0cf9f40b1d917244615e2',
'0x5fa6916603630fb3554780d5077c967ecd1fc78f',
'0x0fba77c504235f2b843a6f68909de6e5253b0a45',
'0xc6daf646d4c5ca352bac508ed6776e565d46c7c1'
    ].map(address)
  }

  const nonce = b.sealedFields[0].readUInt32BE(0)
  a.proposer = a.authorities[nonce % a.authorities.length]
  return a
}