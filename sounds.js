/* 🔔 Sounds & notifications — in-app tones, full call-tone lifecycle, user settings.
   All tones are synthesised on the fly (original, no audio files, nothing copied from other apps). */
{
const PKEY = 'yg_sound_prefs';
const DEF = { msg: true, group: true, ring: true, outgoing: true, task: true, notice: true, vib: true, inapp: true, ringtone: 'classic', tone: 'chime' };
let P = Object.assign({}, DEF);
try { Object.assign(P, JSON.parse(localStorage.getItem(PKEY) || '{}')); } catch (e) {}
const groupIds = () => { try { return (ui.convs || []).filter(c => c.type === 'group').map(c => c.id); } catch (e) { return []; } };
/* the service worker reads these to decide which phone notifications stay silent */
async function syncSW() { try { const c = await caches.open('yg-prefs'); await c.put('./yg-sound-prefs', new Response(JSON.stringify(Object.assign({}, P, { groups: groupIds() })), { headers: { 'content-type': 'application/json' } })); } catch (e) {} }
function save() { try { localStorage.setItem(PKEY, JSON.stringify(P)); } catch (e) {} syncSW(); }
setTimeout(syncSW, 4000); setInterval(syncSW, 5 * 60000);

/* ---------- audio engine ---------- */
let AC = null;
const ctx = () => { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) {} return AC; };
['pointerdown', 'touchstart', 'keydown'].forEach(ev => document.addEventListener(ev, () => ctx(), { capture: true, passive: true }));
function note(f, t, d, v, type) {
  const c = ctx(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain(), s = c.currentTime + 0.03 + t;
  o.type = type || 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(v || 0.18, s + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, s + d);
  o.connect(g); g.connect(c.destination); o.start(s); o.stop(s + d + 0.05);
}
function flat(freqs, t, d, v) {
  const c = ctx(); if (!c) return;
  const s = c.currentTime + 0.03 + t;
  freqs.forEach(f => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = f;
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(v || 0.1, s + 0.02); g.gain.setValueAtTime(v || 0.1, s + d - 0.03); g.gain.linearRampToValueAtTime(0, s + d);
    o.connect(g); g.connect(c.destination); o.start(s); o.stop(s + d + 0.05); });
}
const vib = p => { if (!P.vib) return; try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

const TONES = {
  chime: { n: 'চাইম', f: () => { note(880, 0, .35, .17); note(1318.5, .12, .5, .14); } },
  pop:   { n: 'পপ', f: () => { note(660, 0, .12, .2, 'triangle'); note(990, .07, .16, .17, 'triangle'); } },
  bell:  { n: 'বেল', f: () => { note(1046.5, 0, .9, .13); note(2093, 0, .45, .04); } },
  soft:  { n: 'সফট', f: () => { note(523.25, 0, .3, .14); note(659.25, .14, .32, .12); note(783.99, .28, .45, .11); } }
};
const FX = {
  task:   () => { note(740, 0, .1, .17, 'triangle'); note(740, .14, .1, .17, 'triangle'); note(988, .28, .25, .15, 'triangle'); },
  notice: () => { note(659.25, 0, .25, .14); note(880, .18, .25, .13); note(1174.7, .36, .5, .12); },
  general:() => { note(880, 0, .18, .14, 'triangle'); },
  missed: () => { note(784, 0, .2, .16); note(659.25, .2, .2, .15); note(523.25, .4, .4, .14); },
  connected: () => { note(660, 0, .12, .16); note(880, .14, .2, .16); },
  ended:  () => { note(880, 0, .12, .16); note(587.3, .15, .3, .15); },
  busy:   () => { for (let i = 0; i < 4; i++) flat([480, 620], i * 1.0, .5, .09); }
};
const RINGS = {
  classic: { n: 'ক্লাসিক', p: 2600, f: () => { flat([440, 480], 0, .4, .12); flat([440, 480], .6, .4, .12); } },
  marimba: { n: 'মারিম্বা', p: 2400, f: () => [784, 988, 1175, 988, 784, 988].forEach((x, i) => note(x, i * .14, .3, .17, 'triangle')) },
  pulse:   { n: 'পালস', p: 2200, f: () => { [0, .25, .5].forEach(t => note(740, t, .18, .17, 'square')); } }
};

/* ---------- notification sounds (app open) ---------- */
let lastPlay = 0;
function playCat(cat) {
  if (!P.inapp || document.visibilityState !== 'visible') return;
  if (Date.now() - lastPlay < 700) return;   /* no overlapping/duplicate sounds */
  const map = { msg: 'msg', group: 'group', task: 'task', notice: 'notice' };
  if (map[cat] && P[map[cat]] === false) return;
  lastPlay = Date.now();
  if (cat === 'msg' || cat === 'group') (TONES[P.tone] || TONES.chime).f();
  else if (FX[cat]) FX[cat](); else FX.general();
  vib(cat === 'msg' || cat === 'group' ? 120 : [100, 80, 100]);
}
if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', ev => {
  const d = ev.data || {}; if (d.type !== 'yg-sound') return;
  let cat = d.cat;
  if (cat === 'msg') { try { const m = /[?&]c=([0-9a-f-]+)/.exec(d.url || ''); const cv = m && ui.convs.find(c => c.id === m[1]); if (cv && cv.type === 'group') cat = 'group'; if (m && ui.openConv === m[1]) return; } catch (e) {} }
  if (cat === 'call') return;               /* the in-app call screen rings instead */
  playCat(cat);
});

/* ---------- ringtone / ringback loops (single owner → never overlap) ---------- */
let loop = null, loopVib = null, loopKind = '';
function stopLoop() { clearInterval(loop); loop = null; clearInterval(loopVib); loopVib = null; loopKind = ''; try { navigator.vibrate && navigator.vibrate(0); } catch (e) {} }
function startLoop(kind) {
  if (loopKind === kind) return; stopLoop(); loopKind = kind;
  if (kind === 'ring') {
    const r = RINGS[P.ringtone] || RINGS.classic;
    if (P.ring) { r.f(); loop = setInterval(r.f, r.p); }
    if (P.vib) { const v = () => vib([700, 300, 700]); v(); loopVib = setInterval(v, r.p); }
  } else if (kind === 'ringback' && P.outgoing) {
    const f = () => flat([425], 0, 1.0, .08); f(); loop = setInterval(f, 4000);
  }
}
ringTone = function (on) { if (on) startLoop('ring'); else if (loopKind === 'ring') stopLoop(); };

/* ---------- call lifecycle: ringback, connected, busy/rejected, cancel, missed, ended ---------- */
const sig = {};                        /* realtime signalling channels per call id */
function sigCh(id, onMsg) {
  if (sig[id]) { if (onMsg) sig[id].h = onMsg; return sig[id]; }
  const s = { h: onMsg, ch: sb.channel('ygcall-' + id, { config: { broadcast: { self: false } } }) };
  s.ch.on('broadcast', { event: 'sig' }, ({ payload }) => { try { s.h && s.h(payload || {}); } catch (e) {} }).subscribe();
  sig[id] = s; return s;
}
function sigSend(id, t) { try { const s = sigCh(id); const go = () => s.ch.send({ type: 'broadcast', event: 'sig', payload: { t, from: state.profile.id } }); go(); setTimeout(go, 700); } catch (e) {} }
function sigClose(id) { const s = sig[id]; if (!s) return; delete sig[id]; setTimeout(() => { try { sb.removeChannel(s.ch); } catch (e) {} }, 1500); }
const sendMissed = id => { try { sb.rpc('yg_call_missed', { p_msg: id }).then(() => {}, () => {}); } catch (e) {} };

let watch = null;
function watchCall(id, outgoing, convType) {
  clearInterval(watch);
  const st = { id, outgoing, one: convType !== 'group', answered: false, timedOut: false, rejected: false, seenClient: false, emptySince: 0, began: Date.now() };
  sigCh(id, p => {
    if (p.t === 'reject' && st.outgoing && !st.answered && st.one) {
      st.rejected = true; stopLoop(); FX.busy(); vib([300, 200, 300]); toast('📵 কল কেটে দিয়েছেন');
      setTimeout(() => leaveCall(true), 2600);
    }
  });
  watch = setInterval(() => {
    const live = !!call.client, n = Object.keys(call.remotes || {}).length;
    if (live) st.seenClient = true;
    if (live && call.start && !st.answered) {
      if (n > 0) { st.answered = true; stopLoop(); FX.connected(); vib(80); }
      else if (st.outgoing && !st.rejected) {
        startLoop('ringback');
        if (Date.now() - call.start > 45000) {
          st.timedOut = true; stopLoop(); FX.busy(); toast('কেউ কল ধরেননি'); sendMissed(id); sigSend(id, 'cancel');
          setTimeout(() => leaveCall(true), 2600);
        }
      }
    }
    if (live && st.answered && st.one) {          /* 1-to-1: the other person left → end the call */
      if (n === 0) { if (!st.emptySince) st.emptySince = Date.now(); else if (Date.now() - st.emptySince > 2500) leaveCall(); } else st.emptySince = 0;
    }
    if (!live && st.seenClient) {                 /* call is over */
      clearInterval(watch); watch = null; stopLoop();
      if (st.answered) FX.ended();
      else if (st.outgoing && !st.timedOut && !st.rejected) { sigSend(id, 'cancel'); sendMissed(id); }
      sigClose(id);
    }
    if (!live && !st.seenClient && Date.now() - st.began > 20000) { clearInterval(watch); watch = null; stopLoop(); sigClose(id); }
  }, 300);
}
const _start = startCall;
startCall = async function (conv, kind) {
  if (call.client) return _start(conv, kind);
  window.__ygOutConv = conv; setTimeout(() => { if (window.__ygOutConv === conv) window.__ygOutConv = null; }, 8000); return _start(conv, kind);
};
const _join = joinCall;
joinCall = async function (channel, kind, title) {
  if (call.client) return _join(channel, kind, title);
  let conv = window.__ygOutConv || null; const outgoing = !!conv; window.__ygOutConv = null;
  if (!conv) { try { const { data } = await sb.from('messages').select('conversation_id').eq('id', channel).maybeSingle(); conv = data && ui.convs.find(c => c.id === data.conversation_id); } catch (e) {} }
  stopLoop();
  watchCall(channel, outgoing, conv && conv.type);
  return _join(channel, kind, title);
};

/* incoming popup: decline → tell the caller; caller cancels → stop ringing + missed call */
const _show = showIncoming;
showIncoming = function (msg) {
  const had = !!document.getElementById('incoming');
  _show(msg);
  const d = document.getElementById('incoming'); if (had || !d || !msg) return;
  const id = msg.id; let acted = false;
  const no = document.getElementById('idec'), yes = document.getElementById('iacc');
  if (no) no.addEventListener('click', () => { acted = true; sigSend(id, 'reject'); setTimeout(() => sigClose(id), 2000); }, true);
  if (yes) yes.addEventListener('click', () => { acted = true; }, true);
  sigCh(id, p => { if (p.t === 'cancel' && document.getElementById('incoming')) { acted = true; closeIncoming(); FX.missed(); vib([200, 100, 200]); toast('📵 মিসড কল — ' + personName(msg.sender_id)); sigClose(id); } });
  const ob = new MutationObserver(() => {
    if (document.getElementById('incoming')) return;
    ob.disconnect();
    if (!acted) { FX.missed(); vib([200, 100, 200]); toast('📵 মিসড কল — ' + personName(msg.sender_id)); sigClose(id); }
  });
  ob.observe(document.body, { childList: true });
};

/* ---------- settings screen ---------- */
const CSS = '<style id="sndcss">.snd-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 2px;border-bottom:1px solid #eef2f7}.snd-row b{font-size:14px;color:#0B2A6F}.snd-row small{display:block;font-size:11.5px;color:#64748b;font-weight:400}.snd-sw{position:relative;width:46px;height:26px;border-radius:13px;background:#cbd5e1;flex-shrink:0;transition:background .2s}.snd-sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .2s}.snd-sw.on{background:#16a34a}.snd-sw.on::after{left:23px}.snd-sel{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 2px}.snd-sel button{border:1.5px solid #dbe3ef;background:#fff;border-radius:16px;padding:6px 12px;font-size:13px}.snd-sel button.on{border-color:#1a73e8;background:#e8f0fe;color:#1a56db;font-weight:700}.snd-h{font-size:12.5px;font-weight:700;color:#64748b;margin:14px 0 2px;text-transform:uppercase;letter-spacing:.3px}.snd-tip{background:#FFF7E6;border-radius:12px;padding:10px 12px;font-size:12.5px;line-height:1.65;margin-top:12px}</style>';
const ROWS = [['msg', '💬 পার্সোনাল মেসেজ'], ['group', '👥 গ্রুপ মেসেজ'], ['ring', '📞 ইনকামিং কলের রিংটোন'], ['outgoing', '📲 আউটগোয়িং কলের টোন'], ['task', '✅ টাস্ক ও রিমাইন্ডার'], ['notice', '📢 নোটিশ ও ঘোষণা'], ['vib', '📳 ভাইব্রেশন'], ['inapp', '🔈 অ্যাপ খোলা থাকলে সাউন্ড']];
function soundSheet() {
  if (!document.getElementById('sndcss')) document.head.insertAdjacentHTML('beforeend', CSS);
  const sel = (key, obj) => '<div class="snd-sel">' + Object.keys(obj).map(k => '<button data-sel="' + key + '" data-v="' + k + '" class="' + (P[key] === k ? 'on' : '') + '">▶ ' + obj[k].n + '</button>').join('') + '</div>';
  sheet('<h3>🔔 সাউন্ড ও নোটিফিকেশন</h3>'
    + '<div class="snd-h">কোনটায় সাউন্ড হবে</div>'
    + ROWS.map(r => '<div class="snd-row"><b>' + r[1] + '</b><button class="snd-sw ' + (P[r[0]] ? 'on' : '') + '" data-k="' + r[0] + '" aria-label="' + r[1] + '"></button></div>').join('')
    + '<div class="snd-h">রিংটোন (চাপলে শুনতে পাবেন)</div>' + sel('ringtone', RINGS)
    + '<div class="snd-h">মেসেজ টোন (চাপলে শুনতে পাবেন)</div>' + sel('tone', TONES)
    + '<div class="snd-h">অন্য টোন শুনুন</div><div class="snd-sel"><button data-fx="task">✅ টাস্ক</button><button data-fx="notice">📢 নোটিশ</button><button data-fx="missed">📵 মিসড কল</button><button data-fx="connected">🔗 কল যুক্ত</button><button data-fx="ended">⏹ কল শেষ</button><button data-fx="busy">⛔ ব্যস্ত</button></div>'
    + '<button class="btn" id="sndtest" style="margin-top:12px">📲 ফোনে একটা টেস্ট নোটিফিকেশন পাঠান</button>'
    + '<button class="btn ghost" id="sndreset" style="margin-top:8px">↺ ডিফল্টে ফিরিয়ে নিন</button>'
    + '<div class="snd-tip"><b>অ্যাপ বন্ধ থাকলে সাউন্ড না হলে:</b><br>ফোনের Settings → Apps → <b>Yaqeen Group</b> এবং <b>Chrome</b> → Notifications → সাউন্ড/রিংটোন চালু করুন, "Silent" বা "Gentle" বন্ধ করুন।<br>HONOR/Huawei: Notifications → Yaqeen Group → <b>Sound</b> ও <b>Banners</b> চালু।<br>Xiaomi/Redmi: Notifications → <b>Sound</b> চালু, Autostart চালু।<br>Samsung: Notifications → Categories → <b>Alert</b> (Silent নয়)।<br>OPPO/Vivo: Notifications → <b>Ringtone/Sound</b> চালু, Auto-launch চালু।<br>ফোন সাইলেন্ট বা Do Not Disturb-এ থাকলে কোনো শব্দ হবে না।</div>',
  (el) => {
    el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = b.dataset.k; P[k] = !P[k]; b.classList.toggle('on', P[k]); save(); if (P[k] && k !== 'vib' && k !== 'inapp') { if (k === 'ring') RINGS[P.ringtone].f(); else if (k === 'outgoing') flat([425], 0, 1, .08); else playPreview(k); } if (k === 'vib' && P.vib) vib(200); });
    el.querySelectorAll('[data-sel]').forEach(b => b.onclick = () => { P[b.dataset.sel] = b.dataset.v; save(); el.querySelectorAll('[data-sel="' + b.dataset.sel + '"]').forEach(x => x.classList.toggle('on', x === b)); (b.dataset.sel === 'ringtone' ? RINGS : TONES)[b.dataset.v].f(); });
    el.querySelectorAll('[data-fx]').forEach(b => b.onclick = () => FX[b.dataset.fx]());
    el.querySelector('#sndreset').onclick = () => { P = Object.assign({}, DEF); save(); toast('ডিফল্ট সেটিং ফিরে এসেছে'); document.querySelector('.sheetbg') && document.querySelector('.sheetbg').remove(); soundSheet(); };
    el.querySelector('#sndtest').onclick = async () => { const { error } = await sb.rpc('yg_push_test'); if (error) return toast(friendlyError(error)); toast('টেস্ট নোটিফিকেশন পাঠানো হয়েছে — অ্যাপ ছোট করে দেখুন'); };
  });
}
function playPreview(k) { if (k === 'msg' || k === 'group') (TONES[P.tone] || TONES.chime).f(); else if (FX[k]) FX[k](); }
window.soundSheet = soundSheet; window.ygSound = { play: playCat, prefs: () => Object.assign({}, P) };

const _vmSnd = viewMenu;
viewMenu = function () {
  const r = _vmSnd(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-snd')) {
    t.insertAdjacentHTML('afterbegin', '<button class="tile" id="m-snd"><span class="ic" style="background:linear-gradient(140deg,#F59E0B,#D97706);font-size:26px">🔔</span><b>সাউন্ড</b><small>রিংটোন ও নোটিফিকেশন</small></button>');
    document.getElementById('m-snd').onclick = soundSheet;
  }
  return r;
};
}
