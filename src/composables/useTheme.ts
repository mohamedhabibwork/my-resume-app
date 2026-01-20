import { ref, computed } from 'vue'
import type { Theme } from '@/types'
import { THEME_PRESETS } from '@/types/themes'

export function useTheme() {
  const defaultTheme: Theme = (THEME_PRESETS.default || THEME_PRESETS.blue) as Theme
  const currentTheme = ref<Theme>(defaultTheme)

  const themePresets = computed(() => THEME_PRESETS)

  function setTheme(theme: Theme | keyof typeof THEME_PRESETS) {
    if (typeof theme === 'string' && theme in THEME_PRESETS) {
      const preset = THEME_PRESETS[theme]
      if (preset) {
        currentTheme.value = preset
      }
    } else if (typeof theme === 'object') {
      currentTheme.value = theme
    }
  }

  function applyThemeToElement(element: HTMLElement) {
    if (element) {
      element.style.setProperty('--theme-primary', currentTheme.value.primary)
      element.style.setProperty('--theme-secondary', currentTheme.value.secondary)
      element.style.setProperty('--theme-text', currentTheme.value.text)
      element.style.setProperty('--theme-background', currentTheme.value.background)
      element.style.setProperty('--theme-accent', currentTheme.value.accent)
    }
  }

  return {
    currentTheme: computed(() => currentTheme.value),
    themePresets,
    setTheme,
    applyThemeToElement,
  }
}
