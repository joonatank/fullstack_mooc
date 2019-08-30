/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.16
 */
const initialState = []

const reducer = (state = initialState, action = { type: '' }) => {
    switch (action.type) {
    case 'VOTE':
        return state.map(x => action.id === x.id ? { ...x, votes: x.votes+1 } : x)
    case 'DOTE_INIT':
        return [ ...state, ...action.dotes.map(x => x) ]
    case 'DOTE_NEW':
        return [ ...state, action.dote ]
    default:
        return state
    }
}

// Actions
const createDote = (obj) => {
    return { type: 'DOTE_NEW', dote: obj }
}
const vote = (id) => {
    return { type: 'VOTE', id: id }
}

export { createDote, vote }
export default reducer
