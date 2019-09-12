/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.16 - 5.17
 */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitForElement } from '@testing-library/react'

jest.mock('./service')
import App from './App'

import service from './__mocks__/service'

// TODO move to auto ran
afterEach(cleanup)

let savedItems = {}

const localStorageMock = {
    setItem: (key, item) => {
        savedItems[key] = item
    },
    getItem: (key) => savedItems[key],
    clear: () => savedItems = {}
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('<App />', () => {
    test('if no user is logged in, blogs are not rendered', async () => {
        const comp = render( <App /> )

        // login is present
        const login = await waitForElement(() => comp.getByText('login'))
        expect(login).toBeDefined()
        expect(comp.container).toHaveTextContent('username')
        expect(comp.container).toHaveTextContent('password')

        // blogs isn't present
        expect(comp.container).not.toHaveTextContent('blogs')
        // unroll to test that individual blogs aren't avail
        service.data.map(x => {
            expect(comp.container).not.toHaveTextContent(x.title)
            expect(comp.container).not.toHaveTextContent(x.author)
            expect(comp.container).not.toHaveTextContent(x.id)
            expect(comp.container).not.toHaveTextContent(x.url)
        })
    })

    test('if user is logged in, blogs are rendered', async () => {
        const user = {
            username: 'tester',
            token: '11111111',
            name: 'Tester'
        }

        localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))
        console.log(savedItems)

        const comp = render( <App /> )

        // wait to render
        await waitForElement(() => comp.getByText('Blogs'))

        // login is not present
        expect(comp.container).not.toHaveTextContent('username')
        expect(comp.container).not.toHaveTextContent('password')
        expect(comp.container).toHaveTextContent('logout')

        // unroll to test individual blogs
        service.data.map(x => {
            expect(comp.container).toHaveTextContent(x.title)
            expect(comp.container).toHaveTextContent(x.author)
            expect(comp.container).not.toHaveTextContent(x.id)
            // not expanded by default
            expect(comp.container).not.toHaveTextContent(x.url)
        })
    })
})
