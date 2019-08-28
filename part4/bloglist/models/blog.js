/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.9
 */
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)
const params = ''

const connect = (username, password, server_url, db_name) => {
    const url = `mongodb+srv://${username}:${password}@${server_url}/${db_name}?${params}`
    mongoose.connect(url, { useNewUrlParser: true })
}

const disconnect = () => {
    mongoose.connection.close()
}

const deleteAll = () => {
    return Blog.deleteMany({})
}

const save = (params) => {
	const blog = new Blog(params)
    return blog.save()
}

const all = () => {
	return Blog.find({}).exec()
}

module.exports = {
    connect,
    disconnect,
    save,
    all,
    deleteAll
}
