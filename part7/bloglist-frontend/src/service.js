/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.1 - 7.12
 */
import axios from 'axios'
// TODO figure out how to configure the host/port without hard coding
const host = 'http://localhost:3003'
const loginUrl = '/api/login'
const blogUrl = '/api/blogs'

// TODO set token somewhere?

const login = (cred) => {
    const url = host.concat(loginUrl)
    const request = axios.post(url, cred)
    return request.then(response => response.data)
}

const users = () => {
    const url = host.concat('/api/users')
    // TODO add token?
    const request = axios.get(url)
    return request.then(response => response.data)
}

const blogs = () => {
    const url = host.concat(blogUrl)
    // TODO add token?
    const request = axios.get(url)
    return request.then(response => response.data)
}

const post_blog = (user, blog) => {
    if (!user) { throw Error('incorrect user') }
    if (!blog) { throw Error('can\'t post empty blog') }

    const config = {
        headers: { Authorization: 'bearer '.concat(user.token) }
    }

    const url = host.concat(blogUrl)
    const request = axios.post(url, blog, config)
    return request.then(response => response.data)
}

const put_blog = (user, blog, params) => {
    if (!user) { throw Error('incorrect user') }
    if (!blog) { throw Error('can\'t post empty blog') }

    const config = {
        headers: { Authorization: 'bearer '.concat(user.token) }
    }

    const url = host.concat(blogUrl).concat('/').concat(blog.id)
    const request = axios.put(url, params, config)
    return request.then(response => response.data)
}

const post_comment = (user, blog, comment) => {
    const config = {
        headers: { Authorization: 'bearer '.concat(user.token) }
    }

    const url = host.concat(blogUrl).concat('/').concat(blog.id).concat('/comments')
    const params = { comment: comment }
    console.log(`http post ${url}`)
    console.log(params)
    const request = axios.post(url, params, config)
    return request.then(response => response.data)
}

const del_blog = (user, blog) => {
    if (!user) { throw Error('incorrect user') }
    if (!blog) { throw Error('can\'t post empty blog') }

    const config = {
        headers: { Authorization: 'bearer '.concat(user.token) }
    }

    const url = host.concat(blogUrl).concat('/').concat(blog.id)
    const request = axios.delete(url, config)
    return request.then(response => response.data)
}

export default {
    login,
    blogs,
    post_blog,
    put_blog,
    del_blog,
    users,
    post_comment,
}

