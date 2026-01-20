import { ref } from 'vue'
import type { Toast, ToastType } from '@/types'
import { TOAST_TYPES } from '@/types'
import { generateId } from '@/utils/helpers'

const toasts = ref<Toast[]>([])

export function useToast() {
  function show(message: string, type: ToastType = TOAST_TYPES.INFO, duration = 3000) {
    const toast: Toast = {
      id: generateId(),
      type,
      message,
      duration,
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(toast.id)
      }, duration)
    }

    return toast.id
  }

  function success(message: string, duration = 3000) {
    return show(message, TOAST_TYPES.SUCCESS, duration)
  }

  function error(message: string, duration = 5000) {
    return show(message, TOAST_TYPES.ERROR, duration)
  }

  function warning(message: string, duration = 4000) {
    return show(message, TOAST_TYPES.WARNING, duration)
  }

  function info(message: string, duration = 3000) {
    return show(message, TOAST_TYPES.INFO, duration)
  }

  function remove(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
}
