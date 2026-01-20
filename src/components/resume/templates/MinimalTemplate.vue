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
    fontFamily: font?.family || 'Inter, sans-serif',
    fontSize: `${font?.size || 13}px`,
    fontWeight: font?.weight || 'normal',
    lineHeight: font?.lineHeight || 1.7,
    color: theme?.text || '#2d3748',
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
      class="p-8 md:p-10 max-w-3xl mx-auto min-h-full"
    >
      <!-- Minimal Header -->
      <header class="mb-10 text-center">
        <h1 class="text-3xl md:text-4xl font-light mb-3 tracking-tight text-gray-900">
          {{ resume.personalInfo.firstName }} {{ resume.personalInfo.lastName }}
        </h1>
        <div class="flex flex-wrap justify-center gap-2 text-xs text-gray-500 font-light">
          <template
            v-for="(info, index) in contactInfo"
            :key="index"
          >
            <span>{{ info }}</span>
            <span
              v-if="index < contactInfo.length - 1"
              class="text-gray-300"
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
          class="mb-8"
        >
          <p class="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto whitespace-pre-line">
            {{ resume.personalInfo.summary }}
          </p>
        </section>

        <!-- Experience -->
        <section
          v-if="sectionId === 'experience' && hasContent('experience')"
          class="mb-8"
        >
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">
            Experience
          </h2>
          <div
            v-for="exp in resume.workExperience"
            :key="exp.id"
            class="mb-6 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ exp.position }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ exp.company }}<span v-if="exp.location">, {{ exp.location }}</span>
                </p>
              </div>
              <span class="text-xs text-gray-500 mt-1 md:mt-0 whitespace-nowrap">
                {{ exp.startDate }} - {{ exp.current ? 'Present' : (exp.endDate || 'Present') }}
              </span>
            </div>
            <p
              v-if="exp.description"
              class="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line"
            >
              {{ exp.description }}
            </p>
            <ul
              v-if="exp.highlights && exp.highlights.length > 0"
              class="mt-2 space-y-1"
            >
              <li
                v-for="(highlight, idx) in exp.highlights.filter(Boolean)"
                :key="idx"
                class="text-sm text-gray-600 flex items-start"
              >
                <span class="mr-2 text-gray-400">—</span>
                <span>{{ highlight }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Education -->
        <section
          v-if="sectionId === 'education' && hasContent('education')"
          class="mb-8"
        >
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">
            Education
          </h2>
          <div
            v-for="edu in resume.education"
            :key="edu.id"
            class="mb-4 last:mb-0"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h3 class="text-base font-medium text-gray-900">
                  {{ edu.degree }}<span v-if="edu.field">, {{ edu.field }}</span>
                </h3>
                <p class="text-sm text-gray-600">
                  {{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span>
                </p>
                <p
                  v-if="edu.gpa"
                  class="text-xs text-gray-500 mt-1"
                >
                  GPA: {{ edu.gpa }}
                </p>
              </div>
              <span class="text-xs text-gray-500 mt-1 md:mt-0 whitespace-nowrap">
                {{ edu.startDate }} - {{ edu.current ? 'Present' : (edu.endDate || 'Present') }}
              </span>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section
          v-if="sectionId === 'skills' && hasContent('skills')"
          class="mb-8"
        >
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in resume.skills.filter(s => !s.isHidden)"
              :key="skill.id"
              class="text-xs text-gray-700 border border-gray-300 rounded-full px-3 py-1"
            >
              {{ skill.name }}
            </span>
          </div>
        </section>

        <!-- Projects -->
        <section
          v-if="sectionId === 'projects' && hasContent('projects')"
          class="mb-8"
        >
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">
            Projects
          </h2>
          <div
            v-for="project in resume.projects"
            :key="project.id"
            class="mb-4 last:mb-0"
          >
            <h3 class="text-base font-medium text-gray-900 mb-1">
              {{ project.name }}
            </h3>
            <p
              v-if="project.description"
              class="text-sm text-gray-700 leading-relaxed whitespace-pre-line"
            >
              {{ project.description }}
            </p>
            <div
              v-if="project.technologies && project.technologies.length > 0"
              class="flex flex-wrap gap-1 mt-2"
            >
              <span
                v-for="(tech, idx) in project.technologies.filter(Boolean)"
                :key="idx"
                class="text-xs text-gray-500"
              >
                {{ tech }}<span v-if="idx < project.technologies.filter(Boolean).length - 1">,</span>
              </span>
            </div>
            <div
              v-if="project.url || project.githubUrl"
              class="mt-2 flex gap-3 text-xs"
            >
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

        <!-- Certifications -->
        <section
          v-if="sectionId === 'certifications' && hasContent('certifications')"
          class="mb-8"
        >
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Certifications
          </h2>
          <div class="space-y-2">
            <div
              v-for="cert in resume.certifications"
              :key="cert.id"
              class="text-sm"
            >
              <span class="font-medium text-gray-900">{{ cert.name }}</span>
              <span class="text-gray-600"> — {{ cert.issuer }}</span>
              <span class="text-xs text-gray-500 ml-2">{{ cert.issueDate }}</span>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section
          v-if="sectionId === 'languages' && hasContent('languages')"
          class="mb-8"
        >
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Languages
          </h2>
          <div class="flex flex-wrap gap-4 text-sm text-gray-700">
            <div
              v-for="lang in resume.languages"
              :key="lang.id"
            >
              <span class="font-medium">{{ lang.name }}</span>
              <span class="text-gray-500 ml-1">({{ lang.proficiency }})</span>
            </div>
          </div>
        </section>

        <!-- Links -->
        <section
          v-if="sectionId === 'links' && hasContent('links')"
          class="mb-8"
        >
          <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Links
          </h2>
          <div class="flex flex-wrap gap-4 text-sm">
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
