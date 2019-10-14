import * as React          from 'react'
import { makeStyles }      from '@material-ui/core'
import * as R              from 'ramda'
import { Map }             from 'immutable'
import Cell                from './Cell'
import ReducerContext      from '../contexts/ReducerContext'
import * as CellFieldModel from '../../models/CellField'

const CellField = () => {
    const { state } = React.useContext(ReducerContext)()
    const width     = state.getIn([ 'game', 'cellField', 'width'  ])
    const height    = state.getIn([ 'game', 'cellField', 'height' ])
    const classes   = useStyles()

    return (
        <div className={ classes.table } onContextMenu={ handleContextMenu }>{
            R.map(i => (
                <div className={ classes.tableRow } key={ getCellKey(state, i, 0) }>{
                    R.map(j => (
                        <div className={ classes.tableCell } key={ getCellKey(state, i, j) }>
                            <Cell x={ i } y={ j }/>
                        </div>
                    ), R.range(0, height))
                }</div>
            ), R.range(0, width))
        }</div>
    )
}

export default CellField

const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
}

const getCellKey = (state: Map<any, any>, x: number, y: number) => (
    CellFieldModel.getCell(state.getIn([ 'game', 'cellField' ]), x, y).get('key')
)

const useStyles = makeStyles({
    table: {
        display       : 'table',
        borderCollapse: 'collapse'
    },
    tableRow: {
        display: 'table-row'
    },
    tableCell: {
        display: 'table-cell',
        border : '1px solid mediumaquamarine'
    }
})
