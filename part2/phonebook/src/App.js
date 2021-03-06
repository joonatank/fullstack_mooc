/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 2.6 - 2.18
 *
 *  Updated to run on exercise 3.18 backend
 */
import React, {useState, useEffect} from 'react';
import Server from './server'
import './App.css'

const Flash = ({msg, look}) => {
    if (msg === null || msg === '') {
        return null
    }
    else {
        return (
            <div className={look}>
            {msg}
            </div>
        )
    }
}
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
        <button onClick={delCb.bind(this, person._id)}>delete</button>
        </p>
    )
}

const Numbers = ({persons, filter, delCb}) => {
    const numbers = persons
        .filter((x) => filter.length === 0 || x.name.includes(filter))
        .map(obj => <Person key={obj._id} person={obj} delCb={delCb} />)

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
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')
    const [ flash, setFlash] = useState(null)
    const [ errorFlash, setErrorFlash] = useState(null)


    useEffect(() => {
        Server.getAll()
            .then(resp => {
                const people = resp.data
                setPersons(people)
            })
    }, [newName])   // not perfect but avoids sending new requests at every render


    const addPerson = (event) => {
        // disable page reload
        event.preventDefault()

        const found = persons.filter((x) => x.name === newName)
        const person = {name: newName, number: newNumber}

        let promise = null
        let msg = ''
        if (found.length !== 0) {
            const id = found[0]._id
            if (window.confirm(`Change ${person.name} number instead?`)) {
                promise = Server.update(id, person)
                msg = 'Changed'
            }
        }
        else {
            promise = Server.create(person)
            msg = 'Added'
        }

        promise.then(resp => {
            setNewName('')
            setNewNumber('')
            setFlash(`${msg} person ${person.name}`)

            setTimeout(() => setFlash(null), 5000)
        })
        .catch(error => {
            console.log(error.response.data.error)
            setErrorFlash(error.response.data.error)
            setTimeout(() => setErrorFlash(null), 5000)
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
        const found = persons.filter(x => x._id === id)
        const p = found[0]
        console.log(`deleting ${id}`)
        if (window.confirm(`Delete ${p.name}?`)) {
            Server.del(id)
            setPersons(persons.filter( p => p._id !== id ))
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Flash msg={flash} look="status"/>
            <Flash msg={errorFlash} look="error"/>

            <Filter filter={filter} filterChangeCb={handleFilterChange} />

            <h3>Add a new</h3>
            <NewPerson name={newName} number={newNumber} handleNameChangeCb={handleNameChange}
                handleNumberChangeCb={handleNumberChange} addPersonCb={addPerson} />

            <Numbers persons={persons} filter={filter} delCb={delCb} />
        </div>
    )
}

export default App;
