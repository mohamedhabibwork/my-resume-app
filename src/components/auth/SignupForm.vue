<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/i18n'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const { t } = useI18n()
const { signUpWithEmail, signInWithProvider, isLoading, error } = useAuth()

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const displayNameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const termsError = ref('')

function validateDisplayName() {
  if (!displayName.value.trim()) {
    displayNameError.value = t('validation.required')
    return false
  }
  displayNameError.value = ''
  return true
}

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

function validatePassword() {
  if (!password.value) {
    passwordError.value = t('auth.passwordRequired')
    return false
  }
  if (password.value.length < 8) {
    passwordError.value = t('auth.passwordMinLength')
    return false
  }
  passwordError.value = ''
  return true
}

function validateConfirmPassword() {
  if (!confirmPassword.value) {
    confirmPasswordError.value = t('validation.required')
    return false
  }
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = t('auth.passwordMismatch')
    return false
  }
  confirmPasswordError.value = ''
  return true
}

async function handleSubmit() {
  if (!validateDisplayName() || !validateEmail() || !validatePassword() || !validateConfirmPassword()) {
    return
  }

  if (!acceptTerms.value) {
    termsError.value = t('validation.required')
    return
  }
  termsError.value = ''

  try {
    await signUpWithEmail(email.value, password.value, displayName.value)
    router.push('/dashboard')
  } catch {
    // Error is handled by store
  }
}

async function handleSocialLogin(provider: 'google' | 'github' | 'microsoft' | 'apple') {
  try {
    await signInWithProvider(provider)
    router.push('/dashboard')
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

    <Input
      v-model="displayName"
      type="text"
      label="Display Name"
      :error="displayNameError"
      required
      :disabled="isLoading"
      @blur="validateDisplayName"
    />

    <Input
      v-model="email"
      type="email"
      :label="t('auth.email')"
      :error="emailError"
      required
      :disabled="isLoading"
      @blur="validateEmail"
    />

    <Input
      v-model="password"
      type="password"
      :label="t('auth.password')"
      :error="passwordError"
      required
      :disabled="isLoading"
      @blur="validatePassword"
    />

    <Input
      v-model="confirmPassword"
      type="password"
      :label="t('auth.confirmPassword')"
      :error="confirmPasswordError"
      required
      :disabled="isLoading"
      @blur="validateConfirmPassword"
    />

    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-3">
        <input
          v-model="acceptTerms"
          type="checkbox"
          class="checkbox checkbox-primary"
          :disabled="isLoading"
        />
        <span class="label-text">I accept the Terms and Conditions</span>
      </label>
      <p
        v-if="termsError"
        class="text-error text-sm mt-1"
      >
        {{ termsError }}
      </p>
    </div>

    <button
      type="submit"
      class="btn btn-primary btn-block"
      :disabled="isLoading"
    >
      <span
        v-if="isLoading"
        class="loading loading-spinner loading-sm"
      />
      {{ t('auth.register') }}
    </button>

    <div class="divider">
      {{ t('common.or') }}
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        class="btn btn-outline"
        :disabled="isLoading"
        @click="handleSocialLogin('google')"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>
      <button
        type="button"
        class="btn btn-outline"
        :disabled="isLoading"
        @click="handleSocialLogin('github')"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        GitHub
      </button>
      <button
        type="button"
        class="btn btn-outline"
        :disabled="isLoading"
        @click="handleSocialLogin('microsoft')"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
        </svg>
        Microsoft
      </button>
      <button
        type="button"
        class="btn btn-outline"
        :disabled="isLoading"
        @click="handleSocialLogin('apple')"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
        Apple
      </button>
    </div>

    <p class="text-center text-sm text-base-content/70">
      {{ t('auth.hasAccount') }}
      <router-link
        to="/login"
        class="link link-primary font-medium"
      >
        {{ t('auth.login') }}
      </router-link>
    </p>
  </form>
</template>
