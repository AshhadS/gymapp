import { defineStore } from 'pinia';
import apiClient from '@/services/api'; // Import the api client
import type { AxiosError } from 'axios'; // Import AxiosError type

interface User {
  id?: string; // Add id from backend
  username: string;
  role: 'client' | 'trainer';
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null; // Store the JWT token
  error: string | null; // Store login/signup errors
  loading: boolean; // Indicate loading state
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null,
    token: localStorage.getItem('token') || null, // Initialize token from localStorage
    error: null,
    loading: false,
  }),
  actions: {
    setAuthData(token: string, userData: User) {
      this.isLoggedIn = true;
      this.user = userData;
      this.token = token;
      this.error = null; // Clear any previous errors
      localStorage.setItem('token', token);
      // Persist user data if needed, but token is usually sufficient
      // localStorage.setItem('user', JSON.stringify(userData));
    },
    clearAuthData() {
      this.isLoggedIn = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      // localStorage.removeItem('user');
    },
    async register(credentials: { username: string, password: string, role: 'client' | 'trainer' }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.post('/auth/register', credentials);
        const { token, user } = response.data;
        this.setAuthData(token, user);
        return true; // Indicate success
      } catch (err) {
        const error = err as AxiosError<{ errors?: { msg: string }[] }>; // Type assertion
        console.error('Registration failed:', error.response?.data || error.message);
        this.error = error.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
        this.clearAuthData();
        return false; // Indicate failure
      } finally {
        this.loading = false;
      }
    },
    async login(credentials: { username: string, password: string }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.post('/auth/login', credentials);
        const { token, user } = response.data;
        this.setAuthData(token, user);
        return true; // Indicate success
      } catch (err) {
         const error = err as AxiosError<{ errors?: { msg: string }[] }>; // Type assertion
        console.error('Login failed:', error.response?.data || error.message);
        this.error = error.response?.data?.errors?.[0]?.msg || 'Login failed. Check your credentials.';
        this.clearAuthData();
        return false; // Indicate failure
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.clearAuthData();
      // Navigation is handled in components (e.g., App.vue or where logout is called)
    },
    async checkPersistedLogin() {
      if (this.token) {
        // Optionally verify token with backend here
        // For simplicity, we'll assume the token is valid if present
        // A better approach is to make a '/api/auth/me' request to verify
        try {
            this.loading = true;
            const response = await apiClient.get('/auth'); // Verify token and get user data
            this.isLoggedIn = true;
            this.user = { // Map backend user data to frontend User interface
                id: response.data._id, // Assuming backend sends _id
                username: response.data.username,
                role: response.data.role
            };
            this.error = null;
            console.log("Persisted login successful", this.user)
        } catch (err) {
            console.warn('Token verification failed or token expired. Logging out.');
            this.clearAuthData(); // Clear invalid token and data
        } finally {
            this.loading = false;
        }
      } else {
        this.clearAuthData(); // Ensure clean state if no token
      }
    }
  },
});
