<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()

const lastUpdated = '2026-01-15'
</script>

<template>
  <div class="py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">
          {{ t('privacy.title') }}
        </h1>
        <p class="text-base-content/70">
          {{ t('terms.lastUpdated') }}: {{ lastUpdated }}
        </p>
      </div>

      <div class="card bg-base-100 card-border">
        <div class="card-body prose max-w-none">
          <!-- Introduction -->
          <section>
            <h2>{{ t('privacy.sections.introduction.title') }}</h2>
            <p>{{ t('privacy.sections.introduction.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Information We Collect -->
          <section>
            <h2>{{ t('privacy.sections.collection.title') }}</h2>
            <h3>{{ t('privacy.sections.collection.personal.title') }}</h3>
            <ul>
              <li>{{ t('privacy.sections.collection.personal.item1') }}</li>
              <li>{{ t('privacy.sections.collection.personal.item2') }}</li>
              <li>{{ t('privacy.sections.collection.personal.item3') }}</li>
              <li>{{ t('privacy.sections.collection.personal.item4') }}</li>
            </ul>

            <h3>{{ t('privacy.sections.collection.resume.title') }}</h3>
            <ul>
              <li>{{ t('privacy.sections.collection.resume.item1') }}</li>
              <li>{{ t('privacy.sections.collection.resume.item2') }}</li>
              <li>{{ t('privacy.sections.collection.resume.item3') }}</li>
            </ul>

            <h3>{{ t('privacy.sections.collection.automatic.title') }}</h3>
            <ul>
              <li>{{ t('privacy.sections.collection.automatic.item1') }}</li>
              <li>{{ t('privacy.sections.collection.automatic.item2') }}</li>
              <li>{{ t('privacy.sections.collection.automatic.item3') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- How We Use Information -->
          <section>
            <h2>{{ t('privacy.sections.usage.title') }}</h2>
            <ul>
              <li>{{ t('privacy.sections.usage.item1') }}</li>
              <li>{{ t('privacy.sections.usage.item2') }}</li>
              <li>{{ t('privacy.sections.usage.item3') }}</li>
              <li>{{ t('privacy.sections.usage.item4') }}</li>
              <li>{{ t('privacy.sections.usage.item5') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- Data Sharing -->
          <section>
            <h2>{{ t('privacy.sections.sharing.title') }}</h2>
            <p>{{ t('privacy.sections.sharing.intro') }}</p>
            <ul>
              <li>{{ t('privacy.sections.sharing.item1') }}</li>
              <li>{{ t('privacy.sections.sharing.item2') }}</li>
              <li>{{ t('privacy.sections.sharing.item3') }}</li>
            </ul>
            <div class="alert alert-info mt-4">
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
              <span>{{ t('privacy.sections.sharing.noSale') }}</span>
            </div>
          </section>

          <div class="divider" />

          <!-- Data Security -->
          <section>
            <h2>{{ t('privacy.sections.security.title') }}</h2>
            <p>{{ t('privacy.sections.security.content') }}</p>
            <ul>
              <li>{{ t('privacy.sections.security.item1') }}</li>
              <li>{{ t('privacy.sections.security.item2') }}</li>
              <li>{{ t('privacy.sections.security.item3') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- Your Rights -->
          <section>
            <h2>{{ t('privacy.sections.rights.title') }}</h2>
            <p>{{ t('privacy.sections.rights.intro') }}</p>
            <ul>
              <li><strong>{{ t('privacy.sections.rights.access.title') }}:</strong> {{ t('privacy.sections.rights.access.content') }}</li>
              <li><strong>{{ t('privacy.sections.rights.correction.title') }}:</strong> {{ t('privacy.sections.rights.correction.content') }}</li>
              <li><strong>{{ t('privacy.sections.rights.deletion.title') }}:</strong> {{ t('privacy.sections.rights.deletion.content') }}</li>
              <li><strong>{{ t('privacy.sections.rights.export.title') }}:</strong> {{ t('privacy.sections.rights.export.content') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- Cookies -->
          <section>
            <h2>{{ t('privacy.sections.cookies.title') }}</h2>
            <p>{{ t('privacy.sections.cookies.content') }}</p>
            <router-link
              to="/cookies"
              class="link link-primary"
            >
              {{ t('privacy.sections.cookies.learnMore') }}
            </router-link>
          </section>

          <div class="divider" />

          <!-- Data Retention -->
          <section>
            <h2>{{ t('privacy.sections.retention.title') }}</h2>
            <p>{{ t('privacy.sections.retention.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Children's Privacy -->
          <section>
            <h2>{{ t('privacy.sections.children.title') }}</h2>
            <p>{{ t('privacy.sections.children.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Changes -->
          <section>
            <h2>{{ t('privacy.sections.changes.title') }}</h2>
            <p>{{ t('privacy.sections.changes.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Contact -->
          <section>
            <h2>{{ t('privacy.sections.contact.title') }}</h2>
            <p>{{ t('privacy.sections.contact.content') }}</p>
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
  </div>
</template>
