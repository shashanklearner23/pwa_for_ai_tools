const CACHE_NAME = 'ai-pwa-app-v2';
const ASSETS_TO_CACHE = [
  '/pwa_for_ai_tools/',
  '/pwa_for_ai_tools/index.html',
  '/pwa_for_ai_tools/manifest.json'
];

// Install – cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Activate immediately without waiting for old tabs to close
  self.skipWaiting();
});

// Activate – clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open pages right away
  self.clients.claim();
});

// Fetch – serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
