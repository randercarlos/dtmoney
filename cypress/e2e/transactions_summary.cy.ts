/// <reference types="cypress" />
import { TransactionType } from './../../src/support/enums/transaction-type.enum';
import { Transaction } from './../../src/support/interfaces/transaction.interface';

describe('Transactions Summary', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('show empty values for incomes, outcomes and total by default', () => {
    cy.checkTransactionsSummaryValues('R$ 0,00', 'R$ 0,00', 'R$ 0,00');
  });

  it('increase incomes after create deposit transactions', () => {
    const depositTransaction: Transaction = {
      id: undefined,
      title: 'Monthly Income',
      amount: 2010.72,
      type: TransactionType.Deposit,
      category: 'Earnings',
      createdAt: undefined,
    };

    const depositTransaction2: Transaction = {
      id: undefined,
      title: 'Earnings',
      amount: 305.01,
      type: TransactionType.Deposit,
      category: 'Income',
      createdAt: undefined,
    };

    const depositTransaction3: Transaction = {
      id: undefined,
      title: 'Profits',
      amount: 3.01,
      type: TransactionType.Deposit,
      category: 'Income',
      createdAt: undefined,
    };

    cy.createTransaction(depositTransaction);

    cy.wait(2000);
    cy.createTransaction(depositTransaction2);

    cy.wait(2000);
    cy.createTransaction(depositTransaction3);

    cy.checkTransactionsSummaryValues('R$ 2.318,74', 'R$ 0,00', 'R$ 2.318,74');
  });

  it('increase outcome after create withdraw transactions', () => {
    const withdrawTransaction: Transaction = {
      id: undefined,
      title: 'Monthly Expenses',
      amount: 2010.72,
      type: TransactionType.Withdraw,
      category: 'Expenses',
      createdAt: undefined,
    };

    const withdrawTransaction2: Transaction = {
      id: undefined,
      title: 'Outgoing',
      amount: 305.01,
      type: TransactionType.Withdraw,
      category: 'Outcome',
      createdAt: undefined,
    };

    const withdrawTransaction3: Transaction = {
      id: undefined,
      title: 'Loss',
      amount: 3.01,
      type: TransactionType.Withdraw,
      category: 'Outcome',
      createdAt: undefined,
    };

    cy.createTransaction(withdrawTransaction);

    cy.wait(2000);
    cy.createTransaction(withdrawTransaction2);

    cy.wait(2000);
    cy.createTransaction(withdrawTransaction3);

    cy.checkTransactionsSummaryValues('R$ 0,00', 'R$ 2.318,74', 'R$ 2.318,74');
  });

  it('show income, outcome and total correctly after create deposit and withdraw transactions', () => {
    const withdrawTransaction: Transaction = {
      id: undefined,
      title: 'Monthly Expenses',
      amount: 2010.72,
      type: TransactionType.Withdraw,
      category: 'Expenses',
      createdAt: undefined,
    };

    const withdrawTransaction2: Transaction = {
      id: undefined,
      title: 'Outgoing',
      amount: 305.01,
      type: TransactionType.Withdraw,
      category: 'Outcome',
      createdAt: undefined,
    };

    const depositTransaction: Transaction = {
      id: undefined,
      title: 'Earnings',
      amount: 3982.01,
      type: TransactionType.Deposit,
      category: 'Income',
      createdAt: undefined,
    };

    const depositTransaction2: Transaction = {
      id: undefined,
      title: 'Profits',
      amount: 122.65,
      type: TransactionType.Deposit,
      category: 'Earnings',
      createdAt: undefined,
    };

    cy.createTransaction(withdrawTransaction);
    cy.wait(1000);
    cy.checkTransactionsSummaryValues('0,00', '2.010,72', '2.010,72');

    cy.wait(2000);
    cy.createTransaction(depositTransaction);
    cy.wait(1000);
    cy.checkTransactionsSummaryValues('3.982,01', '2.010,72', '1.971,29');

    cy.wait(2000);
    cy.createTransaction(withdrawTransaction2);
    cy.wait(1000);
    cy.checkTransactionsSummaryValues('3.982,01', '2.315,73', '1.666,28');

    cy.wait(2000);
    cy.createTransaction(depositTransaction2);
    cy.wait(1000);
    cy.checkTransactionsSummaryValues('4.104,66', '2.315,73', '1.788,93');
  });

  it('show income, outcome and total correctly after update deposit and withdraw transactions', () => {
    const withdrawTransaction: Transaction = {
      id: undefined,
      title: 'Monthly Expenses',
      amount: 2010.72,
      type: TransactionType.Withdraw,
      category: 'Expenses',
      createdAt: undefined,
    };

    const updateWithdrawTransaction: Transaction = {
      id: undefined,
      title: 'Outgoing',
      amount: 305.01,
      type: TransactionType.Withdraw,
      category: 'Outcome',
      createdAt: undefined,
    };

    const depositTransaction: Transaction = {
      id: undefined,
      title: 'Earnings',
      amount: 3982.01,
      type: TransactionType.Deposit,
      category: 'Income',
      createdAt: undefined,
    };

    const updatedDepositTransaction: Transaction = {
      id: undefined,
      title: 'Profits',
      amount: 122.65,
      type: TransactionType.Deposit,
      category: 'Earnings',
      createdAt: undefined,
    };

    cy.createTransaction(withdrawTransaction);
    cy.checkTransactionsSummaryValues('0,00', '2.010,72', '2.010,72');

    cy.createTransaction(depositTransaction);
    cy.checkTransactionsSummaryValues('3.982,01', '2.010,72', '1.971,29');

    cy.get('.content table tbody tr:first td:last .actions span.edit').click();
    cy.fillTransactionForm(updateWithdrawTransaction);
    cy.checkTransactionsSummaryValues('3.982,01', '305,01', '3.677,00');

    cy.get('.content table tbody tr:last td:last .actions span.edit').click();
    cy.fillTransactionForm(updatedDepositTransaction);
    cy.checkTransactionsSummaryValues('122,65', '305,01', '182,36');
  });

  it('show income, outcome and total correctly after delete transactions', () => {
    const withdrawTransaction: Transaction = {
      id: undefined,
      title: 'Monthly Expenses',
      amount: 2010.72,
      type: TransactionType.Withdraw,
      category: 'Expenses',
      createdAt: undefined,
    };

    const depositTransaction: Transaction = {
      id: undefined,
      title: 'Earnings',
      amount: 3982.01,
      type: TransactionType.Deposit,
      category: 'Income',
      createdAt: undefined,
    };

    cy.createTransaction(withdrawTransaction);
    cy.checkTransactionsSummaryValues('0,00', '2.010,72', '2.010,72');

    cy.createTransaction(depositTransaction);
    cy.checkTransactionsSummaryValues('3.982,01', '2.010,72', '1.971,29');

    // delete transaction
    cy.get('.content table tbody tr:first td:last .actions span.delete').click();
    cy.get('.p-confirm-dialog .p-dialog-footer button.p-confirm-dialog-accept').click();
    cy.checkTransactionsSummaryValues('3.982,01', '0,00', '3.982,01');

    // delete transaction
    cy.get('.content table tbody tr:first td:last .actions span.delete').click();
    cy.get('.p-confirm-dialog .p-dialog-footer button.p-confirm-dialog-accept').click();
    cy.checkTransactionsSummaryValues('0,00', '0,00', '0,00');
  });
});
