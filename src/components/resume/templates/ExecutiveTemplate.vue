<script setup lang="ts">
import { computed } from 'vue'
import BaseTemplate from './BaseTemplate.vue'
import type { Resume } from '@/types'
import { useSectionOrder } from '@/composables/useSectionOrder'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const style = computed(() => {
  const theme = props.resume.theme
  const font = props.resume.fontSettings
  return {
    fontFamily: font?.family || 'Georgia, serif',
    fontSize: `${font?.size || 13}px`,
    fontWeight: font?.weight || 'normal',
    lineHeight: font?.lineHeight || 1.6,
    color: theme?.text || '#1a1a1a',
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

const { orderedSections, hasContent } = useSectionOrder(computed(() => props.resume))
</script>

<template>
  <BaseTemplate :resume="resume">
    <div
      :style="style"
      class="p-10 md:p-12 max-w-5xl mx-auto min-h-full"
    >
      <!-- Executive Header -->
      <header
        class="mb-10 text-center border-b-4 pb-6"
        :style="{ borderColor: resume.theme?.primary || '#1a1a1a' }"
      >
        <h1
          class="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
          :style="{ color: resume.theme?.primary || '#1a1a1a' }"
        >
          {{ resume.personalInfo.firstName }} {{ resume.personalInfo.lastName }}
        </h1>
        <div class="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-700">
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
        <div
          v-if="resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website"
          class="flex justify-center gap-4 mt-3 text-sm"
        >
          <a
            v-if="resume.personalInfo.website"
            :href="resume.personalInfo.website"
            target="_blank"
            class="text-blue-700 hover:underline"
          >Website</a>
          <a
            v-if="resume.personalInfo.linkedin"
            :href="resume.personalInfo.linkedin"
            target="_blank"
            class="text-blue-700 hover:underline"
          >LinkedIn</a>
          <a
            v-if="resume.personalInfo.github"
            :href="resume.personalInfo.github"
            target="_blank"
            class="text-blue-700 hover:underline"
          >GitHub</a>
        </div>
      </header>

      <!-- Dynamic Sections Based on Order -->
      <template
        v-for="sectionId in orderedSections"
        :key="sectionId"
      >
        <!-- Executive Summary -->
        <section
          v-if="sectionId === 'personal' && hasContent('personal')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-3 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Executive Summary
          </h2>
          <p class="text-gray-800 leading-relaxed whitespace-pre-line">
            {{ resume.personalInfo.summary }}
          </p>
        </section>

        <!-- Core Competencies / Skills -->
        <section
          v-if="sectionId === 'skills' && hasContent('skills')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Core Competencies
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              v-for="skill in resume.skills.filter(s => !s.isHidden)"
              :key="skill.id"
              class="text-sm font-medium text-gray-700"
            >
              • {{ skill.name }}
            </div>
          </div>
        </section>

        <!-- Professional Experience -->
        <section
          v-if="sectionId === 'experience' && hasContent('experience')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-5 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Professional Experience
          </h2>
          <div
            v-for="exp in resume.workExperience"
            :key="exp.id"
            class="mb-6 last:mb-0"
          >
            <div
              class="flex flex-col md:flex-row md:justify-between md:items-start mb-2 pb-2 border-b"
              :style="{ borderColor: resume.theme?.secondary || '#e5e7eb' }"
            >
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-1">
                  {{ exp.position }}
                </h3>
                <p class="text-gray-700 font-medium">
                  {{ exp.company }}<span v-if="exp.location">, {{ exp.location }}</span>
                </p>
              </div>
              <span class="text-sm font-medium text-gray-600 mt-1 md:mt-0 whitespace-nowrap">
                {{ exp.startDate }} - {{ exp.current ? 'Present' : (exp.endDate || 'Present') }}
              </span>
            </div>
            <p
              v-if="exp.description"
              class="text-gray-800 mb-3 leading-relaxed whitespace-pre-line"
            >
              {{ exp.description }}
            </p>
            <ul
              v-if="exp.highlights && exp.highlights.length > 0"
              class="list-disc list-inside text-gray-700 space-y-1 ml-2"
            >
              <li
                v-for="(highlight, idx) in exp.highlights.filter(Boolean)"
                :key="idx"
                class="leading-relaxed"
              >
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Education -->
        <section
          v-if="sectionId === 'education' && hasContent('education')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-5 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Education
          </h2>
          <div
            v-for="edu in resume.education"
            :key="edu.id"
            class="mb-4 last:mb-0"
          >
            <div
              class="flex flex-col md:flex-row md:justify-between md:items-start pb-2 border-b"
              :style="{ borderColor: resume.theme?.secondary || '#e5e7eb' }"
            >
              <div class="flex-1">
                <h3 class="text-lg font-bold">
                  {{ edu.degree }}<span v-if="edu.field"> in {{ edu.field }}</span>
                </h3>
                <p class="text-gray-700 font-medium">
                  {{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span>
                </p>
                <p
                  v-if="edu.gpa"
                  class="text-sm text-gray-600 mt-1"
                >
                  GPA: {{ edu.gpa }}
                </p>
              </div>
              <span class="text-sm font-medium text-gray-600 mt-1 md:mt-0 whitespace-nowrap">
                {{ edu.startDate }} - {{ edu.current ? 'Present' : (edu.endDate || 'Present') }}
              </span>
            </div>
            <ul
              v-if="edu.highlights && edu.highlights.length > 0"
              class="list-disc list-inside text-gray-700 ml-2 mt-2 space-y-1"
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

        <!-- Certifications -->
        <section
          v-if="sectionId === 'certifications' && hasContent('certifications')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Certifications
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="cert in resume.certifications"
              :key="cert.id"
              class="pb-3 border-b"
              :style="{ borderColor: resume.theme?.secondary || '#e5e7eb' }"
            >
              <h3 class="font-bold text-gray-900">
                {{ cert.name }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ cert.issuer }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ cert.issueDate }}<span v-if="cert.expiryDate"> - {{ cert.expiryDate }}</span>
              </p>
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section
          v-if="sectionId === 'projects' && hasContent('projects')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Key Projects
          </h2>
          <div
            v-for="project in resume.projects"
            :key="project.id"
            class="mb-4 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <h3 class="text-lg font-bold">
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
              class="text-gray-800 mb-2 leading-relaxed whitespace-pre-line"
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
                class="px-2 py-1 rounded text-xs font-medium"
                :style="{ backgroundColor: resume.theme?.accent || '#f3f4f6', color: resume.theme?.text || '#1a1a1a' }"
              >
                {{ tech }}
              </span>
            </div>
            <div
              v-if="project.url || project.githubUrl"
              class="flex gap-3 text-sm"
            >
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="text-blue-700 hover:underline"
              >View Project</a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                class="text-blue-700 hover:underline"
              >GitHub</a>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section
          v-if="sectionId === 'languages' && hasContent('languages')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Languages
          </h2>
          <div class="flex flex-wrap gap-6">
            <div
              v-for="lang in resume.languages"
              :key="lang.id"
              class="text-gray-800"
            >
              <span class="font-semibold">{{ lang.name }}</span>
              <span class="text-sm text-gray-600 ml-2">({{ lang.proficiency }})</span>
            </div>
          </div>
        </section>

        <!-- Links -->
        <section
          v-if="sectionId === 'links' && hasContent('links')"
          class="mb-8"
        >
          <h2
            class="text-2xl font-bold mb-4 uppercase tracking-wide"
            :style="{ color: resume.theme?.primary || '#1a1a1a' }"
          >
            Links
          </h2>
          <div class="flex flex-wrap gap-4">
            <a
              v-for="link in resume.links"
              :key="link.id"
              :href="link.url"
              target="_blank"
              class="text-blue-700 hover:underline"
            >
              {{ link.label || link.url }}
            </a>
          </div>
        </section>
      </template>
    </div>
  </BaseTemplate>
</template>
