import R                from 'ramda'
import * as Cell        from './Cell'
import * as CellContent from './CellContent'

const sentinelCell = Cell.create(-1, -1)

export interface Type {
    readonly cells : Cell.Type[]
    readonly width : number
    readonly height: number
}

export const create = (width: number, height: number): Type => ({
    cells: createCells(width, height),
    width,
    height
})

const createCells = (width: number, height: number) => (
    R.lift((x, y) => Cell.create(x, y), R.range(0, width), R.range(0, height))
)

export const setState = (cellField: Type, mineCount: number, firstX: number, firstY: number, random: () => number) => {
    setMines(cellField, mineCount, firstX, firstY, random)
    setMineCounts(cellField)
}

const setMines = (cellField: Type, mineCount: number, firstX: number, firstY: number, random: () => number) => {
    R.pipe(
        R.filter((i: number) => i != firstX * cellField.height + firstY) as (_: number[]) => number[],
        R.map(i => [cellField.cells[i], random()] as [Cell.Type, number]),
        R.sort(((x, y) => x[1] - y[1])),
        R.take(mineCount),
        R.forEach((cell: Cell.Type) => cell.content.next(CellContent.Type.Mine))
    )(R.range(0, cellField.cells.length))
}

const setMineCounts = (cellField: Type) => {
    const arounds = R.lift((i, j) => [i, j], [-1, 0, 1], [-1, 0, 1])
    R.forEach(cell => setMineCountToOneCell(cellField, cell, arounds), cellField.cells)
}

const setMineCountToOneCell = (cellField: Type, cell: Cell.Type, arounds: [number, number][]) => {
    if (cell.content.getValue() == CellContent.Type.Mine) {
        return
    }

    const count = R.pipe(
        R.map(([i, j]) => getCell(cellField, cell.x + i, cell.y + j)),
        R.filter(neighbor => neighbor.content.getValue() == CellContent.Type.Mine) as (_: Cell.Type[]) => Cell.Type[],
        R.length
    )(arounds)

    cell.content.next(count)
}

export const getCell = (cellField: Type, x: number, y: number) => {
    if (0 <= x || x < cellField.width || 0 <= y || y < cellField.height) {
        return cellField.cells[x * cellField.height + y]
    }
    else {
        return sentinelCell
    }
}
