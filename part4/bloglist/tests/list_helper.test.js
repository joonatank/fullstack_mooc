/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.3 - 4.6
 */
const listHelper = require('../utils/list_helper')
const helpers = require('./test_helpers')

const singleBlog = [ {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
} ]

describe('total likes', () => {

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(singleBlog)
        expect(result).toBe(5)
    })

    test('full list has combined likes from all blogs', () => {
        const result = listHelper.totalLikes(helpers.blogs)
        expect(result).toBe(36)
    })

    test('empty list has no likes', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })
})


describe('favorite blog', () => {
    test('list with one blog will return that blog', () => {
        const result = listHelper.favoriteBlog(singleBlog)
        expect(result).toEqual(singleBlog[0])
    })

    test('list with no blogs will return empty', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toEqual({})
    })

    test('full list will return the one with highest likes', () => {
        const result = listHelper.favoriteBlog(helpers.blogs)
        expect(result._id).toEqual('5a422b3a1b54a676234d17f9')
    })
})

describe('most blogs', () => {
    test('list with one blog will return that author', () => {
        const result = listHelper.mostBlogs(singleBlog)
        expect(result).toEqual( { author: 'Edsger W. Dijkstra', blogs: 1 } )
    })

    test('list with no blogs will return empty', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toEqual( { author: '', blogs: 0 } )
    })

    test('list with one blog will return that author', () => {
        const result = listHelper.mostBlogs(helpers.blogs)
        expect(result).toEqual( { author: 'Robert C. Martin', blogs: 3 })
    })
})

describe('most likes', () => {
    test('list with one blog will return that author', () => {
        const result = listHelper.mostLikes(singleBlog)
        expect(result).toEqual( { author: 'Edsger W. Dijkstra', likes: 5 } )

    })

    test('list with no blogs will return empty', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual( { author: '', likes: 0 } )
    })

    test('list with one blog will return that author', () => {
        const result = listHelper.mostLikes(helpers.blogs)
        expect(result).toEqual( { author: 'Edsger W. Dijkstra', likes: 17 } )
    })
})
