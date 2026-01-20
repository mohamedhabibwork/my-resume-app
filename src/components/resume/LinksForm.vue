<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { CustomLink } from '@/types'
import { generateId } from '@/utils/helpers'
import { url as validateUrl } from '@/utils/validation'

const props = defineProps<{
  links?: CustomLink[]
}>()

const emit = defineEmits<{
  update: [data: CustomLink[]]
}>()

const { t } = useI18n()

const localData = ref<CustomLink[]>([...(props.links || [])])
const errors = ref<Record<string, string>>({})

const linkTypeOptions = [
  { label: t('recommendations.linkTypes.portfolio'), value: 'portfolio', icon: '🎨' },
  { label: t('recommendations.linkTypes.blog'), value: 'blog', icon: '📝' },
  { label: t('recommendations.linkTypes.other'), value: 'other', icon: '🔗' },
]

// URL pattern detection for auto-labeling
const urlPatterns = [
  { pattern: /behance\.net/i, label: 'Behance', type: 'portfolio' as const },
  { pattern: /dribbble\.com/i, label: 'Dribbble', type: 'portfolio' as const },
  { pattern: /medium\.com/i, label: 'Medium', type: 'blog' as const },
  { pattern: /dev\.to/i, label: 'Dev.to', type: 'blog' as const },
  { pattern: /hashnode\./i, label: 'Hashnode', type: 'blog' as const },
  { pattern: /substack\.com/i, label: 'Substack', type: 'blog' as const },
  { pattern: /notion\.site/i, label: 'Notion', type: 'portfolio' as const },
  { pattern: /codepen\.io/i, label: 'CodePen', type: 'portfolio' as const },
  { pattern: /stackoverflow\.com/i, label: 'Stack Overflow', type: 'other' as const },
  { pattern: /youtube\.com/i, label: 'YouTube', type: 'other' as const },
  { pattern: /twitch\.tv/i, label: 'Twitch', type: 'other' as const },
]

// Recommendations
const recommendations = computed(() => {
  const recs: { type: 'info' | 'warning' | 'success'; message: string }[] = []

  if (localData.value.length === 0) {
    recs.push({ type: 'info', message: t('recommendations.addLinks') })
  } else {
    const invalidUrls = localData.value.filter(l => errors.value[l.id])
    if (invalidUrls.length > 0) {
      recs.push({ type: 'warning', message: t('recommendations.fixInvalidUrls') })
    }

    const noLabel = localData.value.filter(l => !l.label)
    if (noLabel.length > 0) {
      recs.push({ type: 'info', message: t('recommendations.addLinkLabels') })
    }

    if (localData.value.length >= 1 && invalidUrls.length === 0 && noLabel.length === 0) {
      recs.push({ type: 'success', message: t('recommendations.linksGood') })
    }
  }

  return recs
})

function addLink() {
  localData.value.push({
    id: generateId(),
    label: '',
    url: '',
    type: 'other',
  })
  emit('update', localData.value)
}

function removeLink(index: number) {
  const link = localData.value[index]
  if (link) {
    delete errors.value[link.id]
  }
  localData.value.splice(index, 1)
  emit('update', localData.value)
}

function validateField(linkId: string, value: string) {
  if (value && value.trim()) {
    errors.value[linkId] = validateUrl(t('validation.url'))(value) || ''
  } else {
    errors.value[linkId] = ''
  }
}

function updateLink(index: number, field: keyof CustomLink, value: unknown) {
  const link = localData.value[index]
  if (link) {
    localData.value[index] = { ...link, [field]: value } as CustomLink

    // Validate URL field
    if (field === 'url' && typeof value === 'string') {
      validateField(link.id, value)

      // Auto-detect label and type from URL
      if (value && !link.label) {
        for (const pattern of urlPatterns) {
          if (pattern.pattern.test(value)) {
            localData.value[index].label = pattern.label
            localData.value[index].type = pattern.type
            break
          }
        }
      }
    }

    emit('update', localData.value)
  }
}

function moveLink(index: number, direction: 'up' | 'down') {
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

function getTypeIcon(type: string): string {
  const option = linkTypeOptions.find(o => o.value === type)
  return option?.icon || '🔗'
}

// Watch for prop changes
watch(() => props.links, (newVal) => {
  localData.value = [...(newVal || [])]
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
        {{ t('resume.links.title') }}
      </h3>
      <button
        class="btn btn-primary btn-sm gap-2"
        @click="addLink"
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
        {{ t('resume.links.addNew') }}
      </button>
    </div>

    <!-- Links List -->
    <div
      v-if="localData.length > 0"
      class="space-y-3"
    >
      <div
        v-for="(link, index) in localData"
        :key="link.id"
        class="card bg-base-100 card-border"
      >
        <div class="card-body p-4">
          <div class="flex items-start gap-3">
            <!-- Type Icon -->
            <div class="text-2xl">
              {{ getTypeIcon(link.type) }}
            </div>

            <!-- Form Fields -->
            <div class="flex-1 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs">
                    {{ t('resume.links.name') }}
                    <span class="text-error">*</span>
                  </legend>
                  <input
                    type="text"
                    :value="link.label"
                    :placeholder="t('recommendations.linkLabelPlaceholder')"
                    class="input input-bordered input-sm w-full"
                    :class="{ 'input-error': !link.label }"
                    @input="updateLink(index, 'label', ($event.target as HTMLInputElement).value)"
                  />
                </fieldset>

                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs">
                    {{ t('resume.links.type') }}
                  </legend>
                  <select
                    :value="link.type"
                    class="select select-bordered select-sm w-full"
                    @change="updateLink(index, 'type', ($event.target as HTMLSelectElement).value)"
                  >
                    <option
                      v-for="option in linkTypeOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.icon }} {{ option.label }}
                    </option>
                  </select>
                </fieldset>
              </div>

              <fieldset class="fieldset">
                <legend class="fieldset-legend text-xs">
                  {{ t('resume.links.url') }}
                  <span class="text-error">*</span>
                </legend>
                <label
                  class="input input-bordered input-sm flex items-center gap-2 w-full"
                  :class="{ 'input-error': errors[link.id] }"
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <input
                    type="url"
                    :value="link.url"
                    placeholder="https://example.com"
                    class="grow"
                    @input="updateLink(index, 'url', ($event.target as HTMLInputElement).value)"
                  />
                  <a
                    v-if="link.url && !errors[link.id]"
                    :href="link.url"
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
                </label>
                <p
                  v-if="errors[link.id]"
                  class="text-error text-xs mt-1"
                >
                  {{ errors[link.id] }}
                </p>
              </fieldset>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-1">
              <div class="join join-vertical">
                <button
                  class="btn btn-ghost btn-xs join-item"
                  :disabled="index === 0"
                  @click="moveLink(index, 'up')"
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
                  @click="moveLink(index, 'down')"
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
              <button
                class="btn btn-ghost btn-xs btn-circle text-error"
                @click="removeLink(index)"
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
              </button>
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
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      <h3 class="text-lg font-semibold mt-4">
        {{ t('recommendations.noLinks') }}
      </h3>
      <p class="text-base-content/60 text-sm">
        {{ t('recommendations.addFirstLink') }}
      </p>
      <button
        class="btn btn-primary mt-4 gap-2"
        @click="addLink"
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
        {{ t('resume.links.addNew') }}
      </button>
    </div>

    <!-- Suggested Platforms -->
    <div class="card bg-base-200 p-4">
      <p class="text-xs text-base-content/60 mb-2">
        {{ t('recommendations.suggestedPlatforms') }}:
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="badge badge-outline badge-sm">Behance</span>
        <span class="badge badge-outline badge-sm">Dribbble</span>
        <span class="badge badge-outline badge-sm">Medium</span>
        <span class="badge badge-outline badge-sm">Dev.to</span>
        <span class="badge badge-outline badge-sm">CodePen</span>
        <span class="badge badge-outline badge-sm">Stack Overflow</span>
      </div>
    </div>
  </div>
</template>
