import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: requireGuest,
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
      beforeEnter: requireGuest,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      beforeEnter: requireGuest,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/resume/:id?',
      name: 'resume-builder',
      component: () => import('../views/ResumeBuilderView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/resume/public/:slug',
      name: 'public-resume',
      component: () => import('../views/PublicResumeView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationSettingsView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/cover-letters',
      name: 'cover-letters',
      component: () => import('../views/CoverLettersView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/cover-letter/:id?',
      name: 'cover-letter-builder',
      component: () => import('../views/CoverLetterBuilderView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/ats-checker',
      name: 'ats-checker',
      component: () => import('../views/ATSCheckerView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyPolicyView.vue'),
    },
    {
      path: '/cookies',
      name: 'cookies',
      component: () => import('../views/CookiePolicyView.vue'),
    },
    {
      path: '/offline',
      name: 'offline',
      component: () => import('../views/OfflineView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
