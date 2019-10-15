// import in3-Module
import In3Client from 'in3'
import Web3 from 'web3'

//using in3 as HTTP provider in web3
export async function in3AsHttpProvider() {
    // use the In3Client as Http-Provider
    const web3 = new Web3(new In3Client({
        proof: 'standard',  //‘none’ for no verification, ‘standard’ for verifying all important fields, ‘full’ veryfying all fields even if this means a high payloaad 
        signatureCount: 2,
        requestCount: 2,
        chainId: 'mainnet',
        replaceLatestBlock: 6
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

    // getting Logs
    var options = {
        fromBlock: 8604535,
        toBlock: 8604535,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
    const logs = await web3.eth.getPastLogs(options)
    console.log(logs)

    //getting balance
    const balance = await web3.eth.getBalance('0x2819c144d5946404c0516b6f817a960db37d4929')
    const decimalBal = web3.utils.fromWei(balance)
    console.log(decimalBal)

    // calling a function
    var abi = [{ "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }]
    var contractAddr = "0xdac17f958d2ee523a2206206994597c13d831ec7"
    var contract = new web3.eth.Contract(abi, contractAddr)
    var bal = await contract.methods.balanceOf("0x25959edb755d176d067803189af214f23bda94b2").call(
        {
            gas: 47000,
            gasPrice: 0,
            from: '0x71c24b85086928930f5dC2a6690574E7016C1A7F'
        }
    )
    console.log(bal)
}

//calling examples
in3AsHttpProvider();