<template>
  <v-container>
    <v-card>
      <v-card-title class="headline">Welcome to the Fitness App</v-card-title>
      <v-card-text>
        <p>Your journey to fitness starts here. Log in or sign up to get started!</p>
        <p v-if="authStore.isLoggedIn">
          Welcome back, {{ authStore.user?.username || 'User' }}!
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!authStore.isLoggedIn" color="primary" to="/login">Login</v-btn>
        <v-btn v-if="!authStore.isLoggedIn" color="secondary" to="/signup">Sign Up</v-btn>
         <v-btn v-if="authStore.isLoggedIn && authStore.user?.role === 'trainer'" color="primary" to="/trainer">Trainer Dashboard</v-btn>
         <v-btn v-if="authStore.isLoggedIn && authStore.user?.role === 'client'" color="primary" to="/client">Client Dashboard</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
