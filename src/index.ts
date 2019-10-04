/*******************************************************************************
 * This file is part of the Incubed project.
 * Sources: https://github.com/slockit/in3
 * 
 * Copyright (C) 2018-2019 slock.it GmbH, Blockchains LLC
 * 
 * 
 * COMMERCIAL LICENSE USAGE
 * 
 * Licensees holding a valid commercial license may use this file in accordance 
 * with the commercial license agreement provided with the Software or, alternatively, 
 * in accordance with the terms contained in a written agreement between you and 
 * slock.it GmbH/Blockchains LLC. For licensing terms and conditions or further 
 * information please contact slock.it at in3@slock.it.
 * 	
 * Alternatively, this file may be used under the AGPL license as follows:
 *    
 * AGPL LICENSE USAGE
 * 
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY 
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * [Permissions of this strong copyleft license are conditioned on making available 
 * complete source code of licensed works and modifications, which include larger 
 * works using a licensed work, under the same license. Copyright and license notices 
 * must be preserved. Contributors provide an express grant of patent rights.]
 * You should have received a copy of the GNU Affero General Public License along 
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/

import { util as _util } from 'in3-common'
export const util = _util

import Client, { aliases } from './client/Client'
import EthAPI_ from './modules/eth/api'
import { validate as validateOb } from 'in3-common'
export default Client

export const EthAPI = EthAPI_

export type IN3Client = Client

import { cbor as _cbor } from 'in3-common'
export const cbor = _cbor

import * as _serialize from 'in3-common/js/src/modules/eth/serialize'
export const serialize = _serialize

import * as _header from './modules/eth/header'
export const header = _header

import { storage as _storage } from 'in3-common'
export const storage = _storage

import { transport as _transport } from 'in3-common'
import { Transport as _transporttype } from 'in3-common'
export const transport = _transport

import * as _chainData from './modules/eth/chainData'
export const chainData = _chainData

import * as _nodeList from './client/serverList'
export const createRandomIndexes = _nodeList.createRandomIndexes


import * as types from './types/types'

export type RPCRequest = types.RPCRequest
export type AccountProof = types.AccountProof
export type IN3Config = types.IN3Config
export type IN3NodeConfig = types.IN3NodeConfig
export type IN3NodeWeight = types.IN3NodeWeight
export type IN3RPCRequestConfig = types.IN3RPCRequestConfig
export type IN3ResponseConfig = types.IN3ResponseConfig
export type LogProof = types.LogProof
export type Proof = types.Proof
export type AuraValidatoryProof = types.AuraValidatoryProof
export type RPCResponse = types.RPCResponse
export type Signature = types.Signature
export type Transport = _transporttype
export type ServerList = types.ServerList
export type BlockData = _serialize.BlockData 
export type LogData = _serialize.LogData 
export type ReceiptData = _serialize.ReceiptData 
export type TransactionData = _serialize.TransactionData 
export type IN3RPCConfig = types.IN3RPCConfig
export type IN3RPCHandlerConfig = types.IN3RPCHandlerConfig
export type ChainSpec = types.ChainSpec

export const AxiosTransport = transport.AxiosTransport
export const typeDefs = types.validationDef
export const validate = validateOb.validate 
export const chainAliases = aliases
