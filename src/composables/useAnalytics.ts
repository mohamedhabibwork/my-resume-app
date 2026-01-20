import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  logAnalyticsEvent,
  trackPageView,
  setAnalyticsUserProperties,
} from '@/services/analytics'
import { useAuth } from '@/composables/useAuth'

export function useAnalytics() {
  const route = useRoute()
  const { user } = useAuth()

  onMounted(() => {
    // Track initial page view
    trackPageView(route.name?.toString() || 'Unknown', route.path)

    // Set user properties if authenticated
    if (user.value) {
      setAnalyticsUserProperties({
        user_id: user.value.uid,
      })
    }
  })

  return {
    logEvent: logAnalyticsEvent,
    trackPageView,
    setUserProperties: setAnalyticsUserProperties,
  }
}
