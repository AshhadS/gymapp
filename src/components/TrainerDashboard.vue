<template>
  <div>
    <h1>Trainer Dashboard</h1>
    <v-btn @click="handleLogout">
        Logout
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const handleLogout = () => {
  authStore.logout();
};
</script>