describe("login", () => {
  it("should successfully log into our app", () => {
    cy.login()
    cy.visit("/dashboard")
    cy.contains("test@ranklab.gg")
  })
})

export {}
