/* 📎 task proof (screenshot / PDF / link) + late-submission reason + meeting-miss reason, with Google Drive backup */
{
const PF_T = { file: '📷 স্ক্রিনশট / PDF', link: '🔗 লিংক', any: '📷 স্ক্রিনশট / PDF অথবা 🔗 লিংক' };
const MR_START = '2026-11-22';
const pfMe = () => state.profile && state.profile.id;
const pfName = () => (state.profile && state.profile.full_name) || '';
const pfDT = d => new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
const pfDay = d => new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { weekday: 'short', day: 'numeric', month: 'short' });

/* ---------- file: shrink photos, upload to private "proofs" storage ---------- */
function pfLoadImg(file) {
  return new Promise((res, rej) => { const u = URL.createObjectURL(file), i = new Image(); i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.onerror = () => { URL.revokeObjectURL(u); rej(new Error('ছবিটা খোলা যায়নি')); }; i.src = u; });
}
async function pfPrepare(file) {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    if (file.size > 5 * 1024 * 1024) throw new Error('PDF ৫ MB-এর বেশি — ছোট ফাইল দিন');
    return { blob: file, ext: 'pdf', mime: 'application/pdf' };
  }
  if (!/^image\//.test(file.type)) throw new Error('শুধু ছবি (স্ক্রিনশট) বা PDF দেওয়া যাবে');
  const img = await pfLoadImg(file), mx = 1600, k = Math.min(1, mx / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.75));
  if (!blob) throw new Error('ছবিটা প্রস্তুত করা যায়নি');
  return { blob, ext: 'jpg', mime: 'image/jpeg' };
}
async function pfUpload(file) {
  const p = await pfPrepare(file);
  const path = pfMe() + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + p.ext;
  const { error } = await sb.storage.from('proofs').upload(path, p.blob, { contentType: p.mime, upsert: false });
  if (error) throw error;
  return { path, name: file.name || ('proof.' + p.ext), mime: p.mime, blob: p.blob };
}
const pfFile = el => (el && el.files && el.files[0]) || null;

/* ---------- Google Drive backup (admin Drive via Apps Script) ---------- */
let pfBk;
async function pfBackupUrl() {
  if (pfBk !== undefined) return pfBk;
  try { const { data } = await sb.rpc('yg_backup_url'); pfBk = data || null; } catch (e) { pfBk = null; }
  return pfBk;
}
const pfB64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
async function pfBackup(meta, blob) {
  try {
    const url = await pfBackupUrl(); if (!url) return;
    const { data } = await sb.auth.getSession(); const s = data && data.session; if (!s) return;
    const body = Object.assign({ token: s.access_token, person: pfName() }, meta);
    if (blob) { body.data = await pfB64(blob); body.mime = blob.type || meta.mime || 'application/octet-stream'; }
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (j && j.ok) await sb.rpc('yg_backup_mark', { p_kind: meta.kind, p_id: meta.id, p_url: j.url || 'sheet' });
  } catch (e) {}
}
/* items that could not reach Drive earlier (no internet etc.) — retried once per app start */
let pfRetried = false;
async function pfRetry() {
  if (pfRetried || !pfMe()) return; pfRetried = true;
  if (!(await pfBackupUrl())) return;
  const since = new Date(Date.now() - 14 * 86400000).toISOString();
  const [{ data: tp }, { data: mr }] = await Promise.all([
    sb.from('yg_task_proofs').select('*').eq('user_id', pfMe()).is('drive_url', null).gte('created_at', since).limit(10),
    sb.from('yg_meeting_reasons').select('*').eq('user_id', pfMe()).is('drive_url', null).gte('created_at', since).limit(10)]);
  const ids = (tp || []).map(p => p.task_id);
  const { data: ts } = ids.length ? await sb.from('tasks').select('id,title').in('id', ids) : { data: [] };
  const tt = id => ((ts || []).find(x => x.id === id) || {}).title || '';
  const dl = async p => { if (!p) return null; const { data } = await sb.storage.from('proofs').download(p); return data || null; };
  for (const p of tp || []) await pfBackup({ kind: 'task', id: p.id, type: p.kind, task: tt(p.task_id), link: p.link || '', note: p.note || '', fileName: p.file_name || '', date: p.created_at }, await dl(p.file_path));
  for (const m of mr || []) await pfBackup({ kind: 'meeting', id: m.day + '|' + m.meeting + '|' + m.user_id, type: 'meeting', task: (m.meeting === 'morning' ? 'সকালের মিটিং ' : 'রাতের মিটিং ') + m.day, note: m.reason, fileName: m.file_name || '', date: m.created_at }, await dl(m.file_path));
}

/* ---------- task detail: proof box + submit flow ---------- */
const PF_CSS = '<style id="pfcss">.pfb{margin-top:14px;border:1px solid #e3e8ef;border-radius:14px;overflow:hidden;background:#fff}.pfb-h{padding:10px 12px;background:#f4f7fb;font-size:14px;display:flex;justify-content:space-between;gap:8px;align-items:center}.pfb-i{padding:9px 12px;border-top:1px solid #eef1f5;font-size:13px;line-height:1.5}.pfb-i a{color:#2563eb;font-weight:600}.pfb-i img{display:block;max-width:100%;max-height:220px;border-radius:8px;margin-top:6px;border:1px solid #e3e8ef}.pfb-i small{display:block;color:#64748b;font-size:11.5px}.pfb-w{padding:9px 12px;border-top:1px solid #eef1f5;font-size:12.5px;color:#b45309;background:#fffbeb}.pfb .btn{margin:10px 12px;width:calc(100% - 24px)}</style>';

async function pfSigned(path) { try { const { data } = await sb.storage.from('proofs').createSignedUrl(path, 3600); return data && data.signedUrl; } catch (e) { return null; } }

async function pfTaskUI(id) {
  if (!document.getElementById('ss')) return;
  const [{ data: t }, { data: pf0 }] = await Promise.all([
    sb.from('tasks').select('id,title,status,assigned_to,created_by,due_date,proof_type').eq('id', id).single(),
    sb.from('yg_task_proofs').select('*').eq('task_id', id).order('created_at')]);
  const ss = document.getElementById('ss'); if (!t || !ss) return;
  const pf = pf0 || [], mine = t.assigned_to === pfMe(), open = t.status !== 'completed';
  const late = !!t.due_date && Date.now() > Date.parse(t.due_date);
  const hasProof = pf.some(p => p.kind === 'proof'), hasLate = pf.some(p => p.kind === 'late');
  const needProof = open && !!t.proof_type && !hasProof, needLate = open && late && !hasLate;
  if (!t.proof_type && !pf.length && !(needLate && mine)) return;
  if (!document.getElementById('pfcss')) document.head.insertAdjacentHTML('beforeend', PF_CSS);
  const items = await Promise.all(pf.map(async p => {
    const u = p.file_path ? await pfSigned(p.file_path) : null;
    const file = u ? (/^image\//.test(p.file_mime || '') ? '<a href="' + esc(u) + '" target="_blank" rel="noopener"><img src="' + esc(u) + '" alt="proof"></a>' : '<a href="' + esc(u) + '" target="_blank" rel="noopener">📄 ' + esc(p.file_name || 'ফাইল') + ' খুলুন ↗</a>') : '';
    const head = p.kind === 'late' ? '<b style="color:#b45309">⚠️ দেরির কারণ:</b> ' + esc(p.note || '') : '<b>📎 প্রুফ</b>';
    const lk = p.link ? '<br>🔗 <a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.link.length > 60 ? p.link.slice(0, 60) + '…' : p.link) + '</a>' : '';
    return '<div class="pfb-i">' + head + lk + (file ? (p.kind === 'late' ? '<br>' : '') + file : '') + '<small>' + esc(personName(p.user_id)) + ' · ' + pfDT(p.created_at) + (p.drive_url && p.drive_url !== 'sheet' ? ' · <a href="' + esc(p.drive_url) + '" target="_blank" rel="noopener">Drive ↗</a>' : '') + '</small></div>';
  }));
  const req = t.proof_type ? '<span style="font-size:12px;color:#475569">লাগবে: ' + PF_T[t.proof_type] + '</span>' : '';
  const warn = [];
  if (needProof) warn.push('প্রুফ জমা না দিলে টাস্কটা শেষ (Completed) করা যাবে না।');
  if (needLate) warn.push('⏰ সময় পার হয়ে গেছে — জমা দেওয়ার আগে দেরির কারণ (আর থাকলে ডকুমেন্ট) দিতে হবে।');
  const btn = mine && open && (needProof || needLate) ? '<button class="btn" id="pfgo">' + (needProof ? '📎 প্রুফ দিয়ে জমা দিন' : '⚠️ দেরির কারণ দিয়ে জমা দিন') + '</button>' : '';
  const html = '<div class="pfb" id="pfbox"><div class="pfb-h"><b>📎 প্রুফ ও জমা</b>' + req + '</div>' + items.join('') + (warn.length ? '<div class="pfb-w">' + warn.join('<br>') + '</div>' : '') + (!items.length && !warn.length ? '<div class="pfb-i mut">এখনো কিছু জমা হয়নি</div>' : '') + btn + '</div>';
  const old = document.getElementById('pfbox');
  if (old) old.outerHTML = html;
  else { const lab = ss.previousElementSibling && ss.previousElementSibling.tagName === 'LABEL' ? ss.previousElementSibling : ss; lab.insertAdjacentHTML('beforebegin', html); }
  const go = document.getElementById('pfgo'); if (go) go.onclick = () => pfSubmitSheet(t, needProof, needLate);
  /* choosing "Completed" + Save → open the submit form instead when something is still owed */
  const sv = document.getElementById('sv');
  if (sv && mine && !isMgr() && (needProof || needLate) && !sv.dataset.pf) {
    sv.dataset.pf = '1'; const orig = sv.onclick;
    sv.onclick = e => {
      if (document.getElementById('ss').value === 'completed') return pfSubmitSheet(t, needProof, needLate);
      return orig && orig.call(sv, e);
    };
  }
}

function pfSubmitSheet(t, needProof, needLate) {
  const pt = t.proof_type;
  let h = '<h3>✅ জমা দিন</h3><p class="mut" style="margin:0 0 6px">' + esc(t.title) + '</p>';
  if (needProof) {
    h += '<div class="sec" style="margin-top:6px">📎 প্রুফ (' + PF_T[pt] + ')</div>';
    if (pt !== 'link') h += '<label>স্ক্রিনশট বা PDF</label><input class="in" id="pff" type="file" accept="image/*,application/pdf">';
    if (pt !== 'file') h += '<label>লিংক' + (pt === 'any' ? ' (ছবি/PDF না দিলে)' : '') + '</label><input class="in" id="pfl" type="url" inputmode="url" placeholder="https://…" autocomplete="off">';
  }
  if (needLate) {
    h += '<div class="msg info" style="margin-top:12px;font-size:12.5px">⏰ ডেডলাইন ছিল ' + pfDT(t.due_date) + ' — দেরিতে জমা দিচ্ছেন।</div>'
      + '<label>দেরির কারণ (অবশ্যই লিখুন)</label><textarea class="in" id="pfr" maxlength="1000" style="min-height:80px" placeholder="কেন দেরি হলো, বিস্তারিত লিখুন"></textarea>'
      + '<label>ডকুমেন্ট থাকলে দিন (ঐচ্ছিক — স্ক্রিনশট/PDF)</label><input class="in" id="pfrf" type="file" accept="image/*,application/pdf">';
  }
  h += '<button class="btn" id="pfok">জমা দিন</button>';
  sheet(h, (el, close) => {
    const ok = el.querySelector('#pfok');
    ok.onclick = async () => {
      const f = pfFile(el.querySelector('#pff')), lk = ((el.querySelector('#pfl') || {}).value || '').trim();
      const rs = ((el.querySelector('#pfr') || {}).value || '').trim(), rf = pfFile(el.querySelector('#pfrf'));
      if (needProof) {
        if (pt === 'file' && !f) return toast('স্ক্রিনশট বা PDF দিন');
        if (pt === 'link' && !lk) return toast('লিংক দিন');
        if (pt === 'any' && !f && !lk) return toast('স্ক্রিনশট/PDF অথবা লিংক দিন');
      }
      if (lk && !/^https?:\/\/\S+\.\S+/i.test(lk)) return toast('সঠিক লিংক দিন (https:// দিয়ে শুরু)');
      if (needLate && rs.length < 5) return toast('দেরির কারণটা একটু বিস্তারিত লিখুন');
      busy(ok, true);
      try {
        const up = f ? await pfUpload(f) : null, upr = rf ? await pfUpload(rf) : null;
        const { data, error } = await sb.rpc('yg_task_submit', {
          p_task: t.id, p_link: lk || null, p_path: up && up.path, p_name: up && up.name, p_mime: up && up.mime,
          p_late: needLate ? rs : null, p_late_path: upr && upr.path, p_late_name: upr && upr.name, p_late_mime: upr && upr.mime });
        if (error) throw error;
        close();
        toast(data && data.completed ? 'জমা হয়েছে — টাস্ক শেষ ✓' : 'সেভ হয়েছে ✓ এখন চেকলিস্টের বাকি ঘরে টিক দিন');
        const now = new Date().toISOString();
        if (data && data.proof_id) pfBackup({ kind: 'task', id: data.proof_id, type: 'proof', task: t.title, link: lk, note: '', fileName: up ? up.name : '', date: now }, up && up.blob);
        if (data && data.late_id) pfBackup({ kind: 'task', id: data.late_id, type: 'late', task: t.title, link: '', note: rs, fileName: upr ? upr.name : '', date: now }, upr && upr.blob);
        viewTask(t.id);
      } catch (e) { busy(ok, false, 'জমা দিন'); toast(friendlyError(e)); }
    };
  });
}

const _vtPf = viewTask;
viewTask = async function (id) {
  const r = await _vtPf(id);
  try { await pfTaskUI(id); } catch (e) {}
  return r;
};

/* ---------- meeting missed / late → written reason ---------- */
async function mrPending() {
  if (!pfMe() || (state.profile && state.profile.observer)) return [];
  const from = [dateAdd(todayDhaka(), -3), MR_START].sort()[1];
  const [{ data: att }, { data: rs }] = await Promise.all([
    sb.from('yg_meeting_att').select('day,meeting,status,late_min').eq('user_id', pfMe()).in('status', ['late', 'absent']).gte('day', from),
    sb.from('yg_meeting_reasons').select('day,meeting').eq('user_id', pfMe()).gte('day', from)]);
  return (att || []).filter(a => !(rs || []).some(r => r.day === a.day && r.meeting === a.meeting)).sort((a, b) => a.day < b.day ? -1 : 1);
}
const mrLabel = a => pfDay(a.day) + ' · ' + (a.meeting === 'morning' ? 'সকালের' : 'রাতের') + ' মিটিং — ' + (a.status === 'late' ? '⏰ দেরিতে' + (a.late_min ? ' (' + a.late_min + ' মি.)' : '') : '❌ অনুপস্থিত');
function mrSheet(a, after) {
  sheet('<h3>💬 মিটিং মিসের কারণ</h3><div class="msg info" style="font-size:13px">' + mrLabel(a) + '</div>'
    + '<div class="mut" style="font-size:12px;margin-top:6px">পরদিন সকাল ১০টার মধ্যে কারণ না জানালে −৫ শৃঙ্খলা পয়েন্ট কাটা যাবে।</div><label>কারণ লিখুন (অবশ্যই)</label><textarea class="in" id="mrr" maxlength="1000" style="min-height:90px" placeholder="কেন মিটিংয়ে আসতে পারেননি / দেরি হলো, বিস্তারিত লিখুন"></textarea>'
    + '<label>প্রুফ/ডকুমেন্ট থাকলে দিন (ঐচ্ছিক — স্ক্রিনশট/PDF)</label><input class="in" id="mrf" type="file" accept="image/*,application/pdf">'
    + '<button class="btn" id="mrok">জমা দিন</button>', (el, close) => {
    const ok = el.querySelector('#mrok');
    ok.onclick = async () => {
      const r = el.querySelector('#mrr').value.trim(), f = pfFile(el.querySelector('#mrf'));
      if (r.length < 5) return toast('কারণটা একটু বিস্তারিত লিখুন');
      busy(ok, true);
      try {
        const up = f ? await pfUpload(f) : null;
        const { error } = await sb.rpc('yg_meeting_reason', { p_day: a.day, p_meeting: a.meeting, p_reason: r, p_path: up && up.path, p_name: up && up.name, p_mime: up && up.mime });
        if (error) throw error;
        close(); toast('কারণ জমা হয়েছে ✓');
        pfBackup({ kind: 'meeting', id: a.day + '|' + a.meeting + '|' + pfMe(), type: 'meeting', task: (a.meeting === 'morning' ? 'সকালের মিটিং ' : 'রাতের মিটিং ') + a.day + ' (' + (a.status === 'late' ? 'দেরি' : 'অনুপস্থিত') + ')', note: r, fileName: up ? up.name : '', date: new Date().toISOString() }, up && up.blob);
        if (after) after();
      } catch (e) { busy(ok, false, 'জমা দিন'); toast(friendlyError(e)); }
    };
  });
}
let mrAuto = false;
async function mrHomeCard() {
  try {
    const list = await mrPending();
    const old = document.getElementById('hmr'); if (old) old.remove();
    if (!list.length) return;
    const anchor = document.getElementById('hmt') || document.getElementById('hdc') || document.getElementById('htg') || document.getElementById('scard') || document.querySelector('.qgrid');
    if (!anchor) return;
    anchor.insertAdjacentHTML('beforebegin', '<button class="card" id="hmr" style="display:block;width:100%;text-align:left;margin-bottom:10px;cursor:pointer;border:1.5px solid #dc2626;background:#fff5f5"><b style="color:#b91c1c">⚠️ মিটিং মিসের কারণ জানান (' + list.length + ')</b>' + list.map(a => '<div style="font-size:12.5px;margin-top:4px">' + mrLabel(a) + '</div>').join('') + '<div class="mut" style="font-size:11.5px;margin-top:4px">চাপ দিয়ে লিখিত কারণ জমা দিন। পরদিন সকাল ১০টার মধ্যে না জানালে −৫ শৃঙ্খলা পয়েন্ট কাটা যাবে।</div></button>');
    document.getElementById('hmr').onclick = () => mrSheet(list[0], mrHomeCard);
    if (!mrAuto) { mrAuto = true; setTimeout(() => { if (document.getElementById('hmr') && !document.querySelector('.sheetbg')) mrSheet(list[0], mrHomeCard); }, 600); }
  } catch (e) {}
}
const _vhPf = viewHome;
viewHome = async function () { const pr = _vhPf(); setTimeout(mrHomeCard, 900); setTimeout(pfRetry, 4000); return pr; };
if (document.getElementById('hatt') || document.getElementById('scard') || document.querySelector('.qgrid')) { setTimeout(mrHomeCard, 900); setTimeout(pfRetry, 4000); }
}
