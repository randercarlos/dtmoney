<template>
  <Dialog
    v-model:visible="store.showTransactionalFormModal"
    :modal="true"
    closable
    :showHeader="false"
    :draggable="false"
    position="center"
    :style="{ 'max-width': '576px' }"
    :hide="resetForm()"
  >
    <button type="button" class="react-modal-close" @click="closeModal()">
      <img :src="closeIcon" alt="Fechar modal" />
    </button>

    <form @submit.prevent="saveTransaction()">
      <h2 class="title">{{ form.id ? 'Editar' : 'Cadastrar' }} Transação</h2>

      <input
        type="text"
        placeholder="Título"
        v-model.trim="form.title"
        maxlength="100"
        @blur="v$.title.$touch"
      />
      <template v-if="v$.title.$error">
        <p v-for="error in v$.title.$errors" class="error">{{ error.$message }}</p>
      </template>

      <input
        type="text"
        placeholder="Valor"
        v-model.number.lazy="form.amount"
        v-money3="configMoneyMask"
        maxlength="25"
        @blur="v$.amount.$touch"
        id="value"
      />
      <template v-if="v$.amount.$error">
        <p v-for="error in v$.amount.$errors" class="error">{{ error.$message }}</p>
      </template>

      <div class="transaction-type">
        <button
          type="button"
          @click="setTransationType(TransactionType.Deposit)"
          :class="{ income: isDepositTransactionType() }"
        >
          <img :src="incomeImg" alt="Entrada" />
          <span>Entrada</span>
        </button>

        <button
          type="button"
          @click="setTransationType(TransactionType.Withdraw)"
          :class="{ outcome: !isDepositTransactionType() }"
        >
          <img :src="outcomeImg" alt="Saída" />
          <span>Saída</span>
        </button>
      </div>
      <template v-if="v$.type.$error">
        <p v-for="error in v$.type.$errors" class="error">{{ error.$message }}</p>
      </template>

      <input
        placeholder="Categoria"
        v-model.trim="form.category"
        maxlength="100"
        @blur="v$.category.$touch"
      />
      <template v-if="v$.category.$error">
        <p v-for="error in v$.category.$errors" class="error">{{ error.$message }}</p>
      </template>

      <button type="submit" :disabled="v$.$invalid">{{ form.id ? 'Salvar' : 'Cadastrar' }}</button>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import useVuelidate from '@vuelidate/core';
  import { required, helpers, minLength, maxLength } from '@vuelidate/validators';
  import Dialog from 'primevue/dialog';
  import Toaster from '@/support/utils/toaster';
  import closeIcon from '@/assets/img/close.svg';
  import incomeImg from '@/assets/img/income.svg';
  import outcomeImg from '@/assets/img/outcome.svg';
  import { useStore } from '@/stores';
  import { useTransactionService } from '@/support/services/transaction.service';
  import { Transaction } from '@/support/interfaces/transaction.interface';
  import { TransactionType } from '@/support/enums/transaction-type.enum';
  import {
    configMoneyMask,
    unformatMoneyMask,
    correctVMoneyBug,
  } from '@/support/utils/brazilian-format';
  import { handleResponseError } from '@/support/utils/handle-response';

  const store = useStore();
  const transactionService = useTransactionService();

  type createTransaction = Partial<Transaction>;
  const form = ref<Transaction>({
    id: undefined,
    title: '',
    amount: 0,
    type: TransactionType.Deposit,
    category: '',
    createdAt: undefined,
  });
  const typeValidation = (value: TransactionType) => Object.values(TransactionType).includes(value);
  const formRules = {
    id: {},
    title: {
      required: helpers.withMessage('Título é obrigatório.', required),
      minLength: helpers.withMessage(
        ({ $params }) => `Título precisa ter no mínimo ${$params.min} caracteres`,
        minLength(3)
      ),
      maxLength: helpers.withMessage(
        ({ $params }) => `Título deve ter no máximo ${$params.max} caracteres`,
        maxLength(60)
      ),
    },
    amount: {
      required: helpers.withMessage('Valor é obrigatório', required),
      minLength: helpers.withMessage(
        ({ $params }) => `Valor precisa ter no mínimo ${$params.min} caracteres`,
        minLength(3)
      ),
    },
    type: {
      required: helpers.withMessage('Tipo é obrigatório.', required),
      typeValidation,
    },
    category: {
      required: helpers.withMessage('Categoria é obrigatório.', required),
      minLength: helpers.withMessage(
        ({ $params }) => `Categoria precisa ter no mínimo ${$params.min} caracteres`,
        minLength(3)
      ),
      maxLength: helpers.withMessage(
        ({ $params }) => `Categoria deve ter no máximo ${$params.max} caracteres`,
        maxLength(60)
      ),
    },
    createdAt: {},
  };
  const v$ = useVuelidate(formRules, form.value);

  onMounted(() => {
    if (store.selectedTransaction) {
      form.value.id = store.selectedTransaction.id;
      form.value.title = store.selectedTransaction.title;
      form.value.amount = correctVMoneyBug(store.selectedTransaction.amount);
      form.value.type = store.selectedTransaction.type;
      form.value.category = store.selectedTransaction.category;
      form.value.createdAt = store.selectedTransaction.createdAt;
    }
  });

  function resetForm(): void {
    form.value.id = undefined;
    form.value.title = '';
    form.value.amount = 0;
    form.value.type = TransactionType.Deposit;
    form.value.category = '';
    form.value.createdAt = undefined;
  }

  function closeModal(): void {
    resetForm();
    store.closeTransactionalFormModal();
  }

  function setTransationType(transactionType: TransactionType): void {
    form.value.type = transactionType;
  }

  function isDepositTransactionType(): boolean {
    return form.value.type === TransactionType.Deposit;
  }

  async function validateForm(): Promise<void> {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
      Toaster.error('Form possui valores inválidos!');
      return;
    }
  }

  async function saveTransaction(): Promise<void> {
    try {
      store.openScreenLoading();

      validateForm();

      const payload: createTransaction = {
        ...form.value,
        amount: Number(unformatMoneyMask(String(form.value.amount))),
      };

      const { data, response } = await transactionService.save(payload);

      if (!response?.value?.ok) {
        handleResponseError(response, data);
        return;
      }

      Toaster.success('Registro salvo com sucesso!');
    } catch (e) {
      Toaster.error('Erro ao criar transação!');
    } finally {
      store.closeScreenLoading();
      closeModal();
      store.activeTransactionsReload();
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.p-dialog .p-dialog-content) {
    background: var(--background) !important;
    padding: 0 1.5rem 2rem 1.5rem !important;
  }

  form {
    div {
      margin-bottom: 1rem;

      &.error {
        border: 1px solid crimson;
      }

      div.error-msg {
        font-size: 8px;
        color: crimson;
        margin-left: 10px;
      }
    }

    h2.title {
      font-family: 'Poppins', sans-serif;
      color: var(--text-tittle) !important;
      font-size: 1.5rem !important;
      margin-bottom: 1rem !important;
    }

    input {
      width: 100%;
      padding: 0 1.5rem;
      height: 4rem;
      border-radius: 0.25rem;

      border: 1px solid #d7d7d7;
      background: #e7e9ee;

      font-weight: 400;
      font-size: 1rem;
      margin-top: 1rem;

      &::placeholder {
        color: var(--text-body);
      }
    }

    p.error {
      padding-top: 0.2rem;
      padding-left: 0.5rem;
      font-size: 14px;
      color: crimson;
      display: inline-block;
    }

    button[type='submit'] {
      width: 100%;
      padding: 0 1.5rem;
      height: 4rem;
      background: var(--green);
      color: #fff;
      border-radius: 0.25rem;
      border: 0;
      font-size: 1rem;
      margin-top: 1.5rem;
      font-weight: 600;

      transition: filter 0.2s;

      &:hover {
        filter: brightness(0.9);
      }
    }

    div.transaction-type {
      margin: 1rem 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;

      button {
        height: 4rem;
        border: 1px solid #d7d7d7;
        border-radius: 0.25rem;

        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s;

        &:hover {
          border: 1px solid #d7d7d7;
        }

        &.income {
          background: rgba(51, 204, 149, 0.2);
        }

        &.outcome {
          background: rgba(229, 46, 77, 0.1);
        }

        img {
          width: 20px;
          height: 20px;
        }

        span {
          display: inline-block;
          margin-left: 1rem;
          font-size: 1rem;
          color: var(--text-title);
        }
      }
    }
  }
</style>
