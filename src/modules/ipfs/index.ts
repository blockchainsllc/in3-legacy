

import {Module,register} from '../../client/modules'
import { RPCRequest, RPCResponse } from '../../types/types'
import ChainContext from '../../client/ChainContext'
import {verifyIPFSHash} from './ipfs'


register({
    name:'ipfs',
    verifyProof,
    createChainContext:(client,chainId,spec)=>new ChainContext(client,chainId,spec)
})


/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof:boolean, ctx: ChainContext): Promise<boolean> {

    if (request.method !== 'ipfs_get' && request.method !== 'ipfs_put') return false

    // handle verification with implicit proof (like ipfs)
    if (request.method === 'ipfs_get' && response.result)
      return verifyIPFSHash(response.result, request.params[1] || 'base64', request.params[0])

    return true
  }
  