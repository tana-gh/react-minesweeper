import * as React  from 'react'
import * as Router from 'react-router'
import { History } from 'history'
import {
    TextField,
    Button,
    makeStyles
} from '@material-ui/core'
import * as queryString from 'query-string'
import * as R           from 'ramda'
import * as C           from '../../constants'

const StartPage = () => {
    const [ width    , setWidth     ] = React.useState('')
    const [ height   , setHeight    ] = React.useState('')
    const [ mineCount, setMineCount ] = React.useState('')

    const history = Router.useHistory()
    
    const classes = useStyles()

    return (
        <div>
            <TextField
                className ={ classes.textField }
                type      ="number"
                //inputProps={{ min: 1, max: 10, step: 1 }}
                label     ="Width"
                margin    ="dense"
                value     ={ width }
                onChange  ={ setFromEvent(setWidth) }/>
            <TextField
                className ={ classes.textField }
                type      ="number"
                //inputProps={{ min: 1, max: 10, step: 1 }}
                label     ="Height"
                margin    ="dense"
                value     ={ height }
                onChange  ={ setFromEvent(setHeight) }/>
            <TextField
                className ={ classes.textField }
                type      ="number"
                //inputProps={{ min: 1, max: 10, step: 1 }}
                label     ="Mine Count"
                margin    ="dense"
                value     ={ mineCount }
                onChange  ={ setFromEvent(setMineCount) }/>
            <Button
                className={ classes.button }
                onClick  ={ pushGamePage(history, width, height, mineCount) }>
                Start!
            </Button>
        </div>
    )
}

export default StartPage

const setFromEvent = (setValue: (value: string) => void) => (e: any) => {
    setValue(e.target.value)
}

const pushGamePage = (history: History, width: string, height: string, mineCount: string) => () => {
    history.push(createGamePath(width, height, mineCount))
}

const createGamePath = (width: string, height: string, mineCount: string) => {
    let search: string

    if (width === '' || height === '' || mineCount === '') {
        search = queryString.stringify({
            width    : 3,
            height   : 3,
            mineCount: 3
        })
    }
    else {
        const [ w, h, m ] = [
            Number(width),
            Number(height),
            Number(mineCount)
        ]
        search = queryString.stringify({
            width    : Math.floor(R.clamp(1, 100, w)),
            height   : Math.floor(R.clamp(1, 100, h)),
            mineCount: Math.floor(R.clamp(1, w * h, m))
        })
    }
    
    return `${C.paths.game}?${search}`
}

const useStyles = makeStyles({
    textField: {
        display: 'block',
        width  : 400
    },
    button: {
        display   : 'block',
        width     : 200,
        background: 'mediumseagreen',
        color     : 'white'
    }
})
