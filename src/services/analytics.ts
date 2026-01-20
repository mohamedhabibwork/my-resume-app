import { analytics } from '@/config/firebase'
import { logEvent, setUserProperties } from 'firebase/analytics'

/**
 * Firebase Analytics - FREE TIER (Unlimited Events)
 *
 * Firebase Analytics is completely free with no limits on:
 * - Event logging
 * - User properties
 * - Custom parameters
 * - Data retention (14 months)
 *
 * Use this for tracking user behavior, feature usage, and app performance.
 */

/**
 * Log an analytics event
 */
export function logAnalyticsEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (analytics) {
    logEvent(analytics, eventName, eventParams)
  }
}

/**
 * Set user properties
 */
export function setAnalyticsUserProperties(properties: Record<string, unknown>) {
  if (analytics) {
    setUserProperties(analytics, properties)
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, pagePath?: string) {
  logAnalyticsEvent('page_view', {
    page_title: pageName,
    page_location: pagePath || window.location.pathname,
  })
}

/**
 * Track user signup
 */
export function trackSignup(method: string) {
  logAnalyticsEvent('user_signup', { method })
}

/**
 * Track user login
 */
export function trackLogin(method: string) {
  logAnalyticsEvent('user_login', { method })
}

/**
 * Track resume creation
 */
export function trackResumeCreated(resumeId: string) {
  logAnalyticsEvent('resume_created', { resume_id: resumeId })
}

/**
 * Track resume update
 */
export function trackResumeUpdated(resumeId: string) {
  logAnalyticsEvent('resume_updated', { resume_id: resumeId })
}

/**
 * Track resume deletion
 */
export function trackResumeDeleted(resumeId: string) {
  logAnalyticsEvent('resume_deleted', { resume_id: resumeId })
}

/**
 * Track template change
 */
export function trackTemplateChanged(resumeId: string, template: string) {
  logAnalyticsEvent('template_changed', { resume_id: resumeId, template })
}

/**
 * Track theme change
 */
export function trackThemeChanged(resumeId: string) {
  logAnalyticsEvent('theme_changed', { resume_id: resumeId })
}

/**
 * Track ATS score view
 */
export function trackATSScoreViewed(resumeId: string, score: number) {
  logAnalyticsEvent('ats_score_viewed', { resume_id: resumeId, score })
}

/**
 * Track resume share
 */
export function trackResumeShared(resumeId: string, method: string) {
  logAnalyticsEvent('resume_shared', { resume_id: resumeId, method })
}

/**
 * Track section reorder
 */
export function trackSectionReordered(resumeId: string) {
  logAnalyticsEvent('section_reordered', { resume_id: resumeId })
}
