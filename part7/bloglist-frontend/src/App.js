/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route, Redirect, Link
} from 'react-router-dom'

import { connect } from 'react-redux'

import Blog from './components/Blog'
import Flash from './components/Flash'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import BlogView from './components/BlogView'
import './App.css'

import { initialiseBlogs, deleteBlogPost, changeBlogPost } from './reducers/blogReducer'
import { logout, loginFromStorage } from './reducers/loginReducer'
import { setFlash } from './reducers/flashReducer'
import { initialiseUsers } from './reducers/usersReducer'

const User = ({ user }) => {
    if (user === undefined) {
        return null
    }
    return (
        <div>
            <h1>{user.name}</h1>
            <h3>added blogs</h3>
            <ul> {user.blogs.map(x => <li key={x.id}>{x.title}</li>)} </ul>
        </div>
    )
}

const LoginHeader = ({ user, logoutCb }) => (
    <span>
        {user.name} loggged in <button onClick={() => logoutCb()}>logout</button>
    </span>
)

const App = (props) => {

    useEffect( () => {
        props.loginFromStorage()

        props.initialiseUsers()
    }, [])

    const users = props.users
    const blogs = props.blogs

    return (
        <div>
            <Flash />
            {props.user === null && <LoginForm />}
            {props.user !== null &&
                <div>
                    <Router>
                        <div className="navbar">
                            <Link className="menuItem" to='/blogs'>blogs</Link>
                            <Link className="menuItem" to='/users'>users</Link>
                            <LoginHeader user={props.user} logoutCb={props.logout} />
                        </div>
                        <h1>Blogs</h1>
                        <Route exact path='/' render={() => <Redirect to="/blogs" />} />
                        <Route exact path='/blogs' render={() => <BlogView />} />
                        <Route exact path='/blogs/:id' render={({ match }) =>
                            <Blog expanded={true} blog={blogs.filter(x => x.id === match.params.id)[0]} />}
                        />
                        <Route exact path='/users' render={() => <Users users={users} />} />
                        <Route exact path='/users/:id' render={({ match }) =>
                            <User user={users.filter(x => x.id === match.params.id)[0]} />}
                        />
                    </Router>
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
}

export default connect(
    mapStateToProps, funcmap
)(App)
