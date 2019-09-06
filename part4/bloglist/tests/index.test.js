/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.21
 */

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blogs = require('../models/blog')
const Users = require('../models/user')

const helpers = require('./test_helpers')

beforeEach(async () => {
    await Blogs.deleteAll()
    await Users.deleteAll()
})

afterAll(async () => {
    // TODO this should be in the app
    await Blogs.disconnect()
})

const assert_blog_count = async (n) => {
    return expect(Blogs.count()).resolves.toEqual(n)
}

const post_login = async (opts) => {
    return await api.post('/api/login')
        .send({ username: opts.username, password: opts.password })
        .set('Accept', 'application/json')
        .expect(200)
        .then(r => r.body.token)
}


const USER_PASSWORD = 'good123'
const USER_NAME = 'test'
const createTestUser = async () => {
    const user = { username: USER_NAME, name: 'Test the Magnificent', password: USER_PASSWORD }
    return await Users.create(user)
}

const create_multiple_users = async () => {
    return await Promise.all(
        helpers.users.map(u => Users.create(u))
    )
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
        const user = await createTestUser()
        const BLOG = helpers.blogs[0]
        const N_BLOGS = await helpers.initialiseDB(user, [BLOG])

        await assert_blog_count(N_BLOGS)

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
        const user = await createTestUser()
        const N_BLOGS = await helpers.initialiseDB(user)

        // check the same with a get
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(resp => {
                expect(resp.body.length).toBe(N_BLOGS)
            })
    })

    test('get a post with a user populated', async () => {
        const user = await createTestUser()
        const c = await Users.count()
        expect(c).toBe(1)

        const newBlog = { title: 'this', author: 'that', url: 'somewhere', likes: 0 }
        await Blogs.save(newBlog, user)

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

        await assert_blog_count(0)
    })


    const post_blog_fail = async (token, newBlog) => {
        return await api.post('/api/blogs')
            .send(newBlog)
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
    }

    test('post without token will fail with 401', async () => {
        const newBlog = { title: 'this', author: 'that', url: 'somewhere', likes: 0 }

        await assert_blog_count(0)

        await api.post('/api/blogs')
            .send(newBlog)
            .set('Accept', 'application/json')
            .expect(401)
            .then(r => expect(r.body.error).toBe('token missing or invalid'))

        await assert_blog_count(0)
    })

    // Need tokens for all the following tests
    // have to do a login request since we don't have a Session type
    test('empty post will fail with 400', async () => {
        const user = await createTestUser()
        const token = await post_login({ username: user.username, password: USER_PASSWORD })

        await post_blog_fail(token, {})

        await assert_blog_count(0)
    })

    test('post without author will fail with 400', async () => {
        const user = await createTestUser()
        const token = await post_login({ username: user.username, password: USER_PASSWORD })

        const newBlog = { title: 'this', url: 'somewhere', likes: 0 }

        await post_blog_fail(token, newBlog)

        await assert_blog_count(0)
    })

    test('post without url will fail with 400', async () => {
        const user = await createTestUser()
        const token = await post_login({ username: user.username, password: USER_PASSWORD })

        const newBlog = { title: 'this', author: 'that', likes: 0 }

        await post_blog_fail(token, newBlog)

        await assert_blog_count(0)
    })

    test('one good post is found after', async () => {
        const user = await createTestUser()
        const token = await post_login({ username: user.username, password: USER_PASSWORD })

        const newBlog = { title: 'this', author: 'that', url: 'somewhere', likes: 0 }

        await assert_blog_count(0)

        // post
        await api.post('/api/blogs')
            .send(newBlog)
            .set({ 'Authorization': 'bearer '.concat(token) })
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
        const after = await Blogs.all()
        expect(after.length).toBe(1)
        expect(after[0].title).toBe(newBlog.title)
        expect(after[0].author).toBe(newBlog.author)
        expect(after[0].url).toBe(newBlog.url)
        expect(after[0].likes).toBe(newBlog.likes)
    })

    test('missing likes defaults to zero', async () => {
        const user = await createTestUser()
        const token = await post_login({ username: user.username, password: USER_PASSWORD })

        const newBlog = { title: 'this', author: 'that', url: 'somewhere' }

        await api.post('/api/blogs')
            .send(newBlog)
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(201)

        // database
        const after = await Blogs.all()
        expect(after.length).toBe(1)
        expect(after[0].title).toBe(newBlog.title)
        expect(after[0].author).toBe(newBlog.author)
        expect(after[0].url).toBe(newBlog.url)
        expect(after[0].likes).toBe(0)
    })
})

describe('POST a comment', () => {
    test('post a comment without login should fail with 401', async () => {
        const user = await createTestUser()
        const COUNT = await helpers.initialiseDB(user)
        const id = helpers.blogs[0]._id
        const comment = 'Very nice comment.'

        await api.post(`/api/blogs/${id}/comments`)
            .send(comment)
            .set('Accept', 'application/json')
            .expect(401)
    })

    test('post a comment if logged should succeed', async () => {
        const user = await createTestUser()
        const COUNT = await helpers.initialiseDB(user)
        const id = helpers.blogs[0]._id
        const comment = 'Very nice comment.'

        const token = await post_login({ username: USER_NAME, password: USER_PASSWORD })

        await api.post(`/api/blogs/${id}/comments`)
            .send({ comment: comment })
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(201)

        const after = await Blogs.get(id).lean()
        expect(after.comments).toEqual([comment])
    })

    test('post a comment with a different user should succeed', async () => {
        const user = await createTestUser()
        const more_users = await create_multiple_users()
        const blog_user = more_users[0]
        const COUNT = await helpers.initialiseDB(blog_user)

        const id = helpers.blogs[0]._id
        const comment = 'Very nice comment.'

        const token = await post_login({ username: USER_NAME, password: USER_PASSWORD })

        await api.post(`/api/blogs/${id}/comments`)
            .send({ comment: comment })
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(201)

        const after = await Blogs.get(id).lean()
        expect(after.comments).toEqual([comment])
    })

    test('post an empty comment if logged should fail with 400', async () => {
        const user = await createTestUser()
        const COUNT = await helpers.initialiseDB(user)
        const id = helpers.blogs[0]._id
        const comment = ''

        const token = await post_login({ username: USER_NAME, password: USER_PASSWORD })

        await api.post(`/api/blogs/${id}/comments`)
            .send({ comment: comment })
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(400)

        await api.post(`/api/blogs/${id}/comments`)
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(400)

        const after = await Blogs.get(id).lean()
        expect(after.comments.length).toBe(0)
    })

    test('post multiple comments should succeed', async () => {
        const user = await createTestUser()
        const COUNT = await helpers.initialiseDB(user)
        const id = helpers.blogs[0]._id
        const comments = [...Array(2).keys()].map(x => `${x} Very nice comment.`)

        const token = await post_login({ username: USER_NAME, password: USER_PASSWORD })

        // Too hard to put this into a loop
        await api.post(`/api/blogs/${id}/comments`)
                .send({ comment: comments[0] })
                .set({ 'Authorization': 'bearer '.concat(token) })
                .set('Accept', 'application/json')
                .expect(201)

        await api.post(`/api/blogs/${id}/comments`)
                .send({ comment: comments[1] })
                .set({ 'Authorization': 'bearer '.concat(token) })
                .set('Accept', 'application/json')
                .expect(201)

        const after = await Blogs.get(id).lean()
        expect(after.comments.length).toBe(comments.length)
        // TODO check content (use sort to arrays and compare)
    })
})

describe('DELETE blog post', () => {
    test('delete one when not logged in should fail with 401', async () => {
        const user = await createTestUser()
        const COUNT = await helpers.initialiseDB(user)
        const id = helpers.blogs[0]._id

        // No token set will fail
        await api.delete(`/api/blogs/${id}`)
            .expect(401)

        await assert_blog_count(COUNT)
    })

    test('delete one when logged in should succeed', async () => {
        const user = await createTestUser()
        const token = await post_login({ username: user.username, password: USER_PASSWORD })

        const COUNT = await helpers.initialiseDB(user)
        const blog_id = helpers.blogs[0]._id

        await api.delete(`/api/blogs/${blog_id}`)
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(200)

        await assert_blog_count(COUNT-1)
    })

    test('delete one with different user should fail with 403', async () => {
        const invalid_user = await createTestUser()
        const more_users = await create_multiple_users()
        const blog_user = more_users[0]

        const COUNT = await helpers.initialiseDB(blog_user)
        const blog_id = helpers.blogs[0]._id

        await assert_blog_count(COUNT)

        // login different user
        const token = await post_login({ username: invalid_user.username, password: USER_PASSWORD })

        await api.delete(`/api/blogs/${blog_id}`)
            .set({ 'Authorization': 'bearer '.concat(token) })
            .set('Accept', 'application/json')
            .expect(403)

        await assert_blog_count(COUNT)
    })

    test('delete one with invalid id should fail with 400', async () => {
        const user = await createTestUser()
        const COUNT = await helpers.initialiseDB(user)

        const token = await post_login({ username: user.username, password: USER_PASSWORD })

        await api.delete('/api/blogs/invalid_id')
            .set({ 'Authorization': 'bearer '.concat(token) })
            .expect(400)

        await assert_blog_count(COUNT)
    })
})

describe('PUT blog post', () => {
    beforeEach(async () => {
        user = await createTestUser()
        this.COUNT = await helpers.initialiseDB(user)
    })

    test('put a like should succeed when logged in', async () => {
        expect.assertions(6)

        const first = helpers.blogs[0]
        const id = first._id

        const token = await post_login({ username: USER_NAME, password: USER_PASSWORD })

        await api.put(`/api/blogs/${id}`)
            .send({ likes: first.likes + 1 })
            .set({ 'Authorization': 'bearer '.concat(token) })
            .expect(200)

        await assert_blog_count(this.COUNT)

        const after = await Blogs.get(id)
        expect(after.author).toBe(first.author)
        expect(after.title).toBe(first.title)
        expect(after.url).toBe(first.url)
        expect(after.likes).toBe(first.likes+1)
    })

    test('put a like should fail when not logged in with 401', async () => {
        expect.assertions(2)

        const first = helpers.blogs[0]

        await api.put(`/api/blogs/${first._id}`)
            .send({ likes: first.likes + 1 })
            .expect(401)

        await assert_blog_count(this.COUNT)
    })

    test('put invalid id should fail', async () => {
        expect.assertions(2)

        const token = await post_login({ username: USER_NAME, password: USER_PASSWORD })

        await api.put('/api/blogs/invalid_id')
            .set({ 'Authorization': 'bearer '.concat(token) })
            .expect(400)

        await assert_blog_count(this.COUNT)
    })
})


describe('get wrong endpoint', () => {
    test('get on an wrong endpoint returns an error', async () => {
        await api.get('/api')
            .expect(404)
    })
})
