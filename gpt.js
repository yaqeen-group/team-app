/* 🤖 ChatGPT shortcut: home grid + menu → opens chatgpt.com (ChatGPT app on phone if installed) */
{
const GPT_URL = 'https://chatgpt.com/';
const GPT_SVG = '<svg viewBox="0 0 24 24" style="width:28px;height:28px"><path fill="#fff" d="M21.6 9.8a5.4 5.4 0 0 0-.5-4.4 5.5 5.5 0 0 0-5.9-2.6A5.5 5.5 0 0 0 5.9 4.7a5.4 5.4 0 0 0-3.6 2.6 5.5 5.5 0 0 0 .7 6.4 5.4 5.4 0 0 0 .5 4.4 5.5 5.5 0 0 0 5.9 2.6 5.4 5.4 0 0 0 4.1 1.8 5.5 5.5 0 0 0 5.2-3.8 5.4 5.4 0 0 0 3.6-2.6 5.5 5.5 0 0 0-.7-6.3zm-8.2 11.5a4 4 0 0 1-2.6-1l.1-.1 4.3-2.5a.7.7 0 0 0 .4-.6v-6.1l1.8 1v5.1a4.1 4.1 0 0 1-4 4.2zm-8.7-3.7a4 4 0 0 1-.5-2.8l.1.1 4.3 2.5a.7.7 0 0 0 .7 0l5.3-3v2.1l-4.4 2.5a4.1 4.1 0 0 1-5.5-1.4zM3.6 8.1a4 4 0 0 1 2.1-1.8v5.1a.7.7 0 0 0 .4.6l5.2 3-1.8 1-4.3-2.5a4.1 4.1 0 0 1-1.6-5.4zm14.9 3.5-5.3-3 1.8-1 4.3 2.5a4.1 4.1 0 0 1-.6 7.3v-5.1a.7.7 0 0 0-.2-.7zm1.8-2.7-.1-.1-4.3-2.5a.7.7 0 0 0-.7 0l-5.3 3V7.2l4.4-2.5a4.1 4.1 0 0 1 6 4.2zM9.2 12.6l-1.8-1V6.5a4.1 4.1 0 0 1 6.7-3.1l-.1.1-4.3 2.5a.7.7 0 0 0-.4.6zm1-2.1L12 9.4l2.3 1.3v2.6L12 14.6l-2.3-1.3z"/></svg>';
const GPT_CSS = '<style id="gptcss">.gptq .qic{background:linear-gradient(140deg,#19C37D,#0B7A55)!important;box-shadow:0 6px 14px #0B7A5555,inset 0 -3px 0 rgba(0,0,0,.08)!important;position:relative;overflow:hidden;animation:gptIn .5s cubic-bezier(.3,1.5,.5,1) both}.gptq .qic svg{animation:gptSpin 9s linear infinite}@keyframes gptSpin{to{transform:rotate(360deg)}}@keyframes gptIn{0%{transform:scale(.4);opacity:0}100%{transform:none;opacity:1}}</style>';
const gStyle = () => { if (!document.getElementById('gptcss')) document.head.insertAdjacentHTML('beforeend', GPT_CSS); };
function gptOpen() { const w = window.open(GPT_URL, '_blank', 'noopener'); if (!w) location.href = GPT_URL; }
window.gptOpen = gptOpen;
function gptHome() {
  const g = document.querySelector('.qgrid'); if (!g || g.querySelector('.gptq')) return;
  gStyle();
  const b = document.createElement('button'); b.className = 'qi gptq'; b.type = 'button';
  b.innerHTML = '<span class="qic">' + GPT_SVG + '</span><span>ChatGPT</span>';
  b.onclick = gptOpen;
  const after = g.querySelector('.fbq');
  if (after && after.nextSibling) g.insertBefore(b, after.nextSibling); else g.appendChild(b);
}
new MutationObserver(() => { if (document.querySelector('.qgrid') && !document.querySelector('.qgrid .gptq')) gptHome(); }).observe(document.body, { childList: true, subtree: true });
const _vmGpt = viewMenu;
viewMenu = function () {
  const r = _vmGpt(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-gpt')) {
    gStyle();
    const fb = document.getElementById('m-fb');
    const html = '<button class="tile" id="m-gpt"><span class="ic" style="background:linear-gradient(140deg,#19C37D,#0B7A55)">' + GPT_SVG + '</span><b>ChatGPT</b><small>পোস্টার ও লেখা</small></button>';
    if (fb) fb.insertAdjacentHTML('afterend', html); else t.insertAdjacentHTML('afterbegin', html);
    document.getElementById('m-gpt').onclick = gptOpen;
  }
  return r;
};
}

/* 🔎 Google search: home grid + menu → search box → Google results */
{
const G_SVG = '<svg viewBox="0 0 48 48" style="width:28px;height:28px"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
const G_CSS = '<style id="ggcss">.ggq .qic{background:#fff!important;box-shadow:0 6px 14px rgba(11,42,111,.15),inset 0 -3px 0 rgba(0,0,0,.05)!important;animation:ggIn .5s cubic-bezier(.3,1.5,.5,1) both}.ggq .qic svg{animation:ggBob 2.8s ease-in-out infinite}@keyframes ggBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes ggIn{0%{transform:scale(.4);opacity:0}100%{transform:none;opacity:1}}.ggf{display:flex;gap:8px;margin-top:10px}.ggf input{flex:1;font-size:16px;padding:12px 14px;border-radius:24px;border:1.5px solid #dbe3ef;outline:none}.ggf input:focus{border-color:#1a73e8}.ggf button{border:0;border-radius:24px;padding:0 18px;background:#1a73e8;color:#fff;font-weight:700;font-size:15px}.ggs{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.ggs button{border:1px solid #e2e8f0;background:#f8fafc;border-radius:16px;padding:6px 11px;font-size:12.5px;color:#334155}</style>';
const gs = () => { if (!document.getElementById('ggcss')) document.head.insertAdjacentHTML('beforeend', G_CSS); };
const SUG = ['Malaysia tourist visa requirements', 'Dhaka to Kuala Lumpur flight', 'EMGS student visa', 'MDAC Malaysia', 'আজকের ডলার রেট'];
function ggGo(q) { q = (q || '').trim(); if (!q) return; const url = 'https://www.google.com/search?q=' + encodeURIComponent(q); const w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url; }
function ggSheet() {
  gs();
  sheet('<h3 style="display:flex;align-items:center;gap:8px">' + G_SVG + ' Google সার্চ</h3><form class="ggf" id="ggf"><input id="ggq" type="search" enterkeyhint="search" placeholder="কী খুঁজতে চান লিখুন…" autocomplete="off"><button type="submit">খুঁজুন</button></form><div class="ggs">' + SUG.map((s, i) => '<button type="button" data-s="' + i + '">' + esc(s) + '</button>').join('') + '</div>', el => {
    const inp = el.querySelector('#ggq'); setTimeout(() => inp.focus(), 150);
    el.querySelector('#ggf').onsubmit = e => { e.preventDefault(); ggGo(inp.value); };
    el.querySelectorAll('[data-s]').forEach(b => b.onclick = () => ggGo(SUG[+b.dataset.s]));
  });
}
window.ggSheet = ggSheet;
function ggHome() {
  const g = document.querySelector('.qgrid'); if (!g || g.querySelector('.ggq')) return;
  gs();
  const b = document.createElement('button'); b.className = 'qi ggq'; b.type = 'button';
  b.innerHTML = '<span class="qic">' + G_SVG + '</span><span>Google</span>';
  b.onclick = ggSheet;
  const after = g.querySelector('.gptq') || g.querySelector('.fbq');
  if (after && after.nextSibling) g.insertBefore(b, after.nextSibling); else g.appendChild(b);
}
new MutationObserver(() => { if (document.querySelector('.qgrid .gptq') && !document.querySelector('.qgrid .ggq')) ggHome(); }).observe(document.body, { childList: true, subtree: true });
const _vmGg = viewMenu;
viewMenu = function () {
  const r = _vmGg(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-gg')) {
    gs();
    const html = '<button class="tile" id="m-gg"><span class="ic" style="background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08)">' + G_SVG + '</span><b>Google</b><small>যেকোনো কিছু খুঁজুন</small></button>';
    const a = document.getElementById('m-gpt'); if (a) a.insertAdjacentHTML('afterend', html); else t.insertAdjacentHTML('afterbegin', html);
    document.getElementById('m-gg').onclick = ggSheet;
  }
  return r;
};
}
