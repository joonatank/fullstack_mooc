/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.14
 */
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blog = require('./models/blog')
const users = require('./models/user')

const db_name = (process.env.NODE_ENV === 'test') ?
    process.env.TEST_DATABASE :
    process.env.DEV_DATABASE

blog.connect(process.env.USERNAME, process.env.PASSWORD, process.env.MONGODB_URL, db_name)

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

app.get('/api/blogs', async (request, response) => {
	const blogs = await blog.all()
    response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
    try {
        const res = await blog.save(request.body)
        response.status(201).json(res)
    } catch (error) {
        console.error(error.message)
        response.status(400).json( {error: error.message } )
    }
})

app.delete('/api/blogs/:id', async (request, response) => {
    try {
        const id = request.params.id
        const res = await blog.remove(id)
        response.status(200).json(res)
    } catch (error) {
        console.error(error.message)
        response.status(400).json( {error: error.message } )
    }
})

app.put('/api/blogs/:id', async (request, response) => {
    try {
        const body = request.body
        const id = request.params.id
        const res = await blog.update(id, body)
        response.status(200).json(res)
    } catch (error) {
        response.status(400).end() //json( {error: error.message } )
    }
})

app.get('/api/users', async (request, response) => {
	const resp = await users.all()
    response.json(resp)
})

app.post('/api/users', async (request, response) => {
    try {
        const res = await users.create(request.body)
        response.status(201).json(res)
    } catch (error) {
        console.error(error.message)
        response.status(400).json( {error: error.message } )
    }
})

module.exports = app
