import * as Cell        from '../../src/models/Cell'
import * as CellContent from '../../src/models/CellContent'
import * as CellState   from '../../src/models/CellState'

describe('create', () => {
    it('Assert properties', () => {
        const [ x, y ] = [ 10, 20 ]
        const cell = Cell.create(x, y)

        expect(cell.get('x')).toBe(x)
        expect(cell.get('y')).toBe(y)
        expect(cell.get('content')).toBe(CellContent.Type.Zero)
        expect(cell.get('state'  )).toBe(CellState.Type.Closed)
    })

    it ('Assert key', () => {
        const cell0 = Cell.create(10, 20)
        const cell1 = Cell.create(10, 20)
        const cell2 = Cell.create(30, 40)

        expect(cell0.get('key'))    .toBe(cell1.get('key'))
        expect(cell0.get('key')).not.toBe(cell2.get('key'))
    })
})
