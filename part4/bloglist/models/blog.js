/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.21
 */
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
	title: String,
	author: { type: String, required: true },
	url: { type: String, required: true },
	likes: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
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
    return mongoose.connection.close()
}

const deleteAll = () => {
    return Blog.deleteMany({}).exec()
}

const save = (params, id) => {
	const blog = new Blog({...params, user: id})
    return blog.save()
}

const remove = (id, user) => {
    return Blog.findOneAndRemove({ _id: id, user: user })
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
	return Blog.find({})
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
