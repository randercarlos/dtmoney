<template>
  <div class="summary">
    <div>
      <header>
        <p>Entradas</p>
        <img :src="incomeImg" alt="Entradas" />
      </header>
      <b class="income"> {{ formatToBRCurrency(totalDepositsSum) }} </b>
    </div>
    <div>
      <header>
        <p>Saídas</p>
        <img :src="outcomeImg" alt="Saídas" />
      </header>
      <b class="outcome"> {{ formatToBRCurrency(totalWithdrawsSum) }}</b>
    </div>
    <div class="highlight-background">
      <header>
        <p>Total</p>
        <img :src="totalImg" alt="Total" />
      </header>
      <b> {{ formatToBRCurrency(totalSum) }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
  import incomeImg from '@/assets/img/income.svg';
  import outcomeImg from '@/assets/img/outcome.svg';
  import totalImg from '@/assets/img/total.svg';

  import { useTransactionService } from '@/support/services/transaction.service';
  import { useStore } from '@/stores';
  import { ref, onMounted, watch } from 'vue';
  import Toaster from '@/support/utils/toaster';
  import { Transaction } from '@/support/interfaces/transaction.interface';
  import { formatToBRCurrency } from '@/support/utils/brazilian-format';
  import { TransactionType } from '@/support/enums/transaction-type.enum';
  import { storeToRefs } from 'pinia';
  import { computed } from '@vue/reactivity';

  const store = useStore();
  const transactionService = useTransactionService();
  const transactions = ref<Transaction[]>([]);
  const { reloadTransactions } = storeToRefs(store);

  onMounted(() => loadTransactions());

  watch(reloadTransactions, (newValue: boolean) => {
    if (newValue) {
      loadTransactions();
    }
  });

  async function loadTransactions(): Promise<void> {
    try {
      const { data, statusCode } = await transactionService.all();

      if (statusCode.value === 200) {
        transactions.value = data.value.transactions;
      }
    } catch (e: Error) {
      Toaster.error('Erro ao listar transações!');
    } finally {
      store.deactivateTransactionsReload();
    }
  }

  const totalDepositsSum = computed<number>(() => {
    if (transactions.value.length === 0) {
      return 0;
    }

    return transactions.value
      .filter((transaction: Transaction) => transaction.type === TransactionType.Deposit)
      .map((transaction: Transaction) => transaction.amount as number)
      .reduce((totalDeposits: number, amount: number) => totalDeposits + amount, 0);
  });

  const totalWithdrawsSum = computed<number>(() => {
    if (transactions.value.length === 0) {
      return 0;
    }

    return transactions.value
      .filter((transaction: Transaction) => transaction.type === TransactionType.Withdraw)
      .map((transaction: Transaction) => transaction.amount as number)
      .reduce((totalWithdraws: number, amount: number) => totalWithdraws + amount, 0);
  });

  const totalSum = computed(() => totalDepositsSum.value - totalWithdrawsSum.value);
</script>

<style lang="scss" scoped>
  div.summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: -10rem;

    div {
      background: var(--shape);
      padding: 1.5rem 2rem;
      border-radius: 0.25rem;
      color: var(--text-title);

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      b {
        display: block;
        margin-top: 1rem;
        font-size: 2rem;
        font-weight: 500;
        line-height: 3rem;

        &.income {
          color: green;
        }

        &.outcome {
          color: crimson;
        }
      }

      &.highlight-background {
        background: var(--green);
        color: #ffffff;
      }
    }
  }
</style>
