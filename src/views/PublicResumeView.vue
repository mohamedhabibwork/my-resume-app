<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { createFirestoreService } from '@/services/firestore'
import ResumePreview from '@/components/resume/ResumePreview.vue'
import type { Resume } from '@/types'

const route = useRoute()
const resumeService = createFirestoreService<Resume>('resumes')
const resume = ref<Resume | null>(null)
const isLoading = ref(true)
const previewElementId = 'public-resume-preview'

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const resumes = await resumeService.getByField('slug', slug)
    const publicResume = resumes.find((r) => r.isPublic)
    if (publicResume) {
      resume.value = publicResume
    }
  } catch (error) {
    console.error('Error fetching public resume:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div
      v-if="isLoading"
      class="text-center py-12"
    >
      <p class="text-gray-500">
        Loading...
      </p>
    </div>
    <div
      v-else-if="resume"
      class="max-w-4xl mx-auto space-y-4"
    >
      <div class="flex justify-end">
        <ExportMenu
          :resume="resume"
          :preview-element-id="previewElementId"
        />
      </div>
      <div
        :id="previewElementId"
        class="bg-white shadow-lg"
      >
        <ResumePreview :resume="resume" />
      </div>
    </div>
    <div
      v-else
      class="text-center py-12"
    >
      <p class="text-gray-500">
        Resume not found
      </p>
    </div>
  </div>
</template>
