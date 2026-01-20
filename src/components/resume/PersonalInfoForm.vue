<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { PersonalInfo } from '@/types'
import { email as validateEmail, url as validateUrl, phone as validatePhone } from '@/utils/validation'

const props = defineProps<{
  personalInfo: PersonalInfo
}>()

const emit = defineEmits<{
  update: [data: PersonalInfo]
}>()

const { t } = useI18n()

const localData = ref<PersonalInfo>({ ...props.personalInfo })

const phones = ref<string[]>(localData.value.phones || (localData.value.phone ? [localData.value.phone] : ['']))
const emails = ref<string[]>(localData.value.emails || [])

// Validation state
const errors = ref<Record<string, string>>({})

// URL Pattern helpers
const urlPatterns = {
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i,
  github: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/i,
  twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w-]+\/?$/i,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/i,
}

// Recommendations based on current data
const recommendations = computed(() => {
  const recs: { type: 'info' | 'warning' | 'success'; message: string; field?: string }[] = []

  // Check for missing essential fields
  if (!localData.value.firstName || !localData.value.lastName) {
    recs.push({ type: 'warning', message: t('recommendations.addFullName'), field: 'name' })
  }

  if (!localData.value.email) {
    recs.push({ type: 'warning', message: t('recommendations.addEmail'), field: 'email' })
  }

  if (!localData.value.phone && phones.value.filter(p => p.trim()).length === 0) {
    recs.push({ type: 'info', message: t('recommendations.addPhone'), field: 'phone' })
  }

  if (!localData.value.summary) {
    recs.push({ type: 'warning', message: t('recommendations.addSummary'), field: 'summary' })
  } else if (localData.value.summary.length < 100) {
    recs.push({ type: 'info', message: t('recommendations.expandSummary'), field: 'summary' })
  } else if (localData.value.summary.length > 500) {
    recs.push({ type: 'info', message: t('recommendations.shortenSummary'), field: 'summary' })
  }

  if (!localData.value.linkedin) {
    recs.push({ type: 'info', message: t('recommendations.addLinkedIn'), field: 'linkedin' })
  }

  if (!localData.value.location) {
    recs.push({ type: 'info', message: t('recommendations.addLocation'), field: 'location' })
  }

  // Success messages for completed fields
  const completedFields = [
    localData.value.firstName && localData.value.lastName,
    localData.value.email,
    localData.value.phone || phones.value.filter(p => p.trim()).length > 0,
    localData.value.summary && localData.value.summary.length >= 100,
    localData.value.linkedin,
    localData.value.location,
  ].filter(Boolean).length

  if (completedFields >= 5) {
    recs.push({ type: 'success', message: t('recommendations.personalInfoComplete') })
  }

  return recs
})

// Character count for summary
const summaryCharCount = computed(() => localData.value.summary?.length || 0)
const summaryStatus = computed(() => {
  if (summaryCharCount.value === 0) return 'empty'
  if (summaryCharCount.value < 100) return 'short'
  if (summaryCharCount.value > 500) return 'long'
  return 'good'
})

function validateField(field: string, value: string) {
  switch (field) {
    case 'email':
      errors.value.email = validateEmail(t('validation.email'))(value) || ''
      break
    case 'website':
    case 'linkedin':
    case 'github':
    case 'twitter':
    case 'instagram':
      if (value && value.trim()) {
        errors.value[field] = validateUrl(t('validation.url'))(value) || ''
        // Additional pattern validation for social links
        const urlPattern = urlPatterns[field as keyof typeof urlPatterns]
        if (!errors.value[field] && field !== 'website' && urlPattern) {
          if (!urlPattern.test(value)) {
            errors.value[field] = t('validation.invalidFormat', { field: field.charAt(0).toUpperCase() + field.slice(1) })
          }
        }
      } else {
        errors.value[field] = ''
      }
      break
    case 'phone':
      if (value && value.trim()) {
        errors.value.phone = validatePhone(t('validation.phone'))(value) || ''
      } else {
        errors.value.phone = ''
      }
      break
    default:
      errors.value[field] = ''
  }
}

function addPhone() {
  phones.value.push('')
}

function removePhone(index: number) {
  phones.value.splice(index, 1)
  updatePhones()
}

function _addEmail() {
  emails.value.push('')
}

function _removeEmail(index: number) {
  emails.value.splice(index, 1)
  updateEmails()
}

function updateField(field: keyof PersonalInfo, value: unknown) {
  localData.value = { ...localData.value, [field]: value }
  if (typeof value === 'string') {
    validateField(field, value)
  }
  emit('update', localData.value)
}

function updatePhones() {
  localData.value.phones = phones.value.filter((p) => p.trim())
  const firstPhone = phones.value[0]
  if (phones.value.length > 0 && firstPhone?.trim()) {
    localData.value.phone = firstPhone
  }
  emit('update', localData.value)
}

function updateEmails() {
  localData.value.emails = emails.value.filter((e) => e.trim())
  emit('update', localData.value)
}

// Auto-format URLs
function formatUrl(field: keyof PersonalInfo, value: string) {
  if (!value) return
  let formattedUrl = value.trim()

  // Add https:// if missing
  if (formattedUrl && !formattedUrl.match(/^https?:\/\//i)) {
    formattedUrl = 'https://' + formattedUrl
  }

  updateField(field, formattedUrl)
}

// Watch for prop changes
watch(() => props.personalInfo, (newVal) => {
  localData.value = { ...newVal }
  phones.value = newVal.phones || (newVal.phone ? [newVal.phone] : [''])
  emails.value = newVal.emails || []
}, { deep: true })
</script>

<template>
  <div class="space-y-6">
    <!-- Recommendations Alert -->
    <div
      v-if="recommendations.length > 0"
      class="space-y-2"
    >
      <template
        v-for="(rec, index) in recommendations"
        :key="index"
      >
        <div
          v-if="rec.type === 'warning'"
          class="alert alert-warning"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span class="text-sm">{{ rec.message }}</span>
        </div>
        <div
          v-else-if="rec.type === 'info'"
          class="alert alert-info"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm">{{ rec.message }}</span>
        </div>
        <div
          v-else-if="rec.type === 'success'"
          class="alert alert-success"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm">{{ rec.message }}</span>
        </div>
      </template>
    </div>

    <!-- Basic Information Card -->
    <div class="card bg-base-100 card-border">
      <div class="card-body">
        <h3 class="card-title text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {{ t('resume.personalInfo.title') }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.personalInfo.firstName') }}
              <span class="text-error">*</span>
            </legend>
            <input
              type="text"
              :value="localData.firstName"
              :placeholder="t('resume.personalInfo.firstName')"
              class="input input-bordered w-full"
              :class="{ 'input-error': !localData.firstName }"
              @input="updateField('firstName', ($event.target as HTMLInputElement).value)"
            />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.personalInfo.lastName') }}
              <span class="text-error">*</span>
            </legend>
            <input
              type="text"
              :value="localData.lastName"
              :placeholder="t('resume.personalInfo.lastName')"
              class="input input-bordered w-full"
              :class="{ 'input-error': !localData.lastName }"
              @input="updateField('lastName', ($event.target as HTMLInputElement).value)"
            />
          </fieldset>
        </div>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ t('resume.personalInfo.email') }}
            <span class="text-error">*</span>
          </legend>
          <label
            class="input input-bordered flex items-center gap-2 w-full"
            :class="{ 'input-error': errors.email }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <input
              type="email"
              :value="localData.email"
              placeholder="name@example.com"
              class="grow"
              @input="updateField('email', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <p
            v-if="errors.email"
            class="text-error text-xs mt-1"
          >
            {{ errors.email }}
          </p>
        </fieldset>
      </div>
    </div>

    <!-- Contact Information Card -->
    <div class="card bg-base-100 card-border">
      <div class="card-body">
        <h3 class="card-title text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {{ t('resume.personalInfo.phone') }}
        </h3>

        <div class="space-y-3">
          <div
            v-for="(phone, index) in phones"
            :key="index"
            class="join w-full"
          >
            <label
              class="input input-bordered join-item flex items-center gap-2 flex-1"
              :class="{ 'input-error': errors.phone && index === 0 }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <input
                v-model="phones[index]"
                type="tel"
                :placeholder="index === 0 ? t('resume.personalInfo.phone') : t('common.optional')"
                class="grow"
                @blur="updatePhones"
              />
            </label>
            <button
              v-if="phones.length > 1"
              class="btn btn-ghost join-item"
              @click="removePhone(index)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <button
            class="btn btn-ghost btn-sm gap-2"
            @click="addPhone"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{ t('common.add') }} {{ t('resume.personalInfo.phone') }}
          </button>
        </div>

        <div class="divider" />

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ t('resume.personalInfo.location') }}
          </legend>
          <label class="input input-bordered flex items-center gap-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="text"
              :value="localData.location"
              placeholder="City, Country"
              class="grow"
              @input="updateField('location', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <p class="label text-xs opacity-60">
            {{ t('recommendations.locationTip') }}
          </p>
        </fieldset>
      </div>
    </div>

    <!-- Online Presence Card -->
    <div class="card bg-base-100 card-border">
      <div class="card-body">
        <h3 class="card-title text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          {{ t('recommendations.onlinePresence') }}
        </h3>

        <!-- Website -->
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ t('resume.personalInfo.website') }}
          </legend>
          <label
            class="input input-bordered flex items-center gap-2 w-full"
            :class="{ 'input-error': errors.website }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <input
              type="url"
              :value="localData.website"
              placeholder="https://yourwebsite.com"
              class="grow"
              @input="updateField('website', ($event.target as HTMLInputElement).value)"
              @blur="formatUrl('website', localData.website || '')"
            />
          </label>
          <p
            v-if="errors.website"
            class="text-error text-xs mt-1"
          >
            {{ errors.website }}
          </p>
        </fieldset>

        <!-- LinkedIn -->
        <fieldset class="fieldset">
          <legend class="fieldset-legend flex items-center gap-2">
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            {{ t('resume.personalInfo.linkedin') }}
            <span class="badge badge-info badge-sm">{{ t('recommendations.recommended') }}</span>
          </legend>
          <label
            class="input input-bordered flex items-center gap-2 w-full"
            :class="{ 'input-error': errors.linkedin }"
          >
            <span class="opacity-50 text-sm">linkedin.com/in/</span>
            <input
              type="text"
              :value="localData.linkedin?.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '')"
              placeholder="username"
              class="grow"
              @input="updateField('linkedin', `https://linkedin.com/in/${($event.target as HTMLInputElement).value}`)"
            />
          </label>
          <p
            v-if="errors.linkedin"
            class="text-error text-xs mt-1"
          >
            {{ errors.linkedin }}
          </p>
        </fieldset>

        <!-- GitHub -->
        <fieldset class="fieldset">
          <legend class="fieldset-legend flex items-center gap-2">
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {{ t('resume.personalInfo.github') }}
          </legend>
          <label
            class="input input-bordered flex items-center gap-2 w-full"
            :class="{ 'input-error': errors.github }"
          >
            <span class="opacity-50 text-sm">github.com/</span>
            <input
              type="text"
              :value="localData.github?.replace(/^https?:\/\/(www\.)?github\.com\//i, '')"
              placeholder="username"
              class="grow"
              @input="updateField('github', `https://github.com/${($event.target as HTMLInputElement).value}`)"
            />
          </label>
          <p
            v-if="errors.github"
            class="text-error text-xs mt-1"
          >
            {{ errors.github }}
          </p>
        </fieldset>

        <!-- Twitter/X -->
        <div class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title text-sm font-medium">
            {{ t('recommendations.moreLinks') }}
          </div>
          <div class="collapse-content space-y-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                Twitter / X
              </legend>
              <label
                class="input input-bordered flex items-center gap-2 w-full"
                :class="{ 'input-error': errors.twitter }"
              >
                <span class="opacity-50 text-sm">x.com/</span>
                <input
                  type="text"
                  :value="localData.twitter?.replace(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i, '')"
                  placeholder="username"
                  class="grow"
                  @input="updateField('twitter', `https://x.com/${($event.target as HTMLInputElement).value}`)"
                />
              </label>
              <p
                v-if="errors.twitter"
                class="text-error text-xs mt-1"
              >
                {{ errors.twitter }}
              </p>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                Instagram
              </legend>
              <label
                class="input input-bordered flex items-center gap-2 w-full"
                :class="{ 'input-error': errors.instagram }"
              >
                <span class="opacity-50 text-sm">instagram.com/</span>
                <input
                  type="text"
                  :value="localData.instagram?.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')"
                  placeholder="username"
                  class="grow"
                  @input="updateField('instagram', `https://instagram.com/${($event.target as HTMLInputElement).value}`)"
                />
              </label>
              <p
                v-if="errors.instagram"
                class="text-error text-xs mt-1"
              >
                {{ errors.instagram }}
              </p>
            </fieldset>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Information Card -->
    <div class="collapse collapse-arrow bg-base-100 card-border">
      <input type="checkbox" />
      <div class="collapse-title font-medium flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {{ t('recommendations.additionalInfo') }}
      </div>
      <div class="collapse-content space-y-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ t('resume.personalInfo.dateOfBirth') }}
          </legend>
          <input
            type="date"
            :value="localData.dateOfBirth"
            class="input input-bordered w-full"
            @input="updateField('dateOfBirth', ($event.target as HTMLInputElement).value)"
          />
          <p class="label text-xs opacity-60">
            {{ t('recommendations.dateOfBirthTip') }}
          </p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ t('resume.personalInfo.nationality') }}
          </legend>
          <input
            type="text"
            :value="localData.nationality"
            placeholder="e.g., American, British"
            class="input input-bordered w-full"
            @input="updateField('nationality', ($event.target as HTMLInputElement).value)"
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ t('resume.personalInfo.drivingLicense') }}
          </legend>
          <input
            type="text"
            :value="localData.drivingLicense"
            placeholder="e.g., Class B"
            class="input input-bordered w-full"
            @input="updateField('drivingLicense', ($event.target as HTMLInputElement).value)"
          />
        </fieldset>
      </div>
    </div>

    <!-- Professional Summary Card -->
    <div class="card bg-base-100 card-border">
      <div class="card-body">
        <h3 class="card-title text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          {{ t('resume.personalInfo.summary') }}
          <span class="text-error text-sm">*</span>
        </h3>

        <div class="relative">
          <textarea
            :value="localData.summary"
            :placeholder="t('resume.personalInfo.summaryPlaceholder')"
            rows="5"
            class="textarea textarea-bordered w-full"
            :class="{
              'textarea-warning': summaryStatus === 'short' || summaryStatus === 'long',
              'textarea-success': summaryStatus === 'good',
              'textarea-error': summaryStatus === 'empty'
            }"
            @input="updateField('summary', ($event.target as HTMLTextAreaElement).value)"
          />

          <div class="flex justify-between items-center mt-2 text-sm">
            <div class="flex gap-2">
              <span
                class="badge"
                :class="{
                  'badge-error': summaryStatus === 'empty',
                  'badge-warning': summaryStatus === 'short' || summaryStatus === 'long',
                  'badge-success': summaryStatus === 'good'
                }"
              >
                {{ summaryCharCount }} {{ t('recommendations.characters') }}
              </span>
              <span class="text-base-content/60">
                {{ t('recommendations.idealRange') }}: 100-500
              </span>
            </div>
          </div>
        </div>

        <!-- Summary Tips -->
        <div class="alert alert-info mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p class="font-semibold text-sm">
              {{ t('recommendations.summaryTipsTitle') }}
            </p>
            <ul class="text-xs mt-1 space-y-1 list-disc list-inside">
              <li>{{ t('recommendations.summaryTip1') }}</li>
              <li>{{ t('recommendations.summaryTip2') }}</li>
              <li>{{ t('recommendations.summaryTip3') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
