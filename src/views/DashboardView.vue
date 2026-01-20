<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResume } from '@/composables/useResume'
import { useI18n } from '@/i18n'
import ResumeCard from '@/components/resume/ResumeCard.vue'

const router = useRouter()
const { t } = useI18n()
const { resumes, fetchResumes, deleteResume, duplicateResume, isLoading } = useResume()

onMounted(async () => {
  await fetchResumes()
})

onUnmounted(() => {
  // Cleanup if needed
})

async function handleDelete(id: string) {
  if (confirm(t('resume.deleteConfirm'))) {
    await deleteResume(id)
  }
}

async function handleDuplicate(id: string) {
  await duplicateResume(id)
}
</script>

<template>
  <div class="min-h-screen bg-base-200 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-base-content">
            {{ t('resume.myResumes') }}
          </h1>
          <p class="text-base-content/70 mt-1">
            Manage and edit your resumes
          </p>
        </div>
        <button
          class="btn btn-primary"
          @click="router.push('/resume/new')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ t('resume.createNew') }}
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-20"
      >
        <span class="loading loading-spinner loading-lg text-primary" />
        <p class="text-base-content/70 mt-4">
          {{ t('common.loading') }}
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="resumes.length === 0"
        class="card bg-base-100 shadow-xl"
      >
        <div class="card-body items-center text-center py-16">
          <div class="text-6xl mb-4">
            📄
          </div>
          <h2 class="card-title text-2xl mb-2">
            No Resumes Yet
          </h2>
          <p class="text-base-content/70 max-w-md mb-6">
            Create your first professional resume and stand out to employers. It only takes a few minutes!
          </p>
          <button
            class="btn btn-primary btn-lg"
            @click="router.push('/resume/new')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{ t('resume.createNew') }}
          </button>
        </div>
      </div>

      <!-- Resume Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ResumeCard
          v-for="resume in resumes"
          :key="resume.id"
          :resume="resume"
          @delete="handleDelete"
          @duplicate="handleDuplicate"
        />
      </div>
    </div>
  </div>
</template>
