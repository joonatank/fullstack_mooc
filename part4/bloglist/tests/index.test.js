/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.8
 */

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const blog = require('../models/blog')

const helpers = require('./test_helpers')

beforeEach(async () => {
    await blog.deleteAll();
})

describe('get list', () => {
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

describe('get wrong endpoint', () => {
    test('get on an wrong endpoint returns an error', async () => {
        await api.get('/api')
            .expect(404)
    })
})

afterAll(() => {
    blog.disconnect()
})
