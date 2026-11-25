// Service worker: installable app shell + phone notifications
const CACHE = 'yaqeen-shell-v74';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './mark.jpg', './logo-full.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== 'yg-prefs').map(k => caches.delete(k)))).then(() => self.clients.claim()));
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
/* user sound settings saved by the app (sounds.js) */
async function ygPrefs() { try { const c = await caches.open('yg-prefs'); const r = await c.match('./yg-sound-prefs'); return r ? await r.json() : null; } catch (e) { return null; } }
function ygCat(d, P) {
  const tag = String(d.tag || ''), url = String(d.url || '');
  if (tag.startsWith('call-')) return 'call';
  if (tag.startsWith('missed-')) return 'missed';
  const t = /^test-([a-z]+)/.exec(tag); if (t) return t[1];
  const c = /[?&]c=([0-9a-f-]+)/.exec(url); if (c) return P && P.groups && P.groups.indexOf(c[1]) >= 0 ? 'group' : 'msg';
  if (/[?&]t=/.test(url) || /^(task|due|late|overdue|item)/.test(tag)) return 'task';
  if (/[?&]n=/.test(url) || /^notice/.test(tag)) return 'notice';
  return 'general';
}
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  const isCall = String(d.tag || '').startsWith('call-');
  const tag = d.tag || 'yg';
  const title = d.title || 'Yaqeen Group';
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const run = async () => {
    const P = await ygPrefs();
    const cat = ygCat(d, P);
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const visible = wins.some(c => c.visibilityState === 'visible');
    /* sound off for this category → silent phone notification; app on screen → the app plays its own sound (no double sound) */
    const off = P && ((cat === 'msg' && P.msg === false) || (cat === 'group' && P.group === false) || (cat === 'task' && P.task === false) || (cat === 'notice' && P.notice === false) || (cat === 'call' && P.ring === false));
    const silent = !!(off || visible);
    wins.forEach(c => c.postMessage({ type: 'yg-sound', cat, tag, url: d.url || '' }));
    const opts = () => ({
      body: d.body || 'নতুন আপডেট আছে', icon: 'icon-192.png', badge: 'icon-192.png', tag, renotify: true, silent,
      requireInteraction: isCall, vibrate: silent ? undefined : (isCall ? [800, 300, 800, 300, 800, 300, 800] : [200, 100, 200]),
      data: { url: d.url || './', tag: String(d.tag || ''), title: String(d.title || ''), kind: String(d.kind || '') }
    });
    await self.registration.showNotification(title, opts());
    if (!isCall || visible) return;
    /* calls ring again 2 more times (like a phone ringing) unless already tapped or closed */
    for (let i = 0; i < 2; i++) {
      await wait(12000);
      const still = await self.registration.getNotifications({ tag });
      if (!still.length) return;
      await self.registration.showNotification('📞 ' + title.replace(/^📞\s*/, ''), opts());
    }
  };
  e.waitUntil(run());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const nd = e.notification.data || {};
  const tu = new URL(nd.url || './', self.registration.scope);
  if (!tu.search) { if (nd.tag) tu.searchParams.set('yt', String(nd.tag).slice(0, 120)); if (nd.title || e.notification.title) tu.searchParams.set('yh', String(nd.title || e.notification.title).slice(0, 120)); if (nd.kind) tu.searchParams.set('yk', nd.kind); }
  const target = tu.href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) { c.postMessage({ type: 'open', url: target }); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});


// tell open app windows a new alert arrived, so the bell badge updates
self.addEventListener('push', e => {
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => cs.forEach(c => c.postMessage({ type: 'yg-notif' }))));
});
