<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoverLetterStore } from '@/stores/useCoverLetterStore'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const store = useCoverLetterStore()

onMounted(async () => {
  await store.fetchCoverLetters()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Cover Letters
        </h1>
        <Button @click="router.push('/cover-letter/new')">
          Create New
        </Button>
      </div>

      <div
        v-if="store.isLoading"
        class="text-center py-12"
      >
        <p class="text-gray-500">
          Loading...
        </p>
      </div>

      <div
        v-else-if="store.coverLetters.length === 0"
        class="text-center py-12"
      >
        <p class="text-gray-500 mb-4">
          No cover letters yet. Create your first one!
        </p>
        <Button @click="router.push('/cover-letter/new')">
          Create New
        </Button>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <Card
          v-for="coverLetter in store.coverLetters"
          :key="coverLetter.id"
          class="hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">
              {{ coverLetter.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Updated: {{ new Date(coverLetter.timestamps.updatedAt).toLocaleDateString() }}
            </p>
            <div class="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                @click="router.push(`/cover-letter/${coverLetter.id}`)"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                @click="store.deleteCoverLetter(coverLetter.id)"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
