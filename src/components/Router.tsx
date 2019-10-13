import * as React from 'react'
import {
    HashRouter,
    Switch,
    Route
} from 'react-router-dom'
import StartPage from './pages/StartPage'
import GamePage  from './pages/GamePage'
import * as C    from '../constants'

const Router = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path={ C.paths.start } exact>
                    <StartPage/>
                </Route>
            </Switch>
            <Switch>
                <Route path={ C.paths.game } exact>
                    <GamePage/>
                </Route>
            </Switch>
        </HashRouter>
    )
}

export default Router
