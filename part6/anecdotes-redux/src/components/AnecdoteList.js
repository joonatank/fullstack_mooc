/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.8
 */
import React from 'react'
import { vote } from '../reducers/anecdoteReducer'
import _ from 'lodash'

const AnecdoteList = (props) => {
    const anecdotes = props.store.getState().anecdotes
    const filter = props.store.getState().filter

    const handleVote = (id) => {
        props.store.dispatch(vote(id))
    }

    return (
        <div>
            {_.orderBy(anecdotes.filter(x => x.content.includes(filter)), ['votes'], ['desc'])
                .map(anecdote =>
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => handleVote(anecdote.id)}>vote</button>
                        </div>
                    </div>
            )}
        </div>
    )
}

export default AnecdoteList
