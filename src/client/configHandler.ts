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