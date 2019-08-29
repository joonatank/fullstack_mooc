/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.1 - 5.3
 */
import React from 'react'
const Blog = ({ blog }) => (
    <div>
        {blog.title} {blog.author}
    </div>
)

export default Blog
