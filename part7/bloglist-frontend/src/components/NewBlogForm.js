/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Form, Button, Label } from 'semantic-ui-react'

import { createBlog } from '../reducers/blogReducer'
import { setFlash } from '../reducers/flashReducer'
import { hideNew } from '../reducers/uiReducer'

const NewBlogForm = (props) => {
    const [ title, setTitle ] = useState('')
    const [ author, setAuthor ] = useState('')
    const [ url, setUrl ] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (title === '') {
            props.setFlash('Can\'t add a blog without Title', 'error')
        }
        else if (author === '') {
            props.setFlash('Can\'t add a blog without Author', 'error')
        }
        else if (url === '') {
            props.setFlash('Can\'t add a blog without URL', 'error')
        }
        else {
            props.createBlog(props.user, { title, author, url }).then( res => {
                if (res) {
                    setTitle('')
                    setAuthor('')
                    setUrl('')
                }
            })
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Create new blog link</h2>
            <Form.Field>
                title
                <input type='text' value={title} name='title'
                    onChange={ ({ target }) => setTitle(target.value) }
                />
                {title === '' &&
                    <Label basic color="red" pointing>
                        Please add title
                    </Label>
                }
            </Form.Field>
            <Form.Field>
                author
                <input type='text' value={author} name='author'
                    onChange={ ({ target }) => setAuthor(target.value) }
                />
                {author === '' &&
                    <Label basic color="red" pointing>
                        Please add author
                    </Label>
                }
            </Form.Field>
            <Form.Field>
                url
                <input type='text' value={url} name='url'
                    onChange={ ({ target }) => setUrl(target.value) }
                />
                {url === '' &&
                    <Label basic color="red" pointing>
                        Please add url
                    </Label>
                }
            </Form.Field>
            <Button positive type='submit'>Save</Button>
            <Button onClick={props.hideNew}>Cancel</Button>
        </Form>
    )
}

NewBlogForm.propTypes = {
    setFlash: PropTypes.func.isRequired,
    hideNew: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
}

const mapToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(
    mapToProps, { createBlog, setFlash, hideNew }
)(NewBlogForm)
