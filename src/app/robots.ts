import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login/',
        ],
      },
    ],
    sitemap: 'https://grupo-souza-3i5y-396g5p0bp-lucasdellatorres-projects.vercel.app/sitemap.xml',
  }
}
