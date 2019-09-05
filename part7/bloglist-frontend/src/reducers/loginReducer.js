/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import service from '../service'

import { initialiseBlogs } from './blogReducer'
import { setFlash } from './flashReducer'

const STORAGE_USER = 'loggedBloglistappUser'

export const loginFromStorage = () => {
    return dispatch => {
        const loggedUserJSON = window.localStorage.getItem(STORAGE_USER)
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch ({
                type: 'LOGIN',
                data: { user }
            })
            dispatch(initialiseBlogs())
        }
        else {
            dispatch ({
                type: 'LOGIN',
                data: { user: null }
            })
        }
    }
}

export const login = ({ username, password }) => {
    // Send a login message
    // if success retrieve blogs and set state (blogs and user)
    return async dispatch => {
        return service.login({ username: username, password: password }).then(user => {

            dispatch ({
                type: 'LOGIN',
                data: { user: user }
            })

            if (user) {
                dispatch(initialiseBlogs())

                window.localStorage.setItem(
                    STORAGE_USER, JSON.stringify(user)
                )
                dispatch(setFlash('Logged in: ' + user.name))
            }

            return user

        }).catch( (error) => {
            console.error('login error: ', error.message)
            if (error.message === 'Network Error') {
                dispatch(setFlash('Server connection failed.', 'error'))
            }
            else if (error.message.slice(-3) === '401') {
                dispatch(setFlash('Wrong credentials.', 'error'))
            }
            else {
                dispatch(setFlash(error.toString(), 'error'))
            }
            return null
        })
    }
}

export const logout = () => {
    return async dispatch => {

        window.localStorage.removeItem(STORAGE_USER)

        dispatch(setFlash('Logout.'))

        dispatch ({
            type: 'LOGOUT',
            data: {}
        })
        return true
    }
}

const loginReducer = (state = null, action) => {
    switch(action.type) {
    case 'LOGIN':
        return action.data.user
    case 'LOGOUT':
        return null
    default:
        return state
    }
}

export default loginReducer
