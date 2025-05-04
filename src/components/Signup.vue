<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4">
          <v-form @submit.prevent="onSubmit">
            <h2 class="text-center mb-4">Signup</h2>
            <v-text-field v-model="email" label="Email" type="email" variant="outlined" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" variant="outlined" required></v-text-field>
            <v-btn type="submit" color="primary" block class="mt-4">Signup</v-btn>
          </v-form>
          <router-link to="/login">
            <p class="text-center mt-4">Already have an account? Login here</p>
          </router-link>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const onSubmit = async () => {
  try {
    await authStore.signUp(email.value, password.value);
    router.push('/trainer');
  } catch (error) {
    console.error('Signup error:', error);
  }
};

</script>