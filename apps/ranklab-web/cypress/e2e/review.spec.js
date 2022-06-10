describe("review", () => {
  it("should successfully create a review", () => {
    cy.login({ as: "Player" })

    cy.sql(`SELECT * FROM players;`).then(([{ id: playerId }]) => {
      cy.sql(
        `INSERT INTO recordings (player_id, video_key, mime_type, uploaded)
         VALUES ('${playerId}', 'a5b509ba-8590-4253-9ca5-f76e09a37e64.mp4', 'video/mp4', 'true');`
      )

      cy.sql(`SELECT * FROM recordings;`).then(([{ id: recordingId }]) => {
        cy.intercept("POST", "/api/player/reviews").as("createReview")
        cy.visit(`/r/${recordingId}`)
        cy.get("input[name=title]").type("This is a test review")
        cy.get("label").contains("Game").parent().find("[role=button]").click()
        cy.contains("Overwatch").click()
        cy.contains("Notes")
          .parent()
          .get('.ql-editor[contenteditable="true"]')
          .type("This is a test description")
        cy.contains("Submit Form").click()

        cy.wait("@createReview").then((xhr) => {
          cy.wrap(xhr.response.body).should("include", {
            title: "This is a test review",
            game_id: "overwatch",
            notes: "<p>This is a test description</p>",
            recording_id: recordingId,
          })
        })
      })
    })
  })
})
