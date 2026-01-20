<script setup lang="ts">
import { computed } from 'vue'
import { useFCM } from '@/composables/useFCM'
import { useI18n } from '@/i18n'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const { t } = useI18n()
const {
  isSupported,
  permission,
  token,
  tokens,
  isLoading,
  requestPermission,
  disableNotifications,
  updatePreferences,
} = useFCM()

const currentToken = computed(() => tokens.value.find((t) => t.enabled) || tokens.value[0])
const preferences = computed(() => currentToken.value?.preferences || {
  resumeUpdates: true,
  systemNotifications: true,
  marketing: false,
})

const isEnabled = computed(() => permission.value === 'granted' && !!token.value)

async function handleEnable() {
  await requestPermission()
}

async function handleDisable() {
  await disableNotifications()
}

async function handlePreferenceChange(key: keyof typeof preferences.value, value: boolean) {
  await updatePreferences({ [key]: value })
}
</script>

<template>
  <Card class="p-6">
    <h2 class="text-2xl font-bold mb-6">
      {{ t('notifications.settings') }}
    </h2>

    <div
      v-if="!isSupported"
      class="text-center py-8"
    >
      <p class="text-gray-500 mb-4">
        {{ t('notifications.notSupported') }}
      </p>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <!-- Permission Status -->
      <div class="border-b pb-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold">
            {{ t('notifications.status') }}
          </h3>
          <span
            :class="{
              'bg-green-100 text-green-800': permission === 'granted',
              'bg-yellow-100 text-yellow-800': permission === 'default',
              'bg-red-100 text-red-800': permission === 'denied',
            }"
            class="px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ permission === 'granted' ? t('notifications.enabled') : permission === 'denied' ? t('notifications.disabled') : t('notifications.pending') }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-4">
          {{ permission === 'granted' ? t('notifications.enabledDescription') : permission === 'denied' ? t('notifications.disabledDescription') : t('notifications.pendingDescription') }}
        </p>

        <div
          v-if="!isEnabled"
          class="mt-4"
        >
          <Button
            :disabled="isLoading"
            variant="primary"
            @click="handleEnable"
          >
            {{ t('notifications.enable') }}
          </Button>
        </div>
        <div
          v-else
          class="mt-4"
        >
          <Button
            :disabled="isLoading"
            variant="danger"
            size="sm"
            @click="handleDisable"
          >
            {{ t('notifications.disable') }}
          </Button>
        </div>
      </div>

      <!-- Notification Preferences -->
      <div
        v-if="isEnabled"
        class="space-y-4"
      >
        <h3 class="text-lg font-semibold">
          {{ t('notifications.preferences') }}
        </h3>

        <div class="space-y-4">
          <!-- Resume Updates -->
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 class="font-medium">
                {{ t('notifications.resumeUpdates') }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ t('notifications.resumeUpdatesDescription') }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="preferences.resumeUpdates"
                class="sr-only peer"
                @change="handlePreferenceChange('resumeUpdates', ($event.target as HTMLInputElement).checked)"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <!-- System Notifications -->
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 class="font-medium">
                {{ t('notifications.systemNotifications') }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ t('notifications.systemNotificationsDescription') }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="preferences.systemNotifications"
                class="sr-only peer"
                @change="handlePreferenceChange('systemNotifications', ($event.target as HTMLInputElement).checked)"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <!-- Marketing -->
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 class="font-medium">
                {{ t('notifications.marketing') }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ t('notifications.marketingDescription') }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="preferences.marketing"
                class="sr-only peer"
                @change="handlePreferenceChange('marketing', ($event.target as HTMLInputElement).checked)"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>
      </div>

      <!-- Token Info (for debugging) -->
      <div
        v-if="token && isEnabled"
        class="mt-6 p-4 bg-gray-50 rounded-lg"
      >
        <h4 class="text-sm font-medium mb-2">
          {{ t('notifications.deviceToken') }}
        </h4>
        <p class="text-xs text-gray-600 font-mono break-all">
          {{ token.substring(0, 50) }}...
        </p>
      </div>
    </div>
  </Card>
</template>
