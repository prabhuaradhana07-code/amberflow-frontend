export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/vendor/dashboard/', '/cart/', '/checkout/'],
    },
    sitemap: 'https://amberflow.in/sitemap.xml',
  }
}
