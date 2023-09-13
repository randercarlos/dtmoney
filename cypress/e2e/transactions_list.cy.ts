/// <reference types="cypress" />
import { TransactionType } from '@/support/enums/transaction-type.enum';
import { Transaction } from '@/support/interfaces/transaction.interface';

describe('Transactions List', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('show transactions list table', () => {
    cy.get('.content').should('exist', 'table');
  });

  it('show transactions list table with columns', () => {
    const transactionsTableColumns = ['Título', 'Valor', 'Categoria', 'Data', 'Ações'];

    cy.get('table thead')
      .find('th')
      .each(($el, index, $list) => {
        cy.wrap($el).should('have.text', transactionsTableColumns[index]);
      });
  });

  it('show created transactions in transactions list table', () => {
    const transaction: Transaction = {
      id: undefined,
      title: 'Ganhos do Mês',
      amount: 2010.72,
      type: TransactionType.Deposit,
      category: 'Renda',
      createdAt: undefined,
    };
    // const BRAmount = formatToBRCurrency(transaction.amount);
    // const BRDate = formatToBRDate(transaction.createdAt);

    // create a transaction
    cy.createTransaction(transaction);

    cy.wait(2000);
    cy.get('.content table tbody tr:last').within(() => {
      cy.root().should('have.length', 1);

      cy.get('td').first().should('have.text', transaction.title);
      cy.get('td').eq(1).should('include.text', '2.010,72');
      cy.get('td').eq(2).should('have.text', transaction.category);
      cy.get('td')
        .eq(3)
        .should(
          'have.text',
          `${new Date().toLocaleDateString('pt-BR')} ${new Date().getHours()}:${
            new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
          }`
        );
    });
  });

  it('show updated transactions in transactions list table', () => {
    const transaction: Transaction = {
      id: undefined,
      title: 'Retirada do Mês',
      amount: 1026.72,
      type: TransactionType.Withdraw,
      category: 'Gastos',
      createdAt: undefined,
    };

    // create a transaction
    cy.createTransaction(transaction);

    const updatedTransaction: Transaction = {
      id: undefined,
      title: 'Ganhos do Mês',
      amount: 3561.11,
      type: TransactionType.Deposit,
      category: 'Renda',
      createdAt: undefined,
    };

    cy.wait(2000);
    cy.get('.content table tbody tr:last td:last .actions span.edit').click();
    cy.fillTransactionForm(updatedTransaction);

    cy.wait(1000);
    cy.get('.content table tbody tr:last').within(() => {
      cy.get('td').first().should('have.text', updatedTransaction.title);
      cy.get('td').eq(1).should('include.text', '3.561,11');
      cy.get('td').eq(2).should('have.text', updatedTransaction.category);
      cy.get('td')
        .eq(3)
        .should(
          'have.text',
          `${new Date().toLocaleDateString('pt-BR')} ${new Date().getHours()}:${
            new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
          }`
        );
    });
  });

  it("can't show deleted transactions in transactions list table", () => {
    const transaction: Transaction = {
      id: undefined,
      title: 'Retirada do Mês',
      amount: 1026.72,
      type: TransactionType.Withdraw,
      category: 'Gastos',
      createdAt: undefined,
    };

    // create a transaction
    cy.createTransaction(transaction);

    cy.wait(1000);
    cy.get('.content table tbody tr:last td:last .actions span.delete').click();
    cy.get('.p-confirm-dialog .p-dialog-footer button.p-confirm-dialog-accept').click();

    cy.wait(1000);
    cy.get('.content table tbody tr').within(() => {
      cy.root().should('have.length', 1);

      cy.get('td')
        .should('have.text', 'Nenhuma transação foi encontrada...')
        .and('have.length', 1)
        .and('have.attr', 'colspan');
    });
  });
});
