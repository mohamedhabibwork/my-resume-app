<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { Project } from '@/types'
import { generateId } from '@/utils/helpers'
import { url as validateUrl } from '@/utils/validation'

const props = defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  update: [data: Project[]]
}>()

const { t } = useI18n()

const localData = ref<Project[]>([...props.projects])
const expandedItems = ref<Set<string>>(new Set())
const errors = ref<Record<string, Record<string, string>>>({})

// Recommendations
const recommendations = computed(() => {
  const recs: { type: 'info' | 'warning' | 'success'; message: string }[] = []

  if (localData.value.length === 0) {
    recs.push({ type: 'info', message: t('recommendations.addProjects') })
  } else {
    const noUrl = localData.value.filter(p => !p.url && !p.githubUrl)
    if (noUrl.length > 0) {
      recs.push({ type: 'info', message: t('recommendations.addProjectUrls') })
    }

    const noDescription = localData.value.filter(p => !p.description || p.description.length < 50)
    if (noDescription.length > 0) {
      recs.push({ type: 'info', message: t('recommendations.addProjectDescription') })
    }

    if (localData.value.length >= 2 && noUrl.length === 0) {
      recs.push({ type: 'success', message: t('recommendations.projectsGood') })
    }
  }

  return recs
})

function addProject() {
  const newProject: Project = {
    id: generateId(),
    name: '',
    description: '',
    technologies: [],
    highlights: [],
    url: '',
    githubUrl: '',
  }
  localData.value.push(newProject)
  expandedItems.value.add(newProject.id)
  emit('update', localData.value)
}

function removeProject(index: number) {
  const project = localData.value[index]
  if (project) {
    expandedItems.value.delete(project.id)
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

function validateField(projectId: string, field: string, value: string) {
  if (!errors.value[projectId]) {
    errors.value[projectId] = {}
  }

  if ((field === 'url' || field === 'githubUrl') && value && value.trim()) {
    errors.value[projectId][field] = validateUrl(t('validation.url'))(value) || ''
  } else {
    errors.value[projectId][field] = ''
  }
}

function updateProject(index: number, field: keyof Project, value: unknown) {
  const project = localData.value[index]
  if (project) {
    localData.value[index] = { ...project, [field]: value } as Project
    if (typeof value === 'string') {
      validateField(project.id, field, value)
    }
    emit('update', localData.value)
  }
}

function addTechnology(index: number, tech: string) {
  const project = localData.value[index]
  if (project && tech.trim()) {
    if (!project.technologies) {
      project.technologies = []
    }
    if (!project.technologies.includes(tech.trim())) {
      project.technologies.push(tech.trim())
      emit('update', localData.value)
    }
  }
}

function removeTechnology(projectIndex: number, techIndex: number) {
  const project = localData.value[projectIndex]
  if (project?.technologies) {
    project.technologies.splice(techIndex, 1)
    emit('update', localData.value)
  }
}

function addHighlight(index: number) {
  const project = localData.value[index]
  if (project) {
    if (!project.highlights) {
      project.highlights = []
    }
    project.highlights.push('')
    emit('update', localData.value)
  }
}

function removeHighlight(projectIndex: number, highlightIndex: number) {
  const project = localData.value[projectIndex]
  if (project?.highlights) {
    project.highlights.splice(highlightIndex, 1)
    emit('update', localData.value)
  }
}

function updateHighlight(projectIndex: number, highlightIndex: number, value: string) {
  if (localData.value[projectIndex]?.highlights) {
    localData.value[projectIndex].highlights[highlightIndex] = value
    emit('update', localData.value)
  }
}

function moveProject(index: number, direction: 'up' | 'down') {
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

// Watch for prop changes
watch(() => props.projects, (newVal) => {
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
        {{ t('resume.projects.title') }}
      </h3>
      <button
        class="btn btn-primary btn-sm gap-2"
        @click="addProject"
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
        {{ t('resume.projects.addNew') }}
      </button>
    </div>

    <!-- Project Cards -->
    <div
      v-if="localData.length > 0"
      class="space-y-4"
    >
      <div
        v-for="(project, index) in localData"
        :key="project.id"
        class="card bg-base-100 card-border"
      >
        <!-- Card Header -->
        <div
          class="card-body p-4 cursor-pointer"
          @click="toggleExpand(project.id)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="badge badge-ghost badge-sm">{{ index + 1 }}</span>
                <h4 class="font-semibold truncate">
                  {{ project.name || t('resume.projects.name') }}
                </h4>
                <a
                  v-if="project.url"
                  :href="project.url"
                  target="_blank"
                  class="btn btn-ghost btn-xs btn-circle"
                  @click.stop
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  class="btn btn-ghost btn-xs btn-circle"
                  @click.stop
                >
                  <svg
                    class="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
              <p
                v-if="project.description"
                class="text-sm text-base-content/70 truncate mt-1"
              >
                {{ project.description }}
              </p>
              <div
                v-if="project.technologies && project.technologies.length > 0"
                class="flex flex-wrap gap-1 mt-2"
              >
                <span
                  v-for="tech in project.technologies.slice(0, 5)"
                  :key="tech"
                  class="badge badge-outline badge-xs"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="project.technologies.length > 5"
                  class="badge badge-ghost badge-xs"
                >
                  +{{ project.technologies.length - 5 }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <div class="join join-vertical">
                <button
                  class="btn btn-ghost btn-xs join-item"
                  :disabled="index === 0"
                  @click.stop="moveProject(index, 'up')"
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
                  @click.stop="moveProject(index, 'down')"
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
                :class="{ 'rotate-180': expandedItems.has(project.id) }"
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
          v-if="expandedItems.has(project.id)"
          class="card-body pt-0 space-y-4"
        >
          <div class="divider my-0" />

          <!-- Project Name -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.projects.name') }}
              <span class="text-error">*</span>
            </legend>
            <label
              class="input input-bordered flex items-center gap-2 w-full"
              :class="{ 'input-error': !project.name }"
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
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <input
                type="text"
                :value="project.name"
                :placeholder="t('recommendations.projectNamePlaceholder')"
                class="grow"
                @input="updateProject(index, 'name', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </fieldset>

          <!-- URLs -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend flex items-center gap-2">
                {{ t('resume.projects.url') }}
                <span class="badge badge-info badge-xs">{{ t('recommendations.recommended') }}</span>
              </legend>
              <label
                class="input input-bordered flex items-center gap-2 w-full"
                :class="{ 'input-error': errors[project.id]?.url }"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <input
                  type="url"
                  :value="project.url"
                  placeholder="https://project-demo.com"
                  class="grow"
                  @input="updateProject(index, 'url', ($event.target as HTMLInputElement).value)"
                />
              </label>
              <p
                v-if="project.id && errors[project.id]?.url"
                class="text-error text-xs mt-1"
              >
                {{ errors[project.id]?.url }}
              </p>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">
                {{ t('resume.projects.github') }}
              </legend>
              <label
                class="input input-bordered flex items-center gap-2 w-full"
                :class="{ 'input-error': errors[project.id]?.githubUrl }"
              >
                <svg
                  class="h-4 w-4 opacity-70"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <input
                  type="url"
                  :value="project.githubUrl"
                  placeholder="https://github.com/user/project"
                  class="grow"
                  @input="updateProject(index, 'githubUrl', ($event.target as HTMLInputElement).value)"
                />
              </label>
              <p
                v-if="project.id && errors[project.id]?.githubUrl"
                class="text-error text-xs mt-1"
              >
                {{ errors[project.id]?.githubUrl }}
              </p>
            </fieldset>
          </div>

          <!-- Description -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.projects.description') }}
            </legend>
            <textarea
              :value="project.description"
              :placeholder="t('recommendations.projectDescriptionPlaceholder')"
              rows="3"
              class="textarea textarea-bordered w-full"
              @input="updateProject(index, 'description', ($event.target as HTMLTextAreaElement).value)"
            />
          </fieldset>

          <!-- Technologies -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.projects.technologies') }}
            </legend>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(tech, techIndex) in project.technologies"
                :key="techIndex"
                class="badge badge-primary gap-1"
              >
                {{ tech }}
                <button
                  class="btn btn-ghost btn-xs btn-circle"
                  @click="removeTechnology(index, techIndex)"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div class="join w-full">
              <input
                type="text"
                :placeholder="t('recommendations.addTechnology')"
                class="input input-bordered input-sm join-item flex-1"
                @keyup.enter="addTechnology(index, ($event.target as HTMLInputElement).value); ($event.target as HTMLInputElement).value = ''"
              />
              <button
                class="btn btn-ghost btn-sm join-item"
                @click="($refs[`techInput${index}`] as HTMLInputElement)?.focus()"
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
              </button>
            </div>
            <p class="label text-xs opacity-60">
              {{ t('recommendations.pressEnterToAdd') }}
            </p>
          </fieldset>

          <!-- Key Features/Highlights -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              {{ t('resume.projects.highlights') }}
            </legend>
            <div class="space-y-2">
              <div
                v-for="(highlight, hIndex) in project.highlights"
                :key="hIndex"
                class="join w-full"
              >
                <span class="join-item btn btn-ghost btn-sm">•</span>
                <input
                  :value="highlight"
                  type="text"
                  :placeholder="t('recommendations.projectHighlightPlaceholder')"
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
                {{ t('resume.projects.addHighlight') }}
              </button>
            </div>
          </fieldset>

          <!-- Delete Button -->
          <div class="card-actions justify-end pt-4 border-t border-base-200">
            <button
              class="btn btn-error btn-sm gap-2"
              @click="removeProject(index)"
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
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      <h3 class="text-lg font-semibold mt-4">
        {{ t('recommendations.noProjects') }}
      </h3>
      <p class="text-base-content/60 text-sm">
        {{ t('recommendations.addFirstProject') }}
      </p>
      <button
        class="btn btn-primary mt-4 gap-2"
        @click="addProject"
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
        {{ t('resume.projects.addNew') }}
      </button>
    </div>
  </div>
</template>
