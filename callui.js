/* 📞 New call screen (Messenger-style): big avatar, clear icons, working mute/camera/speaker, minimize */
{
const I = {
  cam: '<svg viewBox="0 0 24 24"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h8A2.5 2.5 0 0 1 16 7.5v1.3l3.6-2.3c.7-.4 1.4 0 1.4.8v9.4c0 .8-.7 1.2-1.4.8L16 15.2v1.3a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 16.5z"/></svg>',
  camOff: '<svg viewBox="0 0 24 24"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h8A2.5 2.5 0 0 1 16 7.5v1.3l3.6-2.3c.7-.4 1.4 0 1.4.8v9.4c0 .8-.7 1.2-1.4.8L16 15.2v1.3a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 16.5z"/><path d="M3 3l18 18" stroke="#fff" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 1 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5z"/><path d="M18.5 11a6.5 6.5 0 0 1-13 0M12 17.5V21m-3.5 0h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  micOff: '<svg viewBox="0 0 24 24"><path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 1 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5z"/><path d="M18.5 11a6.5 6.5 0 0 1-13 0M12 17.5V21m-3.5 0h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M3 3l18 18" stroke="#fff" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
  spk: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.2L12 5.2v13.6l-4.8-4.3H4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  spkLow: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.2L12 5.2v13.6l-4.8-4.3H4z"/><path d="M15.5 9.5a3.6 3.6 0 0 1 0 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  flip: '<svg viewBox="0 0 24 24"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"/><path d="M9 12.5a3 3 0 0 1 5.2-2M15 12.5a3 3 0 0 1-5.2 2M14.2 8.6v2h-2M9.8 16.4v-2h2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>',
  end: '<svg viewBox="0 0 24 24"><path d="M12 9c-3.4 0-6.5 1-8.6 2.7-.6.5-.7 1.3-.3 2l1.2 1.9c.4.6 1.2.8 1.9.5l2.6-1.1c.6-.3.9-.9.8-1.5l-.2-1.6c1.7-.6 3.5-.6 5.2 0l-.2 1.6c-.1.6.2 1.2.8 1.5l2.6 1.1c.7.3 1.5.1 1.9-.5l1.2-1.9c.4-.7.3-1.5-.3-2C18.5 10 15.4 9 12 9z"/></svg>',
  min: '<svg viewBox="0 0 24 24"><path d="M10 14H5m5 0v5m0-5-6 6M14 10h5m-5 0V5m0 5 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
  mutedBadge: '<svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 1 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5z" fill="#fff"/><path d="M3 3l18 18" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>'
};
const CSS = `<style id="cuicss">
.callov{background:linear-gradient(180deg,#1E3A8A 0%,#2563EB 38%,#0EA5E9 75%,#14B8A6 100%)!important;padding:calc(10px + env(safe-area-inset-top,0px)) 14px calc(18px + env(safe-area-inset-bottom,0px))!important}
.callov::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 28%,rgba(255,255,255,.22),transparent 55%);pointer-events:none}
.cu-top{position:relative;display:flex;align-items:center;justify-content:space-between;height:44px}
.cu-ib{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;background:rgba(255,255,255,.12)}
.cu-ib svg{width:24px;height:24px}
.cu-cnt{font-size:13px;font-weight:600;background:rgba(0,0,0,.18);padding:6px 12px;border-radius:16px;color:#fff}
.cu-hero{position:relative;display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:6vh;text-align:center}
.cu-hero .cu-av{border-radius:50%;padding:5px;background:rgba(255,255,255,.25);box-shadow:0 10px 30px rgba(0,0,0,.25)}
.cu-hero .cu-av.talk{animation:cuTalk 1s ease-in-out infinite}
.cu-hero b{font-size:24px;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.25)}
.cu-hero span{font-size:15px;opacity:.92}
@keyframes cuTalk{50%{box-shadow:0 0 0 10px rgba(255,255,255,.18),0 10px 30px rgba(0,0,0,.25)}}
.callov .cgrid{position:relative;margin:12px 0!important}
.callov .ctile{background:rgba(0,0,0,.18)!important;border:2px solid transparent;transition:border-color .2s}
.callov .ctile.talk{border-color:#4ADE80}
.cu-mb{position:absolute;right:8px;top:8px;background:rgba(220,38,38,.9);border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center}
.callov .clocal{bottom:120px!important;border-radius:16px!important}
.cu-bar{position:relative;display:flex;justify-content:space-around;align-items:center;gap:8px;padding:12px 10px;margin-top:auto;background:rgba(0,0,0,.22);border-radius:30px;backdrop-filter:blur(8px)}
.cu-b{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.18);color:#fff;transition:transform .12s,background .15s}
.cu-b:active{transform:scale(.92)}
.cu-b svg{width:27px;height:27px;fill:currentColor}
.cu-b.off{background:#fff;color:#0f172a}
.cu-b.on{background:#fff;color:#2563EB}
.cu-b.end{background:#EF4444;width:62px;height:62px}
.cu-b.end svg{width:32px;height:32px}
.cu-b[hidden],.cu-w[hidden]{display:none!important}
.cu-l{font-size:10.5px;text-align:center;margin-top:4px;opacity:.9}
.cu-w{display:flex;flex-direction:column;align-items:center}
/*pill*/.cu-pill{position:fixed;right:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:65;background:#16A34A;color:#fff;border-radius:28px;padding:10px 16px;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;box-shadow:0 10px 24px rgba(0,0,0,.3);animation:cuPulse 2s infinite}
@keyframes cuPulse{50%{box-shadow:0 0 0 8px rgba(22,163,74,.25),0 10px 24px rgba(0,0,0,.3)}}
</style>`;
const st = () => { if (!document.getElementById('cuicss')) document.head.insertAdjacentHTML('beforeend', CSS); };
const fmt = t => String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
let cu = { title: '', talking: {}, muted: {}, loud: false, micOff: false, camOff: true };

function setBtn(id, cls, icon, label) {
  const b = document.getElementById(id); if (!b) return;
  b.className = 'cu-b' + (cls ? ' ' + cls : ''); b.innerHTML = icon;
  const l = document.getElementById(id + '-l'); if (l && label) l.textContent = label;
}
function paintBtns() {
  setBtn('cmic', cu.micOff ? 'off' : '', cu.micOff ? I.micOff : I.mic, cu.micOff ? 'আনমিউট' : 'মিউট');
  setBtn('ccam', cu.camOff ? 'off' : '', cu.camOff ? I.camOff : I.cam, cu.camOff ? 'ক্যামেরা' : 'ক্যামেরা বন্ধ');
  setBtn('cspk', cu.loud ? 'on' : '', cu.loud ? I.spk : I.spkLow, cu.loud ? 'লাউড' : 'স্পিকার');
  const f = document.getElementById('cflip-w'); if (f) f.hidden = cu.camOff;
}
function applyVolume() {
  Object.values(call.remotes).forEach(r => { try { r.user && r.user.audioTrack && r.user.audioTrack.setVolume(cu.loud ? 250 : 100); } catch (e) {} });
}
function minimize() { if (window.uxMinCall) return window.uxMinCall(); const ov = document.getElementById('callov'); if (ov) ov.style.display = 'none'; }

joinCall = async function (channel, kind, title) {
  if (call.client) { const ov = document.getElementById('callov'); if (ov && ov.style.display === 'none') { ov.style.display = ''; const p = document.getElementById('uxcallpill'); if (p) p.hidden = true; return; } return toast('আপনি ইতিমধ্যে একটা কলে আছেন'); }
  closeIncoming(); st();
  call.kind = kind; call.remotes = {};
  cu = { title: title || 'Call', talking: {}, muted: {}, loud: false, micOff: false, camOff: kind !== 'video' };
  const ov = document.createElement('div'); ov.className = 'callov'; ov.id = 'callov';
  ov.innerHTML = `<div class="cu-top"><button class="cu-ib" id="cmin" title="ছোট করুন">${I.min}</button><span class="cu-cnt" id="ccnt">${kind === 'video' ? '🎥 ভিডিও কল' : '📞 অডিও কল'}</span><span style="width:42px"></span><span id="uxmin" style="display:none"></span></div>
    <div class="cgrid" id="cgrid"></div>
    <div class="clocal" id="clocal" ${kind === 'video' ? '' : 'hidden'}></div>
    <div class="cu-bar">
      <div class="cu-w"><button class="cu-b" id="ccam"></button><div class="cu-l" id="ccam-l"></div></div>
      <div class="cu-w"><button class="cu-b" id="cmic"></button><div class="cu-l" id="cmic-l"></div></div>
      <div class="cu-w" id="cflip-w"><button class="cu-b" id="cflip">${I.flip}</button><div class="cu-l">ঘোরান</div></div>
      <div class="cu-w"><button class="cu-b" id="cspk"></button><div class="cu-l" id="cspk-l"></div></div>
      <div class="cu-w"><button class="cu-b end" id="cend">${I.end}</button><div class="cu-l">শেষ</div></div>
    </div>`;
  document.body.appendChild(ov);
  paintBtns();
  document.getElementById('cend').onclick = () => leaveCall();
  document.getElementById('cmin').onclick = minimize;
  document.getElementById('cspk').onclick = () => { cu.loud = !cu.loud; applyVolume(); paintBtns(); toast(cu.loud ? '🔊 লাউড মোড চালু' : '🔈 সাধারণ ভলিউম'); };
  document.getElementById('cmic').onclick = async () => { cu.micOff = !cu.micOff; paintBtns(); try { if (call.mic) await call.mic.setMuted(cu.micOff); } catch (e) {} toast(cu.micOff ? '🔇 আপনার মাইক বন্ধ' : '🎤 মাইক চালু'); };
  document.getElementById('ccam').onclick = async () => {
    if (!call.client || !call.start) return toast('সংযোগ হওয়ার পর চাপুন');
    try {
      if (!call.cam) {
        call.cam = await AgoraRTC.createCameraVideoTrack({ encoderConfig: '480p_1' });
        await call.client.publish([call.cam]);
        const lc = document.getElementById('clocal'); lc.hidden = false; lc.style.visibility = 'visible'; call.cam.play('clocal');
        cu.camOff = false;
      } else {
        cu.camOff = !cu.camOff; await call.cam.setMuted(cu.camOff);
        document.getElementById('clocal').style.visibility = cu.camOff ? 'hidden' : 'visible';
      }
      paintBtns();
    } catch (e) { toast('ক্যামেরা চালু করা যায়নি — অনুমতি দিন'); }
  };
  document.getElementById('cflip').onclick = async () => {
    try { const cams = await AgoraRTC.getCameras(); if (cams.length < 2) return toast('অন্য ক্যামেরা নেই');
      const cur = call.cam.getTrackLabel(); const next = cams.find(c => c.label !== cur) || cams[0]; await call.cam.setDevice(next.deviceId);
    } catch (e) { toast('ক্যামেরা বদলানো যায়নি'); }
  };
  drawCallGrid();
  try {
    await loadAgora();
    AgoraRTC.setLogLevel(3);
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    call.client = client;
    client.on('user-published', async (user, type) => {
      await client.subscribe(user, type);
      call.remotes[user.uid] = call.remotes[user.uid] || { user };
      if (type === 'audio') { user.audioTrack.play(); try { user.audioTrack.setVolume(cu.loud ? 250 : 100); } catch (e) {} delete cu.muted[user.uid]; }
      drawCallGrid();
    });
    client.on('user-joined', user => { call.remotes[user.uid] = call.remotes[user.uid] || { user }; drawCallGrid(); });
    client.on('user-unpublished', (user, type) => { if (type === 'audio') cu.muted[user.uid] = true; drawCallGrid(); });
    client.on('user-info-updated', (uid, msg) => { if (msg === 'mute-audio') cu.muted[uid] = true; else if (msg === 'unmute-audio') delete cu.muted[uid]; drawCallGrid(); });
    client.on('user-left', user => { delete call.remotes[user.uid]; drawCallGrid(); if (!Object.keys(call.remotes).length && call.start) toast('অন্যজন কল ছেড়ে গেছেন'); });
    client.enableAudioVolumeIndicator();
    client.on('volume-indicator', vols => {
      const now = {}; vols.forEach(v => { if (v.level > 6) now[v.uid] = 1; });
      cu.talking = now;
      document.querySelectorAll('.callov [data-tuid]').forEach(el => el.classList.toggle('talk', !!now[el.dataset.tuid]));
    });
    const tk = await getCallToken(channel);
    client.on('token-privilege-will-expire', async () => { try { const r = await getCallToken(channel); await client.renewToken(r.token); } catch (e) {} });
    await client.join(tk.appId, channel, tk.token, tk.uid);
    call.mic = await AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true, AGC: true });
    if (cu.micOff) await call.mic.setMuted(true);
    const tracks = [call.mic];
    if (kind === 'video') { call.cam = await AgoraRTC.createCameraVideoTrack({ encoderConfig: '480p_1' }); tracks.push(call.cam); call.cam.play('clocal'); }
    await client.publish(tracks);
    call.start = Date.now();
    paintBtns();
    call.timer = setInterval(() => {
      const t = Math.floor((Date.now() - call.start) / 1000);
      const el = document.getElementById('ctime'); if (el && Object.keys(call.remotes).length) el.textContent = fmt(t);
      const pt = document.getElementById('uxcpt'); if (pt) pt.textContent = fmt(t);
    }, 1000);
    drawCallGrid();
  } catch (e) {
    const m = (e && (e.message || e.code || '')) + '';
    leaveCall(true);
    if (/PERMISSION|NotAllowed|denied/i.test(m)) toast('মাইক/ক্যামেরার অনুমতি দিন: ব্রাউজারের ঠিকানাবারের 🔒 → Permissions');
    else if (/Failed to fetch|network|NETWORK/i.test(m)) toast('ইন্টারনেট সংযোগ চেক করুন');
    else if (/TOKEN:Call expired/.test(m)) toast('এই কলটা অনেক আগের, নতুন কল দিন।');
    else if (/TOKEN:Not allowed/.test(m)) toast('এই কলে যোগ দেওয়ার অনুমতি নেই।');
    else if (/TOKEN:/.test(m)) toast('কলের টোকেন পাওয়া যায়নি। অ্যাডমিনকে জানান। ' + m.slice(6, 60));
    else toast('কল শুরু করা যায়নি: ' + m.slice(0, 80));
  }
};

drawCallGrid = function () {
  const g = document.getElementById('cgrid'); if (!g) return;
  const ids = Object.keys(call.remotes);
  const ccnt = document.getElementById('ccnt'); if (ccnt && ids.length > 1) ccnt.textContent = '👥 ' + (ids.length + 1) + ' জন';
  const hasVid = ids.some(uid => { const r = call.remotes[uid]; return r.user && r.user.hasVideo && r.user.videoTrack; });
  if (ids.length <= 1 && !hasVid) {
    const uid = ids[0]; const n = uid ? nameForUid(Number(uid)) : cu.title; const pid = uid ? idForUid(Number(uid)) : cu.title;
    const status = !call.start ? 'সংযোগ হচ্ছে…' : !uid ? 'কল করা হচ্ছে…' : (call.start ? fmt(Math.floor((Date.now() - call.start) / 1000)) : '');
    g.className = 'cgrid'; g.style.display = 'block';
    g.innerHTML = `<div class="cu-hero"><div class="cu-av ${uid && cu.talking[uid] ? 'talk' : ''}" ${uid ? 'data-tuid="' + uid + '"' : ''}>${avatar(n, pid, 120)}</div><b>${esc(n)}</b><span id="ctime">${status}</span>${uid && cu.muted[uid] ? '<span>🔇 মাইক বন্ধ রেখেছেন</span>' : ''}</div>`;
    return;
  }
  g.style.display = '';
  g.className = 'cgrid n' + Math.min(ids.length, 4);
  g.innerHTML = ids.map(uid => { const r = call.remotes[uid], hasV = r.user && r.user.hasVideo && r.user.videoTrack; const n = nameForUid(Number(uid));
    return `<div class="ctile ${cu.talking[uid] ? 'talk' : ''}" data-tuid="${uid}">${hasV ? `<div class="rv" id="rv-${uid}"></div>` : `<div class="cav">${avatar(n, idForUid(Number(uid)), 76)}</div>`}<span class="cname">${esc(n)}</span>${cu.muted[uid] ? '<span class="cu-mb">' + I.mutedBadge + '</span>' : ''}</div>`; }).join('');
  ids.forEach(uid => { const r = call.remotes[uid]; if (r.user && r.user.hasVideo && r.user.videoTrack) { const el = document.getElementById('rv-' + uid); if (el) r.user.videoTrack.play(el); } });
};

const _leave = leaveCall;
leaveCall = async function (silent) { const p = document.getElementById('uxcallpill'); if (p) p.hidden = true; return _leave(silent === true); };
}

/* 🔔 Ringtone for incoming calls (phone-style double ring, loops until answered/declined) */
{
let rCtx = null, rLoop = null, rVib = null;
const getCtx = () => { try { if (!rCtx) rCtx = new (window.AudioContext || window.webkitAudioContext)(); if (rCtx.state === 'suspended') rCtx.resume(); } catch (e) {} return rCtx; };
/* browsers only allow sound after the user has touched the app once — unlock early */
['pointerdown', 'touchstart', 'keydown'].forEach(ev => document.addEventListener(ev, () => getCtx(), { capture: true, passive: true }));
function tone(ctx, t0, dur) {
  [440, 480].forEach(f => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.22, t0 + 0.03);
    g.gain.setValueAtTime(0.22, t0 + dur - 0.05); g.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  });
}
function ringOnce() {
  const ctx = getCtx(); if (!ctx) return;
  const t = ctx.currentTime + 0.05;
  tone(ctx, t, 0.4); tone(ctx, t + 0.6, 0.4);           /* tring-tring */
}
ringTone = function (on) {
  clearInterval(rLoop); rLoop = null; clearInterval(rVib); rVib = null;
  try { navigator.vibrate && navigator.vibrate(0); } catch (e) {}
  if (!on) return;
  ringOnce(); rLoop = setInterval(ringOnce, 2600);
  const vib = () => { try { navigator.vibrate && navigator.vibrate([700, 300, 700]); } catch (e) {} };
  vib(); rVib = setInterval(vib, 2600);
};
}
