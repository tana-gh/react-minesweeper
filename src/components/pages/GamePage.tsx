import * as React           from 'react'
import * as Router          from 'react-router'
import * as queryString     from 'query-string'
import CellField            from '../views/CellField'
import ReducerContext       from '../contexts/ReducerContext'
import * as StartGameAction from '../../store/actions/StartGameAction'

const GamePage = () => {
    const location  = Router.useLocation()
    const search    = queryString.parse(location.search)
    const width     = parseInt(search.width     as string)
    const height    = parseInt(search.height    as string)
    const mineCount = parseInt(search.mineCount as string)

    const { state, dispatch } = React.useContext(ReducerContext)()
    
    React.useEffect(() => {
        const action = StartGameAction.create('startGame', width, height, mineCount)
        dispatch(action)
    }, [])
    
    return (
        <div>
            { state.get('game') == null ? '' : <CellField/> }
        </div>
    )
}

export default GamePage
