<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/i18n'
import Input from '@/components/ui/Input.vue'

const { t } = useI18n()
const { sendPasswordReset, isLoading, error } = useAuth()

const email = ref('')
const emailError = ref('')
const success = ref(false)

function validateEmail() {
  if (!email.value) {
    emailError.value = t('auth.emailRequired')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = t('validation.email')
    return false
  }
  emailError.value = ''
  return true
}

async function handleSubmit() {
  if (!validateEmail()) {
    return
  }

  try {
    await sendPasswordReset(email.value)
    success.value = true
  } catch {
    // Error is handled by store
  }
}
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="handleSubmit"
  >
    <!-- Error Alert -->
    <div
      v-if="error"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Success Alert -->
    <div
      v-if="success"
      role="alert"
      class="alert alert-success"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Password reset email has been sent. Please check your inbox.</span>
    </div>

    <p class="text-sm text-base-content/70">
      Enter your email address and we'll send you a link to reset your password.
    </p>

    <Input
      v-model="email"
      type="email"
      :label="t('auth.email')"
      :error="emailError"
      required
      :disabled="isLoading || success"
      @blur="validateEmail"
    />

    <button
      type="submit"
      class="btn btn-primary btn-block"
      :disabled="isLoading || success"
    >
      <span
        v-if="isLoading"
        class="loading loading-spinner loading-sm"
      />
      {{ t('auth.resetPassword') }}
    </button>

    <p class="text-center text-sm text-base-content/70">
      Remember your password?
      <router-link
        to="/login"
        class="link link-primary font-medium"
      >
        {{ t('auth.login') }}
      </router-link>
    </p>
  </form>
</template>
