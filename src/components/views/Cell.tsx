import * as React     from 'react'
import { Button }     from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
    BrightnessHigh as Mine,
    Flag,
    ContactSupport as Question
} from '@material-ui/icons'
import { Map }               from 'immutable'
import ReducerContext        from '../contexts/ReducerContext'
import * as CellFieldModel   from '../../models/CellField'
import * as CellContentModel from '../../models/CellContent'
import * as CellStateModel   from '../../models/CellState'
import * as ActionBase       from '../../store/actions/ActionBase'
import * as CellAction       from '../../store/actions/CellAction'
import zIndex from '@material-ui/core/styles/zIndex'

const Cell = ({ x, y }) => {
    const { state, dispatch } = React.useContext(ReducerContext)()
    const classes = useStyles()

    return (
        <div className={ classes.container }>
            <Button
                className={[
                    classes.top,
                    isOpened(state, x, y) ? classes.hidden : classes.visible
                ].join(' ')}
                onClick={ handleClick(dispatch, x, y) }>
                { getCellState(state, x, y) }
            </Button>
            <span
                className={[
                    classes.bottom,
                    isOpened(state, x, y) ? classes.visible : classes.hidden
                ].join(' ')}>
                { getCellContent(state, x, y ) }
            </span>
        </div>
    )
}

export default Cell

const handleClick = (dispatch: React.Dispatch<ActionBase.Type>, x: number, y: number) => () => {
    const action = CellAction.create('openCell', x, y)
    dispatch(action)
}

const isOpened = (state: Map<any, any>, x: number, y: number) => (
    getCell(state, x, y).get('state') === CellStateModel.Type.Opened
)

const getCellState = (state: Map<any, any>, x: number, y: number) => {
    const cellState = getCell(state, x, y).get('state')

    if (cellState === CellStateModel.Type.Flag) {
        return <Flag/>
    }
    else if (cellState === CellStateModel.Type.Question) {
        return <Question/>
    }
    else {
        return ''
    }
}

const getCellContent = (state: Map<any, any>, x: number, y: number) => {
    const content = getCell(state, x, y).get('content')

    if (content === CellContentModel.Type.Zero) {
        return ''
    }
    else if (content === CellContentModel.Type.Mine) {
        return <Mine/>
    }
    else {
        return CellContentModel.toMineCount(content).toString()
    }
}

const getCell = (state: Map<any, any>, x: number, y: number) => (
    CellFieldModel.getCell(state.getIn([ 'game', 'cellField' ]), x, y)
)

const useStyles = makeStyles({
    container: {
        display       : 'flex',
        justifyContent: 'center',
        alignItems    : 'center',
        position      : 'relative',
        width         : 100,
        height        : 100
    },
    visible: {
        visibility: 'visible'
    },
    hidden: {
        visibility: 'hidden'
    },
    top: {
        position  : 'absolute',
        zIndex    : 1,
        width     : 100,
        height    : 100,
        background: 'lightseagreen',
        '&:hover': {
            background: 'salmon'
        }
    },
    bottom: {
        position : 'absolute',
        zIndex   : 0,
    }
})
