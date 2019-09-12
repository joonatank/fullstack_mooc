/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.12
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

import { Container, Button, Icon, Label, Input, Comment, Header, Divider, Confirm }
    from 'semantic-ui-react'

import { changeBlogPost, deleteBlogPost, addComment } from '../reducers/blogReducer'
import { useField } from '../hooks'

export const Blog = (props) => {
    const comment = useField('text')
    const [ confirmDelete, setConfirmDelete ] = useState(false)

    if (props.blog === undefined) {
        return null
    }

    const handleLikeButton = (event, blog) => {
        event.preventDefault()
        event.stopPropagation()

        const params = { likes: blog.likes+1 }
        props.changeBlogPost(props.user, blog, params)
    }

    const handleConfirmCancel = () => setConfirmDelete(false)

    const handleRemoveButton = (event) => {
        event.preventDefault()
        event.stopPropagation()

        setConfirmDelete(true)
    }

    const deleteConfirmed = (blog) => props.deleteBlogPost(props.user, blog)

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

    // TODO add color to blog.author (maybe italics too)
    // or move it to the right (or somewhat)
    return (
        <Container>
            {username === props.user.username &&
                <div id='delete'>
                    <Button floated='right' color='red'
                        onClick={handleRemoveButton}>Delete
                    </Button>
                    <Confirm
                        open={confirmDelete}
                        onCancel={handleConfirmCancel}
                        onConfirm={() => deleteConfirmed(blog)}
                    />
                </div>
            }

            <h2>{blog.title} <small>by</small> <em>{blog.author}</em></h2>
            <p><Link to={blog.url}>{blog.url}</Link></p>

            <Button as='div' labelPosition='right'>
                <Button id='like' color='red' onClick={(e) => handleLikeButton(e, blog)}>
                    <Icon name='heart' />
                    Like
                </Button>
                <Label id='likes' as='a' basic pointing='left'>
                    {blog.likes}
                </Label>
            </Button>

            <Label>added by {name}</Label>
            <Comment.Group id="comments">
                <Header as="h3" dividing>Comments</Header>
                {blog.comments.map(x =>
                    <Comment key={x}>
                        <Comment.Content>
                            <Comment.Text><p>{x}</p></Comment.Text>
                        </Comment.Content>
                    </Comment>
                )}
                <Divider />
                <Input {...comment} reset='' />
                <Button onClick={handleCommentButton} content='Add Comment' icon='edit' primary />
            </Comment.Group>

        </Container>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    changeBlogPost: PropTypes.func.isRequired,
    deleteBlogPost: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(
    mapStateToProps, { deleteBlogPost, changeBlogPost, addComment }
)(Blog)
