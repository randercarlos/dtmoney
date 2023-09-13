import { Transaction } from './../support/interfaces/transaction.interface';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { computed } from '@vue/reactivity';

export const useStore = defineStore('store', () => {
  const showTransactionalFormModal = ref(false);
  const showScreenLoading = ref(false);
  const reloadTransactions = ref(false);
  const selectedTransaction = ref<Transaction | null>(null);

  function openTransactionalFormModal(): void {
    showTransactionalFormModal.value = true;
  }

  function closeTransactionalFormModal(): void {
    showTransactionalFormModal.value = false;
  }

  function openScreenLoading(): void {
    showScreenLoading.value = true;
  }

  function closeScreenLoading(): void {
    showScreenLoading.value = false;
  }

  function activeTransactionsReload(): void {
    reloadTransactions.value = true;
  }

  function deactivateTransactionsReload(): void {
    reloadTransactions.value = false;
  }

  function setSelectedTransaction(transaction: Transaction | null): void {
    selectedTransaction.value = transaction;
  }

  function clearSelectedTransaction() {
    selectedTransaction.value = null;
  }

  return {
    openTransactionalFormModal,
    closeTransactionalFormModal,
    showTransactionalFormModal,
    showScreenLoading,
    openScreenLoading,
    closeScreenLoading,
    reloadTransactions,
    activeTransactionsReload,
    deactivateTransactionsReload,
    selectedTransaction,
    setSelectedTransaction,
    clearSelectedTransaction,
  };
});
