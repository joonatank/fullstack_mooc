/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4
 */


const reducer = (state = { msg: '', look: 'status' } , action ) => {
    switch (action.type) {
        case 'SET_FLASH':
            return action.data
        default:
            return state
    }
}

export const setFlash = (text, look = 'status', time = 5) => {
    return dispatch => {
        setTimeout( () => {
            dispatch({ type: 'SET_FLASH', data: {msg: '', look: look} })
        }, time * 1000)

        dispatch({
            type: 'SET_FLASH',
            data: {
                msg: text,
                look: look,
            }
        })
    }
}

export default reducer
