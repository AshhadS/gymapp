<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Fitness App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/about">About</v-btn>
      <v-btn v-if="!authStore.isLoggedIn" text to="/login">Login</v-btn>
      <v-btn v-if="!authStore.isLoggedIn" text to="/signup">Sign Up</v-btn>
      <v-btn v-if="authStore.isLoggedIn" @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login') // Redirect to login after logout
}
</script>

<style scoped>
/* Add any specific styles for App.vue if needed */
.v-btn {
  margin: 0 5px;
}
</style>
