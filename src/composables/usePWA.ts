import { ref, onMounted } from 'vue'

export function usePWA() {
  const isOnline = ref(navigator.onLine)
  const isInstalled = ref(false)
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

  onMounted(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
      isOnline.value = true
    })

    window.addEventListener('offline', () => {
      isOnline.value = false
    })

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
    })

    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
    }
  })

  async function install() {
    if (!deferredPrompt.value) {
      return
    }

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    deferredPrompt.value = null

    return outcome === 'accepted'
  }

  return {
    isOnline,
    isInstalled,
    install,
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
