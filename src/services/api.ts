import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// Base URL for the backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'; // Use environment variable or default

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Get store instance
    // const token = authStore.token; // Access token from store state
    // if (token) {
    //   config.headers['x-auth-token'] = token;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response, // Simply return successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      const authStore = useAuthStore();
      // authStore.logout(); // Logout the user
      // Optionally redirect - needs access to router, might be better handled in components
      // router.push('/login');
      console.error('Unauthorized access - logging out.');
    }
    return Promise.reject(error); // Reject the promise for other errors
  }
);

export default apiClient;
