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
    fontFamily: font?.family || 'Times New Roman, serif',
    fontSize: `${font?.size || 12}px`,
    fontWeight: font?.weight || 'normal',
    lineHeight: font?.lineHeight || 1.6,
    color: theme?.text || '#000000',
    backgroundColor: theme?.background || '#ffffff',
  }
})

// Default section order
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

const orderedSections = computed(() => {
  const sectionOrder = props.resume.sectionOrder && props.resume.sectionOrder.length > 0
    ? props.resume.sectionOrder
    : defaultSectionOrder

  return [...sectionOrder].sort((a, b) => a.order - b.order).map(s => s.id)
})

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
      class="p-8 max-w-4xl mx-auto"
    >
      <!-- Header -->
      <header class="text-center mb-8 border-b-2 pb-4">
        <h1 class="text-4xl font-bold mb-2">
          {{ resume.personalInfo.firstName }} {{ resume.personalInfo.lastName }}
        </h1>
        <div class="text-sm">
          <span v-if="resume.personalInfo.email">{{ resume.personalInfo.email }}</span>
          <span v-if="resume.personalInfo.phone"> | {{ resume.personalInfo.phone }}</span>
          <span v-if="resume.personalInfo.location"> | {{ resume.personalInfo.location }}</span>
        </div>
        <div
          v-if="resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website"
          class="text-sm mt-1"
        >
          <span v-if="resume.personalInfo.linkedin">{{ resume.personalInfo.linkedin }}</span>
          <span v-if="resume.personalInfo.github"> | {{ resume.personalInfo.github }}</span>
          <span v-if="resume.personalInfo.website"> | {{ resume.personalInfo.website }}</span>
        </div>
      </header>

      <!-- Dynamic Sections -->
      <template
        v-for="sectionId in orderedSections"
        :key="sectionId"
      >
        <!-- Summary -->
        <section
          v-if="sectionId === 'personal' && hasContent('personal')"
          class="mb-6"
        >
          <h2 class="text-xl font-bold mb-2 uppercase border-b pb-1">
            Professional Summary
          </h2>
          <p class="text-justify whitespace-pre-line">
            {{ resume.personalInfo.summary }}
          </p>
        </section>

        <!-- Work Experience -->
        <section
          v-if="sectionId === 'experience' && hasContent('experience')"
          class="mb-6"
        >
          <h2 class="text-xl font-bold mb-4 uppercase border-b pb-1">
            Professional Experience
          </h2>
          <div
            v-for="exp in resume.workExperience"
            :key="exp.id"
            class="mb-4"
          >
            <div class="flex justify-between items-center mb-1">
              <h3 class="font-bold">
                {{ exp.position }} - {{ exp.company }}
              </h3>
              <span class="text-sm italic">
                {{ exp.startDate }} - {{ exp.current ? 'Present' : exp.endDate }}
              </span>
            </div>
            <p
              v-if="exp.location"
              class="text-sm italic mb-1"
            >
              {{ exp.location }}
            </p>
            <p
              v-if="exp.description"
              class="mb-2 whitespace-pre-line"
            >
              {{ exp.description }}
            </p>
            <ul
              v-if="exp.highlights && exp.highlights.filter(Boolean).length > 0"
              class="list-disc list-inside ml-4"
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
          <h2 class="text-xl font-bold mb-4 uppercase border-b pb-1">
            Education
          </h2>
          <div
            v-for="edu in resume.education"
            :key="edu.id"
            class="mb-4"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-bold">
                  {{ edu.degree }}<span v-if="edu.field"> in {{ edu.field }}</span>
                </h3>
                <p>{{ edu.institution }}<span v-if="edu.location">, {{ edu.location }}</span></p>
                <p
                  v-if="edu.gpa"
                  class="text-sm"
                >
                  GPA: {{ edu.gpa }}
                </p>
              </div>
              <span class="text-sm italic">
                {{ edu.startDate }} - {{ edu.current ? 'Present' : edu.endDate }}
              </span>
            </div>
            <ul
              v-if="edu.highlights && edu.highlights.filter(Boolean).length > 0"
              class="list-disc list-inside ml-4 mt-2"
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
          <h2 class="text-xl font-bold mb-4 uppercase border-b pb-1">
            Skills
          </h2>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="skill in resume.skills.filter(s => !s.isHidden)"
              :key="skill.id"
              class="text-sm"
            >
              • {{ skill.name }}
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section
          v-if="sectionId === 'projects' && hasContent('projects')"
          class="mb-6"
        >
          <h2 class="text-xl font-bold mb-4 uppercase border-b pb-1">
            Projects
          </h2>
          <div
            v-for="project in resume.projects"
            :key="project.id"
            class="mb-4"
          >
            <div class="flex justify-between items-center mb-1">
              <h3 class="font-bold">
                {{ project.name }}
              </h3>
              <span
                v-if="project.startDate"
                class="text-sm italic"
              >
                {{ project.startDate }} - {{ project.endDate || 'Present' }}
              </span>
            </div>
            <p
              v-if="project.description"
              class="mb-2 whitespace-pre-line"
            >
              {{ project.description }}
            </p>
            <div
              v-if="project.technologies && project.technologies.length > 0"
              class="text-sm mb-1"
            >
              <strong>Technologies:</strong> {{ project.technologies.filter(Boolean).join(', ') }}
            </div>
            <div
              v-if="project.url || project.githubUrl"
              class="text-sm"
            >
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="underline mr-4"
              >View Project</a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                class="underline"
              >GitHub</a>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section
          v-if="sectionId === 'certifications' && hasContent('certifications')"
          class="mb-6"
        >
          <h2 class="text-xl font-bold mb-4 uppercase border-b pb-1">
            Certifications
          </h2>
          <div
            v-for="cert in resume.certifications"
            :key="cert.id"
            class="mb-3"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-bold">
                  {{ cert.name }}
                </h3>
                <p class="text-sm">
                  {{ cert.issuer }}
                </p>
              </div>
              <span class="text-sm italic">{{ cert.issueDate }}</span>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section
          v-if="sectionId === 'languages' && hasContent('languages')"
          class="mb-6"
        >
          <h2 class="text-xl font-bold mb-4 uppercase border-b pb-1">
            Languages
          </h2>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="lang in resume.languages"
              :key="lang.id"
              class="text-sm"
            >
              • {{ lang.name }} ({{ lang.proficiency }})
            </div>
          </div>
        </section>

        <!-- Links -->
        <section
          v-if="sectionId === 'links' && hasContent('links')"
          class="mb-6"
        >
          <h2 class="text-xl font-bold mb-4 uppercase border-b pb-1">
            Links
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <a
              v-for="link in resume.links"
              :key="link.id"
              :href="link.url"
              target="_blank"
              class="text-sm underline"
            >
              {{ link.label || link.url }}
            </a>
          </div>
        </section>
      </template>
    </div>
  </BaseTemplate>
</template>
