/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.1 - 5.3
 */
import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Flash from './components/Flash'
import NewBlogForm from './components/NewBlogForm'
import service from './service'
import './App.css'
import * as _ from 'lodash'
import { useField } from './hooks'

const STORAGE_USER = 'loggedBloglistappUser'

const User = ({ user, logoutCb }) => (
    <p>
        {user.name} loggged in
        <button onClick={logoutCb.bind(this, user)}>logout</button>
    </p>
)

const App = () => {
    const username = useField('text')
    const password = useField('password')

    const [user, setUser] = useState(null)
    const [blogs, setBlogs] = useState([])
    //
    const [ flash, setFlash] = useState(null)
    const [ errorFlash, setErrorFlash] = useState(null)
    //
    const [ postBlogVisible, setPostBlogVisible ] = useState(false)
    const [ blogsDirty, setBlogsDirty ] = useState(false)

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const u = await service.login({ username: username.value, password: password.value })

            window.localStorage.setItem(
                STORAGE_USER, JSON.stringify(u)
            )
            setUser(u)

            setFlash('Logged in: ' + u.name)
            setTimeout(() => setFlash(null), 5000)

        } catch(error) {
            console.error('login error: ', error.message)
            if (error.message === 'Network Error') {
                setErrorFlash('Server connection failed.')
            }
            else if (error.message.slice(-3) === '401') {
                setErrorFlash('Wrong credentials')
            }
            else {
                console.log(error.message.slice(-3))
                setErrorFlash(error.toString())
            }
            setTimeout(() => setErrorFlash(null), 5000)
        }
        username.reset()
        password.reset()
    }

    const handleLogout = (user) => {
        setUser(null)
        window.localStorage.removeItem(STORAGE_USER)

        setFlash('Logged out: ' + user.name)
        setTimeout(() => setFlash(null), 5000)
    }

    const handleNewBlog = (event, { newTitle, newAuthor, newUrl }) => {
        event.preventDefault()
        const params = { title: newTitle, author: newAuthor, url: newUrl }
        console.log('handleNewBlog: submitted', params)

        return service.post_blog(user, params).then(res => {
            console.log('post blog: ', res)

            setFlash('a new blog: ' + params.title + ' by ' + params.author + ' added')
            setTimeout(() => setFlash(null), 5000)
            return true
        }).catch((err) => {
            console.error('post blog failed with error: ', err)

            setErrorFlash('POST blog failed')
            setTimeout(() => setErrorFlash(null), 5000)
            return false
        })
    }

    useEffect( () => {
        const loggedUserJSON = window.localStorage.getItem(STORAGE_USER)
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    useEffect( () => {
        service.blogs().then( res => {
            const b = _.sortBy(res, ['likes', 'title']).reverse()
            setBlogs(b)
            setBlogsDirty(false)
        })
    }, [user, blogsDirty]) // TODO don't like this, but otherwise the event handler doesn't work

    const loginForm = () => {
        return (
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input {...username} reset='' />
                </div>
                <div>
                    password
                    <input {...password} reset='' />
                </div>
                <button type='submit'>login</button>
            </form>
        )
    }

    const handleBlogChange = (blog, params) => {
        if (params === null) {
            console.log('Should send DELETE message')
            service.del_blog(user, blog).then( () => {
                console.log('success')

                setBlogsDirty(true)

                setFlash('Removed blog post: ' + blog.title)
                setTimeout(() => setFlash(null), 5000)
            }).catch(err => {
                // Rather silly way of checking the error code
                if (err.message.slice(-3) === '403') {
                    setErrorFlash('Can\'t delete post: ' + blog.name + ' insufficent access')
                }
                else {
                    setErrorFlash('Can\'t delete post: ' + blog.name + ' : ' + err.message)
                }

                console.error(err)
                setTimeout(() => setErrorFlash(null), 5000)
            })
        }
        else {
            console.log('Should send PUT message')
            service.put_blog(user, blog, params).then( () => {
                console.log('success')
                // not a good idea but forcing an update to the effect
                setBlogsDirty(true)

                setFlash('Updated blog post: ' + blog.title)
                setTimeout(() => setFlash(null), 5000)
            }).catch(err => {
                console.error(err)
                setErrorFlash(err.message)
                setTimeout(() => setErrorFlash(null), 5000)
            })
        }
    }

    return (
        <div>
            <Flash msg={flash} look="status"/>
            <Flash msg={errorFlash} look="error"/>
            {user === null && loginForm()}
            {user !== null &&
                <div>
                    <User user={user} logoutCb={handleLogout} />
                    <h1>Blogs</h1>
                    { postBlogVisible && <NewBlogForm visibleCb={setPostBlogVisible}
                        newBlogCb={handleNewBlog}
                        /> }
                    { !postBlogVisible &&
                        <button onClick={() => setPostBlogVisible(true)}>create new</button>
                    }
                    {blogs.map(b => <Blog key={b.id} blog={b} user={user} blogChangedCb={handleBlogChange} /> )}
                </div>
            }
        </div>
    )
}

export default App
