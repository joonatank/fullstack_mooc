import React from 'react';

const Header = (props) => {
    return (
        <h2>{props.course}</h2>
    )
}

const Part = (props) => {
    return (
        <p>{props.name} {props.count}</p>
    )
}

const Content = (props) => {
    const list = props.parts.map((obj) =>
            <Part key={obj.id} name={obj.name} count={obj.exercises} />
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
        <p><b>total of {count} exercises</b></p>
    )
}

const Course = ({course}) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course
