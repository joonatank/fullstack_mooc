/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.8
 */
const anecdotesAtStart = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the\
    development time...The remaining 10 percent of the code accounts for the other 90\
    percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write\
    code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore,\
    if you write the code as cleverly as possible, you are, by definition, not smart\
    enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
    return {
        content: anecdote,
        id: getId(),
        votes: 0
    }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action = { type: '' }) => {
    switch (action.type) {
    case 'VOTE':
        return state.map(x => action.id === x.id ? { ...x, votes: x.votes+1 } : x)
    case 'NEW':
        return [ ...state, asObject(action.text) ]
    default:
        return state
    }
}

// Actions
const create = (text) => {
    return { type: 'NEW', text: text }
}
const vote = (id) => {
    return { type: 'VOTE', id: id }
}

export { create, vote }
export default reducer
