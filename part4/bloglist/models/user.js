/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.14
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
	name: { type: String, required: true },
	passwordHash: { type: String, required: true }
})

userSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
        delete obj.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

const create = async (params) => {
    const salt = 10
    const hash = await bcrypt.hash(params.password, salt)

	const user = new User({
        username: params.username,
        name: params.name,
        passwordHash: hash
    })

    return user.save()
}

const all = () => {
	return User.find({}).exec()
}

const deleteAll = () => {
    return User.deleteMany({}).exec()
}

const count = () => {
	return User.countDocuments().exec()
}

module.exports = {
    create,
    count,
    all,
    deleteAll
}
