/* 📘 rulebook · ⚖️ appeals · 📊 weekly review · 🧩 SOP checklists */
{
const RB_VER = 2;
const RULES = [
  ['🔒', 'গোপনীয়তা — জিরো টলারেন্স', ['ব্যবসার কোনো তথ্য টিম মেম্বারের বাইরে কারো সাথে শেয়ার করা সম্পূর্ণ নিষেধ — এমনকি নিজের পরিবারের সদস্যদের সাথেও না।', 'গোপন রাখতে হবে: বিজনেস পলিসি ও সিদ্ধান্ত, কাজের কৌশল ও বিজনেস ট্রিক্স, লাভ-আয়-খরচ ও দামের হিসাব, ক্লায়েন্ট/কাস্টমারের তথ্য, টার্গেট ও প্ল্যান।', 'অ্যাপ, WhatsApp গ্রুপ বা অফিসের কোনো আলোচনা, স্ক্রিনশট, ফাইল বা ডকুমেন্ট বাইরে পাঠানো যাবে না।', 'কেউ এসব জানতে চাইলে বিনয়ের সাথে বলুন "এটা কোম্পানির ভেতরের বিষয়" — প্রয়োজনে অ্যাডমিনকে জানান।', 'তথ্য বাইরে গেছে প্রমাণিত হলে দায়ী ব্যক্তিকে সঙ্গে সঙ্গে টিম থেকে বহিষ্কারসহ কঠোর ব্যবস্থা নেওয়া হতে পারে — এ বিষয়ে কোনো ছাড় নেই।'], 1],
  ['🕘', 'অফিস ও হাজিরা', ['অফিসের শিফট: সকাল ৯টা–দুপুর ১টা ও বিকেল ৩টা–রাত ৮টা (লাঞ্চ ১টা–৩টা)।', 'অ্যাপ থেকে সেলফিসহ হাজিরা দিতে হবে।', '৫ মিনিটের বেশি দেরিতে হাজিরা দিলে প্রতি মিনিটে −১ (দিনে সর্বোচ্চ −৩০)।', 'মাসে ৫ম বার দেরি থেকে প্রতিবার আরও −১০।']],
  ['🎙️', 'মিটিং', ['সকালের মিটিং ৯:১৫, রাতের মিটিং ৮:০০ — অ্যাপের "All Team" গ্রুপে নিজে থেকে কল আসবে।', '৫ মিনিটের বেশি দেরি −২, অনুপস্থিত −৫।', 'দেরি বা মিস হলে পরদিন সকাল ১০টার মধ্যে অ্যাপে লিখিত কারণ দিতে হবে, না দিলে আরও −৫।']],
  ['✅', 'টাস্ক', ['ডেডলাইনের পরে শেষ করলে প্রতি ঘণ্টায় −১ (সর্বোচ্চ −১০)।', 'ডেডলাইনের ৭ দিন পরেও শেষ না হলে −১০।', 'দেরিতে জমা দেওয়ার আগে কারণ লেখা বাধ্যতামূলক।', 'যে টাস্কে প্রুফ লাগে (স্ক্রিনশট/PDF/লিংক), প্রুফ ছাড়া শেষ হবে না।', 'চেকলিস্ট টাস্কে প্রতিটা ঘরে লিংক দিয়ে টিক দিতে হবে।', 'কাজ না করে "Complete" দেখানো শৃঙ্খলা ভঙ্গ — শাস্তিযোগ্য।']],
  ['📝', 'ডেইলি রিপোর্ট', ['প্রতিদিনের কাজের রিপোর্ট অ্যাপে জমা দিতে হবে।', 'পরদিন সকাল ৯টায় চেক হয় — জমা না থাকলে −৫।']],
  ['🕌', 'নামাজ', ['প্রতিদিন অ্যাপে ৫ ওয়াক্ত টিক দিন।', 'হিসাব না দিলে −৩, প্রতি ওয়াক্ত বাকি −১ (সর্বোচ্চ −৫)।', 'পুরো সপ্তাহ সব ওয়াক্ত পূরণ হলে +৫।']],
  ['📜', 'শোকজ', ['শোকজ পেলে নির্ধারিত সময়ের মধ্যে PDF বা ছবিতে লিখিত জবাব দিতে হবে।', 'সময়মতো জবাব না দিলে −৫।']],
  ['🏖️', 'ছুটি', ['ছুটি অ্যাপ থেকে আগে আবেদন করুন।', 'অনুমোদিত ছুটির দিনে মিটিং ও রিপোর্টের পয়েন্ট কাটে না।', 'শুক্রবার এসব হিসাব হয় না।']],
  ['⭐', 'পুরস্কার', ['ডেডলাইনের আগে টাস্ক শেষ করলে +১ (দিনে সর্বোচ্চ ৩ বার)।', 'পুরো সপ্তাহ (শনি–শুক্র) কোনো দেরি বা মিস না হলে +৫।', 'প্রতি সপ্তাহে "Best of the week" ঘোষণা।']],
  ['⚖️', 'পয়েন্ট ও আপিল', ['প্রতি মাস ১০০ পয়েন্ট দিয়ে শুরু হয়।', 'কোনো পয়েন্ট ভুলভাবে বা যুক্তিসঙ্গত কারণে কাটা গেলে ৭ দিনের মধ্যে অ্যাপ থেকে আপিল করুন — অ্যাডমিন দেখে সিদ্ধান্ত দেবেন।']],
  ['📊', 'সাপ্তাহিক রিভিউ', ['প্রতি শনিবার রাতের মিটিংয়ে ১৫ মিনিট: কী ভালো হলো, কোথায় আটকে আছি, সামনের সপ্তাহের ৩টা লক্ষ্য।']]
];
const TM_CSS = '<style id="tmcss">.rb-s{background:rgba(255,255,255,.9);border-radius:16px;padding:12px 14px;margin-top:10px;box-shadow:0 6px 18px rgba(11,42,111,.07)}.rb-red{border:2px solid #dc2626;background:#FEF2F2!important}.rb-red h4{color:#b91c1c!important}.rb-s h4{font-size:15px;color:#0B2A6F;display:flex;gap:8px;align-items:center}.rb-s li{font-size:13.5px;line-height:1.6;margin:4px 0 0 18px}.tm-t{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:10px;background:rgba(255,255,255,.9);border-radius:12px;overflow:hidden}.tm-t th{background:#0B2A6F;color:#fff;padding:7px 4px;font-weight:600}.tm-t td{padding:7px 4px;border-bottom:1px solid #eef2f6;text-align:center}.tm-t td:first-child{text-align:left}.tm-bad{color:#dc2626;font-weight:700}.tm-good{color:#16a34a;font-weight:700}.ap-st{font-size:12px;font-weight:700}</style>';
const tmStyle = () => { if (!document.getElementById('tmcss')) document.head.insertAdjacentHTML('beforeend', TM_CSS); };
const me = () => state.profile && state.profile.id;
const bn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
const shell = (title, back) => { cleanupChannels(); tmStyle(); $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>' + title + '</h1></div><div class="pad" id="tmb" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div>'; document.getElementById('bk').onclick = back || (() => go('menu')); return document.getElementById('tmb'); };

/* ---------- 📘 rulebook ---------- */
async function viewRules() {
  const box = shell('📘 টিম রুলবুক');
  const { data: ack } = await sb.from('yg_rule_ack').select('version').eq('user_id', me()).eq('version', RB_VER).maybeSingle();
  let h = '<div class="mut" style="font-size:12.5px">সবার জন্য একই নিয়ম। পয়েন্ট প্রতি মাসে ১০০ থেকে শুরু।</div>'
    + RULES.map(r => '<div class="rb-s' + (r[3] ? ' rb-red' : '') + '" data-noi18n><h4><span>' + r[0] + '</span>' + r[1] + '</h4><ul>' + r[2].map(x => '<li>' + x + '</li>').join('') + '</ul></div>').join('');
  if (!state.profile.observer) h += ack ? '<div class="msg info" style="margin-top:12px">✅ আপনি রুলবুক পড়েছেন বলে নিশ্চিত করেছেন।</div>' : '<button class="btn" id="rbok" style="margin-top:14px">✅ পড়েছি ও মেনে চলব</button>';
  if (isMgr()) h += '<div class="sec" style="margin-top:16px">কে কে পড়েছেন</div><div id="rbw"></div>';
  box.innerHTML = h;
  const ok = document.getElementById('rbok');
  if (ok) ok.onclick = async () => { const { error } = await sb.from('yg_rule_ack').insert({ user_id: me(), version: RB_VER }); if (error) return toast(friendlyError(error)); toast('ধন্যবাদ ✓'); viewRules(); };
  if (isMgr()) {
    await loadPeople();
    const { data } = await sb.from('yg_rule_ack').select('user_id,acked_at').eq('version', RB_VER);
    const ppl = Object.values(ui.people).filter(p => !p.observer).sort((a, b) => a.full_name.localeCompare(b.full_name));
    const w = document.getElementById('rbw'); if (w) w.innerHTML = ppl.map(p => { const a = (data || []).find(x => x.user_id === p.id); return '<div class="card" style="margin-top:6px;display:flex;justify-content:space-between;padding:10px 12px"><span>' + esc(p.full_name) + '</span><b class="' + (a ? 'tm-good' : 'tm-bad') + '">' + (a ? '✅ পড়েছেন' : '⏳ বাকি') + '</b></div>'; }).join('');
  }
}
window.viewRules = viewRules;
async function rbHome() {
  try {
    if (!me() || state.profile.observer || document.getElementById('hrb')) return;
    const { data } = await sb.from('yg_rule_ack').select('version').eq('user_id', me()).eq('version', RB_VER).maybeSingle();
    if (data || document.getElementById('hrb')) return;
    const anchor = document.getElementById('hsc') || document.getElementById('hmr') || document.getElementById('hmt') || document.querySelector('.qgrid'); if (!anchor) return;
    anchor.insertAdjacentHTML('beforebegin', '<button class="card" id="hrb" style="display:block;width:100%;text-align:left;margin-bottom:10px;cursor:pointer;border:1.5px solid #1E6FE0"><b style="color:#0B2A6F">📘 টিম রুলবুক পড়ুন</b><div class="mut" style="font-size:12.5px;margin-top:2px">🔒 নতুন নিয়ম: গোপনীয়তা (জিরো টলারেন্স) — রুলবুক পড়ে "পড়েছি" চাপুন।</div></button>');
    document.getElementById('hrb').onclick = viewRules;
  } catch (e) {}
}

/* ---------- ⚖️ appeals ---------- */
async function viewAppeals() {
  const box = shell('⚖️ পয়েন্ট আপিল');
  await loadPeople();
  const nm = u => (ui.people[u] || {}).full_name || 'সদস্য';
  const ST = { pending: ['⏳ অপেক্ষমাণ', '#d97706'], approved: ['✅ মঞ্জুর — পয়েন্ট ফেরত', '#16a34a'], rejected: ['❌ মঞ্জুর হয়নি', '#dc2626'] };
  if (isAdmin()) {
    const { data: aps } = await sb.from('yg_disc_appeals').select('*').order('created_at', { ascending: false }).limit(60);
    const ids = (aps || []).map(a => a.disc_id);
    const { data: ds } = ids.length ? await sb.from('yg_discipline').select('id,points,reason,day').in('id', ids) : { data: [] };
    const dd = id => (ds || []).find(x => x.id === id) || {};
    box.innerHTML = '<div class="mut" style="font-size:12.5px">সদস্যদের আপিল — মঞ্জুর করলে কাটা পয়েন্ট ফেরত যাবে ও সদস্য নোটিফিকেশন পাবেন।</div>' + ((aps || []).length ? aps.map(a => { const d = dd(a.disc_id), st = ST[a.status]; return '<div class="card" style="margin-top:10px"><b>' + esc(nm(a.user_id)) + '</b> <span class="tm-bad">' + bn(d.points || '') + '</span><div class="mut" style="font-size:12.5px">' + esc(d.reason || '') + '</div><div style="margin-top:6px;font-size:13.5px">💬 ' + esc(a.reason) + '</div><div class="ap-st" style="color:' + st[1] + ';margin-top:6px">' + st[0] + (a.note ? ' — ' + esc(a.note) : '') + '</div>' + (a.status === 'pending' ? '<div class="two" style="margin-top:8px"><button class="btn sm" data-ok="' + a.id + '" style="margin-top:0">✅ মঞ্জুর</button><button class="btn sm ghost" data-no="' + a.id + '" style="margin-top:0">❌ নামঞ্জুর</button></div>' : '') + '</div>'; }).join('') : '<div class="empty">কোনো আপিল নেই</div>');
    const decide = async (id, ok) => { const note = prompt(ok ? 'মন্তব্য (ঐচ্ছিক)' : 'কেন মঞ্জুর হলো না? (সদস্য দেখবেন)') ; if (note === null) return; const { error } = await sb.rpc('yg_appeal_decide', { p_id: id, p_ok: ok, p_note: note }); if (error) return toast(friendlyError(error)); toast('সিদ্ধান্ত জানানো হয়েছে ✓'); viewAppeals(); };
    box.querySelectorAll('[data-ok]').forEach(b => b.onclick = () => decide(b.dataset.ok, true));
    box.querySelectorAll('[data-no]').forEach(b => b.onclick = () => decide(b.dataset.no, false));
    return;
  }
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const [{ data: ds }, { data: aps }] = await Promise.all([
    sb.from('yg_discipline').select('id,points,reason,day,created_at,waived').eq('user_id', me()).lt('points', 0).gte('created_at', since).order('created_at', { ascending: false }),
    sb.from('yg_disc_appeals').select('*').eq('user_id', me())]);
  const ap = id => (aps || []).find(a => a.disc_id === id);
  box.innerHTML = '<div class="mut" style="font-size:12.5px">কোনো পয়েন্ট ভুলভাবে বা যুক্তিসঙ্গত কারণে কাটা গেলে ৭ দিনের মধ্যে আপিল করুন।</div>' + ((ds || []).length ? ds.map(d => { const a = ap(d.id), old = Date.parse(d.created_at) < Date.now() - 7 * 86400000; const st = a ? ST[a.status] : null; return '<div class="card" style="margin-top:10px"><div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:13.5px">' + esc(d.reason) + '</span><b class="tm-bad">' + bn(d.points) + '</b></div><div class="mut" style="font-size:12px">' + esc(d.day || '') + (d.waived ? ' · ✅ মাফ হয়েছে' : '') + '</div>' + (a ? '<div class="ap-st" style="color:' + st[1] + ';margin-top:6px">' + st[0] + (a.note ? ' — ' + esc(a.note) : '') + '</div>' : (!d.waived && !old ? '<button class="btn sm ghost" data-ap="' + d.id + '" style="margin-top:8px">⚖️ আপিল করুন</button>' : '')) + '</div>'; }).join('') : '<div class="empty">গত ৩০ দিনে কোনো পয়েন্ট কাটা যায়নি 🎉</div>');
  box.querySelectorAll('[data-ap]').forEach(b => b.onclick = () => sheet('<h3>⚖️ আপিল</h3><label>কেন এই পয়েন্ট কাটা ঠিক হয়নি? বিস্তারিত লিখুন</label><textarea class="in" id="apr" maxlength="800" style="min-height:90px"></textarea><button class="btn" id="apok">আপিল পাঠান</button>', (el, close) => {
    el.querySelector('#apok').onclick = async () => { const r = el.querySelector('#apr').value.trim(); if (r.length < 10) return toast('কারণটা একটু বিস্তারিত লিখুন'); const { error } = await sb.rpc('yg_appeal_submit', { p_disc: b.dataset.ap, p_reason: r }); if (error) return toast(friendlyError(error)); close(); toast('আপিল পাঠানো হয়েছে ✓'); viewAppeals(); };
  }));
}
window.viewAppeals = viewAppeals;

/* ---------- 📊 weekly review (managers) ---------- */
const wkStart = d => { const x = new Date(d + 'T00:00:00Z'), back = (x.getUTCDay() + 1) % 7; return dateAdd(d, -back); };
async function viewWeekReview(ws) {
  const box = shell('📊 সাপ্তাহিক রিভিউ', () => viewAdmin());
  ws = ws || wkStart(todayDhaka()); const we = dateAdd(ws, 6);
  const [{ data: st, error }, { data: rv }] = await Promise.all([sb.rpc('yg_week_stats', { p_from: ws, p_to: we }), sb.from('yg_week_review').select('*').eq('week_start', ws).maybeSingle()]);
  if (error) { box.innerHTML = '<div class="msg err">' + esc(friendlyError(error)) + '</div>'; return; }
  const f = d => new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
  box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><button class="btn sm ghost" id="wkp" style="margin:0">‹ আগের</button><b>' + f(ws) + ' – ' + f(we) + '</b><button class="btn sm ghost" id="wkn" style="margin:0">পরের ›</button></div>'
    + '<table class="tm-t"><thead><tr><th>সদস্য</th><th>শেষ</th><th>দেরিতে</th><th>বাকি দেরি</th><th>+ / −</th></tr></thead><tbody>'
    + (st || []).map(r => '<tr><td>' + esc(r.full_name) + '</td><td>' + bn(r.done) + '</td><td class="' + (r.done_late ? 'tm-bad' : '') + '">' + bn(r.done_late) + '</td><td class="' + (r.open_overdue ? 'tm-bad' : '') + '">' + bn(r.open_overdue) + '</td><td><span class="tm-good">+' + bn(r.plus) + '</span> / <span class="tm-bad">−' + bn(r.minus) + '</span></td></tr>').join('') + '</tbody></table>'
    + '<label>✅ এই সপ্তাহে কী ভালো হলো</label><textarea class="in" id="wk1" style="min-height:70px">' + esc(rv ? rv.wins || '' : '') + '</textarea>'
    + '<label>🚧 কোথায় আটকে আছি</label><textarea class="in" id="wk2" style="min-height:70px">' + esc(rv ? rv.blockers || '' : '') + '</textarea>'
    + '<label>🎯 সামনের সপ্তাহের ৩টা লক্ষ্য</label><textarea class="in" id="wk3" style="min-height:70px">' + esc(rv ? rv.goals || '' : '') + '</textarea>'
    + '<button class="btn" id="wksv">সেভ করুন</button>';
  document.getElementById('wkp').onclick = () => viewWeekReview(dateAdd(ws, -7));
  document.getElementById('wkn').onclick = () => viewWeekReview(dateAdd(ws, 7));
  document.getElementById('wksv').onclick = async () => { const { error: e } = await sb.from('yg_week_review').upsert({ week_start: ws, wins: document.getElementById('wk1').value.trim(), blockers: document.getElementById('wk2').value.trim(), goals: document.getElementById('wk3').value.trim(), updated_by: me(), updated_at: new Date().toISOString() }); if (e) return toast(friendlyError(e)); toast('সেভ হয়েছে ✓'); };
}
window.viewWeekReview = viewWeekReview;

/* ---------- 🧩 SOP templates ---------- */
let sopCache = null;
async function sopLoad() { const { data } = await sb.from('yg_sop').select('*').eq('active', true).order('name'); sopCache = data || []; return sopCache; }
async function viewSop() {
  const box = shell('🧩 SOP চেকলিস্ট', () => viewAdmin());
  const { data } = await sb.from('yg_sop').select('*').order('name');
  box.innerHTML = '<button class="btn" id="spn" style="margin-top:0">➕ নতুন টেমপ্লেট</button><div class="mut" style="font-size:12px;margin-top:6px">টাস্ক দেওয়ার সময় "SOP টেমপ্লেট" বাছলে এই ধাপগুলো চেকলিস্ট হিসেবে যোগ হবে। "খসড়া" লেখাগুলো আপনার কাজের ধাপ অনুযায়ী বদলে নিন।</div>'
    + (data || []).map(s => '<button class="card" data-sp="' + s.id + '" style="display:block;width:100%;text-align:left;margin-top:10px;opacity:' + (s.active ? 1 : .5) + '"><b>' + esc(s.name) + '</b><small style="display:block;color:#64748b">' + bn((s.items || []).length) + 'টা ধাপ' + (s.active ? '' : ' · বন্ধ') + '</small></button>').join('');
  document.getElementById('spn').onclick = () => sopForm(null);
  box.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => sopForm((data || []).find(x => x.id === b.dataset.sp)));
}
function sopForm(s) {
  sheet('<h3>' + (s ? '✏️ টেমপ্লেট এডিট' : '➕ নতুন টেমপ্লেট') + '</h3><label>নাম</label><input class="in" id="spname" maxlength="80" value="' + esc(s ? s.name : '') + '"><label>ধাপগুলো (প্রতি লাইনে একটা)</label><textarea class="in" id="spit" style="min-height:180px">' + esc(s ? (s.items || []).join('\n') : '') + '</textarea>'
    + (s ? '<label class="wd" style="margin-top:8px"><input type="checkbox" id="spact"' + (s.active ? ' checked' : '') + '> চালু</label>' : '') + '<button class="btn" id="spsv">সেভ করুন</button>', (el, close) => {
    el.querySelector('#spsv').onclick = async () => {
      const name = el.querySelector('#spname').value.trim(), items = el.querySelector('#spit').value.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 100);
      if (!name || !items.length) return toast('নাম ও অন্তত একটা ধাপ দিন');
      const row = { name, items, active: s ? el.querySelector('#spact').checked : true };
      const { error } = s ? await sb.from('yg_sop').update(row).eq('id', s.id) : await sb.from('yg_sop').insert(row);
      if (error) return toast(friendlyError(error)); close(); sopCache = null; toast('সেভ হয়েছে ✓'); viewSop();
    };
  });
}
window.viewSop = viewSop;
/* task form: SOP picker → checklist */
window.ygSopPick = el => { const s = el.querySelector('#tsop'); if (!s || !s.value || !sopCache) return null; const t = sopCache.find(x => x.id === s.value); return t ? (t.items || []).map(l => ({ label: String(l).slice(0, 120), need_link: false })) : null; };
new MutationObserver(async () => {
  const cn = document.getElementById('tcn'); if (!cn || document.getElementById('tsop')) return;
  const host = cn.closest('.two'); if (!host) return;
  const lab = host.previousElementSibling;
  (lab || host).insertAdjacentHTML('beforebegin', '<label>🧩 SOP টেমপ্লেট (ঐচ্ছিক)</label><select class="in" id="tsop"><option value="">— নেই —</option></select>');
  const list = sopCache || await sopLoad(); const sel = document.getElementById('tsop'); if (!sel) return;
  sel.insertAdjacentHTML('beforeend', list.map(s => '<option value="' + s.id + '">' + esc(s.name) + ' (' + bn((s.items || []).length) + ' ধাপ)</option>').join(''));
}).observe(document.body, { childList: true, subtree: true });

/* ---------- entry points ---------- */
const tile = (id, ic, b, sm, fn) => ({ id, html: '<button class="tile" id="' + id + '"><span class="ic">' + ic + '</span><b>' + b + '</b><small>' + sm + '</small></button>', fn });
const _vmTm = viewMenu;
viewMenu = function () {
  const r = _vmTm(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-rb')) {
    [tile('m-ap', '⚖️', isAdmin() ? 'আপিল' : 'পয়েন্ট আপিল', isAdmin() ? 'সদস্যদের আপিল দেখুন' : 'ভুল কাটা পয়েন্ট', viewAppeals), tile('m-rb', '📘', 'টিম রুলবুক', 'সব নিয়ম এক জায়গায়', viewRules)].forEach(x => { t.insertAdjacentHTML('afterbegin', x.html); document.getElementById(x.id).onclick = x.fn; });
  }
  return r;
};
const _vaTm = viewAdmin;
viewAdmin = async function () {
  const pr = _vaTm();
  try {
    await pr; const t = document.querySelector('.tiles');
    if (t && isMgr() && !document.getElementById('x-wk')) {
      [tile('x-sop', '🧩', 'SOP চেকলিস্ট', 'কাজের ধাপের টেমপ্লেট', viewSop), tile('x-wk', '📊', 'সাপ্তাহিক রিভিউ', 'সপ্তাহের হিসাব ও লক্ষ্য', () => viewWeekReview())].forEach(x => { t.insertAdjacentHTML('afterbegin', x.html); document.getElementById(x.id).onclick = x.fn; });
    }
  } catch (e) {}
  return pr;
};
const _vhTm = viewHome;
viewHome = async function () { const pr = _vhTm(); setTimeout(rbHome, 1100); return pr; };
if (document.querySelector('.qgrid')) setTimeout(rbHome, 1100);
const _hdlTm = handleDeepLink;
handleDeepLink = function (href) {
  let u; try { u = new URL(href || location.href, location.href); } catch (e) { return _hdlTm(href); }
  if (u.searchParams.has('ap')) { try { history.replaceState(null, '', location.pathname); } catch (e) {} return viewAppeals(); }
  return _hdlTm(href);
};
}
