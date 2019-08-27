/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.2
 */
require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blog = require('./models/blog')

blog.connect(process.env.USERNAME, process.env.PASSWORD, process.env.MONGODB_URL)

app.use(cors())
app.use(bodyParser.json())

app.get('/api/blogs', (request, response) => {
	blog.all().then(blogs => response.json(blogs))
})

app.post('/api/blogs', (request, response) => {
	blog.save(request.body).then(result => response.status(201).json(result))
})

const PORT = 3003
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
