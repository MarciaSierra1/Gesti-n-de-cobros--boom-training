// Service Worker para PWA - Sistema de Gimnasio
const CACHE_NAME = 'gimnasio-v' + new Date().getTime();
const STATIC_CACHE = 'gimnasio-static-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Instalando nueva versión...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Forzar activación inmediata
        return self.skipWaiting();
      })
  );
});

// Interceptar requests con estrategia Network First para archivos principales
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Para archivos principales, intentar red primero
  if (url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css')) {
    
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la red funciona, actualizar caché y devolver respuesta
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          }
          // Si falla la red, usar caché
          return caches.match(event.request);
        })
        .catch(() => {
          // Si falla la red, usar caché
          return caches.match(event.request);
        })
    );
  } else {
    // Para otros recursos, usar caché primero
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});

// Actualizar Service Worker y limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('SW: Activando nueva versión...');
  event.waitUntil(
    Promise.all([
      // Tomar control inmediato de todas las páginas
      self.clients.claim(),
      // Limpiar cachés antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log('SW: Eliminando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
  
  // Notificar a todas las páginas abiertas sobre la actualización
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        message: 'Nueva versión disponible. La página se actualizará automáticamente.'
      });
    });
  });
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
