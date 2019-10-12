import { Map, List }    from 'immutable'
import R                from 'ramda'
import * as Cell        from './Cell'
import * as CellContent from './CellContent'

const sentinelCell = Cell.create(-1, -1)

export interface Type {
    cells : List<any>
    width : number
    height: number
    random: () => number
}

export const create = (width: number, height: number) => Map({
    cells: createCells(width, height),
    width,
    height,
    random: () => Math.random()
}) as Map<any, any>

const createCells = (width: number, height: number) => List(
    R.lift((x, y) => Cell.create(x, y))(R.range(0, width), R.range(0, height))
)

export const initState = (cellField: Map<any, any>, mineCount: number, firstX: number, firstY: number) => {
    return cellField.update(cellField =>
        initMines(cellField, mineCount, firstX, firstY).update((cellField: Map<any, any>) =>
            initMineCounts(cellField)
        )
    )
}

type SortableTuple = [Map<any, any>, number, number]

const initMines = (cellField: Map<any, any>, mineCount: number, firstX: number, firstY: number) => {
    const randomSorted = R.pipe(
        R.map((i: number) => getSortableTuple(cellField, i, firstX, firstY)),
        R.sort(((x, y) => x[2] - y[2])),
    )(R.range(0, <number>cellField.get('cells').count()))

    const mineCells = R.pipe(
        R.take(mineCount),
        R.map((tuple: SortableTuple) => setContentToSortableTuple(tuple, CellContent.Type.Mine))
    )(randomSorted)

    const nonMineCells = R.pipe(
        R.drop(mineCount)
    )(randomSorted)

    return R.pipe(
        R.concat(nonMineCells as SortableTuple[]),
        R.sort((x, y) => x[1] - y[1]),
        R.map(x => x[0]),
        List,
        cells => cellField.set('cells', cells)
    )(mineCells)
}

const getSortableTuple = (cellField: Map<any, any>, i: number, firstX: number, firstY: number): SortableTuple => (
    [cellField.getIn([ 'cells', i ]), i, getRandomIndex(cellField, i, firstX, firstY)]
)

const getRandomIndex = (cellField: Map<any, any>, i: number, firstX: number, firstY: number): number => (
    i === firstX * cellField.get('height') + firstY ? Number.MAX_VALUE : cellField.get('random')()
)

const setContentToSortableTuple = (tuple: SortableTuple, content: CellContent.Type): SortableTuple => (
    [tuple[0].set('content', content), tuple[1], tuple[2]]
)

const initMineCounts = (cellField: Map<any, any>) => {
    const arounds = R.lift((i, j) => [i, j])([-1, 0, 1], [-1, 0, 1])
    
    return R.pipe(
        R.map((cell: Map<any, any>) => setMineCountToOneCell(cellField, cell, arounds)),
        List,
        cells => cellField.set('cells', cells)
    )(cellField.get('cells').toArray())
}

const setMineCountToOneCell = (cellField: Map<any, any>, cell: Map<any, any>, arounds: [number, number][]) => {
    if (cell.get('content') == CellContent.Type.Mine) {
        return cell
    }

    const count = R.pipe(
        R.map(([i, j]) => getCell(cellField, cell.get('x') + i, cell.get('y') + j)),
        R.filter(neighbor => neighbor.get('content') === CellContent.Type.Mine) as (_: Map<any, any>[]) => Map<any, any>[],
        R.length
    )(arounds)

    return cell.set('content', CellContent.of(count))
}

export const getCell = (cellField: Map<any, any>, x: number, y: number): Map<any, any> => {
    const width  = cellField.get('width')
    const height = cellField.get('height')

    if (0 <= x && x < width && 0 <= y && y < height) {
        return cellField.getIn([ 'cells', getIndex(x, y, width, height) ])
    }
    else {
        return sentinelCell
    }
}

export const setCell = (cellField: Map<any, any>, x: number, y: number, cell: Map<any, any>): Map<any, any> => {
    const width  = cellField.get('width')
    const height = cellField.get('height')

    if (0 <= x && x < width && 0 <= y && y < height) {
        return cellField.setIn([ 'cells', getIndex(x, y, width, height) ], cell)
    }
    else {
        return cellField
    }
}

const getIndex = (x: number, y: number, width: number, height: number) => (
    x * height + y
)
