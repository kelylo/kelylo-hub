// KELYLO PWA Service Worker v3.0 - Optimized for slow data + offline-first
const CACHE_NAME = 'kelylo-v3.0-fast';
const RUNTIME_CACHE = 'kelylo-runtime-v6';
const IMAGE_CACHE = 'kelylo-images-v3';
const OFFLINE_CACHE = 'kelylo-offline-v1';

// Get base path for GitHub Pages
const BASE_PATH = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);

// CRITICAL: All assets needed for instant offline load
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './resources-manager.js',
  './config.js',
  './knowledge-base.js',
  './ai-manager.js',
  './ai-chat-ui.js',
  './manifest.json',
  './images/logo-best.svg',
  './images/ai-bot-icon.svg',
  // Font Awesome for icons (critical)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Skill pages - cached aggressively
const SKILL_PAGES = [
  './word.html',
  './powerpoint.html',
  './canva.html',
  './excel.html',
  './autocad.html',
  './sap2000.html',
  './robot.html',
  './english.html'
];

// All images for offline access
const IMAGE_ASSETS = [
  './images/1.jpg',
  './images/2.jpg',
  './images/3.jpg',
  './images/4.jpg',
  './images/5.jpg',
  './images/6.jpg',
  './images/7.jpg',
  './images/9.jpg',
  './images/10.jpg',
  './images/11.jpg',
  './images/12.jpg'
];

// Install event - Pre-cache EVERYTHING for instant offline load
self.addEventListener('install', (event) => {
  console.log('[SW] Installing KELYLO v3.0 - Optimized for slow data...');
  event.waitUntil(
    Promise.all([
      // Core assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Pre-caching core assets...');
        return cache.addAll(CORE_ASSETS);
      }),
      // Skill pages
      caches.open(RUNTIME_CACHE).then((cache) => {
        console.log('[SW] Pre-caching skill pages...');
        return cache.addAll(SKILL_PAGES);
      }),
      // Images
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('[SW] Pre-caching images...');
        return cache.addAll(IMAGE_ASSETS).catch(e => console.log('[SW] Some images skipped:', e));
      })
    ]).then(() => {
      console.log('[SW] All assets cached for offline use!');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v3.0...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== IMAGE_CACHE && name !== OFFLINE_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Optimized for SLOW DATA + OFFLINE-FIRST
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle all requests including cross-origin
  if (request.method !== 'GET') {
    return;
  }

  // Network-first for API/Gemini (needs fresh data)
  if (url.href.includes('generativelanguage.googleapis.com') || 
      url.href.includes('api.gemini')) {
    event.respondWith(handleNetworkOnly(request));
    return;
  }

  // Skip non-same-origin except critical CDNs
  if (url.origin !== self.location.origin && 
      !url.href.includes('fonts.googleapis.com') && 
      !url.href.includes('cdnjs.cloudflare.com') && 
      !url.href.includes('fontawesome.com') &&
      !url.href.includes('fonts.gstatic.com')) {
    return;
  }

  // STALE-WHILE-REVALIDATE for fastest load on slow data
  // Serve cached immediately, update in background
  if (request.destination === 'image') {
    event.respondWith(handleStaleWhileRevalidate(request, IMAGE_CACHE));
  } else if (url.pathname.endsWith('.html')) {
    event.respondWith(handleStaleWhileRevalidate(request, RUNTIME_CACHE));
  } else if (url.pathname.endsWith('.js')) {
    event.respondWith(handleStaleWhileRevalidate(request, CACHE_NAME));
  } else if (url.pathname.endsWith('.css')) {
    event.respondWith(handleStaleWhileRevalidate(request, CACHE_NAME));
  } else {
    // Fonts and other assets
    event.respondWith(handleStaleWhileRevalidate(request, CACHE_NAME));
  }
});

// STALE-WHILE-REVALIDATE: Serve cached instantly, update in background
// This is the KEY for slow data optimization
async function handleStaleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  // 1. Try cache first (INSTANT load)
  const cachedResponse = await cache.match(request);
  
  // 2. Always fetch in background to update cache
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed, but we have cache
    return null;
  });

  // 3. Return cached immediately if available (fastest for slow data)
  if (cachedResponse) {
    // Don't await fetch - return cached immediately
    fetchPromise.catch(() => {}); // Fire and forget
    return cachedResponse;
  }

  // 4. No cache? Wait for network (but with timeout)
  try {
    const networkResponse = await fetchPromise;
    if (networkResponse) {
      return networkResponse;
    }
  } catch (e) {
    // Network failed too
  }

  // 5. Ultimate fallback
  return cache.match('./index.html') || 
         new Response('Offline - Content not available', { status: 503 });
}

// Network-only for API calls
async function handleNetworkOnly(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle HTML with cache-first for instant load
async function handleHTMLRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update in background
    fetch(request).then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cache.match('./index.html') || new Response('Offline', { status: 503 });
  }
}

// Cache-first for images (most efficient)
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached || new Response('Image not available offline', { status: 503 });
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  console.log('[SW] Syncing progress when back online...');
}

// Push notification support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: './images/logo-best.svg',
    badge: './images/logo-best.svg',
    vibrate: [200, 100, 200],
    data: { dateOfArrival: Date.now() },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('KELYLO - Ambition Hub', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Cache additional resources on demand
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    if (Array.isArray(urls)) {
      caches.open(RUNTIME_CACHE).then(cache => {
        cache.addAll(urls).catch(e => console.log('[SW] Cache error:', e));
      });
    }
  }
});
