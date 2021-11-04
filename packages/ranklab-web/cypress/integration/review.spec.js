describe("review", () => {
  it("should successfully create a review", () => {
    cy.intercept("POST", "/api/reviews").as("createReview")
    cy.login()
    cy.visit("/r/700a3320-b88d-4a2c-91f8-834a5da62cdc")
    cy.get("input[name=title]").type("This is a test review")
    cy.contains("Game").parent().get("[role=button]").click()
    cy.contains("Overwatch").click()
    cy.contains("Notes")
      .parent()
      .get('[contenteditable="true"]')
      .type("This is a test description")
    cy.contains("Submit Form").click()

    cy.wait("@createReview").then((xhr) => {
      const review = cy.wrap(xhr.response.body)

      cy.sql(`SELECT * FROM games WHERE name = 'Overwatch';`).then(
        ([{ id: game_id }]) => {
          review.its("title").should("eq", "This is a test review")
          review.its("game_id").should("eq", game_id)
          review.its("notes").should("eq", "This is a test description")
        }
      )
    })
  })
})
