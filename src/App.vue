<template>
  <TheHeader />
  <Dashboard />

  <TransactionalFormModal v-if="store.showTransactionalFormModal" />
  <Toast />
  <BlockUI :blocked="store.showScreenLoading" :fullScreen="true"></BlockUI>
</template>

<script setup lang="ts">
  import TheHeader from '@/components/TheHeader.vue';
  import Dashboard from '@/components/Dashboard.vue';
  import TransactionalFormModal from '@/components/TransactionalFormModal.vue';
  import Toast from 'primevue/toast';
  import BlockUI from 'primevue/blockui';
  import { useStore } from './stores';

  const store = useStore();
</script>

<style lang="scss" scoped></style>
