import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'

export function useSEO() {
  const route = useRoute()

  function setSEO(meta: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: string
  }) {
    const siteName = 'Resume App'
    const title = meta.title ? `${meta.title} | ${siteName}` : siteName
    const description = meta.description || 'Create and manage your professional resume'
    const url = meta.url || `https://example.com${route.path}`
    const image = meta.image || 'https://example.com/og-image.jpg'

    useHead({
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: meta.type || 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      link: [
        { rel: 'canonical', href: url },
      ],
    })
  }

  function setNoIndex() {
    useHead({
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    })
  }

  return {
    setSEO,
    setNoIndex,
  }
}
