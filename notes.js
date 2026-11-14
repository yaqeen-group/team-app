/* ---------- 📒 Notes: every member's own private notes ---------- */
{
const NT_L = (bn, en) => (window.ygLang && ygLang() === 'en') ? en : bn;
const NT_COL = { white: '#ffffff', yellow: '#FFF6D6', green: '#E5F6EA', blue: '#E3EEFF', pink: '#FDE7EF', purple: '#EFE6FD' };
const NT_EDGE = { white: '#E3E9ED', yellow: '#F2C94C', green: '#4CB874', blue: '#4D8EF0', pink: '#E86B98', purple: '#9B6BE8' };
let ntFilter = 'all', ntQuery = '';

if (!document.getElementById('nt-css')) {
  const st = document.createElement('style'); st.id = 'nt-css';
  st.textContent = `
.nt-bar{display:flex;gap:6px;margin:4px 0 10px;flex-wrap:wrap}
.nt-chip{border:1px solid var(--line);border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:600;color:#3d4c57;background:#fff}
.nt-chip.on{background:var(--navy);border-color:var(--navy);color:#fff}
.nt-card{display:block;width:100%;text-align:left;border:1px solid var(--line);border-left-width:5px;border-radius:14px;padding:12px 12px 10px;margin-bottom:10px;position:relative}
.nt-card h4{font-size:15px;color:var(--navy);margin:0 26px 4px 30px;word-break:break-word}
.nt-card .nt-body{font-size:13px;color:#3d4c57;margin-left:30px;white-space:pre-wrap;word-break:break-word;max-height:7.4em;overflow:hidden}
.nt-card small{display:block;margin:6px 0 0 30px;color:var(--mut);font-size:11.5px}
.nt-card.done h4,.nt-card.done .nt-body{text-decoration:line-through;opacity:.55}
.nt-ck{position:absolute;left:10px;top:11px;width:22px;height:22px;border-radius:7px;border:2px solid #b8c4cc;background:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff}
.nt-ck.on{background:var(--ok);border-color:var(--ok)}
.nt-pin{position:absolute;right:10px;top:10px;font-size:15px;opacity:.25}
.nt-pin.on{opacity:1}
.nt-cols{display:flex;gap:8px;margin:6px 0 4px}
.nt-col{width:30px;height:30px;border-radius:50%;border:2px solid #d5dde3}
.nt-col.on{outline:3px solid var(--navy);outline-offset:1px}
.nt-row{display:flex;gap:8px;margin-top:10px}
.nt-row button{flex:1}
.nt-tg{display:flex;align-items:center;gap:8px;font-size:14px;margin-top:10px}
.nt-tg input{width:18px;height:18px}
`;
  document.head.appendChild(st);
}

function ntWhen(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(NT_L('bn-BD', 'en-GB'), { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + d.toLocaleTimeString(NT_L('bn-BD', 'en-GB'), { hour: 'numeric', minute: '2-digit' });
}

async function viewNotes() {
  if (typeof cleanupChannels === 'function') cleanupChannels();
  $app.innerHTML = `<div class="top"><button class="back" id="bk">←</button><h1>${NT_L('আমার নোট', 'My notes')}<span class="sub">${NT_L('শুধু আপনি দেখতে পারবেন', 'Only you can see these')}</span></h1></div>
  <div class="pad" style="padding-top:6px">
    <input class="in" id="nt-q" placeholder="${NT_L('নোট খুঁজুন…', 'Search notes…')}" value="${esc(ntQuery)}" style="margin-bottom:8px">
    <div class="nt-bar">
      <button class="nt-chip" data-f="all">${NT_L('সব', 'All')}</button>
      <button class="nt-chip" data-f="open">${NT_L('চলমান', 'Open')}</button>
      <button class="nt-chip" data-f="done">${NT_L('শেষ', 'Done')}</button>
    </div>
    <div id="nt-list"><div class="cen"><div class="spin dark"></div></div></div>
  </div>
  <button class="fab" id="nt-new">+</button>`;
  document.getElementById('bk').onclick = () => go('menu');
  document.getElementById('nt-new').onclick = () => noteForm();
  document.querySelectorAll('.nt-chip').forEach(b => {
    b.classList.toggle('on', b.dataset.f === ntFilter);
    b.onclick = () => { ntFilter = b.dataset.f; document.querySelectorAll('.nt-chip').forEach(x => x.classList.toggle('on', x === b)); ntRender(); };
  });
  const q = document.getElementById('nt-q');
  q.oninput = () => { ntQuery = q.value; ntRender(); };
  const { data, error } = await sb.from('yg_notes').select('*').eq('user_id', state.profile.id)
    .order('pinned', { ascending: false }).order('updated_at', { ascending: false }).limit(500);
  const el = document.getElementById('nt-list'); if (!el) return;
  if (error) { el.innerHTML = `<div class="msg err">${esc(friendlyError(error))}</div>`; return; }
  ui.notes = data || [];
  ntRender();
}

function ntRender() {
  const el = document.getElementById('nt-list'); if (!el) return;
  const qq = ntQuery.trim().toLowerCase();
  const list = (ui.notes || []).filter(n => (ntFilter === 'all' || (ntFilter === 'done') === n.done) &&
    (!qq || (n.title + ' ' + n.body).toLowerCase().includes(qq)));
  if (!list.length) {
    el.innerHTML = `<div class="empty">${(ui.notes || []).length ? NT_L('কিছু পাওয়া যায়নি', 'Nothing found') : NT_L('এখনো কোনো নোট নেই। + চেপে প্রথম নোট লিখুন ✍️', 'No notes yet. Tap + to write your first note ✍️')}</div>`;
    return;
  }
  el.innerHTML = list.map(n => `<div class="nt-card ${n.done ? 'done' : ''}" data-id="${n.id}" style="background:${NT_COL[n.color] || '#fff'};border-left-color:${NT_EDGE[n.color] || NT_EDGE.white}">
      <button class="nt-ck ${n.done ? 'on' : ''}" data-ck="${n.id}" title="${NT_L('শেষ হিসেবে চিহ্নিত করুন', 'Mark as done')}">${n.done ? '✓' : ''}</button>
      <button class="nt-pin ${n.pinned ? 'on' : ''}" data-pin="${n.id}" title="${NT_L('পিন', 'Pin')}">📌</button>
      <h4 data-noi18n="1">${esc(n.title || NT_L('শিরোনাম নেই', 'Untitled'))}</h4>
      ${n.body ? `<div class="nt-body" data-noi18n="1">${esc(n.body)}</div>` : ''}
      <small>${ntWhen(n.updated_at)}</small>
    </div>`).join('');
  el.querySelectorAll('.nt-card').forEach(c => c.onclick = e => {
    if (e.target.closest('[data-ck],[data-pin]')) return;
    noteForm((ui.notes || []).find(n => n.id === c.dataset.id));
  });
  el.querySelectorAll('[data-ck]').forEach(b => b.onclick = () => ntPatch(b.dataset.ck, n => ({ done: !n.done })));
  el.querySelectorAll('[data-pin]').forEach(b => b.onclick = () => ntPatch(b.dataset.pin, n => ({ pinned: !n.pinned })));
}

async function ntPatch(id, fn) {
  const n = (ui.notes || []).find(x => x.id === id); if (!n) return;
  const ch = fn(n);
  Object.assign(n, ch);
  ntRender();
  const { data, error } = await sb.from('yg_notes').update(ch).eq('id', id).select().single();
  if (error) { toast(friendlyError(error)); return viewNotes(); }
  Object.assign(n, data);
  ui.notes.sort((a, b) => (b.pinned - a.pinned) || (new Date(b.updated_at) - new Date(a.updated_at)));
  ntRender();
}

function noteForm(n) {
  let color = n ? n.color : 'white';
  sheet(`<h3>${n ? NT_L('নোট', 'Note') : NT_L('নতুন নোট', 'New note')}</h3>
    <label>${NT_L('শিরোনাম', 'Title')}</label><input class="in" id="nt-t" maxlength="200" value="${esc(n ? n.title : '')}" placeholder="${NT_L('যেমন: আজকের কল লিস্ট', 'e.g. Today\'s call list')}">
    <label>${NT_L('নোট', 'Note')}</label><textarea class="in" id="nt-b" maxlength="20000" style="min-height:180px" placeholder="${NT_L('যা খুশি লিখুন…', 'Write anything…')}">${esc(n ? n.body : '')}</textarea>
    <label>${NT_L('রং', 'Colour')}</label>
    <div class="nt-cols">${Object.keys(NT_COL).map(c => `<button class="nt-col ${c === color ? 'on' : ''}" data-c="${c}" style="background:${NT_COL[c]};border-color:${NT_EDGE[c]}"></button>`).join('')}</div>
    <label class="nt-tg"><input type="checkbox" id="nt-p" ${n && n.pinned ? 'checked' : ''}> 📌 ${NT_L('উপরে পিন করে রাখুন', 'Pin to top')}</label>
    <label class="nt-tg"><input type="checkbox" id="nt-d" ${n && n.done ? 'checked' : ''}> ✅ ${NT_L('শেষ হয়েছে', 'Done')}</label>
    ${n ? `<p class="mut" style="font-size:12px;margin-top:10px">${NT_L('শেষ পরিবর্তন', 'Last changed')}: ${ntWhen(n.updated_at)}</p>` : ''}
    <div class="nt-row">${n ? `<button class="btn ghost" id="nt-del" style="color:var(--red)">🗑️ ${NT_L('মুছুন', 'Delete')}</button>` : ''}<button class="btn" id="nt-sv">${NT_L('সেভ করুন', 'Save')}</button></div>`,
  (el, close) => {
    el.querySelectorAll('.nt-col').forEach(b => b.onclick = () => { color = b.dataset.c; el.querySelectorAll('.nt-col').forEach(x => x.classList.toggle('on', x === b)); });
    if (!n) setTimeout(() => el.querySelector('#nt-t').focus(), 60);
    el.querySelector('#nt-sv').onclick = async () => {
      const row = { title: el.querySelector('#nt-t').value.trim(), body: el.querySelector('#nt-b').value, color, pinned: el.querySelector('#nt-p').checked, done: el.querySelector('#nt-d').checked };
      if (!row.title && !row.body.trim()) return toast(NT_L('কিছু একটা লিখুন', 'Write something first'));
      const btn = el.querySelector('#nt-sv'); btn.disabled = true;
      const { error } = n ? await sb.from('yg_notes').update(row).eq('id', n.id)
                          : await sb.from('yg_notes').insert({ ...row, user_id: state.profile.id });
      btn.disabled = false;
      if (error) return toast(friendlyError(error));
      close(); toast(NT_L('সেভ হয়েছে ✓', 'Saved ✓')); viewNotes();
    };
    const del = el.querySelector('#nt-del');
    if (del) del.onclick = async () => {
      if (!confirm(NT_L('এই নোটটা মুছে ফেলবেন? আর ফেরত আনা যাবে না।', 'Delete this note? It can\'t be brought back.'))) return;
      const { error } = await sb.from('yg_notes').delete().eq('id', n.id);
      if (error) return toast(friendlyError(error));
      close(); toast(NT_L('মুছে ফেলা হয়েছে', 'Deleted')); viewNotes();
    };
  });
}

window.viewNotes = viewNotes;
const _vmNt = viewMenu;
viewMenu = function () {
  const r = _vmNt.apply(this, arguments);
  const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-notes')) {
    t.insertAdjacentHTML('afterbegin', `<button class="tile" id="m-notes" data-noi18n="1"><span class="ic">📒</span><b>${NT_L('নোট', 'Notes')}</b><small>${NT_L('আমার নিজের নোট', 'My own notes')}</small></button>`);
    document.getElementById('m-notes').onclick = viewNotes;
  }
  return r;
};
}
