<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import { useToast } from '@/composables/useToast'
import { analyzeResumeText, extractTextFromFile, type ATSAnalysisResult } from '@/services/atsAnalyzer'

const { t } = useI18n()
const { success, error: showError } = useToast()

// State
const file = ref<File | null>(null)
const isDragging = ref(false)
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const jobDescription = ref('')
const extractedText = ref('')
const analysisError = ref('')

// Results
const results = ref<ATSAnalysisResult | null>(null)

const fileInputRef = ref<HTMLInputElement | null>(null)

// Computed
const acceptedTypes = computed(() => [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const scoreColor = computed(() => {
  if (!results.value) return 'bg-base-300'
  const score = results.value.overall
  if (score >= 80) return 'bg-success'
  if (score >= 60) return 'bg-warning'
  return 'bg-error'
})

const scoreLabel = computed(() => {
  if (!results.value) return ''
  const score = results.value.overall
  if (score >= 80) return t('atsChecker.scoreExcellent')
  if (score >= 60) return t('atsChecker.scoreGood')
  if (score >= 40) return t('atsChecker.scoreNeedsWork')
  return t('atsChecker.scorePoor')
})

// Methods
function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  const firstFile = files?.[0]
  if (firstFile) {
    validateAndSetFile(firstFile)
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const firstFile = target.files?.[0]
  if (firstFile) {
    validateAndSetFile(firstFile)
  }
}

function validateAndSetFile(selectedFile: File) {
  if (!acceptedTypes.value.includes(selectedFile.type)) {
    showError(t('atsChecker.invalidFileType'))
    return
  }

  if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
    showError(t('atsChecker.fileTooLarge'))
    return
  }

  file.value = selectedFile
  analysisComplete.value = false
  results.value = null
}

function removeFile() {
  file.value = null
  analysisComplete.value = false
  results.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function analyzeResume() {
  if (!file.value) {
    showError(t('atsChecker.noFileSelected'))
    return
  }

  isAnalyzing.value = true
  analysisError.value = ''

  try {
    // Extract text from the uploaded file
    const text = await extractTextFromFile(file.value)
    extractedText.value = text

    // Check if we got enough text to analyze
    if (text.length < 50) {
      throw new Error('Could not extract enough text from the file. Please try a different file format.')
    }

    // Run the dynamic ATS analysis
    results.value = await analyzeResumeText(
      text,
      jobDescription.value || undefined
    )

    analysisComplete.value = true
    success(t('atsChecker.analysisComplete'))
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : t('errors.general')
    analysisError.value = errorMessage
    showError(errorMessage)
  } finally {
    isAnalyzing.value = false
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'high': return 'badge-error'
    case 'medium': return 'badge-warning'
    case 'low': return 'badge-info'
    default: return 'badge-ghost'
  }
}

function getScoreBarColor(score: number) {
  if (score >= 80) return 'progress-success'
  if (score >= 60) return 'progress-warning'
  return 'progress-error'
}

function startNewAnalysis() {
  file.value = null
  jobDescription.value = ''
  analysisComplete.value = false
  results.value = null
  extractedText.value = ''
  analysisError.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Additional computed for analysis details
const hasDetailedAnalysis = computed(() => {
  return results.value?.details !== undefined
})
</script>

<template>
  <div class="py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ t('atsChecker.badge') }}
        </div>
        <h1 class="text-4xl font-bold mb-4">
          {{ t('atsChecker.title') }}
        </h1>
        <p class="text-base-content/70 max-w-2xl mx-auto">
          {{ t('atsChecker.subtitle') }}
        </p>
      </div>

      <!-- Main Content -->
      <div
        v-if="!analysisComplete"
        class="space-y-8"
      >
        <!-- File Upload Area -->
        <div class="card bg-base-100 card-border">
          <div class="card-body">
            <h2 class="card-title mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {{ t('atsChecker.uploadTitle') }}
            </h2>

            <!-- Drop Zone -->
            <div
              class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
              :class="[
                isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50',
                file ? 'bg-success/5 border-success' : ''
              ]"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept=".pdf,.doc,.docx"
                class="hidden"
                @change="handleFileSelect"
              />

              <div v-if="!file">
                <div class="text-5xl mb-4">
                  📄
                </div>
                <p class="text-lg font-medium mb-2">
                  {{ t('atsChecker.dropHere') }}
                </p>
                <p class="text-sm text-base-content/60 mb-4">
                  {{ t('atsChecker.orBrowse') }}
                </p>
                <p class="text-xs text-base-content/50">
                  {{ t('atsChecker.supportedFormats') }}
                </p>
              </div>

              <div
                v-else
                class="flex items-center justify-center gap-4"
              >
                <div class="text-4xl">
                  {{ file.name.endsWith('.pdf') ? '📕' : '📘' }}
                </div>
                <div class="text-left">
                  <p class="font-medium">
                    {{ file.name }}
                  </p>
                  <p class="text-sm text-base-content/60">
                    {{ (file.size / 1024).toFixed(1) }} KB
                  </p>
                </div>
                <button
                  class="btn btn-ghost btn-circle btn-sm"
                  @click.stop="removeFile"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Job Description (Optional) -->
        <div class="card bg-base-100 card-border">
          <div class="card-body">
            <h2 class="card-title mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-secondary"
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
              {{ t('atsChecker.jobDescriptionTitle') }}
              <span class="badge badge-ghost badge-sm">{{ t('common.optional') }}</span>
            </h2>
            <p class="text-sm text-base-content/60 mb-4">
              {{ t('atsChecker.jobDescriptionHint') }}
            </p>
            <textarea
              v-model="jobDescription"
              :placeholder="t('atsChecker.jobDescriptionPlaceholder')"
              rows="5"
              class="textarea textarea-bordered w-full"
            />
          </div>
        </div>

        <!-- Analyze Button -->
        <div class="text-center">
          <button
            class="btn btn-primary btn-lg gap-2"
            :disabled="!file || isAnalyzing"
            @click="analyzeResume"
          >
            <span
              v-if="isAnalyzing"
              class="loading loading-spinner"
            />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {{ isAnalyzing ? t('atsChecker.analyzing') : t('atsChecker.analyzeButton') }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div
        v-else-if="results"
        class="space-y-8"
      >
        <!-- Overall Score Card -->
        <div class="card bg-base-100 card-border">
          <div class="card-body">
            <div class="flex flex-col md:flex-row items-center gap-8">
              <!-- Score Circle -->
              <div class="relative">
                <div
                  class="radial-progress text-primary"
                  :style="`--value:${results.overall}; --size:10rem; --thickness:0.8rem;`"
                  role="progressbar"
                >
                  <span class="text-4xl font-bold">{{ results.overall }}</span>
                </div>
              </div>

              <!-- Score Info -->
              <div class="flex-1 text-center md:text-left">
                <div class="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h2 class="text-2xl font-bold">
                    {{ t('atsChecker.yourScore') }}
                  </h2>
                  <span :class="['badge', scoreColor, 'text-white']">
                    {{ scoreLabel }}
                  </span>
                </div>
                <p class="text-base-content/70 mb-4">
                  {{ t('atsChecker.scoreDescription') }}
                </p>

                <!-- File Info -->
                <div class="flex items-center gap-2 text-sm text-base-content/60">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {{ file?.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Breakdown Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(score, category) in results.breakdown"
            :key="category"
            class="card bg-base-100 card-border"
          >
            <div class="card-body">
              <h3 class="font-semibold capitalize">
                {{ t(`atsChecker.categories.${category}`) }}
              </h3>
              <div class="flex items-center gap-3">
                <progress
                  class="progress flex-1"
                  :class="getScoreBarColor(score)"
                  :value="score"
                  max="100"
                />
                <span class="font-bold text-lg">{{ score }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div class="card bg-base-100 card-border">
          <div class="card-body">
            <h2 class="card-title mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              {{ t('atsChecker.improvementSuggestions') }}
            </h2>

            <div class="space-y-4">
              <div
                v-for="(suggestion, index) in results.suggestions"
                :key="index"
                class="collapse collapse-arrow bg-base-200"
              >
                <input
                  type="radio"
                  :name="'suggestion-accordion'"
                  :checked="index === 0"
                />
                <div class="collapse-title flex items-center gap-3">
                  <span :class="['badge', getSeverityColor(suggestion.severity)]">
                    {{ t(`atsChecker.severity.${suggestion.severity}`) }}
                  </span>
                  <span class="font-medium">{{ suggestion.message }}</span>
                </div>
                <div class="collapse-content">
                  <div class="pt-2">
                    <p class="text-base-content/70">
                      {{ suggestion.fix }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Keywords Analysis -->
        <div class="card bg-base-100 card-border">
          <div class="card-body">
            <h2 class="card-title mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-info"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {{ t('atsChecker.keywordsAnalysis') }}
            </h2>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- Found Keywords -->
              <div>
                <h3 class="font-semibold mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ t('atsChecker.foundKeywords') }}
                  <span class="badge badge-ghost badge-sm">{{ results.keywords.found.length }}</span>
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="keyword in results.keywords.found"
                    :key="keyword"
                    class="badge badge-success badge-outline"
                  >
                    {{ keyword }}
                  </span>
                  <span
                    v-if="results.keywords.found.length === 0"
                    class="text-base-content/50 text-sm"
                  >
                    {{ t('atsChecker.noKeywordsFound') }}
                  </span>
                </div>
              </div>

              <!-- Missing Keywords -->
              <div v-if="results.keywords.missing.length > 0">
                <h3 class="font-semibold mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-error"
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
                  {{ t('atsChecker.missingKeywords') }}
                  <span class="badge badge-ghost badge-sm">{{ results.keywords.missing.length }}</span>
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="keyword in results.keywords.missing"
                    :key="keyword"
                    class="badge badge-error badge-outline"
                  >
                    {{ keyword }}
                  </span>
                </div>
                <p class="text-sm text-base-content/60 mt-2">
                  {{ t('atsChecker.missingKeywordsHint') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Analysis (if available) -->
        <div
          v-if="hasDetailedAnalysis && results.details"
          class="card bg-base-100 card-border"
        >
          <div class="card-body">
            <h2 class="card-title mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              {{ t('atsChecker.detailedAnalysis') }}
            </h2>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Word Count -->
              <div class="stat bg-base-200 rounded-box p-4">
                <div class="stat-title text-xs">
                  {{ t('atsChecker.stats.wordCount') }}
                </div>
                <div class="stat-value text-2xl">
                  {{ results.details.wordCount }}
                </div>
                <div class="stat-desc">
                  <span :class="results.details.wordCount >= 400 && results.details.wordCount <= 800 ? 'text-success' : 'text-warning'">
                    {{ results.details.wordCount >= 400 && results.details.wordCount <= 800 ? t('atsChecker.stats.optimal') : t('atsChecker.stats.adjust') }}
                  </span>
                </div>
              </div>

              <!-- Bullet Points -->
              <div class="stat bg-base-200 rounded-box p-4">
                <div class="stat-title text-xs">
                  {{ t('atsChecker.stats.bulletPoints') }}
                </div>
                <div class="stat-value text-2xl">
                  {{ results.details.bulletPointCount }}
                </div>
                <div class="stat-desc">
                  <span :class="results.details.bulletPointCount >= 5 ? 'text-success' : 'text-warning'">
                    {{ results.details.bulletPointCount >= 5 ? t('atsChecker.stats.good') : t('atsChecker.stats.addMore') }}
                  </span>
                </div>
              </div>

              <!-- Action Verbs -->
              <div class="stat bg-base-200 rounded-box p-4">
                <div class="stat-title text-xs">
                  {{ t('atsChecker.stats.actionVerbs') }}
                </div>
                <div class="stat-value text-2xl">
                  {{ results.details.actionVerbs.count }}
                </div>
                <div class="stat-desc">
                  <span :class="results.details.actionVerbs.count >= 5 ? 'text-success' : 'text-warning'">
                    {{ results.details.actionVerbs.percentage }}% {{ t('atsChecker.stats.coverage') }}
                  </span>
                </div>
              </div>

              <!-- Quantifiable Achievements -->
              <div class="stat bg-base-200 rounded-box p-4">
                <div class="stat-title text-xs">
                  {{ t('atsChecker.stats.metrics') }}
                </div>
                <div class="stat-value text-2xl">
                  {{ results.details.quantifiableAchievements }}
                </div>
                <div class="stat-desc">
                  <span :class="results.details.quantifiableAchievements >= 3 ? 'text-success' : 'text-warning'">
                    {{ results.details.quantifiableAchievements >= 3 ? t('atsChecker.stats.excellent') : t('atsChecker.stats.addMetrics') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contact Info Check -->
            <div class="mt-6">
              <h3 class="font-semibold mb-3">
                {{ t('atsChecker.contactInfoCheck') }}
              </h3>
              <div class="flex flex-wrap gap-3">
                <div class="flex items-center gap-2">
                  <span :class="results.details.hasContactInfo.hasEmail ? 'text-success' : 'text-error'">
                    {{ results.details.hasContactInfo.hasEmail ? '✓' : '✗' }}
                  </span>
                  <span class="text-sm">{{ t('atsChecker.contact.email') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="results.details.hasContactInfo.hasPhone ? 'text-success' : 'text-error'">
                    {{ results.details.hasContactInfo.hasPhone ? '✓' : '✗' }}
                  </span>
                  <span class="text-sm">{{ t('atsChecker.contact.phone') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="results.details.hasContactInfo.hasLinkedIn ? 'text-success' : 'text-warning'">
                    {{ results.details.hasContactInfo.hasLinkedIn ? '✓' : '○' }}
                  </span>
                  <span class="text-sm">LinkedIn</span>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="results.details.hasContactInfo.hasLocation ? 'text-success' : 'text-warning'">
                    {{ results.details.hasContactInfo.hasLocation ? '✓' : '○' }}
                  </span>
                  <span class="text-sm">{{ t('atsChecker.contact.location') }}</span>
                </div>
              </div>
            </div>

            <!-- Section Detection -->
            <div class="mt-6">
              <h3 class="font-semibold mb-3">
                {{ t('atsChecker.sectionsDetected') }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="section in results.details.sections.filter(s => s.found)"
                  :key="section.name"
                  :class="[
                    'badge',
                    section.quality === 'good' ? 'badge-success' : 'badge-warning'
                  ]"
                >
                  {{ section.name }}
                </span>
                <span
                  v-for="section in results.details.sections.filter(s => !s.found).slice(0, 5)"
                  :key="section.name"
                  class="badge badge-ghost badge-outline opacity-50"
                >
                  {{ section.name }} ({{ t('atsChecker.missing') }})
                </span>
              </div>
            </div>

            <!-- Action Verbs Found -->
            <div
              v-if="results.details.actionVerbs.found.length > 0"
              class="mt-6"
            >
              <h3 class="font-semibold mb-3">
                {{ t('atsChecker.actionVerbsFound') }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="verb in results.details.actionVerbs.found.slice(0, 15)"
                  :key="verb"
                  class="badge badge-primary badge-outline badge-sm"
                >
                  {{ verb }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-4 justify-center">
          <button
            class="btn btn-primary gap-2"
            @click="startNewAnalysis"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ t('atsChecker.analyzeAnother') }}
          </button>
          <router-link
            to="/resume"
            class="btn btn-outline gap-2"
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {{ t('atsChecker.buildResume') }}
          </router-link>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-center mb-8">
          {{ t('atsChecker.tipsTitle') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="card bg-base-100 card-border">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">
                🎯
              </div>
              <h3 class="font-semibold mb-2">
                {{ t('atsChecker.tips.keywords.title') }}
              </h3>
              <p class="text-sm text-base-content/70">
                {{ t('atsChecker.tips.keywords.description') }}
              </p>
            </div>
          </div>
          <div class="card bg-base-100 card-border">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">
                📝
              </div>
              <h3 class="font-semibold mb-2">
                {{ t('atsChecker.tips.format.title') }}
              </h3>
              <p class="text-sm text-base-content/70">
                {{ t('atsChecker.tips.format.description') }}
              </p>
            </div>
          </div>
          <div class="card bg-base-100 card-border">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">
                📊
              </div>
              <h3 class="font-semibold mb-2">
                {{ t('atsChecker.tips.metrics.title') }}
              </h3>
              <p class="text-sm text-base-content/70">
                {{ t('atsChecker.tips.metrics.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
