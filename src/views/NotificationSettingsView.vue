<script setup lang="ts">
import NotificationSettings from '@/components/notifications/NotificationSettings.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">
        {{ t('notifications.settings') }}
      </h1>
      <NotificationSettings />
    </div>
  </div>
</template>
