<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { WorkExperience } from '@/types'
import { generateId } from '@/utils/helpers'
import { url as validateUrl } from '@/utils/validation'

const props = defineProps<{
  workExperience: WorkExperience[]
}>()

const emit = defineEmits<{
  update: [data: WorkExperience[]]
}>()

const { t } = useI18n()

const localData = ref<WorkExperience[]>([...props.workExperience])
const expandedItems = ref<Set<string>>(new Set())
const errors = ref<Record<string, Record<string, string>>>({})

// Recommendations
const recommendations = computed(() => {
  const recs: { type: 'info' | 'warning' | 'success'; message: string }[] = []

  if (localData.value.length === 0) {
    recs.push({ type: 'warning', message: t('recommendations.addWorkExperience') })
  } else {
    const incomplete = localData.value.filter(exp => !exp.company || !exp.position || !exp.startDate)
    if (incomplete.length > 0) {
      recs.push({ type: 'warning', message: t('recommendations.completeWorkExperience') })
    }

    const noHighlights = localData.value.filter(exp => !exp.highlights || exp.highlights.length === 0)
    if (noHighlights.length > 0) {
      recs.push({ type: 'info', message: t('recommendations.addHighlights') })
    }

    const noDescription = localData.value.filter(exp => !exp.description || exp.description.length < 50)
    if (noDescription.length > 0) {
      recs.push({ type: 'info', message: t('recommendations.addJobDescription') })
    }

    if (localData.value.length >= 2 && incomplete.length === 0) {
      recs.push({ type: 'success', message: t('recommendations.workExperienceGood') })
    }
  }

  return recs
})

function addExperience() {
  const newExp: WorkExperience = {
    id: generateId(),
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    highlights: [],
    companyWebsite: '',
    supervisorName: '',
    skillsUsed: [],
    achievements: [],
    hasReferences: false,
  }
  localData.value.push(newExp)
  expandedItems.value.add(newExp.id)
  emit('update', localData.value)
}

function removeExperience(index: number) {
  const exp = localData.value[index]
  if (exp) {
    expandedItems.value.delete(exp.id)
  }
  localData.value.splice(index, 1)
  emit('update', localData.value)
}

function toggleExpand(id: string) {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

function validateField(expId: string, field: string, value: string) {
  if (!errors.value[expId]) {
    errors.value[expId] = {}
  }

  if (field === 'companyWebsite' && value && value.trim()) {
    errors.value[expId][field] = validateUrl(t('validation.url'))(value) || ''
  } else {
    errors.value[expId][field] = ''
  }
}

function updateExperience(index: number, field: keyof WorkExperience, value: unknown) {
  const exp = localData.value[index]
  if (exp) {
    localData.value[index] = { ...exp, [field]: value }
    if (typeof value === 'string') {
      validateField(exp.id, field, value)
    }
    emit('update', localData.value)
  }
}

function addHighlight(index: number) {
  const exp = localData.value[index]
  if (exp) {
    if (!exp.highlights) {
      exp.highlights = []
    }
    exp.highlights.push('')
    emit('update', localData.value)
  }
}

function removeHighlight(expIndex: number, highlightIndex: number) {
  const exp = localData.value[expIndex]
  if (exp?.highlights) {
    exp.highlights.splice(highlightIndex, 1)
    emit('update', localData.value)
  }
}

function updateHighlight(expIndex: number, highlightIndex: number, value: string | number) {
  if (localData.value[expIndex]?.highlights) {
    localData.value[expIndex].highlights[highlightIndex] = String(value)
    emit('update', localData.value)
  }
}

function moveExperience(index: number, direction: 'up' | 'down') {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= localData.value.length) return

  const temp = localData.value[index]
  const other = localData.value[newIndex]
  if (temp && other) {
    localData.value[index] = other
    localData.value[newIndex] = temp
    emit('update', localData.value)
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Watch for prop changes
watch(() => props.workExperience, (newVal) => {
  localData.value = [...newVal]
}, { deep: true })
</script>

<template>
  <div class="space-y-6">
    <!-- Recommendations -->
    <div
      v-if="recommendations.length > 0"
      class="space-y-2"
    >
      <template
        v-for="(rec, index) in recommendations"
        :key="index"
      >
        <div
          :class="[
            'alert',
            rec.type === 'warning' ? 'alert-warning' : '',
            rec.type === 'info' ? 'alert-info' : '',
            rec.type === 'success' ? 'alert-success' : ''
          ]"
        >
          <svg
            v-if="rec.type === 'warning'"
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
          <svg
            v-else-if="rec.type === 'info'"
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
          <svg
            v-else
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

    <!-- Timeline Header -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-base-content flex items-center gap-2">
        <span class="badge badge-primary badge-lg">{{ localData.length }}</span>
        {{ t('resume.experience.title') }}
      </h3>
      <button
        class="btn btn-primary btn-sm gap-2"
        @click="addExperience"
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
        {{ t('resume.experience.addNew') }}
      </button>
    </div>

    <!-- Experience Cards -->
    <div
      v-if="localData.length > 0"
      class="space-y-4"
    >
      <div
        v-for="(exp, index) in localData"
        :key="exp.id"
        class="card bg-base-100 card-border"
      >
        <!-- Card Header (always visible) -->
        <div
          class="card-body p-4 cursor-pointer"
          @click="toggleExpand(exp.id)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="badge badge-ghost badge-sm">{{ index + 1 }}</span>
                <h4 class="font-semibold truncate">
                  {{ exp.position || t('resume.experience.position') }}
                </h4>
                <span
                  v-if="exp.current"
                  class="badge badge-success badge-sm"
                >{{ t('resume.experience.current') }}</span>
              </div>
              <p class="text-sm text-base-content/70 truncate">
                {{ exp.company || t('resume.experience.company') }}
                <span
                  v-if="exp.location"
                  class="text-base-content/50"
                >• {{ exp.location }}</span>
              </p>
              <p
                v-if="exp.startDate"
                class="text-xs text-base-content/50 mt-1"
              >
                {{ formatDate(exp.startDate) }} - {{ exp.current ? t('resume.experience.current') : (exp.endDate ? formatDate(exp.endDate) : '') }}
              </p>
            </div>

            <div class="flex items-center gap-1">
              <!-- Move buttons -->
              <div class="join join-vertical">
                <button
                  class="btn btn-ghost btn-xs join-item"
                  :disabled="index === 0"
                  @click.stop="moveExperience(index, 'up')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  class="btn btn-ghost btn-xs join-item"
                  :disabled="index === localData.length - 1"
                  @click.stop="moveExperience(index, 'down')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Expand/Collapse -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform"
                :class="{ 'rotate-180': expandedItems.has(exp.id) }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Expanded Content -->
        <div
          v-if="expandedItems.has(exp.id)"
          class="card-body pt-0 space-y-4"
        >
          <div class="divider my-0" />

          <!-- Basic Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.experience.company') }}
                <span class="text-error">*</span>
              </legend>
              <input
                type="text"
                :value="exp.company"
                :placeholder="t('resume.experience.company')"
                class="input input-bordered w-full"
                :class="{ 'input-error': !exp.company }"
                @input="updateExperience(index, 'company', ($event.target as HTMLInputElement).value)"
              />
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.experience.position') }}
                <span class="text-error">*</span>
              </legend>
              <input
                type="text"
                :value="exp.position"
                :placeholder="t('resume.experience.position')"
                class="input input-bordered w-full"
                :class="{ 'input-error': !exp.position }"
                @input="updateExperience(index, 'position', ($event.target as HTMLInputElement).value)"
              />
            </fieldset>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.experience.location') }}
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
                  :value="exp.location"
                  placeholder="City, Country"
                  class="grow"
                  @input="updateExperience(index, 'location', ($event.target as HTMLInputElement).value)"
                />
              </label>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('recommendations.companyWebsite') }}
              </legend>
              <label
                class="input input-bordered flex items-center gap-2 w-full"
                :class="{ 'input-error': errors[exp.id]?.companyWebsite }"
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
                  :value="exp.companyWebsite"
                  placeholder="https://company.com"
                  class="grow"
                  @input="updateExperience(index, 'companyWebsite', ($event.target as HTMLInputElement).value)"
                />
              </label>
              <p
                v-if="exp.id && errors[exp.id]?.companyWebsite"
                class="text-error text-xs mt-1"
              >
                {{ errors[exp.id]?.companyWebsite }}
              </p>
            </fieldset>
          </div>

          <!-- Date Range -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.experience.startDate') }}
                <span class="text-error">*</span>
              </legend>
              <input
                type="date"
                :value="exp.startDate"
                class="input input-bordered w-full"
                :class="{ 'input-error': !exp.startDate }"
                @input="updateExperience(index, 'startDate', ($event.target as HTMLInputElement).value)"
              />
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.experience.endDate') }}
              </legend>
              <input
                v-if="!exp.current"
                type="date"
                :value="exp.endDate"
                class="input input-bordered w-full"
                :min="exp.startDate"
                @input="updateExperience(index, 'endDate', ($event.target as HTMLInputElement).value)"
              />
              <div
                v-else
                class="input input-bordered w-full flex items-center text-base-content/50"
              >
                {{ t('resume.experience.current') }}
              </div>
            </fieldset>
          </div>

          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              :checked="exp.current"
              class="checkbox checkbox-primary"
              @change="updateExperience(index, 'current', ($event.target as HTMLInputElement).checked)"
            />
            <span class="label-text">{{ t('resume.experience.current') }}</span>
          </label>

          <!-- Description -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.experience.description') }}
            </legend>
            <textarea
              :value="exp.description"
              :placeholder="t('recommendations.jobDescriptionPlaceholder')"
              rows="4"
              class="textarea textarea-bordered w-full"
              @input="updateExperience(index, 'description', ($event.target as HTMLTextAreaElement).value)"
            />
            <p class="label text-xs opacity-60">
              {{ t('recommendations.jobDescriptionTip') }}
            </p>
          </fieldset>

          <!-- Highlights -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend flex items-center gap-2">
              {{ t('resume.experience.highlights') }}
              <div
                class="tooltip"
                :data-tip="t('recommendations.highlightsTip')"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 opacity-50"
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
              </div>
            </legend>

            <div class="space-y-2">
              <div
                v-for="(highlight, hIndex) in exp.highlights"
                :key="hIndex"
                class="join w-full"
              >
                <span class="join-item btn btn-ghost btn-sm">•</span>
                <input
                  :value="highlight"
                  type="text"
                  :placeholder="t('recommendations.highlightPlaceholder')"
                  class="input input-bordered input-sm join-item flex-1"
                  @input="updateHighlight(index, hIndex, ($event.target as HTMLInputElement).value)"
                />
                <button
                  class="btn btn-ghost btn-sm join-item"
                  @click="removeHighlight(index, hIndex)"
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
                @click="addHighlight(index)"
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
                {{ t('resume.experience.addHighlight') }}
              </button>
            </div>
          </fieldset>

          <!-- Additional Options -->
          <div class="collapse collapse-arrow bg-base-200 rounded-lg">
            <input type="checkbox" />
            <div class="collapse-title text-sm font-medium">
              {{ t('recommendations.additionalOptions') }}
            </div>
            <div class="collapse-content space-y-4">
              <fieldset class="fieldset">
                <legend class="fieldset-legend">
                  {{ t('recommendations.supervisorName') }}
                </legend>
                <input
                  type="text"
                  :value="exp.supervisorName"
                  placeholder="John Doe"
                  class="input input-bordered w-full"
                  @input="updateExperience(index, 'supervisorName', ($event.target as HTMLInputElement).value)"
                />
              </fieldset>

              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  :checked="exp.hasReferences"
                  class="checkbox checkbox-sm"
                  @change="updateExperience(index, 'hasReferences', ($event.target as HTMLInputElement).checked)"
                />
                <span class="label-text">{{ t('recommendations.hasReferences') }}</span>
              </label>
            </div>
          </div>

          <!-- Delete Button -->
          <div class="card-actions justify-end pt-4 border-t border-base-200">
            <button
              class="btn btn-error btn-sm gap-2"
              @click="removeExperience(index)"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {{ t('common.remove') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="card bg-base-200 card-body items-center text-center py-12"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <h3 class="text-lg font-semibold mt-4">
        {{ t('recommendations.noExperience') }}
      </h3>
      <p class="text-base-content/60 text-sm">
        {{ t('recommendations.addFirstExperience') }}
      </p>
      <button
        class="btn btn-primary mt-4 gap-2"
        @click="addExperience"
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
        {{ t('resume.experience.addNew') }}
      </button>
    </div>
  </div>
</template>
