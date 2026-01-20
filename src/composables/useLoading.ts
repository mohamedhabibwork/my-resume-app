import { ref, computed, type Ref, type ComputedRef } from 'vue'

interface UseLoadingReturn {
  isLoading: Ref<boolean>
  loadingMessage: Ref<string>
  start: (message?: string) => void
  stop: () => void
  wrap: <T>(promise: Promise<T>, message?: string) => Promise<T>
}

/**
 * Composable for managing loading states
 * @example
 * const { isLoading, start, stop, wrap } = useLoading()
 * await wrap(fetchData(), 'Loading data...')
 */
export function useLoading(defaultMessage = 'Loading...'): UseLoadingReturn {
  const isLoading = ref(false)
  const loadingMessage = ref(defaultMessage)

  function start(message?: string) {
    loadingMessage.value = message ?? defaultMessage
    isLoading.value = true
  }

  function stop() {
    isLoading.value = false
    loadingMessage.value = defaultMessage
  }

  async function wrap<T>(promise: Promise<T>, message?: string): Promise<T> {
    start(message)
    try {
      return await promise
    } finally {
      stop()
    }
  }

  return {
    isLoading,
    loadingMessage,
    start,
    stop,
    wrap,
  }
}

interface UseMultiLoadingReturn {
  loadingStates: Ref<Map<string, boolean>>
  isAnyLoading: ComputedRef<boolean>
  isLoading: (key: string) => boolean
  start: (key: string) => void
  stop: (key: string) => void
  wrap: <T>(key: string, promise: Promise<T>) => Promise<T>
}

/**
 * Composable for managing multiple loading states
 * @example
 * const { isLoading, start, stop, wrap, isAnyLoading } = useMultiLoading()
 * await wrap('users', fetchUsers())
 * await wrap('posts', fetchPosts())
 */
export function useMultiLoading(): UseMultiLoadingReturn {
  const loadingStates = ref(new Map<string, boolean>())

  const isAnyLoading = computed(() => {
    return Array.from(loadingStates.value.values()).some(Boolean)
  })

  function isLoading(key: string): boolean {
    return loadingStates.value.get(key) ?? false
  }

  function start(key: string) {
    loadingStates.value.set(key, true)
  }

  function stop(key: string) {
    loadingStates.value.set(key, false)
  }

  async function wrap<T>(key: string, promise: Promise<T>): Promise<T> {
    start(key)
    try {
      return await promise
    } finally {
      stop(key)
    }
  }

  return {
    loadingStates,
    isAnyLoading,
    isLoading,
    start,
    stop,
    wrap,
  }
}
