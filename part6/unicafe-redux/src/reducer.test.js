/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.1 - 6.2
 */
import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
    const initialState = {
        good: 0,
        ok: 0,
        bad: 0
    }

    test('should return a proper initial state when called with undefined state', () => {
        const action = { type: 'DO_NOTHING' }

        const newState = counterReducer(undefined, action)
        expect(newState).toEqual(initialState)
    })

    const assert_state = (state, good, ok, bad) => {
        expect(state).toEqual({ good, ok, bad })
    }

    test('good is incremented', () => {
        const action = { type: 'GOOD' }
        const state = initialState

        deepFreeze(state)
        const newState = counterReducer(state, action)
        assert_state(newState, 1, 0, 0)
    })

    test('bad is incremented', () => {
        const action = { type: 'BAD' }
        const state = initialState

        deepFreeze(state)
        const newState = counterReducer(state, action)
        assert_state(newState, 0, 0, 1)
    })

    test('ok is incremented', () => {
        const action = { type: 'OK' }
        const state = initialState

        deepFreeze(state)
        const newState = counterReducer(state, action)
        assert_state(newState, 0, 1, 0)
    })

    test('all are incremented', () => {
        const state = initialState
        deepFreeze(state)

        const state2 = counterReducer(state, { type: 'OK' })
        const state3 = counterReducer(state2, { type: 'BAD' })
        const newState = counterReducer(state3, { type: 'GOOD' })
        assert_state(newState, 1, 1, 1)
    })

    test('zero after increment', () => {
        const state = initialState
        deepFreeze(state)

        const state2 = counterReducer(state, { type: 'OK' })
        assert_state(state2, 0, 1, 0)
        const newState = counterReducer(state2, { type: 'ZERO' })
        assert_state(newState, 0, 0, 0)
    })
})
