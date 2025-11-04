// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const { default: jwt_decode } = require('jwt-decode')


Cypress.Commands.add('visitApp', () => {
    cy.visit('/api_list')
})

Cypress.Commands.add('createUser', (userData = {}) => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const uniqueId = `${timestamp}-${randomString}`
    const defaultEmail = `test-${uniqueId}@example.com`

    const defaultUserData = {
        name: 'Mark Flint',
        email: defaultEmail,
        password: 'test1234',
        title: 'Mr',
        birth_date: '01',
        birth_month: '01',
        birth_year: '1980',
        firstname: 'Mark',
        lastname: 'Flint',
        company: 'testOrg',
        address1: 'main st.',
        address2: 'apt 1',
        country: 'USA',
        zipcode: '10001',
        state: 'NY',
        city: 'NYC',
        mobile_number: '2122345678'
    }

    const userPayload = { ...defaultUserData, ...userData }

    return cy.request({
        method: 'POST',
        url: '/api/createAccount',
        form: true,
        body: userPayload
    }).then((response) => {
        const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        return responseData
    })
})

Cypress.Commands.add(
  'loginByAuth0Api',
  (username, password) => {
    cy.log(`Logging in as ${username}`)
    const client_id = Cypress.env('auth0_client_id')
    const client_secret = Cypress.env('auth0_client_secret')
    const audience = Cypress.env('auth0_audience')
    const scope = Cypress.env('auth0_scope')

    return cy.request({
      method: 'POST',
      url: `https://${Cypress.env('auth0_domain')}/oauth/token`,
      body: {
        grant_type: 'password',
        username,
        password,
        audience,
        scope,
        client_id,
        client_secret,
      },
    }).then(({ body }) => {
      expect(body).to.have.property('access_token')
      expect(body).to.have.property('id_token')
      expect(body).to.have.property('token_type', 'Bearer')

      const claims = jwt_decode(body.id_token)
      const {
        nickname,
        name,
        picture,
        updated_at,
        email,
        email_verified,
        sub,
        exp,
      } = claims

      const authData = {
        body: {
          ...body,
          decodedToken: {
            claims,
            user: {
              nickname,
              name,
              picture,
              updated_at,
              email,
              email_verified,
              sub,
            },
            audience,
            client_id,
          },
        },
        expiresAt: exp,
      }

      cy.log('Auth0 login successful')
      cy.log(`User: ${email}`)
      cy.log(`Token expires at: ${new Date(exp * 1000).toISOString()}`)

      // Visit the app with auth data in localStorage
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('auth0Cypress', JSON.stringify(authData))
        }
      })
    })
  }
)