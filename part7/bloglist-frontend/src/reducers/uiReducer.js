/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */

export const showNew = () => {
    return dispatch => {
        dispatch ({
            type: 'UI_SHOW_NEW',
        })
    }
}

export const hideNew = () => {
    return dispatch => {
        dispatch ({
            type: 'UI_HIDE_NEW',
        })
    }
}

const initialState = {
    newVisible: false
}

const uiReducer = (state = initialState, action) => {
    switch(action.type) {
    case 'UI_SHOW_NEW':
        return { state, newVisible: true }
    case 'UI_HIDE_NEW':
        return { state, newVisible: false }
    default:
        return state
    }
}

export default uiReducer
