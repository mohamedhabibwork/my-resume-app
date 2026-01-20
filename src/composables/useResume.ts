import { computed } from 'vue'
import { useResumeStore } from '@/stores/useResumeStore'

export function useResume() {
  const store = useResumeStore()

  return {
    resumes: computed(() => store.resumes),
    currentResume: computed(() => store.currentResume),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    resumeById: store.resumeById,
    publicResumes: computed(() => store.publicResumes),
    fetchResumes: store.fetchResumes,
    fetchResume: store.fetchResume,
    createResume: store.createResume,
    updateResume: store.updateResume,
    deleteResume: store.deleteResume,
    duplicateResume: store.duplicateResume,
    reorderSections: store.reorderSections,
    updateTemplate: store.updateTemplate,
    updateTheme: store.updateTheme,
    updateFontSettings: store.updateFontSettings,
    clearCurrentResume: store.clearCurrentResume,
  }
}
