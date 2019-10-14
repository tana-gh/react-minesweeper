import { is }           from 'immutable'
import * as CellField   from '../../src/models/CellField'
import * as CellContent from '../../src/models/CellContent'
import * as CellState   from '../../src/models/CellState'

describe('create', () => {
    it('Assert properties', () => {
        const [ w, h ] = [ 4, 3 ]
        const cellField = CellField.create(w, h)

        expect(cellField.get('cells').count()).toBe(w * h)
        expect(cellField.get('width' )).toBe(w)
        expect(cellField.get('height')).toBe(h)
    })
})

describe('initState', () => {
    it('Assert value', () => {
        const [ w, h ] = [ 4, 3 ]
        let cellField = CellField.create(w, h)
        
        let num = 0
        cellField = cellField.set('random', () => num++)

        const mineCount = 6
        cellField = CellField.initState(cellField, mineCount, 0, 0)

        expect(cellField.getIn([ 'cells',  0, 'content' ])).toBe(CellContent.Type.Three)
        expect(cellField.getIn([ 'cells',  1, 'content' ])).toBe(CellContent.Type.Mine)
        expect(cellField.getIn([ 'cells',  2, 'content' ])).toBe(CellContent.Type.Mine)
        expect(cellField.getIn([ 'cells',  3, 'content' ])).toBe(CellContent.Type.Mine)
        expect(cellField.getIn([ 'cells',  4, 'content' ])).toBe(CellContent.Type.Mine)
        expect(cellField.getIn([ 'cells',  5, 'content' ])).toBe(CellContent.Type.Mine)
        expect(cellField.getIn([ 'cells',  6, 'content' ])).toBe(CellContent.Type.Mine)
        expect(cellField.getIn([ 'cells',  7, 'content' ])).toBe(CellContent.Type.Four)
        expect(cellField.getIn([ 'cells',  8, 'content' ])).toBe(CellContent.Type.Two)
        expect(cellField.getIn([ 'cells',  9, 'content' ])).toBe(CellContent.Type.One)
        expect(cellField.getIn([ 'cells', 10, 'content' ])).toBe(CellContent.Type.One)
        expect(cellField.getIn([ 'cells', 11, 'content' ])).toBe(CellContent.Type.Zero)
    })
})

describe('judge', () => {
    it('Judged', () => {
        let cellField = CellField.create(4, 3)
        const mineCount = 6
        cellField = CellField.initState(cellField, mineCount, 0, 0)
        cellField = CellField.judge(cellField)

        expect(
            cellField.get('cells').toArray()
                .filter(x => x.get('state') === CellState.Type.Mine)
        ).toHaveLength(mineCount)
    })
})

describe('getCell', () => {
    it('Assert value', () => {
        const [ w, h ] = [ 4, 3 ]
        let cellField = CellField.create(w, h)

        cellField = cellField.setIn([ 'cells', 0, 'content' ], CellContent.Type.One)

        expect(CellField.getCell(cellField, 0, 0).get('content')).toBe(CellContent.Type.One)
    })

    it('Assert sentinel value', () => {
        const [ w, h ] = [ 4, 3 ]
        let cellField = CellField.create(w, h)

        expect(CellField.getCell(cellField, -1, -1).get('content')).toBe(CellContent.Type.Wall)
    })
})

describe('setCell', () => {
    it('Assert value', () => {
        const [ w, h ] = [ 4, 3 ]
        let cellField = CellField.create(w, h)

        cellField = CellField.setCellValue(cellField, 0, 0, 'content', CellContent.Type.One)

        expect(cellField.getIn([ 'cells', 0, 'content' ])).toBe(CellContent.Type.One)
    })

    it('Assert sentinel value', () => {
        const [ w, h ] = [ 4, 3 ]
        const cellField0 = CellField.create(w, h)
        const cellField1 = CellField.setCellValue(cellField0, -1, -1, 'content', CellContent.Type.One)

        expect(is(cellField0, cellField1)).toBeTruthy()
    })
})
