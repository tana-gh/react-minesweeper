import * as ActionBase from './ActionBase'

export interface Type extends ActionBase.Type {
    x   : number
    y   : number
}

export const openCell        = 'openCell'
export const rotateCellState = 'rotateCellState'
export type TypeKind = typeof openCell | typeof rotateCellState

export const create = (type: TypeKind, x: number, y: number): Type => ({
    type,
    x,
    y
})
