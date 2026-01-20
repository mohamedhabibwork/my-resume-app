// Formatting utilities
export {
  formatDate,
  formatDateRange,
  formatNumber,
  capitalize,
  truncate,
  slugify,
  formatPhone,
} from './format'

// Validation utilities
export {
  isEmpty,
  required,
  email,
  minLength,
  maxLength,
  url,
  phone,
  pattern,
  compose,
  validateObject,
  type ValidationRule,
  type ValidationResult,
} from './validation'

// Helper utilities
export {
  generateId,
  generateSlug,
  removeUndefined,
} from './helpers'
