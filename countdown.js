/* ⏳ live countdown to each task's deadline (task cards + task detail), ticking every second */
{
const CD_CSS = '<style id="cdcss">.cdn{display:inline-block;margin-left:6px;font-size:11.5px;font-weight:700;padding:2px 8px;border-radius:999px;background:#ecfdf5;color:#166534;font-variant-numeric:tabular-nums}.cdn.warn{background:#fffbeb;color:#b45309}.cdn.hot{background:#fef2f2;color:#dc2626;animation:cdp 1s infinite}.cdn.over{background:#dc2626;color:#fff}.cdbig{margin-top:12px;padding:12px;border-radius:14px;text-align:center;background:#ecfdf5;color:#166534;font-weight:800;font-size:22px;font-variant-numeric:tabular-nums}.cdbig small{display:block;font-size:12px;font-weight:600;opacity:.8}.cdbig.warn{background:#fffbeb;color:#b45309}.cdbig.hot{background:#fef2f2;color:#dc2626}.cdbig.over{background:#dc2626;color:#fff}@keyframes cdp{50%{opacity:.55}}</style>';
const cdN = n => Number(n).toLocaleString('bn-BD');
function cdFmt(ms, long) {
  if (ms <= 0) return '⛔ সময় শেষ';
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
  const p = [];
  if (d) p.push(cdN(d) + ' দিন');
  if (d || h) p.push(cdN(h) + ' ঘণ্টা');
  if (!d) p.push(cdN(m) + ' মি.');
  if (!d && (long || !h)) p.push(cdN(x) + ' সে.');
  return '⏳ ' + p.join(' ') + ' বাকি';
}
const cdCls = ms => ms <= 0 ? 'over' : ms < 3600000 ? 'hot' : ms < 6 * 3600000 ? 'warn' : '';
function cdTick() {
  const now = Date.now();
  document.querySelectorAll('[data-due]').forEach(el => {
    const ms = Date.parse(el.dataset.due) - now, big = el.classList.contains('cdbig');
    const txt = cdFmt(ms, big), cls = (big ? 'cdbig ' : 'cdn ') + cdCls(ms);
    if (big) { const h = txt + '<small>ডেডলাইন: ' + new Date(el.dataset.due).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true }) + '</small>'; if (el.innerHTML !== h) el.innerHTML = h; }
    else if (el.textContent !== txt) el.textContent = txt;
    if (el.className !== cls.trim()) el.className = cls.trim();
  });
}
setInterval(cdTick, 1000);
const cdStyle = () => { if (!document.getElementById('cdcss')) document.head.insertAdjacentHTML('beforeend', CD_CSS); };

/* task cards in lists */
let cdBusy = false;
new MutationObserver(() => {
  if (cdBusy || typeof sb === 'undefined') return;
  const cards = [...document.querySelectorAll('[data-task]:not([data-cdd]), .tdr[data-t]:not([data-cdd])')];
  if (!cards.length) return;
  cdBusy = true; cards.forEach(c => c.setAttribute('data-cdd', '1'));
  const tid = c => c.dataset.task || c.dataset.t;
  const ids = [...new Set(cards.map(tid))];
  sb.from('tasks').select('id,due_date,status').in('id', ids).then(({ data }) => {
    cdBusy = false; cdStyle();
    const m = {}; (data || []).forEach(t => m[t.id] = t);
    cards.forEach(c => {
      const t = m[tid(c)]; if (!t || !t.due_date || t.status === 'completed' || c.querySelector('.cdn')) return;
      if (c.classList.contains('tdr')) { const sm = c.querySelector('small'); (sm || c).insertAdjacentHTML(sm ? 'beforeend' : 'beforeend', '<span class="cdn" style="display:block;margin:3px 0 0 auto;width:max-content" data-due="' + t.due_date + '"></span>'); return; }
      const host = c.querySelector('.ckb') || c.querySelector('.stt') || c.querySelector('small') || c;
      host.insertAdjacentHTML('afterend', '<span class="cdn" data-due="' + t.due_date + '"></span>');
    });
    cdTick();
  }, () => { cdBusy = false; });
}).observe(document.body, { childList: true, subtree: true });

/* task detail: big countdown */
const _vtCd = viewTask;
viewTask = async function (id) {
  const r = await _vtCd(id);
  try {
    const { data: t } = await sb.from('tasks').select('due_date,status').eq('id', id).single();
    const ss = document.getElementById('ss');
    if (t && t.due_date && t.status !== 'completed' && ss && !document.getElementById('cdbig')) {
      cdStyle();
      const kv = [...document.querySelectorAll('.kv')].pop();
      (kv || ss).insertAdjacentHTML(kv ? 'afterend' : 'beforebegin', '<div class="cdbig" id="cdbig" data-due="' + t.due_date + '"></div>');
      cdTick();
    }
  } catch (e) {}
  return r;
};
}
