import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async () => {
  // In a real implementation, this would:
  // 1. Query Firestore Admin SDK for all public resumes
  // 2. Generate sitemap.xml with all public resume URLs
  // 3. Return XML

  const baseUrl = 'https://example.com'
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
