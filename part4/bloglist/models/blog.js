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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{type: String }]
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
    return Blog.deleteMany({})
}

const save = (params, user) => {
	const blog = new Blog({...params, user: user._id})
    return blog.save().then(async res => {
        user.blogs = user.blogs.concat(blog._id)

        await user.save()

        return res
    })
}

const addComment = (id, comment) => {
    // TODO check that the comment isn't empty
    return Blog.findById(id).then(blog => {
        blog.comments = blog.comments.concat(comment)
        return blog.save()
    })
}

const remove = (id, user) => {
    return Blog.findOneAndRemove({ _id: id, user: user })
}

const update = (id, params) => {
    return Blog.findByIdAndUpdate(id, params)
}

const get = (id) => {
	return Blog.findById(id)
}

const count = () => {
	return Blog.countDocuments({})
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
    deleteAll,
    addComment,
    Blog
}
