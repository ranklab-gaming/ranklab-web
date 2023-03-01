describe("login", () => {
  it.skip("should successfully log into our app", () => {
    cy.signin()
    cy.visit("/coach/dashboard")
    cy.get(".MuiAvatar-root").click()
    cy.contains("Test Coach")
  })
})
