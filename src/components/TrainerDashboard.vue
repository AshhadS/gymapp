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
               <!-- <v-file-input multiple label="Upload Certifications (Optional)" /> -->

              <v-textarea
                v-model="profile.methodology"
                label="Training Methodology/Philosophy"
                auto-grow
                rows="2"
                class="mt-4"
              ></v-textarea>

              <v-text-field
                v-model="profile.availability"
                label="Availability (e.g., Mon-Fri 9am-5pm EST)"
                 class="mt-4"
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
import type { VCombobox } from 'vuetify/components'; // Import type if needed for complex logic


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


const loading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'Required.',
  requiredArray: (value: string[]) => value.length > 0 || 'At least one item is required.',
};

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


const fetchProfile = async () => {
  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  try {
    const response = await apiClient.get('/profiles/me');
    const data = response.data as TrainerProfileData;

    profile.bio = data.bio;
    // Ensure arrays are initialized correctly even if empty in DB
    profile.specializations = data.specializations || [];
    profile.certifications = data.certifications || [];
    profile.methodology = data.methodology || '';
    profile.availability = data.availability || '';
    profile.profilePictureUrl = data.profilePictureUrl || null;

  } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status !== 404) {
          console.error('Error fetching profile:', error.response?.data || error.message);
          errorMessage.value = 'Failed to load profile data.';
      } else if (!error.response) {
           console.error('Error fetching profile:', error.message);
           errorMessage.value = 'An unexpected error occurred.';
      }
      // 404 is acceptable, means profile needs creation.
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
   // Basic frontend validation
   if (!profile.bio || profile.specializations.length === 0) {
       errorMessage.value = 'Please fill in required fields (Bio, Specializations).';
       return;
   }

  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  // TODO: If profilePictureUrl contains a local data URL (from preview),
  // it should be uploaded first to get a persistent URL before saving the profile.
  // For now, we assume profilePictureUrl is either null or a valid, persistent URL.
   if (profile.profilePictureUrl && profile.profilePictureUrl.startsWith('data:image')) {
       console.warn("Attempting to save profile with local image data URL. Implement proper upload first.");
       // In a real app: call an upload function here, get the URL, update profile.profilePictureUrl
       // For this example, we'll just clear it to avoid saving the large data URI
       // profile.profilePictureUrl = null; // Or handle upload properly
       errorMessage.value = "Profile picture upload not implemented. Please remove the picture or implement server upload.";
       loading.value = false;
       return;
   }


  try {
    // Filter out empty strings potentially added by combobox UI if needed
    const profileDataToSend = {
      ...profile,
      specializations: profile.specializations.filter(s => s.trim() !== ''),
      certifications: profile.certifications.filter(c => c.trim() !== ''),
    };

    const response = await apiClient.post('/profiles/trainer', profileDataToSend);
    const data = response.data as TrainerProfileData;

     // Update local state with response from backend
    profile.bio = data.bio;
    profile.specializations = data.specializations || [];
    profile.certifications = data.certifications || [];
    profile.methodology = data.methodology || '';
    profile.availability = data.availability || '';
    profile.profilePictureUrl = data.profilePictureUrl || null;

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
   if (authStore.isLoggedIn && authStore.user?.role === 'trainer') {
    fetchProfile();
   }
});
</script>

<style scoped>
/* Add specific styles if needed */
</style>
