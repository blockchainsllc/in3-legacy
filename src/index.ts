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

import Client, { aliases } from './client/Client'
import * as validateOb from './util/validate'
export default Client


import * as _util from './util/util'
export const util = _util

export type IN3Client = Client

import * as _cbor from './util/cbor'
export const cbor = _cbor

import * as _serialize from './util/serialize'
export const serialize = _serialize

import * as _storage from './util/storage'
export const storage = _storage

import * as _transport from './util/transport'
export const transport = _transport


import * as _chainData from './client/chainData'
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
export type RPCResponse = types.RPCResponse
export type Signature = types.Signature
export type Transport = _transport.Transport
export type ServerList = types.ServerList
export type BlockData = _serialize.BlockData
export type LogData = _serialize.LogData
export type ReceiptData = _serialize.ReceiptData
export type TransactionData = _serialize.TransactionData
export type IN3RPCConfig = types.IN3RPCConfig
export type IN3RPCHandlerConfig = types.IN3RPCHandlerConfig

export const AxiosTransport = transport.AxiosTransport
export const typeDefs = types.validationDef
export const validate = validateOb.validate
export const chainAliases = aliases