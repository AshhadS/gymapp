<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5 text-center mb-4">Client Information</v-card-title>
          <v-card-text>
            <v-form ref="clientInfoForm" @submit.prevent="submitForm">
              <v-text-field
                v-model="formData.fullName"
                label="Full Name"
                :rules="[rules.required]"
                required
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model.number="formData.age"
                label="Age"
                type="number"
                :rules="[rules.required, rules.positive]"
                required
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-select
                v-model="formData.gender"
                :items="genderOptions"
                label="Gender"
                :rules="[rules.required]"
                required
                variant="outlined"
                class="mb-3"
              ></v-select>

              <v-text-field
                v-model.number="formData.weight"
                label="Weight (kg)"
                type="number"
                :rules="[rules.required, rules.positive]"
                required
                variant="outlined"
                class="mb-3"
                suffix="kg"
              ></v-text-field>

              <v-text-field
                v-model.number="formData.height"
                label="Height (cm)"
                type="number"
                :rules="[rules.required, rules.positive]"
                required
                variant="outlined"
                class="mb-3"
                suffix="cm"
              ></v-text-field>

              <v-btn type="submit" color="primary" block :loading="loading">Submit Information</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
     <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { VForm } from 'vuetify/components'; // Correct type import for VForm

const clientInfoForm = ref<InstanceType<typeof VForm> | null>(null); // Use InstanceType for ref type
const loading = ref(false);
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});

const formData = reactive({
  fullName: '',
  age: null as number | null,
  gender: '',
  weight: null as number | null,
  height: null as number | null,
});

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

const rules = {
  required: (value: any) => !!value || 'This field is required.',
  positive: (value: number) => value > 0 || 'Value must be positive.',
};

const submitForm = async () => {
  loading.value = true;
  const { valid } = await clientInfoForm.value!.validate(); // Use ! since we expect it to be defined on submit

  if (valid) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Form submitted:', formData);
    // In a real app, you would send this data to your backend API
    snackbar.text = 'Information submitted successfully!';
    snackbar.color = 'success';
    snackbar.show = true;
    // Optionally reset the form
    // clientInfoForm.value!.reset();
    // Object.assign(formData, { fullName: '', age: null, gender: '', weight: null, height: null });
  } else {
    console.log('Form validation failed');
    snackbar.text = 'Please fill in all required fields correctly.';
    snackbar.color = 'error';
    snackbar.show = true;
  }
  loading.value = false;
};
</script>

<style scoped>
/* Add any component-specific styles here */
.mb-3 {
  margin-bottom: 1rem; /* Adjust spacing as needed */
}
</style>

    