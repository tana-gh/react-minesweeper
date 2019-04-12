import React from 'react'
import {
    render,
    cleanup
} from 'react-testing-library'

describe('example', () => {
    afterEach(cleanup)

    it('Example component', () => {
        const { queryByText } = render(<div>Example</div>)
        expect(queryByText('Example')).toBeTruthy()
    })
})
