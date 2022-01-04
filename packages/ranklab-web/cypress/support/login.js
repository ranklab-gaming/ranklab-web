Cypress.Commands.add("login", ({ as = "Coach" } = {}) => {
  cy.visit("/api/auth/login")
  cy.get("input[name=login]").focus().clear().type(as)
  cy.get("input[name=password]")
    .focus()
    .clear()
    .type(Cypress.env("auth0Password"))
  cy.get("button.login").click()
  cy.get("button.login").click()
  cy.getCookie("appSession").then(({ value }) => {
    cy.task("decrypt", {
      value: value,
      secret: Cypress.env("auth0Secret"),
    }).then(({ user }) => {
      const tableName = as === "Coach" ? "coaches" : "players"
      cy.sql(`INSERT INTO ${tableName} (auth0_id) VALUES ('${user.sub}');`)
    })
  })
})
