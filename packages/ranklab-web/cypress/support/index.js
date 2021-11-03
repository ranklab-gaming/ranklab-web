import "cypress-nextjs-auth0"

beforeEach(() => {
  cy.task("db:reset")
})

Cypress.Commands.add("sql", (query) => {
  cy.task("db:query", query)
})
