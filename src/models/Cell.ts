import Rx          from 'rxjs'
import * as CellContent from './CellContent'
import * as CellState   from './CellState'

export interface Type {
    readonly key    : string
    readonly x      : number
    readonly y      : number
    readonly content: Rx.BehaviorSubject<CellContent.Type>
    readonly state  : Rx.BehaviorSubject<CellState  .Type>
}

export const create = (x: number, y: number): Type => ({
    key: `(${x}, ${y})`,
    x,
    y,
    content: new Rx.BehaviorSubject<CellContent.Type>(CellContent.Type.Zero),
    state  : new Rx.BehaviorSubject<CellState  .Type>(CellState  .Type.Closed)
})
