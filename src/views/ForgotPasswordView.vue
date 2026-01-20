<script setup lang="ts">
import { useI18n } from '@/i18n'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-base-content">
          {{ t('auth.resetPassword') }}
        </h1>
        <p class="mt-2 text-base-content/70">
          Enter your email to reset your password
        </p>
      </div>
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  </div>
</template>
