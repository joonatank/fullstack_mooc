/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.8
 */
import React, { useState } from 'react'
import { create } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {
    const [ newAnecdote, setNewAnecdote ] = useState('')

    const handleCreate = (event) => {
        event.preventDefault()

        props.store.dispatch(create(newAnecdote))
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

export default AnecdoteForm
