# Firebase Cloud Messaging (FCM) Setup Guide

This guide will help you set up Firebase Cloud Messaging for push notifications in your resume app.

## Prerequisites

1. Firebase project with Cloud Messaging enabled
2. VAPID key generated in Firebase Console
3. Service worker support in your browser

## Step 1: Generate VAPID Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Project Settings** > **Cloud Messaging**
4. Under **Web configuration**, click **Generate key pair**
5. Copy the generated key

## Step 2: Configure Environment Variables

Add the VAPID key to your `.env` file:

```env
VITE_FIREBASE_VAPID_KEY=your-vapid-key-here
```

Make sure you also have all other Firebase config variables:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Step 3: Update Firebase Messaging Service Worker

Edit `public/firebase-messaging-sw.js` and replace the placeholder config with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
}
```

**Note**: For production, consider fetching this config from your API or using environment variables.

## Step 4: Test FCM

1. Start your development server: `bun run dev`
2. Log in to your app
3. Navigate to `/notifications` or Profile > Notification Settings
4. Click "Enable Notifications"
5. Grant notification permission when prompted
6. You should see a success message and your device token

## Step 5: Send Test Notification

### Using Firebase Console

1. Go to Firebase Console > Cloud Messaging
2. Click **Send test message**
3. Enter your FCM token (visible in notification settings)
4. Enter title and message
5. Click **Test**

### Using Firebase Admin SDK (Server-side)

```javascript
const admin = require('firebase-admin')
const serviceAccount = require('./path/to/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const message = {
  notification: {
    title: 'Test Notification',
    body: 'This is a test notification from FCM',
  },
  data: {
    url: '/dashboard',
    type: 'test',
  },
  token: 'user-fcm-token-here',
}

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response)
  })
  .catch((error) => {
    console.log('Error sending message:', error)
  })
```

## Features

### ✅ Implemented Features

- **Permission Management**: Request and manage notification permissions
- **Token Management**: Store and manage FCM tokens in Firestore
- **Foreground Messages**: Handle notifications when app is open
- **Background Messages**: Handle notifications when app is closed (via service worker)
- **Notification Preferences**: User can customize which notifications to receive
- **Multi-device Support**: Support for multiple devices per user
- **Token Refresh**: Automatic token refresh handling

### Notification Types

1. **Resume Updates**: Notify when resume is viewed or shared
2. **System Notifications**: Important system updates
3. **Marketing**: Promotional offers and tips (opt-in)

## Free Tier Limits

**FCM is completely FREE with unlimited:**
- Push notifications
- Devices
- Messages
- No daily limits

## Security

- FCM tokens are stored in Firestore with user-based security rules
- Only authenticated users can manage their own tokens
- Tokens are automatically cleaned up when users disable notifications

## Troubleshooting

### Notifications not working?

1. **Check browser support**: FCM requires HTTPS (or localhost)
2. **Check permissions**: Ensure notification permission is granted
3. **Check VAPID key**: Verify VAPID key is correctly configured
4. **Check service worker**: Ensure service worker is registered
5. **Check console**: Look for errors in browser console

### Service Worker not registering?

1. Ensure `firebase-messaging-sw.js` is in the `public/` directory
2. Check browser console for errors
3. Verify service worker scope in browser DevTools

### Token not generating?

1. Check VAPID key is set in environment variables
2. Verify user is authenticated
3. Check browser console for errors
4. Ensure notification permission is granted

## API Reference

### Composable: `useFCM()`

```typescript
const {
  isSupported,        // boolean - Is FCM supported?
  permission,         // 'granted' | 'denied' | 'default'
  token,              // string | null - Current FCM token
  tokens,             // FCMToken[] - All user tokens
  isLoading,          // boolean
  error,              // string | null
  requestPermission,  // () => Promise<boolean>
  disableNotifications, // () => Promise<void>
  updatePreferences,  // (prefs) => Promise<void>
  loadTokens,         // () => Promise<void>
} = useFCM()
```

### Service: `fcm.ts`

```typescript
// Get FCM token
const token = await getFCMToken()

// Save token to Firestore
await saveFCMToken(token)

// Delete token
await deleteFCMToken(token)

// Update preferences
await updateNotificationPreferences(token, {
  resumeUpdates: true,
  systemNotifications: false,
  marketing: false,
})

// Handle foreground messages
onForegroundMessage((payload) => {
  console.log('Message received:', payload)
  showNotification(payload)
})
```

## Next Steps

1. **Server Integration**: Set up Firebase Admin SDK to send notifications from your backend
2. **Notification Templates**: Create notification templates for different events
3. **Analytics**: Track notification open rates and engagement
4. **Rich Notifications**: Add images, actions, and custom data to notifications

## Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
