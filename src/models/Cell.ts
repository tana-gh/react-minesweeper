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
