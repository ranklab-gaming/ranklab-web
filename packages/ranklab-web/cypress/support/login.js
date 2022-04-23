Cypress.Commands.add("login", ({ as = "Coach" } = {}) => {
  cy.log("AS:", as)
  cy.visit(`/api/auth/login?user_type=${as}`)
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
      const stripeAccountId = Cypress.env("stripeAccountId")
      const stripeCustomerId = Cypress.env("stripeCustomerId")

      if (as === "Coach") {
        cy.sql(`
          INSERT INTO coaches (
            auth0_id,
            games,
            stripe_account_id,
            stripe_details_submitted,
            stripe_payouts_enabled
          )
          VALUES (
            '${user.sub}',
            array ['{"game_id": "overwatch", "skill_level": 6 }'] :: json [],
            '${stripeAccountId}',
            true,
            true
          );
        `)
      } else {
        cy.sql(`
          INSERT INTO players (auth0_id, games, stripe_customer_id)
          VALUES (
            '${user.sub}',
            array ['{"game_id": "overwatch", "skill_level": 1 }'] :: json [],
            '${stripeCustomerId}'
          );
        `)
      }
    })
  })
})
