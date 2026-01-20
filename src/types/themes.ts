import type { Theme } from './index'

export const THEME_PRESETS: Record<string, Theme> = {
  default: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    text: '#111827',
    background: '#ffffff',
    accent: '#10b981',
  },
  blue: {
    primary: '#2563eb',
    secondary: '#64748b',
    text: '#0f172a',
    background: '#ffffff',
    accent: '#0ea5e9',
  },
  green: {
    primary: '#059669',
    secondary: '#6b7280',
    text: '#111827',
    background: '#ffffff',
    accent: '#10b981',
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#6b7280',
    text: '#111827',
    background: '#ffffff',
    accent: '#a855f7',
  },
  dark: {
    primary: '#6366f1',
    secondary: '#9ca3af',
    text: '#f9fafb',
    background: '#1f2937',
    accent: '#8b5cf6',
  },
}

export type ThemePreset = keyof typeof THEME_PRESETS
