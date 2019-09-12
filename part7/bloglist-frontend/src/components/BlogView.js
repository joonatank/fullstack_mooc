/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7
 */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Table, Button } from 'semantic-ui-react'

import NewBlogForm from './NewBlogForm'

import { showNew } from '../reducers/uiReducer'

const BlogList = ({ blogs }) => (
    // TODO add a like button
    <Table striped celled>
        <Table.Body>
            { blogs.map(b =>
                <Table.Row key={b.id}>
                    <Table.Cell><Link to={`/blogs/${b.id}`}>{b.title}</Link></Table.Cell>
                    <Table.Cell>by {b.author}</Table.Cell>
                    <Table.Cell>{b.likes} likes</Table.Cell>
                    <Table.Cell>{b.comments.length} comments</Table.Cell>
                </Table.Row>
            )
            }
        </Table.Body>
    </Table>
)

const BlogView = (props) => (
    <div>
        { props.ui.newVisible && <NewBlogForm /> }
        { !props.ui.newVisible  &&
                <Button id='createNewButton' onClick={props.showNew}>create new</Button>
        }
        <BlogList blogs={props.blogs}/>
    </div>
)

BlogView.propTypes = {
    blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
    ui: PropTypes.object.isRequired,
    showNew: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs,
        ui: state.ui,
    }
}

export default connect(
    mapStateToProps, { showNew }
)(BlogView)
