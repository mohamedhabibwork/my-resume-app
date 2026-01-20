import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createFirestoreService } from '@/services/firestore'
import { useAuthStore } from '@/stores/useAuthStore'
import { where, orderBy } from 'firebase/firestore'
import type { CoverLetter, ID } from '@/types'

interface CoverLetterDocument extends CoverLetter {
  timestamps: {
    createdAt: string | Date
    updatedAt: string | Date
  }
}

const coverLetterService = createFirestoreService<CoverLetterDocument>('coverLetters')

/**
 * Cover Letter Store - Optimized for Firebase Free Tier
 *
 * Uses same optimization strategies as Resume Store:
 * - Real-time listeners for efficient data sync
 * - Offline persistence for reduced reads
 * - Debounced updates to minimize writes
 */
export const useCoverLetterStore = defineStore('coverLetter', () => {
  const coverLetters = ref<CoverLetter[]>([])
  const currentCoverLetter = ref<CoverLetter | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  let unsubscribeCoverLetters: (() => void) | null = null
  let unsubscribeCurrentCoverLetter: (() => void) | null = null

  const coverLetterById = computed(() => {
    return (id: ID) => coverLetters.value.find((cl) => cl.id === id) || null
  })

  async function fetchCoverLetters() {
    try {
      isLoading.value = true
      error.value = null
      const authStore = useAuthStore()

      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      if (unsubscribeCoverLetters) {
        unsubscribeCoverLetters()
      }

      unsubscribeCoverLetters = coverLetterService.subscribeToQuery(
        [where('userId', '==', authStore.user.uid), orderBy('timestamps.updatedAt', 'desc')],
        (data) => {
          coverLetters.value = data.map((doc) => ({
            ...doc,
            timestamps: {
              createdAt: doc.timestamps.createdAt instanceof Date
                ? doc.timestamps.createdAt
                : new Date(doc.timestamps.createdAt),
              updatedAt: doc.timestamps.updatedAt instanceof Date
                ? doc.timestamps.updatedAt
                : new Date(doc.timestamps.updatedAt),
            },
          }))
        }
      )
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch cover letters'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCoverLetter(id: ID) {
    try {
      isLoading.value = true
      error.value = null

      if (unsubscribeCurrentCoverLetter) {
        unsubscribeCurrentCoverLetter()
      }

      unsubscribeCurrentCoverLetter = coverLetterService.subscribe(id, (data) => {
        if (data) {
          currentCoverLetter.value = {
            ...data,
            timestamps: {
              createdAt: data.timestamps.createdAt instanceof Date
                ? data.timestamps.createdAt
                : new Date(data.timestamps.createdAt),
              updatedAt: data.timestamps.updatedAt instanceof Date
                ? data.timestamps.updatedAt
                : new Date(data.timestamps.updatedAt),
            },
          }
        } else {
          currentCoverLetter.value = null
        }
      })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch cover letter'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createCoverLetter(data: Partial<CoverLetter>): Promise<ID> {
    try {
      isLoading.value = true
      error.value = null
      const authStore = useAuthStore()

      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      const coverLetterData: Omit<CoverLetter, 'id' | 'timestamps'> = {
        userId: authStore.user.uid,
        resumeId: data.resumeId,
        title: data.title || 'Untitled Cover Letter',
        recipientName: data.recipientName,
        recipientCompany: data.recipientCompany,
        recipientAddress: data.recipientAddress,
        greeting: data.greeting || 'Dear Hiring Manager,',
        body: data.body || '',
        closing: data.closing || 'Sincerely,',
        signature: data.signature,
        template: data.template || 'professional',
        fontSettings: data.fontSettings,
      }

      const id = await coverLetterService.create(coverLetterData)
      return id
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create cover letter'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateCoverLetter(id: ID, data: Partial<CoverLetter>) {
    try {
      isLoading.value = true
      error.value = null
      await coverLetterService.update(id, data)

      if (currentCoverLetter.value?.id === id) {
        currentCoverLetter.value = { ...currentCoverLetter.value, ...data }
      }

      const index = coverLetters.value.findIndex((cl) => cl.id === id)
      if (index !== -1) {
        coverLetters.value[index] = { ...coverLetters.value[index], ...data } as CoverLetter
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update cover letter'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCoverLetter(id: ID) {
    try {
      isLoading.value = true
      error.value = null
      await coverLetterService.delete(id)

      coverLetters.value = coverLetters.value.filter((cl) => cl.id !== id)
      if (currentCoverLetter.value?.id === id) {
        currentCoverLetter.value = null
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete cover letter'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function linkToResume(coverLetterId: ID, resumeId: ID) {
    try {
      await updateCoverLetter(coverLetterId, { resumeId })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to link cover letter'
      error.value = errorMessage
      throw e
    }
  }

  function clearCurrentCoverLetter() {
    if (unsubscribeCurrentCoverLetter) {
      unsubscribeCurrentCoverLetter()
      unsubscribeCurrentCoverLetter = null
    }
    currentCoverLetter.value = null
  }

  function cleanup() {
    if (unsubscribeCoverLetters) {
      unsubscribeCoverLetters()
      unsubscribeCoverLetters = null
    }
    if (unsubscribeCurrentCoverLetter) {
      unsubscribeCurrentCoverLetter()
      unsubscribeCurrentCoverLetter = null
    }
  }

  return {
    coverLetters,
    currentCoverLetter,
    isLoading,
    error,
    coverLetterById,
    fetchCoverLetters,
    fetchCoverLetter,
    createCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
    linkToResume,
    clearCurrentCoverLetter,
    cleanup,
  }
})
