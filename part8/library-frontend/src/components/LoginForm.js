import React, { useState } from 'react'

const LoginForm = ({ login, setToken }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    const res = await login({ variables: { username, password } })

    // Not a clean way of reusing the component for both login and registration
    if (res && res.data.login) {
      const token = res.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
    else if (res && res.data.createUser) {
      alert('User created')
    }
    else {
      alert('Login failed')
    }

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={submit}>
      username <input value={username} onChange={({ target }) => setUsername(target.value)} /><br />
      password <input  type='password' value={password}
                  onChange={({ target }) => setPassword(target.value)} /><br />
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
