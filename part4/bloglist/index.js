/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1
 */
require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)
const db_name = 'bloglist'
const params = ''

const connect = (username, password, server_url) => {
    const url = `mongodb+srv://${username}:${password}@${server_url}/${db_name}?${params}`
    mongoose.connect(url, { useNewUrlParser: true })
}

connect(process.env.USERNAME, process.env.PASSWORD, process.env.MONGODB_URL)

app.use(cors())
app.use(bodyParser.json())

app.get('/api/blogs', (request, response) => {
	Blog
		.find({})
		.then(blogs => response.json(blogs))
})

app.post('/api/blogs', (request, response) => {
	const blog = new Blog(request.body)

	blog
		.save()
		.then(result => {
			response.status(201).json(result)
		})
})

const PORT = 3003
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
