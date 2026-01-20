<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/i18n'
import Input from '@/components/ui/Input.vue'

const { t } = useI18n()
const { userData, updateProfile, signOut } = useAuth()

const displayName = ref(userData.value?.displayName || '')
</script>

<template>
  <div class="min-h-screen bg-base-200 p-4 md:p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-base-content mb-8">
        {{ t('nav.profile') }}
      </h1>

      <!-- Profile Info Card -->
      <div class="card bg-base-100 shadow-lg mb-6">
        <div class="card-body">
          <div class="flex items-center gap-4 mb-6">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content w-16 rounded-full">
                <span class="text-2xl">{{ (userData?.displayName || userData?.email || 'U').charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <div>
              <h2 class="card-title">
                {{ userData?.displayName || 'User' }}
              </h2>
              <p class="text-base-content/60">
                {{ userData?.email }}
              </p>
            </div>
          </div>

          <div class="divider">
            Profile Information
          </div>

          <div class="space-y-4">
            <Input
              v-model="displayName"
              label="Display Name"
              @update:model-value="updateProfile({ displayName: String($event) })"
            />

            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                :value="userData?.email"
                class="input input-bordered"
                disabled
              />
              <label class="label">
                <span class="label-text-alt text-base-content/60">Email cannot be changed</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Actions Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">
            Account Actions
          </h2>
          <div class="divider" />
          <div class="flex flex-col gap-4">
            <button
              class="btn btn-outline btn-error"
              @click="signOut"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {{ t('nav.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
