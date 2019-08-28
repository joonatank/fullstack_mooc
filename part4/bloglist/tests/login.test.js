/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.18
 */

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const users = require('../models/user')
const blog = require('../models/blog')

beforeAll(async () => {
    await users.deleteAll()
})

beforeEach(async () => {
    await users.create( { username: 'felix', name: 'Felix the Magnificent', password: '555good' } )
})

afterEach(async () => {
    await users.deleteAll()
})

afterAll(async () => {
    // TODO this should be in the application by default
    await blog.disconnect()
})

describe('POST login', () => {
    test('login succesful', async () => {
        await api.post('/api/login')
            .send({ username: 'felix', password: '555good' })
            .set('Accept', 'application/json')
            .expect(200)
            .then(r => expect(r.body.token).toBeDefined())
    })

    test('login with no arguments fails', async () => {
        await api.post('/api/login')
            .set('Accept', 'application/json')
            .expect(401)
            .then(r => expect(r.body.error).toBe('invalid username or password'))
    })

    test('login invalid password fails', async () => {
        await api.post('/api/login')
            .send({ username: 'felix', password: 'good' })
            .set('Accept', 'application/json')
            .expect(401)
            .then(r => expect(r.body.error).toBe('invalid username or password'))
    })

    test('login invalid username fails', async () => {
        await api.post('/api/login')
            .send({ username: 'fel', password: '555good' })
            .set('Accept', 'application/json')
            .expect(401)
            .then(r => expect(r.body.error).toBe('invalid username or password'))
    })
})
