import "cypress-nextjs-auth0"

beforeEach(() => {
  cy.task("db:reset")
})

Cypress.Commands.add("sql", (query) => {
  cy.task("db:query", query)
})

Cypress.Commands.overwrite("login", (originalFn) => {
  const originalReturnValue = originalFn()
  const credentials = {
    username: Cypress.env("auth0Username"),
    password: Cypress.env("auth0Password"),
  }

  cy.getUserTokens(credentials).then((response) => {
    const { accessToken } = response

    cy.getUserInfo(accessToken).then((user) => {
      cy.sql(`INSERT INTO users (auth0_id) VALUES ('${user.sub}');`)
    })
  })

  return originalReturnValue
})
