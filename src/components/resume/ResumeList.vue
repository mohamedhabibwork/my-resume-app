<script setup lang="ts">
import { computed } from 'vue'
import { useResume } from '@/composables/useResume'
import ResumeCard from './ResumeCard.vue'
import Button from '@/components/ui/Button.vue'
import type { Resume } from '@/types'

interface Props {
  filter?: (resume: Resume) => boolean
  showCreateButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCreateButton: true,
})

defineEmits<{
  create: []
  delete: [id: string]
  duplicate: [id: string]
}>()

const { resumes, isLoading } = useResume()

const filteredResumes = computed(() => {
  if (props.filter) {
    return resumes.value.filter(props.filter)
  }
  return resumes.value
})
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="showCreateButton"
      class="flex justify-end mb-4"
    >
      <Button @click="$emit('create')">
        Create New Resume
      </Button>
    </div>

    <div
      v-if="isLoading"
      class="text-center py-12"
    >
      <p class="text-gray-500">
        Loading resumes...
      </p>
    </div>

    <div
      v-else-if="filteredResumes.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500 mb-4">
        No resumes found
      </p>
      <Button
        v-if="showCreateButton"
        @click="$emit('create')"
      >
        Create Your First Resume
      </Button>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ResumeCard
        v-for="resume in filteredResumes"
        :key="resume.id"
        :resume="resume"
        @delete="$emit('delete', $event)"
        @duplicate="$emit('duplicate', $event)"
      />
    </div>
  </div>
</template>
