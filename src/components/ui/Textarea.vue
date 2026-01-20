<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | undefined
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number | string
  id?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  rows: 4,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const textareaId = computed(() => props.id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`)

const textareaClasses = computed(() => {
  const classes = ['textarea', 'textarea-bordered', 'w-full']

  // Size
  const sizeMap: Record<string, string> = {
    xs: 'textarea-xs',
    sm: 'textarea-sm',
    md: 'textarea-md',
    lg: 'textarea-lg',
  }
  classes.push(sizeMap[props.size] || 'textarea-md')

  // Error state
  if (props.error) {
    classes.push('textarea-error')
  }

  return classes.join(' ')
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <fieldset class="fieldset w-full">
    <label
      v-if="label"
      :for="textareaId"
      class="fieldset-legend text-sm font-medium"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error"
      >*</span>
    </label>
    <textarea
      :id="textareaId"
      :name="name"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="typeof rows === 'string' ? Number(rows) : rows"
      :class="textareaClasses"
      @input="handleInput"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <p
      v-if="error"
      class="label text-error text-sm"
    >
      {{ error }}
    </p>
  </fieldset>
</template>
