import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.santiagohiking.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/portal/', '/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
          'Meta-ExternalAgent',
          'Bingbot',
        ],
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/faq',
          '/hike-and-fly',
          '/hike-and-fly/*',
          '/cumbres',
          '/cumbres/*',
          '/desafios',
          '/desafios/*',
          '/rutas/*',
          '/reservar',
        ],
        disallow: ['/private/', '/admin/', '/portal/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
