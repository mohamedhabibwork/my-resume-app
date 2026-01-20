<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const { success, error } = useToast()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.message) {
    error(t('validation.required'))
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call - in production, this would send to your backend
    await new Promise(resolve => setTimeout(resolve, 1500))

    submitted.value = true
    success(t('contact.successMessage'))

    // Reset form
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch {
    error(t('errors.general'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">
          {{ t('contact.title') }}
        </h1>
        <p class="text-base-content/70 max-w-2xl mx-auto">
          {{ t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Contact Information -->
        <div class="md:col-span-1 space-y-6">
          <!-- Email Card -->
          <div class="card bg-base-100 card-border">
            <div class="card-body">
              <div class="flex items-center gap-4">
                <div class="bg-primary/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold">
                    {{ t('contact.email') }}
                  </h3>
                  <a
                    href="mailto:support@myresumeapp.com"
                    class="text-primary text-sm hover:underline"
                  >
                    support@myresumeapp.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Response Time Card -->
          <div class="card bg-base-100 card-border">
            <div class="card-body">
              <div class="flex items-center gap-4">
                <div class="bg-success/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold">
                    {{ t('contact.responseTime') }}
                  </h3>
                  <p class="text-sm text-base-content/70">
                    {{ t('contact.responseTimeValue') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="card bg-base-100 card-border">
            <div class="card-body">
              <h3 class="font-semibold mb-3">
                {{ t('contact.followUs') }}
              </h3>
              <div class="flex gap-3">
                <a
                  href="#"
                  class="btn btn-ghost btn-circle btn-sm"
                >
                  <svg
                    class="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  class="btn btn-ghost btn-circle btn-sm"
                >
                  <svg
                    class="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  class="btn btn-ghost btn-circle btn-sm"
                >
                  <svg
                    class="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- FAQ Link -->
          <div class="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="text-sm">
                {{ t('contact.faqHint') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="md:col-span-2">
          <div class="card bg-base-100 card-border">
            <div class="card-body">
              <h2 class="card-title mb-4">
                {{ t('contact.sendMessage') }}
              </h2>

              <!-- Success State -->
              <div
                v-if="submitted"
                class="text-center py-8"
              >
                <div class="text-6xl mb-4">
                  ✉️
                </div>
                <h3 class="text-xl font-semibold mb-2">
                  {{ t('contact.thankYou') }}
                </h3>
                <p class="text-base-content/70 mb-6">
                  {{ t('contact.weWillReply') }}
                </p>
                <button
                  class="btn btn-primary"
                  @click="submitted = false"
                >
                  {{ t('contact.sendAnother') }}
                </button>
              </div>

              <!-- Form -->
              <form
                v-else
                class="space-y-4"
                @submit.prevent="handleSubmit"
              >
                <div class="grid sm:grid-cols-2 gap-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend">
                      {{ t('contact.name') }}
                      <span class="text-error">*</span>
                    </legend>
                    <input
                      v-model="form.name"
                      type="text"
                      :placeholder="t('contact.namePlaceholder')"
                      class="input input-bordered w-full"
                      required
                    />
                  </fieldset>

                  <fieldset class="fieldset">
                    <legend class="fieldset-legend">
                      {{ t('contact.email') }}
                      <span class="text-error">*</span>
                    </legend>
                    <input
                      v-model="form.email"
                      type="email"
                      :placeholder="t('contact.emailPlaceholder')"
                      class="input input-bordered w-full"
                      required
                    />
                  </fieldset>
                </div>

                <fieldset class="fieldset">
                  <legend class="fieldset-legend">
                    {{ t('contact.subject') }}
                  </legend>
                  <select
                    v-model="form.subject"
                    class="select select-bordered w-full"
                  >
                    <option value="">
                      {{ t('contact.selectSubject') }}
                    </option>
                    <option value="general">
                      {{ t('contact.subjects.general') }}
                    </option>
                    <option value="support">
                      {{ t('contact.subjects.support') }}
                    </option>
                    <option value="feedback">
                      {{ t('contact.subjects.feedback') }}
                    </option>
                    <option value="billing">
                      {{ t('contact.subjects.billing') }}
                    </option>
                    <option value="partnership">
                      {{ t('contact.subjects.partnership') }}
                    </option>
                  </select>
                </fieldset>

                <fieldset class="fieldset">
                  <legend class="fieldset-legend">
                    {{ t('contact.message') }}
                    <span class="text-error">*</span>
                  </legend>
                  <textarea
                    v-model="form.message"
                    :placeholder="t('contact.messagePlaceholder')"
                    rows="5"
                    class="textarea textarea-bordered w-full"
                    required
                  />
                </fieldset>

                <button
                  type="submit"
                  class="btn btn-primary w-full"
                  :disabled="isSubmitting"
                >
                  <span
                    v-if="isSubmitting"
                    class="loading loading-spinner loading-sm"
                  />
                  {{ isSubmitting ? t('common.loading') : t('contact.send') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
