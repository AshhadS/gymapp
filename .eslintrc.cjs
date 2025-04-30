/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
   rules: {
    // Add specific rules or overrides here if needed
    'vue/multi-word-component-names': 'off', // Allow single-word component names like App.vue
     'vue/no-unused-vars': 'warn', // Warn about unused variables in <script setup>
     '@typescript-eslint/no-unused-vars': 'warn', // Warn about unused TS variables
     'no-unused-vars': 'off', // Disable base no-unused-vars rule
  }
};
