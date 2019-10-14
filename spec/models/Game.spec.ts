import { is }          from 'immutable'
import * as Game       from '../../src/models/Game'
import * as GameStatus from '../../src/models/GameStatus'
import * as CellField  from '../../src/models/CellField'
import * as CellState  from '../../src/models/CellState'

describe('create', () => {
    it('Assert properties', () => {
        const [ w, h ] = [ 4, 3 ]
        const mineCount = 6
        const game = Game.create(w, h, mineCount)

        expect(game.getIn([ 'cellField', 'cells' ]).count()).toBe(w * h)
        expect(game.get('mineCount')).toBe(mineCount)
        expect(game.get('restCount')).toBe(w * h - mineCount)
        expect(game.get('status'   )).toBe(GameStatus.Type.Ready)
    })
})

describe('open', () => {
    it('Is not in range', () => {
        const game0 = Game.create(4, 3, 6)
        const game1 = Game.open(game0, -1, -1)

        expect(is(game0, game1)).toBeTruthy()
    })

    it('Already Success', () => {
        let game0 = Game.create(4, 3, 6)
        game0 = game0.set('status', GameStatus.Type.Success)

        const game1 = Game.open(game0, 0, 0)

        expect(is(game0, game1)).toBeTruthy()
    })

    it('Already Failure', () => {
        let game0 = Game.create(4, 3, 6)
        game0 = game0.set('status', GameStatus.Type.Failure)

        const game1 = Game.open(game0, 0, 0)

        expect(is(game0, game1)).toBeTruthy()
    })

    it('Not Closed', () => {
        let game0 = Game.create(4, 3, 6)
        game0 = game0.setIn(['cellField', 'cells', 0, 'state'], CellState.Type.Opened)

        const game1 = Game.open(game0, 0, 0)

        expect(is(game0, game1)).toBeTruthy()
    })

    it('Is Ready', () => {
        const [ w, h ] = [ 4, 3 ]
        const mineCount = 6
        let game = Game.create(w, h, mineCount)

        let num = 0
        game = game.setIn([ 'cellField', 'random' ], () => num++)
        game = Game.open(game, 0, 0)

        expect(game.get('status')).toBe(GameStatus.Type.Playing)
        expect(game.get('restCount')).toBe(w * h - mineCount - 1)
        expect(game.getIn([ 'cellField', 'cells', 0, 'state' ])).toBe(CellState.Type.Opened)
    })

    it('Hit at a mine', () => {
        const [ w, h ] = [ 4, 3 ]
        const mineCount = 6
        let game = Game.create(w, h, mineCount)

        let num = 0
        game = game.setIn([ 'cellField', 'random' ], () => num++)
        game = Game.open(game, 0, 0)
        game = Game.open(game, 0, 1)

        expect(game.get('status')).toBe(GameStatus.Type.Failure)
        expect(game.get('restCount')).toBe(w * h - mineCount - 2)
        expect(game.getIn([ 'cellField', 'cells', 1, 'state' ])).toBe(CellState.Type.Opened)
    })

    it('Success', () => {
        const [ w, h ] = [ 4, 3 ]
        const mineCount = 11
        let game = Game.create(w, h, mineCount)

        game = Game.open(game, 0, 0)
        
        expect(game.get('status')).toBe(GameStatus.Type.Success)
        expect(game.get('restCount')).toBe(w * h - mineCount - 1)
        expect(game.getIn([ 'cellField', 'cells', 0, 'state' ])).toBe(CellState.Type.Opened)
    })
})

describe('rotateState', () => {
    it('Is not in range', () => {
        let game0 = Game.create(3, 4, 6)
        game0 = Game.open(game0, 0, 0)
        const game1 = Game.rotateState(game0, -1, -1)

        expect(is(game0, game1)).toBeTruthy()
    })

    it('Not Playing', () => {
        const game0 = Game.create(3, 4, 6)
        const game1 = Game.rotateState(game0, 0, 0)

        expect(is(game0, game1)).toBeTruthy()
    })

    it('Already Opend', () => {
        let game0 = Game.create(3, 4, 6)
        game0 = Game.open(game0, 0, 0)

        const game1 = Game.rotateState(game0, 0, 0)

        expect(is(game0, game1)).toBeTruthy()
    })

    it('Closed to Flag', () => {
        let game = Game.create(3, 4, 6)
        game = Game.open(game, 0, 0)
        game = Game.rotateState(game, 0, 1)

        expect(game.getIn([ 'cellField', 'cells', 1, 'state' ])).toBe(CellState.Type.Flag)
    })

    it('Flag to Question', () => {
        let game = Game.create(3, 4, 6)
        game = Game.open(game, 0, 0)
        game = Game.rotateState(game, 0, 1)
        game = Game.rotateState(game, 0, 1)

        expect(game.getIn([ 'cellField', 'cells', 1, 'state' ])).toBe(CellState.Type.Question)
    })

    it('Question to Closed', () => {
        let game = Game.create(3, 4, 6)
        game = Game.open(game, 0, 0)
        game = Game.rotateState(game, 0, 1)
        game = Game.rotateState(game, 0, 1)
        game = Game.rotateState(game, 0, 1)

        expect(game.getIn([ 'cellField', 'cells', 1, 'state' ])).toBe(CellState.Type.Closed)
    })
})

describe('judge', () => {
    it('Judged', () => {
        const mineCount = 6
        let game = Game.create(4, 3, mineCount)
        game = Game.open(game, 0, 0)
        game = Game.judge(game)

        expect(
            game.getIn([ 'cellField', 'cells' ]).toArray()
                .filter(x => x.get('state') === CellState.Type.Mine)
        ).toHaveLength(mineCount)
    })
})
