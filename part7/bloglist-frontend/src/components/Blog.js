/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.12
 */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { changeBlogPost, deleteBlogPost, addComment } from '../reducers/blogReducer'
import { useField } from '../hooks'

const Blog = (props) => {
    const comment = useField('text')

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    if (props.blog === undefined) {
        return null
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

    const handleCommentButton = (event) => {
        event.preventDefault()
        event.stopPropagation()

        props.addComment(props.user, blog, comment.value)
        comment.reset()
    }

    // Handle posts without users (compatibility reasons)
    const blog = props.blog
    const name = blog.user ? blog.user.name : 'unknown'
    const username = blog.user ? blog.user.username : 'unknown'

    return (
        <div style={blogStyle}>
            { props.expanded &&
                <div>
                    <h2>{blog.title} by {blog.author}</h2>
                    <Link to={blog.url}>{blog.url}</Link>
                    <p>{blog.likes} likes
                        <button onClick={(e) => handleLikeButton(e, blog)}>like</button>
                    </p>
                    <p>added by {name}</p>
                    {username === props.user.username &&
                        <button onClick={(e) => handleRemoveButton(e, blog)}>remove</button>
                    }
                    <h3>comments</h3>
                    <input {...comment} reset='' /> <button onClick={handleCommentButton}>add comment</button>
                    <ul>
                        {blog.comments.map(x => <li key={x}>{x}</li>)}
                    </ul>
                </div>
            }
            { !props.expanded &&
                    <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(
    mapStateToProps, { deleteBlogPost, changeBlogPost, addComment }
)(Blog)
