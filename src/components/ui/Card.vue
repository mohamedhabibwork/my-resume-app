<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: boolean
  shadow?: boolean
  bordered?: boolean
  compact?: boolean
  hoverable?: boolean
  imageFull?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: true,
  shadow: true,
  bordered: false,
  compact: false,
  hoverable: false,
  imageFull: false,
})

const cardClasses = computed(() => {
  const classes = ['card', 'bg-base-100']

  if (props.shadow) {
    classes.push('shadow-lg')
  }

  if (props.bordered) {
    classes.push('card-border')
  }

  if (props.compact) {
    classes.push('card-sm')
  }

  if (props.hoverable) {
    classes.push('hover:shadow-xl', 'transition-shadow', 'duration-200')
  }

  if (props.imageFull) {
    classes.push('image-full')
  }

  return classes.join(' ')
})
</script>

<template>
  <div :class="cardClasses">
    <slot name="figure" />
    <div :class="['card-body', !padding ? 'p-0' : '']">
      <slot />
    </div>
    <slot name="actions" />
  </div>
</template>
