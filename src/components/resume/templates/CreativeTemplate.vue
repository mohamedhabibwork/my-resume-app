<script setup lang="ts">
import { computed } from 'vue'
import BaseTemplate from './BaseTemplate.vue'
import type { Resume } from '@/types'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const style = computed(() => {
  const theme = props.resume.theme
  const font = props.resume.fontSettings
  return {
    fontFamily: font?.family || 'Helvetica, sans-serif',
    fontSize: `${font?.size || 14}px`,
    fontWeight: font?.weight || 'normal',
    lineHeight: font?.lineHeight || 1.5,
    color: theme?.text || '#111827',
    backgroundColor: theme?.background || '#ffffff',
  }
})
</script>

<template>
  <BaseTemplate :resume="resume">
    <div
      :style="style"
      class="p-8 max-w-4xl mx-auto"
    >
      <div class="grid grid-cols-3 gap-8">
        <!-- Sidebar -->
        <aside
          class="col-span-1"
          :style="{ backgroundColor: resume.theme?.primary || '#3b82f6', color: '#fff', padding: '2rem', borderRadius: '8px' }"
        >
          <header class="mb-6">
            <h1 class="text-2xl font-bold mb-2">
              {{ resume.personalInfo.firstName }} {{ resume.personalInfo.lastName }}
            </h1>
            <div class="text-sm opacity-90 space-y-1">
              <p v-if="resume.personalInfo.email">
                {{ resume.personalInfo.email }}
              </p>
              <p v-if="resume.personalInfo.phone">
                {{ resume.personalInfo.phone }}
              </p>
              <p v-if="resume.personalInfo.phones && resume.personalInfo.phones.length > 0">
                <span
                  v-for="(phone, idx) in resume.personalInfo.phones.filter(Boolean)"
                  :key="idx"
                >
                  {{ phone }}<span v-if="idx < resume.personalInfo.phones.filter(Boolean).length - 1">, </span>
                </span>
              </p>
              <p v-if="resume.personalInfo.location">
                {{ resume.personalInfo.location }}
              </p>
              <p v-if="resume.personalInfo.website">
                <a
                  :href="resume.personalInfo.website"
                  target="_blank"
                  class="underline hover:opacity-70"
                >{{ resume.personalInfo.website }}</a>
              </p>
              <p v-if="resume.personalInfo.linkedin">
                <a
                  :href="resume.personalInfo.linkedin"
                  target="_blank"
                  class="underline hover:opacity-70"
                >LinkedIn</a>
              </p>
              <p v-if="resume.personalInfo.github">
                <a
                  :href="resume.personalInfo.github"
                  target="_blank"
                  class="underline hover:opacity-70"
                >GitHub</a>
              </p>
            </div>
          </header>

          <section
            v-if="resume.skills.filter(s => !s.isHidden).length > 0"
            class="mb-6"
          >
            <h2 class="text-lg font-semibold mb-3 border-b border-white/30 pb-2">
              Skills
            </h2>
            <div class="space-y-2">
              <div
                v-for="skill in resume.skills.filter(s => !s.isHidden)"
                :key="skill.id"
                class="text-sm"
              >
                {{ skill.name }}
                <div
                  v-if="skill.showProgress"
                  class="w-full bg-white/20 rounded-full h-2 mt-1"
                >
                  <div
                    class="bg-white h-2 rounded-full"
                    :style="{ width: `${skill.progress || 50}%` }"
                  />
                </div>
              </div>
            </div>
          </section>
        </aside>

        <!-- Main Content -->
        <main class="col-span-2">
          <section
            v-if="resume.personalInfo.summary"
            class="mb-6"
          >
            <h2
              class="text-xl font-semibold mb-2"
              :style="{ color: resume.theme?.primary || '#3b82f6' }"
            >
              About
            </h2>
            <p class="text-gray-700">
              {{ resume.personalInfo.summary }}
            </p>
          </section>

          <section
            v-if="resume.workExperience.length > 0"
            class="mb-6"
          >
            <h2
              class="text-xl font-semibold mb-4"
              :style="{ color: resume.theme?.primary || '#3b82f6' }"
            >
              Experience
            </h2>
            <div
              v-for="exp in resume.workExperience"
              :key="exp.id"
              class="mb-4 pl-4 border-l-4"
              :style="{ borderColor: resume.theme?.accent || '#10b981' }"
            >
              <h3 class="font-semibold text-lg">
                {{ exp.position }}
              </h3>
              <p class="text-gray-600">
                {{ exp.company }} | {{ exp.startDate }} - {{ exp.current ? 'Present' : exp.endDate }}
              </p>
              <p class="text-gray-700 mt-2">
                {{ exp.description }}
              </p>
            </div>
          </section>

          <section
            v-if="resume.education.length > 0"
            class="mb-6"
          >
            <h2
              class="text-xl font-semibold mb-4"
              :style="{ color: resume.theme?.primary || '#3b82f6' }"
            >
              Education
            </h2>
            <div
              v-for="edu in resume.education"
              :key="edu.id"
              class="mb-4"
            >
              <h3 class="font-semibold">
                {{ edu.degree }} in {{ edu.field }}
              </h3>
              <p class="text-gray-600">
                {{ edu.institution }} | {{ edu.startDate }} - {{ edu.current ? 'Present' : edu.endDate }}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  </BaseTemplate>
</template>
