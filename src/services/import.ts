import type { Resume } from '@/types'
import { generateId } from '@/utils/helpers'

/**
 * Import resume from JSON
 */
export function importFromJSON(json: string): Resume {
  try {
    const data = JSON.parse(json)
    return validateResumeData(data)
  } catch {
    throw new Error('Invalid JSON format')
  }
}

/**
 * Validate resume data structure
 */
export function validateResumeData(data: unknown): Resume {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid resume data: must be an object')
  }

  const resume = data as Partial<Resume>

  // Ensure required fields
  if (!resume.personalInfo) {
    throw new Error('Missing required field: personalInfo')
  }

  if (!resume.personalInfo.firstName || !resume.personalInfo.lastName || !resume.personalInfo.email) {
    throw new Error('Missing required personal information fields')
  }

  // Create a valid resume object with defaults
  const validatedResume: Resume = {
    id: resume.id || generateId(),
    userId: resume.userId || '',
    title: resume.title || 'Imported Resume',
    personalInfo: {
      firstName: resume.personalInfo.firstName,
      lastName: resume.personalInfo.lastName,
      email: resume.personalInfo.email,
      phone: resume.personalInfo.phone,
      location: resume.personalInfo.location,
      website: resume.personalInfo.website,
      linkedin: resume.personalInfo.linkedin,
      github: resume.personalInfo.github,
      summary: resume.personalInfo.summary,
      avatarUrl: resume.personalInfo.avatarUrl,
    },
    workExperience: resume.workExperience || [],
    education: resume.education || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
    certifications: resume.certifications || [],
    languages: resume.languages || [],
    links: resume.links || [],
    template: resume.template || 'modern',
    theme: resume.theme,
    fontSettings: resume.fontSettings,
    sectionOrder: resume.sectionOrder || [],
    isPublic: resume.isPublic ?? false,
    slug: resume.slug,
    atsScore: resume.atsScore,
    timestamps: resume.timestamps || {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }

  return validatedResume
}

/**
 * Merge imported resume data with existing resume
 */
export function mergeResumeData(existing: Resume, imported: Resume): Resume {
  return {
    ...existing,
    ...imported,
    id: existing.id, // Keep existing ID
    userId: existing.userId, // Keep existing userId
    timestamps: existing.timestamps, // Keep existing timestamps
  }
}
