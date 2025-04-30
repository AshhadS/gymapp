<template>
  <v-container class="signup-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4" elevation="4">
          <v-form @submit.prevent="onSubmit">
            <h2 class="signup-title">Sign Up</h2>

            <v-text-field
              v-model="formData.username"
              label="Username"
              variant="outlined"
              class="mb-4"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.password"
              label="Password"
              type="password"
              variant="outlined"
              class="mb-4"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              class="mb-4"
              required
            ></v-text-field>

            <v-btn type="submit" color="#FCA311" block class="mb-4" dark>
              Sign Up
            </v-btn>

            <p class="text-center">
              Already have an account? <router-link to="/login">Login here</router-link>
            </p>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

const onSubmit = () => {
  if (formData.password !== formData.confirmPassword) {
    console.error('Passwords do not match');
    return;
  }

  authStore.login();
  router.push('/trainer');
};
</script>

<style scoped>
.signup-container {
  background-color: #E5E5E5;
  height: 100vh;
  width: 100vw;
}

.signup-title {
  color: #14213D;
  margin-bottom: 20px;
}
</style>