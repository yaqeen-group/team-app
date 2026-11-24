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
