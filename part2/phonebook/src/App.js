/*  Joonatan Kuosa
 *  2019-08-26
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 2.6 - 2.9
 */
import React, {useState} from 'react';

const App = () => {
    const [ persons, setPerson ] = useState([ {name: 'Arto Hellas', number: '555-5555555' } ])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')

    const filtered = persons.filter((x) => filter.length === 0 || x.name.includes(filter))
    const numbers = filtered.map((obj) => <p key={obj.name}>{obj.name} {obj.number}</p>)

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

            <p>
            filter shown with : <input value={filter} onChange={handleFilterChange} />
            </p>

            <form onSubmit={addPerson}>
            <div>
                name: <input value={newName} onChange={handleNameChange} />
                <br />
                number : <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
            </form>

            <h2>Numbers</h2>
            {numbers}
        </div>
    )
}

export default App;
