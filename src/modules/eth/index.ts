import {Module,register} from '../../client/modules'
import {verifyProof} from './verify'
import { RPCRequest, RPCResponse } from '../../types/types';
import Client from '../../client/Client'
import Filters from './filter'
import EthChainContext from './EthChainContext';

register({
    name:'eth',
    verifyProof,
    createChainContext:(client,chainId,spec)=>new EthChainContext(client,chainId,spec)
})