/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.14
 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
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

import { Container, Button, Header, Menu, Sticky, List } from 'semantic-ui-react'

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
            <Header as='h2'>{user.name}</Header>
            <Header as='h3'>Added blogs</Header>
            <List>
                {user.blogs.map(b =>
                    <List.Item key={b.id}>
                        <Link to={`/blogs/${b.id}`}>{b.title}</Link>
                    </List.Item>)
                }
            </List>
        </div>
    )
}

const LoginHeader = ({ user, logoutCb }) => (
    <span>
        {user.name} loggged in <Button onClick={() => logoutCb()}>logout</Button>
    </span>
)

const App = (props) => {

    useEffect( () => {
        props.loginFromStorage()

        props.initialiseUsers()
    }, [])

    const users = props.users
    const blogs = props.blogs

    const Footer = () => (
        <Container className="footer">
            <em>Joonatan Kuosa </em><br />
            <em>Fullstack MOOC 2019 - Bloglist</em>
        </Container>
    )

    return (
        <Container>
            {!props.user &&
                    <div>
                        <Header as='h1'>Bloglist</Header>
                        <Flash />
                        <LoginForm />
                    </div>
            }
            {props.user &&
                <Router>
                    <Sticky>
                        <Menu inverted id="nav">
                            <Menu.Item link>
                                <Link className='menuItem' to='/blogs'>blogs</Link>
                            </Menu.Item>
                            <Menu.Item link>
                                <Link className='menuItem' to='/users'>users</Link>
                            </Menu.Item>
                            <Menu.Item position='right'>
                                <LoginHeader user={props.user} logoutCb={props.logout} />
                            </Menu.Item>
                        </Menu>
                        <Flash />
                    </Sticky>

                    <Header as="h1" dividing>Blogs</Header>
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
            }
            <Footer />
        </Container>

    )
}

App.propTypes = {
    user: PropTypes.object,
    blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
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
