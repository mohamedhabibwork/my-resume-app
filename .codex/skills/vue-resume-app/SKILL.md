# Vue Resume App Development Skill

## Overview
This skill provides guidance for developing the Vue 3 + TypeScript resume application with Cloudflare Workers backend.

> **Detailed rules are in `.cursor/rules/` directory**
> See individual `.mdc` files for comprehensive guidelines.

## Tech Stack
- **Frontend**: Vue 3 (Composition API), TypeScript, Tailwind CSS 4, Pinia
- **Backend**: Cloudflare Workers
- **Database**: Firebase (Firestore + Auth)
- **Build**: Vite 7, Bun
- **i18n**: English + Arabic (RTL support)

## Project Structure
```
src/
├── assets/main.css   # ALL CSS goes here (no style blocks!)
├── components/       # Reusable components
│   ├── ui/          # Button, Input, Card, Modal, Select
│   ├── layout/      # AppHeader, AppLayout
│   ├── auth/        # LoginForm, SignupForm
│   └── resume/      # ResumePreview, EducationForm, etc.
├── composables/      # Vue composables (useApi, useAuth, etc.)
├── i18n/            # en.ts, ar.ts translations
├── router/          # Vue Router config + guards
├── stores/          # Pinia stores
├── types/           # TypeScript types
├── utils/           # Utility functions
├── views/           # Page components
└── main.ts

server/              # Cloudflare Worker backend
.cursor/rules/       # Detailed Cursor rules
```

## Creating Components

### Standard Component Template
```vue
<script setup lang="ts">
// 1. Type imports
import type { Resume } from '@/types'

// 2. Regular imports
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n'

// 3. Props
interface Props {
  title: string
  isActive?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isActive: false
})

// 4. Emits
const emit = defineEmits<{
  update: [value: string]
}>()

// 5. Composables
const { t, isRtl } = useI18n()

// 6. State
const localValue = ref('')
const isLoading = ref(false)

// 7. Computed
const displayTitle = computed(() => props.title.toUpperCase())

// 8. Lifecycle
onMounted(() => {
  // Initialize
})

// 9. Methods
function handleClick() {
  emit('update', localValue.value)
}
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-800 rounded-lg">
    <h2 class="text-lg font-semibold">{{ t('common.title') }}</h2>
    <!-- Use Tailwind classes for ALL styling -->
  </div>
</template>
<!-- NO <style> block - all CSS in src/assets/main.css -->
```

## Creating Stores

> See `.cursor/rules/pinia-stores.mdc` for comprehensive patterns

### Pinia Store Template
```typescript
// stores/useExampleStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Example } from '@/types'

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref<Example[]>([])
  const currentItem = ref<Example | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const itemCount = computed(() => items.value.length)
  const hasItems = computed(() => items.value.length > 0)

  // Actions
  async function fetchItems() {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch('/api/examples')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      items.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function addItem(item: Example) {
    items.value.push(item)
  }

  function $reset() {
    items.value = []
    currentItem.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    items,
    currentItem,
    isLoading,
    error,
    itemCount,
    hasItems,
    fetchItems,
    addItem,
    $reset
  }
})
```

## Creating Composables

> See `.cursor/rules/composables.mdc` for comprehensive patterns

### Composable Template
```typescript
// composables/useExample.ts
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

interface UseExampleOptions {
  initialValue?: string
  autoFetch?: boolean
}

interface UseExampleReturn {
  value: Ref<string>
  isActive: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  activate: () => void
  deactivate: () => void
  reset: () => void
}

export function useExample(options: UseExampleOptions = {}): UseExampleReturn {
  const { initialValue = '', autoFetch = false } = options

  const value = ref(initialValue)
  const isActive = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function activate() {
    isActive.value = true
  }

  function deactivate() {
    isActive.value = false
  }

  function reset() {
    value.value = initialValue
    isActive.value = false
    error.value = null
  }

  onMounted(() => {
    if (autoFetch) {
      // Auto-fetch logic
    }
  })

  onUnmounted(() => {
    // Cleanup (remove listeners, cancel requests, etc.)
  })

  return {
    value,
    isActive,
    isLoading,
    error,
    activate,
    deactivate,
    reset
  }
}
```

## Available Composables

Import from `@/composables`:

- `useApi<T>()` - API requests with loading/error states
- `useApiMutation<TBody, TResponse>()` - POST/PUT/DELETE requests
- `useLoading()` - Single loading state management
- `useMultiLoading()` - Multiple loading states
- `useError()` - Error state management
- `useFormErrors()` - Form validation errors
- `useDebounce(ref, delay)` - Debounce a ref value
- `useDebounceFn(fn, delay)` - Debounce a function
- `useThrottleFn(fn, limit)` - Throttle a function
- `useLocalStorage(key, default)` - Sync with localStorage
- `useSessionStorage(key, default)` - Sync with sessionStorage

## Available Utilities

Import from `@/utils`:

### Formatting
- `formatDate(date, options)` - Format dates
- `formatDateRange(start, end, current)` - Format date ranges
- `formatNumber(num)` - Format with commas
- `capitalize(str)` - Capitalize words
- `truncate(str, max)` - Truncate with ellipsis
- `slugify(str)` - Convert to URL slug
- `formatPhone(phone)` - Format phone numbers

### Validation
- `required(message)` - Required field validator
- `email(message)` - Email validator
- `minLength(min, message)` - Minimum length
- `maxLength(max, message)` - Maximum length
- `url(message)` - URL validator
- `phone(message)` - Phone validator
- `compose(...rules)` - Compose validators
- `validateObject(data, schema)` - Validate object

### Helpers
- `generateId()` - Generate unique ID
- `deepClone(obj)` - Deep clone object
- `deepEqual(a, b)` - Deep equality check
- `omit(obj, keys)` - Omit keys from object
- `pick(obj, keys)` - Pick keys from object
- `groupBy(arr, key)` - Group array by key
- `sortBy(arr, key, order)` - Sort array
- `sleep(ms)` - Async sleep
- `retry(fn, attempts, delay)` - Retry with backoff

## Type Definitions

Import from `@/types`:

- `Resume`, `PersonalInfo`, `WorkExperience`, `Education`
- `Skill`, `SkillLevel`, `SKILL_LEVELS`
- `Project`, `Certification`, `Language`
- `User`, `Timestamps`, `ID`
- `ApiResponse<T>`, `PaginatedResponse<T>`
- `ButtonVariant`, `ButtonSize`, `ToastType`

## Commands

```bash
# Development
bun run dev          # Start dev server
bun run build        # Build for production
bun run preview      # Preview build locally

# Code Quality
bun run lint         # Check linting
bun run lint:fix     # Fix lint errors
bun run format       # Format code
bun run type-check   # TypeScript check
bun run check        # Run all checks

# Deployment
bun run deploy       # Deploy to Cloudflare
```

## Best Practices

1. **Always use TypeScript** - Define types for all data, never use `any`
2. **Use Composition API** - `<script setup lang="ts">`
3. **Handle async states** - Loading, error, success in try/catch/finally
4. **Use Tailwind only** - NO style blocks, NO inline styles
5. **Translate all strings** - Use `t()` from `useI18n()`
6. **Keep components small** - Single responsibility
7. **Use composables** - Extract reusable logic
8. **Validate forms** - Use validation utilities
9. **Follow naming conventions** - PascalCase components, camelCase functions

## CSS Rules (CRITICAL)

```vue
<!-- ❌ FORBIDDEN -->
<style scoped>.btn { color: red }</style>
<div style="color: red">

<!-- ✅ CORRECT -->
<div class="text-red-500 p-4 hover:bg-gray-100">
```

**All custom CSS goes in `src/assets/main.css` only**

## i18n Rules

```vue
<!-- ❌ FORBIDDEN -->
<button>Save</button>

<!-- ✅ CORRECT -->
<button>{{ t('common.save') }}</button>
```

Add translations to BOTH `src/i18n/en.ts` AND `src/i18n/ar.ts`

## Detailed Rules

See `.cursor/rules/` for comprehensive guidelines:
- `vue-components.mdc` - Component patterns
- `typescript.mdc` - Type definitions
- `pinia-stores.mdc` - State management
- `composables.mdc` - Composable patterns
- `tailwind-css.mdc` - CSS/styling rules
- `i18n.mdc` - Internationalization
- `firebase.mdc` - Firebase integration
- `api.mdc` - Data fetching patterns
- `testing.mdc` - Testing guidelines
- `performance.mdc` - Optimization
- `security.mdc` - Security best practices
- `commands.mdc` - Available commands
