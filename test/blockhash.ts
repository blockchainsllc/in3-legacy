
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

import { assert } from 'chai'
import 'mocha'
import { serialize, util } from '../src/index'
import { checkBlockSignatures, getSigner, getChainSpec } from '../src/modules/eth/header'
import * as ethUtil from 'ethereumjs-util'
import { toNumber } from '../src/util/util';
const BN = ethUtil.BN
const toHex = util.toHex
const conf = require('../src/client/defaultConfig.json')
describe('Util-Functions', () => {


  it('calculate Blockhash for Kovan-Chain', async () => {
    await verifyBlock({
      "author": "0x0010f94b296a852aaac52ea6c5ac72e03afd032d",
      "difficulty": "340282366920938463463374607431768211454",
      "extraData": "0xd5830109058650617269747986312e32342e31826c69",
      "gasLimit": 8000000,
      "gasUsed": 21000,
      "hash": "0x38785baf660dd3237957ce9839576b463afbc413d317311260ecbb501284a5c8",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "miner": "0x0010f94b296A852aAac52EA6c5Ac72e03afD032D",
      "number": 7515488,
      "parentHash": "0xa9ca372a55991f18b8f0fa3aefeb015ccb37e3cb60a9fc53bafb894ca1f3e408",
      "receiptsRoot": "0x056b23fbba480696b65fe5a59b8f2148a1299103c4f57df839233af2cf4ca2d2",
      "sealFields": [
        "0x8416c3aff8",
        "0xb841097d67abf6913ef725eb575bd8d98d17fe6719951a365451c7fa110b30dc84b352454c9141b53948cd8262f42ed8b35cfc8ccde187736636b56db213be38dba500"
      ],
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "signature": "097d67abf6913ef725eb575bd8d98d17fe6719951a365451c7fa110b30dc84b352454c9141b53948cd8262f42ed8b35cfc8ccde187736636b56db213be38dba500",
      "size": 695,
      "stateRoot": "0x31366e9f6cf10bc8de5d3d9417912c80ea06be8220b1392c04c23a2a6f373bd1",
      "step": "381923320",
      "timestamp": 1527693280,
      "totalDifficulty": "2506944927415916974012083113227086943494378449",
      "transactions": [
        {
          "blockHash": "0x38785baf660dd3237957ce9839576b463afbc413d317311260ecbb501284a5c8",
          "blockNumber": 7515488,
          "chainId": null,
          "condition": null,
          "creates": null,
          "from": "0x003BBCE1eAC59b406dd0e143e856542Df3659075",
          "gas": 100000,
          "gasPrice": "14959965017",
          "hash": "0x43962671dcad750be56edc681b58201148eda48e5aaf786728ad3ea3ee3472db",
          "input": "0x",
          "nonce": 21054,
          "publicKey": "0x1b17207500785cd6b116488908ff3c464b5af92d1cd6298f438f95b08db2c0d150685e40f282f783dbbd5502449d7d38ee5a42adf8ee5b6e31cff38506f66714",
          "r": "0x1069dd801f74e2669cad4ee55fb2d724a14be6fb27da29383eebcaf39e63441",
          "raw": "0xf86f82523e85037baef359830186a0942f0c2cac736287339ad24992eeec1c58c7f207a7884563918244f40000801ca001069dd801f74e2669cad4ee55fb2d724a14be6fb27da29383eebcaf39e63441a03cacc00e030853c5ac79ece37bb5e555f325d9e5be9540e128feca4af5e02a0e",
          "s": "0x3cacc00e030853c5ac79ece37bb5e555f325d9e5be9540e128feca4af5e02a0e",
          "standardV": "0x1",
          "to": "0x2F0C2caC736287339ad24992EEEC1c58C7f207A7",
          "transactionIndex": 0,
          "v": "0x1c",
          "value": "5000000000000000000"
        }
      ],
      "transactionsRoot": "0x609b9fdb91fc9aeba07efa4382d3db7fbf835a5cf6d6bb2ff5db2ad8ea7942d0",
      "uncles": []
    }, '0x2a')
  })

  it('calculate Blockhash for Goerli-Chain', async () => {
    await verifyBlock({
      "author": "0x0000000000000000000000000000000000000000",
      "difficulty": "0x2",
      "extraData": "0x506172697479205465636820417574686f7269747900000000000000000000002c83a0626f7c0b8107123dae2385a133720299b6a938922c9da999f5806d15966cab2cb974fac40607d63df9da456e764c564dae625476bc6aa0d05c9eeda33f00",
      "gasLimit": "0x7a1200",
      "gasUsed": "0x0",
      "hash": "0xc4e82b4592c18837595f1e840815b7977c9fab915ec2431de577b1d4134480f2",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "miner": "0x0000000000000000000000000000000000000000",
      "number": "0xd5e",
      "parentHash": "0x9a69790d68becc844227ffd3299dcf5ec2bfc0930925db0d822ad82299bb0ade",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "sealFields": [
        "0xa00000000000000000000000000000000000000000000000000000000000000000",
        "0x880000000000000000"
      ],
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": "0x260",
      "stateRoot": "0x5d6cded585e73c4e322c30c2f782a336316f17dd85a4863b9d838d2d4b8b3008",
      "timestamp": "0x5c53d870",
      "totalDifficulty": "0x1abd",
      "transactions": [],
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "uncles": []
    })
  })


  it('calculate Blockhash for Parity Dev-Chain', async () => {
    await verifyBlock({
      "author": "0x0000000000000000000000000000000000000000",
      "difficulty": "0x20000",
      "extraData": "0xd5830108068650617269747986312e32332e30826c69",
      "gasLimit": "0x84c060",
      "gasUsed": "0x520c",
      "hash": "0xae1b6d679f980f28d67a97ef342c04f78ce34e6de5ce6e615827ba1e92d3ccfa",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "miner": "0x0000000000000000000000000000000000000000",
      "number": "0x11878",
      "parentHash": "0x3726b7e9ca281d27c62baf67870d75c5dfc265cfaac4347406cb7939f35e5e75",
      "receiptsRoot": "0xa7a6101e13368cffb3f9ff8488fe0ae20a4c5d7978ab2996b38d57d0d04770e3",
      "sealFields": [],
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": "0x254",
      "stateRoot": "0xfeebb31d853265d96f55cc4952111de26054bfe962107a752c8bb102fb79fead",
      "timestamp": "0x5afa8d8c",
      "totalDifficulty": "0x230f20000",
      "transactions": [
        {
          "blockHash": "0xae1b6d679f980f28d67a97ef342c04f78ce34e6de5ce6e615827ba1e92d3ccfa",
          "blockNumber": "0x11878",
          "chainId": null,
          "condition": null,
          "creates": null,
          "from": "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
          "gas": "0x55f0",
          "gasPrice": "0x0",
          "hash": "0x69889e5a5f8ffd615b5ef139c4b445fea0bd1debc71f38da57a36fbbd69d22ab",
          "input": "0x00",
          "nonce": "0x24",
          "publicKey": "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
          "r": "0xc1b7dca86f4fe39537e16d8c762f3a5b4cbf5b04961b513e794b7bd614ee9b51",
          "raw": "0xf86124808255f0942b5ad5c4795c026514f8317c7a215e218dccd6cf8203e8001ba0c1b7dca86f4fe39537e16d8c762f3a5b4cbf5b04961b513e794b7bd614ee9b51a04fe54a9ab9e9b2b05617cadb953aec8752849a447cc927a0d99a7298d99a7194",
          "s": "0x4fe54a9ab9e9b2b05617cadb953aec8752849a447cc927a0d99a7298d99a7194",
          "standardV": "0x0",
          "to": "0x2b5ad5c4795c026514f8317c7a215e218dccd6cf",
          "transactionIndex": "0x0",
          "v": "0x1b",
          "value": "0x3e8"
        }
      ],
      "transactionsRoot": "0x47e50893226177b4cb9c8d96f96d68da6a268b462a6bba0fec96613ce8f3e9c9",
      "uncles": []
    })
  })

  it('calculate Blockhash for Mainnet', async () => {
    await verifyBlock({
      "difficulty": "3242227738538447",
      "extraData": "0xe4b883e5bda9e7a59ee4bb99e9b1bc",
      "gasLimit": 8003935,
      "gasUsed": 7987467,
      "hash": "0x21a91426d5d628517814d032180ce3a46fcbac99943487750c175203a113a433",
      "logsBloom": "0x02880800004040020001200100000000000040044602102000810001020a0100001140411010080c0a00439001040452120038000c0081a00040000000204000000000440e2025508050488804002020004000018080000000002009c440002000200200320282048000002000088a0820260024880c4000000001100980810428840100a000400090488480500080008101003108880052000800180003a490420800000844000095000020411400200108042152010021450000000480002080101102000000080045840080004040200b0200100948840024000000203004001022040220000220000096000140440040010c082000040400800000004022",
      "miner": "0x829BD824B016326A401d083B33D092293333A830",
      "mixHash": "0x19e411178bfc0f5d955f3788a59eda05d5035240885f06cc2d2fcce4d059fb8d",
      "nonce": "0xc3a1ad2416f80418",
      "number": 5616368,
      "parentHash": "0xd71ec4d927119f4422df5c2590c7d33d2304b2f3f14c622b35b37515f7a2cbcc",
      "receiptsRoot": "0x998cf9304bee369c3267e4b124a74993a3699c6fc510f10ba1d100e30e656a12",
      "sha3Uncles": "0xae9448287592dde1e19063cba75a703d21a46544af5b81ec419cbc43acd17f7b",
      "size": 37815,
      "stateRoot": "0xea94c6df8552303c3779c4c87402a83af705f1f486c0b4dfddfc863f014a19e4",
      "timestamp": 1526364874,
      "totalDifficulty": "4202343565057091388831",
      "transactions": [
        "0x651f59e6a48485bb1f9372839b697daf7d14190d7a1ca14656424a95a55def9a",
        "0x70afb7a34b3ab2006eeb07ef8bf864561157317bdbc455c5d01d241eafb845ee",
        "0x2c5c25de6fdf59068aa0def3104192a3e3705f5e5b63c23df701235a8990a23a",
        "0x274536b9002fe7c0bf39cbbfd9c69ec1bf3c9a78f869eef4495ef6e35f5bcc15",
        "0xfbd397511fdf3b45d69d1f916f53c06a0756aa7bf6c7083c48f7374f1ac1dcca",
        "0x50f202afdc3e39abb3aff3b9ca971d37397b599c5a5cec78997bcf9807b721f7",
        "0xcf98c754c3408dc88139b851fd1c56bb139d85d5d16c59c2360f7e2ac5f96c91",
        "0xdb19ba866bb1c1c7691e350284457539de52fe72734ae9798105796ea77893ea",
        "0xc8921abd518f2d5c2e422ba57576268366b5448b92f614ee90e49063c3f5c987",
        "0x94367f62d7b2db8bb52bdca6944a1751adcf12cf2f167a21246ed2e0699c3b77",
        "0x3c3da59dc351c20f7569bccbb70578a3d970d7e3209e2c2c32c56d705a29d3da",
        "0xebc2ab0b9c879b3326e3aef1893fcb6ef0bbb51634ba3b501f6846de437940d3",
        "0xb79e0a7a3887f479e0cd60b9cf8ab0b79485efe548c0e844f478e406279be7f9",
        "0x20d3ade8794b46e1ee04e968ee4188e7f1b244c5a9e456a6332392efb04ac325",
        "0xc1b4299194424cb6ef147a5ab12ad9fd822448340dc749e2d6b196a9e6cdc911",
        "0x0ee6090f469e2d7cc8956d34d2bdb205f236661e7b842bae7b5b3f5d0341d48a",
        "0x592cb4269cc8d82382c6b4b80b22af77a08c9ad26dd2fe9083f21e5a142e3da2",
        "0x813be5c04a5172351e15445dc61cd0c0a01df00cf3638de662ef137125f9d373",
        "0xdbe850b1dc2365c6c766620f439c26a51ab7bd3449da7bdca0c20de847150770",
        "0xde1865ccfdcb86fb40a406c674cc10759a7cca406d3af1f4f9c57297cd3856cc",
        "0xe1dcbde0dd7c0d02a3f4fb2743147bff707dc9208119d75532ee88b481d04073",
        "0x575d78012246565c1eb0cebf2359583ea89a8eb06cbffd22f2fc43455bcd6f2d",
        "0xe3345ab28c5c261028397affc3a5770782f4bce83deb087d026e0e373b2bd54e",
        "0x22002c498f263c8a1d3fa0805f53e3291a7aa8e1d78b72306aa4fec718327deb",
        "0x781c4f73087b54b24b15c18702ef1d01b3d111e99eb7a53b836109185ee259c3",
        "0x8789de6b2f0be7e13dcf073f16c669a75510a111aaff81605352c954a85415f5",
        "0x4696644502bc9a2b51bc7fe4d4d13f07f87d56d69d7487e1ed3e766a5f90251e",
        "0x618a3a3c3ebd416c8eed1969dcf29b32f4487f1166a17070b5da96e7d75efbe8",
        "0x6abff26fcd247f0f7ba40404ef7dd61a3e02a80253af407fe135c2404890adce",
        "0x585a8b3aeb58dd500ad4d6120a9c716e369ef72e70b28a8cd66491f14a69e666",
        "0x62609dfe5197f66971c798d02c3dbfba1cbd940b111e4ea096db3994df31f0d2",
        "0x3df30d2759410a24874d924355f50c5be27624280b10d890510109a18f3e9464",
        "0x6de6f9d2cbc04e7045e3b236b6e9bfe2dfef3ef3ba9e6048ec1320bfcba03735",
        "0x881f81430be811bddd4fb30c1514da7177bfd6b5712a85f240eab9177aa0f0ff",
        "0xde05b013e05470adb078e91991f1ff1b2481b62ed42142d91a1ab8c303e88218",
        "0xeab7c44b596652a6c8faf2ffc3f4a663ef045c665886bd80509ddf15a20d03cc",
        "0xdc16aef546b3978bf3721a956ca69eaf21a84853fd1cd8d62cb891f7148ccd17",
        "0x024d6e1f8894114f974086f20f0653c148ed1bf43d6cd2e233610588d2bf20ca",
        "0xddf8d34adf6a8cf93c37d63f1d16e6b09b44c7385f43a82bf8ffdfc62a670d3f",
        "0x17c5c700226692a4245fbb2a362aefba2ed4bf640dd31478e07f27f6a72818e0",
        "0x1cb01681edbbc507c03d4fb99310bf3b55335b4831276c80b208cca55cf58449",
        "0x5f00dad43d91af2596706510f880f5d4b4cb05c82b5007a03dfac61b3bf03ba6",
        "0xe1a33f9dce9876f49df1231bcaf902f62a8edc643fdaf4df96426bf88535091c",
        "0x2357b9e076f34e3d73fb838e9782356e9579181c7f7dbf5162378fe43a368c6f",
        "0xc8e09bda1d834ef7957566ee61e43f75475cdf4823532928ba8a39ada4229619",
        "0x790bc471483ceecbce7ff2d894d8798bbd0dbe43d95af73889bddd8c146277cd",
        "0x0a30ba4fe9195f73643c4fe8c09ac74eb88596d64a561cc9e7347d034c92505e",
        "0x06523c9770df6ce5235f6980ba84bcee902222d56b3a8a8a4712d3d9363fc4bc",
        "0x5bdf4c0c095d9b028df64a629d8ece5d99df0958c688561fa3e120e4ee10a20e",
        "0x09bc9adfd7f262cd832f12b236ab69f2a25419a3d024f6dc6d6e2d7dbf933944",
        "0x962dffee6fadd5d7d642b80ca7b4d368279b34a010896de20b7be0ef8bc5a78d",
        "0xdbc332fe30d3d7b8a768ac7595499f642728fda2ed4905ff30882a40db00a55b",
        "0xa9b11d0e38f51262838f38945270335f06745eb708b004690c759823d37f6754",
        "0x3d300e81437350593773e9f9202865eeb1a2419ac95cf17247a4f4d44e11bda7",
        "0xcadcb441f7383c5ef2e179b34d1bab480174f3f2d056a71b57a54466f75784af",
        "0xb2a63370615bbd10359f8fa850664419ea4faf215311b8931193305310298278",
        "0x121b42d1ba75fb680cbe213a27c85c5616b15032d75f523d251996621fd499a6",
        "0x393b5db141cdda91c3c24a5d0fea9289f37b7840d26e47209f56236d15e95570",
        "0xb0d385f51cd2f879146672cd3a15ad786a87a3bc1549f46103c7c08cfc1e04cd",
        "0xc927bca328900ccd1868ad7709b2689b4640da62c567a849f1ca0260fd8761cc",
        "0x675086b81db8b5b1829dabd2580a40d5a61d1d9f8919e0c9e09eece35f70f9ce",
        "0x17baee886c8bf707ac880827fdc16cebd43e4e069c7be28279c7d3aabf2b5e11",
        "0x6c63da4d8aac9279524251da202b73c1d190ad55940fc79adf8b8ca01a7dad25",
        "0xc64e02c12b03cdc89045df73ea53788fcb87cb202f31c28a5d2e60ddca6093bc",
        "0x11f2d28000a3f541aa195bd00a3fe9090caab79bc714d0ab345b4266f7c4c911",
        "0x502969321017bd5be550cfcd9d9969e268df737de3f44901069da80fa5639492",
        "0x6c264b710444aa10406298390d53f943ede0b4e6662e54f9c97c7d3f901a4fa5",
        "0x184bbc442216522ddb0c31e87b07ee4ac01e2f51c8eda197a46350b2d25f3aee",
        "0x06e412c60a5f71642243d97e0d6ad7a672b3f3f8f2bad83d270dc6e2a4f4f386",
        "0xa9ee8ca71af3232532376e7ac5da0c210e85282f6537176dafb753af847db7a4",
        "0x5f527eda20ac9b66e3e5c810b82e258036d0605bcbf9d778802f0c8d8524e352",
        "0x614290179d049cb68db639de8668582eb3386173486e80ba2b18f4fc9581a0d2",
        "0xa9498ab05fd00f1c45febd9d4b6c3c08b9dba151f08cfe60c8079982f167b7e9",
        "0x974796a54ef50622390203096aa324170e15c017728c91be7560398c145cf534",
        "0x00a662a47bfb33c85c34cc415d8e4b77e8036fb915b72def1c2de686ee5bf6ea",
        "0xef521350a8196324d89b133bcc7dd580747b7db73be4e0b2367f78431b1d9fae",
        "0xf897265f9be4a60e166a843534443f15615dc1cb1cb678536be3b8934ae00e0f",
        "0xdb921208ad9dec5d583e9b209661b85abf7157b9c3775af386d3d80227fd1557",
        "0xe74d1501b18f606bc4435ee73b415c8bbc3c737c09076522d57a2f5cf9b3bb6d",
        "0x9150951dc62f5915c0fe1189c4ebadc0470e300c7f43540c65214f3bfdb0a6cd",
        "0xc78061313787db0ee48c87e99e7a84005c79cac693fd918c727e0e679921d765",
        "0x9b07b1775b706273767f021cdd6ffbbfb047c56adc05cbc8f9b92e673dd99aea",
        "0x7c95b3118767652666279b68ee01d959298ade2cf0faa6013b34d5024122bd07",
        "0x3c86914f174adb7d6976401c09791a08507c376f008d241e7c412a24e290064e",
        "0x7e908ce34811a014e204cf3ede03ff388616d79abf7ee40aa03e661983ed16df",
        "0x925510f6daaf80dd13f69406f6fd5da46ed262244fe3d2f32ba48cd7179fb35a",
        "0xa11268e8b52b313fdf34e31a58cb3a029dbfc2a2e4fe3f955fbe991928d3e918",
        "0x6e320f462872df9621d4c27ae029043a4b856218fa2bfb632385c2178dbd36f3",
        "0x298c5f66106e834e3a9089aeec619d1006d6665fd706b65561a106402b41d7bb",
        "0x28145c78e2744754e4f0b1bf220830b3c42dce1bd4fc181c15abc387ca8f77ab",
        "0x03acbe893f30a9d11656ff6910a198752178c8c47572c8dbc4da7955fa1efa7f",
        "0xefd69acedb3466670a0af250234252a897fe23ddfb02433bc28ea78aad0683fa",
        "0x9b56d5ffc4e750234094c079c275addb174f0d81c0b8d585a1413ec689539f52",
        "0x4cb4ecf024f7f7dab210de670a53447ad452e58f26f4016a5bc29c36fac8687f",
        "0x3ee1d209a0128bb364cba82de2f01dc6686b1f5d106d3511943aad7f8ef37677",
        "0x79ca010ddb139f08c96074c62265e09da11f29403d96808633e650f54cb86684",
        "0x8424e1a2d26554d534eea33656593e011a8702fb498f82020224f8dd5c235f6a",
        "0xd1de661371cd344994095563397de3d39cd8b7be9d26c77664ecf82af2c2108e",
        "0x17c329beabe5057dbc1399e9c1f75278ee60aa52a7213f46cd8804beb4cca095",
        "0x75ebb6f75f96166a9b515c274e96ddeae9078dced39688a59ef56c32d38f5fa8",
        "0x65e1d9bda625e3b2fc9b0945b6058a4adc11aa79d53eaccb468275a50155870e"
      ],
      "transactionsRoot": "0x6ab479b5fe2593bd5c34b106e4faf9b181e998647152f8a2a5d128024ea0426c",
      "uncles": [
        "0x710ce2dcbc8b442d96bd1696929e9347bf38e0ff9dae6951f9cfe3b173e62579"
      ]
    })

  })
})


async function verifyBlock(blockData: any, chainId?: string) {

  const b = new serialize.Block(blockData)

  //  assert.equal(b.raw.length, 15)
  //  assert.equal(b.sealedFields.length, 2)

  assert.equal(toHex(b.parentHash), toHex(blockData.parentHash))
  assert.equal(toHex(b.uncleHash), toHex(blockData.sha3Uncles))
  assert.equal(toHex(b.coinbase), toHex(blockData.miner))
  assert.equal(toHex(b.stateRoot), toHex(blockData.stateRoot))
  assert.equal(toHex(b.transactionsTrie), toHex(blockData.transactionsRoot))
  assert.equal(toHex(b.receiptTrie), toHex(blockData.receiptsRoot))
  assert.equal(toHex(b.bloom), toHex(blockData.logsBloom))
  assert.equal(toHex(new BN(b.difficulty.toString('hex'), 16)), toHex(blockData.difficulty))
  assert.equal(toHex(new BN(b.number.toString('hex'), 16)), toHex(blockData.number))
  assert.equal(toHex(new BN(b.gasLimit.toString('hex'), 16)), toHex(blockData.gasLimit))
  assert.equal(toHex(new BN(b.gasUsed.toString('hex'), 16)), toHex(blockData.gasUsed))
  assert.equal(toHex(new BN(b.timestamp.toString('hex'), 16)), toHex(blockData.timestamp))
  assert.equal(toHex(b.extra), toHex(blockData.extraData))
  if (blockData.mixHash)
    assert.equal('0x' + b.sealedFields[0].toString('hex'), blockData.mixHash.toLowerCase())
  if (blockData.nonce)
    assert.equal('0x' + b.sealedFields[1].toString('hex'), blockData.nonce.toLowerCase())



  const hash = new serialize.Block(blockData).hash()
  assert.equal('0x' + hash.toString('hex'), blockData.hash)

  if (chainId) {
    const spec = conf.servers[chainId].chainSpec
    const ctx = {
      chainSpec: spec,
      chainId,
      getFromCache: key => ctx[key],
      putInCache: (key, value) => ctx[key] = value
    } as any
    const chainSpec = await getChainSpec(b, ctx)
    const authrities = chainSpec.authorities
    const signer = getSigner(b)
    assert.isDefined(authrities.find(_ => _.equals(signer)))
    const finality = await checkBlockSignatures([b], async (block) => chainSpec)
  }

}
