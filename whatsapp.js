/* 💬 WhatsApp community / group shortcuts — one tap opens WhatsApp; admins manage the links */
{
const WA_IC = '<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><path fill="#25D366" d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3z"/><path fill="#fff" d="M23.3 19.4c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.7 4.2 6.6 5.8 3.3 1.3 3.9 1 4.7 1 .7-.1 2.3-.9 2.6-1.9.3-.9.3-1.7.2-1.9-.1-.1-.4-.2-.8-.4z"/></svg>';
let waCache = null;
async function waLinks(force) {
  if (waCache && !force) return waCache;
  try { const { data } = await sb.rpc('yg_wa_links'); waCache = Array.isArray(data) ? data : []; } catch (e) { waCache = waCache || []; }
  return waCache;
}
function waOpen(url) {
  if (!/^https:\/\/(chat\.whatsapp\.com|(www\.)?whatsapp\.com\/channel|wa\.me)\//i.test(url || '')) return toast('লিংকটা ঠিক নেই');
  const w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url;
}
async function viewWhatsApp() {
  cleanupChannels();
  $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>💬 WhatsApp</h1></div><div class="pad" id="wab" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div>';
  document.getElementById('bk').onclick = () => go('home');
  const list = await waLinks(true), box = document.getElementById('wab'); if (!box) return;
  box.innerHTML = '<div class="mut" style="font-size:12.5px">চাপ দিলে WhatsApp-এ সরাসরি খুলবে। মেসেজ পড়া ও পাঠানো হবে WhatsApp অ্যাপেই।</div>'
    + (list.length ? list.map((l, i) => '<button class="card" data-wa="' + i + '" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;margin-top:10px;cursor:pointer">' + WA_IC + '<span style="flex:1"><b>' + esc(l.name || 'WhatsApp') + '</b><small style="display:block;color:#64748b;font-size:12px">' + (/channel/.test(l.url) ? 'চ্যানেল' : 'কমিউনিটি / গ্রুপ') + ' · খুলতে চাপ দিন</small></span><span style="font-size:18px;color:#25D366">↗</span></button>').join('') : '<div class="empty">এখনো কোনো লিংক যোগ করা হয়নি</div>')
    + (isAdmin() ? '<button class="btn ghost" id="waed" style="margin-top:14px">✏️ লিংক যোগ / বদল (অ্যাডমিন)</button>' : '');
  box.querySelectorAll('[data-wa]').forEach(b => b.onclick = () => waOpen(list[+b.dataset.wa].url));
  const ed = document.getElementById('waed'); if (ed) ed.onclick = () => waEdit(list);
}
function waEdit(list) {
  const row = (l, i) => '<div class="card" data-r style="margin-top:8px;padding:10px"><input class="in" data-n placeholder="নাম (যেমন অফিস টিম)" maxlength="60" value="' + esc(l.name || '') + '" style="margin-top:0"><input class="in" data-u type="url" inputmode="url" placeholder="https://chat.whatsapp.com/…" value="' + esc(l.url || '') + '"><button class="btn ghost sm" data-del style="margin-top:6px">🗑️ বাদ দিন</button></div>';
  sheet('<h3>💬 WhatsApp লিংক</h3><div id="warows">' + (list.length ? list : [{}]).map(row).join('') + '</div><button class="btn ghost" id="waadd">➕ আরেকটা লিংক</button><button class="btn" id="wasv">সেভ করুন</button>', (el, close) => {
    const bind = () => el.querySelectorAll('[data-del]').forEach(b => b.onclick = () => b.closest('[data-r]').remove());
    bind();
    el.querySelector('#waadd').onclick = () => { el.querySelector('#warows').insertAdjacentHTML('beforeend', row({}, 0)); bind(); };
    el.querySelector('#wasv').onclick = async () => {
      const out = [...el.querySelectorAll('[data-r]')].map(r => ({ name: r.querySelector('[data-n]').value.trim(), url: r.querySelector('[data-u]').value.trim() })).filter(x => x.url);
      if (out.some(x => !/^https:\/\/(chat\.whatsapp\.com|(www\.)?whatsapp\.com\/channel|wa\.me)\//i.test(x.url))) return toast('শুধু WhatsApp লিংক দিন (chat.whatsapp.com/…)');
      out.forEach(x => { if (!x.name) x.name = 'WhatsApp'; });
      const { error } = await sb.rpc('yg_wa_set', { p: out }); if (error) return toast(friendlyError(error));
      waCache = out; close(); toast('সেভ হয়েছে ✓'); viewWhatsApp();
    };
  });
}
window.viewWhatsApp = viewWhatsApp;

/* bottom bar: the "Chats" slot becomes WhatsApp (in-app chats stay on the home "Chats" tile) */
function waTab() {
  const b = document.querySelector('.tabbar .tb[data-t="chats"]'); if (!b) return;
  b.dataset.t = 'whatsapp'; b.classList.remove('on');
  b.innerHTML = '<span class="ti" style="display:inline-flex;justify-content:center;filter:none;opacity:1">' + WA_IC.replace(/width="26" height="26"/, 'width="22" height="22"') + '</span><span style="color:#128C4A">WhatsApp</span>';
  b.onclick = e => { e.stopPropagation(); const l = waCache || []; if (l.length === 1) waOpen(l[0].url); else viewWhatsApp(); };
  if (!waCache || !waCache.length) waLinks(true);
}
new MutationObserver(waTab).observe(document.body, { childList: true, subtree: true });
waTab();

/* menu tile */
const _vmWa = viewMenu;
viewMenu = function () {
  const r = _vmWa(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-wa')) {
    t.insertAdjacentHTML('afterbegin', '<button class="tile" id="m-wa"><span class="ic">💬</span><b>WhatsApp</b><small>কমিউনিটি ও গ্রুপ</small></button>');
    document.getElementById('m-wa').onclick = () => viewWhatsApp();
  }
  return r;
};
}
