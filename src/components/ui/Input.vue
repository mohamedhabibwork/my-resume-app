<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number | undefined
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
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
  type: 'text',
  required: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  focus: []
}>()

const inputId = computed(() => props.id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const classes = ['input', 'input-bordered', 'w-full']

  // Size
  const sizeMap: Record<string, string> = {
    xs: 'input-xs',
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  }
  classes.push(sizeMap[props.size] || 'input-md')

  // Error state
  if (props.error) {
    classes.push('input-error')
  }

  return classes.join(' ')
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <fieldset class="fieldset w-full">
    <label
      v-if="label"
      :for="inputId"
      class="fieldset-legend text-sm font-medium"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error"
      >*</span>
    </label>
    <input
      :id="inputId"
      :name="name"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
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
