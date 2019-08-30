/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.9
 */

const initialState = ''

const reducer = (state = initialState, action = { type: '' }) => {
    switch (action.type) {
        case 'SET_FLASH':
            return action.msg
        default:
            return state
    }
}

const setFlash = (text) => {
    return { type: 'SET_FLASH', msg: text }
}

export { setFlash }
export default reducer
