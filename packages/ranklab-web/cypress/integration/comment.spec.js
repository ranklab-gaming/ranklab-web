describe("review", () => {
  it("should successfully create a comment in a review", () => {
    cy.login()
    cy.sql(`SELECT * FROM users;`).then(([{ id: user_id }]) => {
      cy.sql(`SELECT * FROM games;`).then(([{ id: game_id }]) => {
        cy.sql(
          `INSERT INTO reviews (user_id, coach_id, title, video_url, game_id, notes)
          VALUES ('${user_id}', NULL, 'This is a test review', 'https://ranklab-dev.s3.eu-west-2.amazonaws.com/700a3320-b88d-4a2c-91f8-834a5da62cdc', '${game_id}', 'These are test notes');`
        )
      })
    })
    cy.visit("/dashboard")
    cy.get("tr").eq(1).click()
    cy.get('[contenteditable="true"]').type("This is a test comment")
    cy.get("video").then((videos) => {
      videos[0].currentTime = 4
    })
    cy.contains("Add comment at 0:04").click()
    cy.get("li").contains("0:04")
    cy.get("li").contains("This is a test comment")
  })
})
