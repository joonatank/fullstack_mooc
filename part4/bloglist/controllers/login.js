/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.18
 */

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const users = require('../models/user')

loginRouter.post('/', async (req, resp) => {
    const body = req.body

    const user = await users.find( {username: body.username} )
    if (!user) {
        resp.status(401).json({ error: 'invalid username or password' })
    }
    else {
        // TODO this doesn't handle undefined passwords (bryct throws)
        const hash = user.passwordHash
        const pw = body.password
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(pw, hash)

        if (!(user && passwordCorrect)) {
            resp.status(401).json({ error: 'invalid username or password' })
        }
        else {
            const userForToken = { username: user.username, id: user._id }

            const token = jwt.sign(userForToken, process.env.SECRET)

            resp
                .status(200)
                .send({ token, username: user.username, name: user.name })
        }
    }
})

module.exports = loginRouter
