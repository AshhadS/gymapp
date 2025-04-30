import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    login(userData: any) {
      this.isLoggedIn = true;
      this.user = userData;
    },
    logout(): void {
      const router = useRouter();
      this.isLoggedIn = false;
      this.user = null;
      router.push('/login');
    },
  },
});