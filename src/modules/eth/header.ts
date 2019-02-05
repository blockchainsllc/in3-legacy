import { bytes, toBlockHeader, rlp, Block, hash, address, BlockData } from './serialize'
import { toHex, toNumber } from '../../util/util'
import DeltaHistory from '../../util/DeltaHistory'
import { rawDecode } from 'ethereumjs-abi'
import { recover } from 'secp256k1'
import { publicToAddress } from 'ethereumjs-util'
import ChainContext from '../../client/ChainContext'
import { ChainSpec } from '../../types/types'
import { RPCRequest, RPCResponse } from '../..';

/**
 * verify a Blockheader and returns the percentage of finality
 * @param blocks 
 * @param getChainSpec 
 */
export async function checkBlockSignatures(blockHeaders: (Buffer | string | BlockData | Block)[], getChainSpec: (data: Block) => Promise<{
  spec: ChainSpec
  authorities: Buffer[]
  proposer: Buffer
}>) {
  // parse blockHeaders
  const blocks = blockHeaders.map(_ => _ instanceof Block ? _ : new Block(_))

  // order blocks to make sure their hashes are connected
  for (let i = 1; i < blocks.length; i++) {
    if (!blocks[i - 1].hash().equals(blocks[i].parentHash))
      throw new Error('The finality-Block does match the parentHash')
  }

  // authority_round
  const chainSpec = await getChainSpec(blocks[0])
  const signatures = []

  // we only check signatures for authorityRound
  if (!chainSpec || !chainSpec.spec || (chainSpec.spec.engine !== 'authorityRound' && chainSpec.spec.engine !== 'clique')) return 0

  // process all blockheaders and collect their signatures
  await Promise.all(blocks.map(async data => {

    // read the current Validators
    const chain = data === blocks[0] ? chainSpec : await getChainSpec(data)

    let signer: Buffer = null
    if (chainSpec.spec.engine === 'clique') {
      signer = getCliqueSigner(new Block(data.serializeHeader()))
      if (!chain.authorities.find(_ => signer.equals(_))) throw new Error('the author is not part of the authorities')
    }
    else {
      // author needs to be a authority
      if ((chain.proposer && !chain.proposer.equals(data.coinbase)) || !chain.authorities.find(_ => data.coinbase.equals(_)))
        throw new Error('the author is not part of the authorities')

      // check signature
      signer = getSigner(data)

      if (!signer || !data.coinbase.equals(signer))
        throw new Error('Wrong signature for the blockheader')
    }

    const s = signer.toString('hex')
    if (signatures.indexOf(s) < 0) signatures.push(s)
  }))

  // return the finality as percent
  return Math.round(signatures.length * 100 / chainSpec.authorities.length)

}

export function getSigner(data: Block): Buffer {
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
export async function getAuthorities(chainSpec: ChainSpec, blockNumner: number, handle: (req: Partial<RPCRequest>) => Promise<RPCResponse>): Promise<Buffer[]> {
  let authorities: string[] = null

  if (chainSpec && chainSpec.validatorList)
    authorities = chainSpec.validatorList
  else {
    // call getValidators
    // currently we get it without proof, because we could not validate the blockheader of this call
    const res = await handle({ method: 'eth_call', params: [{ to: chainSpec.validatorContract, data: '0xb7ab4db5' }, '0x' + blockNumner.toString(16)] })
    if (res.result)
      authorities = rawDecode(['address[]'], Buffer.from(res.result.substr(2), 'hex'))[0].map(_ => Buffer.from(_, 'hex'))
    else
      throw new Error('Could not read the validators from the ValidatorContract ' + res.error)
  }

  return authorities && authorities.map(address)
}


interface HistoryEntry {
  validators: string[]
  block: number
  proof: string[]
}
function getCliqueSigner(data: Block): Buffer {
  const sig = data.extra.slice(data.extra.length - 65, data.extra.length)
  data.raw[12] = data.extra.slice(0, data.extra.length - 65)
  return publicToAddress(recover(data.hash(), sig.slice(0, 64), sig[64]), true);
}



function addCliqueValidators(history: DeltaHistory<string>, ctx: ChainContext, states: HistoryEntry[]) {
  const epoch = (ctx.chainSpec as any).epoch || 30000
  for (const s of states) {
    const current = [...history.getData(s.block)]
    if (JSON.stringify(current) === JSON.stringify(s.validators)) continue
    const add = s.validators.length > current.length
    const ep = Math.floor(s.block / epoch)
    let proofCount = 0
    let newValidator: Buffer = null
    let verified = false

    for (const p of s.proof) {
      const block = new Block(p)
      const signer = '0x' + getCliqueSigner(block).toString('hex')
      if (current.indexOf(signer) < 0) continue // this is no proof!
      if (block.sealedFields[1].toString('hex') !== (add ? 'ffffffffffffffff' : '0000000000000000')) continue // wrong proof
      if (Math.floor(toNumber(block.number) / epoch) != ep) continue // wrong epoch 
      if (block.coinbase.toString('hex') == '0000000000000000000000000000000000000000') continue // wrong validator
      if (!newValidator)
        newValidator = block.coinbase
      else if (!newValidator.equals(block.coinbase)) continue // wrong validator

      proofCount++
      if (proofCount == Math.floor(current.length / 2) + 1) {
        const nv = '0x' + newValidator.toString('hex')
        verified = add
          ? (current.indexOf(nv) < 0 && s.validators.indexOf(nv) >= 0)
          : (current.indexOf(nv) >= 0 && s.validators.indexOf(nv) < 0)
        break
      }
    }

    if (verified)
      history.addState(s.block, s.validators)

  }


}

export async function getChainSpec(b: Block, ctx: ChainContext): Promise<{ authorities: Buffer[], spec: ChainSpec, proposer: Buffer }> {


  let validators: DeltaHistory<string> = null
  const cache = ctx.getFromCache('validators')
  if (cache) {
    try {
      validators = new DeltaHistory<string>(JSON.parse(cache), true)
    }
    catch (x) { }
  }

  // no validators in the cache yet, so we have to find them,.
  if (!validators) {
    if (ctx.chainSpec.engine == 'clique') {
      validators = new DeltaHistory<string>((ctx.chainSpec as any).genesisValidatorList, false)
      const list = await ctx.client.sendRPC('in3_validatorlist', [], ctx.chainId, { proof: 'none' })
      addCliqueValidators(validators, ctx, list.result && list.result.states)
    }
    else
      // TODO:at the moment we get the validators only for the current block and use them for all without verification
      validators = new DeltaHistory<string>(await getAuthorities(ctx.chainSpec, toNumber(b.number), r => ctx.client.sendRPC(r.method, r.params, ctx.chainId, { proof: 'none' })).then(_ => _.map(toHex)))
    ctx.putInCache('validators', JSON.stringify(validators.toDeltaStrings()))
  }

  // get the current validator-list for the block
  const res: any = { authorities: validators.getData(toNumber(b.number)).map(address), spec: ctx.chainSpec }

  // find out who is able to sign with this nonce
  res.proposer = res.authorities[(ctx.chainSpec.engine == 'clique' ? toNumber(b.number) : b.sealedFields[0].readUInt32BE(0)) % res.authorities.length]

  if (ctx.chainSpec.engine == 'clique' && toNumber(b.difficulty) === 1) res.proposer = null

  return res
}