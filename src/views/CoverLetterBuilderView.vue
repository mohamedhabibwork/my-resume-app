<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoverLetterStore } from '@/stores/useCoverLetterStore'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const store = useCoverLetterStore()

const title = ref('')
const recipientName = ref('')
const recipientCompany = ref('')
const greeting = ref('Dear Hiring Manager,')
const body = ref('')
const closing = ref('Sincerely,')

onMounted(async () => {
  const id = route.params.id as string
  if (id && id !== 'new') {
    await store.fetchCoverLetter(id)
    if (store.currentCoverLetter) {
      title.value = store.currentCoverLetter.title
      recipientName.value = store.currentCoverLetter.recipientName || ''
      recipientCompany.value = store.currentCoverLetter.recipientCompany || ''
      greeting.value = store.currentCoverLetter.greeting
      body.value = store.currentCoverLetter.body
      closing.value = store.currentCoverLetter.closing
    }
  }
})

async function save() {
  if (store.currentCoverLetter?.id) {
    await store.updateCoverLetter(store.currentCoverLetter.id, {
      title: title.value,
      recipientName: recipientName.value,
      recipientCompany: recipientCompany.value,
      greeting: greeting.value,
      body: body.value,
      closing: closing.value,
    })
  } else {
    const id = await store.createCoverLetter({
      title: title.value,
      recipientName: recipientName.value,
      recipientCompany: recipientCompany.value,
      greeting: greeting.value,
      body: body.value,
      closing: closing.value,
    })
    router.replace(`/cover-letter/${id}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Cover Letter Builder
        </h1>
        <div class="flex gap-2">
          <Button
            variant="outline"
            @click="router.push('/cover-letters')"
          >
            Back
          </Button>
          <Button
            :loading="store.isLoading"
            @click="save"
          >
            Save
          </Button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 space-y-6">
        <Input
          v-model="title"
          label="Title"
          required
        />

        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model="recipientName"
            label="Recipient Name"
          />
          <Input
            v-model="recipientCompany"
            label="Recipient Company"
          />
        </div>

        <Input
          v-model="greeting"
          label="Greeting"
        />

        <Textarea
          v-model="body"
          label="Body"
          rows="15"
          placeholder="Write your cover letter body here..."
        />

        <Input
          v-model="closing"
          label="Closing"
        />
      </div>
    </div>
  </div>
</template>
