describe("review", () => {
  it("should successfully create a review", () => {
    cy.intercept("POST", "/api/reviews").as("createReview")
    cy.login()
    cy.visit("/r/a5b509ba-8590-4253-9ca5-f76e09a37e64")
    cy.get("input[name=title]").type("This is a test review")
    cy.contains("Game").parent().get("[role=button]").click()
    cy.contains("Overwatch").click()
    cy.contains("Notes")
      .parent()
      .get('[contenteditable="true"]')
      .type("This is a test description")
    cy.contains("Submit Form").click()

    cy.wait("@createReview").then((xhr) => {
      cy.sql(`SELECT * FROM games WHERE name = 'Overwatch';`).then(
        ([{ id: game_id }]) => {
          cy.log(JSON.stringify(xhr.response.body))
          cy.wrap(xhr.response.body).should("include", {
            title: "This is a test review",
            game_id: game_id,
            notes: "This is a test description",
            video_key: "a5b509ba-8590-4253-9ca5-f76e09a37e64.mp4",
          })
        }
      )
    })
  })
})
