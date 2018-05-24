import { error } from '../../../test/utils/memoryLogger';
const codes = {
  '00': 'STOP 0 0 Halts execution',
  '01': 'ADD 2 1 Addition operation',
  '02': 'MUL 2 1 Multiplication operation',
  '03': 'SUB 2 1 Subtraction operation',
  '04': 'DIV 2 1 Integer division operation',
  '05': 'SDIV 2 1 Signed integer',
  '06': 'MOD 2 1 Modulo',
  '07': 'SMOD 2 1 Signed modulo',
  '08': 'ADDMOD 3 1 Modulo',
  '09': 'MULMOD 3 1 Modulo',
  '0a': 'EXP 2 1 Exponential operation',
  '0b': 'SIGNEXTEND 2 1 Extend length of twos complement signed integer',
  '10': 'LT 2 1  Lesser-than comparison',
  '11': 'GT 2 1  Greater-than comparison',
  '12': 'SLT 2 1 Signed less-than comparison',
  '13': 'SGT 2 1 Signed greater-than comparison',
  '14': 'EQ 2 1 Equality  comparison',
  '15': 'ISZERO 1 1 Simple not operator',
  '16': 'AND 2 1 Bitwise AND operation',
  '17': 'OR 2 1  Bitwise OR operation',
  '18': 'XOR 2 1 Bitwise XOR operation',
  '19': 'NOT 1 1 Bitwise NOT operation',
  '1a': 'BYTE 2 1 Retrieve single byte from word',
  '20': 'SHA3 2 1 Compute Keccak-256 hash',
  '30': 'ADDRESS 0 1 Get address of currently executing account',
  '31': 'BALANCE 1 1 Get balance of the given account',
  '32': 'ORIGIN 0 1 Get execution origination address',
  '33': 'CALLER 0 1  Get caller address. This is the address of the account that is directly responsible for this execution',
  '34': 'CALLVALUE 0 1   Get deposited value by the instruction/transaction responsible for this execution',
  '35': 'CALLDATALOAD 1 1 Get input data of current environment',
  '36': 'CALLDATASIZE 0 1 Get size of input data in current environment',
  '37': 'CALLDATACOPY 3 0 Copy input data in current environment to memory This pertains to the input data passed with the message call instruction or transaction',
  '38': 'CODESIZE 0 1 Get size of code running in current environment',
  '39': 'CODECOPY 3 0 Copy code running in current environment to memory',
  '3a': 'GASPRICE 0 1 Get price of gas in current environment',
  '3b': 'EXTCODESIZE 1 1 Get size of an accounts code',
  '3c': 'EXTCODECOPY 4 0  Copy an accounts code to memory',
  '40': 'BLOCKHASH 1 1 Get the hash of one of the 256 most recent complete blocks',
  '41': 'COINBASE 0 1 Get the blocks beneficiary address',
  '42': 'TIMESTAMP 0 1   Get the blocks timestamp',
  '43': 'NUMBER 0 1  Get the blocks number',
  '44': 'DIFFICULTY 0 1  Get the blocks difficulty',
  '45': 'GASLIMIT 0 1 Get the blocks gas limit',
  '50': 'POP 1 0 Remove item from stack',
  '51': 'MLOAD 1 1  Load word from memory',
  '52': 'MSTORE 2 0 Save word to memory',
  '53': 'MSTORE8 2 0 Save byte to memory',
  '54': 'SLOAD 1 1  Load word from storage',
  '55': 'SSTORE 2 0 Save word to storage',
  '56': 'JUMP 1 0 Alter the program counter',
  '57': 'JUMPI 2 0 Conditionally alter the program counter',
  '58': 'PC 0 1 Get the value of the program counter prior to the increment',
  '59': 'MSIZE 0 1  Get the size of active memory in bytes',
  '5a': 'GAS 0 1 Get the amount of available gas, including the corresponding reduction',
  '5b': 'JUMPDEST 0 0 Mark a valid destination for jumps',
  '60': 'PUSH1 0 1 Place 1 byte item on stack',
  '61': 'PUSH2 0 1   Place 2-byte item on stack',
  '62': 'PUSH3 0 1   Place 3-byte item on stack',
  '63': 'PUSH4 0 1   Place 4-byte item on stack',
  '64': 'PUSH5 0 1   Place 5-byte item on stack',
  '65': 'PUSH6 0 1   Place 6-byte item on stack',
  '66': 'PUSH7 0 1   Place 7-byte item on stack',
  '67': 'PUSH8 0 1   Place 8-byte item on stack',
  '68': 'PUSH9 0 1   Place 9-byte item on stack',
  '69': 'PUSH10 0 1   Place 10-byte item on stack',
  '6a': 'PUSH11 0 1   Place 11-byte item on stack',
  '6b': 'PUSH12 0 1  Place 12-byte item on stack',
  '6c': 'PUSH13 0 1  Place 13-byte item on stack',
  '6d': 'PUSH14 0 1   Place 14-byte item on stack',
  '6e': 'PUSH15 0 1  Place 15-byte item on stack',
  '6f': 'PUSH16 0 1   Place 16-byte item on stack',
  '70': 'PUSH17 0 1   Place 17-byte item on stack',
  '71': 'PUSH18 0 1   Place 18-byte item on stack',
  '72': 'PUSH19 0 1   Place 19-byte item on stack',
  '73': 'PUSH20 0 1   Place 20-byte item on stack',
  '74': 'PUSH21 0 1   Place 21-byte item on stack',
  '75': 'PUSH22 0 1   Place 22-byte item on stack',
  '76': 'PUSH23 0 1   Place 23-byte item on stack',
  '77': 'PUSH24 0 1   Place 24-byte item on stack',
  '78': 'PUSH25 0 1   Place 25-byte item on stack',
  '79': 'PUSH26 0 1   Place 26-byte item on stack',
  '7a': 'PUSH27 0 1   Place 27-byte item on stack',
  '7b': 'PUSH28 0 1   Place 28-byte item on stack',
  '7c': 'PUSH29 0 1   Place 29-byte item on stack',
  '7d': 'PUSH30 0 1   Place 30 byte item on stack',
  '7e': 'PUSH31 0 1   Place 31-byte item on stack',
  '7f': 'PUSH32 0 1  Place 32-byte (full word) item on stack',
  '80': 'DUP1 1 2 Duplicate 1st stack item',
  '81': 'DUP2 2 3 Duplicate 2nd stack item',
  '82': 'DUP3 3 4 Duplicate 2nd stack item',
  '83': 'DUP4 4 5 Duplicate 2nd stack item',
  '84': 'DUP5 5 6 Duplicate 2nd stack item',
  '85': 'DUP6 6 7 Duplicate 2nd stack item',
  '86': 'DUP7 7 8 Duplicate 2nd stack item',
  '87': 'DUP8 8 9 Duplicate 2nd stack item',
  '88': 'DUP9 9 10 Duplicate 2nd stack item',
  '89': 'DUP10 10 11 Duplicate 2nd stack item',
  '8a': 'DUP11 11 12 Duplicate 2nd stack item',
  '8b': 'DUP12 12 13 Duplicate 2nd stack item',
  '8c': 'DUP13 13 14 Duplicate 2nd stack item',
  '8d': 'DUP14 14 15 Duplicate 2nd stack item',
  '8e': 'DUP15 15 16 Duplicate 2nd stack item',
  '8f': 'DUP16 16 17Duplicate 16th stack item',
  '90': 'SWAP1 2 2   Exchange 1st and 2nd stack items',
  '91': 'SWAP2 3 3  Exchange 1st and 3rd stack items',
  '92': 'SWAP3 4 4  Exchange 1st and 3rd stack items',
  '93': 'SWAP4 5 5  Exchange 1st and 3rd stack items',
  '94': 'SWAP5 6 6  Exchange 1st and 3rd stack items',
  '95': 'SWAP6 7 7  Exchange 1st and 3rd stack items',
  '96': 'SWAP7 8 8  Exchange 1st and 3rd stack items',
  '97': 'SWAP8 9 9  Exchange 1st and 3rd stack items',
  '98': 'SWAP9 10 10   Exchange 1st and 3rd stack items',
  '99': 'SWAP10 11 11  Exchange 1st and 3rd stack items',
  '9a': 'SWAP11 12 12  Exchange 1st and 3rd stack items',
  '9b': 'SWAP12 13 13   Exchange 1st and 3rd stack items',
  '9c': 'SWAP13 14 14   Exchange 1st and 3rd stack items',
  '9d': 'SWAP14 15 15   Exchange 1st and 3rd stack items',
  '9e': 'SWAP15 16 16   Exchange 1st and 3rd stack items',
  '9f': 'SWAP16 17 17  Exchange 1st and 17th stack items',
  'a0': 'LOG0 2 0 Append log record with no topics',
  'a1': 'LOG1 3 0 Append log record with one topic',
  'a2': 'LOG2 4 0 Append log record with one topic',
  'a3': 'LOG3 5 0 Append log record with one topic',
  'a4': 'LOG4 6 0 Append log record with four topics',
  'f0': 'CREATE 3 1 Create a new account with associated code',
  'f1': 'CALL 7 1 Message-call into an account',
  'f2': 'CALLCODE 7 1 Message-call into this account with alternative accounts code',
  'f3': 'RETURN 2 0  Halt execution returning output data',
  'f4': 'DELEGATECALL 6 1 Message-call into this account with an alternative accounts code, but persisting the current values for `sender` and `value`',
  'fa': 'STATIONCALL 6 1  Static message-call into an account',
  'fd': 'REVERT 2 0 Halt execution reverting state changes but returning data and remaining gas',

  'ff': 'SELFDESTRUCT 1 0 Halt execution and register account for later deletion'
}


export function analyse(trace, storageAccount: string, result?: any): {
  blocks: string[],
  accounts: {
    [name: string]: {
      code?: boolean | string,
      balance?: string,
      storage?: {
        [key: string]: string
      }
    }
  }
} {
  const code = trace.code.substr(2)
  const stack = []
  if (!result) result = { blocks: [], accounts: { [storageAccount]: { storage: {}, code: trace.code } } }
  const getAccount = (a?: string) => result.accounts[a || storageAccount] || (result.accounts[a || storageAccount] = { storage: {} })

  trace.ops.forEach(s => {
    const c = codes[code.substr(s.pc * 2, 2)]
    if (!c) throw new Error('ERROR Could not find ' + code.substr(s.pc * 2, 2))
    let [op, sdel, sadd, desc] = c.split(' ')
    //    console.error('trace step ' + op + ' pc:' + s.pc + ' stack :' + JSON.stringify(stack))

    if (s.sub) {
      let ac = storageAccount
      if (op === 'CREATE') {
        // TODO handle new contracts
      }
      else if (op === 'CALL')
        getAccount(ac = stack[stack.length - 2]).code = s.sub.code
      else if (op === 'CALLCODE') // check
        getAccount(stack[stack.length - 2]).code = s.sub.code
      else if (op === 'DELEGATECALL')
        getAccount(stack[stack.length - 5]).code = true
      else
        throw new Error('invalid opcode for sub call ' + op)
      analyse(s.sub, ac, result)
    }
    else if (op === 'BLOCKHASH')
      result.blocks.push(stack[stack.length - 1])
    else if (op === 'SLOAD')
      getAccount().storage[stack[stack.length - 1]] = s.ex.push[0]
    else if (op === 'BALANCE')
      getAccount(stack[stack.length - 1]).balance = s.ex.push[0]
    else if (op === 'EXTCODECOPY' || op === 'EXTCODESIZE')
      getAccount(stack[stack.length - 1]).code = true

    while (parseInt(sdel)) {
      stack.pop()
      sdel = parseInt(sdel) - 1
    }
    if (sadd && parseInt(sadd) !== s.ex.push.length)
      throw new Error('ERROR : expected to push ' + sadd + ' elements!')
    s.ex.push.forEach(_ => stack.push(_))
    //console.log(l + op, JSON.stringify(s.ex) + '\n' + l + '     stack: ' + stack.join())

  })
  return result

}




/*
60 {"cost":3,"ex":{"mem":null,"push":["'1':'"],"store":null,"used":4676704},"pc":507,"sub":null}
54 {"cost":200,"ex":{"mem":null,"push":["'d34abc7edf64f507a0f939cfea6a799e9526e3ae':'"],"store":null,"used":4676504},"pc":509,"sub":null}
60 {"cost":3,"ex":{"mem":null,"push":["'2':'"],"store":null,"used":4676501},"pc":510,"sub":null}
54 {"cost":200,"ex":{"mem":null,"push":["'422ed4cf8c08eabe86d516dcfc578fe9a9d70e2fb2fa3db669e7613cd026b7b5':'"],"store":null,"used":4676301},"pc":512,"sub":null}
*/