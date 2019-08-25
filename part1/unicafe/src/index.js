/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 1.6 to 1.9
 */
import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Statistics = ({good, neutral, bad}) => {
    const count = good + neutral + bad

    if(count < 1)
    return (
        <div>
            <h1>statistics</h1>
            <p>No feedback give</p>
        </div>
    )
    else
    return (
        <div>
            <h1>statistics</h1>
            <p>good {good}</p>
            <p>neutral {neutral}</p>
            <p>bad {bad}</p>
            <p>all {count}</p>
            <p>avarage {(good - bad) / count}</p>
            <p>positive {100*good / count} %</p>
        </div>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
        <h1>give feedback</h1>
        <p>
        <button onClick={() => setGood(good + 1)}>good</button>
        <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
        <button onClick={() => setBad(bad+ 1)}>bad</button>
        </p>
        <Statistics good={good} bad={bad} neutral={neutral}/>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
