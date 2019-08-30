/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.20
 */
import React from 'react'
import { connect } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setFlash } from '../reducers/notificationReducer'
import _ from 'lodash'

const AnecdoteList = (props) => {
    const handleVote = (dote) => {
        props.vote(dote)
        props.setFlash(`you voted ${dote.content}.`, 10)
    }

    return (
        <div>
            {props.anecdotes
                .map(anecdote =>
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => handleVote(anecdote)}>vote</button>
                        </div>
                    </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    const xs = state.anecdotes.filter(x => x.content.includes(state.filter))
    return {
        anecdotes: _.orderBy(xs, ['votes'], ['desc'])
    }
}

const mapDispatchToProps = {
    vote,
    setFlash,
}

const ConnectedAnecdotes = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdotes
