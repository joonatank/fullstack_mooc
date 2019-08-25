/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 1.1 to 1.5
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
            <Part name={obj.name} count={obj.exercises} />
        )

    return (
        <div>
        {list}
        </div>
    )
}

const Total = (props) => {
    const count = props.parts.reduce((acc, obj) => acc + obj.exercises, 0)
    return (
        <p>Number of exercises {count}</p>
    )
}


const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
