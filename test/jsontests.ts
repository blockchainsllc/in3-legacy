
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
import { readdirSync } from 'fs'
import { run_test } from './util/testRunner'

const testDir = 'test/testdata'
describe('JSON-Tests', () => {

  for (const f of readdirSync(testDir)) {
    it(f, async () => {
      const all = await run_test([testDir + '/' + f], -1)
      for (const r of all)
        assert.isTrue(r.success, r.c + ' : ' + r.descr + ' failed : ' + r.error)
    })
  }


})

