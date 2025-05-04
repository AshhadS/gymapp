<template>
  
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Trainer Dashboard</h1>
        <p v-if="authStore.user">Welcome, {{ authStore.user.username }}!</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title>Your Profile</v-card-title> 
          <v-card-text>
            <v-form @submit.prevent="saveProfile">
              <!-- Profile Picture Upload Placeholder -->
              <v-file-input
                label="Profile Picture (Optional)"
                prepend-icon="mdi-camera"
                accept="image/*"
                @change="handleFileUpload"
                class="mb-4"
                hint="Feature not fully implemented"
                persistent-hint
              ></v-file-input>
              <!-- Display uploaded image preview if needed -->
               <v-img v-if="profile.profilePictureUrl" :src="profile.profilePictureUrl" max-height="150" contain class="mb-4"></v-img>


              <v-textarea
                v-model="profile.bio"
                label="Bio/Experience Summary"
                required
                :rules="[rules.required]"
                auto-grow
                rows="3"
              ></v-textarea>

              <v-combobox
                v-model="profile.specializations"
                label="Specializations (e.g., powerlifting, bodybuilding)"
                multiple
                chips
                closable-chips
                :items="suggestedSpecializations"
                hint="Type and press Enter to add new specializations"
                persistent-hint
                 :rules="[rules.requiredArray]"
              ></v-combobox>

              <v-combobox
                 v-model="profile.certifications"
                 label="Certifications (List or Upload Placeholder)"
                 multiple
                 chips
                 closable-chips
                 hint="Type and press Enter to add certifications. File upload coming soon."
                 persistent-hint
                 class="mt-4"
               ></v-combobox>
               <!-- Actual file upload for certifications would require backend storage setup -->
              <v-text-field
                v-model="profile.availability"
                label="Availability (e.g., Mon-Fri 9am-5pm EST)"
                 class="mt-4"
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
              <v-btn
                type="button" color="secondary" class="mt-4" @click="saveProfile"
                :disabled="loading"
              >
                Save Example Data
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';import { doc, setDoc } from 'firebase/firestore';

import { db } from '@/firebase';


const authStore = useAuthStore();

interface TrainerProfileData {
  bio: string;
  specializations: string[];
  certifications: string[];
  methodology: string;
  availability: string;
  profilePictureUrl: string | null; // Store URL
}

const profile = reactive<TrainerProfileData>({
  bio: '',
  specializations: [],
  certifications: [],
  methodology: '',
  availability: '',
  profilePictureUrl: null, // Initialize as null
});

// Example suggestions for combobox
const suggestedSpecializations = ref([
    'Powerlifting', 'Bodybuilding', 'Olympic Weightlifting', 'General Strength & Conditioning', 'Weight Loss', 'Functional Training', 'Sports Performance', 'Rehabilitation'
]);

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'Required.',
  requiredArray: (value: string[]) => value.length > 0 || 'At least one item is required.',
};

const loading = ref(false);


const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    // Basic client-side preview (doesn't upload yet)
    const reader = new FileReader();
    reader.onload = (e) => {
        // For now, just setting the URL for display.
        // Actual upload needs backend integration (e.g., to S3 or similar)
        // and then storing the returned URL.
        profile.profilePictureUrl = e.target?.result as string;
        console.warn("Profile picture preview set. Actual upload to server not implemented.");
        // TODO: Implement actual file upload logic here, post to a dedicated endpoint,
        // get back the URL, and then set profile.profilePictureUrl to that URL before saving the profile.
    };
    reader.readAsDataURL(file);

  } else {
     profile.profilePictureUrl = null; // Clear preview if file removed
  }
};



const saveProfile = async () => {
  loading.value = true;

  // TODO: If profilePictureUrl contains a local data URL (from preview),
  // it should be uploaded first to get a persistent URL before saving the profile.
  // For now, we assume profilePictureUrl is either null or a valid, persistent URL.
  if (!authStore.user?.uid) {
  if (!profile.bio || profile.specializations.length === 0) return;
    console.error("No user logged in.");
    return;
  }
    const docRef = doc(db, 'profiles', authStore.user.uid);
  try {
    // Filter out empty strings potentially added by combobox UI if needed
    await setDoc(docRef, {
      ...profile,
      specializations: profile.specializations.filter(s => s.trim() !== ''),
      certifications: profile.certifications.filter(c => c.trim() !== ''),
    });
  } catch (err) {
    console.error('Error saving profile:', err);
  } finally {
     loading.value = false;
       nextTick();
  }
};


</script>

