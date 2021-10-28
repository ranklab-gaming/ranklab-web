Cypress.Commands.add("login", () => {
  Cypress.log({
    name: "loginViaAuth0",
  })

  const options = {
    method: "POST",
    url: Cypress.env("AUTH_URL"),
    body: {
      grant_type: "password",
      username: Cypress.env("AUTH_USERNAME"),
      password: Cypress.env("AUTH_PASSWORD"),
      audience: Cypress.env("AUTH_AUDIENCE"),
      scope: "openid profile email",
      client_id: Cypress.env("AUTH_CLIENT_ID"),
      client_secret: Cypress.env("AUTH_CLIENT_SECRET"),
    },
  }
  return cy.request(options)
})

export {}
