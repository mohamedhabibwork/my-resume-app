import { ref, watch, type Ref } from 'vue'

/**
 * Composable for syncing state with localStorage
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @example
 * const theme = useLocalStorage('theme', 'light')
 * theme.value = 'dark' // Automatically persisted
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue) as Ref<T>

  watch(
    data,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true }
  )

  return data
}

/**
 * Composable for syncing state with sessionStorage
 * @param key - sessionStorage key
 * @param defaultValue - Default value if key doesn't exist
 */
export function useSessionStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = sessionStorage.getItem(key)
  const data = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue) as Ref<T>

  watch(
    data,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        sessionStorage.removeItem(key)
      } else {
        sessionStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true }
  )

  return data
}
