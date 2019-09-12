
describe('Login', function() {

    const user = { username: 'tester', password: 'good', name: 'Tester the Magnanimous' }

    // Create a test user, ignore errors (since we don't have a DELETE)
    before(function () {
        console.log('creating user')
        cy.request({
            method: 'POST',
            url: '/api/users',
            body: user,
            failOnStatusCode: false
        })
    })

    // TODO create a test user before tests
    //      - problem is that backend needs DELETE user for it

    const isLoginPage = () => {
        cy.get('input[name=username]')
        cy.get('input[name=password]')
    }

    it('got the login screen', function() {
        cy.visit('/')
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')

        isLoginPage()

        cy.get('input[name=username]').type(user.username)
        cy.get('input[name=password]').type(`${user.password}{enter}`)

        cy.contains('Blogs')

        cy.get('#nav').contains(user.name)
        // TODO check that these are links
        cy.get('#nav').contains('users').should('have.attr', 'href', '/users')
        cy.get('#nav').contains('blogs').should('have.attr', 'href', '/blogs')

        // Logout
        cy.get('#nav').contains('button', 'logout').click()

        // check flash message
        cy.contains('Logout')

        isLoginPage()

        // Check that we are not allowed to go further
        // These don't cause redirects just render the login page
        cy.visit('/users')
        isLoginPage()
        cy.visit('/blogs')
        isLoginPage()
    })
})
