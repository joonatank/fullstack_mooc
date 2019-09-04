/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { createBlog } from '../reducers/blogReducer'
import { setFlash } from '../reducers/flashReducer'
import { hideNew } from '../reducers/uiReducer'

const NewBlogForm = (props) => {
    const [ title, setTitle ] = useState('')
    const [ author, setAuthor ] = useState('')
    const [ url, setUrl ] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        props.createBlog(props.user, { title, author, url }).then( res => {
            if (res) {
                setTitle('')
                setAuthor('')
                setUrl('')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create new blog link</h2>
            <div>
                title
                <input type='text' value={title} name='title'
                    onChange={ ({ target }) => setTitle(target.value) }
                />
            </div>
            <div>
                author
                <input type='text' value={author} name='author'
                    onChange={ ({ target }) => setAuthor(target.value) }
                />
            </div>
            <div>
                url
                <input type='text' value={url} name='url'
                    onChange={ ({ target }) => setUrl(target.value) }
                />
            </div>
            <button type='submit'>create</button>
            <button onClick={props.hideNew}>cancel</button>
        </form>
    )
}

const mapToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(
    mapToProps, { createBlog, setFlash, hideNew }
)(NewBlogForm)
