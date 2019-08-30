/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.14
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createDote } from '../reducers/anecdoteReducer'
import { setFlash } from '../reducers/notificationReducer'
import service from '../service'

const AnecdoteForm = (props) => {
    const [ newAnecdote, setNewAnecdote ] = useState('')

    const handleCreate = async (event) => {
        event.preventDefault()

        const dote = await service.createNew(newAnecdote)

        props.createDote(dote)
        props.setFlash(`${dote.content} created.`)
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
    createDote,
    setFlash,
}

const ConnectedAnecdoteForm = connect(
    null,
    mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm
