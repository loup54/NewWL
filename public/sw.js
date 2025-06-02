
const CACHE_NAME = 'wordlens-v3-production';
const STATIC_CACHE_NAME = 'wordlens-static-v3';
const DYNAMIC_CACHE_NAME = 'wordlens-dynamic-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png'
];

// Cache strategies with improved error handling
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE_NAME)
    ]).then(() => {
      console.log('Service Worker installation complete');
      self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker installation failed:', error);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME &&
                !cacheName.includes('wordlens-v3')) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activation complete');
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Skip requests to external domains
  if (url.origin !== location.origin) return;

  // Handle different types of requests with improved strategies
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    // Static assets - cache first with network fallback
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (url.pathname.startsWith('/assets/')) {
    // Asset files - cache first with long-term caching
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else {
    // App shell - stale while revalidate for better UX
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  }
});

// Improved cache strategies with better error handling
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Serving from cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      console.log('Caching new resource:', request.url);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed for:', request.url, error);
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const networkResponsePromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        console.log('Updating cache with fresh content:', request.url);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch((error) => {
      console.warn('Network request failed for:', request.url, error);
      return null;
    });
    
    if (cachedResponse) {
      console.log('Serving stale content while revalidating:', request.url);
      return cachedResponse;
    }
    
    return networkResponsePromise;
  } catch (error) {
    console.error('Stale while revalidate strategy failed for:', request.url, error);
    throw error;
  }
}

// Enhanced error handling and logging
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    // Handle any offline actions when coming back online
    console.log('Processing background sync tasks');
    // Future: Implement offline document processing queue
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications for future features
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      requireInteraction: true
    };
    
    event.waitUntil(
      self.registration.showNotification('WordLens', options)
    );
  }
});

console.log('Service Worker loaded successfully');
