/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 1.12 - 1.14
 */
import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const rand = (min, max) => {
    return Math.floor(Math.random() * max + min)
}

const MostVotes = ({anecdotes, votes}) => {
    const maxIndex = votes.reduce((acc, val) => {
        if (val > acc.max)
            return {index: acc.runner, max: val, runner: acc.runner + 1}
        else
            return {index: acc.index, max: acc.max, runner: acc.runner + 1}
    }, {index: 0, max: 0, runner: 0})

    if (maxIndex.runner !== votes.length)
        console.log("ERROR: runner, votes length", maxIndex.runner)
    if (maxIndex.runner !== anecdotes.length)
        console.log("ERROR: runner, anecdotes length", maxIndex.runner)

    return (
        <div>
        <h1>Anecdote with most votes</h1>
        <p>{anecdotes[maxIndex.index]}</p>
        <p>has {maxIndex.max} votes</p>
        </div>
    )
}

const App = (props) => {
    const [selected, setSelect] = useState(0)
    const [votes, setVote] = useState(new Array(props.anecdotes.length).fill(0))

    const incrementVote = (votes, index) => {
        const copy = [...votes]
        copy[index] += 1
        return copy
    }

    return (
        <div>
        <h1>Anecdote of the day</h1>
        <p>{props.anecdotes[selected]}</p>
        <p>votes {votes[selected]}</p>
        <button onClick={() => setVote(incrementVote(votes, selected))}>vote</button>
        <button onClick={() => setSelect(rand(0, props.anecdotes.length))}>next anecdote</button>
        <MostVotes anecdotes={props.anecdotes} votes={votes}/>
        </div>
    )
}

const anecdotes = [
      'If it hurts, do it more often',
      'Adding manpower to a late software project makes it later!',
      'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
      'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      'Premature optimization is the root of all evil.',
      'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));
