describe('Blog app', function() {
  beforeEach(function() {
    // empty the db
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    // create a user for the backend
    const user = {
      username: 'admin',
      name: 'gloria',
      password: 'fullstack'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('fullstack')
      cy.get('#login-button').click()

      cy.contains('gloria logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('pwd')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'gloria logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'fullstack' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('New blog for testing')
      cy.get('#author').type('A random fairy')
      cy.get('#url').type('a-random-url')
      cy.get('#create-button').click()
      cy.contains('New blog for testing')
    })

    describe('When there are blogs listed', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'testBlogTitle',
          author: 'testAuthor',
          url: 'testUrl'
        })
      })

      it('User can like a blog', function() {
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('A blog can be deleted by its creator', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.contains('testBlogTitle').should('not.exist')
      })

      it('Only creator of the blog can see the delete button', function() {
        cy.contains('logout').click()
        cy.contains('Log in to application')
        const anotherUser = {
          username: 'momo',
          name: 'randomguy',
          password: 'open'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
        cy.login({ username: anotherUser.username, password: anotherUser.password })
        cy.contains('randomguy logged in')
        cy.contains('view').click()
        cy.contains('remove').should('be.hidden')
      })

      it('Blogs are ordered by likes', function() {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
        cy.createBlog({
          title: 'anotherTestBlog',
          author: 'anotherAuthor',
          url: 'anotherUrl'
        })
        cy.get('.blog').eq(0).should('contain', 'testBlogTitle')
        cy.contains('anotherTestBlog').contains('view').click()
        cy.contains('anotherTestBlog').parent().contains('like').click()
        cy.contains('anotherTestBlog').parent().contains('like').click()
        cy.contains('anotherTestBlog').parent().contains('like').click()
        cy.contains('likes 3')
        cy.get('.blog').eq(0).should('contain', 'anotherTestBlog')
        cy.get('.blog').eq(1).should('contain', 'testBlogTitle')
      })
    })
  })
})