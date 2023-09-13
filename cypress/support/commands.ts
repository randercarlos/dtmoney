/// <reference types="cypress" />
import { Transaction } from './../../src/support/interfaces/transaction.interface';
import { TransactionType } from './../../src/support/enums/transaction-type.enum';

Cypress.Commands.add('createTransaction', (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  // click on button to open modal
  cy.get('header .header button').click({ force: true });

  cy.fillTransactionForm(transaction);
});

Cypress.Commands.add(
  'fillTransactionForm',
  (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
      cy.get('input[placeholder="Título"]')
        .focus()
        .clear()
        .type(transaction.title as string)
        .blur();

      cy.get('.transaction-type button').within(() => {
        if (transaction.type === TransactionType.Deposit) {
          cy.root().first().click();
        } else {
          cy.root().last().click();
        }
      });

      cy.get('input[placeholder="Valor"]').focus().clear().type(String(transaction.amount)).blur();

      cy.get('input[placeholder="Categoria"]')
        .focus()
        .clear()
        .type(transaction.category as string)
        .blur();

      cy.get('button[type="submit"]').click();
    });
  }
);

Cypress.Commands.add(
  'checkTransactionsSummaryValues',
  (income: string, outcome: string, total: string) => {
    cy.get('main .summary div').within(() => {
      cy.root().first().find('b').contains(income);
      // .should('have.text', 'Nenhuma transação foi encontrada...');

      cy.root().eq(1).find('b').contains(outcome);

      cy.root().last().find('b').contains(total);
    });
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      createTransaction(transaction: Transaction): Chainable<void>;
      fillTransactionForm(transaction: Transaction): Chainable<void>;
      checkTransactionsSummaryValues(income: string, outcome: string, total: string): void;
    }
  }
}
