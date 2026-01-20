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
    fontFamily: font?.family || 'Roboto Mono, monospace',
    fontSize: `${font?.size || 12}px`,
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
</script>

<template>
  <BaseTemplate :resume="resume">
    <div
      :style="style"
      class="p-8 md:p-10 max-w-4xl mx-auto min-h-full"
    >
      <!-- Tech Header -->
      <header
        class="mb-8 border-l-4 pl-4"
        :style="{ borderColor: resume.theme?.primary || '#00d4ff' }"
      >
        <h1
          class="text-3xl md:text-4xl font-bold mb-2 font-mono"
          :style="{ color: resume.theme?.primary || '#00d4ff' }"
        >
          {{ resume.personalInfo.firstName }} {{ resume.personalInfo.lastName }}
        </h1>
        <div class="flex flex-wrap gap-3 text-xs font-mono text-gray-600">
          <template
            v-for="(info, index) in contactInfo"
            :key="index"
          >
            <span>{{ info }}</span>
            <span
              v-if="index < contactInfo.length - 1"
              class="text-gray-400"
            >//</span>
          </template>
        </div>
        <div
          v-if="resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website"
          class="mt-3 flex gap-4 text-xs font-mono"
        >
          <a
            v-if="resume.personalInfo.github"
            :href="resume.personalInfo.github"
            target="_blank"
            class="text-blue-600 hover:underline"
          >github.com</a>
          <a
            v-if="resume.personalInfo.linkedin"
            :href="resume.personalInfo.linkedin"
            target="_blank"
            class="text-blue-600 hover:underline"
          >linkedin.com</a>
          <a
            v-if="resume.personalInfo.website"
            :href="resume.personalInfo.website"
            target="_blank"
            class="text-blue-600 hover:underline"
          >portfolio</a>
        </div>
      </header>

      <!-- Summary -->
      <section
        v-if="resume.personalInfo.summary"
        class="mb-8 p-4 bg-gray-50 rounded border-l-4"
        :style="{ borderColor: resume.theme?.accent || '#00d4ff' }"
      >
        <h2
          class="text-xs font-bold uppercase tracking-widest mb-2 font-mono"
          :style="{ color: resume.theme?.primary || '#00d4ff' }"
        >
          // Summary
        </h2>
        <p class="text-gray-800 leading-relaxed whitespace-pre-line">
          {{ resume.personalInfo.summary }}
        </p>
      </section>

      <!-- Skills - Tech Stack -->
      <section
        v-if="resume.skills.filter(s => !s.isHidden).length > 0"
        class="mb-8"
      >
        <h2
          class="text-xs font-bold uppercase tracking-widest mb-4 font-mono border-b-2 pb-2"
          :style="{ borderColor: resume.theme?.primary || '#00d4ff', color: resume.theme?.primary || '#00d4ff' }"
        >
          // Tech Stack
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="skill in resume.skills.filter(s => !s.isHidden)"
            :key="skill.id"
            class="p-2 border rounded text-xs font-mono text-center"
            :style="{ borderColor: resume.theme?.accent || '#00d4ff', color: resume.theme?.text || '#1a1a1a' }"
          >
            {{ skill.name }}
          </div>
        </div>
      </section>

      <!-- Experience -->
      <section
        v-if="resume.workExperience.length > 0"
        class="mb-8"
      >
        <h2
          class="text-xs font-bold uppercase tracking-widest mb-4 font-mono border-b-2 pb-2"
          :style="{ borderColor: resume.theme?.primary || '#00d4ff', color: resume.theme?.primary || '#00d4ff' }"
        >
          // Experience
        </h2>
        <div
          v-for="exp in resume.workExperience"
          :key="exp.id"
          class="mb-6 last:mb-0 pl-4 border-l-2"
          :style="{ borderColor: resume.theme?.accent || '#00d4ff' }"
        >
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <div class="flex-1">
              <h3 class="text-lg font-bold font-mono text-gray-900">
                {{ exp.position }}
              </h3>
              <p class="text-sm text-gray-700 font-mono">
                {{ exp.company }}<span v-if="exp.location">, {{ exp.location }}</span>
              </p>
            </div>
            <span class="text-xs text-gray-500 font-mono whitespace-nowrap mt-1 md:mt-0">
              {{ exp.startDate }} - {{ exp.current ? 'Present' : (exp.endDate || 'Present') }}
            </span>
          </div>
          <p
            v-if="exp.description"
            class="text-sm text-gray-700 mb-2 leading-relaxed whitespace-pre-line"
          >
            {{ exp.description }}
          </p>
          <ul
            v-if="exp.highlights && exp.highlights.length > 0"
            class="list-none space-y-1 ml-2"
          >
            <li
              v-for="(highlight, idx) in exp.highlights.filter(Boolean)"
              :key="idx"
              class="text-sm text-gray-700 flex items-start"
            >
              <span
                class="mr-2 font-mono"
                :style="{ color: resume.theme?.primary || '#00d4ff' }"
              >></span>
              <span>{{ highlight }}</span>
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
          class="text-xs font-bold uppercase tracking-widest mb-4 font-mono border-b-2 pb-2"
          :style="{ borderColor: resume.theme?.primary || '#00d4ff', color: resume.theme?.primary || '#00d4ff' }"
        >
          // Projects
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="project in resume.projects"
            :key="project.id"
            class="p-4 border rounded"
            :style="{ borderColor: resume.theme?.accent || '#00d4ff' }"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold font-mono text-gray-900">
                {{ project.name }}
              </h3>
              <span
                v-if="project.startDate || project.endDate"
                class="text-xs text-gray-500 font-mono whitespace-nowrap"
              >
                {{ project.startDate }} - {{ project.endDate || 'Present' }}
              </span>
            </div>
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
                class="text-xs px-2 py-1 rounded font-mono"
                :style="{ backgroundColor: resume.theme?.accent || '#e0f7fa', color: resume.theme?.text || '#1a1a1a' }"
              >
                {{ tech }}
              </span>
            </div>
            <div class="flex gap-3 text-xs font-mono">
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="text-blue-600 hover:underline"
              >view()</a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                class="text-blue-600 hover:underline"
              >github()</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section
        v-if="resume.education.length > 0"
        class="mb-8"
      >
        <h2
          class="text-xs font-bold uppercase tracking-widest mb-4 font-mono border-b-2 pb-2"
          :style="{ borderColor: resume.theme?.primary || '#00d4ff', color: resume.theme?.primary || '#00d4ff' }"
        >
          // Education
        </h2>
        <div
          v-for="edu in resume.education"
          :key="edu.id"
          class="mb-4 last:mb-0 pl-4 border-l-2"
          :style="{ borderColor: resume.theme?.accent || '#00d4ff' }"
        >
          <div class="flex flex-col md:flex-row md:justify-between md:items-start">
            <div class="flex-1">
              <h3 class="font-bold font-mono text-gray-900">
                {{ edu.degree }}<span v-if="edu.field"> in {{ edu.field }}</span>
              </h3>
              <p class="text-sm text-gray-700 font-mono">
                {{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span>
              </p>
              <p
                v-if="edu.gpa"
                class="text-xs text-gray-600 mt-1 font-mono"
              >
                GPA: {{ edu.gpa }}
              </p>
            </div>
            <span class="text-xs text-gray-500 font-mono whitespace-nowrap mt-1 md:mt-0">
              {{ edu.startDate }} - {{ edu.current ? 'Present' : (edu.endDate || 'Present') }}
            </span>
          </div>
        </div>
      </section>

      <!-- Certifications & Languages -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Certifications -->
        <section v-if="resume.certifications.length > 0">
          <h2
            class="text-xs font-bold uppercase tracking-widest mb-4 font-mono border-b-2 pb-2"
            :style="{ borderColor: resume.theme?.primary || '#00d4ff', color: resume.theme?.primary || '#00d4ff' }"
          >
            // Certifications
          </h2>
          <div class="space-y-3">
            <div
              v-for="cert in resume.certifications"
              :key="cert.id"
              class="text-sm"
            >
              <p class="font-bold font-mono text-gray-900">
                {{ cert.name }}
              </p>
              <p class="text-xs text-gray-600 font-mono">
                {{ cert.issuer }}
              </p>
              <p class="text-xs text-gray-500 font-mono mt-1">
                {{ cert.issueDate }}
              </p>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section v-if="resume.languages.length > 0">
          <h2
            class="text-xs font-bold uppercase tracking-widest mb-4 font-mono border-b-2 pb-2"
            :style="{ borderColor: resume.theme?.primary || '#00d4ff', color: resume.theme?.primary || '#00d4ff' }"
          >
            // Languages
          </h2>
          <div class="space-y-2">
            <div
              v-for="lang in resume.languages"
              :key="lang.id"
              class="flex justify-between items-center text-sm font-mono"
            >
              <span class="text-gray-900">{{ lang.name }}</span>
              <span class="text-gray-600">{{ lang.proficiency }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </BaseTemplate>
</template>
