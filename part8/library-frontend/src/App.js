import React, { useState, useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import Authors from './components/Authors'
import EditAuthor from './components/EditAuthor'
import Books from './components/Books'
import Recom from './components/Recom'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

// NOTES
// Not going to use Context for Tokens because they are impossible to test
//  without writing custom clients/servers for testing.
//  For this demonstration just easier to pass the token in the message body.
//
// Using GraphQL for Genre filtering would be a really bad idea in a real application
//  (unless we are worried about massive amounts of data)
//  It does another request every time the filter is changed
//  - it's slow (constant Loading screens)
//  - it's wasteful
//  - it can't handle showing all the genres, we have to add an extra button
//      or make make another request to get a list of genres

// FIXME
// 8.22 : Cache updates don't work
//
// TODO
// Add Error handling with alerts
// Add info boxes to the user (flash messages or smth) when stuff is done
//  createBook, editAuthor
// Move queries to separate file
// Add redirect from add book to the books page
// Add redirect from login to authors page
const ALL_BOOKS = gql`
query ($genre: String) {
  allBooks(genre: $genre) {
    author {
      name
    }
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
const ME = gql`
query ($token: String!) {
  me(token: $token) {
    username
    favoriteGenre
  }
}
`
const CREATE_BOOK = gql`
  mutation createBook(
      $title: String!,
      $author: String!,
      $published: Int,
      $genres: [String!],
      $token: String!
      )
    {
    addBook (
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
      token: $token
    ) {
      title
      author {
        name
      }
    }
}
`
const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!, $token: String!) {
  editAuthor(name: $name, setBornTo: $born, token: $token)
  {
    name
    born
  }
}
`
const CREATE_USER = gql`
mutation($username: String!, $password: String!) {
  createUser(username: $username, password: $password, favoriteGenre: "classic") {
    username
    favoriteGenre
  }
}
`
const LOGIN = gql`
mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [genreFilter, setGenreFilter] = useState('')

  useEffect(() => {
      setToken(localStorage.getItem('library-user-token'))
  }, [])

  const logout = () => {
    localStorage.setItem('library-user-token', '')
    setToken(null)
  }

  const NameBar = ({ result }) => (
    result.loading || result.error ? null : result.data.me.username + " logged in"
  )

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token &&
            <span>
              <button onClick={() => setPage('add')}>add book</button>
              <Query query={ME} variables={({token: token})} >
                { (result) => <NameBar result={result} /> }
              </Query>
              <button onClick={() => setPage('recom')}>recomendations</button>
              <button onClick={() => logout()}>logout</button>
            </span>
        }
        {!token &&
            <span>
              <button onClick={() => setPage('login')}>login</button>
              <button onClick={() => setPage('register')}>register</button>
            </span>
        }
      </div>

      {page === 'authors' &&
        <div>
          <Query query={ALL_AUTHORS}>
            { (result) => (
              <div>
                <Authors result={result} />
                <Mutation mutation={EDIT_AUTHOR}
                      variables={({token: token})}
                      refetchQueries={[{ query: ALL_AUTHORS }]}
                    >
                  { (editAuthor) => <EditAuthor result={result} editAuthor={editAuthor} /> }
                </Mutation>
              </div>
              )
            }
          </Query>
        </div>
      }

      {page === 'books' &&
          <Query query={ALL_BOOKS} variables={{ genre: genreFilter }} >
          { (result) => <Books result={result} setFilter={setGenreFilter} /> }
        </Query>
      }

      {page === 'recom' &&
        <Query query={ME} variables={{ token: token }} >
          { (me) =>
            <Query query={ALL_BOOKS} variables={{ genre: me.data.me.favoriteGenre }} >
            { (books) => <Recom result={books} user={me} /> }
            </Query>
          }
        </Query>
      }

      {page === 'add' &&
        <Mutation mutation={CREATE_BOOK}
            variables={({token: token})}
            refetchQueries={[ { query: ALL_BOOKS },
                { query: ALL_BOOKS, variables: 'genre' },
                { query: ALL_AUTHORS } ]}
          >
          {(addBook) => <NewBook addBook={addBook} />}
        </Mutation>
      }

      {page === 'login' &&
        <Mutation mutation={LOGIN}>
          {(login) => <LoginForm login={login} setToken={setToken} />}
        </Mutation>
      }

      {page === 'register' &&
        <Mutation mutation={CREATE_USER}>
          {(createUser) => <LoginForm login={createUser} />}
        </Mutation>
      }

    </div>
  )

}

export default App
