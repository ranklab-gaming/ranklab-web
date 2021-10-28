declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<Cypress.Response<any>>
    }
  }
}

describe("login", () => {
  it("should successfully log into our app", () => {
    cy.login()
      .then((resp) => {
        return resp.body
      })
      .then((body) => {
        const { access_token, expires_in, id_token } = body
        const auth0State = {
          nonce: "",
          state: "some-random-state",
        }
        const callbackUrl = `http://ranklab-development:3000/api/auth/callback?access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`
        cy.visit(callbackUrl, {
          onBeforeLoad(win) {
            win.document.cookie = `state=${auth0State.state};nonce=${auth0State.nonce}`
          },
        })
      })
  })
})

export {}
