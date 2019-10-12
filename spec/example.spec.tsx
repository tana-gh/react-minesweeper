import React from 'react'
import {
    render,
    cleanup
} from '@testing-library/react'

describe('example', () => {
    afterEach(cleanup)

    it('Example component', () => {
        const { queryByText } = render(<div>Example</div>)
        expect(queryByText('Example')).toBeTruthy()
    })
})
