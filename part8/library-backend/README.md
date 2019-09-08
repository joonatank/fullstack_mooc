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
    author
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
mutation {
  addBook(
    title: "Pimeyden tango",
    author: "Reijo Mäki",
    published: 1997,
    genres: ["crime"]
  ) {
    title,
    author
  }
}

mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
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
