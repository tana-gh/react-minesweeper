import * as ActionBase from './ActionBase'

export interface Type extends ActionBase.Type {
}

export const resetGame = 'resetGame'
export type TypeKind = typeof resetGame

export const create = (type: TypeKind): Type => ({
    type
})
