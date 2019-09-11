import React, { useState } from 'react'
import _ from 'lodash'

import BooksTable from './BooksTable'

const Books = ({ result, setFilter }) => {
  //const [ filter, setFilter ] = useState('')
  const filter =''

  if (result.loading) {
    return <div>loading...</div>
  }
  else if (result.error) {
    return <div>errors...</div>
  }
  else {
    const books = result.data.allBooks
    console.log(books)

    // TODO this doesn't work properly if filter is set since
    // we are missing some of the genres
    const genres = _.uniq(
      books.reduce((acc, b) => [ ...acc, ...b.genres], [''])
    )

    return (
      <div>
        <BooksTable books={books} filter={filter} header={'Books'} />
        {genres.map(a =>
          <button onClick={() => setFilter(a)} key={a}>
            {a !== '' ? a : 'All' }
          </button>
        )}
      </div>
    )

      /*
    return (
      <div>
        <h2>books</h2>

        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {books
              .filter(b => b.genres.reduce((acc, x) => acc || x.includes(filter), false))
              .map(a =>
                  <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author.name}</td>
                    <td>{a.published}</td>
                  </tr>
                  )
            }
          </tbody>
        </table>
        {genres.map(a => <button onClick={() => setFilter(a)} key={a}>{a}</button>) }
      </div>
    )
    */
  }
}

export default Books
