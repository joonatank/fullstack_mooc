import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const ALL_BOOKS = gql`
{
  allBooks {
    author
    title
    genres
    id
  }
}
`
const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`
// TODO this allows mutations where author is empty
const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int, $genres: [String!]) {
    addBook (
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author
    }
}
`

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      {page === 'authors' &&
        <Query query={ALL_AUTHORS}>
          { (result) => <Authors result={result} /> }
        </Query>
      }

      {page === 'books' &&
        <Query query={ALL_BOOKS}>
          { (result) => <Books result={result} /> }
        </Query>
      }

      {page === 'add' &&
        <Mutation mutation={CREATE_BOOK}>
          {(addBook) => <NewBook addBook={addBook} />}
        </Mutation>
      }

    </div>
  )
}

export default App
