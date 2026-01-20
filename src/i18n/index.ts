import { ref, computed } from 'vue'
import en from './en'
import ar from './ar'

// Available locales
export const LOCALES = {
  EN: 'en',
  AR: 'ar',
} as const

export type Locale = (typeof LOCALES)[keyof typeof LOCALES]

// Translations map
const translations = {
  en,
  ar,
} as const

// Current locale (reactive)
const currentLocale = ref<Locale>(
  (localStorage.getItem('locale') as Locale) || LOCALES.EN
)

// Get nested value from object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let result: unknown = obj

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path // Return path if not found
    }
  }

  return typeof result === 'string' ? result : path
}

// Interpolate variables in string
function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`))
}

/**
 * Translation function
 * @param key - Dot notation key (e.g., 'common.save', 'resume.title')
 * @param params - Optional interpolation parameters
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const translation = getNestedValue(
    translations[currentLocale.value] as unknown as Record<string, unknown>,
    key
  )
  return interpolate(translation, params)
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  currentLocale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
  document.documentElement.dir = locale === LOCALES.AR ? 'rtl' : 'ltr'
}

/**
 * Get the current locale
 */
export function getLocale(): Locale {
  return currentLocale.value
}

/**
 * Check if current locale is RTL
 */
export function isRTL(): boolean {
  return currentLocale.value === LOCALES.AR
}

/**
 * Composable for i18n
 */
export function useI18n() {
  const locale = computed(() => currentLocale.value)
  const isRtl = computed(() => currentLocale.value === LOCALES.AR)
  const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))

  function toggleLocale() {
    const newLocale = currentLocale.value === LOCALES.EN ? LOCALES.AR : LOCALES.EN
    setLocale(newLocale)
  }

  return {
    t,
    locale,
    isRtl,
    dir,
    setLocale,
    toggleLocale,
    LOCALES,
  }
}

// Initialize direction on load
if (typeof window !== 'undefined') {
  document.documentElement.lang = currentLocale.value
  document.documentElement.dir = currentLocale.value === LOCALES.AR ? 'rtl' : 'ltr'
}

export type TranslationKeys = typeof en
export { en, ar }
