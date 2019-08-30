/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.14
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { create } from '../reducers/anecdoteReducer'
import { set } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    const [ newAnecdote, setNewAnecdote ] = useState('')

    const handleCreate = (event) => {
        event.preventDefault()

        props.create(newAnecdote)
        props.set(`${newAnecdote} created.`)
        setNewAnecdote('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleCreate}>
                <div>
                    <input type='text'
                        onChange={(evt) => setNewAnecdote(evt.target.value)}
                        value={newAnecdote}
                    />
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

const mapDispatchToProps = {
    create,
    set,
}

const ConnectedAnecdoteForm = connect(
    null,
    mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm
