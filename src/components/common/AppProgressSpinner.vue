<template>
  <ProgressSpinner />
</template>

<script setup lang="ts">
  import ProgressSpinner from 'primevue/progressspinner';
</script>

<style lang="scss" scoped>
  @keyframes p-progress-spinner-color {
    100%,
    0% {
      stroke: var(--text-body) !important;
    }
    40% {
      stroke: var(--text-body) !important;
    }
    66% {
      stroke: var(--text-body) !important;
    }
    80%,
    90% {
      stroke: var(--text-body) !important;
    }
  }
</style>
