/*  Joonatan Kuosa
 *  2019-08-28
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 4.3 - 4.6
 */

/// Find the blog with the most likes
const totalLikes = (blogs) => {
    return blogs.reduce((acc, x) => acc + x.likes, 0)
}

/// Find the blog with the most likes
const favoriteBlog = (blogs) => {
    const index = blogs.reduce((acc, x, i, arr) => arr[acc].likes < x.likes ? i : acc, 0)
    return blogs.length > 0 ? blogs[index] : {}
}

/// Find an author with the most posts
const mostBlogs = (blogs) => {
    // author map
    const authors = blogs.reduce((acc, x, i, arr) => {
        const val = acc.has(x.author) ? acc.get(x.author) : 0
        acc.set(x.author, val+1)
        return acc
        }, new Map()
        )

    // highest number of blogs
    const max = [...authors].reduce((acc, x) => acc[1] < x[1] ? x : acc, ['', 0])
    return { author: max[0], blogs: max[1] }
}

/// Find an author with the most posts
const mostLikes = (blogs) => {
    // author map
    const authors = blogs.reduce((acc, x, i, arr) => {
        const val = acc.has(x.author) ? acc.get(x.author) : 0
        acc.set(x.author, val + x.likes)
        return acc
        }, new Map()
        )

    // highest number of blogs
    const max = [...authors].reduce((acc, x) => acc[1] < x[1] ? x : acc, ['', 0])
    return { author: max[0], likes: max[1] }
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
