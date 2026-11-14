/* 🎙️ meeting attendance + 📥 daily full report (admin) */
{
const MT = [{ k: 'morning', name: 'সকালের মিটিং', t: '09:15' }, { k: 'night', name: 'রাতের মিটিং', t: '19:30' }];
const MT_GRACE = 5;
const MT_ST = { cancel: ['🚫', 'মিটিং বাতিল', '#6b7280'], ok: ['✅', 'সময়মতো', '#16a34a'], late: ['⏰', 'দেরিতে', '#d97706'], absent: ['❌', 'অনুপস্থিত', '#dc2626'], leave: ['🏖', 'ছুটিতে', '#2563eb'] };
/* local copies (targets.js keeps its helpers block-scoped) */
const tgDow = d => new Date(d + 'T00:00:00Z').getUTCDay();
const tgWk = d => dateAdd(d, -((tgDow(d) + 1) % 7));
const tgN = v => Number(v || 0).toLocaleString('bn-BD', { maximumFractionDigits: 1 });
const tgDate = d => new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { weekday: 'short', day: 'numeric', month: 'short' });
const tgT12 = s => { const [h, m] = s.split(':').map(Number); return ((h % 12) || 12) + ':' + String(m).padStart(2, '0') + (h < 12 ? ' AM' : ' PM'); };
const tgStart = t => new Date(Date.parse(t.created_at) + 6 * 3600000).toISOString().slice(0, 10);
const tgSum = (logs, tid, from, to) => logs.filter(l => l.target_id === tid && l.log_date >= from && l.log_date <= to).reduce((a, l) => a + Number(l.value || 0), 0);
const dcBal = es => 100 + es.filter(e => !e.waived).reduce((a, e) => a + e.points, 0);
const dcMonTxt = m => new Date(m + 'T00:00:00').toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' });
async function tgLoad(uids, from, to) {
  const [t, l, n] = await Promise.all([sb.from('yg_targets').select('*').eq('active', true).order('sort'), sb.from('yg_target_logs').select('user_id,target_id,log_date,value').gte('log_date', from).lte('log_date', to), sb.from('yg_target_notes').select('user_id,log_date,note').gte('log_date', from).lte('log_date', to)]);
  return { targets: t.data || [], logs: l.data || [], notes: n.data || [] };
}
const mtMin = s => { const [h, m] = String(s).split(':').map(Number); return h * 60 + m; };
const mtNowHM = () => new Date(Date.now() + 6 * 3600000).toISOString().slice(11, 16);
const mtFri = d => new Date(d + 'T00:00:00Z').getUTCDay() === 5;
const mtPeople = () => Object.values(ui.people).filter(p => !p.observer && (!p.status || p.status === 'active')).sort((a, b) => a.full_name.localeCompare(b.full_name));
const mtLeaveOn = (lv, u, d) => lv.some(l => l.user_id === u && l.status === 'approved' && l.start_date <= d && (l.end_date || l.start_date) >= d);
let mtSel = null;

async function viewMeetings(day, mk) {
  cleanupChannels();
  const today = todayDhaka(); day = day || today;
  if (!mk) mk = day === today && mtNowHM() >= '17:00' ? 'night' : 'morning';
  mtSel = { day, mk };
  const mg = isMgr(), m = MT.find(x => x.k === mk);
  $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>🎙️ মিটিং হাজিরা</h1></div><div class="pad" id="mtb" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div>';
  document.getElementById('bk').onclick = () => go('home');
  await loadPeople();
  const box = document.getElementById('mtb'); if (!box) return;
  if (!mg) return mtMine(box);
  const [{ data: rows, error }, { data: cx }, { data: lv }] = await Promise.all([
    sb.from('yg_meeting_att').select('*').eq('day', day).eq('meeting', mk),
    sb.from('yg_meeting_cancel').select('*').eq('day', day).eq('meeting', mk).maybeSingle(),
    sb.from('leave_requests').select('user_id,status,start_date,end_date').eq('status', 'approved').lte('start_date', day)]);
  const cxRpc = async (on, reason) => { const { error: e } = await sb.rpc('yg_meeting_cancel', { p_day: day, p_meeting: mk, p_reason: reason || '', p_cancel: on }); if (e) return toast(friendlyError(e)); toast(on ? 'মিটিং বাতিল করা হয়েছে' : 'বাতিল প্রত্যাহার করা হয়েছে'); viewMeetings(day, mk); };
  if (error) { box.innerHTML = '<div class="msg err">' + esc(friendlyError(error)) + '</div>'; return; }
  const by = {}; (rows || []).forEach(r => by[r.user_id] = r);
  const ps = mtPeople(), cnt = k => ps.filter(p => by[p.id] && by[p.id].status === k).length, un = ps.filter(p => !by[p.id]);
  box.innerHTML = '<div style="display:flex;gap:8px;align-items:center"><button class="btn ghost" id="mtp" style="margin:0;width:auto;padding:8px 12px">‹</button><input type="date" class="in" id="mtd" value="' + day + '" max="' + today + '" style="margin:0;flex:1"><button class="btn ghost" id="mtn" style="margin:0;width:auto;padding:8px 12px" ' + (day >= today ? 'disabled' : '') + '>›</button></div>'
    + '<div class="chips" style="padding:10px 0 0">' + MT.map(x => '<button class="chip ' + (x.k === mk ? 'on' : '') + '" data-mk="' + x.k + '">' + x.name + ' · ' + tgT12(x.t) + '</button>').join('') + '</div>'
    + (mtFri(day) ? '<div class="empty">শুক্রবার মিটিং নেই 🌙</div>' : cx ? '<div class="card" style="margin-top:12px;border:1.5px solid #dc2626;text-align:center"><div style="font-size:30px">🚫</div><b>' + m.name + ' বাতিল করা হয়েছে</b>' + (cx.reason ? '<div class="mut" style="font-size:13px;margin-top:4px">কারণ: ' + esc(cx.reason) + '</div>' : '') + '<div class="mut" style="font-size:12px;margin-top:6px">এই মিটিংয়ের জন্য কারো পয়েন্ট কাটবে না। ' + (ui.people[cx.cancelled_by] ? 'বাতিল করেছেন ' + esc(ui.people[cx.cancelled_by].full_name) : '') + '</div><button class="btn ghost" id="mtunc">↩️ বাতিল প্রত্যাহার করুন</button></div>' :
      '<div class="card" style="margin-top:10px;display:flex;justify-content:space-around;text-align:center;font-size:12.5px"><div><b style="font-size:20px;color:#16a34a">' + cnt('ok') + '</b><br>সময়মতো</div><div><b style="font-size:20px;color:#d97706">' + cnt('late') + '</b><br>দেরিতে</div><div><b style="font-size:20px;color:#dc2626">' + cnt('absent') + '</b><br>অনুপস্থিত</div><div><b style="font-size:20px;color:#2563eb">' + cnt('leave') + '</b><br>ছুটি</div><div><b style="font-size:20px">' + un.length + '</b><br>বাকি</div></div>'
      + '<div class="mut" style="font-size:12px;margin-top:6px">শুরু ' + tgT12(m.t) + ' · ' + MT_GRACE + ' মিনিটের পরে যোগ দিলে দেরি (−২), না এলে অনুপস্থিত (−৫)। ছুটিতে থাকলে কাটে না।</div>'
      + ps.map(p => { const r = by[p.id], s = r && MT_ST[r.status], onLv = mtLeaveOn(lv || [], p.id, day);
        return '<div class="card" style="margin-top:10px"><div class="row">' + avatar(p.full_name, p.id, 36) + '<div class="rt"><b>' + esc(p.full_name) + '</b><span>' + (s ? '<b style="color:' + s[2] + '">' + s[0] + ' ' + s[1] + '</b>' + (r.join_at && r.status !== 'absent' && r.status !== 'leave' ? ' · যোগ ' + tgT12(r.join_at.slice(0, 5)) + (r.late_min > 0 ? ' (' + tgN(r.late_min) + ' মি. পরে)' : '') : '') : (onLv ? '🏖 অনুমোদিত ছুটিতে আছেন' : 'এখনো দেওয়া হয়নি')) + '</span></div></div>'
          + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px"><button class="btn ghost" data-in="' + p.id + '" style="margin:0;padding:8px">✅ এসেছে</button><button class="btn ghost" data-ab="' + p.id + '" style="margin:0;padding:8px">❌ আসেনি</button><button class="btn ghost" data-lv="' + p.id + '" style="margin:0;padding:8px">🏖 ছুটি</button></div></div>'; }).join('')
      + (un.length ? '<div class="two" style="margin-top:14px"><button class="btn" id="mtall" style="margin-top:0">✅ বাকি সবাই সময়মতো</button><button class="btn ghost" id="mtabs" style="margin-top:0">❌ বাকিরা অনুপস্থিত</button></div>' : '')
      + '<button class="btn ghost" id="mtcx" style="margin-top:14px;color:#dc2626">🚫 এই মিটিং বাতিল করুন</button>');
  document.getElementById('mtd').onchange = e => e.target.value && viewMeetings(e.target.value > today ? today : e.target.value, mk);
  document.getElementById('mtp').onclick = () => viewMeetings(dateAdd(day, -1), mk);
  document.getElementById('mtn').onclick = () => { if (day < today) viewMeetings(dateAdd(day, 1), mk); };
  box.querySelectorAll('[data-mk]').forEach(b => b.onclick = () => viewMeetings(day, b.dataset.mk));
  if (mtFri(day)) return;
  if (cx) { document.getElementById('mtunc').onclick = () => cxRpc(false); return; }
  document.getElementById('mtcx').onclick = () => sheet('<h3>🚫 ' + m.name + ' বাতিল (' + tgDate(day) + ')</h3><input class="in" id="mtcr" placeholder="কারণ (যেমন: ক্লায়েন্ট মিটিং, ছুটির দিন)"><div class="mut" style="font-size:12px;margin-top:6px">বাতিল করলে এই মিটিংয়ে দেওয়া সব হাজিরা মুছে যাবে আর কাটা পয়েন্ট (যদি থাকে) ফেরত যাবে। পরে প্রত্যাহারও করা যাবে।</div><button class="btn" id="mtcok" style="background:#dc2626">বাতিল নিশ্চিত করুন</button>', (el, close) => { el.querySelector('#mtcok').onclick = () => { const r = el.querySelector('#mtcr').value; close(); cxRpc(true, r); }; });
  const save = async list => {
    const { error: e } = await sb.from('yg_meeting_att').upsert(list.map(x => Object.assign({ day, meeting: mk, marked_by: state.profile.id, marked_at: new Date().toISOString(), late_min: 0, join_at: null }, x)), { onConflict: 'day,meeting,user_id' });
    if (e) return toast(friendlyError(e));
    toast('সেভ হয়েছে ✓'); viewMeetings(day, mk);
  };
  const late = j => Math.max(0, mtMin(j) - mtMin(m.t));
  const stOf = j => late(j) > MT_GRACE ? 'late' : 'ok';
  box.querySelectorAll('[data-in]').forEach(b => b.onclick = () => {
    const u = b.dataset.in, def = day === today && mtNowHM() > m.t ? mtNowHM() : m.t;
    sheet('<h3>' + esc(ui.people[u].full_name) + ' কখন যোগ দিয়েছেন?</h3><input type="time" class="in" id="mtj" value="' + def + '"><div class="mut" style="font-size:12px;margin-top:6px">মিটিং শুরু ' + tgT12(m.t) + ' — ' + MT_GRACE + ' মিনিট পর্যন্ত সময়মতো ধরা হবে।</div><button class="btn" id="mtok">সেভ করুন</button>', (el, close) => {
      el.querySelector('#mtok').onclick = () => { const j = el.querySelector('#mtj').value || m.t; close(); save([{ user_id: u, status: stOf(j), join_at: j, late_min: late(j) }]); };
    });
  });
  box.querySelectorAll('[data-ab]').forEach(b => b.onclick = () => save([{ user_id: b.dataset.ab, status: 'absent' }]));
  box.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => save([{ user_id: b.dataset.lv, status: 'leave' }]));
  const all = document.getElementById('mtall');
  if (all) all.onclick = () => save(un.map(p => mtLeaveOn(lv || [], p.id, day) ? { user_id: p.id, status: 'leave' } : { user_id: p.id, status: 'ok', join_at: m.t }));
  const abs = document.getElementById('mtabs');
  if (abs) abs.onclick = () => { if (confirm('বাকি ' + un.length + ' জনকে অনুপস্থিত ধরা হবে (ছুটিতে থাকলে ছুটি)। নিশ্চিত?')) save(un.map(p => ({ user_id: p.id, status: mtLeaveOn(lv || [], p.id, day) ? 'leave' : 'absent' }))); };
}

async function mtMine(box) {
  const from = dateAdd(todayDhaka(), -29);
  const [{ data }, { data: cxs }] = await Promise.all([sb.from('yg_meeting_att').select('*').eq('user_id', state.profile.id).gte('day', from).order('day', { ascending: false }), sb.from('yg_meeting_cancel').select('day,meeting,reason').gte('day', from)]);
  const rs = (data || []).concat((cxs || []).map(x => Object.assign({ status: 'cancel', late_min: 0 }, x))).sort((a, b) => a.day < b.day ? 1 : a.day > b.day ? -1 : (a.meeting === 'night' ? -1 : 1)), c = k => rs.filter(r => r.status === k).length;
  box.innerHTML = '<div class="card" style="display:flex;justify-content:space-around;text-align:center;font-size:12.5px"><div><b style="font-size:20px;color:#16a34a">' + c('ok') + '</b><br>সময়মতো</div><div><b style="font-size:20px;color:#d97706">' + c('late') + '</b><br>দেরিতে</div><div><b style="font-size:20px;color:#dc2626">' + c('absent') + '</b><br>অনুপস্থিত</div></div><div class="mut" style="font-size:12px;margin-top:6px">শেষ ৩০ দিন · হাজিরা নেন অ্যাডমিন/ম্যানেজার। সকাল ' + tgT12(MT[0].t) + ', রাত ' + tgT12(MT[1].t) + '; ' + MT_GRACE + ' মিনিটের পরে দেরি (−২), না এলে −৫।</div>'
    + (rs.length ? rs.map(r => { const s = MT_ST[r.status]; return '<div class="card" style="margin-top:8px;display:flex;justify-content:space-between;gap:8px"><span>' + tgDate(r.day) + ' · ' + (r.meeting === 'morning' ? 'সকাল' : 'রাত') + '</span><b style="color:' + s[2] + '">' + s[0] + ' ' + s[1] + (r.late_min > 0 && r.status === 'late' ? ' (' + tgN(r.late_min) + ' মি.)' : '') + '</b></div>'; }).join('') : '<div class="empty">এখনো কোনো হাজিরা নেই</div>');
}
window.viewMeetings = viewMeetings;

/* ---------- ⚠️ overdue tasks: explain why ---------- */
const OD_PFX = '⚠️ দেরির কারণ / আপডেট: ';
async function odLoad() {
  const me = state.profile.id;
  const { data: ts } = await sb.from('tasks').select('id,title,due_date,status,created_by').eq('assigned_to', me).not('status', 'in', '("completed","under_review")').lt('due_date', new Date().toISOString()).order('due_date');
  const list = ts || [];
  let said = {};
  if (list.length) {
    const s0 = new Date(todayDhaka() + 'T00:00:00+06:00').toISOString();
    const { data: us } = await sb.from('task_updates').select('task_id,comment,created_at').eq('user_id', me).in('task_id', list.map(t => t.id)).like('comment', '⚠️ দেরির কারণ%').order('created_at');
    (us || []).forEach(u => said[u.task_id] = { text: u.comment.replace(OD_PFX, ''), today: u.created_at >= s0, at: u.created_at });
  }
  return { list, said };
}
async function viewOverdue() {
  cleanupChannels();
  $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>⚠️ ডেডলাইন পার হওয়া কাজ</h1></div><div class="pad" id="odb" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div>';
  document.getElementById('bk').onclick = () => go('home');
  await loadPeople();
  const { list, said } = await odLoad();
  const box = document.getElementById('odb'); if (!box) return;
  if (!list.length) { box.innerHTML = '<div class="empty">🎉 আপনার কোনো কাজ ডেডলাইন পার হয়নি</div>'; return; }
  const ago = d => { const h = Math.floor((Date.now() - Date.parse(d)) / 3600000); return h < 24 ? tgN(h) + ' ঘণ্টা' : tgN(Math.floor(h / 24)) + ' দিন'; };
  box.innerHTML = '<div class="mut" style="font-size:12.5px">এই কাজগুলোর ডেডলাইন পার হয়ে গেছে। প্রতিটার জন্য কেন শেষ হয়নি বা এখন কী অবস্থা — লিখে পাঠান। যিনি কাজ দিয়েছেন আর অ্যাডমিন সাথে সাথে নোটিফিকেশন পাবেন। শেষ হয়ে গেলে টাস্ক খুলে "সম্পন্ন" করে দিন।</div>'
    + list.map(t => { const sd = said[t.id]; return '<div class="card" style="margin-top:10px;border:' + (sd && sd.today ? '1.5px solid #16a34a' : '1.5px solid #fca5a5') + '"><b>' + esc(t.title) + '</b><div class="mut" style="font-size:12px;margin-top:2px">ডেডলাইন ছিল ' + tgDate(new Date(Date.parse(t.due_date) + 6 * 3600000).toISOString().slice(0, 10)) + ' · ' + ago(t.due_date) + ' পার' + (ui.people[t.created_by] ? ' · দিয়েছেন ' + esc(ui.people[t.created_by].full_name) : '') + '</div>'
      + (sd ? '<div style="font-size:12.5px;margin-top:6px;background:#f6f8fb;border-radius:8px;padding:6px 8px">' + (sd.today ? '✅ আজ জানিয়েছেন: ' : '🕘 শেষ জানিয়েছিলেন (' + tgDate(new Date(Date.parse(sd.at) + 6 * 3600000).toISOString().slice(0, 10)) + '): ') + esc(sd.text) + '</div>' : '')
      + '<textarea class="in" data-r="' + t.id + '" rows="2" placeholder="কেন শেষ হয়নি / এখন কী অবস্থা / কবে শেষ হবে" style="margin-top:8px"></textarea><div class="two" style="margin-top:6px"><button class="btn" data-send="' + t.id + '" style="margin-top:0;padding:9px">📨 পাঠান</button><button class="btn ghost" data-open="' + t.id + '" style="margin-top:0;padding:9px">টাস্ক খুলুন</button></div></div>'; }).join('');
  box.querySelectorAll('[data-open]').forEach(b => b.onclick = () => viewTask(b.dataset.open));
  box.querySelectorAll('[data-send]').forEach(b => b.onclick = async () => {
    const id = b.dataset.send, v = (box.querySelector('[data-r="' + id + '"]').value || '').trim();
    if (v.length < 3) return toast('কারণটা একটু লিখে দিন');
    b.disabled = true;
    const { error } = await sb.rpc('yg_overdue_reason', { p_task: id, p_reason: v });
    if (error) { b.disabled = false; return toast(friendlyError(error)); }
    toast('পাঠানো হয়েছে ✓'); viewOverdue();
  });
}
window.viewOverdue = viewOverdue;
const _hdlM = handleDeepLink;
handleDeepLink = function (href) {
  let u; try { u = new URL(href || location.href, location.href); } catch (e) { return _hdlM(href); }
  if (u.searchParams.has('od')) { try { history.replaceState(null, '', location.pathname); } catch (e) {} return viewOverdue(); }
  return _hdlM(href);
};
async function odHomeCard() {
  try {
    if (!state.profile || state.profile.observer || document.getElementById('hod')) return;
    const { list, said } = await odLoad(); if (!list.length) return;
    const left = list.filter(t => !(said[t.id] && said[t.id].today)).length;
    const anchor = document.getElementById('hmt') || document.getElementById('hdc') || document.getElementById('htg') || (document.getElementById('hatt') && document.getElementById('hatt').closest('.hrow2')) || document.getElementById('scard') || document.querySelector('.qgrid');
    if (!anchor || document.getElementById('hod')) return;
    anchor.insertAdjacentHTML('beforebegin', '<button class="card" id="hod" style="display:block;width:100%;text-align:left;margin-bottom:10px;cursor:pointer;border:1.5px solid ' + (left ? '#dc2626' : '#16a34a') + '"><div style="display:flex;justify-content:space-between;align-items:center"><b>⚠️ ডেডলাইন পার হওয়া কাজ</b><b style="color:#dc2626">' + tgN(list.length) + 'টা</b></div><div class="mut" style="font-size:12px;margin-top:4px">' + (left ? tgN(left) + 'টার কারণ আজ এখনো জানাননি — চাপ দিয়ে জানান' : '✅ আজ সবগুলোর আপডেট দিয়েছেন') + '</div></button>');
    document.getElementById('hod').onclick = viewOverdue;
  } catch (e) {}
}

/* ---------- 📥 daily full report (admin only) ---------- */
const dfT = ts => ts ? new Date(ts).toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true }) : '—';
const dfD = ts => ts ? new Date(ts).toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka', day: '2-digit', month: 'short' }) : '—';
const dfH = t => '<div style="margin-top:18px"><b style="font-size:15.5px;color:#141414">' + t + '</b></div>';
const dfTable = (head, rows, empty) => rows.length ? '<table class="trt"><thead><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map((c, i) => '<td' + (i ? ' class="n"' : '') + '>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>' : '<div style="font-size:12px;color:#666;margin-top:4px">' + (empty || 'কিছু নেই') + '</div>';

async function dfBuild(day) {
  await loadPeople();
  const ps = mtPeople(), ids = ps.map(p => p.id), nm = u => esc((ui.people[u] || {}).full_name || '—');
  const s = new Date(day + 'T00:00:00+06:00').toISOString(), e = new Date(day + 'T23:59:59+06:00').toISOString();
  const ref = Math.min(Date.now(), Date.parse(e)), mon = day.slice(0, 8) + '01', ws = tgWk(day);
  const [tk, att, mt, lv, rp, sl, dc, pf, aw] = await Promise.all([
    sb.from('tasks').select('id,title,status,assigned_to,due_date,completed_at,created_at').or('status.neq.completed,completed_at.gte."' + s + '"').lte('created_at', e),
    sb.from('attendance').select('user_id,check_in_at,check_out_at,late_minutes,shift').eq('work_date', day),
    sb.from('yg_meeting_att').select('*').eq('day', day),
    sb.from('leave_requests').select('user_id,leave_type,reason,start_date,end_date,status,created_at').lte('start_date', dateAdd(day, 30)).gte('end_date', dateAdd(day, -1)),
    sb.from('daily_reports').select('user_id,work_done,leads_count,issues').eq('report_date', day),
    sb.from('salah_logs').select('*').eq('log_date', day),
    sb.from('yg_discipline').select('user_id,day,points,kind,reason,waived').eq('month', mon),
    sb.rpc('yg_perf_trend', { p_from: ws, p_to: day, p_bucket: 'week' }),
    sb.from('yg_award_log').select('*').order('week_start', { ascending: false }).limit(3)]);
  const { data: CX0 } = await sb.from('yg_meeting_cancel').select('meeting,reason').eq('day', day); const CX = CX0 || [], cxd = k => CX.find(x => x.meeting === k);
  const T = tgLoad(null, day, day);
  const { data: RS0 } = await sb.from('task_updates').select('task_id,comment,created_at').gte('created_at', s).lte('created_at', e).like('comment', '⚠️ দেরির কারণ%').order('created_at');
  const rsn = {}; (RS0 || []).forEach(x => rsn[x.task_id] = x.comment.replace(/^⚠️ দেরির কারণ \/ আপডেট: /, ''));
  const tasks = (tk.data || []).filter(t => ids.includes(t.assigned_to));
  const done = tasks.filter(t => t.completed_at && t.completed_at >= s && t.completed_at <= e);
  const open = tasks.filter(t => t.status !== 'completed' || (t.completed_at && t.completed_at > e));
  const over = open.filter(t => t.due_date && Date.parse(t.due_date) < ref);
  const A = att.data || [], M = mt.data || [], L = (lv.data || []).filter(l => l.start_date <= day && (l.end_date || l.start_date) >= day || (l.created_at >= s && l.created_at <= e)), R = rp.data || [], S = sl.data || [], DC = dc.data || [];
  const offc = ps.filter(p => p.work_mode !== 'remote'), present = new Set(A.map(a => a.user_id)).size, repN = ps.filter(p => p.daily_report !== false).length;
  const mc = (k, st) => M.filter(r => r.meeting === k && st.includes(r.status)).length;
  const D = await T;

  let h = '<div class="trs" style="display:grid;grid-template-columns:repeat(4,1fr);text-align:center">'
    + [[present + '/' + offc.length, 'অফিসে উপস্থিত'], [done.length, 'আজ শেষ হওয়া টাস্ক'], [over.length, 'ওভারডিউ টাস্ক'], [R.length + '/' + repN, 'ডেইলি রিপোর্ট'],
       [cxd('morning') ? '🚫' : mc('morning', ['ok', 'late']) + '/' + ps.length, cxd('morning') ? 'সকালের মিটিং বাতিল' : 'সকালের মিটিং'], [cxd('night') ? '🚫' : mc('night', ['ok', 'late']) + '/' + ps.length, cxd('night') ? 'রাতের মিটিং বাতিল' : 'রাতের মিটিং'], [L.filter(l => l.status === 'approved' && l.start_date <= day).length, 'আজ ছুটিতে'], [DC.filter(x => x.day === day && !x.waived && x.points < 0).length, 'আজ পয়েন্ট কাটা']]
      .map(([b, t]) => '<div><b>' + b + '</b><br><span>' + t + '</span></div>').join('') + '</div>';

  // 1. tasks per member
  h += dfH('📋 টাস্ক — কার কাছে কী আছে');
  h += dfTable(['সদস্য', 'আজ শেষ', 'চলমান', 'ওভারডিউ'], ps.map(p => [esc(p.full_name), done.filter(t => t.assigned_to === p.id).length, open.filter(t => t.assigned_to === p.id).length, over.filter(t => t.assigned_to === p.id).length]));
  ps.forEach(p => {
    const d1 = done.filter(t => t.assigned_to === p.id), o1 = open.filter(t => t.assigned_to === p.id).sort((a, b) => (a.due_date || 'z') < (b.due_date || 'z') ? -1 : 1);
    if (!d1.length && !o1.length) return;
    h += '<div style="margin-top:10px;font-size:12px;line-height:1.6"><b style="font-size:13px">' + esc(p.full_name) + '</b><br>'
      + d1.map(t => '✅ ' + esc(t.title) + ' <span style="color:#666">(' + dfT(t.completed_at) + (t.due_date && t.completed_at > t.due_date ? ', ডেডলাইনের পরে' : '') + ')</span>').join('<br>') + (d1.length && o1.length ? '<br>' : '')
      + o1.map(t => { const od = t.due_date && Date.parse(t.due_date) < ref; return (od ? '🔴 ' : '🕒 ') + esc(t.title) + ' <span style="color:' + (od ? '#DC2626' : '#666') + '">(' + (t.due_date ? 'ডেডলাইন ' + dfD(t.due_date) + ' ' + dfT(t.due_date) : 'ডেডলাইন নেই') + (od ? ' — ওভারডিউ' : '') + ')</span>' + (rsn[t.id] ? '<br><span style="color:#444;padding-left:18px">💬 কারণ: ' + esc(rsn[t.id]) + '</span>' : (od ? '<br><span style="color:#999;padding-left:18px">💬 আজ কোনো কারণ জানাননি</span>' : '')); }).join('<br>') + '</div>';
  });

  // 2. targets
  h += dfH('🎯 আজকের টার্গেট');
  const team = {}, trows = [];
  ps.forEach(p => D.targets.filter(t => t.user_id === p.id && tgStart(t) <= day).forEach(t => {
    const v = tgSum(D.logs, t.id, day, day), k = t.label + '|' + t.unit;
    team[k] = team[k] || { label: t.label, unit: t.unit, d: 0, v: 0 }; team[k].d += Number(t.daily || 0); team[k].v += v;
    trows.push([esc(p.full_name), esc(t.label), tgN(t.daily) + ' ' + esc(t.unit), tgN(v), (t.daily ? Math.round(v / t.daily * 100) : 0) + '%']);
  }));
  h += dfTable(['সদস্য', 'কাজ', 'দৈনিক লক্ষ্য', 'অর্জন', '%'], trows, 'আজ কোনো টার্গেট নেই');
  const tv = Object.values(team);
  if (tv.length) h += '<div style="margin-top:8px"><b style="font-size:13px">👥 টিম টার্গেট</b></div>' + dfTable(['কাজ', 'দৈনিক লক্ষ্য', 'অর্জন', '%'], tv.map(x => [esc(x.label), tgN(x.d) + ' ' + esc(x.unit), tgN(x.v), (x.d ? Math.round(x.v / x.d * 100) : 0) + '%']));
  const nt = D.notes.filter(n => n.note && ids.includes(n.user_id));
  if (nt.length) h += '<div style="font-size:11.5px;color:#444;margin-top:4px">' + nt.map(n => '📝 ' + nm(n.user_id) + ': ' + esc(n.note)).join('<br>') + '</div>';

  // 3. office attendance
  h += dfH('🏢 অফিস হাজিরা');
  h += dfTable(['সদস্য', 'শিফট', 'ঢোকা', 'বের হওয়া', 'দেরি'], ps.flatMap(p => { const a = A.filter(x => x.user_id === p.id).sort((x, y) => (x.shift || 0) - (y.shift || 0)); if (!a.length && p.work_mode === 'remote') return [[esc(p.full_name), '—', '🏠 রিমোট', '—', '—']]; if (!a.length) return [[esc(p.full_name), '—', mtLeaveOn(L, p.id, day) ? '🏖 ছুটি' : (mtFri(day) ? 'শুক্রবার' : '❌ আসেননি'), '—', '—']]; return a.map(x => [esc(p.full_name), x.shift || 1, dfT(x.check_in_at), dfT(x.check_out_at), x.late_minutes > 0 ? x.late_minutes + ' মি.' : '✓']); }));

  // 4. meetings
  h += dfH('🎙️ মিটিং হাজিরা');
  const ms = (u, k) => { if (cxd(k)) return '🚫 বাতিল' + (cxd(k).reason ? ' (' + esc(cxd(k).reason) + ')' : ''); const r = M.find(x => x.user_id === u && x.meeting === k); if (!r) return mtFri(day) ? '—' : 'দেওয়া হয়নি'; const st = MT_ST[r.status]; return st[0] + ' ' + st[1] + (r.status === 'late' ? ' (' + r.late_min + ' মি.)' : ''); };
  h += dfTable(['সদস্য', 'সকাল ' + tgT12(MT[0].t), 'রাত ' + tgT12(MT[1].t)], ps.map(p => [esc(p.full_name), ms(p.id, 'morning'), ms(p.id, 'night')]));

  // 5. leave
  h += dfH('🏖 ছুটির আবেদন');
  const lvs = { approved: '✅ অনুমোদিত', pending: '⏳ অপেক্ষমাণ', rejected: '❌ বাতিল' };
  h += dfTable(['সদস্য', 'ধরন', 'তারিখ', 'অবস্থা'], L.filter(l => ids.includes(l.user_id)).map(l => [nm(l.user_id), esc(l.leave_type || '') + (l.reason ? '<br><span style="color:#666;font-weight:400">' + esc(String(l.reason).slice(0, 80)) + '</span>' : ''), dfD(l.start_date + 'T00:00:00+06:00') + (l.end_date && l.end_date !== l.start_date ? ' – ' + dfD(l.end_date + 'T00:00:00+06:00') : ''), lvs[l.status] || esc(l.status)]), 'আজ কোনো ছুটি বা নতুন আবেদন নেই');

  // 6. daily reports
  h += dfH('📝 ডেইলি রিপোর্ট');
  h += dfTable(['সদস্য', 'লিড', 'কী কাজ করেছেন'], ps.filter(p => p.daily_report !== false).map(p => { const r = R.find(x => x.user_id === p.id); return r ? [esc(p.full_name), r.leads_count ?? '—', '<span style="font-weight:400">' + esc(String(r.work_done || '').slice(0, 220)) + (r.issues ? '<br>⚠️ ' + esc(String(r.issues).slice(0, 120)) : '') + '</span>'] : [esc(p.full_name), '—', '<span style="color:#DC2626">জমা দেননি</span>']; }));

  // 7. salah
  h += dfH('🕌 নামাজ');
  const W = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  h += dfTable(['সদস্য', 'ওয়াক্ত', 'অবস্থা'], ps.map(p => { const x = S.find(y => y.user_id === p.id); if (!x) return [esc(p.full_name), '—', 'হিসাব দেননি']; if (x.excused) return [esc(p.full_name), '—', 'ওজর']; const n = W.filter(w => x[w]).length; return [esc(p.full_name), n + '/5', n === 5 ? '🌟 পূর্ণ' : '']; }));

  // 8. performance + awards
  h += dfH('📈 পারফরম্যান্স (এই সপ্তাহ, ' + dfD(ws + 'T00:00:00+06:00') + ' থেকে)');
  const P = (pf.data || []).filter(r => ids.includes(r.user_id)).sort((a, b) => b.score - a.score);
  h += dfTable(['সদস্য', 'র‍্যাংক', 'স্কোর', 'টাস্ক %', 'টার্গেট %', 'টাস্ক'], P.map((r, i) => [(i < 3 ? ['🥇', '🥈', '🥉'][i] + ' ' : '') + esc(r.full_name), i + 1, '<b>' + r.score + '</b>', r.task_pct ?? '—', r.target_pct ?? '—', r.tasks_n]), 'এই সপ্তাহের ডেটা নেই');
  const AW = (aw.data || []), wk = AW.length && AW[0].week_start;
  if (wk) h += '<div style="font-size:12.5px;margin-top:6px">🏆 সপ্তাহের সেরা (' + dfD(wk + 'T00:00:00+06:00') + ' সপ্তাহ): ' + AW.filter(x => x.week_start === wk).sort((a, b) => a.place - b.place).map(x => ['🥇', '🥈', '🥉'][x.place - 1] + ' ' + nm(x.user_id)).join(' · ') + '</div>';

  // 9. discipline
  h += dfH('🧾 শৃঙ্খলা পয়েন্ট — ' + dcMonTxt(mon));
  h += dfTable(['সদস্য', 'মাসের ব্যালান্স', 'আজকের পরিবর্তন'], ps.map(p => { const es = DC.filter(x => x.user_id === p.id), td = es.filter(x => x.day === day && !x.waived); return [esc(p.full_name), '<b>' + dcBal(es) + '/100</b>', td.length ? '<span style="font-weight:400">' + td.map(x => (x.points > 0 ? '+' : '') + x.points + ' ' + esc(x.reason || '')).join('<br>') + '</span>' : '—']; }));

  const dt = new Date(day + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  return { dt, html: '<div class="trep pdf"><div class="trh"><img src="mark.jpg" alt=""><div><b>Yaqeen Group</b><span>Daily Full Report · দৈনিক সম্পূর্ণ রিপোর্ট</span></div><div class="trd">' + dt + '</div></div>' + h + '<div class="trf">Generated by Yaqeen Group Team App · ' + new Date().toLocaleString('en-GB') + '</div></div>' };
}

function dfSheet() {
  if (!isAdmin()) return;
  const t = todayDhaka();
  sheet('<h3>📥 দৈনিক সম্পূর্ণ রিপোর্ট</h3><div class="mut" style="font-size:12.5px">টাস্ক, টার্গেট, অফিস ও মিটিং হাজিরা, ছুটি, ডেইলি রিপোর্ট, নামাজ, পারফরম্যান্স, পুরস্কার আর শৃঙ্খলা পয়েন্ট — সব এক PDF-এ।</div><input type="date" class="in" id="dfd" value="' + t + '" max="' + t + '" style="margin-top:10px"><div class="two"><button class="btn" id="dfdl">⬇️ PDF ডাউনলোড</button><button class="btn ghost" id="dfsh">📤 শেয়ার</button></div>', (el, close) => {
    const run = async share => {
      const d = el.querySelector('#dfd').value || t, b = el.querySelector(share ? '#dfsh' : '#dfdl'), old = b.textContent;
      b.disabled = true; b.textContent = 'তৈরি হচ্ছে…';
      try { const r = await dfBuild(d); close(); await exportHtmlPdf(r.html, 'Yaqeen-Daily-Report-' + d + '.pdf', share ? 'Yaqeen Group · Daily Full Report · ' + r.dt : '', share); }
      catch (e) { toast('রিপোর্ট বানানো যায়নি: ' + (e.message || e)); b.disabled = false; b.textContent = old; }
    };
    el.querySelector('#dfdl').onclick = () => run(false);
    el.querySelector('#dfsh').onclick = () => run(true);
  });
}
window.dfSheet = dfSheet;

/* hooks: home card (admin/manager), menu + admin tiles */
async function mtHomeCard() {
  try {
    if (!state.profile || !isMgr() || document.getElementById('hmt')) return;
    const d = todayDhaka(); if (mtFri(d)) return;
    await loadPeople();
    const [{ data }, { data: cxs }] = await Promise.all([sb.from('yg_meeting_att').select('meeting,status').eq('day', d), sb.from('yg_meeting_cancel').select('meeting').eq('day', d)]);
    const cxd = k => (cxs || []).some(x => x.meeting === k);
    const n = mtPeople().length, c = k => (data || []).filter(r => r.meeting === k).length, ok = k => (data || []).filter(r => r.meeting === k && (r.status === 'ok' || r.status === 'late')).length;
    const now = mtNowHM(), due = MT.filter(m => now >= m.t && c(m.k) < n && !cxd(m.k));
    const anchor = document.getElementById('hdc') || document.getElementById('htg') || (document.getElementById('hatt') && document.getElementById('hatt').closest('.hrow2')) || document.getElementById('scard') || document.querySelector('.qgrid');
    if (!anchor || document.getElementById('hmt')) return;
    anchor.insertAdjacentHTML('beforebegin', '<button class="card" id="hmt" style="display:block;width:100%;text-align:left;margin-bottom:10px;cursor:pointer;border:' + (due.length ? '1.5px solid #d97706' : '0') + '"><div style="display:flex;justify-content:space-between;align-items:center"><b>🎙️ আজকের মিটিং</b><span style="font-size:12.5px">সকাল ' + (cxd('morning') ? '🚫 বাতিল' : c('morning') ? ok('morning') + '/' + n : '—') + ' · রাত ' + (cxd('night') ? '🚫 বাতিল' : c('night') ? ok('night') + '/' + n : '—') + '</span></div><div class="mut" style="font-size:12px;margin-top:4px">' + (due.length ? '⚠️ ' + due[0].name + 'ের হাজিরা বাকি — চাপুন' : 'হাজিরা দেখতে বা নিতে চাপুন') + '</div></button>');
    document.getElementById('hmt').onclick = () => viewMeetings(d, due.length ? due[0].k : undefined);
  } catch (e) {}
}
const _vhMt = viewHome;
viewHome = async function () { const pr = _vhMt(); setTimeout(mtHomeCard, 400); setTimeout(odHomeCard, 700); return pr; };
if (document.getElementById('hatt') || document.getElementById('scard')) setTimeout(odHomeCard, 700);
if (document.getElementById('hatt') || document.getElementById('scard')) setTimeout(mtHomeCard, 400);
const _vmMt = viewMenu;
viewMenu = function () {
  const r = _vmMt(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-mt') && state.profile && !state.profile.observer) {
    t.insertAdjacentHTML('afterbegin', '<button class="tile" id="m-mt"><span class="ic">🎙️</span><b>' + (isMgr() ? 'মিটিং হাজিরা' : 'আমার মিটিং') + '</b><small>' + (isMgr() ? 'সকাল ও রাতের হাজিরা নিন' : 'সকাল ও রাতের হাজিরা') + '</small></button>');
    document.getElementById('m-mt').onclick = () => viewMeetings();
  }
  return r;
};
const _vaMt = viewAdmin;
viewAdmin = async function () {
  const pr = _vaMt(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('x-df')) {
    t.insertAdjacentHTML('afterbegin', '<button class="tile hl" id="x-df"><span class="ic">📥</span><b>দৈনিক সম্পূর্ণ রিপোর্ট</b><small>সব কিছু এক PDF-এ</small></button><button class="tile hl" id="x-mt"><span class="ic">🎙️</span><b>মিটিং হাজিরা</b><small>সকাল ৯:১৫ · রাত ৭:৩০</small></button>');
    document.getElementById('x-df').onclick = dfSheet; document.getElementById('x-mt').onclick = () => viewMeetings();
  }
  return pr;
};
}
