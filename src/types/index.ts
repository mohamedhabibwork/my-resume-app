// ============================================
// Common Types
// ============================================

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

/**
 * Generic ID type
 */
export type ID = string

/**
 * Timestamp fields for entities
 */
export interface Timestamps {
  createdAt: Date | string
  updatedAt: Date | string
}

// ============================================
// Resume Types
// ============================================

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  phones?: string[]
  location?: string
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
  summary?: string
  avatarUrl?: string
  dateOfBirth?: string
  nationality?: string
  drivingLicense?: string
  emails?: string[]
}

export interface WorkExperience {
  id: ID
  company: string
  position: string
  location?: string
  companyWebsite?: string
  supervisorName?: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  highlights: string[]
  skillsUsed?: string[]
  achievements?: string[]
  hasReferences?: boolean
}

export interface Education {
  id: ID
  institution: string
  degree: string
  field: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  highlights: string[]
  coursework?: string[]
  honors?: string[]
  thesis?: string
  degrees?: Array<{
    degree: string
    field: string
    year?: string
  }>
}

export interface Skill {
  id: ID
  name: string
  level: SkillLevel
  category: string
  showProgress: boolean
  isHidden: boolean
  progress?: number
}

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const

export type SkillLevel = (typeof SKILL_LEVELS)[keyof typeof SKILL_LEVELS]

export interface Project {
  id: ID
  name: string
  description: string
  technologies: string[]
  url?: string
  githubUrl?: string
  startDate?: string
  endDate?: string
  highlights: string[]
}

export interface Certification {
  id: ID
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Language {
  id: ID
  name: string
  proficiency: LanguageProficiency
}

export const LANGUAGE_PROFICIENCY = {
  NATIVE: 'native',
  FLUENT: 'fluent',
  ADVANCED: 'advanced',
  INTERMEDIATE: 'intermediate',
  BASIC: 'basic',
} as const

export type LanguageProficiency = (typeof LANGUAGE_PROFICIENCY)[keyof typeof LANGUAGE_PROFICIENCY]

export interface SectionOrder {
  id: string
  order: number
}

export interface FontSettings {
  family: string
  size: number
  weight: 'normal' | 'bold' | number
  lineHeight: number
}

export interface Theme {
  primary: string
  secondary: string
  text: string
  background: string
  accent: string
}

export interface Resume {
  id: ID
  userId: ID
  title: string
  personalInfo: PersonalInfo
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  links?: CustomLink[]
  template: string
  theme?: Theme
  fontSettings?: FontSettings
  sectionOrder?: SectionOrder[]
  isPublic: boolean
  slug?: string
  atsScore?: ATSResult
  timestamps: Timestamps
}

export interface CustomLink {
  id: ID
  label: string
  url: string
  type: 'portfolio' | 'blog' | 'other'
  icon?: string
}

export interface ATSResult {
  overall: number
  breakdown: {
    keywords: number
    formatting: number
    completeness: number
    structure: number
    bestPractices: number
  }
  suggestions: string[]
}

// ============================================
// User Types
// ============================================

export interface User {
  id: ID
  email: string
  displayName?: string
  photoUrl?: string
  emailVerified: boolean
  timestamps: Timestamps
}

// ============================================
// Form Types
// ============================================

export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  validation?: (value: unknown) => string | undefined
}

// ============================================
// UI Types
// ============================================

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES]

export interface Toast {
  id: ID
  type: ToastType
  message: string
  duration?: number
}

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DANGER: 'danger',
} as const

export type ButtonVariant = (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS]

export const BUTTON_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const

export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES]

// ============================================
// Cover Letter Types
// ============================================

export interface CoverLetter {
  id: ID
  userId: ID
  resumeId?: ID
  title: string
  recipientName?: string
  recipientCompany?: string
  recipientAddress?: string
  greeting: string
  body: string
  closing: string
  signature?: string
  template: string
  fontSettings?: FontSettings
  timestamps: Timestamps
}
