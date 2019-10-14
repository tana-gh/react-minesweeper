import { Map }          from 'immutable'
import * as CellContent from './CellContent'
import * as CellState   from './CellState'

export interface Type {
    key    : string
    x      : number
    y      : number
    content: CellContent.Type
    state  : CellState.Type
}

export const create = (x: number, y: number) => Map({
    key: `(${x}, ${y})`,
    x,
    y,
    content: CellContent.Type.Zero,
    state  : CellState.Type.Closed
}) as Map<any, any>

export const judge = (cell: Map<any, any>) => {
    const content = cell.get('content')
    const state   = cell.get('state')

    if (content === CellContent.Type.Mine) {
        if (state === CellState.Type.Flag) {
            return cell.set('state', CellState.Type.Wrong)
        }
        else if (state !== CellState.Type.Opened) {
            return cell.set('state', CellState.Type.Mine)
        }
    }

    return cell
}
