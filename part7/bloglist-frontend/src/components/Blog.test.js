/* Joonatan Kuosa
 * 2019-09-12
 *
 * Compenent tests for Blog
 * Bypasses Redux and Router and only test the component.
 */
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Label } from 'semantic-ui-react'

import { Blog } from './Blog'

Enzyme.configure({ adapter: new Adapter() })

const blog = {
    title: 'Blaa',
    author: 'felix',
    url: 'http://nowhere.not',
    likes: 5,
    comments: [],
    // TODO testing with and without comments
    user: { username: 'gool', name: 'Gool Folly' }
}

const currentUser = {
    username: 'foo',
    name: 'Foo Bar'
}

const setup = (user = currentUser) => {
    const props = {
        blog: blog,
        user: user,
        changeBlogPost: jest.fn(),
        deleteBlogPost: jest.fn(),
        addComment: jest.fn(),
        history: { push: jest.fn() }
    }

    const wrapper = shallow(<Blog { ...props } />)

    return { props, wrapper }
}


describe('Blog', () => {

    it('renders the blog', () => {
        const { wrapper } = setup()

        expect(wrapper.find('h2').text()).toMatch(/Blaa/)
        expect(wrapper.find('h2').text()).toMatch(/felix/)

        const link = wrapper.find('Link').props()
        expect(link.to).toBe(blog.url)

        // check that we have the 'added by {user}'
        // not a fan of the way to do this check, I don't care in which component it is
        // I just wanna know the text is there (but too hard to test cleanly)
        expect(wrapper.find('Label')
            .containsMatchingElement(
                <Label>added by {blog.user.name}</Label>)
        ).toBe(true)

        // Likes
        expect(wrapper.find('Label#likes').contains(5)).toBe(true)

        // Comment section
        expect(wrapper.find('#comments').find('Header').contains('Comments')).toBe(true)
        // No comments
        expect(wrapper.find('#comments').contains('<Comment>')).toBe(false)

        // Negative tests: doesn't contain the logged in user
        expect(wrapper.contains(currentUser.name)).toBe(false)
        expect(wrapper.contains(currentUser.username)).toBe(false)
    })

    // Test button clicks
    const mockEvt = { preventDefault: () => {}, stopPropagation: () => {} }

    it('like button works', () => {
        const { props, wrapper } = setup()

        const like = wrapper.find('#like')

        expect(props.changeBlogPost.mock.calls.length).toBe(0)
        like.find('Button').simulate('click', mockEvt)
        expect(props.changeBlogPost.mock.calls.length).toBe(1)
    })

    it('no delete button for other users', () => {
        const { wrapper } = setup()

        expect(wrapper.find('#delete').exists()).toBe(false)
    })

    it('delete button works for owner', () => {
        const { props, wrapper } = setup(blog.user)
        const del = wrapper.find('#delete')
        const delBtn = del.find('Button')
        expect(del.exists()).toBe(true)
        expect(delBtn.exists()).toBe(true)

        expect(props.deleteBlogPost.mock.calls.length).toBe(0)
        delBtn.simulate('click', mockEvt)
        expect(props.deleteBlogPost.mock.calls.length).toBe(0)
        // confirm delete
        del.find('Confirm').props().onConfirm()
        expect(props.deleteBlogPost.mock.calls.length).toBe(1)
    })

    // TODO should have a test for adding comments
    // and check that they are shown properly
})
