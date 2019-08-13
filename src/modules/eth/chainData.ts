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

import Client from '../../client/Client'
import { toBuffer, toChecksumAddress } from 'ethereumjs-util'
import { toHex, toSimpleHex } from '../../util/util'
import { IN3Config } from '../../types/types';
import { RPCResponse } from '../..';
import { encodeFunction, decodeFunction } from './api';

export async function callContract(client: Client, contract: string, chainId: string, signature: string, args: any[], config?: IN3Config) {
  return decodeFunction(signature, await client.sendRPC('eth_call', [{
    to: contract,
    data: '0x' + encodeFunction(signature, args)
  },
    'latest'], chainId, config)
    .then(_ => (_.error ? Promise.reject(new Error('Error handling call to ' + contract + ' :' + JSON.stringify(_.error))) : toBuffer(_.result + '')) as any as RPCResponse))
}

export async function getChainData(client: Client, chainId: string, config?: IN3Config) {
  return callContract(client, client.defConfig.chainRegistry, client.defConfig.mainChain, 'chains(bytes32):(address,string,string,address,bytes32)', [toHex(chainId, 32)], config).then(_ => ({
    owner: toChecksumAddress(_[0]) as string,
    bootNodes: _[1].split(',') as string[],
    meta: _[2] as string,
    registryContract: toChecksumAddress(_[3]) as string,
    contractChain: toSimpleHex(toHex(_[4])) as string
  }))
}


