/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.18
 */
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    username: {
        type: String, required: true, unique: true,
        validate: {
            // only word characters, at least 3 of them
            validator: (v) => /\w{3}\w*/.test(v),
            message: props => `${props.value} not long enough`
        }
    },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
        delete obj.passwordHash
    }
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

const create = async (params) => {
    // check password legnth before hashing
    if (!params.password) {
        throw new mongoose.Error('User validation: password has to exist')
    }
    if (params.password.length < 3) {
        throw new mongoose.Error('User validation: password needs to be at least 3 character')
    }

    const salt = 10
    const hash = await bcrypt.hash(params.password, salt)

    const user = new User({
        username: params.username,
        name: params.name,
        passwordHash: hash,
        blogs: []
    })

    return user.save()
}

const all = () => {
    return User.find({})
}

const deleteAll = () => {
    return User.deleteMany({}).exec()
}

const count = () => {
    return User.countDocuments().exec()
}

const find = (params) => {
    return User.findOne(params)
}

const get = (id) => {
    return User.findById(id)
}

module.exports = {
    create,
    count,
    all,
    find,
    get,
    deleteAll
}
