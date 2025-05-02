<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Client Dashboard</h1>
        <p v-if="authStore.user">Welcome, {{ authStore.user.username }}!</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title>Your Information</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveProfile">
              <v-text-field
                v-model="profile.fullName"
                label="Full Name"
                required
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                v-model.number="profile.age"
                label="Age"
                type="number"
                required
                 :rules="[rules.required, rules.positiveNumber]"
              ></v-text-field>
               <v-select
                v-model="profile.gender"
                :items="genders"
                label="Gender"
                required
                :rules="[rules.required]"
              ></v-select>
              <v-text-field
                v-model.number="profile.weight"
                label="Weight (kg)"
                type="number"
                required
                 :rules="[rules.required, rules.positiveNumber]"
              ></v-text-field>
              <v-text-field
                v-model.number="profile.height"
                label="Height (cm)"
                type="number"
                required
                :rules="[rules.required, rules.positiveNumber]"
              ></v-text-field>

              <v-alert v-if="errorMessage" type="error" dense class="mt-4">
                {{ errorMessage }}
              </v-alert>
               <v-alert v-if="successMessage" type="success" dense class="mt-4">
                {{ successMessage }}
              </v-alert>

               <v-progress-linear
                indeterminate
                color="primary"
                v-if="loading"
                class="my-3"
              ></v-progress-linear>

              <v-btn type="submit" color="primary" class="mt-4" :disabled="loading">
                Save Profile
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/services/api';
import type { AxiosError } from 'axios';

const authStore = useAuthStore();

interface ClientProfileData {
  fullName: string;
  age: number | null;
  gender: string;
  weight: number | null;
  height: number | null;
}

const profile = reactive<ClientProfileData>({
  fullName: '',
  age: null,
  gender: '',
  weight: null,
  height: null,
});

const genders = ref(['Male', 'Female', 'Other', 'Prefer not to say']);
const loading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);


// Validation rules
const rules = {
  required: (value: any) => !!value || 'Required.',
  positiveNumber: (value: number) => value > 0 || 'Must be a positive number.',
};

const fetchProfile = async () => {
  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  try {
    const response = await apiClient.get('/profiles/me'); // Endpoint to get current user's profile
    const data = response.data as ClientProfileData;
    // Update reactive profile data
    profile.fullName = data.fullName;
    profile.age = data.age;
    profile.gender = data.gender;
    profile.weight = data.weight;
    profile.height = data.height;

  } catch (err) {
     const error = err as AxiosError;
     // It's okay if profile not found (404), means it needs to be created
    if (error.response && error.response.status !== 404) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        errorMessage.value = 'Failed to load profile data.';
    } else if (!error.response) {
        console.error('Error fetching profile:', error.message);
        errorMessage.value = 'An unexpected error occurred.';
    }
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
   // Basic frontend validation check
  if (!profile.fullName || !profile.age || !profile.gender || !profile.weight || !profile.height || profile.age <= 0 || profile.weight <= 0 || profile.height <= 0) {
    errorMessage.value = 'Please fill in all fields correctly.';
    return;
  }

  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const response = await apiClient.post('/profiles/client', profile);
    // Optionally update profile state again if backend modifies data
    const data = response.data as ClientProfileData;
    profile.fullName = data.fullName;
    profile.age = data.age;
    profile.gender = data.gender;
    profile.weight = data.weight;
    profile.height = data.height;

    successMessage.value = 'Profile saved successfully!';

  } catch (err) {
    const error = err as AxiosError<{ msg?: string }>;
    console.error('Error saving profile:', error.response?.data || error.message);
    errorMessage.value = error.response?.data?.msg || 'Failed to save profile.';
  } finally {
    loading.value = false;
  }
};

// Fetch profile when the component mounts
onMounted(() => {
  if (authStore.isLoggedIn && authStore.user?.role === 'client') {
    fetchProfile();
  }
});
</script>

<style scoped>
/* Add specific styles if needed */
</style>
