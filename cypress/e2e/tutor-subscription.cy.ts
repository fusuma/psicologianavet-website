/// <reference types="cypress" />

describe('Tutor Subscription Flow', () => {
  beforeEach(() => {
    cy.visit('/tutors');
  });

  it('should allow tutor to subscribe successfully (happy path)', () => {
    // Intercept the API call to return success
    cy.intercept('POST', '/api/v1/subscribe', {
      statusCode: 200,
      body: {
        data: {},
        error: null,
      },
    }).as('subscribeRequest');

    // Find the email input by label and type a valid email
    cy.contains('label', /e-mail/i).parent().find('input[type="email"]').type('tutor@example.com');

    // Click the submit button
    cy.contains('button[type="submit"]', /baixar diário/i).click();

    // Wait for the API request
    cy.wait('@subscribeRequest');

    // Verify success message appears
    cy.contains(/obrigado/i, { timeout: 10000 }).should('be.visible');
  });

  it('should show error when email already exists (409 path)', () => {
    // Intercept the API call to return 409 Conflict
    cy.intercept('POST', '/api/v1/subscribe', {
      statusCode: 409,
      body: {
        data: null,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already subscribed',
          details: [],
        },
      },
    }).as('subscribeRequest');

    // Submit the form with an email
    cy.contains('label', /e-mail/i).parent().find('input[type="email"]').type('existing@example.com');
    cy.contains('button[type="submit"]', /baixar diário/i).click();

    // Wait for the API request
    cy.wait('@subscribeRequest');

    // Verify "already subscribed" error message appears
    cy.contains(/já está cadastrado/i, { timeout: 10000 }).should('be.visible');
  });

  it('should reject honeypot submissions (400 path)', () => {
    // Intercept the API call to verify 400 is returned
    cy.intercept('POST', '/api/v1/subscribe', {
      statusCode: 400,
      body: {
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: [],
        },
      },
    }).as('subscribeRequest');

    // Fill in the email field
    cy.contains('label', /e-mail/i).parent().find('input[type="email"]').type('bot@example.com');

    // Programmatically fill the honeypot field (bots would do this)
    cy.get('input[type="text"].sr-only').invoke('val', 'I am a bot').trigger('change');

    // Submit the form
    cy.contains('button[type="submit"]', /baixar diário/i).click();

    // Wait for the API request
    cy.wait('@subscribeRequest');

    // Verify error message appears
    cy.contains(/algo deu errado|por favor|válido/i, { timeout: 10000 }).should('be.visible');
  });

  it('should show validation error for invalid email', () => {
    // Type an invalid email
    cy.contains('label', /e-mail/i).parent().find('input[type="email"]').type('notanemail').blur();

    // Try to submit
    cy.contains('button[type="submit"]', /baixar diário/i).click();

    // Verify client-side validation error appears (React Hook Form validation)
    // The form should show an error message from Zod validation or aria-invalid
    cy.contains('label', /e-mail/i).parent().find('input[type="email"]').should('have.attr', 'aria-invalid', 'true');
  });

  it('should show loading state during submission', () => {
    // Intercept with a delay to simulate slow network
    cy.intercept('POST', '/api/v1/subscribe', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: {
          data: {},
          error: null,
        },
      });
    }).as('subscribeRequest');

    // Fill in email
    cy.contains('label', /e-mail/i).parent().find('input[type="email"]').type('test@example.com');

    // Submit form
    cy.contains('button[type="submit"]', /baixar diário/i).click();

    // Verify button shows loading state
    cy.contains('button[type="submit"]', /enviando/i).should('exist');
    cy.contains('button[type="submit"]', /enviando/i).should('be.disabled');

    // Wait for request to complete
    cy.wait('@subscribeRequest');

    // Verify button is no longer loading
    cy.contains('button[type="submit"]', /baixar diário/i).should('not.be.disabled');
  });

  it('should have no accessibility violations', () => {
    // Inject axe for accessibility testing
    cy.injectAxe();

    // Check for a11y violations on the page
    cy.checkA11y();
  });

  it('should be keyboard accessible', () => {
    // Intercept the API call to return success
    cy.intercept('POST', '/api/v1/subscribe', {
      statusCode: 200,
      body: {
        data: {},
        error: null,
      },
    }).as('subscribeRequest');

    // Focus on email input using keyboard (Tab key simulation)
    cy.contains('label', /e-mail/i).parent().find('input[type="email"]').focus();
    cy.focused().should('have.attr', 'type', 'email');

    // Type email using keyboard
    cy.focused().type('keyboard@example.com');

    // Navigate to submit button and press Enter
    cy.contains('button[type="submit"]', /baixar diário/i).focus().type('{enter}');

    // Wait for API request
    cy.wait('@subscribeRequest');

    // Verify form submission was successful
    cy.contains(/obrigado/i, { timeout: 10000 }).should('be.visible');
  });
});
