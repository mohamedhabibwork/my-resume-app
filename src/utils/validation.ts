/**
 * Validation utilities for forms
 */

export type ValidationRule = (value: unknown) => string | undefined
export type ValidationResult = string | undefined

/**
 * Check if value is empty (null, undefined, or empty string)
 */
export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

/**
 * Required field validation
 */
export function required(message = 'This field is required'): ValidationRule {
  return (value: unknown) => {
    if (isEmpty(value)) return message
    if (typeof value === 'string' && value.trim() === '') return message
    return undefined
  }
}

/**
 * Email validation
 */
export function email(message = 'Please enter a valid email'): ValidationRule {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return (value: unknown) => {
    if (isEmpty(value)) return undefined
    if (typeof value !== 'string' || !emailRegex.test(value)) {
      return message
    }
    return undefined
  }
}

/**
 * Minimum length validation
 */
export function minLength(min: number, message?: string): ValidationRule {
  return (value: unknown) => {
    if (isEmpty(value)) return undefined
    if (typeof value === 'string' && value.length < min) {
      return message ?? `Must be at least ${min} characters`
    }
    return undefined
  }
}

/**
 * Maximum length validation
 */
export function maxLength(max: number, message?: string): ValidationRule {
  return (value: unknown) => {
    if (isEmpty(value)) return undefined
    if (typeof value === 'string' && value.length > max) {
      return message ?? `Must be no more than ${max} characters`
    }
    return undefined
  }
}

/**
 * URL validation
 */
export function url(message = 'Please enter a valid URL'): ValidationRule {
  return (value: unknown) => {
    if (isEmpty(value)) return undefined
    try {
      new URL(value as string)
      return undefined
    } catch {
      return message
    }
  }
}

/**
 * Phone number validation
 */
export function phone(message = 'Please enter a valid phone number'): ValidationRule {
  const phoneRegex = /^[\d\s\-+()]{10,}$/
  return (value: unknown) => {
    if (isEmpty(value)) return undefined
    if (typeof value !== 'string' || !phoneRegex.test(value)) {
      return message
    }
    return undefined
  }
}

/**
 * Pattern validation
 */
export function pattern(regex: RegExp, message: string): ValidationRule {
  return (value: unknown) => {
    if (isEmpty(value)) return undefined
    if (typeof value !== 'string' || !regex.test(value)) {
      return message
    }
    return undefined
  }
}

/**
 * Compose multiple validation rules
 */
export function compose(...rules: ValidationRule[]): ValidationRule {
  return (value: unknown) => {
    for (const rule of rules) {
      const result = rule(value)
      if (result) return result
    }
    return undefined
  }
}

/**
 * Validate an object against a schema
 */
export function validateObject<T extends Record<string, unknown>>(
  data: T,
  schema: Partial<Record<keyof T, ValidationRule>>
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [field, rule] of Object.entries(schema)) {
    if (rule) {
      const error = rule(data[field as keyof T])
      if (error) {
        errors[field] = error
      }
    }
  }

  return errors
}
