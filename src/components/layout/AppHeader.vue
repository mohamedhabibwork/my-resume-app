<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from '@/i18n'

const router = useRouter()
const route = useRoute()
const { t, toggleLocale, locale } = useI18n()
const { isAuthenticated, userData, signOut } = useAuth()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

// Handle scroll for sticky header effect
function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

async function handleLogout() {
  await signOut()
  mobileMenuOpen.value = false
  router.push('/login')
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function isActiveRoute(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <header
    class="navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 min-h-16"
    :class="[
      isScrolled
        ? 'bg-base-100/95 backdrop-blur-lg shadow-lg border-b border-base-200/50'
        : 'bg-base-100/80 backdrop-blur-sm'
    ]"
  >
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- Logo & Mobile Menu -->
      <div class="flex items-center gap-2">
        <!-- Mobile Menu Button -->
        <div class="dropdown lg:hidden">
          <button
            tabindex="0"
            class="btn btn-ghost btn-sm btn-square"
            aria-label="Menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-transform duration-200"
              :class="{ 'rotate-90': mobileMenuOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Mobile Menu Dropdown -->
          <div
            v-show="mobileMenuOpen"
            class="fixed inset-x-0 top-16 z-50 p-4 lg:hidden"
          >
            <div class="bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden">
              <ul class="menu p-2">
                <!-- Main Navigation -->
                <li class="menu-title">
                  <span class="text-xs uppercase tracking-wider opacity-60">{{ t('nav.navigation') }}</span>
                </li>
                <li>
                  <router-link
                    to="/"
                    class="flex items-center gap-3 py-3"
                    :class="{ 'bg-primary/10 text-primary': isActiveRoute('/') }"
                    @click="closeMobileMenu"
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
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/ats-checker"
                    class="flex items-center gap-3 py-3"
                    :class="{ 'bg-primary/10 text-primary': isActiveRoute('/ats-checker') }"
                    @click="closeMobileMenu"
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
                    <span class="flex items-center gap-2">
                      {{ t('nav.atsChecker') }}
                      <span class="badge badge-success badge-sm">{{ t('common.free') }}</span>
                    </span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/about"
                    class="flex items-center gap-3 py-3"
                    :class="{ 'bg-primary/10 text-primary': isActiveRoute('/about') }"
                    @click="closeMobileMenu"
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ t('nav.about') }}
                  </router-link>
                </li>

                <template v-if="isAuthenticated">
                  <div class="divider my-2" />
                  <li class="menu-title">
                    <span class="text-xs uppercase tracking-wider opacity-60">{{ t('nav.myAccount') }}</span>
                  </li>
                  <li>
                    <router-link
                      to="/dashboard"
                      class="flex items-center gap-3 py-3"
                      :class="{ 'bg-primary/10 text-primary': isActiveRoute('/dashboard') }"
                      @click="closeMobileMenu"
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
                          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                      </svg>
                      {{ t('nav.dashboard') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/resume"
                      class="flex items-center gap-3 py-3"
                      :class="{ 'bg-primary/10 text-primary': isActiveRoute('/resume') }"
                      @click="closeMobileMenu"
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {{ t('nav.resume') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/profile"
                      class="flex items-center gap-3 py-3"
                      :class="{ 'bg-primary/10 text-primary': isActiveRoute('/profile') }"
                      @click="closeMobileMenu"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {{ t('nav.profile') }}
                    </router-link>
                  </li>
                  <div class="divider my-2" />
                  <li>
                    <button
                      class="flex items-center gap-3 py-3 text-error hover:bg-error/10"
                      @click="handleLogout"
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {{ t('nav.logout') }}
                    </button>
                  </li>
                </template>

                <template v-else>
                  <div class="divider my-2" />
                  <li class="p-2">
                    <div class="flex flex-col gap-2">
                      <router-link
                        to="/login"
                        class="btn btn-outline btn-sm w-full"
                        @click="closeMobileMenu"
                      >
                        {{ t('nav.login') }}
                      </router-link>
                      <router-link
                        to="/signup"
                        class="btn btn-primary btn-sm w-full"
                        @click="closeMobileMenu"
                      >
                        {{ t('nav.register') }}
                      </router-link>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>

          <!-- Backdrop -->
          <div
            v-show="mobileMenuOpen"
            class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            @click="closeMobileMenu"
          />
        </div>

        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-base-200/50 transition-colors"
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white"
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
          </div>
          <span class="hidden sm:block font-bold text-lg">
            <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Resume</span><span class="text-base-content">App</span>
          </span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center">
        <ul class="flex items-center gap-1">
          <li>
            <router-link
              to="/"
              class="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-base-200"
              :class="{ 'bg-primary/10 text-primary': isActiveRoute('/') }"
            >
              {{ t('nav.home') }}
            </router-link>
          </li>
          <li>
            <router-link
              to="/ats-checker"
              class="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-base-200 flex items-center gap-2"
              :class="{ 'bg-primary/10 text-primary': isActiveRoute('/ats-checker') }"
            >
              {{ t('nav.atsChecker') }}
              <span class="badge badge-success badge-xs">{{ t('common.free') }}</span>
            </router-link>
          </li>
          <template v-if="isAuthenticated">
            <li>
              <router-link
                to="/dashboard"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-base-200"
                :class="{ 'bg-primary/10 text-primary': isActiveRoute('/dashboard') }"
              >
                {{ t('nav.dashboard') }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/resume"
                class="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-base-200"
                :class="{ 'bg-primary/10 text-primary': isActiveRoute('/resume') }"
              >
                {{ t('nav.resume') }}
              </router-link>
            </li>
          </template>
          <li>
            <router-link
              to="/about"
              class="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-base-200"
              :class="{ 'bg-primary/10 text-primary': isActiveRoute('/about') }"
            >
              {{ t('nav.about') }}
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Language Toggle -->
        <div
          class="tooltip tooltip-bottom"
          :data-tip="locale === 'en' ? 'العربية' : 'English'"
        >
          <button
            class="btn btn-ghost btn-sm btn-square text-sm font-semibold"
            :aria-label="locale === 'en' ? 'Switch to Arabic' : 'Switch to English'"
            @click="toggleLocale"
          >
            {{ locale === 'en' ? 'ع' : 'EN' }}
          </button>
        </div>

        <!-- Theme Toggle -->
        <div
          class="tooltip tooltip-bottom"
          :data-tip="t('common.toggleTheme')"
        >
          <label class="btn btn-ghost btn-sm btn-square swap swap-rotate">
            <input
              type="checkbox"
              class="theme-controller"
              value="dark"
            />
            <svg
              class="swap-off h-5 w-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg
              class="swap-on h-5 w-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>

        <!-- Authenticated User Menu -->
        <template v-if="isAuthenticated">
          <div class="dropdown dropdown-end hidden lg:block">
            <button
              tabindex="0"
              class="btn btn-ghost btn-sm gap-2 px-2"
            >
              <div class="avatar placeholder">
                <div class="bg-gradient-to-br from-primary to-secondary text-primary-content w-8 h-8 rounded-full">
                  <span class="text-sm font-bold">{{ (userData?.displayName || userData?.email || 'U').charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              tabindex="0"
              class="dropdown-content bg-base-100 rounded-2xl z-[100] mt-2 w-64 p-2 shadow-2xl border border-base-200"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-base-200">
                <p class="font-semibold text-sm truncate">
                  {{ userData?.displayName || 'User' }}
                </p>
                <p class="text-xs text-base-content/60 truncate">
                  {{ userData?.email }}
                </p>
              </div>

              <!-- Menu Items -->
              <ul class="menu p-0 mt-2">
                <li>
                  <router-link
                    to="/dashboard"
                    class="flex items-center gap-3 py-2.5 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                    {{ t('nav.dashboard') }}
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/resume"
                    class="flex items-center gap-3 py-2.5 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 opacity-70"
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
                    {{ t('nav.resume') }}
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/profile"
                    class="flex items-center gap-3 py-2.5 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {{ t('nav.profile') }}
                  </router-link>
                </li>
              </ul>

              <div class="divider my-1" />

              <ul class="menu p-0">
                <li>
                  <button
                    class="flex items-center gap-3 py-2.5 rounded-lg text-error hover:bg-error/10"
                    @click="handleLogout"
                  >
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {{ t('nav.logout') }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </template>

        <!-- Not Authenticated: Auth Buttons -->
        <template v-else>
          <div class="hidden lg:flex items-center gap-2">
            <router-link
              to="/login"
              class="btn btn-ghost btn-sm"
            >
              {{ t('nav.login') }}
            </router-link>
            <router-link
              to="/signup"
              class="btn btn-primary btn-sm shadow-md hover:shadow-lg transition-shadow"
            >
              {{ t('nav.register') }}
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </header>

  <!-- Spacer for fixed header -->
  <div class="h-16" />
</template>
