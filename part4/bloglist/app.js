/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.21
 */
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blog = require('./models/blog')
const users = require('./models/user')
const loginRouter = require('./controllers/login')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const db_name = (process.env.NODE_ENV === 'test') ?
    process.env.TEST_DATABASE :
    process.env.DEV_DATABASE

blog.connect(process.env.USERNAME, process.env.PASSWORD, process.env.MONGODB_URL, db_name)

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use('/api/login', loginRouter)

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        req.token = auth.substring(7)
    }
    next()
}
app.use(tokenExtractor)

app.get('/api/blogs', async (request, response) => {
	const blogs = await blog.all().populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

app.post('/api/blogs', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await users.get(decodedToken.id)

        const res = await blog.save(request.body, user)
        response.status(201).json(res)
    } catch (error) {
        next(error)
    }
})

app.post('/api/blogs/:id/comments', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await users.get(decodedToken.id)

        const comment = request.body.comment
        const id = request.params.id

        const res = await blog.addComment(id, comment)
        response.status(201).json(res)
    } catch (error) {
        next(error)
    }
})

app.delete('/api/blogs/:id', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await users.get(decodedToken.id)

        const id = request.params.id
        const res = await blog.remove(id, user)
        if (res) {
            response.status(200).json(res)
        }
        else {
            response.status(403).end()
        }
    } catch (error) {
        next(error)
    }
})

app.put('/api/blogs/:id', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await users.get(decodedToken.id)

        const body = request.body
        const id = request.params.id
        const res = await blog.update(id, body)
        response.status(200).json(res)
    } catch (error) {
        next(error)
    }
})

app.get('/api/users', async (request, response) => {
	const resp = await users.all().populate('blogs')
    response.json(resp)
})

app.post('/api/users', async (request, response, next) => {
    try {
        const res = await users.create(request.body)
        response.status(201).json(res)
    } catch (error) {
        next(error)
    }
})

const errorHandler = (err, request, response, next) => {
    console.error(err.message)
    if (err instanceof mongoose.Error) {
        return response.status(400).json( {error: err.message } )
    }
    else if (err.name === 'JsonWebTokenError') {
        return response.status(401).json( { error: 'token missing or invalid' } )
    }
    // something weird
    else {
        console.error(`Unknown error: ${err.message}`)

        next(err)
    }
}
app.use(errorHandler)

process.on('SIGINT', () => {
    mongo.disconnect()
    process.exit(0)
})

module.exports = app
