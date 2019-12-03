/*******************************************************************************
 * This file is part of the Incubed project.
 * Sources: https://github.com/slockit/in3
 * 
 * Copyright (C) 2018-2019 slock.it GmbH, Blockchains LLC
 * 
 * 
 * COMMERCIAL LICENSE USAGE
 * 
 * Licensees holding a valid commercial license may use this file in accordance 
 * with the commercial license agreement provided with the Software or, alternatively, 
 * in accordance with the terms contained in a written agreement between you and 
 * slock.it GmbH/Blockchains LLC. For licensing terms and conditions or further 
 * information please contact slock.it at in3@slock.it.
 * 	
 * Alternatively, this file may be used under the AGPL license as follows:
 *    
 * AGPL LICENSE USAGE
 * 
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY 
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * [Permissions of this strong copyleft license are conditioned on making available 
 * complete source code of licensed works and modifications, which include larger 
 * works using a licensed work, under the same license. Copyright and license notices 
 * must be preserved. Contributors provide an express grant of patent rights.]
 * You should have received a copy of the GNU Affero General Public License along 
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/

import { RPCRequest, RPCResponse, ChainSpec } from "../types/types"
import ChainContext from "./ChainContext"
import Client from "./Client"

const modules: { [name: string]: Module } = {}

export interface Module {
    name: string

    createChainContext(client: Client, chainId: string, spec: ChainSpec[]): ChainContext
    /** general verification-function which handles it according to its given type. */
    verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof: boolean, ctx: ChainContext): Promise<boolean>
}

function tryLoadModule(path: string, name: string) {
    try {
        require(path)
        return modules[name]
    }
    catch {
        return null
    }
}

export function getModule(name: string): Module {
    const m = modules[name] || tryLoadModule('../modules/' + name, name) || tryLoadModule(name, name)
    if (!m) throw new Error('Could not find the module ' + name + ' please ensure it was loaded before!')
    return m
}

/** general verification-function which handles it according to its given type. */
export async function verifyProof(request: RPCRequest, response: RPCResponse, allowWithoutProof: boolean, ctx: ChainContext): Promise<boolean> {
    return await ctx.module.verifyProof(request, response, allowWithoutProof, ctx)
        || Promise.all(Object.keys(modules).filter(_ => _ !== ctx.module.name).map(m => modules[m].verifyProof(request, response, allowWithoutProof, ctx))).then(a => a.find(_ => !!_))
}

export function register(module: Module) {
    modules[module.name] = module
}

// we are always importing the eth-modules because it is needed in order to verify the nodelist
import '../modules/eth'