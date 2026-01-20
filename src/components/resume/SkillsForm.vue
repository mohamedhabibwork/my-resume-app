<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { Skill, SkillLevel } from '@/types'
import { SKILL_LEVELS } from '@/types'
import { generateId } from '@/utils/helpers'

const props = defineProps<{
  skills: Skill[]
}>()

const emit = defineEmits<{
  update: [data: Skill[]]
}>()

const { t } = useI18n()

const localData = ref<Skill[]>([...props.skills])
const newSkillName = ref('')
const newSkillCategory = ref('')
const selectedCategory = ref<string | null>(null)

const skillLevelOptions = [
  { label: t('resume.skills.levels.beginner'), value: SKILL_LEVELS.BEGINNER, color: 'badge-ghost', percent: 25 },
  { label: t('resume.skills.levels.intermediate'), value: SKILL_LEVELS.INTERMEDIATE, color: 'badge-info', percent: 50 },
  { label: t('resume.skills.levels.advanced'), value: SKILL_LEVELS.ADVANCED, color: 'badge-primary', percent: 75 },
  { label: t('resume.skills.levels.expert'), value: SKILL_LEVELS.EXPERT, color: 'badge-success', percent: 100 },
]

// Get unique categories
const _categories = computed(() => {
  const cats = new Set(localData.value.map((s) => s.category).filter(Boolean))
  return ['', ...Array.from(cats)]
})

// Common skill suggestions by category
const skillSuggestions: Record<string, string[]> = {
  'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift'],
  'Frontend': ['React', 'Vue.js', 'Angular', 'Svelte', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'SASS'],
  'Backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'FastAPI'],
  'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase', 'DynamoDB', 'Elasticsearch'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform'],
  'Tools': ['Git', 'VS Code', 'Jira', 'Figma', 'Postman', 'Webpack', 'Vite', 'npm', 'Linux'],
  'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability'],
}

// Recommendations
const recommendations = computed(() => {
  const recs: { type: 'info' | 'warning' | 'success'; message: string }[] = []

  if (localData.value.length === 0) {
    recs.push({ type: 'warning', message: t('recommendations.addSkills') })
  } else if (localData.value.length < 5) {
    recs.push({ type: 'info', message: t('recommendations.addMoreSkills') })
  } else if (localData.value.length >= 5 && localData.value.length <= 15) {
    recs.push({ type: 'success', message: t('recommendations.skillsGood') })
  } else if (localData.value.length > 15) {
    recs.push({ type: 'info', message: t('recommendations.tooManySkills') })
  }

  const uncategorized = localData.value.filter(s => !s.category)
  if (uncategorized.length > 0 && localData.value.length > 5) {
    recs.push({ type: 'info', message: t('recommendations.categorizeSkills') })
  }

  return recs
})

// Group skills by category
const groupedSkills = computed(() => {
  const groups: Record<string, Skill[]> = {}
  localData.value.forEach((skill) => {
    const category = skill.category || t('recommendations.uncategorized')
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(skill)
  })
  return groups
})

// Filter skills based on selected category
const _filteredSkills = computed(() => {
  if (!selectedCategory.value) return localData.value
  return localData.value.filter(s => (s.category || t('recommendations.uncategorized')) === selectedCategory.value)
})

function addSkill(name?: string, category?: string) {
  const skillName = name || newSkillName.value.trim()
  if (!skillName) return

  // Check for duplicates
  if (localData.value.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
    return
  }

  localData.value.push({
    id: generateId(),
    name: skillName,
    level: SKILL_LEVELS.INTERMEDIATE,
    category: category || newSkillCategory.value || '',
    showProgress: false,
    isHidden: false,
    progress: 50,
  })

  newSkillName.value = ''
  emit('update', localData.value)
}

function removeSkill(skillId: string) {
  const index = localData.value.findIndex(s => s.id === skillId)
  if (index > -1) {
    localData.value.splice(index, 1)
    emit('update', localData.value)
  }
}

function updateSkill(skillId: string, field: keyof Skill, value: unknown) {
  const skill = localData.value.find(s => s.id === skillId)
  if (skill) {
    Object.assign(skill, { [field]: value })
    emit('update', localData.value)
  }
}

function getLevelInfo(level?: SkillLevel) {
  const found = skillLevelOptions.find(o => o.value === level)
  return found || skillLevelOptions[1] || { value: 'intermediate', label: t('resume.skills.levels.intermediate'), color: 'badge-info', percent: 50 }
}

function cycleLevel(skillId: string, currentLevel: SkillLevel) {
  const currentIndex = skillLevelOptions.findIndex(o => o.value === currentLevel)
  const nextIndex = (currentIndex + 1) % skillLevelOptions.length
  const nextOption = skillLevelOptions[nextIndex]
  if (nextOption) {
    updateSkill(skillId, 'level', nextOption.value)
  }
}

// Watch for prop changes
watch(() => props.skills, (newVal) => {
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

    <!-- Header with Count -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-base-content flex items-center gap-2">
        <span class="badge badge-primary badge-lg">{{ localData.length }}</span>
        {{ t('resume.skills.title') }}
      </h3>
    </div>

    <!-- Quick Add Section -->
    <div class="card bg-base-100 card-border">
      <div class="card-body p-4">
        <h4 class="font-medium text-sm mb-3">
          {{ t('resume.skills.addNew') }}
        </h4>

        <div class="flex flex-wrap gap-2">
          <div class="join flex-1 min-w-[200px]">
            <input
              v-model="newSkillName"
              type="text"
              :placeholder="t('resume.skills.name')"
              class="input input-bordered input-sm join-item flex-1"
              @keyup.enter="addSkill()"
            />
            <select
              v-model="newSkillCategory"
              class="select select-bordered select-sm join-item"
            >
              <option value="">
                {{ t('resume.skills.category') }}
              </option>
              <option
                v-for="cat in Object.keys(skillSuggestions)"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
            <button
              class="btn btn-primary btn-sm join-item"
              :disabled="!newSkillName.trim()"
              @click="addSkill()"
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
        </div>

        <!-- Quick Add Suggestions -->
        <div
          v-if="newSkillCategory && skillSuggestions[newSkillCategory]"
          class="mt-3"
        >
          <p class="text-xs text-base-content/60 mb-2">
            {{ t('recommendations.quickAdd') }}:
          </p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="suggestion in (skillSuggestions[newSkillCategory] || []).filter(s => !localData.some(sk => sk.name.toLowerCase() === s.toLowerCase()))"
              :key="suggestion"
              class="badge badge-outline badge-sm cursor-pointer hover:badge-primary transition-colors"
              @click="addSkill(suggestion, newSkillCategory)"
            >
              + {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Filter -->
    <div
      v-if="Object.keys(groupedSkills).length > 1"
      class="flex flex-wrap gap-2"
    >
      <button
        class="btn btn-sm"
        :class="selectedCategory === null ? 'btn-primary' : 'btn-ghost'"
        @click="selectedCategory = null"
      >
        {{ t('common.all') }} ({{ localData.length }})
      </button>
      <button
        v-for="(skills, category) in groupedSkills"
        :key="category"
        class="btn btn-sm"
        :class="selectedCategory === category ? 'btn-primary' : 'btn-ghost'"
        @click="selectedCategory = category"
      >
        {{ category }} ({{ skills.length }})
      </button>
    </div>

    <!-- Skills Grid -->
    <div
      v-if="localData.length > 0"
      class="space-y-4"
    >
      <div
        v-for="(skills, category) in groupedSkills"
        v-show="!selectedCategory || selectedCategory === category"
        :key="category"
        class="card bg-base-100 card-border"
      >
        <div class="card-body p-4">
          <h4 class="font-medium text-sm flex items-center gap-2 mb-3">
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {{ category }}
            <span class="badge badge-ghost badge-sm">{{ skills.length }}</span>
          </h4>

          <div class="flex flex-wrap gap-2">
            <div
              v-for="skill in skills"
              :key="skill.id"
              class="group relative"
            >
              <div
                class="badge gap-2 py-3 px-3 cursor-pointer transition-all"
                :class="[
                  getLevelInfo(skill?.level).color,
                  skill?.isHidden ? 'opacity-50 line-through' : ''
                ]"
                @click="cycleLevel(skill.id, skill.level)"
              >
                <span class="font-medium">{{ skill?.name }}</span>
                <span class="text-xs opacity-70">({{ getLevelInfo(skill?.level).label }})</span>
                <button
                  class="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop="removeSkill(skill.id)"
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
              </div>

              <!-- Tooltip for progress -->
              <div
                v-if="skill.showProgress"
                class="absolute -bottom-1 left-0 right-0 h-1 bg-base-200 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-primary transition-all"
                  :style="{ width: `${skill?.progress || getLevelInfo(skill?.level).percent}%` }"
                />
              </div>
            </div>
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
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <h3 class="text-lg font-semibold mt-4">
        {{ t('recommendations.noSkills') }}
      </h3>
      <p class="text-base-content/60 text-sm">
        {{ t('recommendations.addFirstSkill') }}
      </p>

      <!-- Popular Skills Quick Add -->
      <div class="mt-6 max-w-md">
        <p class="text-sm text-base-content/60 mb-3">
          {{ t('recommendations.popularSkills') }}:
        </p>
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="skill in ['JavaScript', 'Python', 'React', 'Node.js', 'SQL']"
            :key="skill"
            class="badge badge-outline badge-lg cursor-pointer hover:badge-primary transition-colors"
            @click="addSkill(skill, 'Programming Languages')"
          >
            + {{ skill }}
          </button>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="card bg-base-200 p-3">
      <p class="text-xs text-base-content/60 mb-2">
        {{ t('recommendations.skillLevelLegend') }}:
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="level in skillLevelOptions"
          :key="level.value"
          :class="['badge badge-sm', level.color]"
        >
          {{ level.label }}
        </span>
      </div>
      <p class="text-xs text-base-content/50 mt-2">
        {{ t('recommendations.clickToChangeLevel') }}
      </p>
    </div>
  </div>
</template>
