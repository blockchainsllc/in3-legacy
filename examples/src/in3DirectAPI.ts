
import In3Client from 'in3'
import { LogFilter } from 'in3/js/src/modules/eth/api'
import { BN } from 'ethereumjs-util'

//using in3 directly for interaction with Eth Node
export async function in3DirectAPI() {

    //creating in3 instance
    const in3 = new In3Client({
        proof: 'standard',  //‘none’ for no verification, ‘standard’ for verifying all important fields, ‘full’ veryfying all fields even if this means a high payloaad 
        signatureCount: 2,
        requestCount: 2,
        chainId: 'mainnet',
        timeout: 30000,
        replaceLatestBlock: 6
    })

    //getting genesis block using in3
    const block = await in3.eth.getBlockByNumber(0)
    console.log(block)

    //getting transaction by hash
    const tx = await in3.eth.getTransactionByHash("0xfc2786e12ba6f9f25587e618a0fbc407bf34afce137a1f695fcda3a1dacbe3eb")
    console.log(tx)

    //get transaction receipt
    const txReceipt = await in3.eth.getTransactionReceipt("0xfc2786e12ba6f9f25587e618a0fbc407bf34afce137a1f695fcda3a1dacbe3eb")
    console.log(txReceipt)

    // getting log using in3
    var logFilter = {
        fromBlock: 8604535,
        toBlock: 8604535,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    } as LogFilter
    const log = await in3.eth.getLogs(logFilter)
    console.log(log)

    // getting balance
    const bal = await in3.eth.getBalance('0x2819c144d5946404c0516b6f817a960db37d4929')
    console.log(bal.toString())

    // use the api to call a funnction
    const tokenContractAddr = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    const acct = '0xbde8e861e04d6f5e4d2784de82e3825c56a8e11f'
    const myBalance = await in3.eth.callFn(tokenContractAddr, 'balanceOf(address):uint', acct)
    console.log(myBalance.toString())
}


//calling examples
in3DirectAPI();