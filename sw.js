// Service worker: installable app shell + phone notifications
const CACHE = 'yaqeen-shell-v17';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './mark.jpg', './logo-full.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
// ---- notifications ----
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  const isCall = String(d.tag || '').startsWith('call-');
  e.waitUntil(self.registration.showNotification(d.title || 'Yaqeen Group', {
    body: d.body || 'নতুন আপডেট আছে',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || 'yg',
    renotify: true,
    requireInteraction: isCall,
    vibrate: isCall ? [500, 250, 500, 250, 500] : [200, 100, 200],
    data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) { c.postMessage({ type: 'open', url: target }); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});

