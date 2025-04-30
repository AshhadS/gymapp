<template>
  <div class="client-dashboard">
    <h1 class="dashboard-title">Client Dashboard</h1>
    <v-btn class="logout-button" @click="handleLogout">
      Logout
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
.client-dashboard {
  background-color: #E5E5E5;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dashboard-title {
  color: #14213D;
  margin-bottom: 20px;
}
.logout-button {  
}
</style>