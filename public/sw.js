// Service Worker for Six Kings Dart Liga PWA
const CACHE_NAME = 'six-kings-dart-v1';

// Install event - skip waiting and don't cache anything initially
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Fetch event - just pass through to network, no caching
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(fetch(event.request));
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
