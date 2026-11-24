// Service worker: installable app shell + phone notifications
const CACHE = 'yaqeen-shell-v49';
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
  // the app page itself always comes fresh from the server (never an old saved copy)
  const net = e.request.mode === 'navigate' ? fetch(e.request.url, { cache: 'no-cache' }) : fetch(e.request);
  e.respondWith(net.then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
// ---- notifications ----
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  const isCall = String(d.tag || '').startsWith('call-');
  const tag = d.tag || 'yg';
  const opts = () => ({
    body: d.body || 'নতুন আপডেট আছে',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag,
    renotify: true,
    silent: false,
    requireInteraction: isCall,
    vibrate: isCall ? [800, 300, 800, 300, 800, 300, 800] : [200, 100, 200],
    data: { url: d.url || './' }
  });
  const title = d.title || 'Yaqeen Group';
  const wait = ms => new Promise(r => setTimeout(r, ms));
  /* calls ring again 2 more times (like a phone ringing) unless the person already tapped or closed it */
  const ring = async () => {
    await self.registration.showNotification(title, opts());
    if (!isCall) return;
    for (let i = 0; i < 2; i++) {
      await wait(12000);
      const still = await self.registration.getNotifications({ tag });
      if (!still.length) return;
      await self.registration.showNotification('📞 ' + title.replace(/^📞\s*/, ''), opts());
    }
  };
  e.waitUntil(ring());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) { c.postMessage({ type: 'open', url: target }); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});


// tell open app windows a new alert arrived, so the bell badge updates
self.addEventListener('push', e => {
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => cs.forEach(c => c.postMessage({ type: 'yg-notif' }))));
});
