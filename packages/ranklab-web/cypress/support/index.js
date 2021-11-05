import "cypress-nextjs-auth0"

beforeEach(() => {
  cy.task("db:reset")
})

Cypress.Commands.add("sql", (query) => {
  cy.task("db:query", query)
})

Cypress.Commands.overwrite("login", (originalFn) => {
  const originalReturnValue = originalFn()

  cy.getUserTokens().then((response) => {
    cy.getUserInfo(response.accessToken).then((user) => {
      cy.sql(`INSERT INTO users (auth0_id) VALUES ('${user.sub}');`)
    })
  })

  return originalReturnValue
})
