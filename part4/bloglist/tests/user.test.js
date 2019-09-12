/*  Joonatan Kuosa
 *  2019-09-06
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.21
 */

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const users = require('../models/user')
const blogs = require('../models/blog')

const helpers = require('./test_helpers')

beforeEach(async () => {
    await blogs.deleteAll()
    await users.deleteAll()
})

afterAll(async () => {
    await blogs.disconnect()
})

// TODO test that blogs is populated when retrieving users
//  Empty tested
//  Need to test one with multiple blogs defined and that they are actually populated (not just ids)
describe('GET users', () => {
    test('get users succeeds with empty list', async () => {
        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(0)
            })
    })

    test('get users succeeds and no passwords are returned', async () => {
        const N_USERS = 1
        const user = { username: 'felix', name: 'Felix the Magnificent', password: 'good123' }
        await users.create(user)

        const N = await users.count()
        expect(N).toBe(N_USERS)

        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(N_USERS)
                const m = resp.body[0]
                expect(m.id).toBeDefined()
                // check equality to ensure it contains NO password
                expect(m).toEqual( { username: user.username, name: user.name, id: m.id, blogs: [] } )
            })
    })

    test('get users returns a list of all users', async () => {
        const N_USERS = helpers.users.length

        await Promise.all(
            helpers.users.map(u => users.create(u))
        )

        const N = await users.count()
        expect(N).toBe(N_USERS)

        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(N_USERS)
                expect(resp.body[0].blogs).toBeDefined()
            })
    })

    test('get users list has blogs', async () => {
        const user = { username: 'felix', name: 'Felix the Magnificent', password: 'good123' }
        const userObj = await users.create(user)

        // create all six blog posts with the single user
        await helpers.initialiseDB(userObj)

        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(1)
                const m = resp.body[0]
                expect(m.blogs.length).toBe(6)

                const b = m.blogs[0]
                const a = helpers.blogs[0]
                expect(b.author).toBe(a.author)
                expect(b.title).toBe(a.title)
                expect(b.likes).toBe(a.likes)
            })
    })
})

describe('POST users', () => {
    const post_user_fail = async (user) => {
        return await api.post('/api/users')
            .send(user)
            .set('Accept', 'application/json')
            .expect(400)
            .then(resp => {
                expect(resp.body.error).toBeDefined()
            })
    }

    const user_database_empty = async () => {
        const N = await users.count()
        expect(N).toBe(0)
    }

    test('post a new user succeeds', async () => {
        const user = { username: 'felix', name: 'Felix the Magnificent', password: 'good123' }

        await user_database_empty()

        // post
        await api.post('/api/users')
            .send(user)
            .set('Accept', 'application/json')
            .expect(201)
            .expect('Content-Type', /json/)
            .then(resp => {
                expect(resp.body[0]).not.toBeDefined()
            })

        // database
        const after = await users.all()
        expect(after.length).toBe(1)
        expect(after[0].username).toBe(user.username)
        expect(after[0].name).toBe(user.name)
        expect(after[0].passwordHash).toBeDefined()
    })

    test('post a new user without username fails', async () => {
        const user = { name: 'Felix the Magnificent', password: 'good123' }

        await user_database_empty()

        await post_user_fail(user)

        await user_database_empty()
    })

    test('post a new user without name fails', async () => {
        const user = { username: 'felix', password: 'good123' }

        await user_database_empty()

        await post_user_fail(user)

        await user_database_empty()
    })

    test('post a new user without password fails', async () => {
        const user = { username: 'felix', name: 'Felix the Magnificent' }

        await user_database_empty()

        await post_user_fail(user)

        await user_database_empty()
    })

    test('post a new user with already existing username fails', async () => {
        const user = { username: 'felix', name: 'Felix the Magnificent', password: 'good123' }

        await users.create(user)
        const N = await users.count()
        expect(N).toBe(1)

        await post_user_fail(user)

        const Na = await users.count()
        expect(Na).toBe(1)
    })

    test('post a new user with too short username fails', async () => {
        const user = { username: 'fe', name: 'Felix the Magnificent', password: 'good123' }

        await user_database_empty()

        await post_user_fail(user)

        await user_database_empty()
    })

    test('post a new user with too short password fails', async () => {
        const user = { username: 'felix', name: 'Felix the Magnificent', password: 'ba' }

        await user_database_empty()

        await post_user_fail(user)

        await user_database_empty()
    })
})
