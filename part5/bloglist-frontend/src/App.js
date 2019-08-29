/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.1 - 5.3
 */
import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Flash from './components/Flash'
import service from './service'
import './App.css'
import * as _ from 'lodash'

const STORAGE_USER = 'loggedBloglistappUser'

const User = ({ user, logoutCb }) => (
    <p>
        {user.name} loggged in
        <button onClick={logoutCb.bind(this, user)}>logout</button>
    </p>
)

const App = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
    //
    const [ flash, setFlash] = useState(null)
    const [ errorFlash, setErrorFlash] = useState(null)
    //
    const [ postBlogVisible, setPostBlogVisible ] = useState(false)
    const [ blogsDirty, setBlogsDirty ] = useState(false)

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const u = await service.login({ username, password })

            window.localStorage.setItem(
                STORAGE_USER, JSON.stringify(u)
            )
            setUser(u)
            setUsername('')
            setPassword('')

            setFlash('Logged in: ' + u.name)
            setTimeout(() => setFlash(null), 5000)

        } catch(error) {
            console.error('login error: ', error.message)
            setErrorFlash('Wrong credentials')
            setTimeout(() => setErrorFlash(null), 5000)
        }
    }

    const handleLogout = (user) => {
        console.log('handleLogout: ', user)
        setUser(null)
        window.localStorage.removeItem(STORAGE_USER)

        setFlash('Logged out: ' + user.name)
        setTimeout(() => setFlash(null), 5000)
    }

    const handleNewBlog = (event) => {
        event.preventDefault()
        const params = { title: newTitle, author: newAuthor, url: newUrl }
        console.log('handleNewBlog: submitted', params)

        service.post_blog(user, params).then(res => {
            console.log('post blog: ', res)

            setNewTitle('')
            setNewAuthor('')
            setNewUrl('')

            setFlash('a new blog: ' + params.title + ' by ' + params.author + ' added')
            setTimeout(() => setFlash(null), 5000)
        }).catch((err) => {
            console.error('post blog failed with error: ', err)

            setErrorFlash('POST blog failed')
            setTimeout(() => setErrorFlash(null), 5000)
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
    }, [user, newTitle, blogsDirty]) // TODO don't like this, but otherwise the event handler doesn't work

    const loginForm = () => {
        return (
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input type='text' value={username} name='Username'
                        onChange={ ({ target }) => setUsername(target.value) }
                    />
                </div>
                <div>
                    password
                    <input type='password' value={password} name='Password'
                        onChange={ ({ target }) => setPassword(target.value) }
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        )
    }

    const newBlogForm = () => {
        return (
            <form onSubmit={handleNewBlog}>
                <h2>Create new blog link</h2>
                <div>
                    title
                    <input type='text' value={newTitle} name='title'
                        onChange={ ({ target }) => setNewTitle(target.value) }
                    />
                </div>
                <div>
                    author
                    <input type='text' value={newAuthor} name='author'
                        onChange={ ({ target }) => setNewAuthor(target.value) }
                    />
                </div>
                <div>
                    url
                    <input type='text' value={newUrl} name='url'
                        onChange={ ({ target }) => setNewUrl(target.value) }
                    />
                </div>
                <button type='submit'>create</button>
                <button onClick={() => setPostBlogVisible(false)}>cancel</button>
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
                    { postBlogVisible && newBlogForm()}
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
