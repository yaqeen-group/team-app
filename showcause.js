/* 📜 show-cause letters: admin issues → member replies with PDF/image → only admins (and the member) can see */
{
const SC_ST = { pending: ['⏳', 'জবাব বাকি', '#d97706'], submitted: ['📩', 'জবাব জমা হয়েছে', '#2563eb'], closed: ['✅', 'নিষ্পত্তি হয়েছে', '#16a34a'] };
const scMe = () => state.profile && state.profile.id;
const scDT = d => new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
const scNm = u => (ui.people && ui.people[u] && ui.people[u].full_name) || 'সদস্য';

async function scSigned(path, dl) { try { const { data } = await sb.storage.from('showcause').createSignedUrl(path, 3600, dl ? { download: dl } : undefined); return data && data.signedUrl; } catch (e) { return null; } }
const scB64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
async function scBackup(s, blob) {
  try {
    const { data: url } = await sb.rpc('yg_backup_url'); if (!url) return;
    const { data } = await sb.auth.getSession(); const ses = data && data.session; if (!ses) return;
    const body = { token: ses.access_token, person: (state.profile && state.profile.full_name) || '', kind: 'showcause', id: s.id, type: 'showcause', task: s.subject, note: s.reply || '', fileName: s.fileName || '', date: new Date().toISOString() };
    if (blob) { body.data = await scB64(blob); body.mime = blob.type; }
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    const j = await r.json(); if (j && j.ok) await sb.rpc('yg_backup_mark', { p_kind: 'showcause', p_id: s.id, p_url: j.url || 'sheet' });
  } catch (e) {}
}

async function viewShowcause() {
  cleanupChannels();
  const adm = isAdmin();
  $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>📜 শোকজ</h1></div><div class="pad" id="scb" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div>';
  document.getElementById('bk').onclick = () => go('home');
  await loadPeople();
  let q = sb.from('yg_showcause').select('*').order('created_at', { ascending: false }).limit(100);
  if (!adm) q = q.eq('user_id', scMe());
  const { data, error } = await q;
  const box = document.getElementById('scb'); if (!box) return;
  if (error) { box.innerHTML = '<div class="msg err">' + esc(friendlyError(error)) + '</div>'; return; }
  const list = data || [];
  const files = await Promise.all(list.map(s => s.file_path ? scSigned(s.file_path) : null));
  const dls = await Promise.all(list.map(s => s.file_path ? scSigned(s.file_path, (scNm(s.user_id) + ' - শোকজের জবাব - ' + (s.submitted_at || '').slice(0, 10)).replace(/[\\/:*?"<>|]/g, '') + (/pdf/.test(s.file_mime || '') ? '.pdf' : /png/.test(s.file_mime || '') ? '.png' : '.jpg')) : null));
  const card = (s, i) => {
    const st = SC_ST[s.status] || SC_ST.pending, late = s.status === 'pending' && Date.parse(s.due_at) < Date.now();
    const lateSub = s.submitted_at && Date.parse(s.submitted_at) > Date.parse(s.due_at);
    let h = '<div class="card" style="margin-top:10px;border-left:4px solid ' + st[2] + '">'
      + (adm ? '<div style="font-size:12.5px;color:#475569">👤 <b>' + esc(scNm(s.user_id)) + '</b></div>' : '')
      + '<b style="font-size:15px">' + esc(s.subject) + '</b>'
      + (s.details ? '<div class="body" style="white-space:pre-wrap;font-size:13.5px;margin-top:6px">' + esc(s.details) + '</div>' : '')
      + '<div class="mut" style="font-size:12px;margin-top:6px">ইস্যু: ' + scDT(s.created_at) + (s.issued_by ? ' · ' + esc(scNm(s.issued_by)) : '') + '<br>জমার শেষ সময়: <b style="color:' + (late ? '#dc2626' : 'inherit') + '">' + scDT(s.due_at) + (late ? ' — সময় পার হয়ে গেছে' : '') + '</b></div>'
      + '<div style="margin-top:6px;font-weight:700;color:' + st[2] + '">' + st[0] + ' ' + st[1] + (s.penalized ? ' <span style="color:#dc2626">(−৫ কাটা হয়েছে)</span>' : '') + '</div>';
    if (s.submitted_at) {
      h += '<div style="margin-top:8px;padding:10px;border-radius:10px;background:#f4f7fb;font-size:13px">📩 জবাব জমা: ' + scDT(s.submitted_at) + (lateSub ? ' <span style="color:#dc2626">(দেরিতে)</span>' : '')
        + (s.reply_text ? '<div style="white-space:pre-wrap;margin-top:6px">' + esc(s.reply_text) + '</div>' : '')
        + (files[i] ? (/^image\//.test(s.file_mime || '') ? '<a href="' + esc(files[i]) + '" target="_blank" rel="noopener"><img src="' + esc(files[i]) + '" style="display:block;max-width:100%;max-height:320px;border-radius:8px;margin-top:8px;border:1px solid #e3e8ef"></a>' : '')
          + '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><a class="btn sm" style="margin:0;text-decoration:none" href="' + esc(files[i]) + '" target="_blank" rel="noopener">📄 খুলুন</a>' + (dls[i] ? '<a class="btn sm ghost" style="margin:0;text-decoration:none" href="' + esc(dls[i]) + '">⬇️ ডাউনলোড</a>' : '') + (s.drive_url && s.drive_url !== 'sheet' ? '<a class="btn sm ghost" style="margin:0;text-decoration:none" href="' + esc(s.drive_url) + '" target="_blank" rel="noopener">Drive ↗</a>' : '') + '</div>' : '')
        + '</div>';
    }
    if (!adm && s.status === 'pending') h += '<button class="btn" data-rep="' + s.id + '">📩 জবাব জমা দিন (PDF / ছবি)</button>';
    if (adm && s.status === 'submitted') h += '<button class="btn ghost" data-close="' + s.id + '" style="margin-top:8px">✅ নিষ্পত্তি (Close) করুন</button>';
    return h + '</div>';
  };
  box.innerHTML = (adm ? '<button class="btn" id="scnew" style="margin-top:0">➕ নতুন শোকজ পাঠান</button><div class="mut" style="font-size:12px;margin-top:6px">জবাব দেখতে পারবেন শুধু অ্যাডমিন ও যিনি জমা দিয়েছেন। সময়মতো জমা না দিলে −৫ শৃঙ্খলা পয়েন্ট।</div>' : '<div class="mut" style="font-size:12px">শোকজের জবাব শুধু অ্যাডমিন দেখবেন। নির্ধারিত সময়ের মধ্যে জমা না দিলে −৫ শৃঙ্খলা পয়েন্ট কাটা যাবে।</div>')
    + (list.length ? list.map(card).join('') : '<div class="empty">কোনো শোকজ নেই</div>');
  const nb = document.getElementById('scnew'); if (nb) nb.onclick = scIssueSheet;
  box.querySelectorAll('[data-rep]').forEach(b => b.onclick = () => scReplySheet(list.find(x => x.id === b.dataset.rep)));
  box.querySelectorAll('[data-close]').forEach(b => b.onclick = async () => {
    if (!confirm('এই শোকজটা নিষ্পত্তি হয়েছে হিসেবে চিহ্নিত করবেন?')) return;
    const { error: e } = await sb.rpc('yg_sc_close', { p_id: b.dataset.close }); if (e) return toast(friendlyError(e));
    toast('নিষ্পত্তি হয়েছে ✓'); viewShowcause();
  });
}

function scIssueSheet() {
  const people = Object.values(ui.people).filter(p => p.id !== scMe() && (!p.status || p.status === 'active')).sort((a, b) => a.full_name.localeCompare(b.full_name));
  sheet('<h3>📜 নতুন শোকজ</h3><label>কাকে</label><select class="in" id="scu"><option value="">বেছে নিন</option>' + people.map(p => '<option value="' + p.id + '">' + esc(p.full_name) + '</option>').join('') + '</select>'
    + '<label>বিষয় / ঘটনা</label><input class="in" id="scs" maxlength="200" placeholder="যেমন: দায়িত্বে অবহেলা — ২২ নভেম্বরের টাস্ক">'
    + '<label>বিস্তারিত (ঐচ্ছিক)</label><textarea class="in" id="scd" maxlength="3000" style="min-height:90px" placeholder="কী ঘটেছে, কেন ব্যাখ্যা চাওয়া হচ্ছে"></textarea>'
    + '<label>জবাব দেওয়ার সময়</label><select class="in" id="sch"><option value="12">১২ ঘণ্টা</option><option value="24" selected>২৪ ঘণ্টা</option><option value="48">৪৮ ঘণ্টা</option><option value="72">৩ দিন</option></select>'
    + '<button class="btn" id="scok">📜 শোকজ পাঠান</button>', (el, close) => {
    const ok = el.querySelector('#scok');
    ok.onclick = async () => {
      const u = el.querySelector('#scu').value, s = el.querySelector('#scs').value.trim();
      if (!u) return toast('কাকে পাঠাবেন বেছে নিন'); if (!s) return toast('বিষয় লিখুন');
      if (!confirm(scNm(u) + '-কে শোকজ পাঠাবেন? তিনি সাথে সাথে নোটিফিকেশন পাবেন।')) return;
      busy(ok, true);
      const { error } = await sb.rpc('yg_sc_issue', { p_user: u, p_subject: s, p_details: el.querySelector('#scd').value.trim(), p_hours: +el.querySelector('#sch').value });
      if (error) { busy(ok, false, '📜 শোকজ পাঠান'); return toast(friendlyError(error)); }
      close(); toast('শোকজ পাঠানো হয়েছে ✓'); viewShowcause();
    };
  });
}

function scReplySheet(s) {
  if (!s) return;
  sheet('<h3>📩 শোকজের জবাব</h3><p class="mut" style="margin:0 0 6px">' + esc(s.subject) + '</p>'
    + '<label>জবাবের ফাইল (PDF বা PNG/JPG ছবি — অবশ্যই)</label><input class="in" id="scf" type="file" accept="application/pdf,image/png,image/jpeg,image/webp">'
    + '<div class="mut" style="font-size:12px;margin-top:4px">হাতে লেখা চিঠির ছবি বা টাইপ করা PDF দিন। সর্বোচ্চ ১০ MB।</div>'
    + '<label>সংক্ষিপ্ত লেখা (ঐচ্ছিক)</label><textarea class="in" id="sct" maxlength="2000" style="min-height:70px"></textarea>'
    + '<button class="btn" id="scgo">জমা দিন</button>', (el, close) => {
    const ok = el.querySelector('#scgo');
    ok.onclick = async () => {
      const f = el.querySelector('#scf').files[0], t = el.querySelector('#sct').value.trim();
      if (!f) return toast('জবাবের PDF বা ছবি দিন');
      const mime = f.type || (/\.pdf$/i.test(f.name) ? 'application/pdf' : '');
      if (!/^(application\/pdf|image\/(png|jpeg|webp))$/.test(mime)) return toast('শুধু PDF বা PNG/JPG ছবি দেওয়া যাবে');
      if (f.size > 10 * 1024 * 1024) return toast('ফাইল ১০ MB-এর বেশি — ছোট ফাইল দিন');
      busy(ok, true);
      try {
        const ext = mime === 'application/pdf' ? 'pdf' : mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
        const path = scMe() + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
        const { error: e1 } = await sb.storage.from('showcause').upload(path, f, { contentType: mime, upsert: false }); if (e1) throw e1;
        const { error: e2 } = await sb.rpc('yg_sc_submit', { p_id: s.id, p_text: t, p_path: path, p_name: f.name, p_mime: mime }); if (e2) throw e2;
        close(); toast('জবাব জমা হয়েছে ✓ অ্যাডমিন নোটিফিকেশন পেয়েছেন');
        scBackup({ id: s.id, subject: s.subject, reply: t, fileName: f.name }, f);
        viewShowcause();
      } catch (e) { busy(ok, false, 'জমা দিন'); toast(friendlyError(e)); }
    };
  });
}
window.viewShowcause = viewShowcause;

/* home: red card for members with an unanswered show-cause */
async function scHomeCard() {
  try {
    if (!scMe() || isAdmin()) return;
    const { data } = await sb.from('yg_showcause').select('id,subject,due_at').eq('user_id', scMe()).eq('status', 'pending').order('due_at');
    const old = document.getElementById('hsc'); if (old) old.remove();
    if (!data || !data.length) return;
    const anchor = document.getElementById('hmr') || document.getElementById('hmt') || document.getElementById('hdc') || document.getElementById('htg') || document.getElementById('scard') || document.querySelector('.qgrid');
    if (!anchor) return;
    anchor.insertAdjacentHTML('beforebegin', '<button class="card" id="hsc" style="display:block;width:100%;text-align:left;margin-bottom:10px;cursor:pointer;border:1.5px solid #dc2626;background:#fff5f5"><b style="color:#b91c1c">📜 শোকজের জবাব দিন (' + data.length + ')</b>' + data.map(s => '<div style="font-size:12.5px;margin-top:4px">' + esc(s.subject) + ' — শেষ সময় ' + scDT(s.due_at) + '</div>').join('') + '</button>');
    document.getElementById('hsc').onclick = () => viewShowcause();
  } catch (e) {}
}
const _vhSc = viewHome;
viewHome = async function () { const pr = _vhSc(); setTimeout(scHomeCard, 1000); return pr; };
if (document.getElementById('hatt') || document.getElementById('scard') || document.querySelector('.qgrid')) setTimeout(scHomeCard, 1000);

/* menu tile: admins always; members only when they have a show-cause */
const _vmSc = viewMenu;
viewMenu = function () {
  const r = _vmSc();
  (async () => {
    try {
      const t = document.querySelector('.tiles'); if (!t || document.getElementById('m-sc') || !scMe()) return;
      if (!isAdmin()) { const { count } = await sb.from('yg_showcause').select('id', { count: 'exact', head: true }).eq('user_id', scMe()); if (!count) return; }
      const t2 = document.querySelector('.tiles'); if (!t2 || document.getElementById('m-sc')) return;
      t2.insertAdjacentHTML('afterbegin', '<button class="tile" id="m-sc"><span class="ic">📜</span><b>শোকজ</b><small>' + (isAdmin() ? 'শোকজ পাঠান ও জবাব দেখুন' : 'আমার শোকজ ও জবাব') + '</small></button>');
      document.getElementById('m-sc').onclick = () => viewShowcause();
    } catch (e) {}
  })();
  return r;
};
const _hdlSc = handleDeepLink;
handleDeepLink = function (href) {
  let u; try { u = new URL(href || location.href, location.href); } catch (e) { return _hdlSc(href); }
  if (u.searchParams.has('sc')) { try { history.replaceState(null, '', location.pathname); } catch (e) {} return viewShowcause(); }
  return _hdlSc(href);
};
}
