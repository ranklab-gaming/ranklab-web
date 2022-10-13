Cypress.Commands.add("login", ({ as = "Coach" } = {}) => {
  cy.log("AS:", as)
  cy.visit(`/api/auth/login?user_type=${as}`)
  cy.get("input[name=login]").focus().clear().type(as)
  cy.get("input[name=password]")
    .focus()
    .clear()
    .type(Cypress.env("authPassword"))
  cy.get("button.login").click()
  cy.get("button.login").click()
  cy.getCookie("appSession").then(({ value }) => {
    cy.task("decrypt", {
      value: value,
      secret: Cypress.env("cookieSecret"),
    }).then(() => {
      const stripeAccountId = Cypress.env("stripeAccountId")
      const stripeCustomerId = Cypress.env("stripeCustomerId")

      if (as === "Coach") {
        cy.sql(`
          INSERT INTO coaches (
            games,
            stripe_account_id,
            stripe_details_submitted,
            stripe_payouts_enabled,
            name
          )
          VALUES (
            array ['{"game_id": "overwatch", "skill_level": 6 }'] :: json [],
            '${stripeAccountId}',
            true,
            true,
            'Test Coach'
          );
        `)
      } else {
        cy.sql(`
          INSERT INTO players (games, stripe_customer_id, name)
          VALUES (
            array ['{"game_id": "overwatch", "skill_level": 1 }'] :: json [],
            '${stripeCustomerId}',
            'Test Player'
          );
        `)
      }
    })
  })
})
