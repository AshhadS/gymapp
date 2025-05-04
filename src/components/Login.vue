<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="onSubmit">

              <v-text-field
                v-model="email"
                label="Email"
                prepend-icon="mdi-email"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required />
              <v-btn color="primary" type="submit">Login</v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="goToSignup">Sign Up</v-btn>          
          </v-card-actions>
        </v-card>
      </v-col>    
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router';


const email = ref('')
const password = ref('')
  
const authStore = useAuthStore();
const router = useRouter();

const onSubmit = async () => {
    try {
        await authStore.signIn(email.value, password.value);
        if(authStore.user?.trainer)
          router.push('/trainer')
        else
          router.push('/client')
    } catch (error) {
        console.log(error);
    }
};

const goToSignup = () => {
    router.push('/signup');
};
</script>
