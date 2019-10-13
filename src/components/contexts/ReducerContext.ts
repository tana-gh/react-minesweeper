import * as React from 'react'
import { Map }    from 'immutable'
import * as ActionBase from '../../store/actions/ActionBase'

export interface Type {
    state   : Map<any, any>
    dispatch: React.Dispatch<ActionBase.Type>
}

const ReducerContext = React.createContext(() => ({} as Type))

export default ReducerContext
