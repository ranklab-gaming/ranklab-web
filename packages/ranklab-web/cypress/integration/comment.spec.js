describe("comment", () => {
  it("should successfully create a comment in a review", () => {
    cy.login()

    cy.sql(`SELECT * FROM users;`).then(([{ id: userId }]) => {
      cy.sql(`SELECT * FROM games;`).then(([{ id: gameId }]) => {
        cy.sql(
          `INSERT INTO recordings (user_id, video_key, mime_type, uploaded)
          VALUES ('${userId}', 'a5b509ba-8590-4253-9ca5-f76e09a37e64.mp4', 'video/mp4', 'true');`
        )

        cy.sql(`SELECT * FROM recordings;`).then(([{ id: recordingId }]) => {
          cy.sql(
            `INSERT INTO reviews (user_id, coach_id, title, recording_id, game_id, notes)
             VALUES ('${userId}', NULL, 'This is a test review', '${recordingId}', '${gameId}', 'These are test notes');`
          )
        })
      })
    })

    cy.visit("/dashboard")
    cy.get("tr").eq(1).click()
    cy.get("video").then((videos) => {
      videos[0].currentTime = 4
    })
    cy.get("button").contains("Create Annotation at 0:04").click()
    cy.get('[contenteditable="true"]').type("This is a test comment")
    cy.get("button").contains("Create Annotation").click()
    cy.get("div").contains("0:04")
    cy.get("div").contains("This is a test comment")
  })
})
