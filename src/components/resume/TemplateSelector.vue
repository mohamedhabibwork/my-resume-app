<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import ResumePreview from '@/components/resume/ResumePreview.vue'
import { generateSampleResume } from '@/utils/sampleResume'
import { useI18n } from '@/i18n'
import type { Resume } from '@/types'

interface Props {
  isOpen: boolean
  currentTemplate: string
  resume?: Resume
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  select: [template: string]
}>()

const { t } = useI18n()
const previewTemplate = ref<string | null>(null)
const showPreview = ref(false)

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design', icon: '✨' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout', icon: '📄' },
  { id: 'creative', name: 'Creative', description: 'Colorful and unique style', icon: '🎨' },
  { id: 'executive', name: 'Executive', description: 'Elegant design for senior professionals', icon: '👔' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and clean minimalist style', icon: '⚪' },
  { id: 'two-column', name: 'Two Column', description: 'Sidebar layout with skills on the side', icon: '📋' },
  { id: 'professional', name: 'Professional', description: 'Balanced layout for all industries', icon: '💼' },
  { id: 'tech', name: 'Tech', description: 'Modern tech-focused design with monospace font', icon: '💻' },
]

// Generate preview resume with current data or sample data
const previewResume = computed<Resume>(() => {
  if (props.resume && previewTemplate.value) {
    // Use current resume data with preview template
    return {
      ...props.resume,
      template: previewTemplate.value,
    }
  }
  // Use sample data with preview template
  return generateSampleResume(previewTemplate.value || 'modern')
})

function selectTemplate(templateId: string) {
  emit('select', templateId)
  emit('close')
  previewTemplate.value = null
  showPreview.value = false
}

function previewTemplateHandler(templateId: string) {
  previewTemplate.value = templateId
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
  previewTemplate.value = null
}
</script>

<template>
  <Modal
    :is-open="isOpen"
    :title="t('templates.selectTemplate')"
    size="xl"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Template Grid -->
      <div
        v-if="!showPreview"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto"
      >
        <div
          v-for="template in templates"
          :key="template.id"
          :class="[
            'border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg group relative',
            props.currentTemplate === template.id
              ? 'border-blue-600 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-blue-300'
          ]"
          @click="previewTemplateHandler(template.id)"
        >
          <!-- Selected Badge -->
          <div
            v-if="props.currentTemplate === template.id"
            class="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold"
          >
            {{ t('common.selected') }}
          </div>

          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">{{ template.icon }}</span>
            <h3 class="font-semibold text-gray-900">
              {{ template.name }}
            </h3>
          </div>
          <p class="text-sm text-gray-600 mb-3">
            {{ template.description }}
          </p>

          <!-- Preview Button -->
          <div class="flex items-center justify-between">
            <button
              class="text-xs text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              @click.stop="previewTemplateHandler(template.id)"
            >
              {{ t('common.preview') }}
            </button>
            <button
              v-if="props.currentTemplate === template.id"
              class="text-xs text-gray-500"
              @click.stop="selectTemplate(template.id)"
            >
              {{ t('common.use') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Preview View -->
      <div
        v-else
        class="space-y-4"
      >
        <!-- Preview Header -->
        <div class="flex items-center justify-between border-b pb-4">
          <div class="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              @click="closePreview"
            >
              ← {{ t('common.back') }}
            </Button>
            <div>
              <h3 class="font-semibold text-lg">
                {{ templates.find(tmpl => tmpl.id === previewTemplate)?.name }} {{ t('templates.template') }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ templates.find(tmpl => tmpl.id === previewTemplate)?.description }}
              </p>
            </div>
          </div>
          <Button @click="selectTemplate(previewTemplate!)">
            {{ t('common.useThisTemplate') }}
          </Button>
        </div>

        <!-- Preview Content -->
        <div class="border rounded-lg overflow-hidden bg-gray-50">
          <div class="bg-white shadow-inner p-4 overflow-y-auto max-h-[70vh] flex justify-center">
            <div
              class="bg-white shadow-lg"
              style="width: 210mm; min-height: 297mm; transform: scale(0.4); transform-origin: top center;"
            >
              <div style="width: 250%; height: 250%;">
                <ResumePreview :resume="previewResume" />
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Actions -->
        <div class="flex items-center justify-between pt-4 border-t">
          <p class="text-sm text-gray-600">
            {{ t('templates.previewNote') }}
          </p>
          <div class="flex gap-2">
            <Button
              variant="outline"
              @click="closePreview"
            >
              {{ t('common.cancel') }}
            </Button>
            <Button @click="selectTemplate(previewTemplate!)">
              {{ t('common.useThisTemplate') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
