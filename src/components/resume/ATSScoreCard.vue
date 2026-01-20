<script setup lang="ts">
import { computed } from 'vue'
import { calculateATSScore } from '@/services/atsScore'
import type { Resume, ATSResult } from '@/types'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const atsResult = computed<ATSResult>(() => calculateATSScore(props.resume))

const scoreColorClass = computed(() => {
  if (atsResult.value.overall >= 80) return 'text-success'
  if (atsResult.value.overall >= 60) return 'text-warning'
  return 'text-error'
})

const progressColorClass = computed(() => {
  if (atsResult.value.overall >= 80) return 'progress-success'
  if (atsResult.value.overall >= 60) return 'progress-warning'
  return 'progress-error'
})
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <!-- Header with Score -->
      <div class="flex items-center justify-between">
        <h3 class="card-title">
          ATS Score
        </h3>
        <div class="flex items-center gap-3">
          <div
            class="radial-progress"
            :class="scoreColorClass"
            :style="`--value:${atsResult.overall}; --size:4rem; --thickness:6px;`"
            role="progressbar"
          >
            <span class="text-lg font-bold">{{ atsResult.overall }}</span>
          </div>
        </div>
      </div>

      <!-- Breakdown Stats -->
      <div class="stats stats-vertical shadow mt-4">
        <div class="stat py-2">
          <div class="stat-title text-xs">
            Keywords
          </div>
          <progress
            class="progress progress-primary"
            :value="atsResult.breakdown.keywords"
            max="100"
          />
          <div class="stat-desc">
            {{ atsResult.breakdown.keywords }}%
          </div>
        </div>

        <div class="stat py-2">
          <div class="stat-title text-xs">
            Formatting
          </div>
          <progress
            class="progress progress-secondary"
            :value="atsResult.breakdown.formatting"
            max="100"
          />
          <div class="stat-desc">
            {{ atsResult.breakdown.formatting }}%
          </div>
        </div>

        <div class="stat py-2">
          <div class="stat-title text-xs">
            Completeness
          </div>
          <progress
            class="progress progress-accent"
            :value="atsResult.breakdown.completeness"
            max="100"
          />
          <div class="stat-desc">
            {{ atsResult.breakdown.completeness }}%
          </div>
        </div>

        <div class="stat py-2">
          <div class="stat-title text-xs">
            Structure
          </div>
          <progress
            class="progress progress-info"
            :value="atsResult.breakdown.structure"
            max="100"
          />
          <div class="stat-desc">
            {{ atsResult.breakdown.structure }}%
          </div>
        </div>

        <div class="stat py-2">
          <div class="stat-title text-xs">
            Best Practices
          </div>
          <progress
            :class="['progress', progressColorClass]"
            :value="atsResult.breakdown.bestPractices"
            max="100"
          />
          <div class="stat-desc">
            {{ atsResult.breakdown.bestPractices }}%
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div
        v-if="atsResult.suggestions.length > 0"
        class="mt-4"
      >
        <div class="collapse collapse-arrow bg-base-200">
          <input
            type="checkbox"
            checked
          />
          <div class="collapse-title font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline mr-2"
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
            Suggestions ({{ atsResult.suggestions.length }})
          </div>
          <div class="collapse-content">
            <ul class="space-y-2">
              <li
                v-for="(suggestion, index) in atsResult.suggestions"
                :key="index"
                class="flex items-start gap-2 text-sm"
              >
                <span class="badge badge-primary badge-xs mt-1.5" />
                <span class="text-base-content/80">{{ suggestion }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
