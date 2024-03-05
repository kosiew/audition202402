describe('Authenticated API access', () => {
  it('logs in and tests an API endpoint', () => {
    // Assuming you have a page at /auth/signin for login
    cy.visit('/auth/signin');
    cy.get('input[name=email]').type('yourTestUser@example.com');
    cy.get('input[name=password]').type('yourTestPassword{enter}');

    // Wait for redirection to /inventory or check for any sign of successful login
    cy.url().should('include', '/inventory');

    // Now you can test an authenticated endpoint
    // Replace `/api/inventory/1` with your actual API endpoint
    cy.request({
      method: 'GET',
      url: '/api/inventory/1', // This should be an actual API endpoint you wish to test
      // Include cookies automatically included by Cypress in requests
    }).then((response) => {
      expect(response.status).to.eq(200);
      // Further assertions about the response
    });
  });
});
