Cypress.Commands.add("login", () => {
  cy.visit("/api/auth/login")
  cy.get("input[name=login]").focus().clear().type("test")
  cy.get("input[name=password]").focus().clear().type("test")
  cy.get("button.login").click()
  cy.get("button.login").click()

  cy.getCookie(Cypress.env("auth0SessionCookieName")).then(({ value }) => {
    cy.task("decrypt", {
      value: value,
      secret: Cypress.env("auth0CookieSecret"),
    }).then(({ user }) => {
      cy.sql(`INSERT INTO users (auth0_id) VALUES ('${user.sub}');`)
    })
  })
})
