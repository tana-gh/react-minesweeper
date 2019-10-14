import * as React from 'react'
import {
    Button,
    Fade,
    makeStyles
} from '@material-ui/core'
import {
    BrightnessHigh as Mine,
    Flag,
    Help as Question,
    Close          as Wrong
} from '@material-ui/icons'
import { Map }               from 'immutable'
import ReducerContext        from '../contexts/ReducerContext'
import * as CellFieldModel   from '../../models/CellField'
import * as CellContentModel from '../../models/CellContent'
import * as CellStateModel   from '../../models/CellState'
import * as ActionBase       from '../../store/actions/ActionBase'
import * as CellAction       from '../../store/actions/CellAction'

const Cell = ({ x, y }) => {
    const { state  , dispatch   } = React.useContext(ReducerContext)()
    const [ buttons, setButtons ] = React.useState(0)
    const classes = useStyles()

    return (
        <div className={ classes.container }>
            <Fade in={ !isOpened(state, x, y) && getCellState(state, x, y) !== '' } timeout={ 1000 }>
                <span className={ classes.top }>
                    { getCellState(state, x, y) }
                </span>
            </Fade>
            <Fade in={ !isOpened(state, x, y) } timeout={ 1000 }>
                <Button
                    className  ={ classes.button }
                    onMouseDown={ handleMouseDown(setButtons) }
                    onMouseUp  ={ handleMouseUp  (dispatch, x, y, buttons, setButtons) }>
                    { '' }
                </Button>
            </Fade>
            <Fade in={ isOpened(state, x, y) } timeout={ 1000 }>
                <span className={ classes.bottom }>
                    { getCellContent(state, x, y ) }
                </span>
            </Fade>
        </div>
    )
}

export default Cell

const handleMouseDown = (setButtons: (_: number) => void) => (e: React.MouseEvent) => {
    setButtons(e.buttons)
}

const handleMouseUp = (
    dispatch: React.Dispatch<ActionBase.Type>,
    x: number,
    y: number,
    buttons: number,
    setButtons: (_: number) => void
) => (e: React.MouseEvent) => {
    const upButtons = buttons & ~e.buttons

    setButtons(e.buttons)

    let action: ActionBase.Type

    if ((upButtons & 1) !== 0) {
        action = CellAction.create('openCell', x, y)
    }
    else if ((upButtons & 2) !== 0) {
        action = CellAction.create('rotateCellState', x, y)
    }
    else {
        return
    }

    dispatch(action)
}

const isOpened = (state: Map<any, any>, x: number, y: number) => (
    getCell(state, x, y).get('state') === CellStateModel.Type.Opened
)

const getCellState = (state: Map<any, any>, x: number, y: number) => {
    const cellState = getCell(state, x, y).get('state')

    if (cellState === CellStateModel.Type.Flag) {
        return <Flag fontSize="inherit"/>
    }
    else if (cellState === CellStateModel.Type.Question) {
        return <Question fontSize="inherit"/>
    }
    else if (cellState === CellStateModel.Type.Mine) {
        return <Mine fontSize="inherit"/>
    }
    else if (cellState === CellStateModel.Type.Wrong) {
        return <Wrong fontSize="inherit"/>
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
        return <Mine fontSize="inherit"/>
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
        height        : 100,
        fontSize      : '2.5rem'
    },
    visible: {
        visibility: 'visible'
    },
    hidden: {
        visibility: 'hidden'
    },
    top: {
        position     : 'absolute',
        zIndex       : 2,
        color        : 'darkred',
        pointerEvents: 'none'
    },
    button: {
        position  : 'absolute',
        zIndex    : 1,
        width     : 100,
        height    : 100,
        background: 'mediumseagreen',
        color     : 'darkred',
        '&:hover' : {
            background: 'lightcoral'
        }
    },
    bottom: {
        position: 'absolute',
        zIndex  : 0,
        color   : 'darkslategray'
    }
})
