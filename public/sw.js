// Service Worker for PWA and FCM
const CACHE_NAME = 'resume-app-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/offline',
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/offline')
        }
      })
    })
  )
})

// FCM Background Message Handler
// This handles push notifications when the app is in the background or closed
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)

  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'notification',
    data: {},
  }

  // Parse push data
  if (event.data) {
    try {
      const payload = event.data.json()
      notificationData = {
        title: payload.notification?.title || payload.data?.title || notificationData.title,
        body: payload.notification?.body || payload.data?.body || notificationData.body,
        icon: payload.notification?.icon || payload.data?.icon || notificationData.icon,
        badge: payload.notification?.badge || notificationData.badge,
        tag: payload.messageId || payload.data?.tag || notificationData.tag,
        data: payload.data || {},
      }
    } catch (error) {
      console.error('Error parsing push data:', error)
      // Try to get text data
      const text = event.data.text()
      if (text) {
        notificationData.body = text
      }
    }
  }

  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    actions: notificationData.data?.actions || [],
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
  )
})

// Notification click handler
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

// Notification close handler
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event)
  // You can track notification dismissal here
})
