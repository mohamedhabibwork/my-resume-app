<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()

const features = [
  { icon: 'templates', key: 'multipleTemplates' },
  { icon: 'ats', key: 'atsOptimization' },
  { icon: 'preview', key: 'livePreview' },
  { icon: 'export', key: 'exportOptions' },
  { icon: 'share', key: 'publicSharing' },
  { icon: 'cover', key: 'coverLetter' },
  { icon: 'theme', key: 'customization' },
  { icon: 'drag', key: 'dragDrop' },
  { icon: 'i18n', key: 'multilingual' },
  { icon: 'offline', key: 'offlineSupport' },
]

const techStack = [
  { name: 'Vue 3', description: 'Progressive JavaScript Framework', color: 'badge-success' },
  { name: 'TypeScript', description: 'Type-safe JavaScript', color: 'badge-info' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS', color: 'badge-primary' },
  { name: 'daisyUI', description: 'Component Library', color: 'badge-secondary' },
  { name: 'Firebase', description: 'Backend & Auth', color: 'badge-warning' },
  { name: 'Cloudflare', description: 'Edge Deployment', color: 'badge-error' },
  { name: 'Pinia', description: 'State Management', color: 'badge-accent' },
  { name: 'Vite', description: 'Build Tool', color: 'badge-neutral' },
]

const stats = [
  { value: '7+', labelKey: 'templates' },
  { value: '100%', labelKey: 'free' },
  { value: '2', labelKey: 'languages' },
  { value: '∞', labelKey: 'resumes' },
]

const team = [
  {
    name: 'Mohamed Habib',
    role: 'Founder & Lead Developer',
    avatar: 'MH',
    links: {
      github: 'https://github.com/mohamedhabibwork',
      linkedin: 'https://linkedin.com/in/mohamedhabibwork',
    },
  },
]
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-20">
      <div class="hero-content text-center">
        <div class="max-w-3xl">
          <h1 class="text-5xl font-bold mb-6">
            {{ t('about.hero.title') }}
          </h1>
          <p class="text-xl text-base-content/70 mb-8">
            {{ t('about.hero.subtitle') }}
          </p>
          <div class="flex justify-center gap-4 flex-wrap">
            <router-link
              to="/signup"
              class="btn btn-primary btn-lg"
            >
              {{ t('about.hero.getStarted') }}
            </router-link>
            <router-link
              to="/contact"
              class="btn btn-outline btn-lg"
            >
              {{ t('nav.contact') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="stats stats-vertical lg:stats-horizontal shadow-lg w-full">
          <div
            v-for="stat in stats"
            :key="stat.labelKey"
            class="stat place-items-center"
          >
            <div class="stat-value text-primary">
              {{ stat.value }}
            </div>
            <div class="stat-desc text-lg">
              {{ t(`about.stats.${stat.labelKey}`) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 bg-base-200">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-3xl mb-4 justify-center">
              {{ t('about.mission.title') }}
            </h2>
            <p class="text-center text-base-content/80 text-lg">
              {{ t('about.mission.content') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-base-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">
          {{ t('about.features.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="feature.key"
            class="card bg-base-200 hover:bg-base-300 transition-colors"
          >
            <div class="card-body items-center text-center p-6">
              <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span class="text-2xl font-bold text-primary">{{ index + 1 }}</span>
              </div>
              <h3 class="card-title text-lg">
                {{ t(`about.features.items.${feature.key}.title`) }}
              </h3>
              <p class="text-sm text-base-content/70">
                {{ t(`about.features.items.${feature.key}.description`) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 bg-base-200">
      <div class="container mx-auto px-4 max-w-5xl">
        <h2 class="text-3xl font-bold text-center mb-12">
          {{ t('about.howItWorks.title') }}
        </h2>
        <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          <li>
            <div class="timeline-middle">
              <div class="badge badge-primary badge-lg">
                1
              </div>
            </div>
            <div class="timeline-start mb-10 md:text-end">
              <div class="text-lg font-bold">
                {{ t('about.howItWorks.step1.title') }}
              </div>
              <p class="text-base-content/70">
                {{ t('about.howItWorks.step1.description') }}
              </p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div class="timeline-middle">
              <div class="badge badge-primary badge-lg">
                2
              </div>
            </div>
            <div class="timeline-end mb-10">
              <div class="text-lg font-bold">
                {{ t('about.howItWorks.step2.title') }}
              </div>
              <p class="text-base-content/70">
                {{ t('about.howItWorks.step2.description') }}
              </p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div class="timeline-middle">
              <div class="badge badge-primary badge-lg">
                3
              </div>
            </div>
            <div class="timeline-start mb-10 md:text-end">
              <div class="text-lg font-bold">
                {{ t('about.howItWorks.step3.title') }}
              </div>
              <p class="text-base-content/70">
                {{ t('about.howItWorks.step3.description') }}
              </p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div class="timeline-middle">
              <div class="badge badge-primary badge-lg">
                4
              </div>
            </div>
            <div class="timeline-end mb-10">
              <div class="text-lg font-bold">
                {{ t('about.howItWorks.step4.title') }}
              </div>
              <p class="text-base-content/70">
                {{ t('about.howItWorks.step4.description') }}
              </p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div class="timeline-middle">
              <div class="badge badge-success badge-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div class="timeline-start mb-10 md:text-end">
              <div class="text-lg font-bold text-success">
                {{ t('about.howItWorks.step5.title') }}
              </div>
              <p class="text-base-content/70">
                {{ t('about.howItWorks.step5.description') }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="py-16 bg-base-100">
      <div class="container mx-auto px-4 max-w-4xl">
        <h2 class="text-3xl font-bold text-center mb-4">
          {{ t('about.techStack.title') }}
        </h2>
        <p class="text-center text-base-content/70 mb-12">
          {{ t('about.techStack.subtitle') }}
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="card bg-base-200 hover:shadow-lg transition-shadow"
          >
            <div class="card-body items-center text-center p-4">
              <div
                class="badge badge-lg"
                :class="tech.color"
              >
                {{ tech.name }}
              </div>
              <p class="text-sm text-base-content/60 mt-2">
                {{ tech.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-16 bg-base-200">
      <div class="container mx-auto px-4 max-w-4xl">
        <h2 class="text-3xl font-bold text-center mb-4">
          {{ t('about.team.title') }}
        </h2>
        <p class="text-center text-base-content/70 mb-12">
          {{ t('about.team.subtitle') }}
        </p>
        <div class="flex justify-center">
          <div
            v-for="member in team"
            :key="member.name"
            class="card bg-base-100 shadow-xl w-full max-w-md"
          >
            <div class="card-body items-center text-center">
              <div class="avatar placeholder mb-4">
                <div class="bg-primary text-primary-content rounded-full w-24 h-24">
                  <span class="text-3xl">{{ member.avatar }}</span>
                </div>
              </div>
              <h3 class="card-title">
                {{ member.name }}
              </h3>
              <p class="text-base-content/70">
                {{ member.role }}
              </p>
              <div class="card-actions mt-4">
                <a
                  v-if="member.links.github"
                  :href="member.links.github"
                  target="_blank"
                  class="btn btn-ghost btn-circle"
                  aria-label="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  v-if="member.links.linkedin"
                  :href="member.links.linkedin"
                  target="_blank"
                  class="btn btn-ghost btn-circle"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-4">
          {{ t('about.cta.title') }}
        </h2>
        <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          {{ t('about.cta.subtitle') }}
        </p>
        <div class="flex justify-center gap-4 flex-wrap">
          <router-link
            to="/signup"
            class="btn btn-lg bg-white text-primary hover:bg-base-100"
          >
            {{ t('about.cta.createResume') }}
          </router-link>
          <router-link
            to="/ats-checker"
            class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary"
          >
            {{ t('about.cta.checkATS') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="py-12 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-4">
          <router-link
            to="/terms"
            class="btn btn-outline btn-sm"
          >
            {{ t('footer.terms') }}
          </router-link>
          <router-link
            to="/privacy"
            class="btn btn-outline btn-sm"
          >
            {{ t('footer.privacy') }}
          </router-link>
          <router-link
            to="/cookies"
            class="btn btn-outline btn-sm"
          >
            {{ t('footer.cookies') }}
          </router-link>
          <router-link
            to="/contact"
            class="btn btn-outline btn-sm"
          >
            {{ t('nav.contact') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
