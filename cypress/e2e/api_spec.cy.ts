describe('Authenticated API access', () => {
  beforeEach(() => {
    // Perform login before each test
    cy.visit('https://audition202402.vercel.app/auth/signin');
    cy.get('input[name=email]').type('user1@example.com');
    cy.get('input[name=password]').type('Xuser123X');
    cy.get('button').click();
    // Wait for redirection to /inventory or check for any sign of successful login
    cy.url().should('include', '/inventory');
  });

  it('tests an API endpoint for a single item', () => {
    // Now you can test an authenticated endpoint for a single item
    cy.request({
      method: 'GET',
      url: 'https://audition202402.vercel.app/api/inventory/1', // Specific API endpoint
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.product).to.have.property('id', 1);
    });
  });

  it('checks /api/inventory API returns 200 OK status', () => {
    // Testing the inventory list endpoint
    cy.request('https://audition202402.vercel.app/api/inventory').then((response) => {
      expect(response.status).to.eq(200);
      // You can add more assertions here to validate the structure of your response, for example:
      // expect(response.body).to.be.an('array');
    });
  });
});
