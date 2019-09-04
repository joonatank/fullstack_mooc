/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import React from 'react'
import { connect } from 'react-redux'

import { useField } from '../hooks'
import { login } from '../reducers/loginReducer'
import { setFlash } from '../reducers/flashReducer'


const LoginForm = (props) => {
    const username = useField('text')
    const password = useField('password')

    const handleLogin = async (event) => {
        event.preventDefault()

        props.login( { username: username.value, password: password.value })

        username.reset()
        password.reset()
    }

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

export default connect(
    null, { login, setFlash }
)(LoginForm)
