import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createFirestoreService } from '@/services/firestore'
import { useAuthStore } from '@/stores/useAuthStore'
import { where, orderBy } from 'firebase/firestore'
import type { Resume, ID, FontSettings } from '@/types'
import { generateSlug } from '@/utils/helpers'

// Default font settings for new resumes
const DEFAULT_FONT_SETTINGS: FontSettings = {
  family: 'Arial, sans-serif',
  size: 14,
  weight: 'normal',
  lineHeight: 1.5,
}

interface ResumeDocument extends Resume {
  timestamps: {
    createdAt: string | Date
    updatedAt: string | Date
  }
}

const resumeService = createFirestoreService<ResumeDocument>('resumes')

/**
 * Resume Store - Optimized for Firebase Free Tier
 *
 * FREE TIER OPTIMIZATIONS:
 * - Uses real-time listeners (onSnapshot) instead of polling
 * - Offline persistence enabled to cache data locally
 * - Debounced updates to minimize write operations
 * - Single query subscription per user (not per resume)
 */
export const useResumeStore = defineStore('resume', () => {
  // State
  const resumes = ref<Resume[]>([])
  const currentResume = ref<Resume | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  let unsubscribeResumes: (() => void) | null = null
  let unsubscribeCurrentResume: (() => void) | null = null

  // Getters
  const resumeById = computed(() => {
    return (id: ID) => resumes.value.find((r) => r.id === id) || null
  })

  const publicResumes = computed(() => resumes.value.filter((r) => r.isPublic))

  // Actions
  async function fetchResumes() {
    try {
      isLoading.value = true
      error.value = null
      const authStore = useAuthStore()

      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      // Subscribe to real-time updates
      if (unsubscribeResumes) {
        unsubscribeResumes()
      }

      unsubscribeResumes = resumeService.subscribeToQuery(
        [where('userId', '==', authStore.user.uid), orderBy('timestamps.updatedAt', 'desc')],
        (data) => {
          resumes.value = data.map((doc) => ({
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
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch resumes'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchResume(id: ID) {
    try {
      isLoading.value = true
      error.value = null

      // Subscribe to real-time updates
      if (unsubscribeCurrentResume) {
        unsubscribeCurrentResume()
      }

      unsubscribeCurrentResume = resumeService.subscribe(id, (data) => {
        if (data) {
          currentResume.value = {
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
          currentResume.value = null
        }
      })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch resume'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createResume(data: Partial<Resume>): Promise<ID> {
    try {
      isLoading.value = true
      error.value = null
      const authStore = useAuthStore()

      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      const resumeData: Omit<Resume, 'id' | 'timestamps'> = {
        userId: authStore.user.uid,
        title: data.title || 'Untitled Resume',
        personalInfo: data.personalInfo || {
          firstName: '',
          lastName: '',
          email: authStore.user.email || '',
        },
        workExperience: data.workExperience || [],
        education: data.education || [],
        skills: data.skills || [],
        projects: data.projects || [],
        certifications: data.certifications || [],
        languages: data.languages || [],
        links: data.links || [],
        template: data.template || 'modern',
        // Only include theme if it's defined (not undefined)
        ...(data.theme && { theme: data.theme }),
        // Include fontSettings with defaults
        fontSettings: data.fontSettings || DEFAULT_FONT_SETTINGS,
        sectionOrder: data.sectionOrder || [],
        isPublic: data.isPublic ?? false,
        slug: data.slug || generateSlug(data.title || 'resume'),
        // Only include atsScore if it's defined
        ...(data.atsScore !== undefined && { atsScore: data.atsScore }),
      }

      const id = await resumeService.create(resumeData)
      return id
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create resume'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateResume(id: ID, data: Partial<Resume>) {
    try {
      isLoading.value = true
      error.value = null

      // Generate slug if title changed
      if (data.title && !data.slug) {
        data.slug = generateSlug(data.title)
      }

      // Calculate ATS score if resume data is being updated
      const currentResumeData = currentResume.value || resumes.value.find((r) => r.id === id)
      if (currentResumeData) {
        const updatedResume = { ...currentResumeData, ...data } as Resume
        const { calculateATSScore } = await import('@/services/atsScore')
        const atsResult = calculateATSScore(updatedResume)
        // Set the full ATS result (not just the overall score)
        // The removeUndefined function will handle any undefined values
        data.atsScore = atsResult
      }

      await resumeService.update(id, data)

      // Update local state
      if (currentResume.value?.id === id) {
        currentResume.value = { ...currentResume.value, ...data }
      }

      const index = resumes.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        resumes.value[index] = { ...resumes.value[index], ...data } as Resume
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update resume'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteResume(id: ID) {
    try {
      isLoading.value = true
      error.value = null
      await resumeService.delete(id)

      // Remove from local state
      resumes.value = resumes.value.filter((r) => r.id !== id)
      if (currentResume.value?.id === id) {
        currentResume.value = null
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete resume'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function duplicateResume(id: ID): Promise<ID> {
    try {
      isLoading.value = true
      error.value = null

      const resume = resumeById.value(id)
      if (!resume) {
        throw new Error('Resume not found')
      }

      const duplicatedData: Partial<Resume> = {
        ...resume,
        title: `${resume.title} (Copy)`,
        isPublic: false,
        slug: generateSlug(`${resume.title}-copy`),
      }

      delete (duplicatedData as { id?: ID }).id

      return await createResume(duplicatedData)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to duplicate resume'
      error.value = errorMessage
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function reorderSections(id: ID, newOrder: Array<{ id: string; order: number }>) {
    try {
      await updateResume(id, { sectionOrder: newOrder })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to reorder sections'
      error.value = errorMessage
      throw e
    }
  }

  async function updateTemplate(id: ID, template: string) {
    try {
      await updateResume(id, { template })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update template'
      error.value = errorMessage
      throw e
    }
  }

  async function updateTheme(id: ID, theme: Resume['theme']) {
    try {
      await updateResume(id, { theme })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update theme'
      error.value = errorMessage
      throw e
    }
  }

  async function updateFontSettings(id: ID, fontSettings: Resume['fontSettings']) {
    try {
      await updateResume(id, { fontSettings })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update font settings'
      error.value = errorMessage
      throw e
    }
  }

  function clearCurrentResume() {
    if (unsubscribeCurrentResume) {
      unsubscribeCurrentResume()
      unsubscribeCurrentResume = null
    }
    currentResume.value = null
  }

  function cleanup() {
    if (unsubscribeResumes) {
      unsubscribeResumes()
      unsubscribeResumes = null
    }
    if (unsubscribeCurrentResume) {
      unsubscribeCurrentResume()
      unsubscribeCurrentResume = null
    }
  }

  return {
    // State
    resumes,
    currentResume,
    isLoading,
    error,
    // Getters
    resumeById,
    publicResumes,
    // Actions
    fetchResumes,
    fetchResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    reorderSections,
    updateTemplate,
    updateTheme,
    updateFontSettings,
    clearCurrentResume,
    cleanup,
  }
})
