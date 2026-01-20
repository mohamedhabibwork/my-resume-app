import { ref, onMounted, onUnmounted } from 'vue'
import {
  getFCMToken,
  saveFCMToken,
  deleteFCMToken,
  updateNotificationPreferences,
  getUserFCMTokens,
  onForegroundMessage,
  showNotification,
  type FCMToken,
} from '@/services/fcm'
import { useToast } from './useToast'
import { useAuth } from './useAuth'

/**
 * Vue composable for Firebase Cloud Messaging
 *
 * Provides reactive state and methods for:
 * - Requesting notification permissions
 * - Managing FCM tokens
 * - Handling foreground messages
 * - Managing notification preferences
 */
export function useFCM() {
  const { user } = useAuth()
  const { success: showSuccess, error: showError, info: showInfo } = useToast()

  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const token = ref<string | null>(null)
  const tokens = ref<FCMToken[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribeForeground: (() => void) | null = null

  // Check if FCM is supported
  async function checkSupport() {
    if (typeof window === 'undefined') {
      isSupported.value = false
      return
    }

    if (!('Notification' in window)) {
      isSupported.value = false
      return
    }

    try {
      const { isSupported: fcmSupported } = await import('firebase/messaging')
      isSupported.value = await fcmSupported()
    } catch {
      isSupported.value = false
    }
  }

  // Check notification permission
  function checkPermission() {
    if ('Notification' in window) {
      permission.value = Notification.permission
    }
  }

  // Request notification permission and get token
  async function requestPermission(): Promise<boolean> {
    try {
      isLoading.value = true
      error.value = null

      if (!isSupported.value) {
        throw new Error('FCM is not supported in this browser')
      }

      if (!user.value) {
        throw new Error('User must be authenticated')
      }

      const fcmToken = await getFCMToken()
      if (!fcmToken) {
        throw new Error('Failed to get FCM token')
      }

      await saveFCMToken(fcmToken)
      token.value = fcmToken
      permission.value = 'granted'
      checkPermission()

      showSuccess('Notifications enabled successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable notifications'
      error.value = errorMessage
      showError(errorMessage)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Disable notifications
  async function disableNotifications(): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      if (token.value) {
        await deleteFCMToken(token.value)
        token.value = null
      }

      // Load all tokens and delete them
      const userTokens = await getUserFCMTokens()
      for (const userToken of userTokens) {
        await deleteFCMToken(userToken.token)
      }

      tokens.value = []
      showSuccess('Notifications disabled')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disable notifications'
      error.value = errorMessage
      showError(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  // Update notification preferences
  async function updatePreferences(preferences: Partial<FCMToken['preferences']>): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      if (!token.value) {
        throw new Error('No FCM token available')
      }

      await updateNotificationPreferences(token.value, preferences)

      // Refresh tokens
      await loadTokens()
      showSuccess('Preferences updated')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences'
      error.value = errorMessage
      showError(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  // Load user's FCM tokens
  async function loadTokens(): Promise<void> {
    try {
      if (!user.value) {
        tokens.value = []
        return
      }

      const userTokens = await getUserFCMTokens()
      tokens.value = userTokens

      // Set current token if available
      if (userTokens.length > 0 && userTokens[0]) {
        token.value = userTokens[0].token
      }
    } catch (err) {
      console.error('Error loading FCM tokens:', err)
    }
  }

  // Setup foreground message handler
  function setupForegroundHandler() {
    if (!isSupported.value) {
      return
    }

    unsubscribeForeground = onForegroundMessage((payload) => {
      // eslint-disable-next-line no-console
      console.log('Foreground message received:', payload)

      // Show notification
      showNotification(payload)

      // Show toast notification
      const title = payload.notification?.title || 'New Notification'
      const body = payload.notification?.body || ''
      showInfo(`${title}: ${body}`)

      // Handle custom data
      if (payload.data) {
        // You can handle custom data here
        // For example, navigate to a specific page
        if (payload.data.url) {
          // router.push(payload.data.url)
        }
      }
    })
  }

  // Initialize FCM
  async function initialize() {
    await checkSupport()
    checkPermission()

    if (isSupported.value && user.value) {
      await loadTokens()
      setupForegroundHandler()
    }
  }

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    if (unsubscribeForeground) {
      unsubscribeForeground()
    }
  })

  return {
    isSupported,
    permission,
    token,
    tokens,
    isLoading,
    error,
    requestPermission,
    disableNotifications,
    updatePreferences,
    loadTokens,
    initialize,
  }
}
