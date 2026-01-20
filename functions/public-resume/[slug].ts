import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async (context) => {
  const slug = context.params.slug as string

  // In a real implementation, this would:
  // 1. Query Firestore Admin SDK for the resume by slug
  // 2. Generate HTML with meta tags
  // 3. Return pre-rendered HTML

  // For now, return a basic HTML structure
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${slug}</title>
  <meta name="description" content="Professional resume">
  <meta property="og:title" content="Resume - ${slug}">
  <meta property="og:description" content="Professional resume">
  <meta property="og:type" content="website">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
