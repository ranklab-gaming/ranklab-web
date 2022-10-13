describe("comment", () => {
  it("should successfully create a comment in a review", () => {
    cy.login()

    cy.sql(`SELECT * FROM players;`).then(([{ id: playerId }]) => {
      cy.sql(`SELECT * FROM coaches;`).then(([{ id: coachId }]) => {
        cy.sql(
          `INSERT INTO recordings (player_id, video_key, mime_type, uploaded)
          VALUES ('${playerId}', 'a5b509ba-8590-4253-9ca5-f76e09a37e64.mp4', 'video/mp4', 'true');`
        )

        cy.sql(`SELECT * FROM recordings;`).then(([{ id: recordingId }]) => {
          cy.sql(
            `INSERT INTO reviews (player_id, coach_id, title, recording_id, game_id, skill_level, state, notes)
              VALUES ('${playerId}', '${coachId}', 'This is a test review', '${recordingId}', 'overwatch', 1, 'draft', 'These are test notes');`
          )
        })
      })
    })

    cy.visit("/coach/dashboard")
    cy.get("tr").eq(1).click()
    cy.get("video")
      .should(($video) => {
        const seekable = $video[0].seekable
        const timeRanges = []

        for (let i = 0; i < seekable.length; i++) {
          timeRanges.push([seekable.start(i), seekable.end(i)])
        }

        const canSeek = timeRanges.some(([start, end]) => {
          return 4 >= start && 4 <= end
        })

        expect(canSeek).to.be.true
      })
      .then((videos) => {
        videos[0].currentTime = 4
      })
    cy.get("button").contains("Create Annotation at 0:04").click()
    cy.get('.ql-editor[contenteditable="true"]').type("This is a test comment")
    cy.get("button").contains("Create Annotation").click()
    cy.get("div").contains("0:04")
    cy.get("div").contains("This is a test comment")
  })
})
