<script setup lang="ts">
import { useI18n } from '@/i18n'
import AppHeader from './AppHeader.vue'

const { t } = useI18n()

const currentYear = new Date().getFullYear()

const footerLinks = {
  product: [
    { to: '/resume', key: 'footer.resumeBuilder' },
    { to: '/ats-checker', key: 'nav.atsChecker' },
    { to: '/cover-letters', key: 'footer.coverLetters' },
  ],
  company: [
    { to: '/about', key: 'footer.about' },
    { to: '/contact', key: 'footer.contact' },
  ],
  legal: [
    { to: '/terms', key: 'footer.terms' },
    { to: '/privacy', key: 'footer.privacy' },
    { to: '/cookies', key: 'footer.cookies' },
  ],
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <AppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-base-200 border-t border-base-300">
      <!-- Main Footer Content -->
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="lg:col-span-1">
            <router-link
              to="/"
              class="flex items-center gap-2 mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ResumeApp
              </span>
            </router-link>
            <p class="text-base-content/70 text-sm mb-4 max-w-xs">
              {{ t('footer.description') }}
            </p>

            <!-- Social Links -->
            <div class="flex gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost btn-circle btn-sm hover:btn-primary hover:text-primary-content"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  class="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost btn-circle btn-sm hover:btn-primary hover:text-primary-content"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  class="fill-current"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost btn-circle btn-sm hover:btn-primary hover:text-primary-content"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  class="fill-current"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost btn-circle btn-sm hover:btn-primary hover:text-primary-content"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  class="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Product Links -->
          <div>
            <h3 class="font-semibold text-base-content mb-4">
              {{ t('footer.product') }}
            </h3>
            <ul class="space-y-2">
              <li
                v-for="link in footerLinks.product"
                :key="link.to"
              >
                <router-link
                  :to="link.to"
                  class="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  {{ t(link.key) }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Company Links -->
          <div>
            <h3 class="font-semibold text-base-content mb-4">
              {{ t('footer.company') }}
            </h3>
            <ul class="space-y-2">
              <li
                v-for="link in footerLinks.company"
                :key="link.to"
              >
                <router-link
                  :to="link.to"
                  class="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  {{ t(link.key) }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Legal Links -->
          <div>
            <h3 class="font-semibold text-base-content mb-4">
              {{ t('footer.legal') }}
            </h3>
            <ul class="space-y-2">
              <li
                v-for="link in footerLinks.legal"
                :key="link.to"
              >
                <router-link
                  :to="link.to"
                  class="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  {{ t(link.key) }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-base-300">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-base-content/60 text-sm">
              {{ t('footer.copyright').replace('{year}', String(currentYear)) }}
            </p>

            <div class="flex items-center gap-4">
              <!-- Made with love -->
              <span class="text-base-content/60 text-sm flex items-center gap-1">
                {{ t('footer.madeWith') }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-error"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ t('footer.madeWithSuffix') }}
              </span>

              <!-- Back to top button -->
              <button
                class="btn btn-ghost btn-sm btn-circle"
                aria-label="Back to top"
                @click="scrollToTop"
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
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
