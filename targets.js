/* ---------- 🎯 targets: daily targets, daily updates, team view + PDF ---------- */
{
const TG_DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
const tgDow = d => new Date(d + 'T00:00:00Z').getUTCDay();
const tgWk = d => dateAdd(d, -((tgDow(d) + 1) % 7));
const tgMonS = d => d.slice(0, 8) + '01';
const tgMonE = d => { const [y, m] = d.split('-').map(Number); return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); };
const tgWD = (from, to, wd) => { let n = 0; for (let d = from; d <= to; d = dateAdd(d, 1)) if (wd.includes(tgDow(d))) n++; return n; };
const tgN = v => Number(v || 0).toLocaleString('bn-BD', { maximumFractionDigits: 1 });
const tgCol = p => p >= 90 ? '#16a34a' : p >= 70 ? '#d97706' : '#dc2626';
const tgDot = p => p >= 90 ? '🟢' : p >= 70 ? '🟡' : '🔴';
const tgDate = d => new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { weekday: 'short', day: 'numeric', month: 'short' });
const tgT12 = s => { const [h, m] = s.split(':').map(Number); return ((h % 12) || 12) + ':' + String(m).padStart(2, '0') + (h < 12 ? ' AM' : ' PM'); };
const tgCfg = c => ({ workdays: (c && c.workdays) || [0, 1, 2, 3, 4, 6], pace: (c && c.pace) || null });
const tgStart = t => new Date(Date.parse(t.created_at) + 6 * 3600000).toISOString().slice(0, 10);
const tgMax = (a, b) => a > b ? a : b;
const tgBar = (p, c) => '<div style="height:7px;background:#e8edf3;border-radius:6px;overflow:hidden;margin-top:6px"><div style="height:100%;width:' + Math.min(100, Math.max(0, p)) + '%;background:' + (c || tgCol(p)) + '"></div></div>';

async function tgLoad(uids, from, to) {
  let q1 = sb.from('yg_targets').select('*').eq('active', true).order('sort'), q2 = sb.from('yg_target_cfg').select('*'), q3 = sb.from('yg_target_logs').select('user_id,target_id,log_date,value,updated_at').gte('log_date', from).lte('log_date', to), q4 = sb.from('yg_target_notes').select('user_id,log_date,note').gte('log_date', from).lte('log_date', to);
  if (uids) { q1 = q1.in('user_id', uids); q2 = q2.in('user_id', uids); q3 = q3.in('user_id', uids); q4 = q4.in('user_id', uids); }
  const [t, c, l, n] = await Promise.all([q1, q2, q3, q4]);
  const cfg = {}; (c.data || []).forEach(x => cfg[x.user_id] = x);
  return { targets: t.data || [], cfg, logs: l.data || [], notes: n.data || [], error: t.error || l.error };
}
const tgSum = (logs, tid, from, to) => logs.filter(l => l.target_id === tid && l.log_date >= from && l.log_date <= to).reduce((a, l) => a + Number(l.value || 0), 0);
/* expected share of today's target at this moment (from pace checkpoints) */
function tgPaceNow(pace) {
  if (!Array.isArray(pace) || !pace.length) return null;
  const dk = new Date(Date.now() + 6 * 3600000), now = dk.getUTCHours() * 60 + dk.getUTCMinutes();
  const pts = pace.map(x => ({ m: (([h, mm]) => h * 60 + mm)(String(x.t).split(':').map(Number)), p: Number(x.p), t: x.t })).sort((a, b) => a.m - b.m);
  let cur = 0, next = pts[0];
  for (const x of pts) { if (now >= x.m) { cur = x.p; next = null; } else { next = x; break; } }
  return { cur, next };
}

/* member screen (also opened by admin for a member) */
async function viewTargets(uid, date) {
  cleanupChannels();
  uid = uid || state.profile.id; date = date || todayDhaka();
  const me = uid === state.profile.id, today = todayDhaka();
  const canEdit = (me && date >= dateAdd(today, -1)) || isAdmin();
  await loadPeople();
  const pn = (ui.people[uid] && ui.people[uid].full_name) || '';
  $app.innerHTML = '<div class="shell"><div class="view"><div class="top"><button class="back" id="bk">←</button><h1 style="font-size:17px">🎯 ' + (me ? 'আমার টার্গেট' : esc(pn)) + '</h1>' + (isAdmin() ? '<div class="act"><button id="tgset" title="টার্গেট সেট করুন">⚙️</button></div>' : '') + '</div><div class="pad" id="tgb" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div></div>' + (me ? tabbar() : '') + '</div>';
  document.querySelectorAll('.tb').forEach(b => b.onclick = () => go(b.dataset.t));
  document.getElementById('bk').onclick = () => me ? go('home') : viewTargetsTeam();
  if (isAdmin()) document.getElementById('tgset').onclick = () => tgSetup(uid, () => viewTargets(uid, date));
  const from = tgWk(date) < tgMonS(date) ? tgWk(date) : tgMonS(date);
  const D = await tgLoad([uid], from, date);
  const el = document.getElementById('tgb'); if (!el) return;
  if (D.error) { el.innerHTML = '<div class="msg err">' + esc(friendlyError(D.error)) + '</div>'; return; }
  if (!D.targets.length) { el.innerHTML = '<div class="card na-card"><div class="bigic" style="background:#EEF6FF">🎯</div><h3>এখনো কোনো টার্গেট সেট করা হয়নি</h3><p class="mut">' + (isAdmin() ? 'উপরের ⚙️ থেকে টার্গেট সেট করুন।' : 'অ্যাডমিন টার্গেট সেট করলে এখানে দেখাবে।') + '</p></div>'; const trN = tgTrendRange(null); tgTrend(trN).then(rows => { const h = document.getElementById('tgb'); if (h && !h.querySelector('.tgc')) { h.insertAdjacentHTML('beforeend', '<div class="hsec" style="margin-top:16px"><span class="hsi">📈</span><b>টিমের অগ্রগতি (শেষ ৮ সপ্তাহ)</b></div>' + tgChart(rows, trN)); tgChartWire(h, rows, trN); } }); return; }
  const cfg = tgCfg(D.cfg[uid]), work = cfg.workdays.includes(tgDow(date));
  const ws = tgWk(date), we = dateAdd(ws, 6), ms = tgMonS(date), me2 = tgMonE(date);
    const pace = date === today && work ? tgPaceNow(cfg.pace) : null;
  const note = (D.notes.find(n => n.log_date === date) || {}).note || '';
  const cards = D.targets.map(t => {
    const v = tgSum(D.logs, t.id, date, date), wk = tgSum(D.logs, t.id, ws, date), mo = tgSum(D.logs, t.id, ms, date);
    const s0 = tgStart(t), wT = t.daily * tgWD(tgMax(ws, s0), we, cfg.workdays), mT = t.daily * tgWD(tgMax(ms, s0), me2, cfg.workdays), rD = tgWD(tgMax(date, s0), me2, cfg.workdays);
    const need = Math.max(0, mT - (mo - v)), perDay = rD ? Math.ceil(need / rD) : 0;
    const p = t.daily ? Math.round(v / t.daily * 100) : 0;
    const exp = pace ? Math.round(t.daily * pace.cur / 100) : null;
    return '<div class="card" style="margin-top:10px' + (t.star ? ';border:1.5px solid #f5c26b' : '') + '"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>' + (t.star ? '★ ' : '') + esc(t.label) + '</b><span class="mut" style="font-size:12px">দৈনিক ' + tgN(t.daily) + ' ' + esc(t.unit) + '</span></div>'
      + '<div style="display:flex;align-items:center;gap:8px;margin-top:8px">' + (canEdit ? '<button class="btn ghost" data-m="' + t.id + '" style="margin:0;width:44px;padding:8px 0;font-size:18px">−</button>' : '') + '<input class="in" data-v="' + t.id + '" type="number" inputmode="numeric" min="0" value="' + (v || '') + '" placeholder="0" ' + (canEdit ? '' : 'disabled') + ' style="margin:0;text-align:center;font-size:18px;font-weight:700">' + (canEdit ? '<button class="btn" data-p="' + t.id + '" style="margin:0;width:44px;padding:8px 0;font-size:18px">+</button>' : '') + '</div>'
      + tgBar(p) + '<div class="mut" style="font-size:12px;margin-top:6px;line-height:1.6">আজ <b data-pc="' + t.id + '">' + p + '%</b>' + (exp != null ? ' · এখন পর্যন্ত হওয়া উচিত ~' + tgN(exp) : '') + '<br>সপ্তাহ ' + tgN(wk) + '/' + tgN(wT) + ' · মাস ' + tgN(mo) + '/' + tgN(mT) + (rD && need > 0 ? ' · মাস পূরণে বাকি দিনে প্রতিদিন ' + tgN(perDay) : need <= 0 ? ' · ✅ মাসের টার্গেট পূরণ' : '') + '</div></div>';
  }).join('');
  el.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><button class="btn ghost" id="tgprev" style="margin:0;width:auto;padding:8px 12px">‹</button><div style="text-align:center"><b>' + tgDate(date) + '</b><div class="mut" style="font-size:12px">' + (date === today ? 'আজ' : date === dateAdd(today, -1) ? 'গতকাল' : '') + (work ? '' : ' · ছুটির দিন') + '</div></div><button class="btn ghost" id="tgnext" style="margin:0;width:auto;padding:8px 12px" ' + (date >= today ? 'disabled' : '') + '>›</button></div>'
    + (pace ? '<div class="msg info" style="margin-top:10px;font-size:12.5px">⏱️ এখন পর্যন্ত দৈনিক টার্গেটের <b>' + pace.cur + '%</b> হওয়া উচিত' + (pace.next ? ' · ' + tgT12(pace.next.t) + '-এর মধ্যে ' + pace.next.p + '%' : '') + '</div>' : '')
    + (canEdit ? '<div class="mut" style="font-size:12px;margin-top:8px">সারাদিনে যতবার খুশি আপডেট দিন — সংখ্যা নিজে থেকেই সেভ হয়। <span id="tgst"></span></div>' : '')
    + cards
    + '<label style="margin-top:14px">আজকের নোট (কী করেছেন / কেন কম হলো)</label><textarea class="in" id="tgnote" maxlength="1000" ' + (canEdit ? '' : 'disabled') + ' placeholder="যেমন: বিদ্যুৎ ছিল না ২ ঘণ্টা">' + esc(note) + '</textarea>';
  const tr8 = tgTrendRange(null); tgTrend(tr8).then(rows => { const host = document.getElementById('tgb'); if (!host || host.querySelector('.tgc')) return; host.insertAdjacentHTML('beforeend', '<div class="hsec" style="margin-top:16px"><span class="hsi">📈</span><b>টিমের অগ্রগতি (শেষ ৮ সপ্তাহ)</b></div>' + tgChart(rows, tr8)); tgChartWire(host, rows, tr8); });
  document.getElementById('tgprev').onclick = () => viewTargets(uid, dateAdd(date, -1));
  document.getElementById('tgnext').onclick = () => { if (date < today) viewTargets(uid, dateAdd(date, 1)); };
  if (!canEdit) return;
  let timer = null; const st = () => document.getElementById('tgst');
  const save = async () => {
    const rows = D.targets.map(t => ({ user_id: uid, log_date: date, target_id: t.id, value: Math.max(0, Number(el.querySelector('[data-v="' + t.id + '"]').value) || 0), updated_at: new Date().toISOString(), updated_by: state.profile.id }));
    const nt = el.querySelector('#tgnote').value.trim();
    const [a, b] = await Promise.all([sb.from('yg_target_logs').upsert(rows, { onConflict: 'user_id,log_date,target_id' }), sb.from('yg_target_notes').upsert({ user_id: uid, log_date: date, note: nt || null, updated_at: new Date().toISOString() }, { onConflict: 'user_id,log_date' })]);
    const e = a.error || b.error; if (st()) st().textContent = e ? '⚠️ সেভ হয়নি' : '✓ সেভ হয়েছে';
    if (e) toast(friendlyError(e));
  };
  const later = () => { if (st()) st().textContent = '…'; clearTimeout(timer); timer = setTimeout(save, 900); };
  const upd = id => { const t = D.targets.find(x => x.id === id), v = Number(el.querySelector('[data-v="' + id + '"]').value) || 0, pc = el.querySelector('[data-pc="' + id + '"]'); if (pc && t.daily) pc.textContent = Math.round(v / t.daily * 100) + '%'; };
  el.querySelectorAll('[data-p],[data-m]').forEach(b => b.onclick = () => { const id = b.dataset.p || b.dataset.m, i = el.querySelector('[data-v="' + id + '"]'); i.value = Math.max(0, (Number(i.value) || 0) + (b.dataset.p ? 1 : -1)); upd(id); later(); });
  el.querySelectorAll('[data-v]').forEach(i => i.oninput = () => { upd(i.dataset.v); later(); });
  el.querySelector('#tgnote').oninput = later;
}

/* admin / manager: set a member's targets */
async function tgSetup(uid, after) {
  await loadPeople();
  const [{ data: ts }, { data: c }] = await Promise.all([sb.from('yg_targets').select('*').eq('user_id', uid).eq('active', true).order('sort'), sb.from('yg_target_cfg').select('*').eq('user_id', uid).maybeSingle()]);
  const cfg = tgCfg(c), list = (ts || []).slice();
  const pName = (ui.people[uid] && ui.people[uid].full_name) || '';
  const row = (t, i) => '<div class="card" data-row="' + i + '" style="margin-top:8px;padding:10px"><div class="two"><input class="in" data-f="label" placeholder="কাজের নাম (যেমন ভিসা)" value="' + esc(t.label || '') + '" style="margin-top:0"><input class="in" data-f="unit" placeholder="একক (টি / পেজ)" value="' + esc(t.unit || 'টি') + '" style="margin-top:0"></div><div class="two" style="margin-top:6px"><input class="in" data-f="daily" type="number" min="0" step="any" placeholder="দৈনিক টার্গেট" value="' + (t.daily ?? '') + '" style="margin-top:0"><label style="display:flex;align-items:center;gap:6px;margin:0;font-size:13px"><input type="checkbox" data-f="star" ' + (t.star ? 'checked' : '') + '> ★ গুরুত্বপূর্ণ</label></div><button class="btn ghost" data-del style="margin-top:6px;padding:6px;font-size:12.5px">🗑️ এই কাজ বাদ দিন</button></div>';
  sheet('<h3>🎯 ' + esc(pName) + ' — টার্গেট</h3><p class="mut" style="font-size:12.5px">প্রতিটা কাজের <b>দৈনিক</b> টার্গেট দিন। সাপ্তাহিক ও মাসিক টার্গেট অ্যাপ নিজে হিসাব করবে (নিচের কাজের দিন ধরে)।</p><div id="tgrows">' + list.map(row).join('') + '</div><button class="btn ghost" id="tgadd" style="margin-top:8px">+ নতুন কাজ যোগ করুন</button>'
    + '<label>কাজের দিন</label><div class="wdays">' + TG_DAYS.map((d, i) => '<label class="wd"><input type="checkbox" value="' + i + '" ' + (cfg.workdays.includes(i) ? 'checked' : '') + '>' + d + '</label>').join('') + '</div>'
    + '<label>সময়ভিত্তিক লক্ষ্য (ঐচ্ছিক)</label><input class="in" id="tgpace" placeholder="যেমন: 11:00=20, 13:00=44, 15:00=64, 17:00=84, 19:00=100" value="' + esc((cfg.pace || []).map(x => x.t + '=' + x.p).join(', ')) + '"><p class="mut" style="font-size:12px;margin:4px 0 0">কোন সময়ের মধ্যে দৈনিক টার্গেটের কত % হওয়া উচিত। খালি রাখলে দেখাবে না।</p>'
    + '<button class="btn" id="tgsave">Save</button>', (el, close) => {
    const box = el.querySelector('#tgrows');
    const wire = () => box.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { const r = b.closest('[data-row]'); r.hidden = true; r.dataset.gone = '1'; });
    wire();
    el.querySelector('#tgadd').onclick = () => { const i = list.length; list.push({}); box.insertAdjacentHTML('beforeend', row({}, i)); wire(); };
    el.querySelector('#tgsave').onclick = async () => {
      const rows = [...box.querySelectorAll('[data-row]')].map(r => ({ i: Number(r.dataset.row), gone: r.dataset.gone === '1', label: r.querySelector('[data-f="label"]').value.trim(), unit: r.querySelector('[data-f="unit"]').value.trim() || 'টি', daily: r.querySelector('[data-f="daily"]').value, star: r.querySelector('[data-f="star"]').checked }));
      const keep = rows.filter(r => !r.gone && (r.label || r.daily !== ''));
      if (keep.some(r => !r.label || r.daily === '' || Number(r.daily) < 0)) return toast('প্রতিটা কাজের নাম আর দৈনিক টার্গেট দিন');
      const wd = [...el.querySelectorAll('.wdays input:checked')].map(x => Number(x.value));
      if (!wd.length) return toast('অন্তত একটা কাজের দিন বেছে নিন');
      const ps = el.querySelector('#tgpace').value.trim(); let pace = null;
      if (ps) { pace = ps.split(',').map(s => s.trim()).filter(Boolean).map(s => { const [t, p] = s.split('='); return { t: (t || '').trim(), p: Number(p) }; }); if (pace.some(x => !/^\d{1,2}:\d{2}$/.test(x.t) || !(x.p >= 0 && x.p <= 100))) return toast('সময়ভিত্তিক লক্ষ্য এভাবে লিখুন: 11:00=20, 13:00=44'); pace = pace.map(x => ({ t: x.t.padStart(5, '0'), p: x.p })); }
      const errs = [];
      let sort = 0;
      for (const r of rows) {
        const old = list[r.i] && list[r.i].id;
        if (r.gone || !(r.label || r.daily !== '')) { if (old) { const { error } = await sb.from('yg_targets').update({ active: false }).eq('id', old); if (error) errs.push(error); } continue; }
        sort++;
        const v = { label: r.label, unit: r.unit, daily: Number(r.daily), star: r.star, sort };
        const { error } = old ? await sb.from('yg_targets').update(v).eq('id', old) : await sb.from('yg_targets').insert({ ...v, user_id: uid });
        if (error) errs.push(error);
      }
      const { error: ce } = await sb.from('yg_target_cfg').upsert({ user_id: uid, workdays: wd, pace, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      if (ce) errs.push(ce);
      if (errs.length) return toast(friendlyError(errs[0]));
      close(); toast('টার্গেট সেভ হয়েছে ✓'); if (after) after();
    };
  });
}


/* ---- trend chart: % of target per week (or month) per member ---- */
const TG_COL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#6250d6'];
function tgTrendRange(r) {
  const t = todayDhaka(), w8 = dateAdd(tgWk(t), -49);
  const from = r && r.from < w8 ? r.from : w8, to = r ? r.to : t;
  return { from, to, bucket: (Date.parse(to) - Date.parse(from)) / 86400000 > 200 ? 'month' : 'week' };
}
async function tgTrend(tr) {
  const { data, error } = await sb.rpc('yg_perf_trend', { p_from: tr.from, p_to: tr.to, p_bucket: tr.bucket });
  return error ? null : (data || []).map(r => ({ ...r, pct: r.score }));
}
function tgChart(rows, tr) {
  if (!rows || !rows.length) return '<div class="card tgc" style="margin-top:10px"><b>📈 পারফরম্যান্স স্কোরের ট্রেন্ড</b><p class="mut" style="font-size:12.5px;margin:6px 0 0">এই সময়ে কোনো টাস্ক বা টার্গেটের হিসাব নেই।</p></div>';
  const us = [...new Map(rows.map(r => [r.user_id, r.full_name])).entries()].sort((a, b) => a[1].localeCompare(b[1])).slice(0, TG_COL.length);
  const bk = [...new Set(rows.map(r => r.bucket))].sort();
  const W = 340, H = 190, L = 34, Rr = 12, T = 12, B = 26, pw = W - L - Rr, ph = H - T - B;
  const ymax = Math.max(120, Math.ceil(Math.max(...rows.map(r => r.pct)) / 20) * 20);
  const X = i => L + (bk.length === 1 ? pw / 2 : i * pw / (bk.length - 1)), Y = v => T + ph - v / ymax * ph;
  const lab = d => tr.bucket === 'month' ? new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { month: 'short' }) : new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
  const step = Math.ceil(bk.length / 6);
  let g = '';
  [0, 50, 100].filter(v => v <= ymax).forEach(v => { g += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + (v === 100 ? '#9aa4b2' : '#e8edf3') + '" stroke-width="1"' + (v === 100 ? ' stroke-dasharray="4 3"' : '') + '/><text x="' + (L - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="10" fill="#6b7280">' + v + '%</text>'; });
  bk.forEach((d, i) => { if (i % step === 0 || i === bk.length - 1) g += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="#6b7280">' + lab(d) + '</text>'; });
  us.forEach(([u], k) => {
    const c = TG_COL[k], pts = bk.map((d, i) => { const r = rows.find(x => x.user_id === u && x.bucket === d); return r ? { x: X(i), y: Y(r.pct), p: r.partial } : null; });
    const segs = []; let cur = []; pts.forEach(p => { if (p) cur.push(p); else if (cur.length) { segs.push(cur); cur = []; } }); if (cur.length) segs.push(cur);
    segs.forEach(sg => { if (sg.length > 1) g += '<polyline fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="' + sg.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ') + '"/>'; });
    pts.forEach(p => { if (p) g += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4" fill="' + (p.p ? '#fff' : c) + '" stroke="' + (p.p ? c : '#fff') + '" stroke-width="2"/>'; });
  });
  const svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="পারফরম্যান্স স্কোরের ট্রেন্ড" style="display:block;touch-action:pan-y"><g>' + g + '</g><line class="tgx" x1="0" x2="0" y1="' + T + '" y2="' + (T + ph) + '" stroke="#9aa4b2" stroke-width="1" visibility="hidden"/></svg>';
  const leg = us.map(([u, n], k) => {
    const all = rows.filter(r => r.user_id === u).sort((a, b) => a.bucket < b.bucket ? -1 : 1), mine = all.filter(r => !r.partial), cur = all.find(r => r.partial), last = mine[mine.length - 1], prev = mine[mine.length - 2];
    const dlt = last && prev ? last.pct - prev.pct : null;
    const tag = dlt == null ? '' : dlt > 2 ? ' <span style="color:#16a34a;font-weight:600">▲ ' + tgN(dlt) + ' পয়েন্ট উন্নতি</span>' : dlt < -2 ? ' <span style="color:#dc2626;font-weight:600">▼ ' + tgN(-dlt) + ' পয়েন্ট অবনতি</span>' : ' <span class="mut">● আগের মতোই</span>';
    return '<div style="display:flex;align-items:center;gap:6px;font-size:12.5px;margin-top:4px"><span style="width:10px;height:10px;border-radius:50%;background:' + TG_COL[k] + ';flex:none"></span><span>' + esc(n) + ' — শেষ ' + (tr.bucket === 'month' ? 'মাস' : 'সপ্তাহ') + ' <b>' + (last ? last.pct + '%' : '—') + '</b>' + tag + (cur ? ' <span class="mut">· চলতি ' + cur.pct + '%</span>' : '') + '</span></div>';
  }).join('');
  const unit = tr.bucket === 'month' ? 'মাস' : 'সপ্তাহ';
  return '<div class="card tgc" style="margin-top:10px"><b>📈 পারফরম্যান্স স্কোরের ট্রেন্ড (' + unit + ' অনুযায়ী)</b><div class="mut" style="font-size:12px;margin:2px 0 6px">স্কোর = সময়মতো টাস্ক শেষের % (দেরিতে শেষ = অর্ধেক), আর যাদের দৈনিক টার্গেট আছে তাদের টার্গেট পূরণের % — দুটোর গড়। ড্যাশ লাইন = ১০০%। ফাঁপা বিন্দু = চলতি ' + unit + ' (এখন পর্যন্ত)।</div><div class="tgcw" style="position:relative">' + svg + '<div class="tgtip" style="position:absolute;top:0;pointer-events:none;background:#0B3B5A;color:#fff;font-size:11.5px;padding:6px 8px;border-radius:8px;display:none;width:max-content;max-width:250px;line-height:1.5"></div></div>' + leg + '<div class="mut" style="font-size:11.5px;margin-top:6px">উন্নতি/অবনতি = শেষ সম্পূর্ণ ' + unit + ' বনাম তার আগের ' + unit + '। চলতি ' + unit + ' শেষ হলে হিসাবে আসবে।</div></div>';
}
function tgChartWire(root, rows, tr) {
  const w = root.querySelector('.tgcw'); if (!w || !rows || !rows.length) return;
  const svg = w.querySelector('svg'), tip = w.querySelector('.tgtip'), ln = svg.querySelector('.tgx');
  const us = [...new Map(rows.map(r => [r.user_id, r.full_name])).entries()].sort((a, b) => a[1].localeCompare(b[1])).slice(0, TG_COL.length);
  const bk = [...new Set(rows.map(r => r.bucket))].sort(), L = 34, pw = 340 - 34 - 12;
  const move = e => {
    const bx = svg.getBoundingClientRect(), vx = (e.clientX - bx.left) / bx.width * 340;
    const i = bk.length === 1 ? 0 : Math.max(0, Math.min(bk.length - 1, Math.round((vx - L) / (pw / (bk.length - 1)))));
    const x = bk.length === 1 ? L + pw / 2 : L + i * pw / (bk.length - 1), d = bk[i];
    ln.setAttribute('x1', x); ln.setAttribute('x2', x); ln.setAttribute('visibility', 'visible');
    tip.innerHTML = '<b>' + (tr.bucket === 'month' ? new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }) : 'সপ্তাহ শুরু ' + tgDate(d)) + '</b>' + us.map(([u, n], k) => { const r = rows.find(z => z.user_id === u && z.bucket === d); return '<br><span style="color:' + TG_COL[k] + '">●</span> ' + esc(n) + ': ' + (r ? '<b>' + r.pct + '%</b>' + (r.task_pct != null ? ' · টাস্ক ' + r.task_pct + '% (' + r.tasks_n + 'টা)' : '') + (r.target_pct != null ? ' · টার্গেট ' + r.target_pct + '%' : '') + (r.partial ? ' (চলতি)' : '') : '—'); }).join('');
    tip.style.display = 'block'; const px = x / 340 * bx.width; tip.style.left = Math.max(0, Math.min(bx.width - tip.offsetWidth, px - tip.offsetWidth / 2)) + 'px'; tip.style.top = '-6px'; tip.style.transform = 'translateY(-100%)';
  };
  svg.addEventListener('pointermove', move); svg.addEventListener('pointerdown', move);
  svg.addEventListener('pointerleave', () => { tip.style.display = 'none'; ln.setAttribute('visibility', 'hidden'); });
}

/* team view: everyone's progress + PDF */
const TGP = [['d0', 'আজ'], ['w0', 'এই সপ্তাহ'], ['w1', 'গত সপ্তাহ'], ['m0', 'এই মাস'], ['m1', 'গত মাস'], ['d90', 'শেষ ৯০ দিন'], ['h6', 'শেষ ৬ মাস'], ['y1', 'শেষ ১২ মাস'], ['y0', 'এই বছর']];
let tgPeriod = 'w0';
function tgRange(k) {
  const t = todayDhaka();
  if (k === 'd0') return { from: t, to: t, end: t };
  if (k === 'w0') return { from: tgWk(t), to: t, end: dateAdd(tgWk(t), 6) };
  if (k === 'w1') { const s = dateAdd(tgWk(t), -7); return { from: s, to: dateAdd(s, 6), end: dateAdd(s, 6) }; }
  if (k === 'm1') { const e = dateAdd(tgMonS(t), -1); return { from: tgMonS(e), to: e, end: e }; }
  if (k === 'd90') return { from: dateAdd(t, -89), to: t, end: t };
  if (k === 'h6') return { from: dateAdd(t, -182), to: t, end: t };
  if (k === 'y1') return { from: dateAdd(t, -364), to: t, end: t };
  if (k === 'y0') return { from: t.slice(0, 4) + '-01-01', to: t, end: t };
  return { from: tgMonS(t), to: t, end: tgMonE(t) };
}
async function viewTargetsTeam() {
  cleanupChannels();
  const r = tgRange(tgPeriod);
  $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>🎯 টিমের টার্গেট</h1></div><div class="chips">' + TGP.map(([k, l]) => '<button class="chip ' + (k === tgPeriod ? 'on' : '') + '" data-tp="' + k + '">' + l + '</button>').join('') + '</div><div class="pad" id="ttb" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div>';
  document.getElementById('bk').onclick = () => isAdmin() ? viewAdmin() : go('home');
  document.querySelectorAll('[data-tp]').forEach(b => b.onclick = () => { tgPeriod = b.dataset.tp; viewTargetsTeam(); });
  await loadPeople();
  const D = await tgLoad(null, r.from, r.to);
  const box = document.getElementById('ttb'); if (!box) return;
  if (D.error) { box.innerHTML = '<div class="msg err">' + esc(friendlyError(D.error)) + '</div>'; return; }
  const uids = [...new Set(D.targets.map(t => t.user_id))].filter(u => ui.people[u]);
  const rep = uids.map(u => {
    const cfg = tgCfg(D.cfg[u]);
    const mine = D.targets.filter(t => t.user_id === u), st0 = mine.map(tgStart).sort()[0] || r.from;
    const sofar = r.to < st0 ? 0 : tgWD(tgMax(r.from, st0), r.to, cfg.workdays);
    const items = mine.map(t => { const s0 = tgMax(r.from, tgStart(t)), done = tgSum(D.logs, t.id, r.from, r.to), tgt = r.end < s0 ? 0 : t.daily * tgWD(s0, r.end, cfg.workdays), exp = r.to < s0 ? 0 : t.daily * tgWD(s0, r.to, cfg.workdays); return { t, done, tgt, exp, p: tgt ? Math.round(done / tgt * 100) : 0, pe: exp ? Math.round(done / exp * 100) : 100 }; });
    const pe = items.length ? Math.round(items.reduce((a, x) => a + Math.min(x.pe, 150), 0) / items.length) : 0;
    const upd = new Set(D.logs.filter(l => l.user_id === u).map(l => l.log_date)).size;
    const notes = D.notes.filter(n => n.user_id === u && n.note).sort((a, b) => a.log_date < b.log_date ? 1 : -1);
    const lastU = D.logs.filter(l => l.user_id === u && l.updated_at).map(l => l.updated_at).sort().pop();
    return { u, p: ui.people[u], items, pe, upd, sofar, notes, lastU };
  }).sort((a, b) => b.pe - a.pe);
  const lbl = (TGP.find(x => x[0] === tgPeriod) || [])[1] || '';
  const tr = tgTrendRange(r), trows = await tgTrend(tr), chart = tgChart(trows, tr);
  box.innerHTML = chart + (rep.length ? '<div class="mut" style="font-size:12.5px">' + tgDate(r.from) + (r.from !== r.to ? ' – ' + tgDate(r.to) : '') + ' · রঙ বোঝায় এ পর্যন্ত যতটুকু হওয়া উচিত ছিল তার তুলনায় কতটুকু হয়েছে</div><div class="two" style="margin-top:10px"><button class="btn" id="tgsh" style="margin-top:0">📤 WhatsApp-এ শেয়ার</button><button class="btn ghost" id="tgdl" style="margin-top:0">⬇️ PDF</button></div>' : '')
    + rep.map(x => '<div class="card" style="margin-top:12px"><div class="row">' + avatar(x.p.full_name, x.u, 40) + '<div class="rt"><b>' + tgDot(x.pe) + ' ' + esc(x.p.full_name) + '</b><span>লক্ষ্যের ' + x.pe + '% · আপডেট দিয়েছেন ' + tgN(x.upd) + '/' + tgN(x.sofar) + ' দিন' + (x.lastU ? '<br>শেষ আপডেট: ' + new Date(x.lastU).toLocaleString('bn-BD', { weekday: 'short', hour: 'numeric', minute: '2-digit' }) : '<br>এই সময়ে কোনো আপডেট নেই') + '</span></div></div>'
      + x.items.map(i => '<div style="margin-top:8px;font-size:13px"><div style="display:flex;justify-content:space-between;gap:8px"><span>' + (i.t.star ? '★ ' : '') + esc(i.t.label) + '</span><b>' + tgN(i.done) + ' / ' + tgN(i.tgt) + ' ' + esc(i.t.unit) + '</b></div>' + tgBar(i.p, tgCol(i.pe)) + '</div>').join('')
      + (x.notes.length ? '<div class="mut" style="font-size:12px;margin-top:8px">📝 ' + esc(x.notes[0].note) + ' (' + tgDate(x.notes[0].log_date) + ')</div>' : '')
      + '<div class="two" style="margin-top:8px"><button class="btn ghost" data-open="' + x.u + '" style="margin-top:0;padding:8px">বিস্তারিত</button>' + (isAdmin() ? '<button class="btn ghost" data-set="' + x.u + '" style="margin-top:0;padding:8px">⚙️ টার্গেট সেট</button>' : '') + '</div></div>').join('')
    + (isAdmin() ? '<button class="btn ghost" id="tgnew" style="margin-top:14px">+ অন্য কারো টার্গেট সেট করুন</button>' : (rep.length ? '' : '<div class="empty">এখনো কারো টার্গেট সেট করা হয়নি</div>'));
  tgChartWire(box, trows, tr);
  box.querySelectorAll('[data-open]').forEach(b => b.onclick = () => viewTargets(b.dataset.open));
  box.querySelectorAll('[data-set]').forEach(b => b.onclick = () => tgSetup(b.dataset.set, viewTargetsTeam));
  if (isAdmin()) document.getElementById('tgnew').onclick = () => { const ps = Object.values(ui.people).sort((a, b) => a.full_name.localeCompare(b.full_name)); sheet('<h3>কার টার্গেট সেট করবেন?</h3><select class="in" id="tgwho">' + ps.map(p => '<option value="' + p.id + '">' + esc(p.full_name) + '</option>').join('') + '</select><button class="btn" id="tgok">পরবর্তী</button>', (el, close) => { el.querySelector('#tgok').onclick = () => { const u = el.querySelector('#tgwho').value; close(); tgSetup(u, viewTargetsTeam); }; }); };
  if (!rep.length) return;
  const dt = tgDate(r.from) + (r.from !== r.to ? ' – ' + tgDate(r.to) : '');
  const html = '<div class="trep pdf"><div class="trh"><img src="mark.jpg" alt=""><div><b>Yaqeen Group</b><span>Target Report · টার্গেট রিপোর্ট (' + lbl + ')</span></div><div class="trd">' + dt + '</div></div>' + chart.replace(/<div class="tgtip"[^>]*><\/div>/, '')
    + rep.map(x => '<div style="margin-top:14px"><b style="font-size:15px;color:#0B3B5A">' + esc(x.p.full_name) + '</b> <span style="color:#45545f">— লক্ষ্যের ' + x.pe + '% · আপডেট ' + x.upd + '/' + x.sofar + ' দিন</span></div><table class="trt"><thead><tr><th>কাজ</th><th>দৈনিক</th><th>টার্গেট</th><th>অর্জন</th><th>%</th></tr></thead><tbody>'
      + x.items.map(i => '<tr><td>' + (i.t.star ? '★ ' : '') + esc(i.t.label) + '</td><td class="n">' + tgN(i.t.daily) + ' ' + esc(i.t.unit) + '</td><td class="n">' + tgN(i.tgt) + '</td><td class="n">' + tgN(i.done) + '</td><td class="n">' + i.p + '%</td></tr>').join('') + '</tbody></table>'
      + (x.notes.length ? '<div style="font-size:11.5px;color:#45545f;margin-top:4px">' + x.notes.slice(0, 5).map(n => '📝 ' + tgDate(n.log_date) + ': ' + esc(n.note)).join('<br>') + '</div>' : '')).join('')
    + '<div class="trf">Generated by Yaqeen Group Team App · ' + new Date().toLocaleString('en-GB') + '</div></div>';
  const fn = 'Yaqeen-Targets-' + r.from + '_' + r.to + '.pdf';
  document.getElementById('tgsh').onclick = () => exportHtmlPdf(html, fn, 'Yaqeen Group · Target Report · ' + dt, true);
  document.getElementById('tgdl').onclick = () => exportHtmlPdf(html, fn, '', false);
}
window.viewTargets = viewTargets; window.viewTargetsTeam = viewTargetsTeam;

/* performance page: add the target trend on top */
const TGPP = { d0: 0, w0: 0, w1: 0, m0: 0, m1: 0, d30: 29, d90: 89, h6: 182, y1: 364 };
let tgPpBusy = false;
new MutationObserver(() => {
  const box = document.getElementById('ptb');
  if (!box || tgPpBusy || box.querySelector('.tgc') || box.querySelector('.spin')) return;
  tgPpBusy = true;
  const on = document.querySelector('[data-pp].on'), k = on && on.dataset.pp, t = todayDhaka();
  const r = k === 'y0' ? { from: t.slice(0, 4) + '-01-01', to: t } : TGPP[k] ? { from: dateAdd(t, -TGPP[k]), to: t } : null;
  const tr = tgTrendRange(r);
  tgTrend(tr).then(rows => { const b2 = document.getElementById('ptb'); if (b2 && !b2.querySelector('.tgc')) { b2.insertAdjacentHTML('afterbegin', tgChart(rows, tr)); tgChartWire(b2, rows, tr); } tgPpBusy = false; }, () => { tgPpBusy = false; });
}).observe(document.body, { childList: true, subtree: true });

/* hooks: home card, menu tile, admin tile */
const _vhTg = viewHome;
async function tgHomeCard() {
  try {
    const me = state.profile && state.profile.id; if (!me || state.profile.observer) return;
    const { data: ts } = await sb.from('yg_targets').select('id,daily').eq('user_id', me).eq('active', true);
    if (!ts || !ts.length) return;
    const d = todayDhaka(), { data: lg } = await sb.from('yg_target_logs').select('target_id,value').eq('user_id', me).eq('log_date', d);
    const p = Math.round(ts.reduce((a, t) => a + (t.daily ? Math.min(1.5, (((lg || []).find(l => l.target_id === t.id) || {}).value || 0) / t.daily) : 0), 0) / ts.length * 100);
    const anchor = (document.getElementById('hatt') && document.getElementById('hatt').closest('.hrow2')) || document.getElementById('scard') || document.querySelector('.qgrid');
    if (anchor && !document.getElementById('htg')) {
      anchor.insertAdjacentHTML('beforebegin', '<button class="card" id="htg" style="display:block;width:100%;text-align:left;margin-bottom:10px;border:0;cursor:pointer"><div style="display:flex;justify-content:space-between;align-items:center"><b>🎯 আজকের টার্গেট</b><b style="color:' + tgCol(p) + '">' + p + '%</b></div>' + tgBar(p) + '<div class="mut" style="font-size:12px;margin-top:6px">' + ((lg || []).length ? 'আপডেট দিতে চাপুন' : 'আজ এখনো আপডেট দেননি — চাপুন') + '</div></button>');
      document.getElementById('htg').onclick = () => viewTargets();
    }
  } catch (e) {}
}
viewHome = async function () { const pr = _vhTg(); tgHomeCard(); return pr; };
if (document.getElementById('hatt') || document.getElementById('scard')) tgHomeCard();
const _vmTg = viewMenu;
viewMenu = function () {
  const r = _vmTg();
  const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-tg')) { t.insertAdjacentHTML('afterbegin', '<button class="tile" id="m-tg"><span class="ic">🎯</span><b>টার্গেট</b><small>আজকের আপডেট দিন</small></button>' + (isMgr() ? '<button class="tile" id="m-tgt"><span class="ic">📊</span><b>টিমের টার্গেট</b><small>সবার আজকের অবস্থা</small></button>' : '')); document.getElementById('m-tg').onclick = () => viewTargets(); const tt = document.getElementById('m-tgt'); if (tt) tt.onclick = viewTargetsTeam; }
  return r;
};
const _vaTg = viewAdmin;
viewAdmin = async function () {
  const pr = _vaTg();
  const t = document.querySelector('.tiles');
  if (t && !document.getElementById('x-tg')) { t.insertAdjacentHTML('afterbegin', '<button class="tile hl" id="x-tg"><span class="ic">🎯</span><b>টার্গেট</b><small>সবার অগ্রগতি · PDF</small></button>'); document.getElementById('x-tg').onclick = viewTargetsTeam; }
  return pr;
};
}
