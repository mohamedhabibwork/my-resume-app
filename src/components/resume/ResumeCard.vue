<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import type { Resume } from '@/types'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [id: string]
  duplicate: [id: string]
}>()

const router = useRouter()
const { t } = useI18n()

const atsScore = computed(() => {
  return props.resume.atsScore?.overall || null
})

const atsScoreClass = computed(() => {
  if (atsScore.value === null) return ''
  if (atsScore.value >= 80) return 'badge-success'
  if (atsScore.value >= 60) return 'badge-warning'
  return 'badge-error'
})

function handleEdit() {
  router.push(`/resume/${props.resume.id}`)
}

function handleDelete() {
  if (confirm(t('resume.deleteConfirm'))) {
    emit('delete', props.resume.id)
  }
}

function handleDuplicate() {
  emit('duplicate', props.resume.id)
}

function handleShare() {
  if (props.resume.isPublic && props.resume.slug) {
    const url = `${window.location.origin}/resume/public/${props.resume.slug}`
    navigator.clipboard.writeText(url)
    // Could show a toast notification here
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
    <div class="card-body">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="card-title text-lg truncate">
            {{ resume.title }}
          </h2>
          <p class="text-sm text-base-content/60 mt-1">
            Updated: {{ new Date(resume.timestamps.updatedAt).toLocaleDateString() }}
          </p>
        </div>
        <div
          v-if="atsScore !== null"
          class="ml-4"
        >
          <div :class="['badge', atsScoreClass, 'badge-lg', 'font-semibold']">
            ATS: {{ atsScore }}
          </div>
        </div>
      </div>

      <!-- Template Badge -->
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="badge badge-outline badge-sm">{{ resume.template }}</span>
        <span
          v-if="resume.isPublic"
          class="badge badge-primary badge-outline badge-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Public
        </span>
      </div>

      <!-- Actions -->
      <div class="card-actions justify-end mt-4">
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-sm btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
          >
            <li>
              <button @click="handleDuplicate">
                {{ t('resume.duplicate') }}
              </button>
            </li>
            <li v-if="resume.isPublic && resume.slug">
              <button @click="handleShare">
                {{ t('resume.share') }}
              </button>
            </li>
            <div class="divider my-0" />
            <li>
              <button
                class="text-error"
                @click="handleDelete"
              >
                {{ t('common.delete') }}
              </button>
            </li>
          </ul>
        </div>
        <button
          class="btn btn-primary btn-sm"
          @click="handleEdit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {{ t('common.edit') }}
        </button>
      </div>
    </div>
  </div>
</template>
