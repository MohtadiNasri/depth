// Depth service worker — network-first for the HTML shell (so app updates are
// picked up immediately instead of being stuck behind a stale cache — browsers
// only re-check this sw.js file for byte changes, never index.html itself),
// cache-first for icons/manifest, network-only for live conditions data.
const CACHE_NAME = 'depth-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept live conditions/geocoding calls — always hit the network
  // so wind/swell/rain data stays current. Let these fail naturally offline.
  if (url.hostname.endsWith('open-meteo.com')) return;

  if (url.origin !== self.location.origin) return;

  // Network-first for navigations and the HTML document itself, so a new
  // deploy is visible on next load instead of being served from a cache that
  // never gets invalidated. Falls back to the cached shell when offline.
  const isDocument = request.mode === 'navigate' || request.destination === 'document';
  if (isDocument) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for the rest of the app shell (icons, manifest) — these are
  // static and rarely change, so serve instantly and top up the cache.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
