const CACHE_NAME = 'findme-v8';
const assets = [
  '/',
  '/app.html',
  'js/instalar.js',
  '/js/app.js',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.8.0/dist/leaflet.js',
  'http://api.open-notify.org/iss-now.json',
  '3.png',
  '4.png',
  '5.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      const res = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);

      if (res) return res;

      const newRes = await fetch(e.request);
      const cache = await caches.open(cacheName);

      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);

      cache.open(e.request, newRes.clone());

      return newRes;
    })()
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
