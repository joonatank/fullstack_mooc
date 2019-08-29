/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.1 - 5.6
 */
import React, { useState } from 'react'

const Blog = ({ blog, blogChangedCb }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const [expand, setExpand] = useState(false)

    const handleBlogClick = () => {
        setExpand(!expand)
    }

    const handleLikeButton = (event, blog) => {
        event.preventDefault()
        event.stopPropagation()

        blogChangedCb(blog, { likes: blog.likes+1 })
    }

    const handleRemoveButton = (event, blog) => {
        event.preventDefault()
        event.stopPropagation()

        blogChangedCb(blog, null)
    }

    const name = blog.user ? blog.user.name : 'unknown'

    return (
    <div style={blogStyle} onClick={handleBlogClick}>
        { expand &&
            <div>
            <p>{blog.title} by {blog.author}</p>
            <p>{blog.url}</p>
            <p>{blog.likes} likes <button onClick={(e) => handleLikeButton(e, blog)}>like</button></p>
            <p>added by {name}</p>
            <button onClick={(e) => handleRemoveButton(e, blog)}>remove</button>
            </div>
        }
        { !expand && <p>{blog.title} by {blog.author}</p> }
    </div>
    )
}

export default Blog
