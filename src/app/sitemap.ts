import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.santiagohiking.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/reservar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/desafios/desafio-5am`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/desafios/triple-corona`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/desafios/sierra-de-ramon`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/desafios/desbloqueando-santiago`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: routes } = await supabase
      .from('adventures_catalog')
      .select('id, updated_at')
      .eq('is_active', true);

    if (routes && routes.length > 0) {
      dynamicRoutes = routes.map((route) => ({
        url: `${baseUrl}/rutas/${route.id}`,
        lastModified: route.updated_at ? new Date(route.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
