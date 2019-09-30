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

import { getStorageValue } from './verify'
import VM from 'ethereumjs-vm'
import * as Account from 'ethereumjs-account'
import * as Block from 'ethereumjs-block'
import * as Trie from 'merkle-patricia-tree'
import { rlp } from 'ethereumjs-util'
import { serialize, util } from 'in3-common'
import { AccountProof } from '../../types/types'

/** executes a transaction-call to a smart contract */
export async function executeCall(args: {
  to: string
  data: string
  value?: string
  from?: string
}, accounts: { [adr: string]: AccountProof }, block: Buffer) {

  // fix account-keys, so all the addresses are formated the same way
  Object.keys(accounts).forEach(a => accounts[util.toHex(a, 20).toLowerCase()] = accounts[a])

  // create new state for a vm
  const state = new Trie()
  const vm = new VM({ state })

  // set all storage values from the proof in the state
  await setStorageFromProof(state, accounts)

  // create a transaction-object
  const tx = serialize.createTx({ gas: '0x5b8d80', gasLimit: '0x5b8d80', from: '0x0000000000000000000000000000000000000000', ...args })

  // keep track of each opcode in order to make sure, all storage-values are provided!
  let missingDataError: Error = null
  vm.on('step', ev => {
    // TODO als check the following opcodes:
    // - BLOCKHASH
    // - COINBASE ( since we are currently not using a real block!)
    // and we need to check if the target contract exists (even though it would most likely fail if not)
    // - STATIONCALL
    switch (ev.opcode.name) {
      case 'BALANCE':
      case 'EXTCODESIZE':
      case 'EXTCODECOPY':
        const balanceContract = util.toHex('0x' + ev.stack[ev.stack.length - 1].toString(16), 20)
        if (!(accounts[balanceContract]))
          missingDataError = new Error('The contract ' + balanceContract + ' is used to get the balance but is missing in the proof!')
        break

      case 'CALL':
      case 'CALLCODE':
      case 'DELEGATECALL':
      case 'STATICCALL':
        const callContract = util.toHex('0x' + ev.stack[ev.stack.length - 2].toString(16), 20)
        if (!(accounts[callContract]))
          missingDataError = new Error('The contract ' + callContract + ' is used to get the balance but is missing in the proof!')

        break

      case 'SLOAD':
        const contract = util.toHex(ev.address, 20)
        const key = serialize.bytes32(ev.stack[ev.stack.length - 1])
        const ac = accounts[contract]

        // check if this key is part of the acountProof, if not the result can not be trusted
        if (!ac)
          missingDataError = new Error('The contract ' + contract + ' is used but is missing in the proof! proof=' + JSON.stringify(accounts, null, 2))
        else if (!getStorageValue(ac, key))
          missingDataError = new Error('The storage value ' + key + ' in ' + contract + ' is used but is missing in the proof!')
        break

      default:
        return
    }

    //    console.log('step ' + counter + ' : ' + ev.opcode.name + ' pc:' + ev.pc + 'stack: ' + ev.stack.map(_ => _.toString(16)))
  })

  // run the tx
  const result = await vm.runTx({ tx, block: new Block([block, [], []]) })

  // return the returnValue
  if (missingDataError) throw missingDataError

  if (!result.execResult) throw new Error('no result')
  if (result.execResult.exceptionError) throw result.execResult.exceptionError
  return result.execResult.returnValue
}

async function setStorageFromProof(trie, accounts: { [adr: string]: AccountProof }) {
  for (const adr of Object.keys(accounts)) {
    const ac = accounts[adr]

    // create an account-object
    const account = new Account()
    if (ac.balance) account.balance = ac.balance
    if (ac.nonce) account.nonce = ac.nonce
    if (ac.codeHash) account.codeHash = ac.codeHash

    // if we have a code, we will set the code
    if (ac.code) await util.promisify(account, account.setCode, trie, util.toBuffer(ac.code))

    // set all storage-values
    for (const s of ac.storageProof)
      await util.promisify(account, account.setStorage, trie, util.toBuffer(s.key, 32), rlp.encode(util.toBuffer(s.value, 32)))

    // set the account data
    await util.promisify(trie, trie.put, util.toBuffer(adr, 20), account.serialize())
  }
}

