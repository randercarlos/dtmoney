/// <reference types="cypress" />

describe('Header', () => {
  before(() => {
    cy.visit('/');
  });

  it('show app name', () => {
    cy.get('header .header').find('h2').should('include.text', 'Finanças');
  });

  it('show transaction form modal button', () => {
    cy.get('header .header').find('button').should('have.text', 'Nova Transação');
  });
});
