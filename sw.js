/**
 * Abdullah Psychotic / Bespoke Atelier Service Worker
 * Cache-First for static assets (images, fonts, styles, scripts)
 * Stale-While-Revalidate for HTML pages
 * Eliminates repeated network downloads on mobile ("ekbar load houer por barbar load na hoy")
 */

const CACHE_NAME = 'ap-atelier-v2';

// Core assets to pre-cache immediately upon install
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './navbar.css',
    './navbar.js',
    './32.png',
    './2.jpg',
    './logo.png',
    './logo1.png',
    './19.2.webp',
    './24.2.webp',
    './27.2.webp',
    './28.2.webp',
    './29.2.webp',
    './30.2.webp',
    './33.2.webp',
    './1.2.webp',
    './7.1.webp',
    './14.2.webp',
    './26.webp',
    './3.webp',
    './3.png',
    './bag2.webp',
    './res.webp',
    './res.png',
    './Neg.webp',
    './pw.jpeg',
    './wed.webp'
];

// Install Event — Warm up cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('ServiceWorker pre-cache partial fail (safe to ignore for dynamic items):', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate Event — Clean up outdated caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event — Intercept network requests
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // 1. Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // 2. Do not cache Google Apps Script API endpoints
    if (url.hostname.includes('script.google.com') || url.hostname.includes('script.googleusercontent.com')) {
        return;
    }

    // 3. Static Media, Fonts, Styles, and Scripts: Cache-First Strategy
    // Once loaded once, always serve from cache immediately without network delay
    const isStaticAsset = (
        url.pathname.match(/\.(webp|png|jpg|jpeg|svg|gif|ico|css|js|woff2|woff|ttf|eot)$/i) ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('cdnjs.cloudflare.com')
    );

    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
                        // For third-party CDNs (opaque responses) or valid 200 responses, store a clone
                        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        }
                        return networkResponse;
                    }
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return networkResponse;
                }).catch(() => {
                    // Fallback if offline
                    return cachedResponse || new Response('', { status: 408, statusText: 'Request timed out' });
                });
            })
        );
        return;
    }

    // 4. HTML Pages: Stale-While-Revalidate (Instant display from cache + background revalidation)
    if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    return cachedResponse;
                });

                // Return cached HTML immediately if available, otherwise wait for network
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Default: Network with Cache Fallback
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});
