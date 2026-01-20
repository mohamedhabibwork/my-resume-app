import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

/**
 * Composable for authentication
 * Provides reactive auth state and helper functions
 */
export function useAuth() {
  const store = useAuthStore()

  const isAuthenticated = computed(() => store.isAuthenticated)
  const user = computed(() => store.user)
  const userData = computed(() => store.userData)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)
  const isEmailVerified = computed(() => store.isEmailVerified)

  return {
    // State
    isAuthenticated,
    user,
    userData,
    isLoading,
    error,
    isEmailVerified,
    // Actions
    signInWithEmail: store.signInWithEmail,
    signUpWithEmail: store.signUpWithEmail,
    signInWithProvider: store.signInWithProvider,
    signOut: store.signOut,
    sendPasswordReset: store.sendPasswordReset,
    updateProfile: store.updateProfile,
    deleteAccount: store.deleteAccount,
    resendVerificationEmail: store.resendVerificationEmail,
  }
}
