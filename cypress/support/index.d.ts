/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to visit the API list page
     * @example cy.visitApp()
     */
    visitApp(): Chainable<void>

    /**
     * Custom command to create a user account
     * @param userData - Optional user data to override defaults
     * @example cy.createUser()
     * @example cy.createUser({ name: 'John Doe', email: 'john@example.com' })
     */
    createUser(userData?: {
      name?: string
      email?: string
      password?: string
      title?: string
      birth_date?: string
      birth_month?: string
      birth_year?: string
      firstname?: string
      lastname?: string
      company?: string
      address1?: string
      address2?: string
      country?: string
      zipcode?: string
      state?: string
      city?: string
      mobile_number?: string
    }): Chainable<any>

    loginByAuth0Api(username?: string, password?: string) : Chainable<any>
  }
}
