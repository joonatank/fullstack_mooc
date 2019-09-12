/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.1 - 4.21
 */
const Blog = require('../models/blog')

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

const users = [
    { username: 'felix', name: 'Felix the Magnificent', password: 'good123' },
    { username: 'not-felix', name: 'Not Felix', password: 'good123' },
    { username: 'feline', name: 'Felix not the Magnificent', password: 'good123' },
    { username: 'cat', name: 'Felix the Less Magnificent', password: 'good123' },
    { username: 'rat', name: 'Rat', password: 'good123' },
    { username: 'dog', name: 'Wunder Hund', password: 'good123' },
    { username: 'wolf', name: 'Nobody dares to name this one', password: 'good123' }
]

const initialiseDB = async (user, blogsList) => {
    if (!user) {
        throw 'can\'t initialise database without a user'
    }
    const blog_list = blogsList ? blogsList : blogs

    const COUNT = blog_list.length
    await Promise.all(
        blog_list
            .map(b => {
                const blog = new Blog.Blog({ ...b, user: user._id })
                user.blogs = user.blogs.concat(blog._id)
                return blog.save().then(async res => res)
            })
    )

    await user.save()

    return COUNT
}

module.exports = { blogs, users, initialiseDB }
