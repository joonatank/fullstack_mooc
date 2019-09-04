import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Blog from './Blog'

// TODO move to auto ran
afterEach(cleanup)

// TODO add user
const blog = {
    title: 'Blaa',
    author: 'felix',
    url: 'http://nowhere.not',
    likes: 5,
    user: { username: 'gool', name: 'Gool Folly' }
}

const currentUser = {
    username: 'foo',
    name: 'Foo Bar'
}

test('renders content', () => {

    const mockHandler = jest.fn()
    const component = render(
        <Blog blog={blog} user={currentUser} blogChangedCb={mockHandler} />
    )

    expect(component.container).toHaveTextContent( blog.title )
    expect(component.container).toHaveTextContent( blog.author )
    expect(component.container).not.toHaveTextContent( '5' )
    expect(component.container).not.toHaveTextContent( blog.url )
    expect(component.container).not.toHaveTextContent( blog.user.username )
    expect(component.container).not.toHaveTextContent( blog.user.name )
    // TODO check that we don't show extra info: url, user, likes : by default
})

test('renders expanded content', () => {

    const mockHandler = jest.fn()
    const component = render(
        <Blog blog={blog} user={currentUser} blogChangedCb={mockHandler} />
    )
    const b = component.container.querySelector('div')
    fireEvent.click(b)

    expect(component.container).toHaveTextContent( blog.title )
    expect(component.container).toHaveTextContent( blog.author )
    expect(component.container).toHaveTextContent( '5' )
    expect(component.container).toHaveTextContent( blog.url )
    expect(component.container).toHaveTextContent( blog.user.name )
    expect(component.container).not.toHaveTextContent( blog.username )

    expect(mockHandler.mock.calls.length).toBe(0)

    // TEST the like callback
    const like = component.getByText('like')
    fireEvent.click(like)
    fireEvent.click(like)
    expect(mockHandler.mock.calls.length).toBe(2)

    // TODO how to search for all buttons?
    expect(component.container).not.toHaveTextContent( 'delete' )
})

// TODO test that callback receives correct data
//      blog, {changes}

/* TODO test delete button (need same user and creator)
const del = component.getByText('delete')
fireEvent.click(del)
expect(mockHandler.mock.calls.length).toBe(2)
*/
