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
    fontFamily: font?.family || 'Arial, sans-serif',
    fontSize: `${font?.size || 13}px`,
    fontWeight: font?.weight || 'normal',
    lineHeight: font?.lineHeight || 1.6,
    color: theme?.text || '#1a1a1a',
    backgroundColor: theme?.background || '#ffffff',
  }
})

const sidebarStyle = computed(() => ({
  backgroundColor: props.resume.theme?.primary || '#2563eb',
  color: '#ffffff',
}))

const contactInfo = computed(() => {
  const info = []
  if (props.resume.personalInfo.email) info.push(props.resume.personalInfo.email)
  if (props.resume.personalInfo.phone && (!props.resume.personalInfo.phones || props.resume.personalInfo.phones.length === 0)) {
    info.push(props.resume.personalInfo.phone)
  }
  if (props.resume.personalInfo.phones && props.resume.personalInfo.phones.length > 0) {
    info.push(...props.resume.personalInfo.phones.filter(Boolean))
  }
  if (props.resume.personalInfo.location) info.push(props.resume.personalInfo.location)
  if (props.resume.personalInfo.website) info.push(props.resume.personalInfo.website)
  if (props.resume.personalInfo.linkedin) info.push(props.resume.personalInfo.linkedin)
  if (props.resume.personalInfo.github) info.push(props.resume.personalInfo.github)
  return info
})
</script>

<template>
  <BaseTemplate :resume="resume">
    <div
      :style="style"
      class="flex min-h-full"
    >
      <!-- Left Sidebar -->
      <aside
        :style="sidebarStyle"
        class="w-1/3 p-6 md:p-8"
      >
        <!-- Header -->
        <header class="mb-8 text-center border-b border-white/30 pb-6">
          <h1 class="text-2xl md:text-3xl font-bold mb-3">
            {{ resume.personalInfo.firstName }}<br />{{ resume.personalInfo.lastName }}
          </h1>
          <div class="space-y-2 text-sm">
            <template
              v-for="(info, index) in contactInfo"
              :key="index"
            >
              <p class="opacity-90">
                {{ info }}
              </p>
            </template>
          </div>
          <div
            v-if="resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website"
            class="mt-4 space-y-1 text-xs"
          >
            <a
              v-if="resume.personalInfo.website"
              :href="resume.personalInfo.website"
              target="_blank"
              class="block opacity-90 hover:opacity-100 underline"
            >Website</a>
            <a
              v-if="resume.personalInfo.linkedin"
              :href="resume.personalInfo.linkedin"
              target="_blank"
              class="block opacity-90 hover:opacity-100 underline"
            >LinkedIn</a>
            <a
              v-if="resume.personalInfo.github"
              :href="resume.personalInfo.github"
              target="_blank"
              class="block opacity-90 hover:opacity-100 underline"
            >GitHub</a>
          </div>
        </header>

        <!-- Skills -->
        <section
          v-if="resume.skills.filter(s => !s.isHidden).length > 0"
          class="mb-6"
        >
          <h2 class="text-lg font-bold mb-4 border-b border-white/30 pb-2">
            Skills
          </h2>
          <div class="space-y-3">
            <div
              v-for="skill in resume.skills.filter(s => !s.isHidden)"
              :key="skill.id"
              class="text-sm"
            >
              <div class="flex justify-between items-center mb-1">
                <span>{{ skill.name }}</span>
                <span
                  v-if="skill.showProgress && skill.progress"
                  class="text-xs opacity-75"
                >{{ skill.progress }}%</span>
              </div>
              <div
                v-if="skill.showProgress"
                class="w-full bg-white/20 rounded-full h-2"
              >
                <div
                  class="bg-white h-2 rounded-full"
                  :style="{ width: `${skill.progress || 50}%` }"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section
          v-if="resume.languages.length > 0"
          class="mb-6"
        >
          <h2 class="text-lg font-bold mb-4 border-b border-white/30 pb-2">
            Languages
          </h2>
          <div class="space-y-2 text-sm">
            <div
              v-for="lang in resume.languages"
              :key="lang.id"
            >
              <span class="font-semibold">{{ lang.name }}</span>
              <span class="opacity-75 ml-2">— {{ lang.proficiency }}</span>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section
          v-if="resume.certifications.length > 0"
          class="mb-6"
        >
          <h2 class="text-lg font-bold mb-4 border-b border-white/30 pb-2">
            Certifications
          </h2>
          <div class="space-y-3 text-sm">
            <div
              v-for="cert in resume.certifications"
              :key="cert.id"
            >
              <p class="font-semibold">
                {{ cert.name }}
              </p>
              <p class="opacity-75 text-xs">
                {{ cert.issuer }}
              </p>
              <p class="opacity-60 text-xs mt-1">
                {{ cert.issueDate }}
              </p>
            </div>
          </div>
        </section>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-8 bg-white">
        <!-- Summary -->
        <section
          v-if="resume.personalInfo.summary"
          class="mb-8"
        >
          <h2
            class="text-xl font-bold mb-3 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#2563eb' }"
          >
            Summary
          </h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">
            {{ resume.personalInfo.summary }}
          </p>
        </section>

        <!-- Experience -->
        <section
          v-if="resume.workExperience.length > 0"
          class="mb-8"
        >
          <h2
            class="text-xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#2563eb' }"
          >
            Experience
          </h2>
          <div
            v-for="exp in resume.workExperience"
            :key="exp.id"
            class="mb-6 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900">
                  {{ exp.position }}
                </h3>
                <p class="text-gray-700 font-medium">
                  {{ exp.company }}<span v-if="exp.location">, {{ exp.location }}</span>
                </p>
              </div>
              <span class="text-sm text-gray-600 whitespace-nowrap mt-1 md:mt-0">
                {{ exp.startDate }} - {{ exp.current ? 'Present' : (exp.endDate || 'Present') }}
              </span>
            </div>
            <p
              v-if="exp.description"
              class="text-gray-700 mb-2 leading-relaxed whitespace-pre-line"
            >
              {{ exp.description }}
            </p>
            <ul
              v-if="exp.highlights && exp.highlights.length > 0"
              class="list-disc list-inside text-gray-700 ml-4 space-y-1"
            >
              <li
                v-for="(highlight, idx) in exp.highlights.filter(Boolean)"
                :key="idx"
              >
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Education -->
        <section
          v-if="resume.education.length > 0"
          class="mb-8"
        >
          <h2
            class="text-xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#2563eb' }"
          >
            Education
          </h2>
          <div
            v-for="edu in resume.education"
            :key="edu.id"
            class="mb-4 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start">
              <div class="flex-1">
                <h3 class="text-base font-bold text-gray-900">
                  {{ edu.degree }}<span v-if="edu.field"> in {{ edu.field }}</span>
                </h3>
                <p class="text-gray-700">
                  {{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span>
                </p>
                <p
                  v-if="edu.gpa"
                  class="text-sm text-gray-600 mt-1"
                >
                  GPA: {{ edu.gpa }}
                </p>
              </div>
              <span class="text-sm text-gray-600 whitespace-nowrap mt-1 md:mt-0">
                {{ edu.startDate }} - {{ edu.current ? 'Present' : (edu.endDate || 'Present') }}
              </span>
            </div>
            <ul
              v-if="edu.highlights && edu.highlights.length > 0"
              class="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1"
            >
              <li
                v-for="(highlight, idx) in edu.highlights.filter(Boolean)"
                :key="idx"
              >
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Projects -->
        <section
          v-if="resume.projects.length > 0"
          class="mb-8"
        >
          <h2
            class="text-xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#2563eb' }"
          >
            Projects
          </h2>
          <div
            v-for="project in resume.projects"
            :key="project.id"
            class="mb-4 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <h3 class="text-base font-bold text-gray-900">
                {{ project.name }}
              </h3>
              <span
                v-if="project.startDate || project.endDate"
                class="text-sm text-gray-600 whitespace-nowrap"
              >
                {{ project.startDate }} - {{ project.endDate || 'Present' }}
              </span>
            </div>
            <p
              v-if="project.description"
              class="text-gray-700 mb-2 leading-relaxed whitespace-pre-line"
            >
              {{ project.description }}
            </p>
            <div
              v-if="project.technologies && project.technologies.length > 0"
              class="flex flex-wrap gap-2 mb-2"
            >
              <span
                v-for="(tech, idx) in project.technologies.filter(Boolean)"
                :key="idx"
                class="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
              >
                {{ tech }}
              </span>
            </div>
            <div class="flex gap-4 text-sm">
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="text-blue-600 hover:underline"
              >View Project</a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                class="text-blue-600 hover:underline"
              >GitHub</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  </BaseTemplate>
</template>
