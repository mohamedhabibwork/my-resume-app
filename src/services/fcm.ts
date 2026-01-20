import { messaging } from '@/config/firebase'
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging'
import { createFirestoreService } from './firestore'
import { useAuthStore } from '@/stores/useAuthStore'

/**
 * Firebase Cloud Messaging (FCM) Service
 *
 * FREE TIER - Unlimited:
 * - Unlimited push notifications
 * - Unlimited devices
 * - No message limits
 *
 * This service handles:
 * - Requesting notification permissions
 * - Getting FCM tokens
 * - Storing tokens in Firestore
 * - Handling foreground messages
 * - Managing notification preferences
 */

export interface FCMToken {
  id: string
  userId: string
  token: string
  deviceInfo?: {
    userAgent: string
    platform: string
    language: string
  }
  enabled: boolean
  preferences: {
    resumeUpdates: boolean
    systemNotifications: boolean
    marketing: boolean
  }
  timestamps: {
    createdAt: Date | string
    updatedAt: Date | string
  }
}

const fcmTokenService = createFirestoreService<FCMToken>('fcmTokens')

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications')
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    throw new Error('Notification permission was previously denied')
  }

  const permission = await Notification.requestPermission()
  return permission
}

/**
 * Get FCM token for current device
 */
export async function getFCMToken(): Promise<string | null> {
  if (!messaging) {
    console.warn('FCM messaging not available')
    return null
  }

  try {
    // Request permission first
    const permission = await requestNotificationPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return null
    }

    // Get VAPID key from environment
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      console.warn('VAPID key not configured')
      return null
    }

    const token = await getToken(messaging, { vapidKey })
    return token
  } catch (error) {
    console.error('Error getting FCM token:', error)
    throw error
  }
}

/**
 * Save FCM token to Firestore
 */
export async function saveFCMToken(token: string): Promise<void> {
  const authStore = useAuthStore()
  if (!authStore.user) {
    throw new Error('User not authenticated')
  }

  try {
    // Check if token already exists
    const existingTokens = await fcmTokenService.getByField('token', token)
    const existingToken = existingTokens.find((t) => t.userId === authStore.user!.uid)

    const tokenData: Omit<FCMToken, 'id' | 'timestamps'> = {
      userId: authStore.user.uid,
      token,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
      enabled: true,
      preferences: {
        resumeUpdates: true,
        systemNotifications: true,
        marketing: false,
      },
    }

    if (existingToken) {
      // Update existing token
      if (existingToken) {
        await fcmTokenService.update(existingToken.id, tokenData)
      }
    } else {
      // Create new token
      await fcmTokenService.create(tokenData)
    }
  } catch (error) {
    console.error('Error saving FCM token:', error)
    throw error
  }
}

/**
 * Delete FCM token from Firestore
 */
export async function deleteFCMToken(token: string): Promise<void> {
  try {
    const tokens = await fcmTokenService.getByField('token', token)
    if (tokens.length > 0 && tokens[0]) {
      await fcmTokenService.delete(tokens[0].id)
    }
  } catch (error) {
    console.error('Error deleting FCM token:', error)
    throw error
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  token: string,
  preferences: Partial<FCMToken['preferences']>
): Promise<void> {
  try {
    const tokens = await fcmTokenService.getByField('token', token)
    if (tokens.length > 0 && tokens[0]) {
      await fcmTokenService.update(tokens[0].id, {
        preferences: {
          ...tokens[0].preferences,
          ...preferences,
        },
      })
    }
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    throw error
  }
}

/**
 * Get all FCM tokens for current user
 */
export async function getUserFCMTokens(): Promise<FCMToken[]> {
  const authStore = useAuthStore()
  if (!authStore.user) {
    return []
  }

  try {
    return await fcmTokenService.getByField('userId', authStore.user.uid)
  } catch (error) {
    console.error('Error getting user FCM tokens:', error)
    return []
  }
}

/**
 * Handle foreground messages (when app is open)
 */
export function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): (() => void) | null {
  if (!messaging) {
    return null
  }

  try {
    return onMessage(messaging, callback)
  } catch (error) {
    console.error('Error setting up foreground message handler:', error)
    return null
  }
}

/**
 * Show notification from message payload
 */
export function showNotification(payload: MessagePayload): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  const title = payload.notification?.title || 'New Notification'
  const options: NotificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.icon || '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: payload.messageId,
    data: payload.data,
    requireInteraction: false,
    silent: false,
  }

  new Notification(title, options)
}
