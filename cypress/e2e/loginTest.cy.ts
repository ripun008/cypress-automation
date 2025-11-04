describe('Auth0 React App Authentication', function () {
  beforeEach(function () {
    // Login programmatically before each test
    cy.loginByAuth0Api(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
  })

  it('should display user profile after programmatic login', function () {
    // Verify the welcome message is displayed
    cy.contains('Welcome,').should('be.visible')

    // Verify user email is displayed
    cy.contains(Cypress.env('auth0_username')).should('be.visible')

    // Verify the profile card is visible
    cy.get('.profile-card').should('be.visible')

    // Verify user info section exists
    cy.get('.user-info').should('be.visible')
  })

  it('should show Get Started button when not authenticated', function () {
    // Clear auth and reload
    cy.clearLocalStorage('auth0Cypress')
    cy.visit('/')

    // Verify Get Started button is visible
    cy.get('#get-started').should('be.visible').and('contain', 'Get Started')

    // Verify Log In button is visible
    cy.contains('button', 'Log In').should('be.visible')
  })

  it('should display user information correctly', function () {
    // Check that user ID is displayed
    cy.contains('User ID:').should('be.visible')

    // Check that email verified status is displayed
    cy.contains('Email Verified:').should('be.visible')

    // Check logout button exists
    cy.contains('button', 'Log Out').should('be.visible')
  })

  it('should verify authentication state with tokens', function () {
    // Get auth data from localStorage
    cy.window().then((win) => {
      const auth0Data = win.localStorage.getItem('auth0Cypress')
      expect(auth0Data).to.not.be.null

      const parsedAuth = JSON.parse(auth0Data)
      expect(parsedAuth.body).to.have.property('access_token')
      expect(parsedAuth.body).to.have.property('id_token')
      expect(parsedAuth.body.decodedToken.user.email).to.equal(Cypress.env('auth0_username'))

      cy.log('✓ Authentication tokens verified in localStorage')
    })
  })
})