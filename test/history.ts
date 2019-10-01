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

import { assert } from 'chai'
import 'mocha'
import DeltaHistory from '../src/util/DeltaHistory'

describe('Delta History', () => {


  it('add states', () => {
    const h = new DeltaHistory()
    h.addState(10, ['a', 'b'])
    assert.deepEqual(h.getData(5), [])
    assert.deepEqual(h.getData(9), [])
    assert.deepEqual(h.getData(10), ['a', 'b'])
    assert.deepEqual(h.getData(11), ['a', 'b'])
    assert.equal(h.getLastIndex(), 10)


    h.addState(20, ['a', 'd', 'e'])
    assert.deepEqual(h.getData(9), [])
    assert.deepEqual(h.getData(10), ['a', 'b'])
    assert.deepEqual(h.getData(19), ['a', 'b'])
    assert.deepEqual(h.getData(20), ['a', 'd', 'e'])
    assert.equal(h.getLastIndex(), 20)

    h.addState(15, ['d', 'e'])
    assert.deepEqual(h.getData(9), [])
    assert.deepEqual(h.getData(10), ['a', 'b'])
    assert.deepEqual(h.getData(14), ['a', 'b'])
    assert.deepEqual(h.getData(15), ['d', 'e'])
    assert.deepEqual(h.getData(20), ['a', 'd', 'e'])
    assert.equal(h.getLastIndex(), 20)

    h.loadDeltaStrings(h.toDeltaStrings())
    assert.deepEqual(h.getData(9), [])
    assert.deepEqual(h.getData(10), ['a', 'b'])
    assert.deepEqual(h.getData(14), ['a', 'b'])
    assert.deepEqual(h.getData(15), ['d', 'e'])
    assert.deepEqual(h.getData(20), ['a', 'd', 'e'])

  })


})
