import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores/'
import { useAnalytics } from './composables/useAnalytics'

const app = createApp(App)

app.use(router)
app.use(store)

// Initialize analytics
useAnalytics()

app.mount('#app')

// Register service worker for PWA and FCM
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register main service worker
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service Worker registration failed:', error)
    })

    // Register Firebase messaging service worker (if available)
    navigator.serviceWorker.register('/firebase-messaging-sw.js').catch((error) => {
      console.warn('Firebase Messaging Service Worker not available:', error)
    })
  })
}
