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
    fontSize: `${font?.size || 14}px`,
    fontWeight: font?.weight || 'normal',
    lineHeight: font?.lineHeight || 1.5,
    color: theme?.text || '#111827',
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

// Default section order if not defined
const defaultSectionOrder = [
  { id: 'personal', order: 0 },
  { id: 'experience', order: 1 },
  { id: 'education', order: 2 },
  { id: 'skills', order: 3 },
  { id: 'projects', order: 4 },
  { id: 'certifications', order: 5 },
  { id: 'languages', order: 6 },
  { id: 'links', order: 7 },
]

// Get ordered sections based on resume.sectionOrder
const orderedSections = computed(() => {
  const sectionOrder = props.resume.sectionOrder && props.resume.sectionOrder.length > 0
    ? props.resume.sectionOrder
    : defaultSectionOrder

  return [...sectionOrder].sort((a, b) => a.order - b.order).map(s => s.id)
})

// Check if section has content
function hasContent(sectionId: string): boolean {
  switch (sectionId) {
    case 'personal':
      return Boolean(props.resume.personalInfo.summary)
    case 'experience':
      return props.resume.workExperience.length > 0
    case 'education':
      return props.resume.education.length > 0
    case 'skills':
      return props.resume.skills.filter(s => !s.isHidden).length > 0
    case 'projects':
      return props.resume.projects.length > 0
    case 'certifications':
      return props.resume.certifications.length > 0
    case 'languages':
      return props.resume.languages.length > 0
    case 'links':
      return Boolean(props.resume.links && props.resume.links.length > 0)
    default:
      return false
  }
}
</script>

<template>
  <BaseTemplate :resume="resume">
    <div
      :style="style"
      class="p-8 md:p-12 max-w-4xl mx-auto min-h-full"
    >
      <!-- Header (Always First) -->
      <header
        class="mb-8 border-b-2 pb-4"
        :style="{ borderColor: resume.theme?.primary || '#3b82f6' }"
      >
        <h1
          class="text-3xl md:text-4xl font-bold mb-2"
          :style="{ color: resume.theme?.primary || '#3b82f6' }"
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
            >•</span>
          </template>
        </div>
      </header>

      <!-- Dynamic Sections Based on Order -->
      <template
        v-for="sectionId in orderedSections"
        :key="sectionId"
      >
        <!-- Summary -->
        <section
          v-if="sectionId === 'personal' && hasContent('personal')"
          class="mb-6"
        >
          <h2
            class="text-xl font-semibold mb-2"
            :style="{ color: resume.theme?.primary || '#3b82f6' }"
          >
            Summary
          </h2>
          <p class="text-gray-700 whitespace-pre-line">
            {{ resume.personalInfo.summary }}
          </p>
        </section>

        <!-- Work Experience -->
        <section
          v-if="sectionId === 'experience' && hasContent('experience')"
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
            class="mb-6 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-1">
              <div class="flex-1">
                <h3 class="font-semibold text-lg">
                  {{ exp.position }}
                </h3>
                <p class="text-gray-600">
                  {{ exp.company }}<span v-if="exp.location">, {{ exp.location }}</span>
                </p>
              </div>
              <span class="text-sm text-gray-500 whitespace-nowrap">
                {{ exp.startDate }} - {{ exp.current ? 'Present' : (exp.endDate || 'Present') }}
              </span>
            </div>
            <p
              v-if="exp.description"
              class="text-gray-700 mb-2 whitespace-pre-line"
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
          v-if="sectionId === 'education' && hasContent('education')"
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
            class="mb-4 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
              <div class="flex-1">
                <h3 class="font-semibold">
                  {{ edu.degree }}<span v-if="edu.field"> in {{ edu.field }}</span>
                </h3>
                <p class="text-gray-600">
                  {{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span>
                </p>
                <p
                  v-if="edu.gpa"
                  class="text-sm text-gray-500 mt-1"
                >
                  GPA: {{ edu.gpa }}
                </p>
              </div>
              <span class="text-sm text-gray-500 whitespace-nowrap">
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

        <!-- Skills -->
        <section
          v-if="sectionId === 'skills' && hasContent('skills')"
          class="mb-6"
        >
          <h2
            class="text-xl font-semibold mb-4"
            :style="{ color: resume.theme?.primary || '#3b82f6' }"
          >
            Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in resume.skills.filter(s => !s.isHidden)"
              :key="skill.id"
              class="px-3 py-1 rounded-full text-sm font-medium"
              :style="{ backgroundColor: resume.theme?.accent || '#10b981', color: '#fff' }"
            >
              {{ skill.name }}
            </span>
          </div>
        </section>

        <!-- Projects -->
        <section
          v-if="sectionId === 'projects' && hasContent('projects')"
          class="mb-6"
        >
          <h2
            class="text-xl font-semibold mb-4"
            :style="{ color: resume.theme?.primary || '#3b82f6' }"
          >
            Projects
          </h2>
          <div
            v-for="project in resume.projects"
            :key="project.id"
            class="mb-4 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
              <h3 class="font-semibold text-lg">
                {{ project.name }}
              </h3>
              <span
                v-if="project.startDate || project.endDate"
                class="text-sm text-gray-500 whitespace-nowrap"
              >
                {{ project.startDate }} - {{ project.endDate || 'Present' }}
              </span>
            </div>
            <p
              v-if="project.description"
              class="text-gray-700 mb-2 whitespace-pre-line"
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
            <ul
              v-if="project.highlights && project.highlights.length > 0"
              class="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1"
            >
              <li
                v-for="(highlight, idx) in project.highlights.filter(Boolean)"
                :key="idx"
              >
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Certifications -->
        <section
          v-if="sectionId === 'certifications' && hasContent('certifications')"
          class="mb-6"
        >
          <h2
            class="text-xl font-semibold mb-4"
            :style="{ color: resume.theme?.primary || '#3b82f6' }"
          >
            Certifications
          </h2>
          <div
            v-for="cert in resume.certifications"
            :key="cert.id"
            class="mb-3 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
              <div>
                <h3 class="font-semibold">
                  {{ cert.name }}
                </h3>
                <p class="text-gray-600 text-sm">
                  {{ cert.issuer }}
                </p>
                <p
                  v-if="cert.credentialId"
                  class="text-xs text-gray-500 mt-1"
                >
                  ID: {{ cert.credentialId }}
                </p>
              </div>
              <span class="text-sm text-gray-500 whitespace-nowrap">
                {{ cert.issueDate }}<span v-if="cert.expiryDate"> - {{ cert.expiryDate }}</span>
              </span>
            </div>
            <a
              v-if="cert.url"
              :href="cert.url"
              target="_blank"
              class="text-sm text-blue-600 hover:underline mt-1 inline-block"
            >View Credential</a>
          </div>
        </section>

        <!-- Languages -->
        <section
          v-if="sectionId === 'languages' && hasContent('languages')"
          class="mb-6"
        >
          <h2
            class="text-xl font-semibold mb-4"
            :style="{ color: resume.theme?.primary || '#3b82f6' }"
          >
            Languages
          </h2>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="lang in resume.languages"
              :key="lang.id"
              class="flex items-center gap-2"
            >
              <span class="font-medium">{{ lang.name }}</span>
              <span class="text-sm text-gray-500">- {{ lang.proficiency }}</span>
            </div>
          </div>
        </section>

        <!-- Links -->
        <section
          v-if="sectionId === 'links' && hasContent('links')"
          class="mb-6"
        >
          <h2
            class="text-xl font-semibold mb-4"
            :style="{ color: resume.theme?.primary || '#3b82f6' }"
          >
            Links
          </h2>
          <div class="flex flex-wrap gap-4">
            <a
              v-for="link in resume.links"
              :key="link.id"
              :href="link.url"
              target="_blank"
              class="text-blue-600 hover:underline"
            >
              {{ link.label || link.url }}
            </a>
          </div>
        </section>
      </template>
    </div>
  </BaseTemplate>
</template>
