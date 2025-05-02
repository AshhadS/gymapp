<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title class="text-h5 mb-4">Trainer Profile</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submitProfile">
          <v-row>
            <!-- Left Column -->
            <v-col cols="12" md="6">
              <v-textarea
                v-model="profile.bio"
                label="Bio/Experience Summary"
                required
                :rules="[v => !!v || 'Bio is required']"
                rows="3"
                auto-grow
                variant="outlined"
                class="mb-4"
              ></v-textarea>

              <v-select
                v-model="profile.specializations"
                :items="specializationOptions"
                label="Specializations"
                multiple
                chips
                clearable
                required
                :rules="[v => v.length > 0 || 'At least one specialization is required']"
                variant="outlined"
                class="mb-4"
              ></v-select>

              <v-textarea
                v-model="profile.methodology"
                label="Training Methodology/Philosophy"
                required
                :rules="[v => !!v || 'Methodology is required']"
                rows="3"
                auto-grow
                variant="outlined"
                class="mb-4"
              ></v-textarea>
            </v-col>

            <!-- Right Column -->
            <v-col cols="12" md="6">
               <v-text-field
                v-model="profile.certificationsText"
                label="Certifications (List)"
                placeholder="e.g., NASM CPT, CSCS"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <!-- Add v-file-input for certification uploads if needed -->
              <!-- <v-file-input
                v-model="profile.certificationFiles"
                label="Upload Certifications (Optional)"
                multiple
                chips
                clearable
                variant="outlined"
                class="mb-4"
              ></v-file-input> -->

              <v-text-field
                v-model="profile.availability"
                label="Availability"
                placeholder="e.g., Mon-Fri 9am-5pm PST"
                required
                :rules="[v => !!v || 'Availability is required']"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-file-input
                v-model="profile.profilePicture"
                label="Profile Picture"
                accept="image/*"
                prepend-icon="mdi-camera"
                variant="outlined"
                show-size
                clearable
                @change="onFileChange"
                class="mb-4"
              ></v-file-input>
               <v-img
                v-if="profilePicturePreview"
                :src="profilePicturePreview"
                max-height="150"
                contain
                class="mt-2 mb-4 rounded border"
              ></v-img>
            </v-col>
          </v-row>

          <v-card-actions class="pa-0 mt-4">
             <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!valid" type="submit">
              Save Profile
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { VForm } from 'vuetify/components' // Import VForm type if needed for ref typing

const form = ref<InstanceType<typeof VForm> | null>(null) // Ref for the form
const valid = ref(false) // Form validity state
const profilePicturePreview = ref<string | null>(null); // For image preview

const profile = reactive({
  bio: '',
  specializations: [] as string[],
  certificationsText: '',
  // certificationFiles: [] as File[], // Uncomment if using file upload for certs
  methodology: '',
  availability: '',
  profilePicture: [] as File[], // Vuetify v-file-input uses an array even for single file
})

const specializationOptions = [
  'Powerlifting',
  'Bodybuilding',
  'Olympic Weightlifting',
  'General Strength & Conditioning',
  'CrossFit',
  'Functional Training',
  'Rehabilitation',
  'Nutrition Coaching',
]

const onFileChange = (event: Event) => {
  const file = profile.profilePicture[0]; // Get the first file if present
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicturePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    profilePicturePreview.value = null; // Clear preview if file is removed
  }
};


const submitProfile = async () => {
  if (form.value) {
    const { valid } = await form.value.validate()
    if (valid) {
      console.log('Trainer profile submitted:', profile)
      // Here you would typically send the data to your backend API
      // e.g., await api.saveTrainerProfile(profile);
      alert('Profile saved successfully! (Check console for data)');
    } else {
        console.log('Form is invalid');
    }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
.v-card {
  max-width: 800px; /* Adjust max-width as needed */
  margin: auto;
}
.border {
  border: 1px solid #e0e0e0; /* Simple border for the preview */
}
</style>
