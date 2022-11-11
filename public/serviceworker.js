const CACHE_NAME = "chache_kel15";
const urlsToCache = [
    '/static/js/*.js',
    '/static/js/*.js.map',
    '/static/css/*.css',
    '/static/css/*.css.map',
    '/offline-fetch.json',
    '/offline.png'
];

const self = this;

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Installing service worker..')
                return cache.addAll(urlsToCache);
            })
    );
})

// Activate the Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName != CACHE_NAME
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            )
        })
    )
})

// Listen For Request
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    return response || fetch(request);
                })
        )
    } else {
        event.respondWith(
            caches.open('mov-cache15')
                .then(function (cache) {
                    return fetch(request).then(function (liveResponse) {
                        cache.put(request, liveResponse.clone())
                        return liveResponse;
                    })
                        .catch(function () {
                            return caches.match(request)
                                .then(function (response) {
                                    return response || caches.match('/offline-fetch.json')
                                })
                        });
                })
        )
    }
})

