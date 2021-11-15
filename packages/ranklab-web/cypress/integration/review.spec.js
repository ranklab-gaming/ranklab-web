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
      cy.sql(`SELECT * FROM games WHERE name = 'Overwatch';`).then(
        ([{ id: game_id }]) => {
          cy.log(JSON.stringify(xhr.response.body))
          cy.wrap(xhr.response.body).should("include", {
            title: "This is a test review",
            game_id: game_id,
            notes: "This is a test description",
            video_url: `${Cypress.env(
              "cdnUrl"
            )}/700a3320-b88d-4a2c-91f8-834a5da62cdc`,
          })
        }
      )
    })
  })
})
