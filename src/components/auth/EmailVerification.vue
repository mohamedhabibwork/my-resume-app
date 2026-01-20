<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Button from '@/components/ui/Button.vue'

const { resendVerificationEmail, isEmailVerified, isLoading, error } = useAuth()

const success = ref(false)

async function handleResend() {
  try {
    await resendVerificationEmail()
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch {
    // Error is handled by store
  }
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="!isEmailVerified"
      class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
    >
      <p class="text-sm text-yellow-800 mb-3">
        Please verify your email address. Check your inbox for a verification link.
      </p>
      <div
        v-if="error"
        class="mb-3 text-sm text-red-600"
      >
        {{ error }}
      </div>
      <div
        v-if="success"
        class="mb-3 text-sm text-green-600"
      >
        Verification email sent! Please check your inbox.
      </div>
      <Button
        variant="outline"
        :loading="isLoading"
        :disabled="isLoading"
        @click="handleResend"
      >
        Resend Verification Email
      </Button>
    </div>
    <div
      v-else
      class="p-4 bg-green-50 border border-green-200 rounded-lg"
    >
      <p class="text-sm text-green-800">
        Your email address has been verified.
      </p>
    </div>
  </div>
</template>
