import { ref, computed, type Ref, type ComputedRef } from 'vue'

interface AppError {
  message: string
  code?: string
  field?: string
  timestamp: Date
}

interface UseErrorReturn {
  error: Ref<AppError | null>
  errorMessage: ComputedRef<string>
  hasError: ComputedRef<boolean>
  setError: (message: string, code?: string, field?: string) => void
  clearError: () => void
  handleError: (e: unknown) => void
}

/**
 * Composable for managing error states
 * @example
 * const { error, hasError, setError, clearError, handleError } = useError()
 * try { await fetch() } catch(e) { handleError(e) }
 */
export function useError(): UseErrorReturn {
  const error = ref<AppError | null>(null)

  const errorMessage = computed(() => error.value?.message ?? '')
  const hasError = computed(() => error.value !== null)

  function setError(message: string, code?: string, field?: string) {
    error.value = {
      message,
      code,
      field,
      timestamp: new Date(),
    }
  }

  function clearError() {
    error.value = null
  }

  function handleError(e: unknown) {
    if (e instanceof Error) {
      setError(e.message)
    } else if (typeof e === 'string') {
      setError(e)
    } else {
      setError('An unexpected error occurred')
    }
  }

  return {
    error,
    errorMessage,
    hasError,
    setError,
    clearError,
    handleError,
  }
}

interface UseFormErrorsReturn {
  errors: Ref<Map<string, string>>
  hasErrors: ComputedRef<boolean>
  getError: (field: string) => string | undefined
  setFieldError: (field: string, message: string) => void
  clearFieldError: (field: string) => void
  clearAllErrors: () => void
  setErrors: (errors: Record<string, string>) => void
}

/**
 * Composable for managing form validation errors
 * @example
 * const { errors, setFieldError, getError, clearAllErrors } = useFormErrors()
 * if (!email) setFieldError('email', 'Email is required')
 */
export function useFormErrors(): UseFormErrorsReturn {
  const errors = ref(new Map<string, string>())

  const hasErrors = computed(() => errors.value.size > 0)

  function getError(field: string): string | undefined {
    return errors.value.get(field)
  }

  function setFieldError(field: string, message: string) {
    errors.value.set(field, message)
  }

  function clearFieldError(field: string) {
    errors.value.delete(field)
  }

  function clearAllErrors() {
    errors.value.clear()
  }

  function setErrors(newErrors: Record<string, string>) {
    clearAllErrors()
    Object.entries(newErrors).forEach(([field, message]) => {
      setFieldError(field, message)
    })
  }

  return {
    errors,
    hasErrors,
    getError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setErrors,
  }
}
