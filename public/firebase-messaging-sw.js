// Firebase Cloud Messaging Service Worker
// This file must be in the public directory and named 'firebase-messaging-sw.js'

importScripts('https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js')

// Initialize Firebase in service worker
// Note: You'll need to provide your Firebase config here
// For security, you can use environment variables or fetch from your API
const firebaseConfig = {
  apiKey: "AIzaSyAgStA9k3nThAxXYHg4hST58XFOQzi9QEY",
  authDomain: "resume-9eb69.firebaseapp.com",
  projectId: "resume-9eb69",
  storageBucket: "resume-9eb69.firebasestorage.app",
  messagingSenderId: "1027677472358",
  appId: "1:1027677472358:web:71eef91fa64d0a032fcfa7",
  measurementId: "G-0RFZWH56MF"
}

firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload)

  const notificationTitle = payload.notification?.title || 'New Notification'
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: payload.messageId,
    data: payload.data || {},
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)

  event.notification.close()

  const notificationData = event.notification.data || {}
  const urlToOpen = notificationData.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }

      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
