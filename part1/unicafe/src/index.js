/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 1.6 to 1.11
 */
import React, {useState} from 'react'; import ReactDOM from 'react-dom';

const Button = ({text, cb}) => {
    return (
        <button onClick={cb}>{text}</button>
    )
}

const Statistic = ({text, value}) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

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
        var percentage = 100*good / count + "%"
        return (
            <div>
                <h1>statistics</h1>
                <table>
                <Statistic text="good" value={good} />
                <Statistic text="neutral" value={neutral} />
                <Statistic text="bad" value={bad} />
                <Statistic text="all" value={count} />
                <Statistic text="average" value={(good - bad) / count} />
                <Statistic text="positive" value={percentage} />
                </table>
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
        <Button text="good" cb={() => setGood(good + 1)} />
        <Button text="neutral" cb={() => setNeutral(neutral + 1)} />
        <Button text="bad" cb={() => setBad(bad+ 1)} />
        </p>
        <Statistics good={good} bad={bad} neutral={neutral}/>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
