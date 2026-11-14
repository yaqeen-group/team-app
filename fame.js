/* ---------- 🏆 weekly fame: spotlight, crown, kudos, certificate, live ranking · animated home header ---------- */
{
const fCss = document.createElement('style');
fCss.textContent = `
.ygcr{position:relative;display:inline-block;line-height:0;border-radius:50%;box-shadow:0 0 0 2px #fff,0 0 0 4px #F5B301,0 0 12px rgba(245,179,1,.6)}
.ygcr>i{position:absolute;left:50%;top:0;transform:translate(-50%,-62%) rotate(-10deg);font-style:normal;font-size:calc(var(--s) * .5);line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.25));pointer-events:none}
#ygsp{position:fixed;inset:0;z-index:99990;background:radial-gradient(circle at 50% 18%,#1E6FE0 0,#0B2A6F 55%,#071A47 100%);color:#fff;overflow-y:auto;animation:spIn .45s ease both}
#ygsp canvas{position:fixed;inset:0;pointer-events:none;z-index:1}
#ygsp .sp{position:relative;z-index:2;max-width:480px;margin:0 auto;padding:calc(env(safe-area-inset-top,0px) + 14px) 16px 40px}
#ygsp .sp-x{position:absolute;right:12px;top:calc(env(safe-area-inset-top,0px) + 10px);width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.15);font-size:18px;color:#fff}
#ygsp .sp-h{text-align:center;font-size:13px;letter-spacing:.5px;opacity:.85;margin-top:8px}
#ygsp .sp-t{text-align:center;font-size:24px;font-weight:800;margin-top:2px;background:linear-gradient(90deg,#FFE27A,#F5B301,#FFE27A);-webkit-background-clip:text;background-clip:text;color:transparent}
#ygsp .sp-w{display:flex;flex-direction:column;align-items:center;margin-top:68px}
#ygsp .sp-av{position:relative;border-radius:50%;padding:5px;background:conic-gradient(#FFE27A,#F5B301,#FFB800,#FFE27A);animation:spGlow 2.4s ease-in-out infinite;line-height:0}
#ygsp .sp-av .av{border:3px solid #fff}
#ygsp .sp-cr{position:absolute;left:50%;top:-46px;font-size:56px;transform:translateX(-50%);animation:spCrown .9s .35s cubic-bezier(.2,1.6,.4,1) both;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))}
#ygsp .sp-n{font-size:22px;font-weight:800;margin-top:14px;text-align:center}
#ygsp .sp-d{font-size:13px;opacity:.85}
#ygsp .sp-st{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px;width:100%}
#ygsp .sp-st div{background:rgba(255,255,255,.12);border-radius:14px;padding:10px 4px;text-align:center}
#ygsp .sp-st b{display:block;font-size:20px}
#ygsp .sp-st span{font-size:11px;opacity:.85}
#ygsp .sp-pod{display:flex;justify-content:center;gap:26px;margin-top:22px}
#ygsp .sp-pod div{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12.5px;text-align:center;max-width:110px}
#ygsp .sec{margin-top:24px;font-weight:700;font-size:15px}
#ygsp .sp-cat{display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px}
#ygsp .sp-cat div{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.1);border-radius:14px;padding:10px 12px}
#ygsp .sp-cat .ic{font-size:26px}
#ygsp .sp-cat small{display:block;opacity:.8;font-size:11.5px}
#ygsp .sp-lb{margin-top:10px;background:#fff;color:#14222E;border-radius:16px;overflow:hidden}
#ygsp .sp-lb .r{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid #EEF2F7}
#ygsp .sp-lb .r.me{background:#EEF5FF}
#ygsp .sp-lb .k{width:26px;text-align:center;font-weight:800;color:#0B2A6F}
#ygsp .sp-lb .nm{flex:1;font-size:13.5px}
#ygsp .sp-lb .nm small{display:block;color:#6b7a86;font-size:11.5px}
#ygsp .up{color:#16a34a;font-weight:700;font-size:12px}#ygsp .dn{color:#dc2626;font-weight:700;font-size:12px}
#ygsp .sp-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
#ygsp .sp-btns button{border-radius:14px;padding:13px 8px;font-weight:700;font-size:14px}
#ygsp .b1{background:linear-gradient(135deg,#FFE27A,#F5B301);color:#3b2a00}
#ygsp .b2{background:rgba(255,255,255,.15);color:#fff}
#ygsp .sp-kd{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:10px;font-size:12px;opacity:.9}
#ygsp .sp-tabs{display:flex;gap:8px;justify-content:center;margin-top:12px}
#ygsp .sp-tabs button{padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:12.5px}
#ygsp .sp-tabs button.on{background:#fff;color:#0B2A6F;font-weight:700}
@keyframes spIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}
@keyframes spCrown{0%{opacity:0;transform:translate(-50%,-90px) rotate(-30deg) scale(.4)}100%{opacity:1;transform:translateX(-50%) rotate(-8deg)}}
@keyframes spGlow{0%,100%{box-shadow:0 0 18px rgba(245,179,1,.55)}50%{box-shadow:0 0 38px rgba(255,226,122,.95)}}
/* animated home header */
.hero{position:relative;overflow:hidden}
.hero>*:not(.ygbg){position:relative;z-index:1}
.ygbg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.ygbg .pth{position:absolute;inset:0;width:100%;height:100%}
.ygbg .pl{position:absolute;left:0;top:0;width:26px;height:26px;offset-path:path('M -40 175 C 90 60, 230 210, 470 30');offset-rotate:auto;animation:bgFly 11s linear infinite;opacity:.9}
.ygbg .fl{position:absolute;font-size:22px;opacity:.17;animation:bgFloat 8s ease-in-out infinite}
.ygbg .gl{position:absolute;right:-26px;top:-20px;width:150px;height:150px;opacity:.22;animation:bgSpin 40s linear infinite}
.ygbg .gl ellipse{transform-origin:75px 75px;animation:bgMer 6s linear infinite}
.ygbg .ct{position:absolute;right:8px;bottom:0;width:150px;height:90px;opacity:.13}
.ygbg .st{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;animation:bgTw 3s ease-in-out infinite}
.ygbg .sh{position:absolute;top:0;bottom:0;width:40%;left:-50%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.12),transparent);animation:bgSh 7s ease-in-out infinite}
@keyframes bgFly{0%{offset-distance:0%;opacity:0}8%{opacity:.9}88%{opacity:.9}100%{offset-distance:100%;opacity:0}}
@keyframes bgFloat{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-14px) rotate(6deg)}}
@keyframes bgSpin{to{transform:rotate(360deg)}}
@keyframes bgMer{0%{transform:scaleX(1)}50%{transform:scaleX(.15)}100%{transform:scaleX(1)}}
@keyframes bgTw{0%,100%{opacity:.15}50%{opacity:.8}}
@keyframes bgSh{0%,60%{left:-50%}100%{left:130%}}
@media (prefers-reduced-motion:reduce){.ygbg *{animation:none!important}#ygsp *{animation:none!important}}
`;
document.head.appendChild(fCss);

const fDate = d => new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
const fAdd = (d, n) => new Date(Date.parse(d + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10);
const fWs = () => { const t = todayDhaka(), dw = new Date(t + 'T00:00:00Z').getUTCDay(); return fAdd(t, -((dw + 1) % 7)); };
const fName = id => (ui.people && ui.people[id] && ui.people[id].full_name) || 'সদস্য';
const fDes = id => (ui.people && ui.people[id] && ui.people[id].designation) || '';
const bnN = v => Number(v || 0).toLocaleString('bn-BD');

/* 👑 crown for last week's #1 everywhere (avatar() checks window.ygCrown) */
window.ygCrown = new Set();
let fLatest = null;
async function fLoadCrown() {
  try {
    const { data } = await sb.from('yg_award_log').select('week_start,user_id,place').order('week_start', { ascending: false }).limit(6);
    if (!data || !data.length) return;
    fLatest = data[0].week_start;
    window.ygCrown = new Set(data.filter(r => r.week_start === fLatest && r.place === 1).map(r => r.user_id));
  } catch (e) {}
}

/* confetti */
function fConfetti(host) {
  const c = document.createElement('canvas'); host.appendChild(c);
  const x = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight, col = ['#FFE27A', '#F5B301', '#22C3F3', '#ffffff', '#E11D2E', '#22C55E', '#A78BFA'];
  const ps = [...Array(160)].map(() => ({ x: Math.random() * W, y: -20 - Math.random() * H * .6, r: 4 + Math.random() * 6, c: col[Math.floor(Math.random() * col.length)], vy: 2 + Math.random() * 3.5, vx: -1.5 + Math.random() * 3, a: Math.random() * 6, va: -.2 + Math.random() * .4 }));
  const t0 = performance.now();
  (function f(t) {
    if (!c.isConnected) return; x.clearRect(0, 0, W, H);
    const fade = Math.max(0, 1 - (t - t0 - 3500) / 1500);
    ps.forEach(p => { p.y += p.vy; p.x += p.vx + Math.sin(p.y / 30); p.a += p.va; x.save(); x.globalAlpha = fade; x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 3, p.r, p.r / 1.6); x.restore(); });
    if (fade > 0) requestAnimationFrame(f); else c.remove();
  })(t0);
}

/* spotlight: ws = week start (closed week) | 'live' | null (latest) */
async function ygSpotlight(ws) {
  if (!state.profile) return;
  await loadPeople(); await fLoadCrown();
  const live = ws === 'live';
  if (!ws || ws === 'null') ws = fLatest; if (!live && !ws) ws = 'live';
  const wk = ws === 'live' ? fWs() : ws, prev = fAdd(wk, -7);
  document.getElementById('ygsp')?.remove();
  const ov = document.createElement('div'); ov.id = 'ygsp';
  ov.innerHTML = '<div class="sp"><button class="sp-x" id="spx">✕</button><div class="cen" style="padding-top:120px"><div class="spin"></div></div></div>';
  document.body.appendChild(ov);
  ov.querySelector('#spx').onclick = () => ov.remove();
  const [aw, log, perf, pun, kd] = await Promise.all([
    sb.rpc('weekly_awards', { p_weeks: 10 }), sb.from('yg_award_log').select('*').eq('week_start', wk),
    sb.rpc('yg_perf_trend', { p_from: prev, p_to: fAdd(wk, 6), p_bucket: 'week' }), sb.rpc('yg_week_punctual', { p_ws: wk }),
    sb.from('yg_kudos').select('to_user,from_user').eq('week_start', wk)]);
  if (!document.getElementById('ygsp')) return;
  const rows = (aw.data || []), cur = rows.filter(r => r.week_start === wk).sort((a, b) => a.place - b.place), pw = rows.filter(r => r.week_start === prev);
  const winners = ws === 'live' ? cur.slice(0, 3).map(r => ({ user_id: r.user_id, place: r.place, completed: r.completed, on_time: r.on_time })) : (log.data || []).sort((a, b) => a.place - b.place);
  const pf = perf.data || [], sc = (u, w) => (pf.find(r => r.user_id === u && r.bucket === w) || {});
  const me = state.profile.id, kds = kd.data || [];
  const w1 = winners.find(w => w.place === 1);
  const people = Object.values(ui.people).filter(p => !p.observer);
  /* category awards */
  const imp = people.map(p => ({ id: p.id, d: (sc(p.id, wk).score ?? null) != null && (sc(p.id, prev).score ?? null) != null ? sc(p.id, wk).score - sc(p.id, prev).score : null })).filter(x => x.d != null && x.d > 0).sort((a, b) => b.d - a.d)[0];
  const tch = people.map(p => ({ id: p.id, v: sc(p.id, wk).target_pct })).filter(x => x.v != null && x.v > 0).sort((a, b) => b.v - a.v)[0];
  const pdata = (pun.data || []).filter(x => ui.people[x.user_id]); const minDed = pdata.length ? Math.min(...pdata.map(x => x.ded)) : null; const punW = minDed == null ? [] : pdata.filter(x => x.ded === minDed).map(x => x.user_id);
  const lb = people.map(p => { const r = cur.find(x => x.user_id === p.id), q = pw.find(x => x.user_id === p.id); return { p, r, mv: r && q ? q.place - r.place : null, s: sc(p.id, wk).score }; }).sort((a, b) => (a.r ? a.r.place : 99) - (b.r ? b.r.place : 99) || (b.s || 0) - (a.s || 0));
  const myK = w1 && kds.some(k => k.to_user === w1.user_id && k.from_user === me), nK = w1 ? kds.filter(k => k.to_user === w1.user_id).length : 0;
  const range = fDate(wk) + ' – ' + fDate(fAdd(wk, 6));
  const box = ov.querySelector('.sp');
  box.innerHTML = '<button class="sp-x" id="spx">✕</button>'
    + '<div class="sp-tabs"><button data-w="' + (fLatest || '') + '" class="' + (ws !== 'live' ? 'on' : '') + '">🏆 গত সপ্তাহের সেরা</button><button data-w="live" class="' + (ws === 'live' ? 'on' : '') + '">📈 এই সপ্তাহ (লাইভ)</button></div>'
    + '<div class="sp-h">' + range + (ws === 'live' ? ' · এখন পর্যন্ত' : '') + '</div><div class="sp-t">' + (ws === 'live' ? 'এই সপ্তাহে এগিয়ে আছেন' : '🏆 সপ্তাহের সেরা') + '</div>'
    + (w1 ? '<div class="sp-w"><div class="sp-av"><span class="sp-cr">👑</span>' + avatarInner(fName(w1.user_id), w1.user_id, 116) + '</div><div class="sp-n">' + esc(fName(w1.user_id)) + '</div><div class="sp-d">' + esc(fDes(w1.user_id)) + '</div>'
      + '<div class="sp-st"><div><b>' + bnN(w1.completed) + '</b><span>✅ টাস্ক শেষ</span></div><div><b>' + bnN(w1.on_time) + '</b><span>⏱️ সময়মতো</span></div><div><b>' + (sc(w1.user_id, wk).score != null ? sc(w1.user_id, wk).score + '%' : '—') + '</b><span>📈 স্কোর</span></div></div></div>'
      : '<div class="sp-w"><div style="font-size:60px">🏁</div><div class="sp-n">এখনো কেউ র‍্যাংকিংয়ে আসেননি</div><div class="sp-d">অন্তত ২টা টাস্ক শেষ করলে র‍্যাংকিংয়ে নাম আসবে</div></div>')
    + (winners.length > 1 ? '<div class="sp-pod">' + winners.filter(w => w.place > 1).map(w => '<div><span style="font-size:24px">' + (w.place === 2 ? '🥈' : '🥉') + '</span>' + avatarInner(fName(w.user_id), w.user_id, 58) + '<b>' + esc(fName(w.user_id)) + '</b><span style="opacity:.8">' + bnN(w.on_time) + 'টা সময়মতো</span></div>').join('') + '</div>' : '')
    + (ws !== 'live' && w1 ? '<div class="sp-btns"><button class="b1" id="spk" ' + (myK || w1.user_id === me ? 'disabled style="opacity:.7"' : '') + '>👏 ' + (w1.user_id === me ? 'অভিনন্দন পেয়েছেন' : myK ? 'অভিনন্দন জানিয়েছেন' : 'অভিনন্দন জানান') + ' (' + bnN(nK) + ')</button><button class="b2" id="spc">📜 সার্টিফিকেট</button></div><div class="sp-kd">' + kds.filter(k => k.to_user === w1.user_id).map(k => '<span>👏 ' + esc(fName(k.from_user)) + '</span>').join(' · ') + '</div>' : '')
    + '<div class="sec">🏅 বিশেষ পুরস্কার</div><div class="sp-cat">'
    + '<div><span class="ic">📈</span><span><b>সবচেয়ে বেশি উন্নতি</b><small>' + (imp ? esc(fName(imp.id)) + ' — আগের সপ্তাহের চেয়ে +' + bnN(imp.d) + ' পয়েন্ট' : 'এই সপ্তাহে কেউ নেই') + '</small></span></div>'
    + '<div><span class="ic">🎯</span><span><b>টার্গেট চ্যাম্পিয়ন</b><small>' + (tch ? esc(fName(tch.id)) + ' — দৈনিক টার্গেটের ' + bnN(tch.v) + '%' : 'এই সপ্তাহে কেউ নেই') + '</small></span></div>'
    + '<div><span class="ic">⏰</span><span><b>সেরা সময়ানুবর্তী</b><small>' + (punW.length && punW.length <= 3 ? punW.map(u => esc(fName(u))).join(', ') + (minDed === 0 ? ' — একবারও দেরি নেই' : ' — সবচেয়ে কম দেরি') : punW.length ? 'সবাই সময়মতো 👏' : '—') + '</small></span></div></div>'
    + '<div class="sec">📊 সবার অবস্থান</div><div class="sp-lb">' + lb.map((x, i) => '<div class="r ' + (x.p.id === me ? 'me' : '') + '"><span class="k">' + (x.r ? (x.r.place <= 3 ? ['🥇', '🥈', '🥉'][x.r.place - 1] : x.r.place) : '–') + '</span>' + avatar(x.p.full_name, x.p.id, 36) + '<span class="nm"><b>' + esc(x.p.full_name) + '</b><small>' + (x.r ? bnN(x.r.completed) + 'টা শেষ · ' + bnN(x.r.on_time) + 'টা সময়মতো' : 'এখনো র‍্যাংকিংয়ে নেই') + (x.s != null ? ' · স্কোর ' + x.s + '%' : '') + '</small></span>' + (x.mv > 0 ? '<span class="up">▲' + bnN(x.mv) + '</span>' : x.mv < 0 ? '<span class="dn">▼' + bnN(-x.mv) + '</span>' : '') + '</div>').join('') + '</div>'
    + (ws === 'live' ? (() => { const mine = cur.find(r => r.user_id === me), lead = cur[0]; return '<div class="sp-cat" style="margin-top:14px"><div><span class="ic">💪</span><span><b>' + (mine ? (mine.place === 1 ? 'আপনি এখন ১ নম্বরে!' : 'আপনি এখন ' + bnN(mine.place) + ' নম্বরে') : 'আপনি এখনো র‍্যাংকিংয়ে নেই') + '</b><small>' + (mine && lead && mine.place > 1 ? '১ নম্বর হতে আর ' + bnN(Math.max(1, lead.on_time - mine.on_time + 1)) + 'টা টাস্ক সময়মতো শেষ করুন' : mine ? 'শনিবার পর্যন্ত জায়গাটা ধরে রাখুন' : 'অন্তত ২টা টাস্ক সময়মতো শেষ করলেই নাম আসবে') + '</small></span></div></div>'; })() : '')
    + '<div class="sp-d" style="text-align:center;margin-top:16px">র‍্যাংকিং হয় সপ্তাহে কয়টা টাস্ক সময়মতো শেষ হয়েছে তা দিয়ে। প্রতি শনিবার সকালে সেরা ঘোষণা হয়।</div>';
  box.querySelector('#spx').onclick = () => ov.remove();
  box.querySelectorAll('[data-w]').forEach(b => b.onclick = () => ygSpotlight(b.dataset.w || null));
  const kb = box.querySelector('#spk');
  if (kb && !kb.disabled) kb.onclick = async () => { kb.disabled = true; const { error } = await sb.from('yg_kudos').insert({ week_start: wk, to_user: w1.user_id }); if (error && !/duplicate/i.test(error.message)) { kb.disabled = false; return toast(friendlyError(error)); } toast('👏 অভিনন্দন পাঠানো হয়েছে'); ygSpotlight(ws); };
  const cb = box.querySelector('#spc'); if (cb) cb.onclick = () => fCert(w1, wk, sc(w1.user_id, wk).score);
  if (ws !== 'live' && w1) { fConfetti(ov); try { localStorage.setItem('yg_seen_aw', wk); } catch (e) {} }
}
window.ygSpotlight = ygSpotlight;

/* 📜 certificate image (MY TravelMate) */
async function fCert(w, wk, score) {
  toast('সার্টিফিকেট তৈরি হচ্ছে…');
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1350; const x = c.getContext('2d');
  const load = src => new Promise(res => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const [logo, ph] = await Promise.all([load('https://mytravelmateofficial.com/wp-content/uploads/2026/10/mytravelmate-logo.png'), photoOf(w.user_id) ? load(photoOf(w.user_id)) : null]);
  x.fillStyle = '#fff'; x.fillRect(0, 0, 1080, 1350);
  x.fillStyle = '#E11D2E'; x.beginPath(); x.moveTo(1080, 0); x.lineTo(700, 0); x.quadraticCurveTo(900, 140, 1080, 300); x.fill();
  x.fillStyle = '#141414'; x.fillRect(0, 1310, 380, 40); x.fillStyle = '#E11D2E'; x.fillRect(380, 1310, 700, 40);
  x.strokeStyle = '#F5B301'; x.lineWidth = 10; x.strokeRect(40, 40, 1000, 1240);
  if (logo) { const h = 110, wd = logo.width * h / logo.height; x.drawImage(logo, 540 - wd / 2, 90, wd, h); }
  x.textAlign = 'center'; x.fillStyle = '#141414'; x.font = '800 64px Inter, sans-serif'; x.fillText('CERTIFICATE', 540, 300);
  x.fillStyle = '#E11D2E'; x.font = '700 34px Inter, sans-serif'; x.fillText('EMPLOYEE OF THE WEEK', 540, 350);
  x.save(); x.beginPath(); x.arc(540, 560, 150, 0, Math.PI * 2); x.closePath(); x.fillStyle = '#E8EEFF'; x.fill(); x.clip();
  if (ph) { const s = Math.max(300 / ph.width, 300 / ph.height); x.drawImage(ph, 540 - ph.width * s / 2, 560 - ph.height * s / 2, ph.width * s, ph.height * s); } else { x.fillStyle = '#0B2A6F'; x.font = '800 120px Inter, sans-serif'; x.fillText(initials(fName(w.user_id)), 540, 600); }
  x.restore(); x.lineWidth = 12; x.strokeStyle = '#F5B301'; x.beginPath(); x.arc(540, 560, 156, 0, Math.PI * 2); x.stroke();
  x.font = '100px serif'; x.fillText('👑', 540, 420);
  x.fillStyle = '#141414'; x.font = '800 60px "Noto Sans Bengali", Inter, sans-serif'; x.fillText(fName(w.user_id), 540, 800);
  x.fillStyle = '#555'; x.font = '500 34px "Noto Sans Bengali", Inter, sans-serif'; x.fillText(fDes(w.user_id) || 'MY TravelMate', 540, 852);
  x.fillStyle = '#141414'; x.font = '600 38px "Noto Sans Bengali", sans-serif'; x.fillText('সপ্তাহের সেরা কর্মী 🏆', 540, 950);
  x.fillStyle = '#555'; x.font = '500 32px "Noto Sans Bengali", sans-serif'; x.fillText(fDate(wk) + ' – ' + fDate(fAdd(wk, 6)), 540, 1000);
  x.fillStyle = '#FDE2E4'; [[230, '✅ ' + bnN(w.completed), 'টাস্ক শেষ'], [540, '⏱️ ' + bnN(w.on_time), 'সময়মতো'], [850, '📈 ' + (score != null ? score + '%' : '—'), 'স্কোর']].forEach(([cx, a, b]) => { x.fillStyle = '#FDE2E4'; x.beginPath(); x.roundRect(cx - 140, 1060, 280, 150, 26); x.fill(); x.fillStyle = '#141414'; x.font = '800 46px "Noto Sans Bengali", Inter, sans-serif'; x.fillText(a, cx, 1135); x.fillStyle = '#555'; x.font = '500 28px "Noto Sans Bengali", sans-serif'; x.fillText(b, cx, 1180); });
  x.fillStyle = '#888'; x.font = '500 24px Inter, sans-serif'; x.fillText('MY TravelMate Team App', 540, 1268);
  c.toBlob(async b => {
    const f = new File([b], 'MY-TravelMate-Employee-of-the-Week-' + wk + '.png', { type: 'image/png' });
    try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: 'Employee of the Week' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
  }, 'image/png');
}

/* deep links: ?aw=<week>|live (push notification taps) */
const AW0 = new URL(location.href).searchParams.get('aw');
const _hdlF = handleDeepLink;
handleDeepLink = function (href) {
  let u; try { u = new URL(href || location.href, location.href); } catch (e) { return _hdlF(href); }
  if (u.searchParams.has('aw')) { try { history.replaceState(null, '', location.pathname); } catch (e) {} return ygSpotlight(u.searchParams.get('aw')); }
  return _hdlF(href);
};

/* first open after a new winner: celebrate once */
let fBoot = false;
async function fAfterLogin() {
  if (fBoot || !state.profile) return; fBoot = true;
  await fLoadCrown();
  if (AW0) return ygSpotlight(AW0);
  let seen = null; try { seen = localStorage.getItem('yg_seen_aw'); } catch (e) {}
  if (fLatest && seen !== fLatest && !state.profile.observer) setTimeout(() => ygSpotlight(fLatest), 3200);
  else if (fLatest && seen !== fLatest) { try { localStorage.setItem('yg_seen_aw', fLatest); } catch (e) {} }
}
const fTry = setInterval(() => { if (state && state.profile) { clearInterval(fTry); fAfterLogin(); } }, 700);

/* animated home header: plane, business icons, globe, skyline */
const BG = '<div class="ygbg" aria-hidden="true"><i class="sh"></i>'
  + '<svg class="pth" viewBox="0 0 440 240" preserveAspectRatio="none"><path d="M -40 175 C 90 60, 230 210, 470 30" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.4" stroke-dasharray="3 7"/></svg>'
  + '<svg class="pl" viewBox="0 0 24 24"><path fill="#fff" d="M21 11.5 13.5 9 9.8 2.5H8l1.9 6.4-5 .9L3 8H1.5l1.2 3.5L1.5 15H3l1.9-1.8 5 .9L8 20.5h1.8L13.5 14l7.5-2.5z"/></svg>'
  + [['🛂', 8, 62, 0], ['🎓', 26, 14, 1.5], ['💼', 47, 70, 3], ['🎫', 63, 18, 2], ['📈', 80, 64, 4], ['🏢', 36, 44, 5], ['🌏', 90, 30, 1]].map(([e, l, t, d]) => '<span class="fl" style="left:' + l + '%;top:' + t + '%;animation-delay:-' + d + 's">' + e + '</span>').join('')
  + '<svg class="gl" viewBox="0 0 150 150"><circle cx="75" cy="75" r="60" fill="none" stroke="#fff" stroke-width="1.6"/><ellipse cx="75" cy="75" rx="60" ry="22" fill="none" stroke="#fff" stroke-width="1.2"/><ellipse cx="75" cy="75" rx="30" ry="60" fill="none" stroke="#fff" stroke-width="1.2"/><ellipse cx="75" cy="75" rx="45" ry="60" fill="none" stroke="#fff" stroke-width="1" style="animation-delay:-3s"/><line x1="15" y1="75" x2="135" y2="75" stroke="#fff" stroke-width="1"/></svg>'
  + '<svg class="ct" viewBox="0 0 150 90"><g fill="#fff"><rect x="8" y="50" width="16" height="40"/><rect x="28" y="38" width="12" height="52"/><path d="M58 90V30l5-8 5 8v60z"/><rect x="61.5" y="6" width="3" height="16"/><path d="M80 90V30l5-8 5 8v60z"/><rect x="83.5" y="6" width="3" height="16"/><rect x="66" y="48" width="16" height="4"/><rect x="100" y="44" width="14" height="46"/><rect x="118" y="56" width="22" height="34"/></g></svg>'
  + [[12, 22, 0], [30, 80, 1], [55, 12, 2], [72, 86, .5], [88, 70, 1.6], [44, 30, 2.4]].map(([l, t, d]) => '<i class="st" style="left:' + l + '%;top:' + t + '%;animation-delay:-' + d + 's"></i>').join('') + '</div>';
new MutationObserver(() => { const h = document.querySelector('.hero'); if (h && !h.querySelector('.ygbg')) h.insertAdjacentHTML('afterbegin', BG); }).observe(document.body, { childList: true, subtree: true });

/* menu tile */
const _vmF = viewMenu;
viewMenu = function () {
  const r = _vmF(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-fame')) { t.insertAdjacentHTML('afterbegin', '<button class="tile" id="m-fame"><span class="ic">🏆</span><b>সপ্তাহের সেরা</b><small>র‍্যাংকিং · অভিনন্দন</small></button>'); document.getElementById('m-fame').onclick = () => ygSpotlight(null); }
  return r;
};
}
