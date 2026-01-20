import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  deleteUser,
  onAuthStateChanged,
  type User as FirebaseUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth'
import { auth } from '@/config/firebase'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<FirebaseUser | null>(null)
  const userData = ref<User | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)
  const isEmailVerified = computed(() => user.value?.emailVerified ?? false)

  // Initialize auth state listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser
    isLoading.value = false

    if (firebaseUser) {
      // Map Firebase user to our User type
      userData.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? undefined,
        photoUrl: firebaseUser.photoURL ?? undefined,
        emailVerified: firebaseUser.emailVerified,
        timestamps: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    } else {
      userData.value = null
    }
  })

  // Actions
  async function signInWithEmail(email: string, password: string) {
    try {
      error.value = null
      isLoading.value = true
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to sign in'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function signUpWithEmail(email: string, password: string, displayName?: string) {
    try {
      error.value = null
      isLoading.value = true
      const result = await createUserWithEmailAndPassword(auth, email, password)

      if (displayName) {
        await firebaseUpdateProfile(result.user, { displayName })
      }

      // Send verification email
      if (result.user) {
        await sendEmailVerification(result.user)
      }

      return result.user
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to sign up'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function signInWithProvider(provider: 'google' | 'github' | 'microsoft' | 'apple') {
    try {
      error.value = null
      isLoading.value = true

      let authProvider

      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider()
          break
        case 'github':
          authProvider = new GithubAuthProvider()
          break
        case 'microsoft':
          authProvider = new OAuthProvider('microsoft.com')
          break
        case 'apple':
          authProvider = new OAuthProvider('apple.com')
          break
        default:
          throw new Error('Unsupported provider')
      }

      const result = await signInWithPopup(auth, authProvider)
      return result.user
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to sign in with provider'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function signOut() {
    try {
      error.value = null
      await firebaseSignOut(auth)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to sign out'
      error.value = errorMessage
      throw e
    }
  }

  async function sendPasswordReset(email: string) {
    try {
      error.value = null
      await sendPasswordResetEmail(auth, email)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to send password reset email'
      error.value = errorMessage
      throw e
    }
  }

  async function updateProfile(data: { displayName?: string; photoURL?: string }) {
    try {
      error.value = null
      if (!user.value) throw new Error('No user logged in')

      await firebaseUpdateProfile(user.value, data)
      // Update local state
      if (userData.value) {
        if (data.displayName) userData.value.displayName = data.displayName
        if (data.photoURL) userData.value.photoUrl = data.photoURL
        userData.value.timestamps.updatedAt = new Date().toISOString()
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update profile'
      error.value = errorMessage
      throw e
    }
  }

  async function deleteAccount() {
    try {
      error.value = null
      if (!user.value) throw new Error('No user logged in')

      await deleteUser(user.value)
      user.value = null
      userData.value = null
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete account'
      error.value = errorMessage
      throw e
    }
  }

  async function resendVerificationEmail() {
    try {
      error.value = null
      if (!user.value) throw new Error('No user logged in')

      await sendEmailVerification(user.value)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to resend verification email'
      error.value = errorMessage
      throw e
    }
  }

  return {
    // State
    user,
    userData,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    isEmailVerified,
    // Actions
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    signOut,
    sendPasswordReset,
    updateProfile,
    deleteAccount,
    resendVerificationEmail,
  }
})
