const V = 'elbob-v9';
const FILES = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'offline.html',
  'firebase-config.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// 1. Install Event: Cache essential app assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => 0))))
  );
  self.skipWaiting(); // Activate new SW immediately
});

// 2. Activate Event: Clean up old caches (v7 and older)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Take control of all pages instantly
});

// 3. Fetch Event: Network first with Cache fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r.ok) {
          const c = r.clone();
          caches.open(V).then(x => x.put(e.request, c));
        }
        return r;
      })
      .catch(() => 
        caches.match(e.request).then(h => 
          h || (e.request.mode === 'navigate' ? caches.match('offline.html') : Response.error())
        )
      )
  );
});
