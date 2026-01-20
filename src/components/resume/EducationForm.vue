<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { Education } from '@/types'
import { generateId } from '@/utils/helpers'

const props = defineProps<{
  education: Education[]
}>()

const emit = defineEmits<{
  update: [data: Education[]]
}>()

const { t } = useI18n()

const localData = ref<Education[]>([...props.education])
const expandedItems = ref<Set<string>>(new Set())

// Common degree options
const degreeOptions = [
  { value: '', label: t('common.select') },
  { value: 'High School Diploma', label: 'High School Diploma' },
  { value: 'Associate Degree', label: 'Associate Degree' },
  { value: 'Bachelor of Science', label: 'Bachelor of Science (B.S.)' },
  { value: 'Bachelor of Arts', label: 'Bachelor of Arts (B.A.)' },
  { value: 'Bachelor of Engineering', label: 'Bachelor of Engineering (B.E.)' },
  { value: 'Master of Science', label: 'Master of Science (M.S.)' },
  { value: 'Master of Arts', label: 'Master of Arts (M.A.)' },
  { value: 'Master of Business Administration', label: 'Master of Business Administration (MBA)' },
  { value: 'Doctor of Philosophy', label: 'Doctor of Philosophy (Ph.D.)' },
  { value: 'Doctor of Medicine', label: 'Doctor of Medicine (M.D.)' },
  { value: 'Juris Doctor', label: 'Juris Doctor (J.D.)' },
  { value: 'Other', label: t('common.other') },
]

// Recommendations
const recommendations = computed(() => {
  const recs: { type: 'info' | 'warning' | 'success'; message: string }[] = []

  if (localData.value.length === 0) {
    recs.push({ type: 'warning', message: t('recommendations.addEducation') })
  } else {
    const incomplete = localData.value.filter(edu => !edu.institution || !edu.degree)
    if (incomplete.length > 0) {
      recs.push({ type: 'warning', message: t('recommendations.completeEducation') })
    }

    const noGpa = localData.value.filter(edu => !edu.gpa)
    if (noGpa.length > 0 && noGpa.length < localData.value.length) {
      recs.push({ type: 'info', message: t('recommendations.addGpa') })
    }

    if (localData.value.length >= 1 && incomplete.length === 0) {
      recs.push({ type: 'success', message: t('recommendations.educationGood') })
    }
  }

  return recs
})

function addEducation() {
  const newEdu: Education = {
    id: generateId(),
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    highlights: [],
    coursework: [],
    honors: [],
  }
  localData.value.push(newEdu)
  expandedItems.value.add(newEdu.id)
  emit('update', localData.value)
}

function removeEducation(index: number) {
  const edu = localData.value[index]
  if (edu) {
    expandedItems.value.delete(edu.id)
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

function updateEducation(index: number, field: keyof Education, value: unknown) {
  const edu = localData.value[index]
  if (edu) {
    localData.value[index] = { ...edu, [field]: value } as Education
    emit('update', localData.value)
  }
}

function addHighlight(index: number) {
  const edu = localData.value[index]
  if (edu) {
    if (!edu.highlights) {
      edu.highlights = []
    }
    edu.highlights.push('')
    emit('update', localData.value)
  }
}

function removeHighlight(eduIndex: number, highlightIndex: number) {
  const edu = localData.value[eduIndex]
  if (edu?.highlights) {
    edu.highlights.splice(highlightIndex, 1)
    emit('update', localData.value)
  }
}

function updateHighlight(eduIndex: number, highlightIndex: number, value: string) {
  if (localData.value[eduIndex]?.highlights) {
    localData.value[eduIndex].highlights[highlightIndex] = value
    emit('update', localData.value)
  }
}

function addCoursework(index: number) {
  const edu = localData.value[index]
  if (edu) {
    if (!edu.coursework) {
      edu.coursework = []
    }
    edu.coursework.push('')
    emit('update', localData.value)
  }
}

function removeCoursework(eduIndex: number, courseIndex: number) {
  const edu = localData.value[eduIndex]
  if (edu?.coursework) {
    edu.coursework.splice(courseIndex, 1)
    emit('update', localData.value)
  }
}

function updateCoursework(eduIndex: number, courseIndex: number, value: string) {
  if (localData.value[eduIndex]?.coursework) {
    localData.value[eduIndex].coursework![courseIndex] = value
    emit('update', localData.value)
  }
}

function moveEducation(index: number, direction: 'up' | 'down') {
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
watch(() => props.education, (newVal) => {
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

    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-base-content flex items-center gap-2">
        <span class="badge badge-primary badge-lg">{{ localData.length }}</span>
        {{ t('resume.education.title') }}
      </h3>
      <button
        class="btn btn-primary btn-sm gap-2"
        @click="addEducation"
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
        {{ t('resume.education.addNew') }}
      </button>
    </div>

    <!-- Education Cards -->
    <div
      v-if="localData.length > 0"
      class="space-y-4"
    >
      <div
        v-for="(edu, index) in localData"
        :key="edu.id"
        class="card bg-base-100 card-border"
      >
        <!-- Card Header -->
        <div
          class="card-body p-4 cursor-pointer"
          @click="toggleExpand(edu.id)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="badge badge-ghost badge-sm">{{ index + 1 }}</span>
                <h4 class="font-semibold truncate">
                  {{ edu.degree || t('resume.education.degree') }}
                  <span
                    v-if="edu.field"
                    class="font-normal text-base-content/70"
                  >in {{ edu.field }}</span>
                </h4>
                <span
                  v-if="edu.current"
                  class="badge badge-success badge-sm"
                >{{ t('resume.education.current') }}</span>
              </div>
              <p class="text-sm text-base-content/70 truncate">
                {{ edu.institution || t('resume.education.institution') }}
                <span
                  v-if="edu.location"
                  class="text-base-content/50"
                >• {{ edu.location }}</span>
              </p>
              <p
                v-if="edu.startDate"
                class="text-xs text-base-content/50 mt-1"
              >
                {{ formatDate(edu.startDate) }} - {{ edu.current ? t('resume.education.current') : (edu.endDate ? formatDate(edu.endDate) : '') }}
                <span
                  v-if="edu.gpa"
                  class="ml-2 badge badge-outline badge-xs"
                >GPA: {{ edu.gpa }}</span>
              </p>
            </div>

            <div class="flex items-center gap-1">
              <div class="join join-vertical">
                <button
                  class="btn btn-ghost btn-xs join-item"
                  :disabled="index === 0"
                  @click.stop="moveEducation(index, 'up')"
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
                  @click.stop="moveEducation(index, 'down')"
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

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform"
                :class="{ 'rotate-180': expandedItems.has(edu.id) }"
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
          v-if="expandedItems.has(edu.id)"
          class="card-body pt-0 space-y-4"
        >
          <div class="divider my-0" />

          <!-- Basic Info -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.education.institution') }}
              <span class="text-error">*</span>
            </legend>
            <label
              class="input input-bordered flex items-center gap-2 w-full"
              :class="{ 'input-error': !edu.institution }"
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <input
                type="text"
                :value="edu.institution"
                :placeholder="t('recommendations.institutionPlaceholder')"
                class="grow"
                @input="updateEducation(index, 'institution', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </fieldset>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.education.degree') }}
                <span class="text-error">*</span>
              </legend>
              <select
                :value="edu.degree"
                class="select select-bordered w-full"
                :class="{ 'select-error': !edu.degree }"
                @change="updateEducation(index, 'degree', ($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="option in degreeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input
                v-if="edu.degree === 'Other'"
                type="text"
                :value="edu.degree"
                placeholder="Enter custom degree"
                class="input input-bordered w-full mt-2"
                @input="updateEducation(index, 'degree', ($event.target as HTMLInputElement).value)"
              />
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.education.field') }}
              </legend>
              <input
                type="text"
                :value="edu.field"
                :placeholder="t('recommendations.fieldPlaceholder')"
                class="input input-bordered w-full"
                @input="updateEducation(index, 'field', ($event.target as HTMLInputElement).value)"
              />
            </fieldset>
          </div>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.education.location') }}
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
                :value="edu.location"
                placeholder="City, Country"
                class="grow"
                @input="updateEducation(index, 'location', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </fieldset>

          <!-- Date Range -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.education.startDate') }}
                <span class="text-error">*</span>
              </legend>
              <input
                type="date"
                :value="edu.startDate"
                class="input input-bordered w-full"
                @input="updateEducation(index, 'startDate', ($event.target as HTMLInputElement).value)"
              />
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.education.endDate') }}
              </legend>
              <input
                v-if="!edu.current"
                type="date"
                :value="edu.endDate"
                class="input input-bordered w-full"
                :min="edu.startDate"
                @input="updateEducation(index, 'endDate', ($event.target as HTMLInputElement).value)"
              />
              <div
                v-else
                class="input input-bordered w-full flex items-center text-base-content/50"
              >
                {{ t('resume.education.current') }}
              </div>
            </fieldset>
          </div>

          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              :checked="edu.current"
              class="checkbox checkbox-primary"
              @change="updateEducation(index, 'current', ($event.target as HTMLInputElement).checked)"
            />
            <span class="label-text">{{ t('resume.education.current') }}</span>
          </label>

          <!-- GPA -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend flex items-center gap-2">
              {{ t('resume.education.gpa') }}
              <div
                class="tooltip"
                :data-tip="t('recommendations.gpaTip')"
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
            <input
              type="text"
              :value="edu.gpa"
              placeholder="e.g., 3.8/4.0 or First Class Honours"
              class="input input-bordered w-full"
              @input="updateEducation(index, 'gpa', ($event.target as HTMLInputElement).value)"
            />
          </fieldset>

          <!-- Achievements/Highlights -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.education.highlights') }}
            </legend>
            <div class="space-y-2">
              <div
                v-for="(highlight, hIndex) in edu.highlights"
                :key="hIndex"
                class="join w-full"
              >
                <span class="join-item btn btn-ghost btn-sm">•</span>
                <input
                  :value="highlight"
                  type="text"
                  :placeholder="t('recommendations.educationHighlightPlaceholder')"
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
                {{ t('resume.education.addHighlight') }}
              </button>
            </div>
          </fieldset>

          <!-- Relevant Coursework (Collapsible) -->
          <div class="collapse collapse-arrow bg-base-200 rounded-lg">
            <input type="checkbox" />
            <div class="collapse-title text-sm font-medium">
              {{ t('recommendations.relevantCoursework') }}
            </div>
            <div class="collapse-content">
              <div class="space-y-2 pt-2">
                <div
                  v-for="(course, cIndex) in edu.coursework"
                  :key="cIndex"
                  class="join w-full"
                >
                  <input
                    :value="course"
                    type="text"
                    :placeholder="t('recommendations.coursePlaceholder')"
                    class="input input-bordered input-sm join-item flex-1"
                    @input="updateCoursework(index, cIndex, ($event.target as HTMLInputElement).value)"
                  />
                  <button
                    class="btn btn-ghost btn-sm join-item"
                    @click="removeCoursework(index, cIndex)"
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
                  @click="addCoursework(index)"
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
                  {{ t('recommendations.addCourse') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Delete Button -->
          <div class="card-actions justify-end pt-4 border-t border-base-200">
            <button
              class="btn btn-error btn-sm gap-2"
              @click="removeEducation(index)"
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
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
        />
      </svg>
      <h3 class="text-lg font-semibold mt-4">
        {{ t('recommendations.noEducation') }}
      </h3>
      <p class="text-base-content/60 text-sm">
        {{ t('recommendations.addFirstEducation') }}
      </p>
      <button
        class="btn btn-primary mt-4 gap-2"
        @click="addEducation"
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
        {{ t('resume.education.addNew') }}
      </button>
    </div>
  </div>
</template>
