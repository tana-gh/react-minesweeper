import Rx               from 'rxjs'
import * as GameStatus  from './GameStatus'
import * as CellField   from './CellField'
import * as CellContent from './CellContent'
import * as CellState   from './CellState'

export interface Type {
    cellField: CellField.Type
    mineCount: number
    restCount: Rx.BehaviorSubject<number>
    status   : Rx.BehaviorSubject<GameStatus.Type>
}

export const create = (width: number, height: number, mineCount: number): Type => ({
    cellField: CellField.create(width, height),
    mineCount,
    restCount: new Rx.BehaviorSubject<number>(width * height - mineCount),
    status   : new Rx.BehaviorSubject<GameStatus.Type>(GameStatus.Type.Ready)
})

export const open = (game: Type, x: number, y: number) => {
    const status = game.status.getValue()
    
    if (status == GameStatus.Type.Success || status == GameStatus.Type.Failure) {
        return
    }

    const cell = CellField.getCell(game.cellField, x, y)

    if (cell.state.getValue() != CellState.Type.Closed) {
        return
    }
    
    if (status == GameStatus.Type.Ready) {
        CellField.setState(game.cellField, game.mineCount, x, y, () => Math.random())
        game.status.next(GameStatus.Type.Playing)
    }

    if (cell.content.getValue() == CellContent.Type.Mine) {
        game.status.next(GameStatus.Type.Failure)
        return
    }
    
    cell.state.next(CellState.Type.Opened)
    game.restCount.next(game.restCount.getValue() - 1)
}

export const rotateState = (game: Type, x: number, y: number) => {
    const status = game.status.getValue()
    
    if (status != GameStatus.Type.Playing) {
        return
    }

    const cell = CellField.getCell(game.cellField, x, y)

    if (cell.state.getValue() == CellState.Type.Opened) {
        return
    }

    switch (cell.state.getValue()) {
        case CellState.Type.Closed:
            cell.state.next(CellState.Type.Flag)
            break;
        
        case CellState.Type.Flag:
            cell.state.next(CellState.Type.Question)
            break;

        case CellState.Type.Question:
            cell.state.next(CellState.Type.Closed)
            break;
    }
}
