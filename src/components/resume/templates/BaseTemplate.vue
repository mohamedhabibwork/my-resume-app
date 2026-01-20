<script setup lang="ts">
import type { Resume } from '@/types'

interface Props {
  resume: Resume
}

defineProps<Props>()
</script>

<template>
  <div class="resume-template">
    <slot />
  </div>
</template>
