<template>
  <v-container>
    <v-row>
       <v-col>
         <v-btn @click="saveData" color="primary" class="float-right mr-4" >
          Save data example
          </v-btn>
          <v-btn color="orange" class="float-right" @click="authStore.signOut()">
                Logout
          </v-btn>


        </v-col>
    </v-row>
      <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Client Dashboard</h1>
        <p v-if="authStore.user">Welcome, {{ authStore.user.username }}!</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title>Your Information </v-card-title>
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

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuthStore } from '@/stores/auth'


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



// Validation rules
const rules = {
  required: (value: any) => !!value || 'Required.',
  positiveNumber: (value: number) => value > 0 || 'Must be a positive number.',
};

const saveProfile = async () => {
   // Basic frontend validation check
  if (!profile.fullName || !profile.age || !profile.gender || !profile.weight || !profile.height || profile.age <= 0 || profile.weight <= 0 || profile.height <= 0) {
    console.error('Please fill in all fields correctly.');
    return;
  }
  loading.value = true;
  const docRef = doc(db, 'profiles', authStore.user.uid);
  const data = {
    ...profile
  };

  try {
    await setDoc(docRef, data);
  } catch (error) {
     console.error('Error saving data:', error);
   } finally {
     loading.value = false;
  }
};

const saveData = async () => {
  if (!authStore.user?.uid) return;
  try {
    await setDoc(doc(db, 'profiles', authStore.user.uid), {
      example: 'example',
    });
    console.log('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
</script>

<style scoped>
/* Add specific styles if needed */
</style>
