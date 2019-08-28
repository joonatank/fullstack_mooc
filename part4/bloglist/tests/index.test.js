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

const initialiseDB = (async (user) => {
    const COUNT = helpers.blogs.length
    const nb = await Promise.all(
        helpers.blogs
            .map(b => blog.save(b, user ? user._id : null))
    )
    // update the user
    if (user) {
        await Promise.all(
            nb.map(b => user.blogs = user.blogs.concat(b))
        )
        await user.save()
    }

    // check that the database is working first
    const N = await blog.count()
    expect(N).toBe(COUNT)

    return COUNT
})

// Needed for blog tests, but don't want it for user tests
const createTestUser = async () => {
    const user = { username: 'test', name: 'Felix the Magnificent', password: 'good123' }
    return await users.create(user)
}

describe('GET blog', () => {
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

    test('if post has a user it is populated', async () => {
        const user = await createTestUser()
        users.count().then(c => expect(c).toBe(1))

        const newBlog = { title: 'this', author: 'that', url: 'somewhere', likes: 0 }
        await blog.save(newBlog, user._id)

        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(1)

                const refUser = { username: user.username, name: user.name, id: user._id.toString() }
                expect(resp.body[0].user).toEqual(refUser)
            })
    })
})

describe('POST blog', () => {
    test('bad post endpoint will return 404', async () => {
        await api.post('/api')
            .set('Accept', 'application/json')
            .expect(404)

        // database
        const N = await blog.count()
        expect(N).toBe(0)
    })

    const post_blog_fail = async (newBlog) => {
        return await api.post('/api/blogs')
            .send(newBlog)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
    }

    test('empty post will fail with 400', async () => {
        post_blog_fail({})

        // database
        const N = await blog.count()
        expect(N).toBe(0)
    })

    test('post without author will fail with 400', async () => {
        const newBlog = { title: 'this', url: 'somewhere', likes: 0 }

        post_blog_fail(newBlog)

        // database
        const N = await blog.count()
        expect(N).toBe(0)
    })

    test('post without url will fail with 400', async () => {
        const newBlog = { title: 'this', author: 'that', likes: 0 }

        post_blog_fail(newBlog)

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

    test('if we have a user then the post is linked to her', async () => {
        const user = await createTestUser()
        users.count().then(c => expect(c).toBe(1))

        const newBlog = { title: 'this', author: 'that', url: 'somewhere', likes: 0 }
        // post
        await api.post('/api/blogs')
            .send(newBlog)
            .set('Accept', 'application/json')
            .expect(201)

        const after = await blog.all()
        expect(after.length).toBe(1)
        expect(after[0].user.toString()).toBe(user._id.toString())
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
                expect(m).toEqual( {username: user.username, name: user.name, id: m.id, blogs: [] } )
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
        userObj = await users.create(user)

        // create all six blog posts with the single user
        await initialiseDB(userObj)

        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(1)
                const m = resp.body[0]
                expect(m.blogs.length).toBe(6)

                b = m.blogs[0]
                a = helpers.blogs[0]
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


describe('get wrong endpoint', () => {
    test('get on an wrong endpoint returns an error', async () => {
        await api.get('/api')
            .expect(404)
    })
})

afterAll(() => {
    blog.disconnect()
})
