describe("review", () => {
  it("should successfully create a review", () => {
    cy.login()

    cy.sql(`SELECT * FROM players;`).then(([{ id: playerId }]) => {
      cy.sql(
        `INSERT INTO recordings (playerId, video_key, mime_type, uploaded)
         VALUES ('${playerId}', 'a5b509ba-8590-4253-9ca5-f76e09a37e64.mp4', 'video/mp4', 'true');`
      )

      cy.sql(`SELECT * FROM recordings;`).then(([{ id: recordingId }]) => {
        cy.intercept("POST", "/api/reviews").as("createReview")
        cy.visit(`/r/${recordingId}`)
        cy.get("input[name=title]").type("This is a test review")
        cy.contains("Game").parent().get("[role=button]").click()
        cy.contains("Overwatch").click()
        cy.contains("Notes")
          .parent()
          .get('[contenteditable="true"]')
          .type("This is a test description")
        cy.contains("Submit Form").click()

        cy.wait("@createReview").then((xhr) => {
          cy.wrap(xhr.response.body).should("include", {
            title: "This is a test review",
            game_id: "overwatch",
            notes: "This is a test description",
            recording_id: recordingId,
          })
        })
      })
    })
  })
})
