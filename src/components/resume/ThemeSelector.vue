<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import type { Theme } from '@/types'
import { THEME_PRESETS } from '@/types/themes'
import Button from '@/components/ui/Button.vue'

interface Props {
  modelValue?: Theme
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Theme]
}>()

const { themePresets } = useTheme()

const selectedTheme = computed({
  get: () => props.modelValue || THEME_PRESETS.default,
  set: (value) => {
    if (value) {
      emit('update:modelValue', value)
    }
  },
})

function selectPreset(preset: keyof typeof THEME_PRESETS) {
  selectedTheme.value = THEME_PRESETS[preset]
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Preset Themes</label>
      <div class="grid grid-cols-2 gap-2">
        <Button
          v-for="(preset, key) in themePresets"
          :key="key"
          variant="outline"
          size="sm"
          @click="selectPreset(key as keyof typeof THEME_PRESETS)"
        >
          {{ key }}
        </Button>
      </div>
    </div>

    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
        <input
          type="color"
          :value="selectedTheme?.primary"
          class="w-full h-10 rounded"
          @input="selectedTheme = { ...selectedTheme, primary: ($event.target as HTMLInputElement).value } as Theme"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
        <input
          type="color"
          :value="selectedTheme?.secondary"
          class="w-full h-10 rounded"
          @input="selectedTheme = { ...selectedTheme, secondary: ($event.target as HTMLInputElement).value } as Theme"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
        <input
          type="color"
          :value="selectedTheme?.text"
          class="w-full h-10 rounded"
          @input="selectedTheme = { ...selectedTheme, text: ($event.target as HTMLInputElement).value } as Theme"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <input
          type="color"
          :value="selectedTheme?.background"
          class="w-full h-10 rounded"
          @input="selectedTheme = { ...selectedTheme, background: ($event.target as HTMLInputElement).value } as Theme"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
        <input
          type="color"
          :value="selectedTheme?.accent"
          class="w-full h-10 rounded"
          @input="selectedTheme = { ...selectedTheme, accent: ($event.target as HTMLInputElement).value } as Theme"
        />
      </div>
    </div>
  </div>
</template>
