import { Map }          from 'immutable'
import * as R           from 'ramda'
import * as GameStatus  from './GameStatus'
import * as CellField   from './CellField'
import * as CellContent from './CellContent'
import * as CellState   from './CellState'

export interface Type {
    cellField: Map<any, any>
    mineCount: number
    restCount: number
    status   : GameStatus.Type
}

export const create = (width: number, height: number, mineCount: number) => Map({
    cellField: CellField.create(width, height),
    mineCount,
    restCount: width * height - mineCount,
    status   : GameStatus.Type.Ready
}) as Map<any, any>

export const open = (game: Map<any, any>, x: number, y: number) => {
    if (!isInRange(game, x, y)) {
        return game
    }

    const status = game.get('status')
    
    if (status === GameStatus.Type.Success || status === GameStatus.Type.Failure) {
        return game
    }

    const cell = CellField.getCell(game.get('cellField'), x, y)

    if (cell.get('state') !== CellState.Type.Closed) {
        return game
    }
    
    if (status === GameStatus.Type.Ready) {
        game = game
            .update('cellField', cellField => CellField.initState(cellField, game.get('mineCount'), x, y))
            .set('status', GameStatus.Type.Playing)
    }
    
    return openTargetCells(game, x, y)
        .update(game => updateGameStatus(game, x, y))
}

const openTargetCells = (game: Map<any, any>, x: number, y: number) => {
    const cell  = CellField.getCell(game.get('cellField'), x, y)
    const state = cell.get('state')

    if (state !== CellState.Type.Closed) {
        return game
    }

    const content = cell.get('content')

    if (content === CellContent.Type.Zero) {
        return openNineCells(game, x, y)
    }
    else {
        return openOneCell(game, x, y)
    }
}

const openNineCells = (game: Map<any, any>, x: number, y: number) => (
    openOneCell(game, x, y)
        .update(game =>
            R.pipe<any, any, any>(
                R.map(([ i, j ]) => (game: Map<any, any>) => openTargetCells(game, x + i, y + j)),
                R.reduce((acc, f: (_: Map<any, any>) => Map<any, any>) => f(acc), game)
            )(R.lift((i, j) => [ i, j ])([-1, 0, 1], [-1, 0, 1]))
        )
)

const openOneCell = (game: Map<any, any>, x: number, y: number) => (
    game.update('cellField', cellField => CellField.setCellValue(cellField, x, y, 'state', CellState.Type.Opened))
        .update('restCount', restCount => restCount - 1)
)

const updateGameStatus = (game: Map<any, any>, x: number, y: number) => {
    const content = CellField.getCell(game.get('cellField'), x, y).get('content')

    if (content === CellContent.Type.Mine) {
        return judge(game).set('status', GameStatus.Type.Failure)
    }
    else if (game.get('restCount') <= 0) {
        return game.set('status', GameStatus.Type.Success)
    }
    else {
        return game
    }
}

export const rotateState = (game: Map<any, any>, x: number, y: number) => {
    if (!isInRange(game, x, y)) {
        return game
    }

    const status = game.get('status')
    
    if (status !== GameStatus.Type.Playing) {
        return game
    }

    const state = CellField.getCell(game.get('cellField'), x, y).get('state')

    if (state === CellState.Type.Opened) {
        return game
    }

    let value: CellState.Type

    switch (state) {
        case CellState.Type.Closed:
            value = CellState.Type.Flag
            break
        
        case CellState.Type.Flag:
            value = CellState.Type.Question
            break

        case CellState.Type.Question:
            value = CellState.Type.Closed
            break
    }

    return game.update('cellField', cellField => CellField.setCellValue(cellField, x, y, 'state', value))
}

const isInRange = (game: Map<any, any>, x: number, y: number) => {
    const width  = game.getIn([ 'cellField', 'width'  ])
    const height = game.getIn([ 'cellField', 'height' ])

    return 0 <= x && x < width && 0 <= y && y <= height
}

export const judge = (game: Map<any, any>) => (
    game.update('cellField', cellField => CellField.judge(cellField))
)
