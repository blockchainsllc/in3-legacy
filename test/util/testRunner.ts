import Client from '../../src/client/Client'
import { readFileSync } from 'fs'
import { Transport, RPCRequest, RPCResponse } from '../../src'

const ignoreFuxxProps = ['id', 'error', 'currentBlock', 'execTime', 'lastNodeList', 'totalDifficulty', 'size', 'chainId', 'transactionLogIndex', 'logIndex', 'lastValidatorChange']
const ignoreTxProps = ['from', 'blockHash', 'blockNumber', 'publicKey', 'raw', 'standardV', 'transactionIndex']
const defaultConfig = require('../../src/client/defaultConfig.json')


async function runFuzzTests(filter: number, test: any, allResults: any[], c: number, ob: any, prefix = ''): Promise<number> {
    if (!ob) return c
    for (const k of Object.keys(ob).filter(_ => _ && ignoreFuxxProps.indexOf(_) < 0 && (prefix.indexOf('proof.transactions') < 0 || ignoreTxProps.indexOf(_) < 0))) {
        const val = ob[k]
        if (typeof val === 'string') {
            if (val.startsWith('0x')) {
                if (val.length == 2) ob[k] = '0x01'
                else if (val[2] === '9') ob[k] = '0xa' + val.substr(3)
                else if (val[2].toLowerCase() === 'f') ob[k] = '0x0' + val.substr(3)
                else ob[k] = '0x' + String.fromCharCode(val[2].charCodeAt(0) + 1) + val.substr(3)
            }
            else continue
        }
        else if (typeof val === 'number')
            ob[k] = val + 1
        else if (Array.isArray(val)) {
            if (val[0] && typeof val[0] === 'object') c = await runFuzzTests(filter, test, allResults, c, val[0], prefix + '.' + k)
            continue
        }
        else if (typeof val === 'object') {
            c = await runFuzzTests(filter, test, allResults, c, val, prefix + '.' + k)
            continue
        }
        else continue

        c++
        if (filter < 0 || c == filter) {
            test.success = false
            const result = await runSingleTest(test, c)
            test.success = true
            allResults.push(result)
            console.log(addSpace('' + result.c, 3) + ' : ' + addSpace('  ' + prefix + '.' + k, 85, '.', result.success ? '' : '31') + ' ' + addSpace(result.success ? 'OK' : result.error, 0, ' ', result.success ? '32' : '31'))
        }
        ob[k] = val
    }

    return c
}



export async function run_test(files: string[], filter: number): Promise<{ descr: string, c: number, success: boolean, error: string }[]> {
    const allResults = []
    let c = 0
    for (const file of files) {
        for (const test of JSON.parse(readFileSync(file, 'utf8'))) {
            c++
            if (filter < 0 || c == filter) {
                const result = await runSingleTest(test, c)
                allResults.push(result)
                console.log(addSpace('' + result.c, 3) + ' : ' + addSpace(result.descr, 85, '.', result.success ? '' : '31') + ' ' + addSpace(result.success ? 'OK' : result.error, 0, ' ', result.success ? '32' : '31'))
            }

            if (test.fuzzer)
                c = await runFuzzTests(filter, test, allResults, c, test.response[0])
        }
    }
    return allResults
}

async function runSingleTest(test: any, c: number) {
    test = JSON.parse(JSON.stringify(test))
    let res = 0
    const config = test.config || {}, result = { descr: test.descr, c, success: false, error: undefined }
    const client = new Client({
        requestCount: config.requestCount || 1,
        includeCode: true,
        proof: test.proof || 'standard',
        chainId: test.chainId || '0x1',
        autoUpdateList: false,
        maxAttempts: 1,
        loggerUrl: ''
    }, {
            handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]> {
                if((data as any)[0].method == 'in3_validatorlist') {
                  const states = JSON.parse(readFileSync(process.cwd() + '/test/util/in3_validatorlist.json', 'utf8').toString())
                  const validatorResponse = mockValidatorList(states, (data as any)[0].params)
                  //console.log((data as any)[0].params)
                  validatorResponse.id = (data as any)[0].id
                  validatorResponse.jsonrpc = (data as any)[0].jsonrpc
                  return Promise.resolve([validatorResponse])
                }
                test.response[res].id = (data as any)[0].id
                return Promise.resolve([test.response[res++]])
            },
            isOnline(): Promise<boolean> {
                return Promise.resolve(true)
            },
            random(count: number): number[] {
                const r = []
                for (let i = 0; i < count; i++) r[i] = i / count
                return r
            }
        })
    for (const chainId of Object.keys(client.defConfig.servers))
        client.defConfig.servers[chainId].needsUpdate = false

    client.defConfig.servers[client.defConfig.chainId].weights = {}
    if (test.signatures)
        client.defConfig.signatureCount = test.signatures.length

    let s = false, error = null
    try {
        const response = await client.send(test.request)
        s = !!(response && (response as any).result)
    }
    catch (err) {
        error = err
    }
    if (s === (test.success == undefined ? true : test.success))
        result.success = true
    else
        result.error = s ? 'Should have failed' : (error && error.message) || 'Failed'
    return result
}

function mockValidatorList(states, params?){
    const blockNumber: number = (params && params.length > 0)?parseInt(params[0]):0
    const numStates: number = (params && params.length > 1)?parseInt(params[1]):null
    const excludeCurrentDelta: boolean = (params && params.length > 2)?params[2]:false

    //console.log(blockNumber, numStates, excludeCurrentDelta)

    const filteredStates = blockNumber != 0 ?
    states.filter((state, index, s) => {
        if(state.block >= blockNumber)
          return true
        else if(index != (s.length-1) && blockNumber < s[index + 1].block && !excludeCurrentDelta)
          return true
        else if(index === (s.length-1) && blockNumber > s[s.length - 1].block && !excludeCurrentDelta)
          return true
        else
          return false
    })
    : states

    return ({
      id: 0,
      result: {
        states: numStates && numStates < filteredStates.length?filteredStates.slice(0, numStates):filteredStates,
        lastCheckedBlock: 11759901,
        statesLength: 56
      },
      jsonrpc: null
    })
}

function addSpace(s: string, l: number, filler = ' ', color = '') {
    while (s.length < l) s += filler
    return color ? '\x1B[' + color + 'm' + s + '\x1B[0m' : s
}
