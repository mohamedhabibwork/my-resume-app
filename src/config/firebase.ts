import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence, type Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAnalytics, type Analytics } from 'firebase/analytics'
import { getStorage, type FirebaseStorage, connectStorageEmulator } from 'firebase/storage'
import { getMessaging, type Messaging, isSupported } from 'firebase/messaging'
import { connectAuthEmulator } from 'firebase/auth'

/**
 * Firebase Configuration - FREE TIER (Spark Plan)
 *
 * All services used are within the free tier:
 *
 * 1. Firebase Authentication (FREE):
 *    - Unlimited users
 *    - Email/Password, Google, GitHub, etc.
 *    - No limits on authentication operations
 *
 * 2. Cloud Firestore (FREE - Spark Plan):
 *    - 50,000 reads/day
 *    - 20,000 writes/day
 *    - 20,000 deletes/day
 *    - 1 GB storage
 *    - Real-time listeners included
 *
 * 3. Firebase Analytics (FREE):
 *    - Unlimited events
 *    - Unlimited user properties
 *    - 14 months data retention
 *
 * 4. Firebase Storage (FREE - Spark Plan):
 *    - 5 GB storage
 *    - 1 GB/day downloads
 *    - 20,000 uploads/day
 *
 * 5. Firebase Cloud Messaging (FCM) - FREE:
 *    - Unlimited messages
 *    - Unlimited devices
 *    - No limits on notifications
 */

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let firestore: Firestore
let analytics: Analytics | null = null
let storage: FirebaseStorage
let messaging: Messaging | null = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  firestore = getFirestore(app)
  storage = getStorage(app)

  // Connect to emulators in development (FREE - for local testing)
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      connectFirestoreEmulator(firestore, 'localhost', 8080)
      connectStorageEmulator(storage, 'localhost', 9199)
      // eslint-disable-next-line no-console
      console.log('Connected to Firebase Emulators (FREE - local development)')
    } catch (emulatorError) {
      console.warn('Firebase emulators not available, using production:', emulatorError)
    }
  }

  // Initialize Analytics only in browser environment (FREE - unlimited events)
  if (typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    analytics = getAnalytics(app)
  }

  // Initialize FCM (Firebase Cloud Messaging) - FREE - Unlimited messages
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        messaging = getMessaging(app)
        // eslint-disable-next-line no-console
        console.log('FCM initialized successfully')
      } else {
        console.warn('FCM not supported in this browser')
      }
    }).catch((error) => {
      console.warn('FCM initialization failed:', error)
    })
  }

  // Enable Firestore persistence (FREE - reduces read operations)
  // This caches data locally to minimize Firestore reads
  // Free tier: 50K reads/day, 20K writes/day, 20K deletes/day
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(firestore).catch((error) => {
      if (error.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence failed: Multiple tabs open')
      } else if (error.code === 'unimplemented') {
        // Browser doesn't support persistence
        console.warn('Firestore persistence not supported in this browser')
      } else {
        console.error('Firestore persistence error:', error)
      }
    })
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw error
}

export { app, auth, firestore, analytics, storage, messaging }
export type { FirebaseApp, Auth, Firestore, Analytics, FirebaseStorage, Messaging }
