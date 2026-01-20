<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '@/types'

interface Props {
  modelValue: string | number
  options: SelectOption<string | number>[]
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  id?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const selectId = computed(() => props.id || props.name || `select-${Math.random().toString(36).substr(2, 9)}`)

const selectClasses = computed(() => {
  const classes = ['select', 'select-bordered', 'w-full']

  // Size
  const sizeMap: Record<string, string> = {
    xs: 'select-xs',
    sm: 'select-sm',
    md: 'select-md',
    lg: 'select-lg',
  }
  classes.push(sizeMap[props.size] || 'select-md')

  // Error state
  if (props.error) {
    classes.push('select-error')
  }

  return classes.join(' ')
})

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <fieldset class="fieldset w-full">
    <label
      v-if="label"
      :for="selectId"
      class="fieldset-legend text-sm font-medium"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error"
      >*</span>
    </label>
    <select
      :id="selectId"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="handleChange"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <p
      v-if="error"
      class="label text-error text-sm"
    >
      {{ error }}
    </p>
  </fieldset>
</template>
