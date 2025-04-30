import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth'; // Import auth store

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Import MDI icons

const vuetify = createVuetify({
  components,
  directives,
   icons: {
    defaultSet: 'mdi', // Ensure MDI icons are used
  },
})

const app = createApp(App);
const pinia = createPinia(); // Create pinia instance

app.use(pinia); // Use pinia before using the store

// Initialize the auth store and check persisted login state
const authStore = useAuthStore(pinia); // Pass pinia instance
authStore.checkPersistedLogin();


app.use(router);
app.use(vuetify);

app.mount('#app');
