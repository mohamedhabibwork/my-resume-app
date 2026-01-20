<script setup lang="ts">
import { computed } from 'vue'
import type { Resume } from '@/types'
import ModernTemplate from './templates/ModernTemplate.vue'
import ClassicTemplate from './templates/ClassicTemplate.vue'
import CreativeTemplate from './templates/CreativeTemplate.vue'
import ExecutiveTemplate from './templates/ExecutiveTemplate.vue'
import MinimalTemplate from './templates/MinimalTemplate.vue'
import TwoColumnTemplate from './templates/TwoColumnTemplate.vue'
import ProfessionalTemplate from './templates/ProfessionalTemplate.vue'
import TechTemplate from './templates/TechTemplate.vue'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const templateComponent = computed(() => {
  switch (props.resume.template) {
    case 'modern':
      return ModernTemplate
    case 'classic':
      return ClassicTemplate
    case 'creative':
      return CreativeTemplate
    case 'executive':
      return ExecutiveTemplate
    case 'minimal':
      return MinimalTemplate
    case 'two-column':
      return TwoColumnTemplate
    case 'professional':
      return ProfessionalTemplate
    case 'tech':
      return TechTemplate
    default:
      return ModernTemplate
  }
})

// Compute font styles from resume settings
const fontStyles = computed(() => {
  const settings = props.resume.fontSettings
  if (!settings) {
    return {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 'normal',
      lineHeight: '1.5',
    }
  }

  return {
    fontFamily: settings.family || 'Arial, sans-serif',
    fontSize: `${settings.size || 14}px`,
    fontWeight: settings.weight || 'normal',
    lineHeight: String(settings.lineHeight || 1.5),
  }
})
</script>

<template>
  <div
    class="resume-preview bg-white"
    :style="{
      minHeight: '100%',
      fontFamily: fontStyles.fontFamily,
      fontSize: fontStyles.fontSize,
      fontWeight: fontStyles.fontWeight,
      lineHeight: fontStyles.lineHeight,
    }"
  >
    <component
      :is="templateComponent"
      :resume="resume"
    />
  </div>
</template>
