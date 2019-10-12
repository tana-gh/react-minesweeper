import * as Immutable from 'immutable'

describe('Misc test', () => {
    it('Immutable.js', () => {
        let map: Immutable.Map<any, any> = Immutable.fromJS({ a: { b: { c: [ 'test' ] } } })
        expect(map.getIn([ 'a', 'b', 'c', 0 ])).toBe('test')
        map = map.updateIn([ 'a', 'b' ], (obj: Immutable.Map<any, any>) => obj.update('c', str => str.get(0) + '-ok'))
        expect(map.getIn([ 'a', 'b', 'c' ])).toBe('test-ok')
    })
})
