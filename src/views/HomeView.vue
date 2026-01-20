<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/i18n'

const router = useRouter()
const { t } = useI18n()
const { isAuthenticated } = useAuth()

const features = [
  {
    icon: '📄',
    titleKey: 'landing.features.templates.title',
    descKey: 'landing.features.templates.description',
    badge: '9+',
    badgeClass: 'badge-primary',
  },
  {
    icon: '🎯',
    titleKey: 'landing.features.ats.title',
    descKey: 'landing.features.ats.description',
    badge: 'AI',
    badgeClass: 'badge-success',
  },
  {
    icon: '🎨',
    titleKey: 'landing.features.customize.title',
    descKey: 'landing.features.customize.description',
    badge: '∞',
    badgeClass: 'badge-accent',
  },
  {
    icon: '📱',
    titleKey: 'landing.features.responsive.title',
    descKey: 'landing.features.responsive.description',
    badge: 'PWA',
    badgeClass: 'badge-info',
  },
  {
    icon: '🌍',
    titleKey: 'landing.features.multilingual.title',
    descKey: 'landing.features.multilingual.description',
    badge: 'i18n',
    badgeClass: 'badge-secondary',
  },
  {
    icon: '☁️',
    titleKey: 'landing.features.cloud.title',
    descKey: 'landing.features.cloud.description',
    badge: 'Sync',
    badgeClass: 'badge-warning',
  },
]

const stats = [
  { value: '10K+', label: 'landing.stats.users' },
  { value: '50K+', label: 'landing.stats.resumes' },
  { value: '95%', label: 'landing.stats.satisfaction' },
  { value: '24/7', label: 'landing.stats.support' },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    avatar: 'SJ',
    text: 'landing.testimonials.sarah',
    rating: 5,
  },
  {
    name: 'Ahmed Hassan',
    role: 'Product Manager',
    avatar: 'AH',
    text: 'landing.testimonials.ahmed',
    rating: 5,
  },
  {
    name: 'Maria Garcia',
    role: 'UX Designer',
    avatar: 'MG',
    text: 'landing.testimonials.maria',
    rating: 5,
  },
]

const steps = [
  { number: '1', titleKey: 'landing.howItWorks.step1.title', descKey: 'landing.howItWorks.step1.description' },
  { number: '2', titleKey: 'landing.howItWorks.step2.title', descKey: 'landing.howItWorks.step2.description' },
  { number: '3', titleKey: 'landing.howItWorks.step3.title', descKey: 'landing.howItWorks.step3.description' },
  { number: '4', titleKey: 'landing.howItWorks.step4.title', descKey: 'landing.howItWorks.step4.description' },
]
</script>

<template>
  <div class="bg-base-100">
    <!-- Hero Section -->
    <section class="hero min-h-[85vh] bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div class="hero-content text-center relative z-10">
        <div class="max-w-4xl">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {{ t('landing.hero.badge') }}
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {{ t('landing.hero.title') }}
            <span class="text-primary block sm:inline">{{ t('landing.hero.titleHighlight') }}</span>
          </h1>

          <!-- Subheading -->
          <p class="text-lg sm:text-xl text-base-content/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ t('landing.hero.subtitle') }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              v-if="!isAuthenticated"
              class="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-shadow"
              @click="router.push('/signup')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {{ t('landing.hero.cta') }}
            </button>
            <button
              v-else
              class="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-shadow"
              @click="router.push('/dashboard')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {{ t('nav.home') }}
            </button>

            <button
              class="btn btn-outline btn-lg gap-2"
              @click="router.push('/ats-checker')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ t('landing.hero.tryAts') }}
            </button>
          </div>

          <!-- Trust Indicators -->
          <div class="flex flex-wrap justify-center items-center gap-6 text-base-content/50 text-sm">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ t('landing.hero.trust1') }}
            </div>
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ t('landing.hero.trust2') }}
            </div>
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ t('landing.hero.trust3') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-base-content/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="stats stats-vertical sm:stats-horizontal shadow w-full">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat place-items-center"
          >
            <div class="stat-value text-primary">
              {{ stat.value }}
            </div>
            <div class="stat-desc">
              {{ t(stat.label) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <div class="badge badge-primary badge-outline mb-4">
            {{ t('landing.features.badge') }}
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            {{ t('landing.features.title') }}
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {{ t('landing.features.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.titleKey"
            class="card bg-base-100 card-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div class="card-body">
              <div class="flex items-start justify-between">
                <div class="text-4xl">
                  {{ feature.icon }}
                </div>
                <div :class="['badge', feature.badgeClass]">
                  {{ feature.badge }}
                </div>
              </div>
              <h3 class="card-title mt-4">
                {{ t(feature.titleKey) }}
              </h3>
              <p class="text-base-content/70">
                {{ t(feature.descKey) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <div class="badge badge-secondary badge-outline mb-4">
            {{ t('landing.howItWorks.badge') }}
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            {{ t('landing.howItWorks.title') }}
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {{ t('landing.howItWorks.subtitle') }}
          </p>
        </div>

        <div class="flex flex-col lg:flex-row justify-center items-start gap-4 max-w-5xl mx-auto">
          <div
            v-for="(step, index) in steps"
            :key="step.titleKey"
            class="flex flex-col items-center text-center flex-1"
          >
            <!-- Step Circle -->
            <div class="relative">
              <div class="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold shadow-lg">
                {{ step.number }}
              </div>
              <!-- Connector line (hidden on mobile and last item) -->
              <div
                v-if="index < steps.length - 1"
                class="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-primary/30 -translate-y-1/2"
                style="width: calc(100% - 1rem)"
              />
            </div>

            <div class="mt-6 px-4">
              <h3 class="font-bold text-lg mb-2">
                {{ t(step.titleKey) }}
              </h3>
              <p class="text-base-content/70 text-sm">
                {{ t(step.descKey) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates Preview Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <div class="badge badge-accent badge-outline mb-4">
            {{ t('landing.templates.badge') }}
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            {{ t('landing.templates.title') }}
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {{ t('landing.templates.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer group">
            <div class="text-center">
              <div class="text-4xl mb-2">
                📄
              </div>
              <span class="font-medium">{{ t('landing.templates.modern') }}</span>
              <div class="badge badge-primary badge-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {{ t('common.popular') }}
              </div>
            </div>
          </div>
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-2">
                📋
              </div>
              <span class="font-medium">{{ t('landing.templates.classic') }}</span>
            </div>
          </div>
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-2">
                🎨
              </div>
              <span class="font-medium">{{ t('landing.templates.creative') }}</span>
            </div>
          </div>
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-2">
                💼
              </div>
              <span class="font-medium">{{ t('landing.templates.professional') }}</span>
            </div>
          </div>
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-2">
                ⚡
              </div>
              <span class="font-medium">{{ t('landing.templates.minimal') }}</span>
            </div>
          </div>
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-2">
                👔
              </div>
              <span class="font-medium">{{ t('landing.templates.executive') }}</span>
            </div>
          </div>
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-2">
                💻
              </div>
              <span class="font-medium">{{ t('landing.templates.tech') }}</span>
            </div>
          </div>
          <div class="card bg-base-200 aspect-[3/4] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-2">
                📊
              </div>
              <span class="font-medium">{{ t('landing.templates.twoColumn') }}</span>
            </div>
          </div>
        </div>

        <div class="text-center mt-8">
          <button
            class="btn btn-primary"
            @click="router.push(isAuthenticated ? '/resume' : '/signup')"
          >
            {{ t('landing.templates.viewAll') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <div class="badge badge-info badge-outline mb-4">
            {{ t('landing.testimonials.badge') }}
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            {{ t('landing.testimonials.title') }}
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {{ t('landing.testimonials.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="card bg-base-100 card-border"
          >
            <div class="card-body">
              <!-- Rating -->
              <div class="flex gap-1 mb-4">
                <svg
                  v-for="i in testimonial.rating"
                  :key="i"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-warning fill-warning"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <!-- Quote -->
              <p class="text-base-content/80 italic mb-6">
                "{{ t(testimonial.text) }}"
              </p>

              <!-- Author -->
              <div class="flex items-center gap-3">
                <div class="avatar placeholder">
                  <div class="bg-primary text-primary-content w-12 rounded-full">
                    <span>{{ testimonial.avatar }}</span>
                  </div>
                </div>
                <div>
                  <p class="font-semibold">
                    {{ testimonial.name }}
                  </p>
                  <p class="text-sm text-base-content/60">
                    {{ testimonial.role }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ATS Checker Promo Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="card bg-gradient-to-r from-primary to-secondary text-primary-content overflow-hidden">
          <div class="card-body p-8 md:p-12 relative">
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-10">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      fill="currentColor"
                      cx="2"
                      cy="2"
                      r="1"
                    />
                  </pattern>
                </defs>
                <rect
                  fill="url(#dots)"
                  width="100%"
                  height="100%"
                />
              </svg>
            </div>

            <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div class="flex-1 text-center md:text-start">
                <div class="badge badge-ghost mb-4">
                  {{ t('landing.atsPromo.badge') }}
                </div>
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">
                  {{ t('landing.atsPromo.title') }}
                </h2>
                <p class="mb-6 opacity-90 max-w-lg">
                  {{ t('landing.atsPromo.description') }}
                </p>
                <button
                  class="btn btn-secondary btn-lg gap-2"
                  @click="router.push('/ats-checker')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ t('landing.atsPromo.cta') }}
                </button>
              </div>

              <div class="flex-shrink-0">
                <div
                  class="radial-progress text-secondary-content bg-secondary"
                  style="--value:85; --size:10rem; --thickness:1rem;"
                  role="progressbar"
                >
                  <span class="text-3xl font-bold">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          {{ t('landing.cta.title') }}
        </h2>
        <p class="text-base-content/70 max-w-2xl mx-auto mb-8">
          {{ t('landing.cta.subtitle') }}
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button
            v-if="!isAuthenticated"
            class="btn btn-primary btn-lg gap-2"
            @click="router.push('/signup')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            {{ t('landing.cta.primary') }}
          </button>
          <button
            v-else
            class="btn btn-primary btn-lg gap-2"
            @click="router.push('/resume')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {{ t('landing.cta.createResume') }}
          </button>

          <button
            v-if="!isAuthenticated"
            class="btn btn-outline btn-lg"
            @click="router.push('/login')"
          >
            {{ t('nav.login') }}
          </button>
        </div>

        <p class="text-sm text-base-content/50 mt-6">
          {{ t('landing.cta.note') }}
        </p>
      </div>
    </section>
  </div>
</template>
