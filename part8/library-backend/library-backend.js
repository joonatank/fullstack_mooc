/*  Joonatan Kuosa
 *  2019-09-08
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 8.1 - 8.15
 */
require('dotenv').config()
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const uuid = require('uuid/v1')

const Authors = require('./models/author')
const Books = require('./models/book')

mongoose.set('useFindAndModify', false)

const USERNAME = process.env.DB_USERNAME
const PASSWORD = process.env.DB_PASSWORD
const DATABASE_HOST = process.env.DB_HOSTNAME
const DATABASE_NAME =
    (process.env.NODE_ENV !== 'test')
    ? 'graphql'
    : 'graphql-test'

const MONGODB_URI = `
  mongodb+srv://${USERNAME}:${PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true
`

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Book {
    title: String!
    author: Author!
    published: Int
    genres: [String!]
    id: ID!
  }

  type Query {
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    bookCount: Int
    authorCount: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]
    ): Book,

    editAuthor(name: String!, setBornTo: Int!) : Author
  }
`



const resolvers = {
  Query: {
    allBooks: (root, args) => {
      if (args.author) {
        return Authors
          .findOne({ name: args.author })
          .populate({
            path: 'books',
            match: args.genre ? { genres: {$in: args.genre} } : {}
          })
          .then(x => x.books.map(b => b.populate('author').execPopulate()) )
      }
      else {
        return args.genre
          ? Books.where('genres').in(args.genre).populate('author')
          : Books.find({}).populate('author')
      }
    },
    allAuthors: () => Authors.find({}).populate('books'),
    bookCount: () => Books.countDocuments(),
    authorCount: () => Authors.countDocuments(),
  },
  Author: {
    bookCount: (root) => (
      Authors.findOne({ name: root.name })
        .select('books')
        .then(author => {
          return author.books.length
        })
    )
  },

  Mutation: {
    // Add a new author
    // This will add an author if the author doesn't exists
    //    but the book already exists. Since book names are unique can't add
    //    another book with same title but different author.
    //    So there is left an author with no books.
    addBook: (root, args) => {

      return Authors.findOne({ name: args.author }).then((author_) => {
        const author = author_
          ? author_
          : new Authors({ name: args.author })

        const book = new Books({ ...args, author: author })
        author.books = [ ...author.books, book._id ]
        return author.save().then(() => book.save() )

      }).catch(error => {
        console.error('Error thrown: ', error)
        let msg = ''

        if (error.name === 'MongoError' && error.code === 11000) {
          // TODO add which object (book or an author)
          msg = 'Already exists : ' + error.message
        }
        else if (error.name === 'ValidationError') {
          msg = error.name + error.message
        }

        throw new UserInputError(msg, { invalidArgs: args })
      })
    },

    editAuthor: (root, args) => {
      return Authors.findOne({ name: args.name }).then(author => {
        author.born = args.setBornTo
        return author.save()
      }).catch(err => {
        console.error(err)
        throw new UserInputError(err.message, {
          invalidArgs: args
        })
      })
    }
  }
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

if (process.env.NODE_ENV !== 'test') {
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = {
  typeDefs,
  resolvers,
  server,
};
