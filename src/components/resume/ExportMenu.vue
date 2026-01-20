<script setup lang="ts">
import { ref } from 'vue'
import { exportToJSON, exportToPDF, exportToPrint } from '@/services/export'
import type { Resume } from '@/types'
import { useI18n } from '@/i18n'
import { useToast } from '@/composables/useToast'

interface Props {
  resume: Resume
  previewElementId: string
}

const props = defineProps<Props>()
const { t } = useI18n()
const { success, error: showError } = useToast()

const isLoadingPDF = ref(false)
const isLoadingJSON = ref(false)

async function handleExportJSON() {
  try {
    isLoadingJSON.value = true
    const json = exportToJSON(props.resume)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.resume.title || 'resume'}.json`
    a.click()
    URL.revokeObjectURL(url)
    success(t('export.jsonSuccess'))
  } catch (err) {
    console.error('Error exporting JSON:', err)
    showError(t('export.jsonError'))
  } finally {
    isLoadingJSON.value = false
  }
}

async function handleExportPDF() {
  try {
    isLoadingPDF.value = true
    const blob = await exportToPDF(props.resume, props.previewElementId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.resume.title || 'resume'}.pdf`
    a.click()
    URL.revokeObjectURL(url)
    success(t('export.pdfSuccess'))
  } catch (err) {
    console.error('Error exporting PDF:', err)
    showError(t('export.pdfError'))
  } finally {
    isLoadingPDF.value = false
  }
}

function handlePrint() {
  try {
    exportToPrint(props.previewElementId)
  } catch (err) {
    console.error('Error printing:', err)
    showError(t('export.printError'))
  }
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-primary btn-sm gap-2"
    >
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
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {{ t('export.title') }}
      <svg
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
    >
      <li>
        <button
          class="flex items-center gap-3"
          :disabled="isLoadingPDF"
          @click="handleExportPDF"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span class="flex-1">{{ t('export.pdf') }}</span>
          <span
            v-if="isLoadingPDF"
            class="loading loading-spinner loading-xs"
          />
        </button>
      </li>
      <li>
        <button
          class="flex items-center gap-3"
          :disabled="isLoadingPDF"
          @click="handlePrint"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-info"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span class="flex-1">{{ t('export.print') }}</span>
        </button>
      </li>
      <div class="divider my-1" />
      <li>
        <button
          class="flex items-center gap-3"
          :disabled="isLoadingJSON"
          @click="handleExportJSON"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-warning"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span class="flex-1">{{ t('export.json') }}</span>
          <span
            v-if="isLoadingJSON"
            class="loading loading-spinner loading-xs"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
