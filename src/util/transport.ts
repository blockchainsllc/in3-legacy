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
* For more information, please refer to https://slock.it    *
* For questions, please contact info@slock.it              *
***********************************************************/

import { RPCRequest, RPCResponse } from '../types/types';
import axios from 'axios'
import * as cbor from '../util/cbor'

/**
 * A Transport-object responsible to transport the message to the handler.
 */
export interface Transport {
  /**
   * handles a request by passing the data to the handler
   */
  handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]>

  /**
   * check whether the handler is onlne.
   */
  isOnline(): Promise<boolean>

  /**
   * generates random numbers (between 0-1)
   */
  random(count: number): number[]

}


/**
 * Default Transport impl sending http-requests.
 */
export class AxiosTransport implements Transport {

  format: ('json' | 'cbor' | 'jsonRef')

  constructor(format: ('json' | 'cbor' | 'jsonRef') = 'json') {
    this.format = format
  }

  isOnline(): Promise<boolean> {
    return axios.head('https://www.google.com').then(_ => true, _ => false)
  }

  async handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]> {
    // convertto array
    const requests = Array.isArray(data) ? data : [data]

    // add cbor-config
    const conf = {}
    if (this.format === 'cbor')
      Object.assign(conf, {
        transformRequest: cbor.encodeRequests,
        transformResponse: cbor.decodeResponses,
        headers: { 'Content-Type': 'application/cbor' },
        responseType: 'arraybuffer'
      })

    // execute request
    try {
      const res = await axios.post(url, requests, { ...conf, timeout: timeout || 5000 })

      // throw if the status is an error
      if (res.status > 200) throw new Error('Invalid status')

      // if this was not given as array, we need to convert it back to a single object
      return Array.isArray(data) ? res.data : res.data[0]
    } catch (err) {
      throw new Error('Invalid response from ' + url + '(' + JSON.stringify(requests, null, 2) + ')' + ' : ' + err.message + (err.response ? (err.response.data || err.response.statusText) : ''))
    }
  }

  random(count: number): number[] {
    const result = []
    for (let i = 0; i < count; i++)
      result.push(Math.random())
    return result
  }

}