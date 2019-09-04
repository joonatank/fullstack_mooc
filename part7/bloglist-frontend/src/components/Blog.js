/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { changeBlogPost, deleteBlogPost } from '../reducers/blogReducer'

// This assumes that the usernames are unique since we don't have ids here
const Blog = (props) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const [ expand, setExpand ] = useState(false)

    const handleBlogClick = () => {
        setExpand(!expand)
    }

    const handleLikeButton = (event, blog) => {
        event.preventDefault()
        event.stopPropagation()

        const params = { likes: blog.likes+1 }
        props.changeBlogPost(props.user, blog, params)
    }

    const handleRemoveButton = (event, blog) => {
        event.preventDefault()
        event.stopPropagation()

        props.deleteBlogPost(props.user, blog)
    }

    // Handle posts without users (compatibility reasons)
    const blog = props.blog
    const name = blog.user ? blog.user.name : 'unknown'
    const username = blog.user ? blog.user.username : 'unknown'

    return (
        <div style={blogStyle} onClick={handleBlogClick}>
            { expand &&
                <div>
                    <p>{blog.title} by {blog.author}</p>
                    <p>{blog.url}</p>
                    <p>{blog.likes} likes <button onClick={(e) => handleLikeButton(e, blog)}>like</button></p>
                    <p>added by {name}</p>
                    {username === props.user.username &&
                        <button onClick={(e) => handleRemoveButton(e, blog)}>remove</button>
                    }
                </div>
            }
            { !expand && <p>{blog.title} by {blog.author}</p> }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(
    mapStateToProps, { deleteBlogPost, changeBlogPost }
)(Blog)
