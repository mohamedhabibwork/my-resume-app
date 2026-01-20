<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import type { Language } from '@/types'
import { LANGUAGE_PROFICIENCY } from '@/types'
import { generateId } from '@/utils/helpers'

const props = defineProps<{
  languages: Language[]
}>()

const emit = defineEmits<{
  update: [data: Language[]]
}>()

const { t } = useI18n()

const localData = ref<Language[]>([...props.languages])

const proficiencyOptions = [
  { label: t('resume.languages.levels.native'), value: LANGUAGE_PROFICIENCY.NATIVE },
  { label: t('resume.languages.levels.fluent'), value: LANGUAGE_PROFICIENCY.FLUENT },
  { label: t('resume.languages.levels.advanced'), value: LANGUAGE_PROFICIENCY.ADVANCED },
  { label: t('resume.languages.levels.intermediate'), value: LANGUAGE_PROFICIENCY.INTERMEDIATE },
  { label: t('resume.languages.levels.basic'), value: LANGUAGE_PROFICIENCY.BASIC },
]

function addLanguage() {
  localData.value.push({
    id: generateId(),
    name: '',
    proficiency: LANGUAGE_PROFICIENCY.INTERMEDIATE,
  })
  emit('update', localData.value)
}

function removeLanguage(index: number) {
  localData.value.splice(index, 1)
  emit('update', localData.value)
}

function updateLanguage(index: number, field: keyof Language, value: unknown) {
  const lang = localData.value[index]
  if (lang) {
    localData.value[index] = { ...lang, [field]: value } as Language
    emit('update', localData.value)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="(lang, index) in localData"
      :key="lang.id"
      class="border border-gray-200 rounded-lg p-4 space-y-4"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          Language {{ index + 1 }}
        </h3>
        <Button
          variant="danger"
          size="sm"
          @click="removeLanguage(index)"
        >
          Remove
        </Button>
      </div>

      <Input
        :model-value="lang.name"
        :label="t('resume.languages.name')"
        required
        @update:model-value="updateLanguage(index, 'name', $event)"
      />

      <Select
        :model-value="lang.proficiency"
        :label="t('resume.languages.proficiency')"
        :options="proficiencyOptions"
        @update:model-value="updateLanguage(index, 'proficiency', $event)"
      />
    </div>

    <Button
      variant="outline"
      @click="addLanguage"
    >
      {{ t('resume.languages.addNew') }}
    </Button>
  </div>
</template>
