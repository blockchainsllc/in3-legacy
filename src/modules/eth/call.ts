/***********************************************************
* This file is part of the Slock.it IoT Layer.             *
* The Slock.it IoT Layer contains:                         *
*   - USN (Universal Sharing Network)                      *
*   - INCUBED (Trustless INcentivized remote Node Network) *
************************************************************
* Copyright (C) 2016 - 2018 Slock.it GmbH                  *
* All Rights Reserved.                                     *
************************************************************
* You may use, distribute and modify this code under the   *
* terms of the license contract you have concluded with    *
* Slock.it GmbH.                                           *
* For information about liability, maintenance etc. also   *
* refer to the contract concluded with Slock.it GmbH.      *
************************************************************
* For more information, please refer to https://slock.it   *
* For questions, please contact info@slock.it              *
***********************************************************/

import { getStorageValue } from './verify'
import * as VM from 'ethereumjs-vm'
import * as Account from 'ethereumjs-account'
import * as Block from 'ethereumjs-block'
import * as Trie from 'merkle-patricia-tree'
import { rlp } from 'ethereumjs-util'
import { serialize, util} from 'in3-common'
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
  const result = await util.promisify(vm, vm.runTx, { tx, block: new Block([block, [], []]) })

  // return the returnValue
  if (missingDataError) throw missingDataError
  return result.vm.return as Buffer
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

