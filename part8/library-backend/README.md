# Library-backend
Provides a GraphQL backend for the library example.

Part 8 in Fullstack MOOC [TODO add link]

## Sample queries
```
query {
  bookCount
  authorCount
}

query {
  allBooks {
    title
    author {
      name
    }
    published
    genres
  }
}

query {
  allAuthors {
    name
    bookCount
  }
}

query {
  allBooks(author: "Robert Martin", genre: "refactoring") {
    title
  }
}

# Mutations
# create new user: returns that user
mutation {
  createUser(username: "felix", password: "good", favoriteGenre: "classic") {
    username
    favoriteGenre
  }
}

# Login returns token
mutation {
  login(username: "felix", password: "good") {
    value
  }
}

# add a new book : requires user to be logged in
mutation (token: $token) {
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

# edit an author : requires user to be logged in
mutation (token: $token) {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958, token: $token) {
    name
    born
  }
}
```

## Deployment

## Installation
``` bash
git pull {path}
cd {folder}
npm install
npm start
# add .env with MongoDB info
npm run init_db
npm start
```

Requires following ENVs to be set.
```
DB_USERNAME
DB_PASSWORD
DB_HOSTNAME
```

### NOTES
I'm not good enough to test this shit. It's so convoluted that a politician would admire it.

Apollo is a pain in the ass to test. There is no easy to use a separate client to run tests,
so you could test all the queries on a proper server.

You have to mock the server, mock the context the tests are ran to provide user authentication.
Might you want some code with those mocks also?

It's like they on purpose decided that TDD was a bad idea so lets make testing as painful as
possible. Or somebody has a hard-on for mocks and hates integration/application testing.

Which is why I removed all the mutations tests which require user authentication 'cause I can't
be bothered with trying to mock the whole system while having a fine server implementation that I
want to test. If I really wanted to use this, I'd just copy the GraphQL request format and write
Python or bash scripts that send the requests to a real server.
