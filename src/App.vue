<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Fitness App</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text :to="{ name: 'home' }" v-if="!authStore.isLoggedIn">Home</v-btn>
      <v-btn text :to="{ name: 'about' }" v-if="!authStore.isLoggedIn">About</v-btn>

       <!-- Show dashboard link based on role -->
      <v-btn text :to="{ name: 'client' }" v-if="authStore.isLoggedIn && authStore.user?.role === 'client'">Dashboard</v-btn>
      <v-btn text :to="{ name: 'trainer' }" v-if="authStore.isLoggedIn && authStore.user?.role === 'trainer'">Dashboard</v-btn>


      <v-btn text :to="{ name: 'login' }" v-if="!authStore.isLoggedIn">Login</v-btn>
      <v-btn text :to="{ name: 'signup' }" v-if="!authStore.isLoggedIn">Sign Up</v-btn>

      <v-btn text @click="logout" v-if="authStore.isLoggedIn">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app color="secondary" class="pa-3">
      <span class="black--text">&copy; {{ new Date().getFullYear() }} Fitness App</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.signOut();
  router.push('/login'); // Redirect to login after logout
};

// Check persisted login state when the app loads
onMounted(() => {
    // authStore.checkPersistedLogin();
});

</script>

<style scoped>
/* Add styles for NavLink if needed, or rely on Vuetify defaults */
.v-btn {
  margin: 0 5px;
}
.black--text {
    color: #000000 !important; /* Ensure footer text is black */
}
</style>
