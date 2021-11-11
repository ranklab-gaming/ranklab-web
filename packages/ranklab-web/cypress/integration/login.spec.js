describe("login", () => {
  it("should successfully log into our app", () => {
    cy.login()
    cy.visit("/dashboard")
    cy.get(".avatar").click()
    cy.contains("test@ranklab.gg")
  })
})
