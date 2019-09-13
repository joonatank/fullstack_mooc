/*  Joonatan Kuosa
 *  2019-09-08
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 8.1 - 8.15
 */
require('dotenv').config()
const { ApolloServer, UserInputError, gql, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const uuid = require('uuid/v1')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Authors = require('./models/author')
const Books = require('./models/book')
const Users = require('./models/user')

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

const getVerifiedUser = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  return Users.findById(decoded.id)
}


const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    me(token: String!): User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]
      token: String!
    ): Book,

    editAuthor(name: String!, setBornTo: Int!, token: String!) : Author

    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const pubsub = new PubSub()

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
    me: (root, { token }) => getVerifiedUser(token)
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
    //
    // TODO cleanup by doing proper promise chaining
    addBook: async (root, args) => {
      try {
        const user = await getVerifiedUser(args.token)
      }
      catch(err) {
        throw new UserInputError('Not logged in', { invalidArgs: args })
      }

      return Authors.findOne({ name: args.author }).then((author_) => {
        const author = author_
          ? author_
          : new Authors({ name: args.author })

        const book = new Books({ ...args, author: author })
        author.books = [ ...author.books, book._id ]

        return author.save().then( () => book.save() )
        }).then( book => {
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
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

    editAuthor: async (root, args) => {
      try {
        const user = await getVerifiedUser(args.token)
      }
      catch (err) {
        throw new UserInputError('Not logged in', { invalidArgs: args })
      }

      return Authors.findOne({ name: args.name }).then(author => {
        author.born = args.setBornTo
        return author.save()
      }).catch(err => {
        console.error(err)
        throw new UserInputError(err.message, { invalidArgs: args })
      })
    },

    createUser: (root, args) => {
      if (args.password.length < 3) {
          throw new UserInputError('Password too short', { invalidArgs: args })
      }

      return bcrypt.hash(args.password, 10).then(hash => {
        const user = new Users({ ...args, hash: hash })
        return user.save()
          .catch(error => {
            throw new UserInputError(error.message, { invalidArgs: args })
          })
      })
    },
    login: (root, args) => {
      return Users.findOne({ username: args.username }).then(user => {
        return bcrypt.compare(args.password, user.hash).then(res => {
          if (res) {
            console.log('user: ', user.username, ' password correct')
            const forToken = { username: args.username, id: user._id }
            const token = jwt.sign(forToken, process.env.JWT_SECRET)
            return { value: token }
          }
          else {
            console.log('user: ', user.username, ' password incorrect')
            throw new UserInputError('wrong credentials')
          }
        })
      })
    }
  }, // Mutations

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    } // Subscriptions
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
  server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
  })
}

module.exports = {
  typeDefs,
  resolvers,
  server,
};
