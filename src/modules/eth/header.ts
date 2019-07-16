import { bytes, bytes32, toBlockHeader, blockFromHex, rlp, Block, hash, address, BlockData, LogData } from './serialize'
import { toNumber, toHex } from '../../util/util'
import DeltaHistory from '../../util/DeltaHistory'
import verifyMerkleProof from '../../util/merkleProof'
import { rawDecode, rawEncode } from 'ethereumjs-abi'
import { recover } from 'secp256k1'
import { publicToAddress } from 'ethereumjs-util'
import ChainContext from '../../client/ChainContext'
import { ChainSpec, Proof, AuraValidatoryProof } from '../../types/types'
import { RPCRequest, RPCResponse } from '../..';

/** Authority specification for proof of authority chains */
export interface AuthSpec {
  /** List of validator addresses storead as an buffer array*/
  authorities: Buffer[],
  /** chain specification */
  spec: ChainSpec,
  /** proposer of the block this authspec belongs */
  proposer: Buffer
}

/**
 * verify a Blockheader and returns the percentage of finality
 * @param blocks
 * @param getChainSpec
 */
export async function checkBlockSignatures(blockHeaders: (Buffer | string | BlockData | Block)[], getChainSpec: (data: Block) => Promise<AuthSpec>) {
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
      if (!chain.authorities.find(_ => signer.equals(_))) throw new Error('the author is not part of the clique authorities')
    }
    else {
      // author needs to be a authority
      if (/*(chain.proposer && !chain.proposer.equals(data.coinbase)) || */!chain.authorities.find(_ => data.coinbase.equals(_)))
        throw new Error('the author is not part of the aura authorities')

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

interface HistoryEntry {
  validators: string[]
  block: number
  proof: AuraValidatoryProof | string[]
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

    for (const p of s.proof as string[]) {
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

async function addAuraValidators(history: DeltaHistory<string>, ctx: ChainContext, states: HistoryEntry[], contract: string) {
  for (const s of states) {
    //skip the current block if already added in the delta
    const current = history.getData(s.block).map(h => address(h.startsWith('0x') ? h : '0x' + h))
    if (Buffer.concat(current).equals(Buffer.concat(s.validators.map(address)))) continue

    if (!s.proof) throw new Error('The validator list has no proof')
    const proof = s.proof as AuraValidatoryProof

    const block = blockFromHex(proof.block)
    //get the required finality from the default config of the client
    const reqFinality = (ctx.client && ctx.client.defConfig && ctx.client.defConfig.finality)

    checkForFinality(toNumber(s.block), proof, current, reqFinality)

    // now check the receipt
    const receipt = rlp.decode(await verifyMerkleProof(
      block.receiptTrie, // expected merkle root
      rlp.encode(proof.txIndex), // path, which is the transsactionIndex
      proof.proof.map(bytes), // array of Buffer with the merkle-proof-data
      undefined // we don't want to check, but use the found value in the next step
    )) as any

    const logData = receipt[receipt.length - 1][proof.logIndex]
    if (!logData) throw new Error('Validator changeLog not found in Transaction')

    //check for contract address from chain spec
    if (!logData[0].equals(address(contract)))
      throw new Error('Wrong address in log ')

    //check for the standard topic "0x55252fa6eee4741b4e24a74a70e9c11fd2c2281df8d6ea13126ff845f7825c89"
    if (!logData[1][0].equals(bytes32('0x55252fa6eee4741b4e24a74a70e9c11fd2c2281df8d6ea13126ff845f7825c89')))
      throw new Error('Wrong Topics in log ')

    //check the list
    if (!logData[2].equals(bytes(rawEncode(['address[]'], [s.validators.map(v => v.startsWith('0x') ? v : ('0x' + v))]))))
      throw new Error('Wrong data in log ')

    history.addState(toNumber(s.block), s.validators)
  }
}


async function checkForValidators(ctx: ChainContext, validators: DeltaHistory<string>) {


  if (ctx.chainSpec && ctx.chainSpec.length) {
    const list = await ctx.client.sendRPC('in3_validatorlist', [validators.data.length, null], ctx.chainId, { proof: 'none' })
    if (list && list.result && list.result.states)
      for (const state of list.result.states as HistoryEntry[]) {
        const spec = ctx.getChainSpec(state.block)
        if (spec && spec.engine === 'authorityRound')
          await addAuraValidators(validators, ctx, [state], spec.contract)
        else if (spec && spec.engine === 'clique')
          await addCliqueValidators(validators, ctx, [state])
      }
    else
      throw new Error('Could not get the new validatorlist! ' + (list && JSON.stringify(list.error)))

    ctx.putInCache('validators', JSON.stringify(validators.toDeltaStrings()))
  }
}

function checkForFinality(stateBlockNumber: number, proof: AuraValidatoryProof, current: Buffer[], _finality: number) {

  // decode the blockheader
  const block = blockFromHex(proof.block)
  const finalitySigners = []

  let parentHash = block.parentHash
  let lastFinalityBlock = null

  for (const b of [block, ...(proof.finalityBlocks || []).map(blockFromHex)]) {
    if (!parentHash.equals(b.parentHash)) throw new Error('Invalid ParentHash')
    const signer = getSigner(b)
    const proposer = current[b.sealedFields[0].readUInt32BE(0) % current.length]
    if (!Buffer.concat(current).includes(signer)) throw new Error('Block was signed by the wrong validator')

    if (!finalitySigners.find(_ => _.equals(signer)))
      finalitySigners.push(signer)

    parentHash = b.hash()
    lastFinalityBlock = toNumber(b.number)
  }

  if ((finalitySigners.length/current.length) < _finality)
    throw new Error("Cannot reach finality. Required: " + _finality + " Reached: " + (finalitySigners.length/current.length))

  //verify finality block number
  if (stateBlockNumber !== (lastFinalityBlock + 1))
    throw new Error("Block Number in state doesn't match with finality blocks")
}

export async function getChainSpec(b: Block, ctx: ChainContext): Promise<AuthSpec> {

  let validators: DeltaHistory<string> = null
  const cache = ctx.getFromCache('validators')
  if (cache) {
    try {
      validators = new DeltaHistory<string>(JSON.parse(cache), true)
    }
    catch (x) { }
  }

  // no validators in the cache yet, so we have to find them.
  if (!validators && ctx.chainSpec && ctx.chainSpec.length) {
    validators = new DeltaHistory<string>([], false)
    let list: any = null
    for (const spec of ctx.chainSpec) {
      if (spec.list && !spec.requiresFinality) validators.addState(spec.block, spec.list)
      if (spec.contract || spec.engine == 'clique') {
        if (!list) list = ctx.client
          ? await ctx.client.sendRPC('in3_validatorlist', [validators.data.length, null], ctx.chainId, { proof: 'none' })
          : { result: { states: [] } }

        /* check if the transition also has a list if it does then we have to for
        finality to add that list to the history. */
        if (spec.list && spec.requiresFinality) {

          if (spec.bypassFinality) {
            validators.addState(spec.bypassFinality, spec.list)
            continue
          }

          const transitionState = list.result &&
            list.result.states &&
            list.result.states.filter(s => {
              if (s.block <= spec.block) {
                return false
              }

              if (!s.proof) return false
              const proof = s.proof as AuraValidatoryProof

              const block = blockFromHex(proof.block)

              if (toNumber(block.number) !== spec.block) {
                return false
              }

              return true
            })

          if(!transitionState || !transitionState.length) continue

          const current = validators.getData(transitionState[0].block).map(h => address(h.startsWith('0x') ? h : '0x' + h))
          if (Buffer.concat(current).equals(Buffer.concat(transitionState[0].validators.map(address)))) continue

          if (!transitionState[0].proof) throw new Error('The validator list has no proof')
          const proof = transitionState[0].proof as AuraValidatoryProof

          checkForFinality(toNumber(transitionState[0].block), proof, current, 0.51)

          validators.addState(toNumber(transitionState[0].block), transitionState[0].validators)

          continue
        }

        const nextBlock = (ctx.chainSpec[ctx.chainSpec.indexOf(spec) + 1] || { block: Number.MAX_VALUE }).block

        const filteredList = list.result &&
          list.result.states &&
          list.result.states.filter(s => s.block < nextBlock && s.block >= spec.block)

        if (spec.engine === 'authorityRound')
          await addAuraValidators(validators, ctx, filteredList, spec.contract)
        else if (spec.engine === 'clique')
          await addCliqueValidators(validators, ctx, filteredList)
      }
    }

    ctx.putInCache('validators', JSON.stringify(validators.toDeltaStrings()))
  }
  else if (!ctx.chainSpec || !ctx.chainSpec.length) return { authorities: [], proposer: null, spec: null }

  const blockNumber = toNumber(b.number)
  const spec = ctx.chainSpec && ctx.chainSpec.find(_ => _.block <= blockNumber)

  if (!spec) return { authorities: [], proposer: null, spec: null }

  //if there is an update in the validator list then get it
  if (ctx.lastValidatorChange > validators.getLastIndex())
    await checkForValidators(ctx, validators)

  // get the current validator-list for the block
  const res: any = { authorities: validators.getData(toNumber(b.number)).map(h => address(h.startsWith('0x') ? h : '0x' + h)), spec }

  // find out who is able to sign with this nonce
  res.proposer = res.authorities[(spec.engine == 'clique' ? toNumber(b.number) : b.sealedFields[0].readUInt32BE(0)) % res.authorities.length]

  if (spec.engine == 'clique' && toNumber(b.difficulty) === 1) res.proposer = null

  return res
}
