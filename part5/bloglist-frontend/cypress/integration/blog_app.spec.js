describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Full Name',
      username: 'name',
      password: 'password'
    }
    const secondUser = {
      name: 'Name Full',
      username: 'second',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.request('POST', 'http://localhost:3001/api/users/', secondUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('name')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.get('html').should('contain', 'Full Name logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('username')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Full Name logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'name', password: 'password' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()

      cy.get('#title').type('cypress test title')
      cy.get('#author').type('cypress test author')
      cy.get('#url').type('cypress test url')
      cy.get('#add-blog-button').click()

      cy.get('.blogsContainer')
        .should('contain', 'cypress test title')
        .and('contain', 'cypress test author')
    })

    describe('And blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'cypress test title',
          author: 'cypress test author',
          url: 'cypress test url'
        })
      })
      it('A blog can be liked', function () {
        cy.contains('cypress test title').contains('view').click()
        cy.get('.blogContainer').contains('likes 0')
        cy.get('.likeButton').click()
        cy.get('.blogContainer').contains('likes 1')
      })
      it('A blog can be deleted by owner', function () {
        cy.contains('cypress test title').contains('view').click()
        cy.get('.blogContainer').contains('delete').click()
        cy.get('html').should('not.contain', 'cypress test title')
      })
      it("A blog can't be deleted by not owner", function () {
        cy.login({ username: 'second', password: 'password' })
        cy.contains('cypress test title').contains('view').click()
        cy.get('.blogContainer').should('not.contain', 'delete')
      })
    })

    describe('Multiple blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'cypress test title',
          author: 'cypress test author',
          url: 'cypress test url',
          likes: 10
        })
        cy.createBlog({
          title: 'cypress test title',
          author: 'cypress test author',
          url: 'cypress test url',
          likes: 2
        })
        cy.createBlog({
          title: 'cypress test title',
          author: 'cypress test author',
          url: 'cypress test url',
          likes: 30
        })
      })
      it('Blogs are sorted by likes', function () {
        cy.get('.blogContainer').then(blogs => {
          cy.wrap(blogs[0]).should('contain', 'likes 30')
          cy.wrap(blogs[1]).should('contain', 'likes 10')
          cy.wrap(blogs[2]).should('contain', 'likes 2')
        })
      })
    })
  })
})
