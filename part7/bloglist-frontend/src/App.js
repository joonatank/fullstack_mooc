/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route, Redirect
} from 'react-router-dom'

import { connect } from 'react-redux'

import Blog from './components/Blog'
import Flash from './components/Flash'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import './App.css'

import { initialiseBlogs, deleteBlogPost, changeBlogPost } from './reducers/blogReducer'
import { logout, loginFromStorage } from './reducers/loginReducer'
import { setFlash } from './reducers/flashReducer'
import { showNew } from './reducers/uiReducer'
import { initialiseUsers } from './reducers/usersReducer'

const User = ({ user, logoutCb }) => {
    return (
        <div>
            <p> {user.name} loggged in
                <button onClick={() => logoutCb()}>logout</button>
            </p>
        </div>
    )
}

const Menu = (props) => {

    const users = props.users

    return (
        <div>
            <Router>
                <Route exact path='/' render={() => <Redirect to="/blogs" />} />
                <Route exact path='/blogs' render={() => props.blogs()} />
                <Route path='/users' render={() => <Users users={users} />} />
            </Router>
        </div>
      )
}

const App = (props) => {

    useEffect( () => {
        props.loginFromStorage()

        props.initialiseUsers()
    }, [])

    const blogView = () => {
        return (
            <div>
            <h1>Blogs</h1>
            { postBlogVisible && <NewBlogForm /> }
            { !postBlogVisible && <button onClick={props.showNew}>create new</button> }
            { props.blogs.map(b => <Blog key={b.id} blog={b} />) }
            </div>
        )
    }

    const postBlogVisible = props.ui.newVisible
    return (
        <div>
            <Flash />
            {props.user === null && <LoginForm />}
            {props.user !== null &&
                <div>
                    <User user={props.user} logoutCb={props.logout} />
                    <Menu blogs={blogView} users={props.users} />
                </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        blogs: state.blogs,
        ui: state.ui,
        users: state.users,
    }
}

const funcmap = {
    initialiseBlogs,
    initialiseUsers,
    logout,
    loginFromStorage,
    setFlash,
    deleteBlogPost,
    changeBlogPost,
    showNew,
}

export default connect(
    mapStateToProps, funcmap
)(App)
