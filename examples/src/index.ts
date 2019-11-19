
import { in3DirectAPI } from './in3DirectAPI'
import { in3AsHttpProvider } from './in3AsHttpProvider'
import { in3DirectTx } from './in3Tx'

//in3 examples using in3 direct as API and using in3 as HTTP provider in web3
//https://in3.readthedocs.io/en/latest/intro.html for more details of in3
async function invokeExamples() {

    try {
        //calling in3 examples
        await in3DirectAPI()

        //using in3 as HTTP Provider of web3
        await in3AsHttpProvider()

        //sending a transaction using raw private key
        var toAddress = '0x41d8A416301f53a3EBa3c85B2b88270f636DBd5C'
        var senderPrivateKey = '0xD9210C20A0ED0F78F250FE94B38F34D90ACEFC391A0718FFB5EBE0B3C282C1A6'
        //First Make sure sender have enough funds before Tx
        //goerli faucet https://goerli-faucet.slock.it/
        //await in3DirectTx(toAddress, senderPrivateKey);

    }
    catch (err) {

        console.log("Error " + err.toString())
        process.exit(1);
    }
}

invokeExamples();