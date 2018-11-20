import { bytes, rlp, Block, hash, address, BlockData } from './serialize'
import { toHex, toNumber } from './util'
import DeltaHistory from './DeltaHistory'
import { rawDecode } from 'ethereumjs-abi'
import { recover } from 'secp256k1'
import { publicToAddress } from 'ethereumjs-util'
import ChainContext from '../client/chainContext'
import { ChainSpec } from '../types/types'
import { RPCRequest, RPCResponse } from '..';

/**
 * verify a Blockheader and returns the percentage of finality
 * @param blocks 
 * @param getChainSpec 
 */
export async function checkBlockSignatures(blockHeaders:(Buffer | string | BlockData | Block)[], getChainSpec:(data:Block)=>Promise<{
  spec:ChainSpec
  authorities: Buffer[]
  proposer: Buffer
}>) {
  // parse blockHeaders
  const blocks = blockHeaders.map(_=> _ instanceof Block ? _ : new Block(_))

  // order blocks to make sure their hashes are connected
  for (let i=1;i<blocks.length;i++) {
    if (!blocks[i-1].hash().equals(blocks[i].parentHash))
      throw new Error('The finality-Block does match the parentHash')
  }

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
    const signer = getSigner(data)

    if (!signer || !data.coinbase.equals(signer))
      throw new Error('Wrong signature for the blockheader')

    const s = data.coinbase.toString('hex')
    if (signatures.indexOf(s)<0) signatures.push(s)
  }))

  // return the finality as percent
  return Math.round(signatures.length * 100 / chainSpec.authorities.length)
  
}

export function getSigner(data: Block):Buffer {
  const signature: Buffer = data.sealedFields[1];
  const message = data.sealedFields.length === 3 ? hash(Buffer.concat([data.bareHash(), rlp.encode(data.sealedFields[2])])) : data.bareHash();
  return publicToAddress(recover(message, signature.slice(0, 64), signature[64]), true);
}

/**
 *  find the authorities able to sign for the given blocknumber
 * @param chainSpec
 * @param blockNumner 
 * @param handle 
 */
export async function getAuthorities(chainSpec:ChainSpec, blockNumner:number, handle:(req:Partial<RPCRequest>)=>Promise<RPCResponse> ):Promise<Buffer[]> {
  let authorities:string[] = null

  if (chainSpec && chainSpec.validatorList)
     authorities = chainSpec.validatorList
  else {
      // call getValidators
      // currently we get it without proof, because we could not validate the blockheader of this call
      const res = await handle( {method:'eth_call',params:[{to:chainSpec.validatorContract,data:'0xb7ab4db5'}, '0x'+blockNumner.toString(16)]})
      if (res.result) 
          authorities = rawDecode(['address[]'],Buffer.from( res.result.substr(2) ,'hex'))[0].map(_=>Buffer.from(_,'hex'))
      else 
          throw new Error('Could not read the validators from the ValidatorContract '+ res.error)
  }
  
  return authorities && authorities.map(address)
}


export async function getChainSpec(b:Block, ctx:ChainContext):Promise<{ authorities:Buffer[], spec:ChainSpec, proposer:Buffer}> {

  let validators: DeltaHistory<string> = null
  const cache = ctx.getFromCache('validators')
  if (cache) {
    try {
      validators = new DeltaHistory<string>(JSON.parse(cache),true)
    }
    catch (x) {}
  }

  // no validators in the cache yet, so we have to find them,.
  if (!validators) {
    // TODO:at the moment we get the validators only for the current block and use them for all without verification
    validators = new DeltaHistory<string>(await getAuthorities(ctx.chainSpec, toNumber( b.number) ,r=>ctx.client.sendRPC(r.method, r.params,ctx.chainId,{proof:'none'})).then(_=>_.map(toHex)))
    ctx.putInCache('validators', JSON.stringify(validators.toDeltaStrings()))
  }

  // get the current validator-list for the block
  const res:any= { authorities : validators.getData(toNumber(b.number)).map(address) , spec:ctx.chainSpec}

  // find out who is able to sign with this nonce
  res.proposer = res.authorities[b.sealedFields[0].readUInt32BE(0) % res.authorities.length]

  return res
}