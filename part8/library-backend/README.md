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
