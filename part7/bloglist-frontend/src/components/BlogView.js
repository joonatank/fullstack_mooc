import React from 'react'
import { connect } from 'react-redux'

import Blog from './Blog'
import NewBlogForm from './NewBlogForm'

import { showNew } from '../reducers/uiReducer'

const BlogList = ({ blogs }) => (
    <div>
        { blogs.map(b => <Blog key={b.id} blog={b} />) }
    </div>
)

const BlogView = (props) => (
    <div>
        { props.ui.newVisible && <NewBlogForm /> }
        { !props.ui.newVisible  && <button onClick={props.showNew}>create new</button> }
        <BlogList blogs={props.blogs}/>
    </div>
)

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs,
        ui: state.ui,
    }
}

export default connect(
    mapStateToProps, { showNew }
)(BlogView)
