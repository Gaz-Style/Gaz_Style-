// Service Worker para Santiago Hiking (PWA Offline Support)
const CACHE_NAME = 'santiago-hiking-v2';

// 1. Instalación inmediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Activación y purga de cachés antiguas (elimina 'gaz-style-v1')
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purgando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estrategia NETWORK-FIRST (Siempre consulta la red primero)
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones no-GET o de desarrollo local
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // En localhost o API, no interceptar
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red responde bien, actualizamos la copia en caché de forma transparente
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Solo en caso de corte total de internet (modo offline en cerro), usamos la caché
        return caches.match(event.request);
      })
  );
});
