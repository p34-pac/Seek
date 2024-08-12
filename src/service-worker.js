import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/search',
  '/playlists',
  '/playlists/:playlist_name',
  '/playlists/:playlist_name/video',
  '/playlists/video',
  '/search/video',
];

// Precache the specified routes
precacheAndRoute(urlsToCache.map(url => ({ url, revision: null })));

// Use StaleWhileRevalidate strategy for all other requests
registerRoute(
  ({ request }) => request.destination === 'document',
  new StaleWhileRevalidate()
);

// Handle install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Handle fetch events
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      }).catch(() => {
        // Handle offline scenario (e.g., return a fallback page)
        return caches.match('/offline.html');
      })
  );
});

// Handle activate event to clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
