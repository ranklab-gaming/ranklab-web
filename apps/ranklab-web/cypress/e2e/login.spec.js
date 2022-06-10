describe("login", () => {
  it("should successfully log into our app", () => {
    cy.login()
    cy.visit("/dashboard")
    cy.get(".MuiAvatar-root").click()
    cy.contains("Test Coach")
  })
})
