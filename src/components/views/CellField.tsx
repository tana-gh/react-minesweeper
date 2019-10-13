import * as React          from 'react'
import * as R              from 'ramda'
import { Map }             from 'immutable'
import Cell                from './Cell'
import ReducerContext      from '../contexts/ReducerContext'
import * as CellFieldModel from '../../models/CellField'

const CellField = () => {
    const { state } = React.useContext(ReducerContext)()
    const width  = state.getIn([ 'game', 'cellField', 'width'  ])
    const height = state.getIn([ 'game', 'cellField', 'height' ])

    return (
        <table>
            <tbody>{
                R.map(i => (
                    <tr key={ getCellKey(state, i, 0) }>{
                        R.map(j => (
                            <td key={ getCellKey(state, i, j) }>
                                <Cell x={ i } y={ j }/>
                            </td>
                        ), R.range(0, height))
                    }</tr>
                ), R.range(0, width))
            }</tbody>
        </table>
    )
}

export default CellField

const getCellKey = (state: Map<any, any>, x: number, y: number) => (
    CellFieldModel.getCell(state.getIn([ 'game', 'cellField' ]), x, y).get('key')
)
