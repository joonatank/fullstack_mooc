/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.1 - 5.3
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

const blogs = () => {
    const url = host.concat(blogUrl)
    // TODO add token?
    const request = axios.get(url)
    return request.then(response => response.data)
}

const post_blog = (user, blog) => {
    if (!user) { throw 'incorrect user' }
    if (!blog) { throw 'can\'t post empty blog' }

    const config = {
        headers: { Authorization: 'bearer '.concat(user.token) }
    }

    const url = host.concat(blogUrl)
    const request = axios.post(url, blog, config)
    return request.then(response => response.data)
}

export default {
    login,
    blogs,
    post_blog
}

