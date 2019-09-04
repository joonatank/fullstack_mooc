/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import * as _ from 'lodash'
import service from '../service'

import { setFlash } from './flashReducer'

// Actions

export const createBlog = (user, params) => {
    return async dispatch => {

        return service.post_blog(user, params).then(res => {
            console.log('post blog: ', res)

            dispatch({
                type: 'NEW_POST',
                data: {
                    blog: {
                        title: res.title,
                        author: res.author,
                        url: res.url,
                        id: res.id,
                        likes: 0,
                        user: user
                    }
                }
            })
            dispatch(setFlash('a new blog: ' + params.title + ' by ' + params.author + ' added'))
            return true
        }).catch((err) => {
            const msg = 'post blog failed with error: ' + err
            console.error(msg)
            dispatch(setFlash(msg, 'error'))

            return false
        })
    }
}

export const initialiseBlogs = () => {
    return async dispatch => {
        service.blogs().then( res => {
            const b = _.sortBy(res, ['likes', 'title']).reverse()
            dispatch ({
                type: 'INIT_BLOGS',
                data: { blogs: b }
            })
        })
    }
}

export const changeBlogPost = (user, blog, params) => {
    return async dispatch => {
        console.log('Should send PUT message')
        service.put_blog(user, blog, params).then( res => {

            dispatch(setFlash('Updated blog post: ' + blog.title))
            dispatch ({
                type: 'CHANGE_POST',
                data: { blog: { ...blog, likes: blog.likes+1 } }
            })
        }).catch(err => {
            console.error(err)
            dispatch(setFlash(err.message, 'error'))
        })

    }
}

export const deleteBlogPost = (user, blog) => {
    return async dispatch => {
        console.log('Should send DELETE message')
        service.del_blog(user, blog).then( () => {

            dispatch ({
                type: 'DELETE_POST',
                data: { blog: blog }
            })
            dispatch(setFlash('Removed blog post: ' + blog.title))
        }).catch(err => {
            console.error(err)

            // Rather silly way of checking the error code
            if (err.message.slice(-3) === '403') {
                dispatch(setFlash('Can\'t delete post: ' + blog.name + ' insufficent access'))
            }
            else {
                dispatch(setFlash('Can\'t delete post: ' + blog.name + ' : ' + err.message))
            }
        })
    }
}

const reducer = (state = [], action) => {
    switch(action.type) {
    case 'NEW_POST':
        return [...state, action.data.blog]
    case 'DELETE_POST':
        return state.filter(x => x.id !== action.data.blog.id)
    case 'CHANGE_POST':
        return _.sortBy(
                [ ...state.filter(x => x.id !== action.data.blog.id), action.data.blog ]
                , ['likes', 'title']
            ).reverse()
    case 'INIT_BLOGS':
        return [ ...action.data.blogs ]
    default:
        return [ ...state ]
    }
}

export default reducer
