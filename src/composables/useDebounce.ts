import { ref, watch, type Ref } from 'vue'

/**
 * Composable for debouncing a ref value
 * @param value - The ref to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @example
 * const search = ref('')
 * const debouncedSearch = useDebounce(search, 500)
 */
export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

/**
 * Creates a debounced function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @example
 * const debouncedFetch = useDebounceFn(() => fetchData(), 300)
 */
export function useDebounceFn<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * Creates a throttled function
 * @param fn - Function to throttle
 * @param limit - Time limit in milliseconds
 * @example
 * const throttledScroll = useThrottleFn(() => handleScroll(), 100)
 */
export function useThrottleFn<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
