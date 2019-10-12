import * as ActionBase from './ActionBase'

export interface Type extends ActionBase.Type {
    width    : number
    height   : number
    mineCount: number
}

export const startGame = 'startGame'
export type TypeKind = typeof startGame

export const create = (type: TypeKind, width: number, height: number, mineCount: number): Type => ({
    type,
    width,
    height,
    mineCount
})
