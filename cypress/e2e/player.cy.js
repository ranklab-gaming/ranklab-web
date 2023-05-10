describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://ranklab-web:3000')
    cy.get('[data-test="hero-get-started-button"]').click();
    cy.get('[data-test="account-fields-name"]').click();
    cy.get('[data-test="account-fields-game"]').click();
    cy.get('[data-test="game-select-overwatch"]').click();
    cy.get('[data-test="account-fields-name"]').clear();
    cy.get('[data-test="account-fields-name"]').type('Test Player');
    cy.get('[data-test="account-fields-email"]').clear();
    cy.get('[data-test="account-fields-email"]').type(`player+${Cypress._.random(0, 1e16)}@example.com`);
    cy.get('[data-test="account-fields-password"]').clear();
    cy.get('[data-test="account-fields-password"]').type('testplayer');
    cy.get('[data-test="signup-submit-button"]').click();
    cy.get('[data-test="dashboard-request-review-button"]').click();
    cy.get('[data-test="reviews-new-coach-field"]').click();
    cy.get('[data-test="coach-select-0"]').click();
    cy.get('[data-test="reviews-new-continue-button"]').click();
    cy.get('[data-test="reviews-new-recording-video-field"]').selectFile('cypress/fixtures/Big_Buck_Bunny_1080_10s_1MB.mp4');
    cy.get('[data-test="reviews-new-notes-field"]').click();
    cy.get('.ql-editor').type("some notes");
    cy.get('[data-test="reviews-new-continue-button"]').click();
    /* ==== End Cypress Studio ==== */
  })
})
