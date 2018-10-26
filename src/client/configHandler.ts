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

import { IN3Config, RPCRequest } from '../types/types'
import { request } from 'https';

/**
 * this method will adjust the config depending on the method.
 * @param ev 
 */
export function adjustConfig(ev: { requests: RPCRequest[], conf: IN3Config }) {
  for (const r of ev.requests) {
    switch (r.method) {
      case 'eth_blockNumber':
        ev.conf.proof = 'none'
        ev.conf.signatureCount = 0
        ev.conf.requestCount = 2
        break
      default:

    }
  }

}