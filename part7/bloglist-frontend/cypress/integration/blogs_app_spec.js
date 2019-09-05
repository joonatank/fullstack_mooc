describe('Blogs', function() {

    const USER = { username: 'tester', password: 'good', name: 'Tester the Magnanimous' }

    const getUser = () => {
        return cy.request('POST', '/api/login', USER).then(res => res.body)
    }

    // We want to use these here to test the login function
    // Only need the user to be created once for this
    before(function () {
    })

    after(function () {
    })

    const DATA = [
        { author: "Author",
          title: "Title",
          url: "http://wwww.nowhere.fast"
        },
        { author: "Miller",
          title: "This that and another",
          url: "http://wwww.somwhere.slow"
        },
        { author: "Dan Brown",
          title: "Bad detective novel",
          url: "http://wwww.nowhere.com"
        },
    ]

    beforeEach(function () {
        getUser().then(user => {
            DATA.map(d => {
                cy.request( {
                    method: 'POST',
                    url: '/api/blogs',
                    auth: {
                        bearer: user.token
                    },
                    body: d
                })
            })
            // Assume the server to be running already since it's in a different repo

            // using window.storage : dunno other way to pass the login page
            const STORAGE_USER = 'loggedBloglistappUser'

            window.localStorage.setItem(
                STORAGE_USER, JSON.stringify(user)
            )
        })
    })

    // Delete all the posts
    // TODO batch delete would be a lot better
    afterEach(function () {
        getUser().then(user => {

            cy.request( {
                method: 'GET',
                url: '/api/blogs',
                auth: {
                    bearer: user.token
                }
            }).then((res) => {
                res.body.map(x => {

                    cy.request( {
                        method: 'DELETE',
                        url: `/api/blogs/${x.id}`,
                        auth: {
                            bearer: user.token
                        }
                    })
                })
            })
        })
    })

    it('got a blog list', function() {

        cy.visit('/blogs')
        cy.get('#nav').get('button').contains('logout')

        // check that the Blog table has all of them
        // check all titles, authors
        DATA.map(d => {
            cy.contains(d.author)
            cy.contains(d.title)
        })

        cy.get('table').find('tr').should('have.length', DATA.length)

        // check all likes and comments are zero
        // TODO How to check the number of elements?
        //  we can iterate over all the tr:s and check them individually
        cy.contains('0 likes')
        cy.contains('0 comments')
    })

    // TODO second test, invalid form should not be nulled OR posted
    it('create post with form', function() {
        cy.visit('/blogs')

        cy.get('#createNewButton').click()
        cy.contains('title')
        cy.contains('author')
        cy.contains('url')

        const newTitle = 'New Title'
        const newAuthor = 'New Author'
        const newUrl = 'wwww.newplace.com'
        cy.get('form').within(() => {
            cy.get('input[name=title]').type(newTitle)
            cy.get('input[name=author]').type(newAuthor)
            cy.get('input[name=url]').type(newUrl)
            cy.get('button[type=submit]').click()
        })

        cy.get('table').find('tr').should('have.length', DATA.length+1)

        cy.get('table').within(() => {
            cy.contains(newTitle).should('have.attr', 'href')
            cy.contains(newAuthor)
        })

        // Check flash
        cy.contains('A new blog: ' + newTitle)
    })

    it('can open a blog post', function() {
        cy.visit('/blogs')

        const d = DATA[0]
        cy.get('table').find('tr').should('have.length', DATA.length)

        // Don't have the id saved in DATA, can't check it
        cy.contains(d.title).should('have.attr', 'href')
        cy.contains(d.title).click()

        cy.contains('h2', d.title)
        cy.contains(d.author)
        cy.contains(d.url).should('have.attr', 'href')

        // Like button
        cy.contains(0)
        cy.contains('button', 'Like').click()
        cy.contains(1)
        cy.contains('button', 'Like').click()
        cy.contains(2)

        // TODO test the comment button
        // TODO check flash messages

        // Delete button
        cy.contains('button', 'Delete').click()
        cy.contains('button', 'Cancel').click()
        // State is still the same
        cy.contains(2)
        cy.contains('h2', d.title)

        cy.contains('button', 'Delete').click()
        cy.contains('button', 'OK').click()

        // Check we deleted one post
        cy.visit('/blogs')
        cy.get('table').find('tr').should('have.length', DATA.length-1)
    })
})
