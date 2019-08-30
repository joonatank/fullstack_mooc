/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.14
 */
import React from 'react'
import { connect } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import _ from 'lodash'

const AnecdoteList = (props) => {
    const handleVote = (id) => {
        props.vote(id)
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
                            <button onClick={() => handleVote(anecdote.id)}>vote</button>
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
}

const ConnectedAnecdotes = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdotes
