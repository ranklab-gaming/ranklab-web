describe("Navigation", () => {
  it("should navigate to the index page", () => {
    cy.visit("/")

    cy.get("h1").contains("Be the better gamer with Ranklab")
  })
})

export {}
