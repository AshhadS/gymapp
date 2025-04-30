<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-container>
        <div class="d-flex align-center">
          <v-btn to="/" variant="text" class="text-white">Home</v-btn>
          <v-btn to="/about" variant="text" class="text-white">About</v-btn>
          <v-btn to="/login" variant="text" class="text-white">Login</v-btn>
          <v-btn to="/signup" variant="text" class="text-white">Signup</v-btn>
        </div>
      </v-container>
    </v-app-bar>
    <v-main>
        <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
