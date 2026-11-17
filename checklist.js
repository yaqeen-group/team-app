/* ☑️ task checklists: one task, many tickable items (link proof), live progress */
{
const CK_CSS = '<style id="ckcss">.ck{margin-top:14px;border:1px solid #e3e8ef;border-radius:14px;overflow:hidden}.ck-h{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f4f7fb;font-size:14px}.ck-bar{height:6px;background:#e8edf3}.ck-bar i{display:block;height:100%;background:#16a34a}.ck-i{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-top:1px solid #eef1f5;cursor:pointer;background:#fff;width:100%;text-align:left;border-left:0;border-right:0;border-bottom:0;font:inherit;color:inherit}.ck-b{flex:0 0 24px;height:24px;border-radius:7px;border:2px solid #9aa7b5;display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff;margin-top:1px}.ck-i.on .ck-b{background:#16a34a;border-color:#16a34a}.ck-i.late .ck-b{border-color:#dc2626}.ck-t{flex:1;font-size:13.5px;line-height:1.45}.ck-i.on .ck-t b{text-decoration:line-through;opacity:.65}.ck-m{display:block;font-size:11.5px;color:#64748b;margin-top:2px}.ck-i.late .ck-m{color:#dc2626}.ck-m a{color:#2563eb}.ckb{display:inline-block;margin-left:6px;font-size:11px;font-weight:700;padding:2px 7px;border-radius:999px;background:#eef2ff;color:#1e40af}.ckb.full{background:#dcfce7;color:#166534}</style>';
const ckTime = ts => new Date(ts).toLocaleTimeString('bn-BD', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' });
const ckN = n => Number(n).toLocaleString('bn-BD');
let ckTimer = null;

async function ckRender(taskId, t) {
  const { data: items, error } = await sb.from('yg_task_items').select('*').eq('task_id', taskId).order('pos');
  if (error || !items || !items.length) return;
  const anchor = document.getElementById('ss');
  if (!anchor) return;
  if (!document.getElementById('ckcss')) document.head.insertAdjacentHTML('beforeend', CK_CSS);
  const can = t.assigned_to === state.profile.id || isMgr();
  const d = items.filter(i => i.done).length, n = items.length, now = Date.now();
  const html = '<div class="ck" id="ckbox"><div class="ck-h"><b>☑️ চেকলিস্ট</b><b style="color:' + (d === n ? '#16a34a' : '#0f2a5c') + '">' + ckN(d) + '/' + ckN(n) + ' সম্পন্ন</b></div><div class="ck-bar"><i style="width:' + Math.round(d / n * 100) + '%"></i></div>'
    + items.map(i => {
      const late = !i.done && i.due_at && Date.parse(i.due_at) < now;
      const meta = (i.due_at ? '⏰ ' + ckTime(i.due_at) + (late ? ' — সময় পার হয়ে গেছে' : '') : '')
        + (i.done ? (i.due_at ? ' · ' : '') + '✅ ' + ckTime(i.done_at) + (i.link ? ' · <a href="' + esc(i.link) + '" target="_blank" rel="noopener" data-lnk="1">লিংক দেখুন ↗</a>' : '') : '');
      return '<button class="ck-i' + (i.done ? ' on' : '') + (late ? ' late' : '') + '" data-ck="' + i.id + '"' + (can ? '' : ' disabled') + '><span class="ck-b">' + (i.done ? '✓' : '') + '</span><span class="ck-t"><b>' + esc(i.label) + '</b>' + (meta ? '<span class="ck-m">' + meta + '</span>' : '') + '</span></button>';
    }).join('')
    + (can && d < n ? '<div class="mut" style="font-size:11.5px;padding:8px 12px;border-top:1px solid #eef1f5">' + (items.some(i => i.need_link) ? 'কাজ করার পর ঘরে চাপ দিন, লিংক দিয়ে টিক দিন। ' : 'কাজ শেষ হলে ঘরে চাপ দিয়ে টিক দিন। ') + 'সব ঘরে টিক হলে টাস্ক নিজে থেকেই সম্পন্ন হবে।</div>' : '')
    + '</div>';
  const old = document.getElementById('ckbox');
  if (old) old.outerHTML = html;
  else { const lab = anchor.previousElementSibling && anchor.previousElementSibling.tagName === 'LABEL' ? anchor.previousElementSibling : anchor; lab.insertAdjacentHTML('beforebegin', html); }
  const box = document.getElementById('ckbox');
  box.querySelectorAll('[data-lnk]').forEach(a => a.onclick = e => e.stopPropagation());
  if (!can) return;
  const tick = async (id, done, link) => {
    const { error: e } = await sb.rpc('yg_item_tick', { p_item: id, p_done: done, p_link: link || null });
    if (e) return toast(friendlyError(e));
    toast(done ? 'টিক দেওয়া হয়েছে ✓' : 'টিক তুলে নেওয়া হয়েছে');
    viewTask(taskId);
  };
  box.querySelectorAll('[data-ck]').forEach(b => b.onclick = () => {
    const it = items.find(x => x.id === b.dataset.ck); if (!it) return;
    if (it.done) { if (confirm('এই ঘরের টিক তুলে নেবেন?')) tick(it.id, false); return; }
    if (!it.need_link) return tick(it.id, true);
    sheet('<h3>✅ ' + esc(it.label) + '</h3><label>লিংক দিন</label><input class="in" id="cklk" type="url" inputmode="url" placeholder="https://facebook.com/..." autocomplete="off"><div class="mut" style="font-size:12px;margin-top:6px">পোস্ট বা যে পেজে পাঠিয়েছেন, তার লিংক কপি করে এখানে দিন।</div><button class="btn" id="ckok">টিক দিন</button>', (el, close) => {
      const inp = el.querySelector('#cklk'); setTimeout(() => inp.focus(), 200);
      el.querySelector('#ckok').onclick = () => {
        const v = inp.value.trim();
        if (!/^https?:\/\/\S+\.\S+/i.test(v)) return toast('সঠিক লিংক দিন (https:// দিয়ে শুরু)');
        close(); tick(it.id, true, v);
      };
    });
  });
}

/* task detail: add the checklist; refresh every 20 s while open so admins see ticks live */
const _vtCk = viewTask;
viewTask = async function (id) {
  const r = await _vtCk(id);
  try {
    const { data: t } = await sb.from('tasks').select('id,assigned_to,created_by,status').eq('id', id).single();
    if (t) {
      await ckRender(id, t);
      clearInterval(ckTimer);
      ckTimer = setInterval(() => {
        if (!document.getElementById('ckbox') || !document.getElementById('ss')) { clearInterval(ckTimer); return; }
        if (document.querySelector('.sheet')) return;
        ckRender(id, t);
      }, 20000);
    }
  } catch (e) {}
  return r;
};

/* task lists: progress badge on every card that has a checklist */
let ckBusy = false;
new MutationObserver(() => {
  if (ckBusy) return;
  const cards = [...document.querySelectorAll('[data-task]:not([data-ckd])')];
  if (!cards.length || typeof sb === 'undefined') return;
  ckBusy = true;
  cards.forEach(c => c.setAttribute('data-ckd', '1'));
  const ids = [...new Set(cards.map(c => c.dataset.task))];
  sb.from('yg_task_items').select('task_id,done').in('task_id', ids).then(({ data }) => {
    ckBusy = false;
    const m = {}; (data || []).forEach(x => { m[x.task_id] = m[x.task_id] || [0, 0]; m[x.task_id][1]++; if (x.done) m[x.task_id][0]++; });
    cards.forEach(c => {
      const s = m[c.dataset.task]; if (!s || c.querySelector('.ckb')) return;
      const host = c.querySelector('.stt') || c.querySelector('small') || c;
      host.insertAdjacentHTML('afterend', '<span class="ckb' + (s[0] === s[1] ? ' full' : '') + '">☑️ ' + ckN(s[0]) + '/' + ckN(s[1]) + '</span>');
    });
    if (!document.getElementById('ckcss')) document.head.insertAdjacentHTML('beforeend', CK_CSS);
  }, () => { ckBusy = false; });
}).observe(document.body, { childList: true, subtree: true });
}
