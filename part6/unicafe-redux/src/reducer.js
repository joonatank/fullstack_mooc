/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.1 - 6.2
 */
const initialState = {
    good: 0,
    ok: 0,
    bad: 0
}

const counterReducer = (state = initialState, action) => {
    console.log(action)
    switch(action.type) {
    case 'GOOD':
        return { ...state, good: state.good+1 }
    case 'OK':
        return { ...state, ok: state.ok+1 }
    case 'BAD':
        return { ...state, bad: state.bad+1 }
    case 'ZERO':
        return { ...initialState }
    }
    return state
}

export default counterReducer
