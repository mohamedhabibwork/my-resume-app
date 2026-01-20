<script setup lang="ts">
import { useI18n } from '@/i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 Illustration -->
      <div class="text-9xl font-bold text-primary/20 mb-4">
        404
      </div>

      <h1 class="text-3xl font-bold mb-4">
        {{ t('notFound.title') }}
      </h1>
      <p class="text-base-content/70 mb-8 max-w-md mx-auto">
        {{ t('notFound.description') }}
      </p>

      <!-- Actions -->
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          class="btn btn-primary gap-2"
          @click="goHome"
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
          {{ t('notFound.goHome') }}
        </button>
        <button
          class="btn btn-ghost gap-2"
          @click="goBack"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {{ t('notFound.goBack') }}
        </button>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12">
        <p class="text-sm text-base-content/60 mb-4">
          {{ t('notFound.helpfulLinks') }}
        </p>
        <div class="flex flex-wrap gap-2 justify-center">
          <router-link
            to="/"
            class="btn btn-outline btn-sm"
          >
            {{ t('nav.home') }}
          </router-link>
          <router-link
            to="/dashboard"
            class="btn btn-outline btn-sm"
          >
            {{ t('nav.resume') }}
          </router-link>
          <router-link
            to="/about"
            class="btn btn-outline btn-sm"
          >
            {{ t('nav.about') }}
          </router-link>
          <router-link
            to="/contact"
            class="btn btn-outline btn-sm"
          >
            {{ t('nav.contact') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
