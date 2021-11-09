require("./login")

beforeEach(() => {
  cy.task("db:reset")
})

Cypress.Commands.add("sql", (query) => {
  cy.task("db:query", query)
})

Cypress.Cookies.defaults({
  preserve: () => true,
})
