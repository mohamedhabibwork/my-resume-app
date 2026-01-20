export default {
  async fetch(_request: Request): Promise<Response> {
    // This would query Firestore for public resumes
    // For now, return a basic sitemap structure
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
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
  },
}
