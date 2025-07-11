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
    background: '#FFFFFF', // White background
    surface: '#FFFFFF',    // White surface
    primary: '#FCA311',    // Orange as primary
    secondary: '#E5E5E5',  // Light grey as secondary
    'on-primary': '#000000', // Black text on orange primary for contrast
    'on-secondary': '#000000', // Black text on light grey secondary
    'on-background': '#000000', // Black text on white background
    'on-surface': '#000000',   // Black text on white surface
    // Standard colors - keep them or adjust if needed
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00', // This is close to primary, consider adjusting if needed
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

// Initialize the auth store AFTER pinia is used by the app
const authStore = useAuthStore();
// No need to call checkPersistedLogin here, it's called in App.vue's onMounted


app.use(router);
app.use(vuetify);

app.mount('#app');
