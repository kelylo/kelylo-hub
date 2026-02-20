// KELYLO PWA Service Worker v2.9 - network-first JS, direct Gemini
const CACHE_NAME = 'kelylo-v2.9-direct';
const RUNTIME_CACHE = 'kelylo-runtime-v5';
const IMAGE_CACHE = 'kelylo-images-v2';

// Get base path for GitHub Pages
const BASE_PATH = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);

// Only cache essential assets immediately (lightweight start)
const CORE_ASSETS = [
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
  './images/ai-bot-icon.svg'
];

// Cache skill pages on demand (not on install)
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

// Install event - cache core assets AND skill pages for instant loading
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      }),
      caches.open(RUNTIME_CACHE).then((cache) => {
        console.log('[SW] Pre-caching skill pages for instant navigation');
        return cache.addAll(SKILL_PAGES);
      })
    ]).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== IMAGE_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Optimized caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-same-origin requests except CDNs
  if (url.origin !== self.location.origin && !url.href.includes('fonts.googleapis.com') && !url.href.includes('cdnjs.cloudflare.com') && !url.href.includes('fontawesome.com')) {
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  // Different strategies for different resource types
  if (request.destination === 'image') {
    // Images: Cache-first with expiry
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.endsWith('.html')) {
    // HTML: Network-first, fast fallback to cache
    event.respondWith(handleHTMLRequest(request));
  } else if (url.pathname.endsWith('.js')) {
    // JS files: Network-first — always load fresh code, cache as offline fallback
    event.respondWith(handleJSRequest(request));
  } else {
    // CSS, fonts: Cache-first
    event.respondWith(handleAssetRequest(request));
  }
});

// Optimized image handling - cache with compression
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

// JS files: Network-first — always serve fresh code, cache as offline fallback
async function handleJSRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('// Script unavailable offline', { status: 503 });
  }
}

// HTML: Cache-first for instant load, update in background
async function handleHTMLRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  // Return cached immediately for instant load
  if (cached) {
    // Update in background
    fetch(request).then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    return cached;
  }
  
  // If not cached, fetch from network
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Fallback to index if offline
    return cache.match('./index.html') || new Response('Offline', { status: 503 });
  }
}

// Assets: Cache-first
async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update in background if stale
    fetch(request).then(response => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached || new Response('Resource not available', { status: 503 });
  }
}

// Background sync for future features
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Sync user progress when back online
  console.log('[SW] Syncing progress...');
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
