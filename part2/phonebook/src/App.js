/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 2.6 - 2.11
 */
import React, {useState, useEffect} from 'react';
import axios from 'axios'

const Filter = ({filter, filterChangeCb}) => {
    return (
        <p>
        filter shown with : <input value={filter} onChange={filterChangeCb} />
        </p>
    )
}

const Numbers = ({persons, filter}) => {
    const filtered = persons.filter((x) => filter.length === 0 || x.name.includes(filter))
    const numbers = filtered.map((obj) => <p key={obj.name}>{obj.name} {obj.number}</p>)

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
        axios
            .get('http://localhost:3001/persons')
            .then(resp => {
                const people = resp.data
                setPerson(people)
            })
    }, [])


    const addPerson = (event) => {
        // disable page reload
        event.preventDefault()

        const found = persons.filter((x) => x.name === newName)
        if (found.length !== 0)
            alert(`${newName} already added to the Phonebook`)
        else {
            var copy = [...persons]
            copy.push({name: newName, number: newNumber})
            setPerson(copy)

            setNewName('')
            setNewNumber('')
        }
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

    return (
        <div>
            <h2>Phonebook</h2>

            <Filter filter={filter} filterChangeCb={handleFilterChange} />

            <h3>Add a new</h3>
            <NewPerson name={newName} number={newNumber} handleNameChangeCb={handleNameChange}
                handleNumberChangeCb={handleNumberChange} addPersonCb={addPerson} />

            <Numbers persons={persons} filter={filter} />
        </div>
    )
}

export default App;
