import React, { useState, useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/react-hooks'

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
    id
    title
    genres
    author {
      name
    }
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
query {
  me {
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
      )
    {
    addBook (
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
    id
    title
    genres
    author {
      name
    }
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

const BOOK_ADDED = gql`
subscription {
  bookAdded {
    id
    title
    genres
    author {
      name
    }
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [genreFilter, setGenreFilter] = useState('')

  const client = useApolloClient()

  const books = useQuery(ALL_BOOKS)
  const authors = useQuery(ALL_AUTHORS)

  const handleError = (error) => {
    console.error(error)
    error.graphQLErrors.map(err => console.error(err.message))
  }

  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    update: (store, response) => {
      console.log('mutation resp: ', response)
      updateCacheWith(response.data.addBook)
    }
  })

  const updateCacheWith = (book) => {
    console.log('updateCacheWith: ', book)
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    console.log('datainstore: ', dataInStore)
    if (!includedIn(dataInStore.allBooks, book)) {
      dataInStore.allBooks.push(book)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }
  }

  useEffect(() => {
      setToken(localStorage.getItem('library-user-token'))
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const logout = () => {
    localStorage.setItem('library-user-token', '')
    setToken(null)
  }

  const NameBar = ({ result }) => (
    result.loading || result.error ? null
      : !result.data.me ? null
      : result.data.me.username + " logged in"
  )

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token &&
            <span>
              <button onClick={() => setPage('add')}>add book</button>
              <Query query={ME} >
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
                <Authors result={authors} />
                <Mutation mutation={EDIT_AUTHOR}
                      refetchQueries={[{ query: ALL_AUTHORS }]}
                    >
                { (editAuthor) => <EditAuthor result={authors} editAuthor={editAuthor} /> }
                </Mutation>
              </div>
              )
            }
          </Query>
        </div>
      }

      {page === 'books' && <Books result={books} setFilter={setGenreFilter} /> }

      {page === 'recom' &&
        <Query query={ME} >
          { (me) =>
            <Query query={ALL_BOOKS} variables={{ genre: me.data.me.favoriteGenre }} >
            { (books) => <Recom result={books} user={me} /> }
            </Query>
          }
        </Query>
      }

      {page === 'add' && <NewBook addBook={addBook} />}

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
