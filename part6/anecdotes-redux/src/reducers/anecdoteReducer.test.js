/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.8
 */
import freeze from 'deep-freeze'
import reducer from './anecdoteReducer'

const data = [
    {
        'content': 'If it hurts, do it more often',
        'id': '47145',
        'votes': 0
    },
    {
        'content': 'Adding manpower to a late software project makes it later!',
        'id': '21149',
        'votes': 0
    },
    {
        'content': 'The first 90 percent of the code accounts for the first 90 percent of\
            the development time...The remaining 10 percent of the code accounts for the\
            other 90 percent of the development time.',
        'id': '69581',
        'votes': 0
    },
    {
        'content': 'Any fool can write code that a computer can understand.\
            Good programmers write code that humans can understand.',
        'id': '36975',
        'votes': 0
    },
    {
        'content': 'Premature optimization is the root of all evil.',
        'id': '25170',
        'votes': 0
    },
    {
        'content': 'Debugging is twice as hard as writing the code in the first place.\
            Therefore, if you write the code as cleverly as possible, you are,\
            by definition, not smart enough to debug it.',
        'id': '98312',
        'votes': 0
    }
]

describe('anecdote reducer', () => {

    const check_votes = (state, id, votes) => {
        const obj = state.filter(x => x.id === id)[0]
        expect(obj.id).toBe(id)
        expect(obj.votes).toBe(votes)
    }

    test('create new anecdote', () => {
        const state = reducer()
        freeze(state)

        const text = 'Was a fine and pretty day.'
        const action = { type: 'DOTE_NEW', dote: { content: text, id: 100, votes: 0 } }
        const newState = reducer(state, action)

        expect(newState.length).toBe(state.length + 1)
        expect(newState.filter(x => x.content === text).length).toBe(1)
    })

    test('init anecdotes', () => {
        const state = reducer()

        const action = { type: 'DOTE_INIT', dotes: data }
        const newState = reducer(state, action)

        expect(newState.length).toBe(data.length)
    })

    const init = (state) => {
        const action = { type: 'DOTE_INIT', dotes: data }
        const newState = reducer(state, action)

        expect(newState.length).toBe(data.length)
        return newState
    }

    test('vote first document', () => {
        const state = init(reducer())
        freeze(state)

        const dote = state[0]
        const action = { type: 'VOTE', dote: { ...dote, votes: dote.votes+1 } }

        const newState = reducer(state, action)

        check_votes(newState, dote.id, 1)
    })

})
