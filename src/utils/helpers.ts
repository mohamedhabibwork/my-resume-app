import type { ID } from '@/types'

/**
 * Generate a unique ID
 */
export function generateId(): ID {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Remove undefined values from an object recursively
 * Firestore doesn't allow undefined values
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue // Skip undefined values
    }

    if (value === null) {
      cleaned[key as keyof T] = null as T[keyof T]
    } else if (Array.isArray(value)) {
      // Clean array items
      const cleanedArray = value.map((item) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return removeUndefined(item as Record<string, unknown>)
        }
        return item
      })
      cleaned[key as keyof T] = cleanedArray as T[keyof T]
    } else if (typeof value === 'object' && value !== null) {
      // Recursively clean nested objects
      cleaned[key as keyof T] = removeUndefined(value as Record<string, unknown>) as T[keyof T]
    } else {
      cleaned[key as keyof T] = value as T[keyof T]
    }
  }

  return cleaned
}
