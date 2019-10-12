import { Map }          from 'immutable'
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
    const status = game.get('status')
    
    if (status === GameStatus.Type.Success || status === GameStatus.Type.Failure) {
        return game
    }

    const cell = CellField.getCell(game.get('cellField'), x, y)

    if (cell.get('state') !== CellState.Type.Closed) {
        return game
    }
    
    if (status === GameStatus.Type.Ready) {
        game = game.update('cellField', cellField => CellField.initState(cellField, game.get('mineCount'), x, y))
        game = game.set('status', GameStatus.Type.Playing)
    }

    if (cell.get('content') === CellContent.Type.Mine) {
        return game.set('status', GameStatus.Type.Failure)
    }
    
    return game
        .update('cellField', cellField => CellField.setCell(cellField, x, y, cell.set('state', CellState.Type.Opened)))
        .update('restCount', restCount => restCount - 1)
        .update(game => game.get('restCount') <= 0 ? game.set('status', GameStatus.Type.Success) : game)
}

export const rotateState = (game: Map<any, any>, x: number, y: number) => {
    const status = game.get('status')
    
    if (status !== GameStatus.Type.Playing) {
        return game
    }

    let   cell  = CellField.getCell(game.get('cellField'), x, y)
    const state = cell.get('state')

    if (state === CellState.Type.Opened) {
        return game
    }

    switch (state) {
        case CellState.Type.Closed:
            cell = cell.set('state', CellState.Type.Flag)
            break
        
        case CellState.Type.Flag:
            cell = cell.set('state', CellState.Type.Question)
            break

        case CellState.Type.Question:
            cell = cell.set('state', CellState.Type.Closed)
            break
    }

    return game.update('cellField', cellField => CellField.setCell(cellField, x, y, cell))
}
