import { ref, computed } from 'vue'
import type { FontSettings } from '@/types'
import { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS } from '@/types/fonts'

export function useFonts() {
  const currentFont = ref<FontSettings>({
    family: FONT_FAMILIES.ARIAL,
    size: FONT_SIZES.MD,
    weight: FONT_WEIGHTS.NORMAL,
    lineHeight: LINE_HEIGHTS.NORMAL,
  })

  const fontFamilyOptions = Object.entries(FONT_FAMILIES).map(([key, value]) => ({
    label: key.replace(/_/g, ' '),
    value,
  }))

  const fontSizeOptions = Object.entries(FONT_SIZES).map(([key, value]) => ({
    label: `${key} (${value}px)`,
    value,
  }))

  const fontWeightOptions = Object.entries(FONT_WEIGHTS).map(([key, value]) => ({
    label: key.replace(/_/g, ' '),
    value,
  }))

  const lineHeightOptions = Object.entries(LINE_HEIGHTS).map(([key, value]) => ({
    label: `${key} (${value})`,
    value,
  }))

  function updateFont(field: keyof FontSettings, value: unknown) {
    currentFont.value = { ...currentFont.value, [field]: value }
  }

  function applyFontToElement(element: HTMLElement) {
    if (element) {
      element.style.fontFamily = currentFont.value.family
      element.style.fontSize = `${currentFont.value.size}px`
      element.style.fontWeight = String(currentFont.value.weight)
      element.style.lineHeight = String(currentFont.value.lineHeight)
    }
  }

  return {
    currentFont: computed(() => currentFont.value),
    fontFamilyOptions,
    fontSizeOptions,
    fontWeightOptions,
    lineHeightOptions,
    updateFont,
    applyFontToElement,
  }
}
