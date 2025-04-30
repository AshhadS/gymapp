<template>
  <v-container class="login-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4">
          <v-form @submit.prevent="handleSubmit">
            <h2 class="login-title">Login</h2>
            <v-text-field
              v-model="form.username"
              label="Username"
              type="text"
              variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.password"
              label="Password"
              type="password"
              variant="outlined"
              required
            ></v-text-field>
            <v-btn type="submit" color="orange" block>Login</v-btn>
          </v-form>
          <p class="mt-4">
            Don't have an account?
            <router-link to="/signup" class="text-black">Sign up here</router-link>
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const form = reactive({
  username: '',
  password: '',
});

const handleSubmit = () => {
  console.log('Username:', form.username);
  console.log('Password:', form.password);
  authStore.login();
  router.push('/trainer');
};
</script>

<style scoped>
.login-title {
  color: #14213D;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E5E5E5;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  gap: 10px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  color: #000000;
}

.form-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
button {
  background-color: #FCA311;
  color: #FFFFFF;
  padding: 10px;
}

a {
  color: #000000;
  text-decoration: none;
}
</style>