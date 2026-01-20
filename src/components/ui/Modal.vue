<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

function handleClose() {
  emit('close')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.isOpen) {
    dialogRef.value?.showModal()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="['modal', { 'modal-open': isOpen }]"
  >
    <div :class="['modal-box', sizeClasses[size]]">
      <!-- Header -->
      <div
        v-if="title"
        class="flex items-center justify-between mb-4"
      >
        <h3 class="text-lg font-bold">
          {{ title }}
        </h3>
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost"
          @click="handleClose"
        >
          <svg
            class="w-5 h-5"
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
      <button
        v-else
        type="button"
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="handleClose"
      >
        <svg
          class="w-5 h-5"
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

      <!-- Content -->
      <slot />

      <!-- Footer -->
      <div
        v-if="$slots.footer"
        class="modal-action"
      >
        <slot name="footer" />
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
      @click="handleClose"
    >
      <button type="button">
        close
      </button>
    </form>
  </dialog>
</template>
