/// <reference types="cypress" />
import { TransactionType } from '@/support/enums/transaction-type.enum';
import { Transaction } from '@/support/interfaces/transaction.interface';

describe('Transaction Form Modal', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('header .header button').click({ force: true });
  });

  afterEach(() => {
    const selector = '.p-component-overlay .p-dialog .p-dialog-content .react-modal-close';

    if (Cypress.$(selector).length > 0) {
      cy.get(selector).click({ force: true });
    }
  });

  context('Show Form', () => {
    it('show transaction form modal', () => {
      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('h2').should('have.text', 'Cadastrar Transação');
        cy.get('input').first().should('have.attr', 'placeholder', 'Título');
        cy.get('input').eq(1).should('have.attr', 'placeholder', 'Valor');
        cy.get('div.transaction-type button').should('have.length', 2);
        cy.get('input').eq(2).should('have.attr', 'placeholder', 'Categoria');
        cy.get('button[type="submit"]').should('have.length', 1);
      });
    });

    it('show transaction form modal for editing with values', () => {
      const existingTransaction: Transaction = {
        id: undefined,
        title: 'Renda de Investimentos',
        amount: 203.14,
        type: TransactionType.Deposit,
        category: 'Ganhos',
        createdAt: undefined,
      };

      // create a transaction
      cy.createTransaction(existingTransaction);

      // click on edit transaction button
      cy.wait(2000);
      cy.get('main .content table tbody tr:first td:last .actions .edit').click();

      cy.get('.p-component-overlay .p-dialog .p-dialog-content').within(() => {
        cy.root().should('be.visible');

        cy.get('form h2').should('have.text', 'Editar Transação');
        cy.get('form input[placeholder="Título"]').should('have.value', existingTransaction.title);
        cy.get('form input[placeholder="Valor"]').should('have.value', 'R$ 203,14');
        cy.get('form div.transaction-type button').should(
          'have.class',
          existingTransaction.type === TransactionType.Deposit ? 'income' : 'outcome'
        );
        cy.get('form input[placeholder="Categoria"]').should(
          'have.value',
          existingTransaction.category
        );
        cy.get('form button[type="submit"]').should('be.enabled');
      });
    });
  });

  context('Invalid Form', () => {
    it('cant save a new transaction without required fields', () => {
      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('input[placeholder="Título"]').focus().clear().blur();
        cy.get('input[placeholder="Título"] + p.error')
          .should('be.visible')
          .and('include.text', 'obrigatório');

        cy.get('input[placeholder="Valor"]').focus().clear().blur();
        cy.get('input[placeholder="Valor"] + p.error')
          .should('be.visible')
          .and('include.text', 'obrigatório');

        cy.get('input[placeholder="Categoria"]').focus().clear().blur();
        cy.get('input[placeholder="Categoria"] + p.error')
          .should('be.visible')
          .and('include.text', 'obrigatório');

        cy.get('button[type="submit"]').should('be.disabled');
      });
    });

    it('cant save a new transaction without minimum characters', () => {
      const invalidTransaction: Partial<Transaction> = {
        title: 'ab',
        amount: 1.0,
        category: 'bc',
      };

      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('input[placeholder="Título"]')
          .focus()
          .clear()
          .type(invalidTransaction.title as string)
          .blur();
        cy.get('input[placeholder="Título"] + p.error')
          .should('be.visible')
          .and('include.text', 'mínimo');

        cy.get('input[placeholder="Valor"]')
          .focus()
          .clear()
          .type(String(invalidTransaction.amount))
          .blur();

        cy.get('input[placeholder="Categoria"]')
          .focus()
          .clear()
          .type(invalidTransaction.category as string)
          .blur();
        cy.get('input[placeholder="Categoria"] + p.error')
          .should('be.visible')
          .and('include.text', 'mínimo');

        cy.get('button[type="submit"]').should('be.disabled');
      });
    });

    it('cant save a new transaction above the maximum character limit', () => {
      const invalidTransaction: Partial<Transaction> = {
        title:
          'Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. ',
        amount: 1.0,
        category:
          'Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. Testando o limite máximo de caracteres. ',
      };

      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('input[placeholder="Título"]')
          .focus()
          .clear()
          .type(invalidTransaction.title as string)
          .blur();
        cy.get('input[placeholder="Título"] + p.error')
          .should('be.visible')
          .and('include.text', 'máximo');

        cy.get('input[placeholder="Valor"]')
          .focus()
          .clear()
          .type(String(invalidTransaction.amount))
          .blur();

        cy.get('input[placeholder="Categoria"]')
          .focus()
          .clear()
          .type(invalidTransaction.category as string)
          .blur();
        cy.get('input[placeholder="Categoria"] + p.error')
          .should('be.visible')
          .and('include.text', 'máximo');

        cy.get('button[type="submit"]').should('be.disabled');
      });
    });

    it('cant save a new transaction with title already existing', () => {
      const existingTransaction: Transaction = {
        id: undefined,
        title: 'Salario',
        amount: 1705.2,
        type: TransactionType.Deposit,
        category: 'Entradas',
        createdAt: undefined,
      };

      // create a transaction
      cy.createTransaction(existingTransaction);

      const invalidTransaction: Transaction = {
        id: undefined,
        title: 'Salario',
        amount: 1705.2,
        type: TransactionType.Deposit,
        category: 'Entradas',
        createdAt: undefined,
      };

      cy.wait(2000);
      cy.get('header .header button').click({ force: true });
      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('input[placeholder="Título"]')
          .focus()
          .clear()
          .type(invalidTransaction.title as string)
          .blur();

        cy.get('input[placeholder="Valor"]')
          .focus()
          .clear()
          .type(String(invalidTransaction.amount))
          .blur();

        cy.get('.transaction-type button').first().click();

        cy.get('input[placeholder="Categoria"]')
          .focus()
          .clear()
          .type(invalidTransaction.category as string)
          .blur();

        cy.get('button[type="submit"]').click();
      });

      cy.get('.p-toast .p-toast-message').should('have.class', 'p-toast-message-warn');
    });

    it('cant save a new transaction with title already existing, but different type', () => {
      const existingTransaction: Transaction = {
        id: undefined,
        title: 'Salario Mensal',
        amount: 1705.2,
        type: TransactionType.Deposit,
        category: 'Entradas',
        createdAt: undefined,
      };

      // create a transaction
      cy.createTransaction(existingTransaction);

      const invalidTransaction: Transaction = {
        id: undefined,
        title: 'Salario Mensal',
        amount: 1705.2,
        type: TransactionType.Withdraw,
        category: 'Entradas',
        createdAt: undefined,
      };

      cy.wait(2000);
      cy.get('header .header button').click({ force: true });
      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('input[placeholder="Título"]')
          .focus()
          .clear()
          .type(invalidTransaction.title as string)
          .blur();

        cy.get('input[placeholder="Valor"]')
          .focus()
          .clear()
          .type(String(invalidTransaction.amount))
          .blur();

        cy.get('.transaction-type button').first().click();

        cy.get('input[placeholder="Categoria"]')
          .focus()
          .clear()
          .type(invalidTransaction.category as string)
          .blur();

        cy.get('button[type="submit"]').click();
      });

      cy.get('.p-toast .p-toast-message').should('have.class', 'p-toast-message-warn');
    });
  });

  context('Valid Form', () => {
    it('can save a new deposit type transaction', () => {
      const depositTransaction: Partial<Transaction> = {
        title: 'Faturamento Mensal',
        amount: 2123.45,
        type: 'deposit',
        category: 'Vendas',
      };

      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('input[placeholder="Título"]')
          .focus()
          .clear()
          .type(depositTransaction.title as string)
          .blur();
        cy.get('input[placeholder="Título"] + p.error').should('not.exist');

        cy.get('.transaction-type button')
          .first()
          .within(() => {
            cy.root().click();
            cy.root().should('have.class', 'income');
          });
        cy.get('.transaction-type + p.error').should('not.exist');

        cy.get('input[placeholder="Valor"]')
          .focus()
          .clear()
          .type(String(depositTransaction.amount))
          .blur();
        cy.get('input[placeholder="Valor"] + p.error').should('not.exist');

        cy.get('input[placeholder="Categoria"]')
          .focus()
          .clear()
          .type(depositTransaction.category as string)
          .blur();
        cy.get('input[placeholder="Categoria"] + p.error').should('not.exist');

        cy.get('button[type="submit"]').should('be.enabled').click();
      });

      cy.get('.p-toast .p-toast-message').should('have.class', 'p-toast-message-success');
    });

    it('can save a new withdraw type transaction', () => {
      const withdrawTransaction: Partial<Transaction> = {
        title: 'Plano de Saúde',
        amount: 514.21,
        type: 'withdraw',
        category: 'Gastos',
      };

      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('input[placeholder="Título"]')
          .focus()
          .clear()
          .type(withdrawTransaction.title as string)
          .blur();
        cy.get('input[placeholder="Título"] + p.error').should('not.exist');

        cy.get('.transaction-type button')
          .last()
          .within(() => {
            cy.root().click();
            cy.root().should('have.class', 'outcome');
          });
        cy.get('.transaction-type + p.error').should('not.exist');

        cy.get('input[placeholder="Valor"]')
          .focus()
          .clear()
          .type(String(withdrawTransaction.amount))
          .blur();
        cy.get('input[placeholder="Valor"] + p.error').should('not.exist');

        cy.get('input[placeholder="Categoria"]')
          .focus()
          .clear()
          .type(withdrawTransaction.category as string)
          .blur();
        cy.get('input[placeholder="Categoria"] + p.error').should('not.exist');

        cy.get('button[type="submit"]').should('be.enabled').click();
      });

      cy.get('.p-toast .p-toast-message').should('have.class', 'p-toast-message-success');
    });

    it('can update a withdraw type transaction to type deposit', () => {
      const existingTransaction: Transaction = {
        id: undefined,
        title: 'Despesas do Mês',
        amount: 2010.72,
        type: TransactionType.Withdraw,
        category: 'Gastos',
        createdAt: undefined,
      };

      // create a transaction
      cy.createTransaction(existingTransaction);

      const updatedTransaction: Transaction = {
        id: undefined,
        title: 'Gastos do Mês',
        amount: 4273.32,
        type: TransactionType.Deposit,
        category: 'Gastos',
        createdAt: undefined,
      };

      // click on edit transaction button
      cy.get('main .content table tbody tr:last td:last .actions .edit').click();

      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('h2').should('have.text', 'Editar Transação');

        cy.get('input[placeholder="Título"]').clear().type(updatedTransaction.title);
        cy.get('input[placeholder="Título"]').should('have.value', updatedTransaction.title);

        cy.get('input[placeholder="Valor"]').clear().type(String(updatedTransaction.amount));
        cy.get('input[placeholder="Valor"]').should('have.value', 'R$ 4.273,32');

        cy.get('div.transaction-type button:first').click();
        cy.get('div.transaction-type button').should(
          'have.class',
          updatedTransaction.type === TransactionType.Deposit ? 'income' : 'outcome'
        );

        cy.get('input[placeholder="Categoria"]').clear().type(updatedTransaction.category);
        cy.get('input[placeholder="Categoria"]').should('have.value', updatedTransaction.category);

        cy.get('button[type="submit"]').should('be.enabled');
        cy.get('button[type="submit"]').click();
      });

      cy.get('.p-toast .p-toast-message').should('have.class', 'p-toast-message-success');
    });

    it('can update a deposit type transaction to type withdraw', () => {
      const existingTransaction: Transaction = {
        id: undefined,
        title: 'Ganhos do Mês',
        amount: 3451.72,
        type: TransactionType.Deposit,
        category: 'Renda',
        createdAt: undefined,
      };

      // create a transaction
      cy.createTransaction(existingTransaction);

      const updatedTransaction: Transaction = {
        id: undefined,
        title: 'Gastos do Mês',
        amount: 4273.32,
        type: TransactionType.Withdraw,
        category: 'Gastos',
        createdAt: undefined,
      };

      // click on edit transaction button
      cy.wait(3000);
      cy.get('main .content table tbody tr:last td:last .actions .edit').click();

      cy.get('.p-component-overlay .p-dialog .p-dialog-content form').within(() => {
        cy.get('h2').should('have.text', 'Editar Transação');

        cy.get('input[placeholder="Título"]').clear().type(updatedTransaction.title);
        cy.get('input[placeholder="Título"]').should('have.value', updatedTransaction.title);

        cy.wait(1000);
        cy.get('input[placeholder="Valor"]').clear().type(String(updatedTransaction.amount));
        cy.get('input[placeholder="Valor"]').should('have.value', 'R$ 4.273,32');

        cy.get('div.transaction-type button:last').click();
        cy.get('div.transaction-type button').should(
          'have.class',
          updatedTransaction.type === TransactionType.Deposit ? 'income' : 'outcome'
        );

        cy.get('input[placeholder="Categoria"]').clear().type(updatedTransaction.category);
        cy.get('input[placeholder="Categoria"]').should('have.value', updatedTransaction.category);

        cy.get('button[type="submit"]').should('be.enabled');
        cy.get('button[type="submit"]').click();
      });

      cy.get('.p-toast .p-toast-message').should('have.class', 'p-toast-message-success');
    });
  });
});
