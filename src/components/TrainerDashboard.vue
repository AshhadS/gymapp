<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">Trainer Dashboard</v-card-title>
      <v-card-subtitle>Welcome, {{ authStore.user?.username }}!</v-card-subtitle>

      <v-card-text>
        <p>Manage your clients, workout plans, and schedule.</p>

        <!-- Placeholder for future features -->
        <v-list dense>
          <v-list-subheader>Features (Coming Soon)</v-list-subheader>
          <v-list-item>
            <v-list-item-title>Client Management</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Workout Plan Creation</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Session Scheduling</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

       <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="error" @click="logout">Logout</v-btn>
       </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
</style>
