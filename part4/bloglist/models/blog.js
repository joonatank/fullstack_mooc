/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.14
 */
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
	title: String,
	author: { type: String, required: true },
	url: { type: String, required: true },
	likes: { type: Number, default: 0 }
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

const remove = (id) => {
    return Blog.findByIdAndDelete(id).exec()
}

const update = (id, params) => {
    return Blog.findByIdAndUpdate(id, params).exec()
}

const get = (id) => {
	return Blog.findById(id).exec()
}

const count = () => {
	return Blog.countDocuments({}).exec()
}

const all = () => {
	return Blog.find({}).exec()
}

module.exports = {
    connect,
    disconnect,
    save,
    all,
    remove,
    update,
    get,
    count,
    deleteAll
}
