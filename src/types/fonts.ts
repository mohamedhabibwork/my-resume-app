export const FONT_FAMILIES = {
  ARIAL: 'Arial, sans-serif',
  TIMES: 'Times New Roman, serif',
  HELVETICA: 'Helvetica, Arial, sans-serif',
  GEORGIA: 'Georgia, serif',
  VERDANA: 'Verdana, sans-serif',
  COURIER: 'Courier New, monospace',
  ROBOTO: 'Roboto, sans-serif',
  OPEN_SANS: 'Open Sans, sans-serif',
  LATO: 'Lato, sans-serif',
  MONTSERRAT: 'Montserrat, sans-serif',
} as const

export type FontFamily = (typeof FONT_FAMILIES)[keyof typeof FONT_FAMILIES]

export const FONT_SIZES = {
  XS: 10,
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 18,
  '2XL': 20,
  '3XL': 24,
} as const

export type FontSize = (typeof FONT_SIZES)[keyof typeof FONT_SIZES]

export const FONT_WEIGHTS = {
  NORMAL: 'normal',
  BOLD: 'bold',
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD_NUM: 700,
} as const

export type FontWeight = (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS]

export const LINE_HEIGHTS = {
  TIGHT: 1.2,
  NORMAL: 1.5,
  RELAXED: 1.75,
  LOOSE: 2,
} as const

export type LineHeight = (typeof LINE_HEIGHTS)[keyof typeof LINE_HEIGHTS]
