import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const SUPPORTED_LOCALES = ['en', 'pt', 'de', 'fr'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extraer el primer segmento de la URL
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  // Si la ruta comienza con un idioma soportado (/en, /pt, /de, /fr)
  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment)) {
    const locale = firstSegment;
    // Reconstruir la ruta sin el prefijo de idioma (ej: /en/hike-and-fly -> /hike-and-fly)
    const newPath = '/' + segments.slice(1).join('/');

    // Crear la URL interna reescrita manteniendo los searchParams existentes y agregando lang
    const url = request.nextUrl.clone();
    url.pathname = newPath || '/';
    url.searchParams.set('lang', locale);

    const response = NextResponse.rewrite(url);
    response.headers.set('x-locale', locale);
    return response;
  }

  // Manejo de sesión Supabase para todas las demás rutas (incluye protección de /admin)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, videos, audio, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt|llms.txt|llms-full.txt|contenido|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|avif)$).*)',
  ],
};
