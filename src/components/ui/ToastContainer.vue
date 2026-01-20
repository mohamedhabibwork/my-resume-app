<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import Toast from './Toast.vue'

const { toasts, remove } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast toast-end toast-bottom z-50">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :message="toast.message"
        :duration="toast.duration"
        :is-open="true"
        @close="remove(toast.id)"
      />
    </div>
  </Teleport>
</template>
