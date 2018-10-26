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

import { IN3NodeConfig } from '../types/types'
import { keccak256 } from 'ethereumjs-util'


export function canProof(node: IN3NodeConfig) {
  return (node.props & 0x01) > 0
}

export function canMultiChain(node: IN3NodeConfig) {
  return (node.props & 0x02) > 0
}

export function createRandomIndexes(len: number, limit: number, seed: Buffer, result: number[] = []) {
  let step = seed.readUIntBE(0, 6) // first 6 bytes
  let pos = seed.readUIntBE(6, 6) % len// next 6 bytes
  while (result.length < limit) {
    if (result.indexOf(pos) >= 0)
      step = (seed = keccak256(seed)).readUIntBE(0, 6)
    else
      result.push(pos)
    pos = (pos + step) % len
  }
  return result
}
