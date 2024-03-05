const host = 'https://audition202402.vercel.app';
describe('Authenticated API access', () => {
  let productId;
  beforeEach(() => {
    // Perform login before each test
    cy.visit(`${host}/auth/signin`);
    cy.get('input[name=email]').type('user1@example.com');
    cy.get('input[name=password]').type('Xuser123X');
    cy.get('button').click();
    // Wait for redirection to /inventory or check for any sign of successful login
    cy.url().should('include', '/inventory');
  });

  it('checks /api/inventory API returns 200 OK status', () => {
    // Testing the inventory list endpoint
    cy.request(`${host}/api/inventory`).then((response) => {
      expect(response.status).to.eq(200);

      productId = response.body.products[0].id;
      cy.log(`First product id is ${productId}`);
    });
  });

  it('tests an API endpoint for a single item', () => {
    // Now you can test an authenticated endpoint for a single item
    cy.request({
      method: 'GET',
      url: `${host}/api/inventory/${productId}`, // Specific API endpoint
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.product).to.have.property('id', productId);
    });
  });
});
