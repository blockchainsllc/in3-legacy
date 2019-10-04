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

export interface Delta<T> {
    block: number
    start: number
    len: number
    data: T[]
}

export default class DeltaHistory<T> {
    data: Delta<T>[]

    constructor(init: T[] = [], deltaStrings = false) {
        if (deltaStrings)
            this.loadDeltaStrings(init as any)
        else {
            this.data = []
            if (init)
                this.addState(0, init)
        }
    }

    getData(index: number): T[] {
        const res = []
        for (const d of this.data) {
            if (d.block > index) return res
            res.splice(d.start, d.len, ...d.data)
        }
        return res
    }

    getLastIndex(): number {
        return this.data.length && this.data[this.data.length - 1].block
    }

    addState(start: number, data: T[]) {
        const prev = this.getData(start - 1)
        const delta = createDelta(prev, data, start)
        if (!delta) return
        if (!this.data.length || this.data[this.data.length - 1].block < start)
            this.data.push(delta)
        else {
            for (let i = this.data.length - 1; i >= 0; i--) {
                const d = this.data[i]
                if (d.block === start) {
                    const next = [...prev]
                    next.splice(d.start, d.len, ...d.data)  // old state
                    if (i + 1 < this.data.length)
                        next.splice(this.data[i + 1].start, this.data[i + 1].len, ...this.data[i + 1].data)  // next state
                    this.data[i] = delta
                    if (i + 1 == this.data.length) return
                    const nextDelta = createDelta(data, next, this.data[i + 1].block)
                    if (!nextDelta)
                        this.data.splice(i + 1, 1)
                    else
                        this.data[i + 1] = nextDelta
                    return
                }
                if (d.block < start) {
                    const n = this.data[i + 1]
                    const next = [...prev]
                    next.splice(n.start, n.len, ...n.data)  // next state
                    const nextDelta = createDelta(data, next, n.block)
                    if (!nextDelta)
                        n.block = start
                    else
                        this.data.splice(i + 1, 1, delta, nextDelta)
                    return
                }
            }
            // we need to insert into first pos
            const dn = createDelta(data, this.data[0].data, this.data[0].block)
            if (!dn)
                this.data[0].block = start
            else
                this.data.splice(0, 1, delta, dn)
        }
    }

    toDeltaStrings() {
        return this.data.map(_ => `${_.block.toString(16)}:${_.start.toString(16)}:${_.len.toString(16)}:${_.data.join(':')}`)
    }
    loadDeltaStrings(deltas: string[]) {
        this.data = deltas.map(_ => {
            const d = _.split(':')
            const [block, start, len] = d.slice(0, 3).map(_ => parseInt(_, 16))
            return { block, start, len, data: d.slice(3) as any as T[] }
        })
    }
}

function createDelta<T>(a: T[], b: T[], block: number) {
    const first = firstChange(a, b, 1)
    const last = firstChange(a, b, -1)

    // no change
    if (a.length === b.length && first === a.length) return null
    return {
        block,
        start: first,
        len: a.length - last - first,
        data: b.slice(first, b.length - last)
    }
}

function firstChange<T>(a: T[], b: T[], dir = 1) {
    const len = Math.min(a.length, b.length)
    for (let i = 0; i < len; i++) {
        if (dir === 1 && a[i] != b[i]) return i
        if (dir === -1 && a[a.length - 1 - i] != b[b.length - 1 - i]) return i
    }
    return len
}
