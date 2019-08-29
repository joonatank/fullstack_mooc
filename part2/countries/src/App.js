import React, {useState, useEffect} from 'react'
import axios from 'axios'

const API_URL = 'https://restcountries.eu/rest/v2/name/'

const Country = ({ country }) => {
    return (
        <div>
        <h2>{country.name}</h2>
        <p>capital: {country.capital}</p>
        <p>population: {country.population}</p>
        <h3>languages</h3>
        <li>{country.lang.map(x => <ul key={x}>{x}</ul>)}</li>
        <img src={country.flag} height='128' alt='FLAG'/>
        </div>
    )
}

const Countries = ({countries, showCb}) => {
    const matches = countries.length

    const translateCountry = (c) => {
        const lang = c.languages.map(l => l.name)
        return {
            name: c.name,
            capital: c.capital,
            lang: lang,
            population: c.population,
            flag: c.flag
        }
    }

    const listElement = (x, cb) => {
         return (
             <ul key={x}>{x}
                 <button type='submit' onClick={cb.bind(this, x)}>show</button>
             </ul>
         )
    }

    return (
        <div>
        {matches === 1 && <Country country={translateCountry(countries[0])} /> }
        {matches > 1 && matches <  10
                && <li>{countries.map(c => listElement(c.name, showCb))}</li>

        }
        {matches >= 10 && <p>Too many matches, specify another filter</p>}
        <br />
        <p>Info: matches {matches}</p>
        </div>
    )
}
const App = () => {
    const [filter, setFilter] = useState('')
    const [countries, setCountries] = useState([])


    useEffect(() => {
        if (filter.length > 0) {
            axios.get(API_URL.concat(filter))
                .then(xs => setCountries(xs.data))
        }
        // TODO should we retrive the full list or not?
    }, [filter])

    const filterChangeCb = (event) => {
        setFilter(event.target.value)
    }

    const handleShow = (name) => {
        console.log('handleShow', name)
        setFilter(name)
    }

    return (
    <div className="App">
        <p>find countries
            <input value={filter} onChange={filterChangeCb} />
        </p>
        <Countries countries={countries} showCb={handleShow} />
    </div>
    )
}

export default App;
