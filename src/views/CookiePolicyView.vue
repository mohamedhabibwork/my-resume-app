<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const { success } = useToast()

const lastUpdated = '2026-01-15'

// Cookie preferences
const cookiePreferences = ref({
  essential: true, // Always enabled
  analytics: true,
  marketing: false,
  preferences: true,
})

function savePreferences() {
  // In production, this would save to localStorage and update cookie consent
  localStorage.setItem('cookie-preferences', JSON.stringify(cookiePreferences.value))
  success(t('cookies.preferencesSaved'))
}

function acceptAll() {
  cookiePreferences.value = {
    essential: true,
    analytics: true,
    marketing: true,
    preferences: true,
  }
  savePreferences()
}

function rejectNonEssential() {
  cookiePreferences.value = {
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  }
  savePreferences()
}
</script>

<template>
  <div class="py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">
          {{ t('cookies.title') }}
        </h1>
        <p class="text-base-content/70">
          {{ t('terms.lastUpdated') }}: {{ lastUpdated }}
        </p>
      </div>

      <!-- Cookie Preferences Card -->
      <div class="card bg-primary text-primary-content mb-8">
        <div class="card-body">
          <h2 class="card-title">
            {{ t('cookies.managePreferences') }}
          </h2>
          <p class="text-sm opacity-90">
            {{ t('cookies.preferencesDescription') }}
          </p>
          <div class="card-actions justify-end mt-4">
            <button
              class="btn btn-ghost btn-sm"
              @click="rejectNonEssential"
            >
              {{ t('cookies.rejectNonEssential') }}
            </button>
            <button
              class="btn btn-secondary btn-sm"
              @click="acceptAll"
            >
              {{ t('cookies.acceptAll') }}
            </button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 card-border">
        <div class="card-body prose max-w-none">
          <!-- What Are Cookies -->
          <section>
            <h2>{{ t('cookies.sections.whatAreCookies.title') }}</h2>
            <p>{{ t('cookies.sections.whatAreCookies.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Cookie Types -->
          <section>
            <h2>{{ t('cookies.sections.types.title') }}</h2>

            <!-- Essential Cookies -->
            <div class="card bg-base-200 mb-4">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="card-title text-base m-0">
                      {{ t('cookies.types.essential.title') }}
                    </h3>
                    <p class="text-sm opacity-70 mt-1">
                      {{ t('cookies.types.essential.description') }}
                    </p>
                  </div>
                  <input
                    v-model="cookiePreferences.essential"
                    type="checkbox"
                    class="toggle toggle-primary"
                    disabled
                  />
                </div>
                <div class="text-xs mt-2">
                  <span class="badge badge-ghost">{{ t('cookies.alwaysActive') }}</span>
                </div>
              </div>
            </div>

            <!-- Analytics Cookies -->
            <div class="card bg-base-200 mb-4">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="card-title text-base m-0">
                      {{ t('cookies.types.analytics.title') }}
                    </h3>
                    <p class="text-sm opacity-70 mt-1">
                      {{ t('cookies.types.analytics.description') }}
                    </p>
                  </div>
                  <input
                    v-model="cookiePreferences.analytics"
                    type="checkbox"
                    class="toggle toggle-primary"
                  />
                </div>
                <ul class="text-xs mt-2 space-y-1">
                  <li>• Google Analytics</li>
                  <li>• Firebase Analytics</li>
                </ul>
              </div>
            </div>

            <!-- Marketing Cookies -->
            <div class="card bg-base-200 mb-4">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="card-title text-base m-0">
                      {{ t('cookies.types.marketing.title') }}
                    </h3>
                    <p class="text-sm opacity-70 mt-1">
                      {{ t('cookies.types.marketing.description') }}
                    </p>
                  </div>
                  <input
                    v-model="cookiePreferences.marketing"
                    type="checkbox"
                    class="toggle toggle-primary"
                  />
                </div>
              </div>
            </div>

            <!-- Preference Cookies -->
            <div class="card bg-base-200 mb-4">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="card-title text-base m-0">
                      {{ t('cookies.types.preferences.title') }}
                    </h3>
                    <p class="text-sm opacity-70 mt-1">
                      {{ t('cookies.types.preferences.description') }}
                    </p>
                  </div>
                  <input
                    v-model="cookiePreferences.preferences"
                    type="checkbox"
                    class="toggle toggle-primary"
                  />
                </div>
              </div>
            </div>

            <button
              class="btn btn-primary btn-block"
              @click="savePreferences"
            >
              {{ t('cookies.savePreferences') }}
            </button>
          </section>

          <div class="divider" />

          <!-- How We Use Cookies -->
          <section>
            <h2>{{ t('cookies.sections.howWeUse.title') }}</h2>
            <ul>
              <li>{{ t('cookies.sections.howWeUse.item1') }}</li>
              <li>{{ t('cookies.sections.howWeUse.item2') }}</li>
              <li>{{ t('cookies.sections.howWeUse.item3') }}</li>
              <li>{{ t('cookies.sections.howWeUse.item4') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- Third-Party Cookies -->
          <section>
            <h2>{{ t('cookies.sections.thirdParty.title') }}</h2>
            <p>{{ t('cookies.sections.thirdParty.content') }}</p>
            <div class="overflow-x-auto mt-4">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>{{ t('cookies.table.provider') }}</th>
                    <th>{{ t('cookies.table.purpose') }}</th>
                    <th>{{ t('cookies.table.type') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Google Analytics</td>
                    <td>{{ t('cookies.providers.googleAnalytics') }}</td>
                    <td><span class="badge badge-info badge-sm">Analytics</span></td>
                  </tr>
                  <tr>
                    <td>Firebase</td>
                    <td>{{ t('cookies.providers.firebase') }}</td>
                    <td><span class="badge badge-success badge-sm">Essential</span></td>
                  </tr>
                  <tr>
                    <td>Cloudflare</td>
                    <td>{{ t('cookies.providers.cloudflare') }}</td>
                    <td><span class="badge badge-success badge-sm">Essential</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div class="divider" />

          <!-- Managing Cookies -->
          <section>
            <h2>{{ t('cookies.sections.managing.title') }}</h2>
            <p>{{ t('cookies.sections.managing.content') }}</p>
            <div class="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                class="btn btn-outline btn-sm gap-2"
              >
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z" />
                </svg>
                Chrome
              </a>
              <a
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                class="btn btn-outline btn-sm gap-2"
              >
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 4.166c1.23.792 2.236 1.862 2.94 3.108-.608-.106-1.315-.166-2.126-.166-.893 0-1.688.094-2.386.28-.087-.77-.251-1.49-.488-2.153.693-.396 1.396-.753 2.06-1.069zm-11.788 0c.664.316 1.367.673 2.06 1.07-.237.662-.4 1.382-.488 2.152-.698-.186-1.493-.28-2.386-.28-.81 0-1.518.06-2.126.166.704-1.246 1.71-2.316 2.94-3.108zM5.458 8.33c.952 0 1.788.095 2.507.28-.016.302-.024.608-.024.92 0 2.21.69 4.258 1.867 5.942-1.646.68-3.12 1.65-4.376 2.854A9.955 9.955 0 0 1 2.04 12c0-1.36.272-2.658.762-3.84.86-.16 1.738-.24 2.656-.24zm13.084 0c.918 0 1.796.08 2.656.24.49 1.182.762 2.48.762 3.84 0 2.224-.728 4.278-1.96 5.94-1.256-1.205-2.73-2.175-4.376-2.854 1.178-1.684 1.867-3.732 1.867-5.942 0-.312-.008-.618-.024-.92.72-.185 1.555-.28 2.507-.28zM12 8.59c2.526 0 4.576 2.05 4.576 4.576 0 2.526-2.05 4.576-4.576 4.576-2.526 0-4.576-2.05-4.576-4.576 0-2.526 2.05-4.576 4.576-4.576zm-5.87 10.47c1.148 1.016 2.518 1.8 4.02 2.28a9.903 9.903 0 0 1-4.02-2.28zm11.74 0a9.903 9.903 0 0 1-4.02 2.28 9.932 9.932 0 0 0 4.02-2.28z" />
                </svg>
                Firefox
              </a>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                target="_blank"
                class="btn btn-outline btn-sm gap-2"
              >
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm.863-9.164l5.499-2.2-2.2 5.499-5.499 2.2 2.2-5.499zm-.726 2.39a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
                Safari
              </a>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                class="btn btn-outline btn-sm gap-2"
              >
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21.86 17.86q.14 0 .25.12.1.13.1.25t-.11.33l-.32.46-.43.53-.44.5q-.21.25-.38.42l-.22.23q-.58.53-1.34 1.04-.76.51-1.6.91-.86.4-1.74.64t-1.67.24q-.9 0-1.69-.28-.8-.28-1.48-.78-.68-.5-1.22-1.17-.53-.66-.92-1.44-.38-.77-.58-1.6-.2-.83-.2-1.67 0-1 .32-1.96.33-.97.87-1.8.14.95.55 1.77.41.82 1.02 1.5.6.68 1.38 1.21.78.54 1.64.9.86.36 1.77.56.92.2 1.8.2 1.04 0 2-.23.98-.23 1.84-.63.24-.11.44-.23.2-.12.38-.25l.27-.22q.13-.12.23-.24l.27-.32.23-.3.15-.22q.1-.15.15-.22.09-.15.15-.25.06-.1.12-.17l.08-.1.05-.05q.07-.05.14-.05zm-11.81.26q-.17 0-.34-.02l-.34-.06-.34-.1q-.16-.05-.32-.12-.51-.2-.95-.48-.44-.27-.83-.6-.38-.33-.7-.69-.32-.36-.58-.74-.25-.38-.44-.76-.19-.38-.32-.76-.12-.38-.18-.75-.05-.37-.05-.73 0-.46.12-.89.12-.43.34-.8.23-.38.54-.69.31-.31.7-.53.38-.22.81-.35.44-.12.91-.12.66 0 1.29.21.63.2 1.2.57.57.37 1.06.87.49.5.88 1.11.38.6.65 1.28.27.68.4 1.4.12.7.12 1.42 0 .44-.06.87-.05.43-.16.85-.1.42-.25.82-.14.4-.33.77-.19.37-.42.72-.23.35-.5.66-.27.32-.58.6-.31.28-.65.52-.34.24-.72.43-.38.2-.78.35-.39.15-.8.24-.4.1-.82.14-.41.03-.82.03z" />
                </svg>
                Edge
              </a>
            </div>
          </section>

          <div class="divider" />

          <!-- Contact -->
          <section>
            <h2>{{ t('cookies.sections.contact.title') }}</h2>
            <p>{{ t('cookies.sections.contact.content') }}</p>
            <p>
              <strong>{{ t('contact.email') }}:</strong>
              <a
                href="mailto:privacy@myresumeapp.com"
                class="link link-primary"
              >privacy@myresumeapp.com</a>
            </p>
          </section>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="mt-8 flex flex-wrap gap-4 justify-center">
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
          to="/contact"
          class="btn btn-outline btn-sm"
        >
          {{ t('nav.contact') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
