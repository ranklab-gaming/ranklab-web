import "cypress-nextjs-auth0"

beforeEach(() => {
  cy.task("db:reset")
})
