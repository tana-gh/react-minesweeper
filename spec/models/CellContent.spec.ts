import * as CellContent from '../../src/models/CellContent'

describe('toMineCount', () => {
    it('Assert value', () => {
        expect(CellContent.toMineCount(CellContent.Type.Zero )).toBe(0)
        expect(CellContent.toMineCount(CellContent.Type.One  )).toBe(1)
        expect(CellContent.toMineCount(CellContent.Type.Two  )).toBe(2)
        expect(CellContent.toMineCount(CellContent.Type.Three)).toBe(3)
        expect(CellContent.toMineCount(CellContent.Type.Four )).toBe(4)
        expect(CellContent.toMineCount(CellContent.Type.Five )).toBe(5)
        expect(CellContent.toMineCount(CellContent.Type.Six  )).toBe(6)
        expect(CellContent.toMineCount(CellContent.Type.Seven)).toBe(7)
        expect(CellContent.toMineCount(CellContent.Type.Eight)).toBe(8)
    })
})

describe('of', () => {
    it('Assert value', () => {
        expect(CellContent.of(0)).toBe(CellContent.Type.Zero )
        expect(CellContent.of(1)).toBe(CellContent.Type.One  )
        expect(CellContent.of(2)).toBe(CellContent.Type.Two  )
        expect(CellContent.of(3)).toBe(CellContent.Type.Three)
        expect(CellContent.of(4)).toBe(CellContent.Type.Four )
        expect(CellContent.of(5)).toBe(CellContent.Type.Five )
        expect(CellContent.of(6)).toBe(CellContent.Type.Six  )
        expect(CellContent.of(7)).toBe(CellContent.Type.Seven)
        expect(CellContent.of(8)).toBe(CellContent.Type.Eight)
    })
})
