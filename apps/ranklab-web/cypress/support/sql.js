Cypress.Commands.add("sql", (query) => {
  return cy.task("db:query", query)
})
