/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 1.1 and 1.2
 */
import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Part = (props) => {
    return (
        <p>{props.name} {props.count}</p>
    )
}

const Content = (props) => {
    const list = props.parts.map((obj) =>
            <Part name={obj.n} count={obj.c} />
        )

    return (
        <div>
        {list}
        </div>
    )
}

const Total = (props) => {
    const count = props.parts.reduce((acc, obj) => acc + obj.c, 0)
    return (
        <p>Number of exercises {count}</p>
    )
}


const App = () => {
    const course = 'Half Stack application development'
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14
    const parts = [
        {n : part1, c : exercises1},
        {n : part2, c : exercises2},
        {n : part3, c : exercises3}
    ]

    return (
        <div>
            <Header course={course} />
            <Content parts={parts} />
            <Total parts={parts} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
