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
    fontFamily: font?.family || 'Calibri, sans-serif',
    fontSize: `${font?.size || 13}px`,
    fontWeight: font?.weight || 'normal',
    lineHeight: font?.lineHeight || 1.6,
    color: theme?.text || '#2c3e50',
    backgroundColor: theme?.background || '#ffffff',
  }
})

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
      class="p-8 md:p-10 max-w-4xl mx-auto min-h-full"
    >
      <!-- Professional Header -->
      <header
        class="mb-8 pb-6 border-b-2"
        :style="{ borderColor: resume.theme?.primary || '#2c3e50' }"
      >
        <div class="flex flex-col md:flex-row md:justify-between md:items-end">
          <div class="flex-1">
            <h1
              class="text-3xl md:text-4xl font-bold mb-2"
              :style="{ color: resume.theme?.primary || '#2c3e50' }"
            >
              {{ resume.personalInfo.firstName }} {{ resume.personalInfo.lastName }}
            </h1>
            <div class="flex flex-wrap gap-3 text-sm text-gray-600">
              <template
                v-for="(info, index) in contactInfo"
                :key="index"
              >
                <span>{{ info }}</span>
                <span
                  v-if="index < contactInfo.length - 1"
                  class="text-gray-400"
                >|</span>
              </template>
            </div>
          </div>
          <div
            v-if="resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website"
            class="mt-4 md:mt-0 flex gap-3 text-sm"
          >
            <a
              v-if="resume.personalInfo.website"
              :href="resume.personalInfo.website"
              target="_blank"
              class="text-blue-600 hover:underline"
            >Website</a>
            <a
              v-if="resume.personalInfo.linkedin"
              :href="resume.personalInfo.linkedin"
              target="_blank"
              class="text-blue-600 hover:underline"
            >LinkedIn</a>
            <a
              v-if="resume.personalInfo.github"
              :href="resume.personalInfo.github"
              target="_blank"
              class="text-blue-600 hover:underline"
            >GitHub</a>
          </div>
        </div>
      </header>

      <!-- Summary -->
      <section
        v-if="resume.personalInfo.summary"
        class="mb-8"
      >
        <h2
          class="text-lg font-bold mb-3 uppercase tracking-wide"
          :style="{ color: resume.theme?.primary || '#2c3e50' }"
        >
          Professional Summary
        </h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ resume.personalInfo.summary }}
        </p>
      </section>

      <!-- Experience & Education Side by Side -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Experience -->
        <section
          v-if="resume.workExperience.length > 0"
          class="md:col-span-2"
        >
          <h2
            class="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 pb-2"
            :style="{ borderColor: resume.theme?.primary || '#2c3e50', color: resume.theme?.primary || '#2c3e50' }"
          >
            Professional Experience
          </h2>
          <div
            v-for="exp in resume.workExperience"
            :key="exp.id"
            class="mb-5 last:mb-0"
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
              <span class="text-sm text-gray-600 font-medium whitespace-nowrap mt-1 md:mt-0">
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
      </div>

      <!-- Two Column Layout for Education, Skills, etc. -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Education -->
        <section v-if="resume.education.length > 0">
          <h2
            class="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 pb-2"
            :style="{ borderColor: resume.theme?.primary || '#2c3e50', color: resume.theme?.primary || '#2c3e50' }"
          >
            Education
          </h2>
          <div
            v-for="edu in resume.education"
            :key="edu.id"
            class="mb-4 last:mb-0"
          >
            <h3 class="font-bold text-gray-900">
              {{ edu.degree }}<span v-if="edu.field"> in {{ edu.field }}</span>
            </h3>
            <p class="text-gray-700 text-sm">
              {{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span>
            </p>
            <p
              v-if="edu.gpa"
              class="text-xs text-gray-600 mt-1"
            >
              GPA: {{ edu.gpa }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ edu.startDate }} - {{ edu.current ? 'Present' : (edu.endDate || 'Present') }}
            </p>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="resume.skills.filter(s => !s.isHidden).length > 0">
          <h2
            class="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 pb-2"
            :style="{ borderColor: resume.theme?.primary || '#2c3e50', color: resume.theme?.primary || '#2c3e50' }"
          >
            Skills
          </h2>
          <div class="space-y-2">
            <div
              v-for="skill in resume.skills.filter(s => !s.isHidden)"
              :key="skill.id"
              class="text-sm"
            >
              <div class="flex justify-between items-center mb-1">
                <span class="text-gray-900">{{ skill.name }}</span>
                <span
                  v-if="skill.showProgress && skill.progress"
                  class="text-xs text-gray-600"
                >{{ skill.progress }}%</span>
              </div>
              <div
                v-if="skill.showProgress"
                class="w-full bg-gray-200 rounded-full h-2"
              >
                <div
                  class="h-2 rounded-full"
                  :style="{ width: `${skill.progress || 50}%`, backgroundColor: resume.theme?.accent || '#3498db' }"
                />
              </div>
              <div
                v-else
                class="text-gray-700"
              >
                • {{ skill.name }}
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Projects -->
      <section
        v-if="resume.projects.length > 0"
        class="mt-8"
      >
        <h2
          class="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 pb-2"
          :style="{ borderColor: resume.theme?.primary || '#2c3e50', color: resume.theme?.primary || '#2c3e50' }"
        >
          Projects
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="project in resume.projects"
            :key="project.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <h3 class="font-bold text-gray-900 mb-2">
              {{ project.name }}
            </h3>
            <p
              v-if="project.description"
              class="text-sm text-gray-700 mb-2 whitespace-pre-line"
            >
              {{ project.description }}
            </p>
            <div
              v-if="project.technologies && project.technologies.length > 0"
              class="flex flex-wrap gap-1 mb-2"
            >
              <span
                v-for="(tech, idx) in project.technologies.filter(Boolean)"
                :key="idx"
                class="text-xs px-2 py-1 rounded"
                :style="{ backgroundColor: resume.theme?.accent || '#e3f2fd', color: resume.theme?.text || '#2c3e50' }"
              >
                {{ tech }}
              </span>
            </div>
            <div class="flex gap-3 text-xs">
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="text-blue-600 hover:underline"
              >View</a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                class="text-blue-600 hover:underline"
              >GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Certifications & Languages -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <!-- Certifications -->
        <section v-if="resume.certifications.length > 0">
          <h2
            class="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 pb-2"
            :style="{ borderColor: resume.theme?.primary || '#2c3e50', color: resume.theme?.primary || '#2c3e50' }"
          >
            Certifications
          </h2>
          <div class="space-y-3">
            <div
              v-for="cert in resume.certifications"
              :key="cert.id"
            >
              <h3 class="font-semibold text-gray-900">
                {{ cert.name }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ cert.issuer }}
              </p>
              <p class="text-xs text-gray-500">
                {{ cert.issueDate }}<span v-if="cert.expiryDate"> - {{ cert.expiryDate }}</span>
              </p>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section v-if="resume.languages.length > 0">
          <h2
            class="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 pb-2"
            :style="{ borderColor: resume.theme?.primary || '#2c3e50', color: resume.theme?.primary || '#2c3e50' }"
          >
            Languages
          </h2>
          <div class="space-y-2">
            <div
              v-for="lang in resume.languages"
              :key="lang.id"
              class="flex justify-between items-center"
            >
              <span class="font-medium text-gray-900">{{ lang.name }}</span>
              <span class="text-sm text-gray-600">{{ lang.proficiency }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </BaseTemplate>
</template>
