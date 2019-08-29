import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

const blog = {
    title: 'Blaa',
    author: 'felix',
    url: 'http://nowhere.not',
    likes: 5
}

test('renders content', () => {

    const component = render(
        <SimpleBlog blog={blog} />
    )

    expect(component.container).toHaveTextContent( 'Blaa' )
    expect(component.container).toHaveTextContent( 'felix' )
    expect(component.container).toHaveTextContent( 'has 5' )
    expect(component.container).not.toHaveTextContent( blog.url )
})

test('clicking likes', () => {
    const mockHandler = jest.fn()

    const { getByText } = render(
        <SimpleBlog blog={blog} onClick={mockHandler} />
    )

    const button = getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls.length).toBe(2)
})
