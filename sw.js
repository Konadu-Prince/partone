/**
 * WANDERLUST TRAVEL - SERVICE WORKER
 * Progressive Web App Service Worker
 * Waterfall Methodology Implementation
 */

const CACHE_NAME = 'wanderlust-travel-v1.0.0';
const STATIC_CACHE = 'wanderlust-static-v1.0.0';
const DYNAMIC_CACHE = 'wanderlust-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/all-destinations.html',
  '/blog-archive.html',
  '/blog-post.html',
  '/destination-details.html',
  '/login.html',
  '/register.html',
  '/css/wanderlust-styles.css',
  '/js/wanderlust-app.js',
  '/manifest.json',
  '/assets/images/hero-bg.jpg',
  '/assets/images/canada-mountain.jpg',
  '/assets/images/ghana-beach.jpg',
  '/assets/images/kenya-safari.jpg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Files to cache on demand
const DYNAMIC_FILES = [
  '/api/destinations',
  '/api/blog-posts',
  '/api/user-profile'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('📦 Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        console.log('🌐 Service Worker: Fetching from network', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic content
            if (shouldCache(request.url)) {
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                  console.log('💾 Service Worker: Cached dynamic content', request.url);
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('❌ Service Worker: Network fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return cached version if available
            return caches.match(request);
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New travel deals available!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Deals',
        icon: '/assets/icons/explore-24x24.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/close-24x24.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Wanderlust Travel', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/all-destinations.html')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Helper functions
function shouldCache(url) {
  // Cache API calls and dynamic content
  return url.includes('/api/') || 
         url.includes('.html') || 
         url.includes('.css') || 
         url.includes('.js') ||
         url.includes('.jpg') ||
         url.includes('.png') ||
         url.includes('.webp');
}

function doBackgroundSync() {
  console.log('🔄 Service Worker: Performing background sync');
  
  // Sync offline actions when connection is restored
  return Promise.resolve();
}

// Cache management
function updateCache() {
  return caches.open(STATIC_CACHE)
    .then((cache) => {
      return cache.addAll(STATIC_FILES);
    });
}

// Clean up old dynamic cache entries
function cleanDynamicCache() {
  return caches.open(DYNAMIC_CACHE)
    .then((cache) => {
      return cache.keys()
        .then((keys) => {
          // Keep only the 50 most recent entries
          if (keys.length > 50) {
            const keysToDelete = keys.slice(0, keys.length - 50);
            return Promise.all(
              keysToDelete.map((key) => cache.delete(key))
            );
          }
        });
    });
}

// Periodic cleanup
setInterval(() => {
  cleanDynamicCache();
}, 24 * 60 * 60 * 1000); // Clean up daily

console.log('🎯 Service Worker: Loaded successfully');
