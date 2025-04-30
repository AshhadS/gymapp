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
                name="login"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
              <v-alert v-if="errorMessage" type="error" dense dismissible>
                {{ errorMessage }}
              </v-alert>
               <v-radio-group v-model="role" inline label="Role" required>
                 <v-radio label="Client" value="client"></v-radio>
                 <v-radio label="Trainer" value="trainer"></v-radio>
               </v-radio-group>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">Login</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
           <v-card-text>
            Don't have an account? <router-link to="/signup">Sign Up</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const role = ref<'client' | 'trainer' | null>(null); // Track selected role
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = () => {
  errorMessage.value = ''; // Reset error message
   if (!role.value) {
    errorMessage.value = 'Please select a role.';
    return;
  }
  // Basic validation (replace with actual API call)
  if (username.value && password.value) {
    // Simulate successful login
    const userData = { username: username.value, role: role.value }; // Include role
    authStore.login(userData);

     // Redirect based on role
    if (role.value === 'trainer') {
      router.push('/trainer');
    } else {
      router.push('/client');
    }
  } else {
    errorMessage.value = 'Invalid username or password';
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 80vh;
}
</style>
