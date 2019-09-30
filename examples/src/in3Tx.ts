
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

    console.log("Sender Address: "+senderAddress);

    const receipt = await in3Goerli.eth.sendTransaction({
        to: toAddress,
        from: '0x'+senderAddress,
        value: '0x3E8',
        pk: senderPrivateKey, //using raw private key for demostration
        confirmations: 3
    })
    console.log(receipt)
}
