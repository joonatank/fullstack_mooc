/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.8 - 4.14
 */

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const blog = require('../models/blog')
const users = require('../models/user')

const helpers = require('./test_helpers')

beforeEach(async () => {
    await blog.deleteAll()
    await users.deleteAll()
})

const initialiseDB = (async () => {
    const COUNT = helpers.blogs.length
    await Promise.all(
        helpers.blogs
            .map(b => blog.save(b))
    )

    // check that the database is working first
    const N = await blog.count()
    expect(N).toBe(COUNT)

    return COUNT
})

describe('GET list', () => {
    test('get on empty database returns an empty list', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(0)
            })
    })

    test('get on with one element in database returns one element', async () => {
        const BLOG = helpers.blogs[0]
        const N_BLOGS = 1
        await blog.save(BLOG)

        const N = await blog.count()
        expect(N).toBe(N_BLOGS)

        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(N_BLOGS)
                expect(resp.body[0].title).toBe(BLOG.title)
                expect(resp.body[0].author).toBe(BLOG.author)
                expect(resp.body[0].id).toBeDefined()
            })
    })

    test('get with six elements in database returns six elements', async () => {
        const N_BLOGS = await initialiseDB()

        // check the same with a get
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(N_BLOGS)
            })
    })
})

describe('POST things', () => {
    test('bad post endpoint will return 404', async () => {
        // post
        await api.post('/api')
            .set('Accept', 'application/json')
            .expect(404)

        // database
        const N = await blog.count()
        expect(N).toBe(0)
    })

    test('empty post will fail with 400', async () => {
        // post
        await api.post('/api/blogs')
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)

        // database
        const N = await blog.count()
        expect(N).toBe(0)
    })

    test('post without author will fail with 400', async () => {
        const newBlog = { title: 'this', url: 'somewhere', likes: 0 }
        // post
        await api.post('/api/blogs')
            .send(newBlog)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)

        // database
        const N = await blog.count()
        expect(N).toBe(0)
    })

    test('post without url will fail with 400', async () => {
        const newBlog = { title: 'this', author: 'that', likes: 0 }
        // post
        await api.post('/api/blogs')
            .send(newBlog)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)

        // database
        const N = await blog.count()
        expect(N).toBe(0)
    })

    test('one good post is found after', async () => {
        const newBlog = { title: 'this', author: 'that', url: 'somewhere', likes: 0 }

        const Nb = await blog.count()
        expect(Nb).toBe(0)

        // post
        await api.post('/api/blogs')
            .send(newBlog)
            .set('Accept', 'application/json')
            .expect(201)
            .expect('Content-Type', /json/)
            .then(resp => {
                expect(resp.body.title).toBe(newBlog.title)
                expect(resp.body.author).toBe(newBlog.author)
                expect(resp.body.url).toBe(newBlog.url)
                expect(resp.body.likes).toBe(newBlog.likes)
            })

        // database
        const after = await blog.all()
        expect(after.length).toBe(1)
        expect(after[0].title).toBe(newBlog.title)
        expect(after[0].author).toBe(newBlog.author)
        expect(after[0].url).toBe(newBlog.url)
        expect(after[0].likes).toBe(newBlog.likes)
    })

    test('missing likes defaults to zero', async () => {
        const newBlog = { title: 'this', author: 'that', url: 'somewhere' }
        // post
        await api.post('/api/blogs')
            .send(newBlog)
            .set('Accept', 'application/json')
            .expect(201)

        // database
        const after = await blog.all()
        expect(after.length).toBe(1)
        expect(after[0].title).toBe(newBlog.title)
        expect(after[0].author).toBe(newBlog.author)
        expect(after[0].url).toBe(newBlog.url)
        expect(after[0].likes).toBe(0)
    })
})

describe('DELETE blog post', () => {
    test('delete one should succeed', async () => {
        const COUNT = await initialiseDB()
        const id = helpers.blogs[0]._id

        await api.delete(`/api/blogs/${id}`)
            .expect(200)

        const N = await blog.count()
        expect(N).toBe(COUNT-1)
    })

    test('delete one with invalid id should fail', async () => {
        const COUNT = await initialiseDB()

        await api.delete('/api/blogs/invalid_id')
            .expect(400)

        const N = await blog.count()
        expect(N).toBe(COUNT)

    })
})

describe('PUT blog post', () => {
    test('put a like should succeed', async () => {
        const COUNT = await initialiseDB()
        const first = helpers.blogs[0]
        const id = first._id

        await api.put(`/api/blogs/${id}`)
            .send({ likes: first.likes + 1 })
            .expect(200)

        const N = await blog.count()
        expect(N).toBe(COUNT)

        const after = await blog.get(id)
        expect(after.author).toBe(first.author)
        expect(after.title).toBe(first.title)
        expect(after.url).toBe(first.url)
        expect(after.likes).toBe(first.likes+1)
    })

    test('put invalid id should fail', async () => {
        const COUNT = await initialiseDB()

        await api.put('/api/blogs/invalid_id')
            .expect(400)

        const N = await blog.count()
        expect(N).toBe(COUNT)
    })
})

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
                expect(m).toEqual( {username: user.username, name: user.name, id: m.id} )
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
            })
    })
})

describe('POST users', () => {
    test('post a new user succeeds', async () => {
        const user = { username: 'felix', name: 'Felix the Magnificent', password: 'good123' }

        const N = await users.count()
        expect(N).toBe(0)

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

        const N = await users.count()
        expect(N).toBe(0)

        // post
        await api.post('/api/users')
            .send(user)
            .set('Accept', 'application/json')
            .expect(400)

        const after = await users.count()
        expect(after).toBe(0)
    })

    test('post a new user without name fails', async () => {
        const user = { username: 'felix', password: 'good123' }

        const N = await users.count()
        expect(N).toBe(0)

        // post
        await api.post('/api/users')
            .send(user)
            .set('Accept', 'application/json')
            .expect(400)

        const after = await users.count()
        expect(after).toBe(0)
    })

    test('post a new user without password fails', async () => {
        const user = { username: 'felix', name: 'Felix the Magnificent' }

        const N = await users.count()
        expect(N).toBe(0)

        // post
        await api.post('/api/users')
            .send(user)
            .set('Accept', 'application/json')
            .expect(400)

        const after = await users.count()
        expect(after).toBe(0)
    })
})


describe('get wrong endpoint', () => {
    test('get on an wrong endpoint returns an error', async () => {
        await api.get('/api')
            .expect(404)
    })
})

afterAll(() => {
    blog.disconnect()
})
