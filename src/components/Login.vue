<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Username"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                required
                :error-messages="authStore.error && authStore.error.includes('username') ? authStore.error : ''"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
                 :error-messages="authStore.error && authStore.error.includes('password') || authStore.error && authStore.error.includes('Invalid Credentials') ? authStore.error : ''"
              ></v-text-field>
              <v-alert v-if="authStore.error && !authStore.error.includes('username') && !authStore.error.includes('password') && !authStore.error.includes('Invalid Credentials')" type="error" dense class="mb-4">
                {{ authStore.error }}
              </v-alert>
               <v-progress-linear
                indeterminate
                color="primary"
                v-if="authStore.loading"
                class="mb-3"
              ></v-progress-linear>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
             <v-btn color="secondary" text @click="goToSignup">Sign Up</v-btn>
            <v-btn color="primary" @click="handleLogin" :disabled="authStore.loading">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await authStore.login({ username: username.value, password: password.value });
  if (success && authStore.user) {
     // Redirect based on role
     if (authStore.user.role === 'trainer') {
        router.push('/trainer');
     } else if (authStore.user.role === 'client') {
        router.push('/client');
     } else {
        router.push('/'); // Fallback redirect
     }
  }
  // Error handling is done via authStore.error in the template
};

const goToSignup = () => {
  router.push('/signup');
};
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
