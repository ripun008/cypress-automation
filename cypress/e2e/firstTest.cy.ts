describe('Cypress API tests spec', () => {

  beforeEach('open application', () => {
    cy.visitApp()
  })

  it('verify title passes', () => {
    //cy.visit('https://example.cypress.io')
    cy.visit('https://www.automationexercise.com/')
    cy.get('.material-icons.card_travel').should('be.visible').click()
    cy.get('input#search_product').should('be.visible').click().type('blue top') // type into search bar
    cy.get('button#submit_search').should('be.visible').click() // click search icon
    cy.get('.features_items .title').contains('Searched Products')
    cy.get('.single-products .productinfo > p').contains('Blue Top')
  })

  it('Get all products list GET call', () => {
    cy.request({
      method: 'GET',
      url: '/api/productsList'
    }).then((response) => {
      // Validate status code
      expect(response.status).to.eq(200)

      // Log the response to see what we're getting
      cy.log('Response body:', response.body)

      // Validate response body exists
      expect(response.body).to.not.be.null

      // Parse response if it's a string
      const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

      // Validate response has products property
      expect(responseData).to.have.property('products')

      // Validate products is an array and has items
      expect(responseData.products).to.be.an('array')
      expect(responseData.products.length).to.be.greaterThan(0)

      // Validate first product has expected properties
      const firstProduct = responseData.products[0]
      expect(firstProduct).to.have.property('id')
      expect(firstProduct).to.have.property('name')
      expect(firstProduct).to.have.property('price')
      expect(firstProduct).to.have.property('brand')
      expect(firstProduct).to.have.property('category')

      // Validate category structure and values
      expect(firstProduct.category.usertype.usertype).to.eq('Women')
      expect(firstProduct.category.category).to.eq('Tops')
    })
  })

  it('Get all Brands list GET Call', () => {
    cy.request({
      method: 'GET',
      url: '/api/brandsList'
    }).then((response) => {
      // Validate status code
      expect(response.status).to.eq(200)

      // Log the response to see what we're getting
      cy.log('Response body:', response.body)

      // Validate response body exists
      expect(response.body).to.be.not.null

      // Parse response if it's a string
      const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

      expect(responseData.responseCode).to.eq(200)

      // Validate brands data
      const firstBrand = responseData.brands[0]
      expect(firstBrand).to.have.property('id')
      expect(firstBrand).to.have.property('brand')
      expect(firstBrand.id).to.eq(1)
      expect(firstBrand.brand).to.eq('Polo')
    })
  })

  it('Search products using POST request', () => {
    cy.request({
      method: 'POST',
      url: '/api/searchProduct',
      form: true,
      body: {
        search_product: 'top'
      }
    }).then((response) => {
      // Validate status code
      expect(response.status).to.eq(200)

      // Log the response to see what we're getting
      cy.log('Response body:', response.body)

      // Validate response body exists
      expect(response.body).to.not.be.null

      // Parse response if it's a string
      const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

      // Validate response code
      expect(responseData.responseCode).to.eq(200)

      // Validate response has products property
      expect(responseData).to.have.property('products')

      // Validate products is an array and has items
      expect(responseData.products).to.be.an('array')
      expect(responseData.products.length).to.be.greaterThan(0)

      // Filter products that have 'top' in the name
      const productsWithTop = responseData.products.filter((product: any) =>
        product.name.toLowerCase().includes('top')
      )

      // Validate that at least some products match the search term
      expect(productsWithTop.length).to.be.greaterThan(0)

      // Validate that the filtered products do contain 'top' in name
      productsWithTop.forEach((product: any) => {
        expect(product.name.toLowerCase()).to.include('top')
      })

      // Validate first product structure
      const firstProduct = responseData.products[0]
      expect(firstProduct).to.have.property('id')
      expect(firstProduct).to.have.property('name')
      expect(firstProduct).to.have.property('price')
      expect(firstProduct).to.have.property('brand')
      expect(firstProduct).to.have.property('category')
      expect(firstProduct.category).to.have.property('usertype')
      expect(firstProduct.category.usertype).to.have.property('usertype')
      expect(firstProduct.category).to.have.property('category')

      // Validate category structure and values
      expect(firstProduct.category.usertype.usertype).to.eq('Women')
      expect(firstProduct.category.category).to.eq('Tops')
    })
  })

  it('Search Product without `search_product` parameter POST call & verify error msg.', () => {
    cy.request({
      method: 'POST',
      url: '/api/searchProduct',
      form: true
    }).then((response) => {
      // Log the response to see what we're getting
      cy.log('Response body:', response.body)

      // Validate response body exists
      expect(response.body).to.not.be.null

      // Parse response if it's a string
      const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

      // Validate response code
      expect(responseData.responseCode).to.eq(400)

      // Verify error message
      expect(responseData.message).to.eq('Bad request, search_product parameter is missing in POST request.')
    })
  })

  it('POST call to verify login with valid details', () => {
    cy.request({
      method: 'POST',
      url: '/api/verifyLogin',
      form: true,
      body: {
        email: 'niohfan8@gmail.com',
        password: 'test1234'
      }
    }).then((response) => {
      // Log the response to see what we're getting
      cy.log('Response body:', response.body)

      // Validate response body exists
      expect(response.body).to.not.be.null

      // Parse response if it's a string
      const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

      // Validate response code
      expect(responseData.responseCode).to.eq(200)

      // Verify successful login message
      expect(responseData.message).to.eq('User exists!')
    })
  })
  
  it('POST call to verify login without email parameter', () => {
    cy.request({
      method: 'POST',
      url: '/api/verifyLogin',
      form: true,
      body: {
        password: 'test1234'
      }
    }).then((response) => {
      // Log the response to see what we're getting
      cy.log('Response body:', response.body)

      // Validate response body exists
      expect(response.body).to.not.be.null

      // Parse response if it's a string
      const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

      // Validate response code
      expect(responseData.responseCode).to.eq(400)

      // verify error message
      expect(responseData.message).to.eq('Bad request, email or password parameter is missing in POST request.')
    })
  })

  it('POST call to verify login with invalid details', () => {
    cy.request({
      method: 'POST',
      url: '/api/verifyLogin',
      form: true,
      body: {
        email: 'niohfan8@gmail.com',
        password: 'test123'
      }
    }).then((response) => {
      // Log the response to see what we're getting
      cy.log('Response body:', response.body)

      // Validate response body exists
      expect(response.body).to.not.be.null

      // Parse response if it's a string
      const responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

      // Validate response code
      expect(responseData.responseCode).to.eq(404)

      // Verify successful login message
      expect(responseData.message).to.eq('User not found!')
    })
  })

  it('POST call to Create/Register User Account', () => {
    cy.createUser().then((responseData) => {
      // Log the response to see what we're getting
      cy.log('Response data:', responseData)

      // Validate response code
      expect(responseData.responseCode).to.eq(201)

      // Verify successful login message
      expect(responseData.message).to.eq('User created!')
    })
  })

  it('DELETE call to delete user account', () => {
    // First create a user
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const userEmail = `test-${timestamp}-${randomString}@example.com`
    const userPassword = 'test1234'

    cy.createUser({
      email: userEmail,
      password: userPassword
    }).then((createResponse) => {
      // Verify user was created
      expect(createResponse.responseCode).to.eq(201)
      expect(createResponse.message).to.eq('User created!')

      // Now delete the user
      cy.request({
        method: 'DELETE',
        url: '/api/deleteAccount',
        form: true,
        body: {
          email: userEmail,
          password: userPassword
        }
      }).then((deleteResponse) => {
        // Log the response
        cy.log('Delete response:', deleteResponse.body)

        // Parse response if it's a string
        const responseData = typeof deleteResponse.body === 'string'
          ? JSON.parse(deleteResponse.body)
          : deleteResponse.body

        // Validate status code
        expect(deleteResponse.status).to.eq(200)

        // Validate response code
        expect(responseData.responseCode).to.eq(200)

        // Verify successful deletion message
        expect(responseData.message).to.eq('Account deleted!')
      })
    })
  })

  it('PUT request to update user account', () => {
    // First create a user
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const userEmail = `test-${timestamp}-${randomString}@example.com`
    const userPassword = 'test1234'

    cy.createUser({
      email: userEmail,
      password: userPassword
    }).then((createResponse) => {
      // Verify user was created
      expect(createResponse.responseCode).to.eq(201)
      expect(createResponse.message).to.eq('User created!')

      // Now update the user
      cy.request({
        method: 'PUT',
        url: '/api/updateAccount',
        form: true,
        body: {
          name: 'Jane Flint',
          email: userEmail,
          password: userPassword,
          title: 'Mrs',
          birth_date: '02',
          birth_month: '02',
          birth_year: '1981',
          firstname: 'Jane',
          lastname: 'Flint',
          company: 'testOrg2',
          address1: '2nd street',
          address2: 'apt 4',
          country: 'United States',
          zipcode: '10002',
          state: 'New York',
          city: 'NYC',
          mobile_number: '6462345678'
        }
      }).then((response) => {
         // Log the response
        cy.log('Put response:', response.body)

        // Parse response if it's a string
        const responseData = typeof response.body === 'string'
          ? JSON.parse(response.body)
          : response.body

        // Verify user was updated
        expect(responseData.responseCode).to.eq(200)
        expect(responseData.message).to.eq('User updated!')
      })
    }) 
  })

  it('GET user account detail by email', () => {
    // First create a user
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const userEmail = `test-${timestamp}-${randomString}@example.com`
    const userPassword = 'test1234'

    cy.createUser({
      email: userEmail,
      password: userPassword
    }).then((createResponse) => {
      // Verify user was created
      expect(createResponse.responseCode).to.eq(201)
      expect(createResponse.message).to.eq('User created!')

      cy.request({
        method: 'GET',
        url: `/api/getUserDetailByEmail?email=${userEmail}`
      }).then((response) => {
        // Log the response
        cy.log('GET response:', response.body)

        // Parse response if it's a string
        const responseData = typeof response.body === 'string'
          ? JSON.parse(response.body)
          : response.body

         // Verify user was updated
        expect(responseData.responseCode).to.eq(200)
        expect(responseData.user.name).to.eq('Mark Flint')
        expect(responseData.user.email).to.eq(userEmail)
      })
    })
  })

})