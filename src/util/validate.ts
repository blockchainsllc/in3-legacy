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
* For more information, please refer to http://slock.it    *
* For questions, please contact info@slock.it              *
***********************************************************/

import * as Ajv from 'ajv'
import * as util from './util'


/**
 * the ajv instance with custom formatters and keywords
 */
export const ajv = new Ajv()
ajv.addFormat('address', /^0x[0-9a-fA-F]{40}$/)
ajv.addFormat('bytes32', /^0x[0-9a-fA-F]{64}$/)
ajv.addFormat('bytes64', /^0x[0-9a-fA-F]{128}$/)
ajv.addFormat('hex', /^0x[0-9a-fA-F]{2,}$/)
ajv.addFormat('hexWithout', /^[0-9a-fA-F]{2,}$/)
ajv.addFormat('path', /^[\/a-zA-Z_\-0-9]+$/)

ajv.addKeyword('timestamp', {
  type: 'number',
  validate: (sch, data) => sch === 'current'
    ? !!(data > Date.now() / 1000 - 60 || data < Date.now() / 1000 + 60)
    : !!(data === 0 || Date.now() / 1000 - 3600 * 24 * 365 || data < Date.now() / 1000 + 3600 * 24 * 365)
})

/**
 * validates the data and throws an error in case they are not valid.
 * 
 * @export
 * @param {Ajv.ValidateFunction} fn 
 * @param {any} ob 
 */
export function validateAndThrow(fn: Ajv.ValidateFunction, ob) {
  if (!fn(ob))
    throw new Error('ERRKEY: invalid_data : ' + (fn).errors.map(_ =>
      _.dataPath + '(' + JSON.stringify(_.data || _.params) + '):' + _.message).join(', ') + ':' + JSON.stringify(ob, null, 2))
}

export function validate(ob: any, def: any) {
  validateAndThrow(ajv.compile(def), ob)
}

