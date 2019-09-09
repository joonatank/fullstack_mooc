/*  Joonatan Kuosa
 *  2019-09-08
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 8.13 - 8.15
 */
const mongoose = require('mongoose')
require('dotenv').config()

const Authors = require('./models/author')
const Books = require('./models/book')

const authors = [
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Robert Martin',
    born: 1952,
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Martin Fowler',
    born: 1963
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Fyodor Dostoevsky',
    born: 1821
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Joshua Kerievsky', // birthyear not known
    born: 105
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Sandi Metz', // birthyear not known
  },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution']
  },
]

const USERNAME = process.env.DB_USERNAME
const PASSWORD = process.env.DB_PASSWORD
const DATABASE_HOST = process.env.DB_HOSTNAME
const MONGODB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@${DATABASE_HOST}/graphql?retryWrites=true`

if (process.env.NODE_ENV !== 'test') {
    console.log('Running: Init data on MongoDB')
    console.log('WARNING: This will destroy all data there.')

    mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
      .then(async () => {
        console.log('connected to MongoDB')
        await clearDb()
        await initDb()
        mongoose.connection.close()
      }).catch((error) => {
        console.log('error connection to MongoDB:', error.message)
      })
}

const clearDb = async () => {
    // delete all docuements
    await Authors.deleteMany({})
    await Books.deleteMany({})
}

const initDb = async () => {

    // Generate Ids : need them to add references
    const getAuthorID = (name) => {
      const xs = authors.filter(x => x.name === name)
      return xs.length > 0 ? xs[0]._id : null
    }

    const fBooks = books.map(x => (
      { ...x, author: getAuthorID(x.author), _id: mongoose.Types.ObjectId()}
    ))

    // Add book references to authors
    fAuthors =
      authors
      .map(author => ({
        ...author,
        books: fBooks.filter(x => x.author === author._id)
                     .map(x => x._id)
      })
      )

    // Another method for fixing the authors is to
    //  add authors, books then do an update -> $push on the authors
    //  here's an example
    // https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
    //  the problem with this method is that we have to somohow map the arrays

    // save the documents with the proper references
    await Authors.insertMany(fAuthors)

    await Books.insertMany(fBooks)
}

module.exports = { clearDb, initDb, books, authors }
