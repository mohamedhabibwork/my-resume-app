import type { Resume, ATSResult } from '@/types'

/**
 * Calculate ATS (Applicant Tracking System) score for a resume
 */
export function calculateATSScore(resume: Resume): ATSResult {
  const breakdown = {
    keywords: calculateKeywordsScore(resume),
    formatting: calculateFormattingScore(resume),
    completeness: calculateCompletenessScore(resume),
    structure: calculateStructureScore(resume),
    bestPractices: calculateBestPracticesScore(resume),
  }

  const overall = Math.round(
    breakdown.keywords * 0.3 +
    breakdown.formatting * 0.25 +
    breakdown.completeness * 0.2 +
    breakdown.structure * 0.15 +
    breakdown.bestPractices * 0.1
  )

  const suggestions = generateSuggestions(resume, breakdown)

  return {
    overall,
    breakdown,
    suggestions,
  }
}

function calculateKeywordsScore(resume: Resume): number {
  let score = 0
  const maxScore = 100

  // Check for common resume keywords
  const commonKeywords = [
    'leadership', 'management', 'experience', 'skills', 'achievement',
    'project', 'team', 'development', 'implementation', 'analysis',
    'strategy', 'communication', 'problem-solving', 'collaboration',
  ]

  const resumeText = JSON.stringify(resume).toLowerCase()
  const foundKeywords = commonKeywords.filter((keyword) =>
    resumeText.includes(keyword)
  )

  score = Math.min((foundKeywords.length / commonKeywords.length) * 100, maxScore)

  return Math.round(score)
}

function calculateFormattingScore(resume: Resume): number {
  let score = 100

  // Check for proper structure
  if (!resume.personalInfo.firstName || !resume.personalInfo.lastName) {
    score -= 20
  }

  if (!resume.personalInfo.email) {
    score -= 10
  }

  // Check for consistent date formats
  const hasDates = resume.workExperience.some((exp) => exp.startDate)
  if (!hasDates) {
    score -= 15
  }

  // Check for proper sections
  const hasExperience = resume.workExperience.length > 0
  const hasEducation = resume.education.length > 0
  const hasSkills = resume.skills.filter((s) => !s.isHidden).length > 0

  if (!hasExperience) score -= 20
  if (!hasEducation) score -= 15
  if (!hasSkills) score -= 10

  return Math.max(0, Math.round(score))
}

function calculateCompletenessScore(resume: Resume): number {
  let score = 0
  const maxScore = 100

  // Personal info completeness (20 points)
  const personalInfoFields = [
    resume.personalInfo.firstName,
    resume.personalInfo.lastName,
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.summary,
  ]
  const filledPersonalInfo = personalInfoFields.filter(Boolean).length
  score += (filledPersonalInfo / personalInfoFields.length) * 20

  // Work experience completeness (30 points)
  if (resume.workExperience.length > 0) {
    const exp = resume.workExperience[0]
    if (exp) {
      const expFields = [exp.company, exp.position, exp.startDate, exp.description]
      const filledExpFields = expFields.filter(Boolean).length
      score += (filledExpFields / expFields.length) * 30
    }
  }

  // Education completeness (20 points)
  if (resume.education.length > 0) {
    const edu = resume.education[0]
    if (edu) {
      const eduFields = [edu.institution, edu.degree, edu.field, edu.startDate]
      const filledEduFields = eduFields.filter(Boolean).length
      score += (filledEduFields / eduFields.length) * 20
    }
  }

  // Skills completeness (15 points)
  if (resume.skills.filter((s) => !s.isHidden).length > 0) {
    score += 15
  }

  // Additional sections (15 points)
  if (resume.projects.length > 0) score += 5
  if (resume.certifications.length > 0) score += 5
  if (resume.languages.length > 0) score += 5

  return Math.min(Math.round(score), maxScore)
}

function calculateStructureScore(resume: Resume): number {
  let score = 100

  // Check for logical flow
  if (resume.workExperience.length === 0 && resume.education.length === 0) {
    score -= 30
  }

  // Check for proper ordering (most recent first)
  const experiences = resume.workExperience
  if (experiences.length > 1) {
    for (let i = 0; i < experiences.length - 1; i++) {
      const currentExp = experiences[i]
      const nextExp = experiences[i + 1]
      if (currentExp?.startDate && nextExp?.startDate) {
        const current = new Date(currentExp.startDate)
        const next = new Date(nextExp.startDate)
        if (current < next) {
          score -= 10
          break
        }
      }
    }
  }

  // Check for summary
  if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 50) {
    score -= 15
  }

  return Math.max(0, Math.round(score))
}

function calculateBestPracticesScore(resume: Resume): number {
  let score = 0
  const maxScore = 100

  // Action verbs check
  const actionVerbs = [
    'developed', 'implemented', 'created', 'managed', 'led', 'achieved',
    'improved', 'designed', 'built', 'launched', 'optimized', 'increased',
  ]

  const resumeText = JSON.stringify(resume).toLowerCase()
  const foundActionVerbs = actionVerbs.filter((verb) => resumeText.includes(verb))
  score += (foundActionVerbs.length / actionVerbs.length) * 50

  // Quantifiable achievements
  const hasNumbers = /\d+/.test(resumeText)
  if (hasNumbers) {
    score += 30
  }

  // Professional summary
  if (resume.personalInfo.summary && resume.personalInfo.summary.length >= 100) {
    score += 20
  }

  return Math.min(Math.round(score), maxScore)
}

function generateSuggestions(resume: Resume, breakdown: ATSResult['breakdown']): string[] {
  const suggestions: string[] = []

  if (breakdown.keywords < 70) {
    suggestions.push('Add more industry-relevant keywords to improve discoverability')
  }

  if (breakdown.formatting < 80) {
    suggestions.push('Ensure all required sections are filled out completely')
  }

  if (breakdown.completeness < 80) {
    suggestions.push('Fill out all resume sections to improve completeness score')
  }

  if (breakdown.structure < 80) {
    suggestions.push('Add a professional summary and ensure proper section ordering')
  }

  if (breakdown.bestPractices < 70) {
    suggestions.push('Use action verbs and include quantifiable achievements')
  }

  if (resume.personalInfo.summary && resume.personalInfo.summary.length < 100) {
    suggestions.push('Expand your professional summary to at least 100 characters')
  }

  if (resume.workExperience.length === 0) {
    suggestions.push('Add work experience to strengthen your resume')
  }

  if (resume.skills.filter((s) => !s.isHidden).length < 5) {
    suggestions.push('Add more skills to showcase your capabilities')
  }

  return suggestions
}
