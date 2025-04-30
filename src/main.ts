import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth'; // Import auth store

// Vuetify
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Import MDI icons

// Define the custom theme
const myCustomTheme: ThemeDefinition = {
  dark: false, // or true if you want a dark theme by default
  colors: {
    background: '#FFFFFF', // Example background, adjust if needed
    surface: '#FFFFFF', // Example surface, adjust if needed
    primary: '#FCA311', // User requested primary color
    'primary-darken-1': '#E89005', // Example darker shade
    secondary: '#FCA311', // User requested secondary color
    'secondary-darken-1': '#E89005', // Example darker shade
    error: '#B00020', // Standard error color
    info: '#2196F3', // Standard info color
    success: '#4CAF50', // Standard success color
    warning: '#FB8C00', // Standard warning color
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme,
    },
  },
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
