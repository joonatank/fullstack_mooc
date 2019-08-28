/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.8 - 4.9
 */

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const blog = require('../models/blog')

const helpers = require('./test_helpers')

beforeEach(async () => {
    await blog.deleteAll();
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

        const b = await blog.all()
        expect(b.length).toBe(N_BLOGS)

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
        const N_BLOGS = helpers.blogs.length
        await Promise.all(
            helpers.blogs
                .map(b => blog.save(b))
        )

        // check that the database is working first
        const b = await blog.all()
        expect(b.length).toBe(N_BLOGS)

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
        const after  = await blog.all()
        expect(after.length).toBe(0)
    })

    test('empty post will succeed', async () => {
        // post
        await api.post('/api/blogs')
            .set('Accept', 'application/json')
            .expect(201)
            .expect('Content-Type', /json/)
            .then(resp => {
                expect(resp.body.id).toBeDefined()
                expect(resp.body.title).not.toBeDefined()
            })

        // database
        const after  = await blog.all()
        expect(after.length).toBe(1)
        expect(after[0].title).not.toBeDefined()
        expect(after[0].author).not.toBeDefined()
        expect(after[0].url).not.toBeDefined()
        expect(after[0].likes).not.toBeDefined()
    })

    test('one good post is found after', async () => {
        const newBlog = { title: 'this', author: 'that', url: 'somewhere', likes: 0 }

        const before = await blog.all()
        expect(before.length).toBe(0)

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
        const after  = await blog.all()
        expect(after.length).toBe(1)
        expect(after[0].title).toBe(newBlog.title)
        expect(after[0].author).toBe(newBlog.author)
        expect(after[0].url).toBe(newBlog.url)
        expect(after[0].likes).toBe(newBlog.likes)
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
