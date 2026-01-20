import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

/**
 * Require authentication to access route
 */
export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next()
  } else {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }
}

/**
 * Require guest (not authenticated) to access route
 * Redirects authenticated users to dashboard
 */
export function requireGuest(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  // Wait for auth state to be initialized
  if (authStore.isLoading) {
    // Poll until auth state is ready (max 2 seconds)
    const startTime = Date.now()
    const checkAuth = setInterval(() => {
      if (!authStore.isLoading || Date.now() - startTime > 2000) {
        clearInterval(checkAuth)
        if (authStore.isAuthenticated) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      }
    }, 50)
    return
  }

  // Auth state is ready, check authentication
  if (authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}
