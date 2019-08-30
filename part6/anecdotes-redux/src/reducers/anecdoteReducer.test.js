/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.8
 */
import freeze from 'deep-freeze'
import reducer, { create, vote } from './anecdoteReducer'

describe('anecdote reducer', () => {

    const check_votes = (state, id, votes) => {
        const obj = state.filter(x => x.id === id)[0]
        expect(obj.id).toBe(id)
        expect(obj.votes).toBe(votes)
    }

    test('vote first document', () => {
        const state = reducer()
        freeze(state)

        const id = state[0].id
        const action = vote(id)

        const newState = reducer(state, action)

        check_votes(newState, id, 1)
    })

    test('vote fourth document three times', () => {
        const state = reducer()
        freeze(state)

        const id = state[3].id
        const action = vote(id)

        const state2 = reducer(state, action)
        const state3 = reducer(state2, action)
        const newState = reducer(state3, action)

        check_votes(newState, id, 3)
    })

    test('mixed voting', () => {
        const state = reducer()
        freeze(state)

        const id = state[1].id
        const id2 = state[2].id
        const id3 = state[3].id

        const state2 = reducer(state, vote(id))
        const state3 = reducer(state2, vote(id2))
        const state4 = reducer(state3, vote(id2))
        const newState = reducer(state4, vote(id3))

        check_votes(newState, id, 1)
        check_votes(newState, id2, 2)
        check_votes(newState, id3, 1)
    })

    test('create new anecdote', () => {
        const state = reducer()
        freeze(state)

        const text = 'Was a fine and pretty day.'
        const newState = reducer(state, create(text))

        expect(newState.length).toBe(state.length + 1)
        expect(newState.filter(x => x.content === text).length).toBe(1)
    })
})
