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
          {{ t('terms.title') }}
        </h1>
        <p class="text-base-content/70">
          {{ t('terms.lastUpdated') }}: {{ lastUpdated }}
        </p>
      </div>

      <div class="card bg-base-100 card-border">
        <div class="card-body prose max-w-none">
          <!-- Introduction -->
          <section>
            <h2>{{ t('terms.sections.introduction.title') }}</h2>
            <p>{{ t('terms.sections.introduction.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Account Terms -->
          <section>
            <h2>{{ t('terms.sections.account.title') }}</h2>
            <ul>
              <li>{{ t('terms.sections.account.item1') }}</li>
              <li>{{ t('terms.sections.account.item2') }}</li>
              <li>{{ t('terms.sections.account.item3') }}</li>
              <li>{{ t('terms.sections.account.item4') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- Acceptable Use -->
          <section>
            <h2>{{ t('terms.sections.acceptableUse.title') }}</h2>
            <p>{{ t('terms.sections.acceptableUse.intro') }}</p>
            <ul>
              <li>{{ t('terms.sections.acceptableUse.item1') }}</li>
              <li>{{ t('terms.sections.acceptableUse.item2') }}</li>
              <li>{{ t('terms.sections.acceptableUse.item3') }}</li>
              <li>{{ t('terms.sections.acceptableUse.item4') }}</li>
              <li>{{ t('terms.sections.acceptableUse.item5') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- Intellectual Property -->
          <section>
            <h2>{{ t('terms.sections.intellectualProperty.title') }}</h2>
            <p>{{ t('terms.sections.intellectualProperty.content1') }}</p>
            <p>{{ t('terms.sections.intellectualProperty.content2') }}</p>
          </section>

          <div class="divider" />

          <!-- User Content -->
          <section>
            <h2>{{ t('terms.sections.userContent.title') }}</h2>
            <p>{{ t('terms.sections.userContent.content1') }}</p>
            <p>{{ t('terms.sections.userContent.content2') }}</p>
          </section>

          <div class="divider" />

          <!-- Payment Terms -->
          <section>
            <h2>{{ t('terms.sections.payment.title') }}</h2>
            <ul>
              <li>{{ t('terms.sections.payment.item1') }}</li>
              <li>{{ t('terms.sections.payment.item2') }}</li>
              <li>{{ t('terms.sections.payment.item3') }}</li>
            </ul>
          </section>

          <div class="divider" />

          <!-- Termination -->
          <section>
            <h2>{{ t('terms.sections.termination.title') }}</h2>
            <p>{{ t('terms.sections.termination.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Disclaimer -->
          <section>
            <h2>{{ t('terms.sections.disclaimer.title') }}</h2>
            <p>{{ t('terms.sections.disclaimer.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Limitation of Liability -->
          <section>
            <h2>{{ t('terms.sections.liability.title') }}</h2>
            <p>{{ t('terms.sections.liability.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Changes to Terms -->
          <section>
            <h2>{{ t('terms.sections.changes.title') }}</h2>
            <p>{{ t('terms.sections.changes.content') }}</p>
          </section>

          <div class="divider" />

          <!-- Contact -->
          <section>
            <h2>{{ t('terms.sections.contact.title') }}</h2>
            <p>{{ t('terms.sections.contact.content') }}</p>
            <p>
              <strong>{{ t('contact.email') }}:</strong>
              <a
                href="mailto:legal@myresumeapp.com"
                class="link link-primary"
              >legal@myresumeapp.com</a>
            </p>
          </section>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="mt-8 flex flex-wrap gap-4 justify-center">
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
  </div>
</template>
