<template>
  <header>
    <div class="header">
      <div class="logo-title">
        <img :src="logoimg" alt="dt money" />
        <h2>Gerenciador de Finanças</h2>
      </div>

      <button type="button" @click="openModal()">Nova Transação</button>
    </div>
  </header>
</template>

<script setup lang="ts">
  import logoimg from '@/assets/img/logo3.svg';
  import { useStore } from '@/stores';

  function openModal() {
    const store = useStore();

    store.clearSelectedTransaction();
    store.openTransactionalFormModal();
  }
</script>

<style lang="scss" scoped>
  header {
    background: var(--blue);

    div.header {
      max-width: 1120px;
      margin: 0 auto;

      padding: 2rem 1rem 12rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      div.logo-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      }

      h2 {
        margin-left: 1rem;
        color: var(--background);
      }

      button {
        font-size: 1rem;
        color: #fff;
        background: var(--blue-light);
        border: 0;
        padding: 0 2rem;
        border-radius: 0.25rem;
        height: 3rem;

        transition: filter 0.2s;

        &:hover {
          filter: brightness(0.9);
        }
      }
    }
  }
</style>
