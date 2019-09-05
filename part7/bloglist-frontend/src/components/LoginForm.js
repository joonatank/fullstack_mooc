/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import React from 'react'
import { connect } from 'react-redux'

import { Form, Button } from 'semantic-ui-react'

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
        <Form onSubmit={handleLogin}>
            <Form.Field>
                <label>username</label>
                <input {...username} reset='' />
            </Form.Field>
            <Form.Field>
                <label>password</label>
                <input {...password} reset='' />
            </Form.Field>
            <Button primary type='submit'>login</Button>
        </Form>
    )
}

export default connect(
    null, { login, setFlash }
)(LoginForm)
