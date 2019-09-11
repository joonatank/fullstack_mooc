import React from 'react'
import _ from 'lodash'

import BooksTable from './BooksTable'

const Books = ({ result, setFilter }) => {
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
        <BooksTable books={books} header={'Books'} />
        {genres.map(a =>
          <button onClick={() => setFilter(a)} key={a}>
            {a !== '' ? a : 'All' }
          </button>
        )}
      </div>
    )
  }
}

export default Books
