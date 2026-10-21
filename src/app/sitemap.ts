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
      url: `${baseUrl}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hike-and-fly`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
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
    {
      url: `${baseUrl}/cumbres`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/cumbres/cerro-manquehuito`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cumbres/cerro-manquehue`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cumbres/cerro-carbon`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cumbres/cerro-pochoco`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cumbres/cerro-provincia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cumbres/alto-del-naranjo`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cumbres/cerro-la-cruz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cumbres/morro-las-papas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cumbres/cerro-pintor`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cumbres/glaciar-el-morado`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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
      .select('id, title, slug, vertical_type, category, updated_at')
      .eq('is_active', true);

    if (routes && routes.length > 0) {
      routes.forEach((route) => {
        const lastMod = route.updated_at ? new Date(route.updated_at) : new Date();
        
        // Dynamic route by ID
        dynamicRoutes.push({
          url: `${baseUrl}/rutas/${route.id}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.9,
        });

        // Dynamic route by slug if present
        if (route.slug) {
          dynamicRoutes.push({
            url: `${baseUrl}/rutas/${route.slug}`,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.9,
          });
        }

        // Hike & Fly specific landing pages
        const isHikeFly = route.vertical_type === 'hike_and_fly' || route.category === 'hike_and_fly';
        if (isHikeFly) {
          dynamicRoutes.push({
            url: `${baseUrl}/hike-and-fly/${route.slug || route.id}`,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.95,
          });
        }
      });
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
