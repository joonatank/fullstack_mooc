/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 2.6 - 2.18
 *
 *  TODO effect hook is run when idle
 *      meaning that it consumes hilarious amounts of CPU time
 *      how to make it only ran when there is a change?
 */
import React, {useState, useEffect} from 'react';
import Server from './server'

const Filter = ({filter, filterChangeCb}) => {
    return (
        <p>
        filter shown with : <input value={filter} onChange={filterChangeCb} />
        </p>
    )
}

const Person = ({person, delCb}) => {
    return (
        <p>
        {person.name} {person.number}
        <button onClick={delCb.bind(this, person.id)}>delete</button>
        </p>
    )
}

const Numbers = ({persons, filter, delCb}) => {
    const filtered = persons.filter((x) => filter.length === 0 || x.name.includes(filter))
    const numbers = filtered.map((obj) => <Person key={obj.name} person={obj} delCb={delCb} />)

    return (
        <div>
            <h2>Numbers</h2>
            {numbers}
        </div>
    )
}

const NewPerson = ({name, number, handleNameChangeCb, handleNumberChangeCb, addPersonCb}) => {
    return (
        <div>
            <form onSubmit={addPersonCb}>
            <div>
                name: <input value={name} onChange={handleNameChangeCb} />
                <br />
                number : <input value={number} onChange={handleNumberChangeCb} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
            </form>
        </div>
    )
}

const App = () => {
    const [ persons, setPerson ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')


    useEffect(() => {
        Server.getAll()
            .then(resp => {
                const people = resp.data
                setPerson(people)
            })
    })


    const addPerson = (event) => {
        // disable page reload
        event.preventDefault()

        const found = persons.filter((x) => x.name === newName)
        const person = {name: newName, number: newNumber}

        let promise = null
        if (found.length !== 0) {
            promise = Server.update(found[0].id, person)
        }
        else {
            promise = Server.create(person)
        }
        promise.then(resp => {
            setNewName('')
            setNewNumber('')
        })
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const delCb = id => {
        const p = persons.filter(x => x.id === id)
        if (window.confirm(`Delete ${p[0].name}?`)) {
            Server.del(id)
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>

            <Filter filter={filter} filterChangeCb={handleFilterChange} />

            <h3>Add a new</h3>
            <NewPerson name={newName} number={newNumber} handleNameChangeCb={handleNameChange}
                handleNumberChangeCb={handleNumberChange} addPersonCb={addPerson} />

            <Numbers persons={persons} filter={filter} delCb={delCb} />
        </div>
    )
}

export default App;
