<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResume } from '@/composables/useResume'
import { useDebounceFn } from '@/composables/useDebounce'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useI18n } from '@/i18n'
import { useToast } from '@/composables/useToast'
import ATSScoreCard from '@/components/resume/ATSScoreCard.vue'
import ExportMenu from '@/components/resume/ExportMenu.vue'
import TemplateSelector from '@/components/resume/TemplateSelector.vue'
import ThemeSelector from '@/components/resume/ThemeSelector.vue'
import FontSelector from '@/components/resume/FontSelector.vue'
import Modal from '@/components/ui/Modal.vue'
import DragHandle from '@/components/ui/DragHandle.vue'
import PersonalInfoForm from '@/components/resume/PersonalInfoForm.vue'
import WorkExperienceForm from '@/components/resume/WorkExperienceForm.vue'
import EducationForm from '@/components/resume/EducationForm.vue'
import SkillsForm from '@/components/resume/SkillsForm.vue'
import ProjectsForm from '@/components/resume/ProjectsForm.vue'
import CertificationsForm from '@/components/resume/CertificationsForm.vue'
import LanguagesForm from '@/components/resume/LanguagesForm.vue'
import LinksForm from '@/components/resume/LinksForm.vue'
import ResumePreview from '@/components/resume/ResumePreview.vue'
import Input from '@/components/ui/Input.vue'
import type { Resume } from '@/types'

const { t } = useI18n()
const { success: showSuccess } = useToast()
const route = useRoute()
const router = useRouter()
const resume = useResume()
const { currentResume, fetchResume, createResume, updateResume } = resume

const activeSection = ref('personal')
const resumeTitle = ref('')
const showTemplateSelector = ref(false)
const showThemeSelector = ref(false)
const showFontSelector = ref(false)
const isSaving = ref(false)
const lastSaved = ref<Date | null>(null)
const previewElementId = 'resume-preview'

// FREE TIER OPTIMIZATION: Debounce updates to minimize Firestore writes
// Free tier: 20,000 writes/day - debouncing reduces write operations
const debouncedUpdate = useDebounceFn(async (data: Partial<Resume>) => {
  if (currentResume.value?.id) {
    try {
      isSaving.value = true
      await updateResume(currentResume.value.id, data)
      lastSaved.value = new Date()
    } catch (error) {
      console.error('Error saving resume:', error)
    } finally {
      isSaving.value = false
    }
  }
}, 1000)

// Calculate completion percentage
const completionPercentage = computed(() => {
  if (!currentResume.value) return 0

  let completed = 0
  let total = 0

  // Personal Info (20%)
  total += 20
  const personalInfo = currentResume.value.personalInfo
  if (personalInfo.firstName) completed += 4
  if (personalInfo.lastName) completed += 4
  if (personalInfo.email) completed += 4
  if (personalInfo.phone || (personalInfo.phones && personalInfo.phones.length > 0)) completed += 4
  if (personalInfo.summary) completed += 4

  // Work Experience (30%)
  total += 30
  if (currentResume.value.workExperience.length > 0) {
    const exp = currentResume.value.workExperience[0]
    if (exp && exp.company && exp.position && exp.startDate) completed += 30
  }

  // Education (20%)
  total += 20
  if (currentResume.value.education.length > 0) {
    const edu = currentResume.value.education[0]
    if (edu && edu.institution && edu.degree) completed += 20
  }

  // Skills (15%)
  total += 15
  if (currentResume.value.skills.length > 0) completed += 15

  // Additional sections (15%)
  total += 15
  if (currentResume.value.projects.length > 0) completed += 5
  if (currentResume.value.certifications.length > 0) completed += 5
  if (currentResume.value.languages.length > 0) completed += 5

  return Math.round((completed / total) * 100)
})

const sections = [
  { id: 'personal', label: t('resume.personalInfo.title'), icon: '👤' },
  { id: 'experience', label: t('resume.experience.title'), icon: '💼' },
  { id: 'education', label: t('resume.education.title'), icon: '🎓' },
  { id: 'skills', label: t('resume.skills.title'), icon: '🛠️' },
  { id: 'projects', label: t('resume.projects.title'), icon: '🚀' },
  { id: 'certifications', label: t('resume.certifications.title'), icon: '🏆' },
  { id: 'languages', label: t('resume.languages.title'), icon: '🌐' },
  { id: 'links', label: t('resume.links.title'), icon: '🔗' },
]

const orderedSections = ref([...sections])
const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop(orderedSections.value)

onMounted(async () => {
  const resumeId = route.params.id as string
  if (resumeId && resumeId !== 'new') {
    await fetchResume(resumeId)
    if (currentResume.value) {
      resumeTitle.value = currentResume.value.title
    }
  } else {
    // Create new resume
    const id = await createResume({
      title: 'Untitled Resume',
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
      },
    })
    router.replace(`/resume/${id}`)
    showSuccess(t('resume.created'))
  }
})

watch(() => currentResume.value, (resume) => {
  if (resume) {
    resumeTitle.value = resume.title
    // Initialize section order from resume or use default
    if (resume.sectionOrder && resume.sectionOrder.length > 0) {
      const ordered = resume.sectionOrder
        .sort((a, b) => a.order - b.order)
        .map((so) => sections.find((s) => s.id === so.id))
        .filter(Boolean) as typeof sections
      if (ordered.length > 0) {
        orderedSections.value = ordered
      }
    } else {
      orderedSections.value = [...sections]
    }
  }
}, { immediate: true })

function updatePersonalInfo(data: Resume['personalInfo']) {
  if (currentResume.value) {
    debouncedUpdate({ personalInfo: data })
  }
}

function updateWorkExperience(data: Resume['workExperience']) {
  if (currentResume.value) {
    debouncedUpdate({ workExperience: data })
  }
}

function updateEducation(data: Resume['education']) {
  if (currentResume.value) {
    debouncedUpdate({ education: data })
  }
}

function updateSkills(data: Resume['skills']) {
  if (currentResume.value) {
    debouncedUpdate({ skills: data })
  }
}

function updateProjects(data: Resume['projects']) {
  if (currentResume.value) {
    debouncedUpdate({ projects: data })
  }
}

function updateCertifications(data: Resume['certifications']) {
  if (currentResume.value) {
    debouncedUpdate({ certifications: data })
  }
}

function updateLanguages(data: Resume['languages']) {
  if (currentResume.value) {
    debouncedUpdate({ languages: data })
  }
}

function updateLinks(data: Resume['links']) {
  if (currentResume.value) {
    debouncedUpdate({ links: data })
  }
}

function updateTitle() {
  if (currentResume.value) {
    debouncedUpdate({ title: resumeTitle.value })
  }
}

function selectTemplate(template: string) {
  if (currentResume.value) {
    updateResume(currentResume.value.id, { template })
    showSuccess(t('resume.templateChanged'))
  }
}

function updateTheme(theme: Resume['theme']) {
  if (currentResume.value) {
    debouncedUpdate({ theme })
  }
}

function updateFontSettings(fontSettings: Resume['fontSettings']) {
  if (currentResume.value) {
    debouncedUpdate({ fontSettings })
  }
}

function reorderSections(newOrder: typeof sections) {
  if (!newOrder) return
  orderedSections.value = newOrder
  if (currentResume.value) {
    const sectionOrder = newOrder.map((section, index) => ({
      id: section.id,
      order: index,
    }))
    debouncedUpdate({ sectionOrder })
  }
}

const formatLastSaved = computed(() => {
  if (!lastSaved.value) return ''
  const now = new Date()
  const diff = now.getTime() - lastSaved.value.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 10) return t('resume.saving')
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return lastSaved.value.toLocaleTimeString()
})

// Section status for steps
function getSectionStatus(sectionId: string): 'complete' | 'partial' | 'empty' {
  if (!currentResume.value) return 'empty'

  switch (sectionId) {
    case 'personal': {
      const p = currentResume.value.personalInfo
      const filled = [p.firstName, p.lastName, p.email, p.summary].filter(Boolean).length
      if (filled >= 4) return 'complete'
      if (filled > 0) return 'partial'
      return 'empty'
    }
    case 'experience': {
      const exp = currentResume.value.workExperience
      if (exp.length === 0) return 'empty'
      const complete = exp.filter(e => e.company && e.position && e.startDate).length
      if (complete === exp.length) return 'complete'
      return 'partial'
    }
    case 'education': {
      const edu = currentResume.value.education
      if (edu.length === 0) return 'empty'
      const complete = edu.filter(e => e.institution && e.degree).length
      if (complete === edu.length) return 'complete'
      return 'partial'
    }
    case 'skills': {
      const skills = currentResume.value.skills
      if (skills.length === 0) return 'empty'
      if (skills.length >= 3) return 'complete'
      return 'partial'
    }
    case 'projects': {
      const projects = currentResume.value.projects
      if (projects.length === 0) return 'empty'
      if (projects.length >= 1) return 'complete'
      return 'partial'
    }
    case 'certifications': {
      const certs = currentResume.value.certifications
      if (certs.length === 0) return 'empty'
      return 'complete'
    }
    case 'languages': {
      const langs = currentResume.value.languages
      if (langs.length === 0) return 'empty'
      return 'complete'
    }
    case 'links': {
      const links = currentResume.value.links
      if (!links || links.length === 0) return 'empty'
      return 'complete'
    }
    default:
      return 'empty'
  }
}

// Navigation helpers
const currentSectionIndex = computed(() => {
  return orderedSections.value.findIndex(s => s.id === activeSection.value)
})

const canGoPrevious = computed(() => currentSectionIndex.value > 0)
const canGoNext = computed(() => currentSectionIndex.value < orderedSections.value.length - 1)

function goToPreviousSection() {
  if (canGoPrevious.value) {
    const prevSection = orderedSections.value[currentSectionIndex.value - 1]
    if (prevSection) {
      activeSection.value = prevSection.id
    }
  }
}

function goToNextSection() {
  if (canGoNext.value) {
    const nextSection = orderedSections.value[currentSectionIndex.value + 1]
    if (nextSection) {
      activeSection.value = nextSection.id
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-20 bg-base-100 border-b border-base-300 shadow-sm">
      <div class="max-w-[1920px] mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <button
              class="btn btn-ghost btn-sm"
              @click="router.push('/dashboard')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {{ t('common.back') }}
            </button>
            <Input
              v-model="resumeTitle"
              :placeholder="t('resume.title')"
              class="max-w-xs flex-1"
              size="sm"
              @blur="updateTitle"
              @keyup.enter="updateTitle"
            />
            <div class="flex items-center gap-2 text-sm text-base-content/60 shrink-0">
              <span
                v-if="isSaving"
                class="flex items-center gap-1"
              >
                <span class="loading loading-dots loading-xs" />
                {{ t('resume.saving') }}
              </span>
              <span
                v-else-if="lastSaved"
                class="text-xs badge badge-ghost"
              >{{ formatLastSaved }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <div class="hidden md:flex items-center gap-2">
              <button
                class="btn btn-outline btn-sm"
                @click="showTemplateSelector = true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
                {{ t('templates.selectTemplate') }}
              </button>
              <button
                class="btn btn-outline btn-sm"
                @click="showThemeSelector = true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                {{ t('themes.title') }}
              </button>
              <button
                class="btn btn-outline btn-sm"
                @click="showFontSelector = true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                {{ t('fonts.family') }}
              </button>
            </div>
            <ExportMenu
              v-if="currentResume"
              :resume="currentResume"
              :preview-element-id="previewElementId"
            />
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-3 pt-3 border-t border-base-300">
          <div class="flex items-center justify-between text-xs text-base-content/70 mb-2">
            <span class="font-medium">{{ t('resume.completion') }}: {{ completionPercentage }}%</span>
            <span
              v-if="currentResume"
              class="flex items-center gap-2"
            >
              <div
                class="radial-progress text-primary"
                :style="`--value:${currentResume.atsScore?.overall || 0}; --size:1.5rem; --thickness:3px;`"
                role="progressbar"
              />
              {{ t('resume.atsScore') }}: {{ currentResume.atsScore?.overall || 0 }}/100
            </span>
          </div>
          <progress
            class="progress progress-primary w-full"
            :value="completionPercentage"
            max="100"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden max-w-[1920px] mx-auto w-full">
      <!-- Form Sidebar -->
      <aside class="w-full lg:w-96 xl:w-[420px] border-r border-base-300 bg-base-100 overflow-y-auto flex flex-col">
        <!-- Section Navigation with Steps -->
        <div class="sticky top-0 z-10 bg-base-100 border-b border-base-300 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-base-content">
              {{ t('resume.sections') }}
            </h3>
            <div class="dropdown dropdown-end">
              <div
                tabindex="0"
                role="button"
                class="btn btn-ghost btn-xs"
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
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </div>
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li class="menu-title text-xs">
                  {{ t('recommendations.reorderSections') }}
                </li>
                <li><span class="text-xs opacity-60">{{ t('recommendations.dragToReorder') }}</span></li>
              </ul>
            </div>
          </div>

          <!-- Steps Navigation -->
          <ul class="steps steps-vertical w-full">
            <li
              v-for="(section, index) in orderedSections"
              :key="section.id"
              :class="[
                'step cursor-pointer transition-all',
                getSectionStatus(section.id) === 'complete' ? 'step-primary' : '',
                getSectionStatus(section.id) === 'partial' ? 'step-warning' : '',
                activeSection === section.id ? 'font-semibold' : ''
              ]"
              :data-content="getSectionStatus(section.id) === 'complete' ? '✓' : (getSectionStatus(section.id) === 'partial' ? '◐' : (index + 1))"
              draggable="true"
              @dragstart="handleDragStart(section)"
              @dragover.prevent="handleDragOver(index, $event)"
              @drop="() => { const newOrder = handleDrop(index, orderedSections); if (newOrder) reorderSections(newOrder as typeof sections); }"
              @dragend="handleDragEnd"
              @click="activeSection = section.id"
            >
              <div class="flex items-center gap-2 py-1 w-full">
                <DragHandle class="opacity-30 hover:opacity-100 cursor-grab shrink-0" />
                <span class="text-lg shrink-0">{{ section.icon }}</span>
                <span
                  class="truncate text-sm"
                  :class="{ 'text-primary': activeSection === section.id }"
                >{{ section.label }}</span>
              </div>
            </li>
          </ul>

          <!-- Quick Navigation -->
          <div class="flex gap-2 mt-4">
            <button
              class="btn btn-ghost btn-sm flex-1"
              :disabled="!canGoPrevious"
              @click="goToPreviousSection"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {{ t('common.back') }}
            </button>
            <button
              class="btn btn-primary btn-sm flex-1"
              :disabled="!canGoNext"
              @click="goToNextSection"
            >
              {{ t('common.next') }}
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Form Content -->
        <div class="flex-1 p-6">
          <div
            v-if="currentResume"
            class="space-y-6"
          >
            <PersonalInfoForm
              v-if="activeSection === 'personal'"
              :personal-info="currentResume.personalInfo"
              @update="updatePersonalInfo"
            />
            <WorkExperienceForm
              v-if="activeSection === 'experience'"
              :work-experience="currentResume.workExperience"
              @update="updateWorkExperience"
            />
            <EducationForm
              v-if="activeSection === 'education'"
              :education="currentResume.education"
              @update="updateEducation"
            />
            <SkillsForm
              v-if="activeSection === 'skills'"
              :skills="currentResume.skills"
              @update="updateSkills"
            />
            <ProjectsForm
              v-if="activeSection === 'projects'"
              :projects="currentResume.projects"
              @update="updateProjects"
            />
            <CertificationsForm
              v-if="activeSection === 'certifications'"
              :certifications="currentResume.certifications"
              @update="updateCertifications"
            />
            <LanguagesForm
              v-if="activeSection === 'languages'"
              :languages="currentResume.languages"
              @update="updateLanguages"
            />
            <LinksForm
              v-if="activeSection === 'links'"
              :links="currentResume.links"
              @update="updateLinks"
            />
          </div>
          <div
            v-else
            class="flex items-center justify-center h-full"
          >
            <div class="text-center text-base-content/60">
              <span class="loading loading-spinner loading-lg text-primary" />
              <p class="text-lg mt-4">
                {{ t('common.loading') }}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Preview Side -->
      <main class="flex-1 bg-base-200 overflow-y-auto">
        <div class="sticky top-0 z-10 bg-base-200 border-b border-base-300 p-4 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-base-content">
            {{ t('resume.preview') }}
          </h3>
          <div class="flex items-center gap-2 md:hidden">
            <button
              class="btn btn-ghost btn-sm"
              @click="showTemplateSelector = true"
            >
              {{ t('templates.selectTemplate') }}
            </button>
            <button
              class="btn btn-ghost btn-sm"
              @click="showThemeSelector = true"
            >
              {{ t('themes.title') }}
            </button>
          </div>
        </div>

        <div class="p-4 lg:p-8">
          <div
            v-if="currentResume"
            class="space-y-6"
          >
            <!-- Preview Container - A4 Size -->
            <div class="flex justify-center">
              <div
                :id="previewElementId"
                class="bg-base-100 shadow-2xl w-full max-w-[210mm] min-h-[297mm] rounded-lg overflow-hidden"
                style="aspect-ratio: 210 / 297"
              >
                <ResumePreview :resume="currentResume" />
              </div>
            </div>

            <!-- ATS Score Card -->
            <div class="max-w-[210mm] mx-auto">
              <ATSScoreCard :resume="currentResume" />
            </div>
          </div>
          <div
            v-else
            class="flex items-center justify-center h-full min-h-[400px]"
          >
            <div class="text-center text-base-content/60">
              <span class="loading loading-spinner loading-lg text-primary" />
              <p class="text-lg mt-4">
                {{ t('common.loading') }}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <TemplateSelector
      :is-open="showTemplateSelector"
      :current-template="currentResume?.template || 'modern'"
      :resume="currentResume || undefined"
      @close="showTemplateSelector = false"
      @select="selectTemplate"
    />

    <Modal
      :is-open="showThemeSelector"
      :title="t('themes.title')"
      @close="showThemeSelector = false"
    >
      <ThemeSelector
        v-if="currentResume"
        :model-value="currentResume.theme"
        @update:model-value="updateTheme"
      />
    </Modal>

    <Modal
      :is-open="showFontSelector"
      :title="t('fonts.family')"
      @close="showFontSelector = false"
    >
      <FontSelector
        v-if="currentResume?.fontSettings"
        :model-value="currentResume.fontSettings"
        @update:model-value="updateFontSettings"
      />
    </Modal>
  </div>
</template>
