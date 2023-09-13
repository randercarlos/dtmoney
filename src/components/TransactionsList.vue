<template>
  <div class="content">
    <table v-if="!isFetchingTransactions">
      <thead>
        <tr>
          <th class="align-left">Título</th>
          <th>Valor</th>
          <th>Categoria</th>
          <th style="width: 80px">Data</th>
          <th style="width: 40px">Ações</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="transactions.length > 0">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="align-left">{{ transaction.title }}</td>
            <td :class="transaction.type === TransactionType.Deposit ? 'deposit' : 'withdraw'">
              {{ formatToBRCurrency(transaction.amount) }}
            </td>
            <td>{{ transaction.category }}</td>
            <td>{{ formatToBRDate(transaction.createdAt) }}</td>
            <td>
              <div class="actions">
                <span class="material-symbols-outlined edit" @click="editTransaction(transaction)"
                  >edit</span
                >
                <span
                  class="material-symbols-outlined delete"
                  @click="confirmDeleteTransaction(transaction)"
                  >cancel</span
                >
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="5">Nenhuma transação foi encontrada...</td>
          </tr>
        </template>
      </tbody>
    </table>
    <AppProgressSpinner v-else></AppProgressSpinner>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
  import { useTransactionService } from '@/support/services/transaction.service';
  import { useStore } from '@/stores';
  import { ref, onMounted, watch } from 'vue';
  import Toaster from '@/support/utils/toaster';

  import { useConfirm } from 'primevue/useconfirm';
  import ConfirmDialog from 'primevue/confirmdialog';
  import AppProgressSpinner from '@/components/common/AppProgressSpinner.vue';
  import { Transaction } from '@/support/interfaces/transaction.interface';
  import { formatToBRCurrency, formatToBRDate } from '@/support/utils/brazilian-format';
  import { TransactionType } from '@/support/enums/transaction-type.enum';
  import { storeToRefs } from 'pinia';

  const store = useStore();
  const transactionService = useTransactionService();
  const transactions = ref<Transaction[]>([]);
  const isFetchingTransactions = ref<boolean>(false);
  const { reloadTransactions } = storeToRefs(store);
  const confirm = useConfirm();

  onMounted(() => loadTransactions());

  watch(reloadTransactions, (newValue: boolean) => {
    if (newValue) {
      loadTransactions();
    } else {
      store.deactivateTransactionsReload();
    }
  });

  async function loadTransactions(): Promise<void> {
    try {
      isFetchingTransactions.value = true;

      const { data, statusCode } = await transactionService.all();

      if (statusCode.value === 200) {
        transactions.value = data.value.transactions;
      }
    } catch (e) {
      Toaster.error('Erro ao listar transações!');
    } finally {
      isFetchingTransactions.value = false;
    }
  }

  function editTransaction(transaction: Transaction): void {
    store.setSelectedTransaction(transaction);
    store.openTransactionalFormModal();
  }

  function confirmDeleteTransaction(transaction: Transaction): void {
    confirm.require({
      message: `Deseja excluir a transação com título '${transaction.title}' ?`,
      header: 'Confirmação de Exclusão',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: async () => {
        await deleteTransaction(transaction);
      },
    });
  }

  async function deleteTransaction(transaction: Transaction): Promise<void> {
    try {
      store.openScreenLoading();
      const { statusCode } = await transactionService.destroy(transaction.id as number);

      if (statusCode.value === 204) {
        Toaster.success('Transação excluida com sucesso!');
        store.activeTransactionsReload();
      }
    } catch (e) {
      Toaster.error('Erro ao excluir transação!');
    } finally {
      store.closeScreenLoading();
    }
  }
</script>

<style lang="scss">
  .p-dialog-content {
    background: white !important;
    padding: 1rem !important;
  }
</style>

<style lang="scss" scoped>
  div.content {
    margin-top: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;

    table {
      width: 100%;
      border-spacing: 0 0.5rem;
      .align-left {
        text-align: left;
      }
      thead tr th,
      tbody tr td {
        text-align: center;
      }

      tbody tr td div.actions {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          font-size: 1.3rem;

          &.edit {
            color: gold;

            &:active {
              color: #b8860b;
            }
          }

          &.delete {
            color: crimson;

            &:active {
              color: #8b0000;
            }
          }
        }
      }
    }

    th {
      color: var(--text-body);
      font-weight: 400;
      padding: 1rem 2rem;
      text-align: left;
      line-height: 1.5rem;
    }

    td {
      padding: 1rem 2rem;
      border: 0;
      background-color: var(--shape);
      color: var(--text-body);
      border-radius: 0.25rem;

      &:first-child {
        color: var(--text-title);
      }

      &.deposit {
        color: var(--green);
      }

      &.withdraw {
        color: var(--red);
      }
    }
  }
</style>
