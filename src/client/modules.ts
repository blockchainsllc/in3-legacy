import { RPCRequest, RPCResponse, ChainSpec } from "../types/types"
import ChainContext from "./Context"
import Client from "./Client"

const modules:{ [name:string]:Module} = {}

export interface Module {
  name:string

  createChainContext(client:Client,chainId:string,spec:ChainSpec):ChainContext
    /** general verification-function which handles it according to its given type. */
  verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof:boolean, ctx: ChainContext): Promise<boolean>
}

function tryLoadModule(path:string, name:string) {
    try {
        require(path)
        return modules[name]
    }
    catch {
        return null
    }
}

export function getModule(name:string):Module {
    const m = modules[name] || tryLoadModule('../modules/'+name,name) || tryLoadModule(name,name)
    if (!m) throw new Error('Could not find the module '+name+' please ensure it was loaded before!')
    return m
}

/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof:boolean, ctx: ChainContext): Promise<boolean> {
    return await ctx.module.verifyProof(request,response,allowWithoutProof,ctx)
    ||  Promise.all( Object.keys(modules).filter(_=>_!==ctx.module.name).map(m=>modules[m].verifyProof(request,response,allowWithoutProof,ctx))).then(a=>a.find(_=>!!_))
}

export function register(module:Module) {
    modules[module.name]=module
}

// we are always importing the eth-modules because it is needed in order to verify the nodelist
import '../modules/eth'