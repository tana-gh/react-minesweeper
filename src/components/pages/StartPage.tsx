import * as React  from 'react'
import * as Router from 'react-router'
import { TextField, Button } from '@material-ui/core'
import * as queryString from 'query-string'
import * as R           from 'ramda'
import * as C           from '../../constants'

const StartPage = () => {
    const history      = Router.useHistory()

    const [ width    , setWidth     ] = React.useState(3)
    const [ height   , setHeight    ] = React.useState(3)
    const [ mineCount, setMineCount ] = React.useState(3)

    const pushGamePage = React.useCallback(() => {
        history.push(createGamePath(width, height, mineCount))
    }, [])

    return (
        <div>
            <TextField value={ width     } onChange={ e => setWidth    (Number(e.target.value)) }/>
            <TextField value={ height    } onChange={ e => setHeight   (Number(e.target.value)) }/>
            <TextField value={ mineCount } onChange={ e => setMineCount(Number(e.target.value)) }/>
            <Button onClick={ pushGamePage }>Start!</Button>
        </div>
    )
}

export default StartPage

const createGamePath = (width: number, height: number, mineCount: number) => {
    const search = queryString.stringify({
        width    : Math.floor(R.clamp(1, 100, width)),
        height   : Math.floor(R.clamp(1, 100, height)),
        mineCount: Math.floor(R.clamp(1, width * height, mineCount))
    })
    return `${C.paths.game}?${search}`
}
