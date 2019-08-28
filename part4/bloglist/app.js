/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.2
 */
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blog = require('./models/blog')

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
    const res = await blog.save(request.body)
    response.status(201).json(res)
})

module.exports = app
