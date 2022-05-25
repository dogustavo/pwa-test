const BASE = 'https://dogustavo.github.io/pwa-test/'
const CACHE_NAME = 'findme-v8'
const assets = [
  BASE,
  BASE + '/index.html',
  BASE + 'js/instalar.js',
  BASE + '/js/app.js',
  BASE + '/manifest.json',
  BASE + '/img/icon.png',
  'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.8.0/dist/leaflet.js',
  'http://api.open-notify.org/iss-now.json',
  'https://5ed24c67-3bee-4c64-bb1b-8453c0483738.mock.pstmn.io/location'
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(
        '[Service Worker] Caching all: app shell and content'
      )
      return cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})
