
import In3Client from 'in3';
import * as EthUtil from 'ethereumjs-util';

//using in3 for sending transaction demo
export async function in3DirectTx(toAddress, senderPrivateKey) {

    //creating in3 instance
    const in3Goerli = new In3Client({
        proof: 'standard',
        signatureCount: 1,
        requestCount: 2,
        chainId: 'goerli'
    })

    const senderAddress = EthUtil.privateToAddress(senderPrivateKey).toString('hex');

    console.log("Sender Address: " + senderAddress);

    const receipt = await in3Goerli.eth.sendTransaction({
        to: toAddress,
        from: '0x' + senderAddress,
        value: '0x3E8',
        pk: senderPrivateKey, //using raw private key for demostration
        confirmations: 3
    })
    console.log(receipt)
}


//sending a transaction using raw private key
var toAddress = '0x41d8A416301f53a3EBa3c85B2b88270f636DBd5C'
var senderPrivateKey = '0xD9210C20A0ED0F78F250FE94B38F34D90ACEFC391A0718FFB5EBE0B3C282C1A6'
//First Make sure sender have enough funds before Tx
//goerli faucet https://goerli-faucet.slock.it/
//await in3DirectTx(toAddress, senderPrivateKey);