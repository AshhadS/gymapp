<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="secondary" dark flat>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSignup">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                prepend-icon="mdi-lock-check"
                type="password"
                required
                :rules="[passwordConfirmationRule]"
              ></v-text-field>
               <v-radio-group v-model="role" inline label="Register as" required>
                 <v-radio label="Client" value="client"></v-radio>
                 <v-radio label="Trainer" value="trainer"></v-radio>
               </v-radio-group>
              <v-alert v-if="errorMessage" type="error" dense dismissible>
                {{ errorMessage }}
              </v-alert>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="secondary">Sign Up</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
          <v-card-text>
            Already have an account? <router-link to="/login">Login</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref<'client' | 'trainer' | null>(null); // Track selected role
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const passwordConfirmationRule = computed(() => {
  return () => (password.value === confirmPassword.value) || 'Passwords must match';
});

const handleSignup = () => {
  errorMessage.value = ''; // Reset error message
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
   if (!role.value) {
    errorMessage.value = 'Please select a role.';
    return;
  }

  // Basic validation (replace with actual API call)
  if (username.value && password.value && role.value) {
    // Simulate successful signup and login
     const userData = { username: username.value, role: role.value }; // Include role
    authStore.login(userData); // Log in the user after signup

    // Redirect based on role
    if (role.value === 'trainer') {
      router.push('/trainer');
    } else {
      router.push('/client');
    }
  } else {
    errorMessage.value = 'Please fill in all fields.';
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 80vh;
}
</style>
