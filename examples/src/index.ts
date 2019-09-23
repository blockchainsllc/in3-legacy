// import in3-Module
import In3Client from 'in3'
import Web3 from 'web3'
import { LogFilter } from 'in3/js/src/modules/eth/api'

async function in3AsHttpProvider() {
    // use the In3Client as Http-Provider
    const web3 = new Web3(new In3Client({
        proof: 'standard',  //‘none’ for no verification, ‘standard’ for verifying all important fields, ‘full’ veryfying all fields even if this means a high payloaad 
        signatureCount: 1,
        requestCount: 1,
        chainId: 'mainnet'
    }).createWeb3Provider())

    //getting genesis block
    const block = await web3.eth.getBlock(0)
    console.log(block)

    //getting Transaction by hash
    const transaction = await web3.eth.getTransaction("0xfc2786e12ba6f9f25587e618a0fbc407bf34afce137a1f695fcda3a1dacbe3eb")
    console.log(transaction)

    //getting Transaction Receipt
    const transactionReceipt = await web3.eth.getTransactionReceipt("0xfc2786e12ba6f9f25587e618a0fbc407bf34afce137a1f695fcda3a1dacbe3eb")
    console.log(transactionReceipt)

    //> getting Logs
    /*var options = {
        fromBlock: 8604535,
        toBlock: 8604535,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
    const logs = await web3.eth.getPastLogs(options)
    console.log(logs)*/

    //getting balance
    const balance = await web3.eth.getBalance('0x2819c144d5946404c0516b6f817a960db37d4929')
    const decimalBal = web3.utils.fromWei(balance)
    console.log(decimalBal)

    //> calling a function
    /*var abi = [{ "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }]
    var contractAddr = "0xdac17f958d2ee523a2206206994597c13d831ec7"
    var contract = new web3.eth.Contract(abi, contractAddr)
    var bal = await contract.methods.balanceOf("0xbde8e861e04d6f5e4d2784de82e3825c56a8e11f").call()
    console.log(bal)*/
}

async function in3DirectAPI() {

    const in3 = new In3Client({
        proof: 'standard',
        signatureCount: 1,
        requestCount: 2,
        chainId: 'mainnet'
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

    //> getting log using in3
    /*var logFilter = {
        fromBlock: 8604535,
        toBlock: 8604535,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    } as LogFilter
    const log = await in3.eth.getLogs(logFilter)
    console.log(log)*/

    //> getting balance
    /*const bal = await in3.eth.getBalance('0x2819c144d5946404c0516b6f817a960db37d4929')
    console.log(bal.toString())*/

    // use the api to call a funnction
    const tokenContractAddr = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    const acct = '0xbde8e861e04d6f5e4d2784de82e3825c56a8e11f'
    const myBalance = await in3.eth.callFn(tokenContractAddr, 'balanceOf(address):uint', acct)
    console.log(myBalance.toString())

    //sending a transaction using raw private key
    //goerli faucet https://goerli-faucet.slock.it/
    const in3Goerli = new In3Client({
        proof: 'standard',
        signatureCount: 1,
        requestCount: 2,
        chainId: 'goerli'
    })
    var sender = '0x71c24b85086928930f5dC2a6690574E7016C1A7F'
    var toAddress = '0x41d8A416301f53a3EBa3c85B2b88270f636DBd5C'
    var privateKey = '0xD9210C20A0ED0F78F250FE94B38F34D90ACEFC391A0718FFB5EBE0B3C282C1A6'
   /* const receipt = await in3Goerli.eth.sendTransaction({
        to: toAddress,
        from: sender,
        value: '0x3E8',
        pk: privateKey
    })
    console.log(receipt)*/

}

async function invokeExamples() {

    try {
        //calling in3 examples
        await in3DirectAPI()

        //using in3 as HTTP Provider of web3
        await in3AsHttpProvider()
        
    }
    catch (err) {

        console.log("Error " + err.toString())
        process.exit(1);
    }
}

invokeExamples();