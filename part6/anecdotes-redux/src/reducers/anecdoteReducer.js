/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.20
 */
import service from '../service'

const initialState = []

const reducer = (state = initialState, action = { type: '' }) => {
    switch (action.type) {
    case 'VOTE':
        return [ ...state.filter(x => x.id !== action.dote.id), action.dote ]
    case 'DOTE_INIT':
        return [ ...state, ...action.dotes.map(x => x) ]
    case 'DOTE_NEW':
        return [ ...state, action.dote ]
    default:
        return state
    }
}

// Actions
export const vote = (dote) => {
    return async dispatch => {
        const x = await service.update({ ...dote, votes: dote.votes+1 })
        dispatch({ type: 'VOTE', dote: x })
    }
}

export const createDote = (content) => {
    return async dispatch => {
        const dote = await service.createNew(content)
        dispatch({ type: 'DOTE_NEW', dote: dote })
    }
}

export const initialiseDotes = () => {
    return async dispatch => {
        service.getAll().then(anecdotes => {
            dispatch({ type: 'DOTE_INIT', dotes: anecdotes })
        })
    }
}

export default reducer
