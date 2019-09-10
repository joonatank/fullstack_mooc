// For this test
const { createTestClient } = require('apollo-server-testing')
const gql = require('graphql-tag')
const mongoose = require('mongoose')

// For the test helpers
const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')
const { execute, toPromise } = require('apollo-link')
const { server } = require('../library-backend')
const { initDb, clearDb, books, authors } = require('../init_data')

const constructTestServer = ({ context = defaultContaxt } = {}) => {
  return server
}

const startTestServer = async server => {
  const httpServer = await server.listen({ port: 0 })

  const link = new HttpLink({
    uri: `http://localhost:${httpServer.port}`,
    fetch,
  })

  const executeOperation = ({ query, variables = {} }) =>
    execute(link, { query, variables })

  return {
    link,
    stop: () => httpServer.server.close(),
    graphql: executeOperation,
  }
}

const GET_COUNTS = gql`
query {
  bookCount
  authorCount
}
`
// TODO author field doesn't work when filtering with author
const GET_ALL_BOOKS = gql`
query ($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    title
    author {
      name
    }
    published
    genres
  }
}
`
const GET_ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    bookCount
    born
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

afterAll(async () => {
  await mongoose.connection.close()
})

beforeEach(async () => {
  await initDb()
})

afterEach(async () => {
  await clearDb()
})


describe('Queries', () => {
  it('fetches counts', async () => {
    const { query } = createTestClient(server);
    const res = await query({ query: GET_COUNTS })
    expect(res.data).toEqual({ bookCount: books.length, authorCount: authors.length })
  })

  it('fetches books', async () => {
    const { query } = createTestClient(server);
    const res = await query({ query: GET_ALL_BOOKS })

    expect(res.data.allBooks.length).toBe(books.length)

    res.data.allBooks.map((b, i) => {
      // TODO missing author in books
      expect({ ...b, author: '' }).toEqual({ ...books[i], author: '' })
      expect(b.author)
    })
  })

  it('fetches authors', async () => {
    const { query } = createTestClient(server);
    const res = await query({ query: GET_ALL_AUTHORS })

    expect(res.data.allAuthors.length).toBe(authors.length)

    res.data.allAuthors.map((a, i) => {
      bookCount = books
        .filter(b => authors[i].name === b.author)
        .reduce(acc => acc + 1, 0)

      if (authors[i].born) {
        expect(a.born).toBe(authors[i].born)
      }
      expect(a.name).toBe(authors[i].name)
      expect(a.bookCount).toBe(bookCount)
    })
  })

  it('fetches books with genre filter', async () => {
    const { query } = createTestClient(server);
    const res = await query({ query: GET_ALL_BOOKS, variables: { genre: 'crime' } })

    expect(res.data.allBooks.length).toBe(1)

    const book = {
      title: 'Crime and punishment',
      published: 1866,
      author: 'Fyodor Dostoevsky',
      genres: ['classic', 'crime']
    }

    res.data.allBooks.map((b) => {
      expect(b).toEqual({ ...book, author: { name: book.author } })
    })
  })

  it('fetches books with author filter', async () => {
    const { query } = createTestClient(server);
    const res = await query({ query: GET_ALL_BOOKS, variables: { author: 'Robert Martin' } })

    expect(res.data.allBooks).not.toBe(null)
    expect(res.data.allBooks.length).toBe(2)
    res.data.allBooks.map(b => expect(b.author).toEqual({ name: 'Robert Martin' }))
  })

  it('fetches books with combined filter', async () => {
    const { query } = createTestClient(server);
    const filter = { author: 'Robert Martin', genre: 'refactoring' }
    const res = await query({ query: GET_ALL_BOOKS, variables: filter })

    expect(res.data.allBooks).not.toBe(null)
    expect(res.data.allBooks.length).toBe(1)
    res.data.allBooks.map(b => {
      expect(b.author).toEqual({ name: 'Robert Martin' })
      expect(b.genres).toEqual(['refactoring'])
      expect(b.title).toBe('Clean Code')
    })
  })
})


describe('Mutations', () => {
  const ADD_BOOK = gql`
  mutation ($token: String!) {
    addBook(
      title: "Pimeyden tango",
      author: "Reijo Mäki",
      published: 1997,
      genres: ["crime"],
      token: $token
    ) {
      title,
      author {
        name
      }
    }
  }
  `
  const EDIT_AUTHOR = gql`
  mutation ($token: String!) {
    editAuthor(name: "Reijo Mäki", setBornTo: 1958, token: $token) {
      name
      born
    }
  }
  `
  const CREATE_USER = gql`
  mutation {
    createUser(username: "felix", password: "good", favoriteGenre: "classic") {
      username
      favoriteGenre
    }
  }
  `

  const LOGIN = gql`
  mutation {
    login(username: "felix", password: "good") {
      value
    }
  }
  `

  it('creates an user', async () => {
    const { mutate } = createTestClient(server);

    const res = await mutate({ mutation: CREATE_USER })

    expect(res.data.createUser).not.toBe(null)
    expect(res.data.createUser.username).toBe('felix')
    expect(res.data.createUser.favoriteGenre).toBe('classic')
  })

  it('login', async () => {
    const { query, mutate } = createTestClient(server);

    await mutate({ mutation: CREATE_USER })
    const res = await mutate({ mutation: LOGIN })

    expect(res.data.login).not.toBe(null)
    expect(res.data.login.value).not.toBe(null)
    const token = res.data.login.value

    const me = await query({ query: ME, variables: { token: token } })
    expect(me.data.me).toEqual({ username: 'felix', favoriteGenre: 'classic' })
  })

  it('adds a book', async () => {
    const { mutate } = createTestClient(server);

    await mutate({ mutation: CREATE_USER })
    const login = await mutate({ mutation: LOGIN })
    const token = login.data.login.value

    const res = await mutate({ mutation: ADD_BOOK, variables: { token: token } })

    expect(res.data.addBook).not.toBe(null)
    expect(res.data.addBook.title).toBe('Pimeyden tango')
    expect(res.data.addBook.author).not.toBe(null)
    expect(res.data.addBook.author.name).toBe('Reijo Mäki')
    // TODO should check that the author is added to the database also
  })

  it('edits an author', async () => {
    const { mutate } = createTestClient(server);

    await mutate({ mutation: CREATE_USER })
    const login = await mutate({ mutation: LOGIN })
    const token = login.data.login.value

    await mutate({ mutation: ADD_BOOK, variables: { token: token } })
    const res = await mutate({ mutation: EDIT_AUTHOR, variables: { token: token } })

    expect(res.data.editAuthor).not.toBe(null)
    expect(res.data.editAuthor.name).toBe('Reijo Mäki')
    expect(res.data.editAuthor.born).toBe(1958)
  })

})
