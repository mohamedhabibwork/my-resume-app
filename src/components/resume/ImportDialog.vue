<script setup lang="ts">
import { ref } from 'vue'
import { importFromJSON } from '@/services/import'
import type { Resume } from '@/types'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  import: [resume: Resume]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const error = ref<string | null>(null)
const importedResume = ref<Resume | null>(null)

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = e.target?.result as string
      const resume = importFromJSON(json)
      importedResume.value = resume
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to import resume'
      importedResume.value = null
    }
  }
  reader.readAsText(file)
}

function handleImport() {
  if (importedResume.value) {
    emit('import', importedResume.value)
    handleClose()
  }
}

function handleClose() {
  importedResume.value = null
  error.value = null
  emit('close')
}
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="Import Resume"
    @close="handleClose"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select JSON file
        </label>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          @change="handleFileSelect"
        />
      </div>

      <div
        v-if="error"
        class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
      >
        {{ error }}
      </div>

      <div
        v-if="importedResume"
        class="p-4 bg-green-50 border border-green-200 rounded-lg"
      >
        <p class="text-sm text-green-700 mb-2">
          Resume imported successfully: {{ importedResume.title }}
        </p>
        <p class="text-xs text-green-600">
          Ready to import
        </p>
      </div>
    </div>

    <template #footer>
      <Button
        variant="outline"
        @click="handleClose"
      >
        Cancel
      </Button>
      <Button
        :disabled="!importedResume"
        @click="handleImport"
      >
        Import
      </Button>
    </template>
  </Modal>
</template>
