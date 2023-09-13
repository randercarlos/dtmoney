<template>
  <main>
    <Summary />
    <TransactionsList />
  </main>
</template>

<script setup lang="ts">
  import Summary from '@/components/Summary.vue'
  import TransactionsList from '@/components/TransactionsList.vue'
</script>

<style lang="scss" scoped>
  main {
    max-width: 1120px;
    margin: 0 auto;
    padding: 2.5rem 1rem;
  }
</style>
