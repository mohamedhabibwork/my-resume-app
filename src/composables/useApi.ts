import { ref, type Ref } from 'vue'

interface UseApiReturn<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  isLoading: Ref<boolean>
  execute: (url: string, options?: RequestInit) => Promise<T | null>
  reset: () => void
}

/**
 * Composable for making API requests with loading and error states
 * @example
 * const { data, error, isLoading, execute } = useApi<User[]>()
 * await execute('/api/users')
 */
export function useApi<T>(): UseApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  async function execute(url: string, options?: RequestInit): Promise<T | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      data.value = result
      return result
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred'
      error.value = message
      return null
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    data.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  }
}

/**
 * Composable for POST requests with typed body
 */
export function useApiMutation<TBody, TResponse>() {
  const { data, error, isLoading, execute: baseExecute, reset } = useApi<TResponse>()

  async function mutate(url: string, body: TBody, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST') {
    return baseExecute(url, {
      method,
      body: JSON.stringify(body),
    })
  }

  return {
    data,
    error,
    isLoading,
    mutate,
    reset,
  }
}
