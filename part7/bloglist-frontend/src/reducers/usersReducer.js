/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.7 - 7.8
 */

import service from '../service'

export const initialiseUsers = () => {
    return async dispatch => {
        service.users().then( res => {
            dispatch ({
                type: 'INIT_USERS',
                data: { users: res }
            })
        })
    }
}

const reducer = (state = [], action) => {
    switch(action.type) {
    case 'INIT_USERS':
            return action.data.users
    default:
            return state
    }
}

export default reducer;
