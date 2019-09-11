import React, { useState, useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import Authors from './components/Authors'
import EditAuthor from './components/EditAuthor'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
//import RegisterForm from './components/RegisterForm'

// TODO
// -- important
// Add Error handling with alerts
// Add info boxes to the user (flash messages or smth) when stuff is done
//  createBook, editAuthor
// -- nice to have
// Move queries to separate file
// Add redirect from add book to the books page
const ALL_BOOKS = gql`
{
  allBooks {
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
  const [token, setToken] = useState('')

  useEffect(() => {
      setToken(localStorage.getItem('library-user-token'))
  }, [])

  const logout = () => {
    localStorage.setItem('library-user-token', '')
    setToken('')
  }

  const NameBar = ({ result }) => (
    result.loading ? null : result.data.me.username + " logged in"
  )

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token !== '' &&
            <span>
              <button onClick={() => setPage('add')}>add book</button>
              <Query query={ME} variables={({token: token})} >
                { (result) => <NameBar result={result} /> }
              </Query>
              <button onClick={() => logout()}>logout</button>
            </span>
        }
        {token === '' &&
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
        <Query query={ALL_BOOKS}>
          { (result) => <Books result={result} /> }
        </Query>
      }

      {page === 'add' &&
        <Mutation mutation={CREATE_BOOK}
            variables={({token: token})}
            refetchQueries={[ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ]}
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
