<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast';
</script>

<template>
  <div class="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-background text-foreground font-sans antialiased">
    <RouterView />
    <Toast position="bottom-right" />
  </div>
</template>

<style scoped>
/* Add any App-specific styles here */
</style>
