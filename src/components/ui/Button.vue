<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonVariant, ButtonSize } from '@/types'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes = ['btn']

  // Variants using daisyUI btn classes
  const variantMap: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-error',
  }
  classes.push(variantMap[props.variant] || 'btn-primary')

  // Sizes using daisyUI btn sizes
  const sizeMap: Record<string, string> = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }
  classes.push(sizeMap[props.size] || 'btn-md')

  // Block width
  if (props.block) {
    classes.push('btn-block')
  }

  // Disabled state
  if (props.disabled || props.loading) {
    classes.push('btn-disabled')
  }

  return classes.join(' ')
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="loading loading-spinner loading-sm"
    />
    <slot />
  </button>
</template>
