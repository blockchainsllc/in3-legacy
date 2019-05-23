
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
import DeltaHistory from '../src/util/DeltaHistory'

describe('Delta History', () => {


  it('add states', () => {
    const h = new DeltaHistory()
    h.addState(10,['a','b'])
    assert.deepEqual(h.getData(5),[])
    assert.deepEqual(h.getData(9),[])
    assert.deepEqual(h.getData(10),['a','b'])
    assert.deepEqual(h.getData(11),['a','b'])
    assert.equal(h.getLastIndex(), 10)


    h.addState(20,['a','d','e'])
    assert.deepEqual(h.getData(9),[])
    assert.deepEqual(h.getData(10),['a','b'])
    assert.deepEqual(h.getData(19),['a','b'])
    assert.deepEqual(h.getData(20),['a','d','e'])
    assert.equal(h.getLastIndex(), 20)

    h.addState(15,['d','e'])
    assert.deepEqual(h.getData(9),[])
    assert.deepEqual(h.getData(10),['a','b'])
    assert.deepEqual(h.getData(14),['a','b'])
    assert.deepEqual(h.getData(15),['d','e'])
    assert.deepEqual(h.getData(20),['a','d','e'])
    assert.equal(h.getLastIndex(), 20)

    h.loadDeltaStrings(h.toDeltaStrings())
    assert.deepEqual(h.getData(9),[])
    assert.deepEqual(h.getData(10),['a','b'])
    assert.deepEqual(h.getData(14),['a','b'])
    assert.deepEqual(h.getData(15),['d','e'])
    assert.deepEqual(h.getData(20),['a','d','e'])

  })


})
