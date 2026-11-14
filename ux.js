/* ---------- UX: phone back button, call minimise, external links, voice messages ---------- */
{
const uxCss = document.createElement('style');
uxCss.textContent = `
#uxcallpill{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:50%;transform:translateX(-50%);z-index:9998;background:linear-gradient(135deg,#15803D,#22C55E);color:#fff;font-weight:600;font-size:13.5px;padding:10px 16px;border-radius:999px;box-shadow:0 6px 18px rgba(21,128,61,.35);display:flex;align-items:center;gap:8px;animation:uxPulse 1.6s ease-in-out infinite}
#uxcallpill[hidden]{display:none}
@keyframes uxPulse{0%,100%{box-shadow:0 6px 18px rgba(21,128,61,.35)}50%{box-shadow:0 6px 26px rgba(34,197,94,.6)}}
#uxmin{position:absolute;right:12px;top:calc(env(safe-area-inset-top,0px) + 10px);width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:20px;z-index:2}
#uxmic{font-size:20px}
#uxrec{display:flex;align-items:center;gap:10px;width:100%;padding:4px 2px}
#uxrec .dot{width:10px;height:10px;border-radius:50%;background:#DC2626;animation:uxBlink 1s infinite}
@keyframes uxBlink{50%{opacity:.25}}
#uxrec .t{font-weight:700;font-variant-numeric:tabular-nums;color:var(--navy)}
#uxrec .lb{flex:1;color:var(--mut);font-size:13px}
#uxrec button{width:42px;height:42px;border-radius:50%;font-size:18px}
#uxrec .x{background:#FEE2E2;color:#DC2626}
#uxrec .s{background:linear-gradient(135deg,var(--navy),var(--teal));color:#fff}
.msgs audio{width:230px;max-width:100%;height:40px;margin:2px 0}
`;
document.head.appendChild(uxCss);

/* 1) phone back button: step back inside the app instead of closing it */
let uxGuard = false, uxLeaving = false;
const uxPush = () => { if (uxGuard || uxLeaving) return; try { history.pushState({ yg: 1 }, ''); uxGuard = true; } catch (e) {} };
try { history.replaceState({ yg: 0 }, ''); } catch (e) {}
uxPush();
document.addEventListener('click', () => { uxLeaving = false; uxPush(); }, true);
document.addEventListener('touchstart', () => { uxLeaving = false; uxPush(); }, { capture: true, passive: true });
window.addEventListener('popstate', () => {
  uxGuard = false;
  const ov = document.getElementById('callov');
  if (ov && ov.style.display !== 'none') { uxMinCall(); uxPush(); return; }
  const sh = [...document.querySelectorAll('.sheetbg')].pop();
  if (sh) { sh.remove(); uxPush(); return; }
  const bk = document.getElementById('bk');
  if (bk && bk.offsetParent !== null) { bk.click(); uxPush(); return; }
  if (typeof ui !== 'undefined' && ui.tab && ui.tab !== 'home' && state.profile) { go('home'); uxPush(); return; }
  /* on home: one more back press leaves the app */
  uxLeaving = true;
  try { toast('বের হতে আবার ব্যাক চাপুন'); } catch (e) {}
  setTimeout(() => { if (uxLeaving) { uxLeaving = false; uxPush(); } }, 2500);
});

/* 2) calls: minimise instead of ending; green pill to return */
function uxMinCall() {
  const ov = document.getElementById('callov'); if (!ov) return;
  ov.style.display = 'none';
  let p = document.getElementById('uxcallpill');
  if (!p) { document.body.insertAdjacentHTML('beforeend', '<button id="uxcallpill">🟢 কল চলছে · ফিরতে চাপুন <span id="uxcpt"></span></button>'); p = document.getElementById('uxcallpill'); p.onclick = uxMaxCall; }
  p.hidden = false;
}
function uxMaxCall() { const ov = document.getElementById('callov'); if (ov) ov.style.display = ''; const p = document.getElementById('uxcallpill'); if (p) p.hidden = true; }
window.uxMinCall = uxMinCall;
new MutationObserver(() => {
  const ov = document.getElementById('callov'), p = document.getElementById('uxcallpill');
  if (ov && !document.getElementById('uxmin')) { const top = ov.querySelector('.ctop') || ov; top.insertAdjacentHTML('beforeend', '<button id="uxmin" title="ছোট করুন">⌄</button>'); document.getElementById('uxmin').onclick = e => { e.stopPropagation(); uxMinCall(); }; }
  if (!ov && p && !p.hidden) p.hidden = true;
  if (ov && p && !p.hidden) { const t = document.getElementById('ctime'), c = document.getElementById('uxcpt'); if (t && c && c.textContent !== t.textContent) c.textContent = t.textContent; }
}).observe(document.body, { childList: true, subtree: true, characterData: true });

/* 3) links to other sites open in a new tab, so "back" returns to the app */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target) return;
  try { const u = new URL(a.href, location.href); if (/^https?:$/.test(u.protocol) && u.origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener'; } } catch (err) {}
}, true);

/* 4) voice messages in chat */
const uxFmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
let uxRec = null;
new MutationObserver(() => {
  const sd = document.getElementById('sd'), tx = document.getElementById('tx');
  if (sd && tx && !document.getElementById('uxmic')) { sd.insertAdjacentHTML('beforebegin', '<button class="cb" id="uxmic" title="ভয়েস মেসেজ">🎤</button>'); document.getElementById('uxmic').onclick = uxStart; }
}).observe(document.body, { childList: true, subtree: true });
async function uxStart() {
  if (uxRec) return;
  if (!navigator.mediaDevices || !window.MediaRecorder) return toast('এই ফোনে ভয়েস রেকর্ড করা যাচ্ছে না। Chrome আপডেট করে চেষ্টা করুন।');
  const conv = ui.openConv; if (!conv) return;
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
  catch (e) { return toast('মাইক্রোফোনের অনুমতি দিন: Settings → Apps → Yaqeen Group (বা Chrome) → Permissions → Microphone → Allow'); }
  const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || '';
  let rec; try { rec = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 32000 } : {}); } catch (e) { stream.getTracks().forEach(t => t.stop()); return toast('রেকর্ড শুরু করা যায়নি'); }
  const chunks = [], t0 = Date.now(), comp = document.querySelector('.comp');
  uxRec = { rec, stream, send: false };
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
  const kids = comp ? [...comp.children] : [];
  kids.forEach(k => k.style.display = 'none');
  if (comp) comp.insertAdjacentHTML('beforeend', '<div id="uxrec"><button class="x" id="uxrx" title="বাতিল">✖</button><span class="dot"></span><span class="t" id="uxrt">0:00</span><span class="lb">রেকর্ড হচ্ছে… (সর্বোচ্চ ২ মিনিট)</span><button class="s" id="uxrs" title="পাঠান">➤</button></div>');
  const tick = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000), el = document.getElementById('uxrt'); if (el) el.textContent = uxFmt(s); if (s >= 120) finish(true); }, 250);
  function finish(send) { if (!uxRec || uxRec.done) return; uxRec.done = true; uxRec.send = send; clearInterval(tick); try { rec.stop(); } catch (e) {} }
  rec.onstop = async () => {
    const secs = Math.max(1, Math.round((Date.now() - t0) / 1000)), send = uxRec && uxRec.send;
    stream.getTracks().forEach(t => t.stop());
    const bar = document.getElementById('uxrec'); if (bar) bar.remove(); kids.forEach(k => k.style.display = '');
    uxRec = null;
    if (!send) return;
    if (secs < 1 || !chunks.length) return toast('রেকর্ড খুব ছোট হয়েছে');
    const mime = (rec.mimeType || type || 'audio/webm').split(';')[0], ext = /mp4/.test(mime) ? 'm4a' : /ogg/.test(mime) ? 'ogg' : 'webm';
    const blob = new Blob(chunks, { type: mime });
    toast('🎤 পাঠানো হচ্ছে…');
    const path = conv + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '-voice.' + ext;
    const { error: ue } = await sb.storage.from('chat-files').upload(path, blob, { contentType: mime, upsert: false });
    if (ue) return toast(friendlyError(ue));
    const { error } = await sb.from('messages').insert({ conversation_id: conv, sender_id: state.profile.id, body: '🎤 ভয়েস মেসেজ (' + uxFmt(secs) + ')', attachment_path: path, attachment_name: 'voice.' + ext, attachment_type: 'audio', attachment_size: blob.size });
    if (error) { await sb.storage.from('chat-files').remove([path]); toast(friendlyError(error)); }
  };
  rec.start(500);
  document.getElementById('uxrx').onclick = () => finish(false);
  document.getElementById('uxrs').onclick = () => finish(true);
}
}
