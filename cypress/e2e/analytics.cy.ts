describe('Google Analytics Integration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load Google Analytics script when GA_ID is configured', () => {
    // Verify gtag.js script tag exists
    cy.get('script[src*="googletagmanager.com/gtag/js"]').should('exist');

    // Verify GA config script exists
    cy.get('script#google-analytics').should('exist');
  });

  it('should load Analytics on all pages', () => {
    // Test homepage
    cy.visit('/');
    cy.get('script[src*="googletagmanager.com/gtag/js"]').should('exist');

    // Test tutors page
    cy.visit('/tutors');
    cy.get('script[src*="googletagmanager.com/gtag/js"]').should('exist');
  });
});
