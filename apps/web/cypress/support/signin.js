Cypress.Commands.add("signin", ({ as = "coach" } = {}) => {
  return cy
    .sql(
      `
      INSERT INTO users (name, email)
      VALUES (
        'Test ${as === "coach" ? "Coach" : "Player"}',
        'test@${as === "coach" ? "coach" : "player"}.com'
      )
      RETURNING id, name, email;
      `
    )
    .then(([[{ id: userId, name, email }]]) => {
      return cy
        .task("jwt:sign", {
          name,
          email,
          sub: `${as}:${userId}`,
        })
        .then((token) => {
          cy.setCookie("next-auth.session-token", JSON.stringify(token))

          if (as === "coach") {
            const stripeAccountId = Cypress.env("stripeAccountId")

            return cy
              .sql(
                `
                INSERT INTO coaches (
                  user_id,
                  games,
                  stripe_account_id,
                  stripe_details_submitted,
                  stripe_payouts_enabled
                )
                VALUES (
                  '${userId}',
                  array ['overwatch'] :: json [],
                  '${stripeAccountId}',
                  true,
                  true
                )
                RETURNING id;
                `
              )
              .then(([[{ id: coachId }]]) => {
                return cy.wrap({ coachId })
              })
          } else {
            const stripeCustomerId = Cypress.env("stripeCustomerId")

            return cy
              .sql(
                `
                INSERT INTO players (user_id, games, stripe_customer_id)
                VALUES (
                  '${userId}',
                  array ['{"game_id": "overwatch", "skill_level": 1 }'] :: json [],
                  '${stripeCustomerId}'
                )
                RETURNING id;
                `
              )
              .then(([[{ id: playerId }]]) => {
                return cy.wrap({ playerId })
              })
          }
        })
    })
})
