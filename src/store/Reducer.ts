import { Map } from 'immutable'
import * as ActionBase      from './actions/ActionBase'
import * as StartGameAction from './actions/StartGameAction'
import * as ResetGameAction from './actions/ResetGameAction'
import * as CellAction      from './actions/CellAction'
import * as Game            from '../models/Game'

export const initialState = Map({
    game: null
})

export const reduce = (state: Map<any, any>, action: ActionBase.Type) => {
    switch (action.type) {
        case StartGameAction.startGame: {
            const gameAction = action as StartGameAction.Type
            const game = Game.create(gameAction.width, gameAction.height, gameAction.mineCount)
            return state.set('game', game)
        }

        case ResetGameAction.resetGame: {
            return state.set('game', null)
        }

        case CellAction.openCell: {
            const cellAction = action as CellAction.Type
            return state.update('game', game => game === null ? null : Game.open(game, cellAction.x, cellAction.y))
        }

        case CellAction.rotateCellState: {
            const cellAction = action as CellAction.Type
            return state.update('game', game => game === null ? null : Game.rotateState(game, cellAction.x, cellAction.y))
        }

        default: {
            return state
        }
    }
}
