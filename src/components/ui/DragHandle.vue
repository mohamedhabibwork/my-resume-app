<script setup lang="ts">
interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center cursor-move text-gray-400 hover:text-gray-600 transition-colors',
      disabled ? 'cursor-not-allowed opacity-50' : '',
    ]"
    draggable="true"
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
        d="M4 8h16M4 16h16"
      />
    </svg>
  </div>
</template>
