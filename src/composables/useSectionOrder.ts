import { computed, type ComputedRef } from 'vue'
import type { Resume, SectionOrder } from '@/types'

export const DEFAULT_SECTION_ORDER: SectionOrder[] = [
  { id: 'personal', order: 0 },
  { id: 'experience', order: 1 },
  { id: 'education', order: 2 },
  { id: 'skills', order: 3 },
  { id: 'projects', order: 4 },
  { id: 'certifications', order: 5 },
  { id: 'languages', order: 6 },
  { id: 'links', order: 7 },
]

export function useSectionOrder(resume: ComputedRef<Resume> | Resume) {
  const getResume = () => 'value' in resume ? resume.value : resume

  const orderedSections = computed(() => {
    const r = getResume()
    const sectionOrder = r.sectionOrder && r.sectionOrder.length > 0
      ? r.sectionOrder
      : DEFAULT_SECTION_ORDER

    return [...sectionOrder].sort((a, b) => a.order - b.order).map(s => s.id)
  })

  function hasContent(sectionId: string): boolean {
    const r = getResume()
    switch (sectionId) {
      case 'personal':
        return Boolean(r.personalInfo.summary)
      case 'experience':
        return r.workExperience.length > 0
      case 'education':
        return r.education.length > 0
      case 'skills':
        return r.skills.filter(s => !s.isHidden).length > 0
      case 'projects':
        return r.projects.length > 0
      case 'certifications':
        return r.certifications.length > 0
      case 'languages':
        return r.languages.length > 0
      case 'links':
        return Boolean(r.links && r.links.length > 0)
      default:
        return false
    }
  }

  return {
    orderedSections,
    hasContent,
    DEFAULT_SECTION_ORDER,
  }
}
