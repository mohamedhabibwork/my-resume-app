<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { ToastType } from '@/types'
import { TOAST_TYPES } from '@/types'

interface Props {
  type?: ToastType
  message: string
  duration?: number
  isOpen: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: TOAST_TYPES.INFO,
  duration: 3000,
})

const emit = defineEmits<{
  close: []
}>()

const alertClasses = computed(() => {
  const classes = ['alert', 'shadow-lg']

  const typeMap: Record<string, string> = {
    [TOAST_TYPES.SUCCESS]: 'alert-success',
    [TOAST_TYPES.ERROR]: 'alert-error',
    [TOAST_TYPES.WARNING]: 'alert-warning',
    [TOAST_TYPES.INFO]: 'alert-info',
  }

  classes.push(typeMap[props.type] || 'alert-info')

  return classes.join(' ')
})

const iconPath = computed(() => {
  switch (props.type) {
    case TOAST_TYPES.SUCCESS:
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    case TOAST_TYPES.ERROR:
      return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    case TOAST_TYPES.WARNING:
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
})

onMounted(() => {
  if (props.duration && props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="isOpen"
      :class="alertClasses"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="iconPath"
        />
      </svg>
      <span>{{ message }}</span>
      <button
        class="btn btn-sm btn-circle btn-ghost"
        @click="emit('close')"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>
