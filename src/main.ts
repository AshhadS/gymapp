import './assets/main.css' // Base CSS including Tailwind

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura'; // Example theme, adjust as needed

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark', // Optional: if you use dark mode toggle
            cssLayer: false
        }
    }
});
app.use(ToastService);


app.mount('#app')
