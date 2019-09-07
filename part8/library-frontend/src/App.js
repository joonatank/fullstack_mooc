import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import Authors from './components/Authors'
import EditAuthor from './components/EditAuthor'
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
const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
  editAuthor(name: $name, setBornTo: $born)
  {
    name
    born
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
        <div>
          <Query query={ALL_AUTHORS}>
            { (result) => <Authors result={result} /> }
          </Query>
          <Mutation mutation={EDIT_AUTHOR} refetchQueries={[{ query: ALL_AUTHORS }]}>
            { (editAuthor) => <EditAuthor editAuthor={editAuthor} /> }
          </Mutation>
        </div>
      }

      {page === 'books' &&
        <Query query={ALL_BOOKS}>
          { (result) => <Books result={result} /> }
        </Query>
      }

      {page === 'add' &&
        <Mutation mutation={CREATE_BOOK}
            refetchQueries={[ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ]}>
          {(addBook) => <NewBook addBook={addBook} />}
        </Mutation>
      }

    </div>
  )
}

export default App
