<script setup lang="ts">
import { computed } from 'vue'
import { useFonts } from '@/composables/useFonts'
import { useI18n } from '@/i18n'
import type { FontSettings } from '@/types'

interface Props {
  modelValue: FontSettings
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: FontSettings]
}>()

const { t } = useI18n()
const { fontFamilyOptions, fontWeightOptions, lineHeightOptions } = useFonts()

// Local copy of font settings
const localFont = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function updateField(field: keyof FontSettings, value: unknown) {
  const newValue = { ...localFont.value, [field]: value }
  emit('update:modelValue', newValue)
}

// Font size presets
const fontSizePresets = [
  { label: t('fonts.sizes.small'), value: 12 },
  { label: t('fonts.sizes.medium'), value: 14 },
  { label: t('fonts.sizes.large'), value: 16 },
  { label: t('fonts.sizes.extraLarge'), value: 18 },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Font Family -->
    <fieldset class="fieldset">
      <legend class="fieldset-legend flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        {{ t('fonts.family') }}
      </legend>
      <select
        :value="localFont.family"
        class="select select-bordered w-full"
        @change="updateField('family', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in fontFamilyOptions"
          :key="option.value"
          :value="option.value"
          :style="{ fontFamily: option.value }"
        >
          {{ option.label }}
        </option>
      </select>
    </fieldset>

    <!-- Font Size -->
    <fieldset class="fieldset">
      <legend class="fieldset-legend flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
        {{ t('fonts.size') }}
      </legend>
      <div class="flex items-center gap-4">
        <input
          type="range"
          :value="localFont.size"
          min="10"
          max="24"
          step="1"
          class="range range-primary flex-1"
          @input="updateField('size', Number(($event.target as HTMLInputElement).value))"
        />
        <div class="badge badge-lg badge-outline w-16 justify-center">
          {{ localFont.size }}px
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <button
          v-for="preset in fontSizePresets"
          :key="preset.value"
          type="button"
          class="btn btn-xs"
          :class="localFont.size === preset.value ? 'btn-primary' : 'btn-ghost'"
          @click="updateField('size', preset.value)"
        >
          {{ preset.label }}
        </button>
      </div>
    </fieldset>

    <!-- Font Weight -->
    <fieldset class="fieldset">
      <legend class="fieldset-legend flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {{ t('fonts.weight') }}
      </legend>
      <select
        :value="String(localFont.weight)"
        class="select select-bordered w-full"
        @change="updateField('weight', isNaN(Number(($event.target as HTMLSelectElement).value)) ? ($event.target as HTMLSelectElement).value : Number(($event.target as HTMLSelectElement).value))"
      >
        <option
          v-for="option in fontWeightOptions"
          :key="String(option.value)"
          :value="String(option.value)"
        >
          {{ option.label }}
        </option>
      </select>
    </fieldset>

    <!-- Line Height -->
    <fieldset class="fieldset">
      <legend class="fieldset-legend flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
        {{ t('fonts.lineHeight') }}
      </legend>
      <div class="flex items-center gap-4">
        <input
          type="range"
          :value="localFont.lineHeight"
          min="1"
          max="2.5"
          step="0.1"
          class="range range-secondary flex-1"
          @input="updateField('lineHeight', Number(($event.target as HTMLInputElement).value))"
        />
        <div class="badge badge-lg badge-outline w-16 justify-center">
          {{ localFont.lineHeight }}
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <button
          v-for="option in lineHeightOptions"
          :key="option.value"
          type="button"
          class="btn btn-xs"
          :class="localFont.lineHeight === option.value ? 'btn-secondary' : 'btn-ghost'"
          @click="updateField('lineHeight', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </fieldset>

    <!-- Preview -->
    <div class="card bg-base-200">
      <div class="card-body p-4">
        <h3 class="text-sm font-medium text-base-content/70 mb-2">
          {{ t('fonts.preview') }}
        </h3>
        <div
          class="bg-base-100 p-4 rounded-lg"
          :style="{
            fontFamily: localFont.family,
            fontSize: `${localFont.size}px`,
            fontWeight: localFont.weight,
            lineHeight: localFont.lineHeight,
          }"
        >
          <p class="mb-2">
            The quick brown fox jumps over the lazy dog.
          </p>
          <p class="text-base-content/60">
            1234567890 - ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
