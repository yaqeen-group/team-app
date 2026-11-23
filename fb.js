/* 📘 Facebook pages: one tap → our 4 company pages (logos) */
{
const FB_PAGES = [
  { name: 'MY TravelMate', sub: 'মূল পেজ', logo: 'fb-mytravelmate.jpg', url: 'https://www.facebook.com/share/1JFkb9mCPd/' },
  { name: 'Halal Safaar', sub: 'ট্যুর · টিকিট', logo: 'fb-halalsafaar.jpg', url: 'https://www.facebook.com/share/18u1NpzfgU/' },
  { name: 'MY TravelMate Pakulla', sub: 'পাকুল্লা ব্রাঞ্চ', logo: 'fb-pakulla.jpg', url: 'https://www.facebook.com/share/18gFEBoQqe/' },
  { name: 'Yaqeen Business Solution', sub: 'Yaqeen Group', logo: 'fb-yaqeen.jpg', url: 'https://www.facebook.com/share/1DdUApTmBi/' }
];
const FB_SVG = '<svg viewBox="0 0 24 24" style="width:30px;height:30px"><path fill="#fff" d="M13.6 21v-7.4h2.5l.4-2.9h-2.9V8.9c0-.8.2-1.4 1.4-1.4h1.6V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.1H8v2.9h2.5V21z"/></svg>';
const FB_CSS = '<style id="fbcss">.fbq .qic{background:linear-gradient(140deg,#4F8DFF,#1253D6)!important;box-shadow:0 6px 14px #1253D655,inset 0 -3px 0 rgba(0,0,0,.08)!important;position:relative;overflow:hidden;animation:fbIn .5s cubic-bezier(.3,1.5,.5,1) both}.fbq .qic::after{content:"";position:absolute;inset:-40%;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.45) 50%,transparent 60%);transform:translateX(-100%);animation:fbShine 5s ease-in-out infinite 1s}.fbq .qic svg{position:relative;z-index:1;animation:fbBob 2.6s ease-in-out infinite}@keyframes fbShine{0%,70%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes fbBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes fbIn{0%{transform:scale(.4);opacity:0}100%{transform:none;opacity:1}}.fbg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}.fbp{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:18px;background:#fff;box-shadow:0 6px 18px rgba(11,42,111,.1);border:1px solid #eef2f7;text-align:center;transition:transform .15s;animation:fbIn .45s cubic-bezier(.3,1.5,.5,1) both}.fbp:active{transform:scale(.96)}.fbp img{width:84px;height:84px;border-radius:50%;object-fit:cover;box-shadow:0 4px 12px rgba(0,0,0,.12)}.fbp b{font-size:13.5px;color:#0B2A6F;line-height:1.25}.fbp small{font-size:11.5px;color:#64748b}.fbp .go{font-size:11.5px;font-weight:700;color:#1877F2}</style>';
function fbStyle() { if (!document.getElementById('fbcss')) document.head.insertAdjacentHTML('beforeend', FB_CSS); }
function fbOpen(url) { const w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url; }
function fbSheet() {
  fbStyle();
  sheet('<h3>📘 আমাদের Facebook পেজ</h3><p class="mut" style="margin:0">লোগোতে চাপ দিলে পেজ খুলবে — লাইক, শেয়ার ও কমেন্ট করুন 🙌</p><div class="fbg">'
    + FB_PAGES.map((p, i) => '<button class="fbp" data-fb="' + i + '" style="animation-delay:' + (i * 0.07) + 's"><img src="' + p.logo + '" alt="' + esc(p.name) + '"><b>' + esc(p.name) + '</b><small>' + esc(p.sub) + '</small><span class="go">পেজ খুলুন ↗</span></button>').join('')
    + '</div>', el => { el.querySelectorAll('[data-fb]').forEach(b => b.onclick = () => fbOpen(FB_PAGES[+b.dataset.fb].url)); });
}
window.fbSheet = fbSheet;
function fbHome() {
  const g = document.querySelector('.qgrid'); if (!g || g.querySelector('.fbq')) return;
  fbStyle();
  const btn = document.createElement('button'); btn.className = 'qi fbq'; btn.type = 'button';
  btn.innerHTML = '<span class="qic">' + FB_SVG + '</span><span>Facebook</span>';
  btn.onclick = fbSheet;
  const after = g.querySelector('[data-q="tasks"]') || g.children[2];
  if (after && after.nextSibling) g.insertBefore(btn, after.nextSibling); else g.appendChild(btn);
}
new MutationObserver(() => { if (document.querySelector('.qgrid') && !document.querySelector('.qgrid .fbq')) fbHome(); }).observe(document.body, { childList: true, subtree: true });
const _vmFb = viewMenu;
viewMenu = function () {
  const r = _vmFb(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-fb')) {
    fbStyle();
    t.insertAdjacentHTML('afterbegin', '<button class="tile" id="m-fb"><span class="ic" style="background:linear-gradient(140deg,#4F8DFF,#1253D6)">' + FB_SVG + '</span><b>Facebook</b><small>আমাদের ৪টা পেজ</small></button>');
    document.getElementById('m-fb').onclick = fbSheet;
  }
  return r;
};
}
