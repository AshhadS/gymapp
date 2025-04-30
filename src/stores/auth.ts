import { defineStore } from 'pinia';
// Removed useRouter import as it's handled in components now

interface User {
  username: string;
  role: 'client' | 'trainer'; // Add role to user type
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null, // Use the User interface
  }),
  actions: {
    login(userData: User) { // Expect User type
      this.isLoggedIn = true;
      this.user = userData;
       // Persist login state (optional, consider localStorage/sessionStorage)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
    },
    logout(): void {
      this.isLoggedIn = false;
      this.user = null;
       // Clear persisted state
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      // Navigation is handled in components/App.vue after calling logout
    },
     // Action to check persisted login state on app load
    checkPersistedLogin() {
      const storedUser = localStorage.getItem('user');
      const storedLoggedIn = localStorage.getItem('isLoggedIn');

      if (storedUser && storedLoggedIn === 'true') {
        try {
          this.user = JSON.parse(storedUser);
          this.isLoggedIn = true;
        } catch (e) {
          console.error('Error parsing stored user data:', e);
          // Clear invalid stored data
          this.logout();
        }
      }
    }
  },
});
