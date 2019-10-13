import * as React     from 'react'
import * as Reducer   from '../store/Reducer'
import ReducerContext from './contexts/ReducerContext'
import Router         from './Router'

const App = () => {
    const [ state, dispatch ] = React.useReducer(Reducer.reduce, Reducer.initialState)
    const reducerProvider = React.useCallback(() => ({
        state,
        dispatch
    }), [ state, dispatch ])

    return (
        <ReducerContext.Provider value={ reducerProvider }>
            <Router/>
        </ReducerContext.Provider>
    )
}

export default App
