/* 🎨 New Home + Admin Panel layout (skyline hero, animated duotone icons, admin tab for admins only) */
{
const PH = n => 'https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/assets/duotone/' + n + '-duotone.svg';
let icN = 0;
/* animated gradient duotone icon; anim: float | ring | pulse | spin | grow | wave */
const EM = { 'clipboard-text': '✅', 'bell-simple-ringing': '🔔', 'clock-countdown': '⏰', 'lightning': '⚡', 'calendar-check': '🎙️', 'chart-line-up': '📈', 'squares-four': '🧩', 'target': '🎯', 'users-three': '🕒', 'tree-structure': '🏢', 'shield-star': '🛡️', 'chart-donut': '📊', 'identification-card': '👥', 'hourglass-medium': '📌', 'clipboard': '🗓️', 'strategy': '📝', 'database': '💾', 'toolbox': '🛠️', 'sparkle': '✨', 'folders': '📁' };
const I = (n, c1, c2, tint, anim) => '<span class="x-ic" style="--tint:' + (tint || 'color-mix(in srgb,' + c1 + ' 15%,#fff)') + '"><em class="a-' + (anim || 'float') + '" style="--d:' + ((icN++ % 9) * 0.27).toFixed(2) + 's">' + (EM[n] || '•') + '</em></span>';
/* the app's own original icon (tile .ic / quick .qic), copied with its colours, plus a soft animation */
const CL = (el, anim) => { if (!el) return ''; const c = el.cloneNode(true), cs = getComputedStyle(el); c.removeAttribute('id'); c.classList.add('x-oic', 'lk', 'a-' + (anim || 'float')); c.style.background = cs.backgroundImage && cs.backgroundImage !== 'none' ? cs.backgroundImage : cs.backgroundColor; c.style.setProperty('--d', ((icN++ % 9) * 0.27).toFixed(2) + 's'); return c.outerHTML; };
const GI = (emo, a, b, anim) => '<span class="x-oic a-' + (anim || 'float') + '" style="--d:' + ((icN++ % 9) * 0.27).toFixed(2) + 's;background:linear-gradient(140deg,' + a + ',' + b + ')">' + emo + '</span>';
const boss = () => (typeof isAdmin === 'function' && isAdmin()) || !!(state.profile && state.profile.observer);
const bn = n => Number(n || 0).toLocaleString('bn-BD');
const txt = id => { const e = document.getElementById(id); return e ? e.textContent.trim() : ''; };

const CSS = `<style id="xcss">
.x-ic{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:var(--tint);box-shadow:inset 0 1px 0 rgba(255,255,255,.7);flex:0 0 auto}
.x-ic em{font-style:normal;font-size:25px;line-height:1;display:block}.x-sec h3 .x-ic em,.x-box .hd h3 .x-ic em{font-size:21px}.x-st .x-ic em{font-size:20px}.x-card h4 .x-ic em{font-size:16px}.x-ahead .ttl .x-ic em{font-size:30px}
.x-oic{width:52px;height:52px;border-radius:17px;display:flex;align-items:center;justify-content:center;font-size:27px;box-shadow:inset 0 -3px 0 rgba(11,42,111,.06),0 3px 8px rgba(11,42,111,.08);overflow:hidden}.x-oic{background:var(--lkg,linear-gradient(135deg,#E2EDFF,#C4DAFF));box-shadow:0 8px 18px var(--lks,rgba(11,42,111,.12)),inset 0 -3px 0 rgba(0,0,0,.08)!important;position:relative}.x-oic img{max-width:70%;max-height:70%}.x-oic svg{width:30px;height:30px;max-width:none;max-height:none}
.x-hero .kl,.x-ahead .kl{position:absolute;right:0;bottom:0;height:100%;width:auto;max-width:72%;object-fit:cover;object-position:center bottom;-webkit-mask-image:linear-gradient(90deg,transparent,#000 38%);mask-image:linear-gradient(90deg,transparent,#000 38%);pointer-events:none}
.x-hero .ygbg .ct{display:none}.x-hero>*:not(.ygbg):not(.kl):not(.glow){position:relative;z-index:1}
.x-tabs button em{font-style:normal;font-size:20px;line-height:1}
.x-ic i{width:31px;height:31px;display:block;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;filter:drop-shadow(0 2px 2px rgba(0,0,0,.08))}
.a-float{animation:xFloat 3.4s ease-in-out infinite;animation-delay:var(--d)}@keyframes xFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.a-ring{animation:xRing 4s ease-in-out infinite;animation-delay:var(--d);transform-origin:50% 10%}@keyframes xRing{0%,70%,100%{transform:rotate(0)}74%{transform:rotate(14deg)}78%{transform:rotate(-12deg)}82%{transform:rotate(8deg)}86%{transform:rotate(-4deg)}}
.a-pulse{animation:xPulse 2.6s ease-in-out infinite;animation-delay:var(--d)}@keyframes xPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
.a-spin{animation:xSpin 9s linear infinite}@keyframes xSpin{to{transform:rotate(360deg)}}
.a-grow{animation:xGrow 3s ease-in-out infinite;animation-delay:var(--d);transform-origin:50% 100%}@keyframes xGrow{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.12)}}
.a-wave{animation:xWave 3.2s ease-in-out infinite;animation-delay:var(--d)}@keyframes xWave{0%,100%{transform:rotate(0)}25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}
.view:has(#xhero) #hmt,.view:has(#xhero) #hqw,.view:has(#xhero) #hpf,.view:has(#xhero) .qgrid{display:none!important}
.x-tap{transition:transform .15s}.x-tap:active{transform:scale(.93)}
.x-hero{position:relative;overflow:hidden;margin:0 0 0;padding:16px 18px 64px;border-radius:0 0 30px 30px;color:#fff;background:linear-gradient(160deg,#0B2A6F 0%,#1A4AB0 55%,#2B5FC4 100%);box-shadow:0 14px 34px rgba(11,42,111,.28)}
.x-ahead .sky,.x-hero .sky{position:absolute;right:-10px;bottom:0;width:78%;max-width:330px;opacity:.95;pointer-events:none}
.x-ahead .glow,.x-hero .glow{position:absolute;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 65%);top:-80px;right:-40px;animation:xGlow 7s ease-in-out infinite}@keyframes xGlow{50%{transform:translate(-20px,15px)}}
.x-top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1}
.x-brand{display:flex;align-items:center;gap:10px}.x-brand img{width:42px;height:42px;border-radius:12px;background:#fff;padding:3px;box-shadow:0 4px 12px rgba(0,0,0,.2)}
.x-brand b{display:block;font-size:19px;letter-spacing:.2px}.x-brand small{display:block;font-size:10.5px;letter-spacing:4px;opacity:.85}
.x-tr{display:flex;align-items:center;gap:10px}
.x-bell{position:relative;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
.x-bell i{width:24px;height:24px;display:block;background:#fff;-webkit-mask:url(${PH('bell-ringing')}) center/contain no-repeat;mask:url(${PH('bell-ringing')}) center/contain no-repeat;animation:xRing 4s ease-in-out infinite;transform-origin:50% 10%}
.x-bd{position:absolute;top:-3px;right:-3px;min-width:19px;height:19px;border-radius:10px;background:#EF4444;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 5px;border:2px solid #123E9C}
.x-av{position:relative;border-radius:50%;padding:2px;background:#fff}.x-av .dot{position:absolute;right:1px;bottom:1px;width:11px;height:11px;border-radius:50%;background:#22C55E;border:2px solid #fff}
.x-hi{margin-top:18px;font-size:14.5px;opacity:.9;position:relative;z-index:1}.x-name{font-size:23px;font-weight:800;margin-top:2px;position:relative;z-index:1;max-width:70%}
.x-badge{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:5px 12px;border-radius:20px;font-size:12.5px;font-weight:800;position:relative;z-index:1;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25)}
.x-badge.gold{background:linear-gradient(135deg,#F6D365,#D4AF37);color:#3B2A00;border:0;box-shadow:0 4px 14px rgba(212,175,55,.45)}
.x-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:-44px 14px 0;position:relative;z-index:2}
.x-st{background:rgba(255,255,255,.96);border-radius:18px;padding:10px 8px;display:flex;align-items:center;gap:8px;box-shadow:0 10px 24px rgba(11,42,111,.12);text-align:left}
.x-st .x-ic{width:38px;height:38px;border-radius:12px}.x-st .x-ic i{width:24px;height:24px}
.x-st b{display:block;font-size:20px;color:#0B2A6F;line-height:1.1}.x-st small{display:block;font-size:11px;color:#64748b;line-height:1.2}
.x-sec{display:flex;align-items:center;justify-content:space-between;margin:18px 2px 8px}.x-sec h3{display:flex;align-items:center;gap:8px;font-size:17px;color:#0B2A6F}
.x-sec h3 .x-ic{width:30px;height:30px;border-radius:10px;background:transparent;box-shadow:none}.x-sec h3 .x-ic i{width:24px;height:24px}
.x-sec a,.x-sec button.lnk{font-size:13px;font-weight:700;color:#1a56db;background:none}
.x-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.x-t{background:rgba(255,255,255,.92);border-radius:18px;padding:12px 4px 10px;display:flex;flex-direction:column;align-items:center;gap:7px;box-shadow:0 6px 16px rgba(11,42,111,.07);border:1px solid rgba(255,255,255,.8);position:relative}
.x-t span.l{font-size:12px;font-weight:700;color:#1e293b;text-align:center;line-height:1.25}
.x-t .x-n{position:absolute;top:6px;right:8px;background:#EF4444;color:#fff;font-size:10.5px;font-weight:800;border-radius:9px;padding:1px 6px}
.x-two{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.x-card{background:rgba(255,255,255,.94);border-radius:18px;padding:12px;box-shadow:0 8px 20px rgba(11,42,111,.08);text-align:left;width:100%}
.x-card h4{display:flex;align-items:center;gap:6px;font-size:14px;color:#0B2A6F}.x-card h4 .x-ic{width:28px;height:28px;border-radius:9px}.x-card h4 .x-ic i{width:20px;height:20px}
.x-card .r{display:flex;align-items:center;gap:8px;margin-top:10px}.x-card .r b{font-size:13.5px;color:#0f172a;display:block}.x-card .r small{font-size:12px;color:#1a56db;font-weight:600}
.x-card .nums{display:flex;gap:14px;margin-top:10px;align-items:flex-end}.x-card .nums b{display:block;font-size:22px;color:#0B2A6F}.x-card .nums small{font-size:11.5px;color:#64748b}
/* admin */
.x-ahead{position:relative;overflow:hidden;padding:16px 18px 54px;border-radius:0 0 30px 30px;color:#fff;background:linear-gradient(160deg,#0A1F55,#123E9C 60%,#1E5BD8)}
.x-ahead .row1{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1}.x-ahead .ttl{display:flex;align-items:center;gap:12px}
.x-ahead .ttl .x-ic{width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.14)}.x-ahead .ttl .x-ic i{width:36px;height:36px}
.x-ahead b{display:block;font-size:20px}.x-ahead small{display:block;font-size:14px;opacity:.85}
.x-gear{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}.x-gear i{width:24px;height:24px;display:block;background:#fff;-webkit-mask:url(${PH('gear')}) center/contain no-repeat;mask:url(${PH('gear')}) center/contain no-repeat;animation:xSpin 9s linear infinite}
.x-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:-34px 14px 0;position:relative;z-index:2;background:rgba(255,255,255,.96);border-radius:20px;padding:6px;box-shadow:0 10px 24px rgba(11,42,111,.14)}
.x-tabs button{border-radius:15px;padding:8px 2px;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11.5px;font-weight:700;color:#334155;background:none}
.x-tabs button i{width:22px;height:22px;display:block;background:#1a56db;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}
.x-tabs button.on{background:linear-gradient(140deg,#1a56db,#0B2A6F);color:#fff;box-shadow:0 6px 14px rgba(26,86,219,.35)}.x-tabs button.on i{background:#fff}
.x-box{background:rgba(255,255,255,.9);border-radius:22px;padding:12px;margin-top:14px;box-shadow:0 8px 22px rgba(11,42,111,.07)}
.x-box .hd{display:flex;align-items:center;justify-content:space-between;cursor:pointer}.x-box .hd h3{display:flex;align-items:center;gap:8px;font-size:16.5px;color:#0B2A6F}
.x-box .hd h3 .x-ic{width:30px;height:30px;border-radius:10px;background:transparent;box-shadow:none}.x-box .hd h3 .x-ic i{width:24px;height:24px}
.x-box .chev{font-size:13px;color:#64748b;transition:transform .2s}.x-box.closed .chev{transform:rotate(-90deg)}.x-box.closed .x-grid{display:none}
.x-box .x-grid{margin-top:10px}.x-box .x-t{background:linear-gradient(180deg,#fff,#F8FAFF);border:1px solid #EEF2FA}
.x-sum{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.x-sm{border-radius:16px;padding:12px;display:flex;align-items:center;gap:10px}.x-sm b{display:block;font-size:22px;color:#0B2A6F;line-height:1.1}.x-sm small{font-size:12px;color:#475569}
.x-pill{font-size:12px;font-weight:700;color:#334155;background:#F1F5F9;border-radius:12px;padding:4px 10px}
.x-bar{height:7px;border-radius:9px;background:#E8EEF7;overflow:hidden;margin-top:6px}.x-bar i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#1a56db,#60A5FA)}.x-bar.g i{background:linear-gradient(90deg,#16A34A,#4ADE80)}
.x-store .rw{margin-top:10px;font-size:13px;color:#334155;display:flex;justify-content:space-between}
.tb .x-tbi{width:24px;height:24px;display:block;margin:0 auto 2px;background:currentColor;-webkit-mask:url(${PH('shield-star')}) center/contain no-repeat;mask:url(${PH('shield-star')}) center/contain no-repeat}
.tb[data-t="admin"].on{color:#fff!important}
.tb[data-t="admin"].on .x-tbi{background:#fff}
.tb[data-t="admin"].on::before{content:"";position:absolute;inset:0 6px;border-radius:16px;background:linear-gradient(140deg,#1a56db,#0B2A6F);z-index:-1;box-shadow:0 6px 14px rgba(26,86,219,.35)}
.tb[data-t="admin"]{z-index:0}
</style>`;
const css = () => { if (!document.getElementById('xcss')) document.head.insertAdjacentHTML('beforeend', CSS); };

/* Kuala Lumpur skyline (drawn) */
const SKY = '<svg class="sky" viewBox="0 0 330 170" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="xsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFD7FF" stop-opacity=".55"/><stop offset="1" stop-color="#7FA8F5" stop-opacity=".25"/></linearGradient><linearGradient id="xsk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6EFFF" stop-opacity=".85"/><stop offset="1" stop-color="#9CBCF7" stop-opacity=".45"/></linearGradient></defs>'
  + '<g fill="url(#xsk)"><rect x="8" y="110" width="26" height="60"/><rect x="38" y="95" width="20" height="75"/><rect x="62" y="120" width="24" height="50"/><rect x="226" y="100" width="22" height="70"/><rect x="252" y="118" width="30" height="52"/><rect x="286" y="88" width="20" height="82"/><rect x="309" y="112" width="21" height="58"/><path d="M200 170V70l6-14 6 14v100z"/></g>'
  + '<g fill="url(#xsk2)"><path d="M112 170V62l4-6v-12l3-6v-14l2-14 2 14v14l3 6v12l4 6v108z"/><path d="M158 170V62l4-6v-12l3-6v-14l2-14 2 14v14l3 6v12l4 6v108z"/><rect x="128" y="96" width="32" height="5" rx="2"/></g>'
  + '<g fill="#FFF" opacity=".75">' + Array.from({ length: 26 }, (_, i) => '<rect x="' + (116 + (i % 2) * 46 + (i % 3) * 3) + '" y="' + (70 + Math.floor(i / 2) * 7) + '" width="2" height="2"/>').join('') + '</g>'
  + '<path d="M0 170c40-14 80-14 120-6s90 10 130 0 60-8 80-4v10z" fill="#fff" opacity=".18"/></svg>';

/* ---------------- HOME ---------------- */
function homeBuild() {
  try {
    const view = document.querySelector('.view'), oldHero = view && view.querySelector(':scope > .hero'), pad = view && view.querySelector(':scope > .pad');
    if (!oldHero || !pad || document.getElementById('xhero')) return;
    css();
    const p = state.profile, isB = boss();
    oldHero.style.display = 'none';
    const badge = p.observer ? '<span class="x-badge gold">👑 Admin Account</span>' : '<span class="x-badge">' + esc(p.designation || p.role || '') + '</span>';
    oldHero.insertAdjacentHTML('beforebegin', '<div class="x-hero" id="xhero"><img class="kl" src="kl-skyline.jpg" alt=""><div class="glow"></div>'
      + '<div class="x-top"><div class="x-brand"><img src="icon-192.png" alt=""><div><b>Yaqeen Group</b><small>TEAM</small></div></div>'
      + '<div class="x-tr"><button class="x-bell x-tap" id="xbell"><i></i><span class="x-bd" id="xbellb" hidden></span></button><button class="x-av x-tap" id="xav">' + avatar(p.full_name, p.id, 46) + '<span class="dot"></span></button></div></div>'
      + '<div class="x-hi">Assalamualaikum,</div><div class="x-name">' + esc(p.full_name) + '</div>' + badge + '</div>');
    { const bg = oldHero.querySelector('.ygbg'), xh = document.getElementById('xhero'); if (bg && xh) xh.prepend(bg.cloneNode(true)); }
    pad.insertAdjacentHTML('afterbegin', '<div class="x-stats" id="xstats">'
      + '<button class="x-st x-tap" id="xs1">' + I('clipboard-text', '#2563EB', '#60A5FA', 'rgba(37,99,235,.12)', 'float') + '<span><b id="xs1v">–</b><small>Open Tasks</small></span></button>'
      + '<button class="x-st x-tap" id="xs2">' + I('bell-simple-ringing', '#F59E0B', '#FBBF24', 'rgba(245,158,11,.14)', 'ring') + '<span><b id="xs2v">–</b><small>Notifications</small></span></button>'
      + '<button class="x-st x-tap" id="xs3">' + I('clock-countdown', '#7C3AED', '#A78BFA', 'rgba(124,58,237,.12)', 'pulse') + '<span><b id="xs3v">–</b><small>Overdue</small></span></button></div>');
    pad.style.marginTop = '0';
    const hst = document.getElementById('xstats'); hst.style.marginBottom = '14px';
    const keepTop = () => { if (pad.firstElementChild !== hst && document.body.contains(hst)) pad.prepend(hst); };
    new MutationObserver(keepTop).observe(pad, { childList: true }); keepTop();
    document.getElementById('xbell').onclick = () => go('notif');
    document.getElementById('xav').onclick = () => renderProfile();
    document.getElementById('xs1').onclick = () => go('tasks');
    document.getElementById('xs2').onclick = () => go('notif');
    document.getElementById('xs3').onclick = () => (window.viewOverdue ? viewOverdue() : go('tasks'));
    const sync = () => {
      if (!document.getElementById('xhero')) return clearInterval(t);
      const a = txt('k2'), n = txt('lknfv'), o = txt('lkodv');
      if (a) document.getElementById('xs1v').textContent = a;
      if (n) { document.getElementById('xs2v').textContent = n; const b = document.getElementById('xbellb'); const nn = parseInt(n.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d)), 10) || 0; b.hidden = !nn; b.textContent = n; }
      if (o) document.getElementById('xs3v').textContent = o;
      const pv = document.getElementById('xpv1'); if (pv && a) pv.textContent = a;
      const hm = document.getElementById('hmt'), ms = document.getElementById('xmts');
      if (hm && ms) { const ls = hm.innerText.split('\n').map(x => x.trim()).filter(Boolean).filter(x => !/today'?s meeting|আজকের মিটিং|tap to|চাপ দিন/i.test(x)); ms.textContent = ls.join(' · ') || 'হাজিরা দেখুন'; }
    };
    const t = setInterval(sync, 1200); sync();

    /* quick access */
    const qg = pad.querySelector('.qgrid'), qw = document.getElementById('hqw'); if (qw) qw.style.display = 'none';
    if (qg) {
      const qi = [...qg.children], find = re => qi.find(x => re.test(x.className + ' ' + x.textContent));
      const gpt = find(/gptq/), gptIc = gpt && gpt.querySelector('img,svg') ? gpt.querySelector('img,svg').outerHTML : '';
      const oq = re => { const o = find(re); return o ? CL(o.querySelector('.qic'), 'float') : ''; };
      const items = [
        ['xq-ch', 'Chats', oq(/Chats/) || I('chats-circle', '#16A34A', '#4ADE80'), () => go('chats')],
        ['xq-no', 'Notices', oq(/Notices/) || I('megaphone', '#F97316', '#FDBA74'), () => go('notices')],
        ['xq-tk', 'Tasks', oq(/Tasks/) || I('check-square', '#2563EB', '#60A5FA'), () => go('tasks')],
        ['xq-cr', 'CRM', oq(/CRM/) || I('chart-bar', '#E11D48', '#FB7185'), () => go('crm')],
        ['xq-gp', 'ChatGPT', oq(/gptq/) || I('sparkle', '#10A37F', '#34D399'), () => { const o = find(/gptq/); o ? o.click() : window.open('https://chatgpt.com/', '_blank'); }],
        ['xq-gg', 'Google', oq(/ggq/) || I('sparkle', '#4285F4', '#34A853'), () => { const o = find(/ggq/); o && o.click(); }],
        ['xq-fb', 'Facebook', oq(/fbq/) || I('facebook-logo', '#1877F2', '#3B82F6'), () => { const o = find(/fbq/); o && o.click(); }],
        ['xq-mo', 'More', GI('🧩', '#E9D5FF', '#C4B5FD', 'wave'), () => go('menu')]
      ];
      qg.style.display = 'none';
      qg.insertAdjacentHTML('beforebegin', '<div class="x-sec"><h3>' + I('lightning', '#2563EB', '#22D3EE', 'transparent', 'pulse') + 'Quick Access</h3><button class="lnk" id="xqall">See All →</button></div><div class="x-grid" id="xqg">'
        + items.map(([id, l, ic]) => '<button class="x-t x-tap" id="' + id + '">' + ic + '<span class="l">' + l + '</span></button>').join('') + '</div>');
      items.forEach(([id, , , fn]) => { const b = document.getElementById(id); if (b) b.onclick = fn; });
      document.getElementById('xqall').onclick = () => go('menu');
      /* meeting + performance */
      const hmt = document.getElementById('hmt'); let mt = 'Morning Meeting', ms = '';
      if (hmt) { const lines = hmt.innerText.split('\n').map(s => s.trim()).filter(Boolean); mt = lines[0] || mt; ms = lines.slice(1, 3).join(' · '); hmt.style.display = 'none'; }
      const rr = /(\d+|[০-৯]+)\s*\/\s*(\d+|[০-৯]+)/.exec(txt('ob-r'));
      document.getElementById('xqg').insertAdjacentHTML('afterend', '<div class="x-two"><button class="x-card x-tap" id="xmt"><h4>' + I('calendar-check', '#2563EB', '#60A5FA', 'rgba(37,99,235,.12)', 'float') + "Today's Meeting ›</h4><div class=\"r\"><span><b>" + (new Date().getHours() >= 17 ? 'Night Meeting' : 'Morning Meeting') + '</b><small id="xmts">' + esc(ms) + '</small></span></div></button>'
        + '<button class="x-card x-tap" id="xpf"><h4>' + I('chart-line-up', '#16A34A', '#22D3EE', 'rgba(22,163,74,.12)', 'grow') + (isB ? 'Team Performance' : 'My Performance') + '</h4><div class="nums"><span><b id="xpv1">' + esc(txt('k2') || '–') + '</b><small>Active Tasks</small></span>'
        + (isB ? '<span><b>' + (rr ? esc(rr[1] + '/' + rr[2]) : '–') + '</b><small>Reports</small></span>' : '<span><b>' + esc(txt('lkodv') || '0') + '</b><small>Overdue</small></span>') + '</div></button></div>');
      document.getElementById('xmt').onclick = () => (hmt ? hmt.click() : (window.viewMeetings ? viewMeetings() : go('home')));
      document.getElementById('xpf').onclick = () => (isB ? (window.ygReportDash ? ygReportDash() : go('home')) : (typeof viewPerfPerson === 'function' ? viewPerfPerson(state.profile.id) : go('tasks')));
    }
  } catch (e) { console.warn('home redesign', e); }
}
const _vhX = viewHome;
viewHome = async function () {
  const r = await _vhX.apply(this, arguments);
  homeBuild(); setTimeout(homeBuild, 400); setTimeout(() => { const h = document.getElementById('hpf'); if (h) h.style.display = 'none'; const q = document.getElementById('hqw'); if (q) q.style.display = 'none'; }, 900);
  return r;
};

/* ---------------- ADMIN PANEL ---------------- */
const AD = {
  biz: ['Business & Performance', I('target', '#E11D48', '#FB7185', 'transparent', 'pulse'), [
    ['x-cs', 'CRM', 'handshake', '#2563EB', '#60A5FA', 'wave'], ['x-tg', 'Target', 'flag-banner', '#E11D48', '#FB7185', 'wave'], ['x-pf', 'Performance', 'trend-up', '#16A34A', '#4ADE80', 'grow'], ['x-df', 'Daily Report', 'notebook', '#059669', '#34D399', 'float'],
    ['@rdash', 'Report Dashboard', 'presentation-chart', '#0EA5E9', '#7DD3FC', 'grow'], ['x-wk', 'Weekly Review', 'chart-pie-slice', '#F59E0B', '#FCD34D', 'spin'], ['@pchk', 'Post Check', 'seal-check', '#7C3AED', '#C4B5FD', 'pulse'], ['x-sop', 'SOP Checklist', 'list-magnifying-glass', '#0F766E', '#5EEAD4', 'float']]],
  att: ['Attendance & Discipline', I('users-three', '#7C3AED', '#A78BFA', 'transparent', 'float'), [
    ['x-att', 'Attendance', 'fingerprint', '#16A34A', '#4ADE80', 'pulse'], ['x-mt', 'Meeting Att.', 'microphone', '#2563EB', '#60A5FA', 'wave'], ['x-lv', 'Leave', 'airplane-tilt', '#8B5CF6', '#C4B5FD', 'float'], ['x-dc', 'Discipline', 'shield-check', '#F59E0B', '#FCD34D', 'pulse'],
    ['x-sal', 'Salah Report', 'moon-stars', '#16A34A', '#86EFAC', 'wave'], ['x-stuck', 'Stuck Tasks', 'warning-octagon', '#DC2626', '#F87171', 'pulse'], ['x-tr', 'Task Report', 'list-checks', '#2563EB', '#93C5FD', 'float'], ['x-off', 'Office Location', 'map-pin', '#E11D48', '#FB7185', 'float']]],
  org: ['Team & Organization', I('tree-structure', '#2563EB', '#60A5FA', 'transparent', 'float'), [
    ['x-mb', 'Members', 'users-four', '#2563EB', '#60A5FA', 'float'], ['x-gr', 'Groups', 'chats-circle', '#7C3AED', '#C4B5FD', 'wave'], ['x-co', 'Companies', 'buildings', '#334155', '#94A3B8', 'float'], ['x-ap', 'Approvals', 'user-check', '#16A34A', '#4ADE80', 'pulse'],
    ['x-aw', 'Awards', 'trophy', '#F59E0B', '#FCD34D', 'wave'], ['x-nt', 'Notices', 'megaphone-simple', '#F97316', '#FDBA74', 'wave'], ['x-rp', 'Reports', 'file-text', '#7C3AED', '#A78BFA', 'float'], ['@appeal', 'Appeal', 'scales', '#2563EB', '#93C5FD', 'wave'],
    ['@sc', 'Show-cause', 'note-pencil', '#B91C1C', '#F87171', 'float'], ['@issues', 'Issue Desk', 'wrench', '#475569', '#94A3B8', 'wave']]]
};
const SPECIAL = { '@rdash': () => window.ygReportDash && ygReportDash(), '@pchk': () => window.ygPostReport && ygPostReport(), '@appeal': () => window.viewAppeals && viewAppeals(), '@sc': () => handleDeepLink(new URL('./?sc=1', location.href).href), '@issues': () => window.issueDashboard && issueDashboard() };
let xTab = 'dash';
const SPI = { '@rdash': ['📊', '#CCFBF1', '#5EEAD4'], '@pchk': ['✨', '#EDE9FE', '#C4B5FD'], '@appeal': ['⚖️', '#E0E7FF', '#A5B4FC'], '@sc': ['📜', '#FEE2E2', '#FCA5A5'], '@issues': ['🧰', '#FFE4E6', '#FDA4AF'] };
const closedSet = () => { try { return new Set(JSON.parse(localStorage.getItem('yg_adm_closed') || '[]')); } catch (e) { return new Set(); } };
const _vaX = viewAdmin;
viewAdmin = async function () {
  await _vaX.apply(this, arguments);
  await new Promise(r => setTimeout(r, 250));
  css(); icN = 0;
  const holder = document.createElement('div'); holder.style.display = 'none'; holder.id = 'xhold';
  [...document.querySelectorAll('.tile')].forEach(t => holder.appendChild(t));
  const pend = txt('a2'), flag = txt('a3');
  ui.tab = 'admin';
  const tabs = [['dash', 'Dashboard', '🧭'], ['mgmt', 'Management', '🗂️'], ['rep', 'Reports', '📑'], ['set', 'Settings', '⚙️']];
  const show = { dash: ['biz', 'att', 'org'], mgmt: ['org', 'att'], rep: ['biz'] };
  const cl = closedSet();
  const known = new Set(Object.values(AD).flatMap(s => s[2].map(x => x[0])));
  const extra = [...holder.children].filter(t => t.id && !known.has(t.id));
  const box = (k, s) => {
    const list = s[2].filter(x => x[0].startsWith('@') || holder.querySelector('#' + x[0]));
    if (k === 'org') extra.forEach(t => list.push([t.id, (t.querySelector('b') || {}).textContent || t.id, 'folders', '#64748B', '#CBD5E1', 'float']));
    return '<div class="x-box ' + (cl.has(k) ? 'closed' : '') + '" data-k="' + k + '"><div class="hd"><h3>' + s[1] + s[0] + '</h3><span class="chev">▾</span></div><div class="x-grid">'
      + list.map(x => '<button class="x-t x-tap" data-go="' + x[0] + '">' + (SPI[x[0]] ? GI(SPI[x[0]][0], SPI[x[0]][1], SPI[x[0]][2], x[5]) : (CL(holder.querySelector('#' + x[0] + ' .ic'), x[5] === 'spin' ? 'float' : x[5]) || I(x[2], x[3], x[4], null, x[5]))) + '<span class="l">' + esc(x[1]) + '</span>' + (x[0] === 'x-ap' && pend && pend !== '0' ? '<span class="x-n">' + esc(pend) + '</span>' : '') + (x[0] === 'x-rp' && flag && flag !== '0' ? '<span class="x-n">' + esc(flag) + '</span>' : '') + '</button>').join('') + '</div></div>';
  };
  frame('<div class="x-ahead"><img class="kl" src="kl-skyline.jpg" alt="" style="opacity:.55"><div class="glow"></div>' + '<div class="row1"><div class="ttl">' + I('shield-star', '#F6D365', '#D4AF37', 'rgba(255,255,255,.14)', 'pulse') + '<div><b>Yaqeen Group</b><small>Admin Panel</small></div></div><button class="x-gear x-tap" id="xgear"><i></i></button></div></div>'
    + '<div class="x-tabs">' + tabs.map(([k, l, ic]) => '<button data-xt="' + k + '" class="' + (xTab === k ? 'on' : '') + '"><em>' + ic + '</em>' + l + '</button>').join('') + '</div>'
    + '<div class="pad" style="padding-top:4px">'
    + (xTab === 'dash' ? '<div class="x-box"><div class="hd"><h3>' + I('chart-donut', '#2563EB', '#22D3EE', 'transparent', 'spin') + 'System Summary</h3><span class="x-pill">This Month</span></div><div class="x-sum">'
      + '<div class="x-sm" style="background:#ECFDF5">' + I('identification-card', '#16A34A', '#4ADE80', 'rgba(22,163,74,.12)', 'float') + '<span><b id="xm1">–</b><small>Team Members</small></span></div>'
      + '<div class="x-sm" style="background:#EFF6FF">' + I('hourglass-medium', '#2563EB', '#60A5FA', 'rgba(37,99,235,.12)', 'spin') + '<span><b id="xm2">–</b><small>Open Tasks</small></span></div>'
      + '<div class="x-sm" style="background:#F5F3FF">' + I('clipboard', '#7C3AED', '#A78BFA', 'rgba(124,58,237,.12)', 'pulse') + '<span><b id="xm3">–</b><small>Tasks This Month</small></span></div>'
      + '<div class="x-sm" style="background:#FFF7ED">' + I('strategy', '#F97316', '#FDBA74', 'rgba(249,115,22,.13)', 'grow') + '<span><b id="xm4">–</b><small>Reports Today</small></span></div></div></div>' : '')
    + (xTab === 'set' ? '' : (show[xTab] || []).map(k => box(k, AD[k])).join(''))
    + (xTab === 'dash' || xTab === 'set' ? '<div class="x-box x-store" id="xstore"><div class="hd"><h3>' + I('database', '#0EA5E9', '#7DD3FC', 'transparent', 'pulse') + 'System Storage</h3><span class="x-pill">Free Plan</span></div><div id="xstb" class="mut" style="font-size:12.5px;margin-top:8px">লোড হচ্ছে…</div></div>' : '')
    + (xTab === 'set' ? '<div class="x-box"><div class="hd"><h3>' + I('toolbox', '#475569', '#94A3B8', 'transparent', 'wave') + 'Settings</h3></div><div class="x-grid" style="margin-top:10px"><button class="x-t x-tap" id="xsmenu">' + I('squares-four', '#8B5CF6', '#C4B5FD', 'rgba(139,92,246,.12)', 'spin') + '<span class="l">Full Menu</span></button><button class="x-t x-tap" id="xsprof">' + I('identification-card', '#2563EB', '#60A5FA', 'rgba(37,99,235,.12)', 'float') + '<span class="l">My Profile</span></button></div></div>' : '')
    + '</div>');
  document.querySelector('.view').appendChild(holder);
  document.getElementById('xgear').onclick = () => go('menu');
  document.querySelectorAll('[data-xt]').forEach(b => b.onclick = () => { if (b.dataset.xt === xTab) return; xTab = b.dataset.xt; viewAdmin(); });
  document.querySelectorAll('.x-box[data-k] .hd').forEach(h => h.onclick = () => { const bx = h.parentElement; bx.classList.toggle('closed'); const s = closedSet(); bx.classList.contains('closed') ? s.add(bx.dataset.k) : s.delete(bx.dataset.k); try { localStorage.setItem('yg_adm_closed', JSON.stringify([...s])); } catch (e) {} });
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const g = b.dataset.go; if (SPECIAL[g]) return SPECIAL[g](); const t = document.getElementById(g); if (t) t.click(); });
  const sm = document.getElementById('xsmenu'); if (sm) sm.onclick = () => go('menu');
  const sp = document.getElementById('xsprof'); if (sp) sp.onclick = () => renderProfile();
  /* numbers */
  try {
    const today = todayDhaka(), mStart = today.slice(0, 8) + '01';
    const ppl = Object.values(ui.people).filter(p => !p.observer && p.status !== 'inactive');
    const rp = ppl.filter(p => p.daily_report !== false);
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('xm1', bn(ppl.length));
    const [o, m, d, use] = await Promise.all([
      sb.from('tasks').select('id', { count: 'exact', head: true }).neq('status', 'completed'),
      sb.from('tasks').select('id', { count: 'exact', head: true }).gte('created_at', mStart + 'T00:00:00+06:00'),
      sb.from('daily_reports').select('user_id', { count: 'exact', head: true }).eq('report_date', today),
      sb.rpc('get_storage_usage')
    ]);
    set('xm2', bn(o.count)); set('xm3', bn(m.count)); set('xm4', bn(d.count) + '/' + bn(rp.length));
    const u = use && use.data, st = document.getElementById('xstb');
    if (u && st) {
      const mb = b => (b / 1048576).toFixed(1);
      const row = (l, a, b, g) => { const pc = Math.min(100, a / b * 100); return '<div class="rw"><span>' + l + ': <b>' + mb(a) + ' / ' + Math.round(b / 1048576).toLocaleString() + ' MB</b></span><span>' + pc.toFixed(1) + '%</span></div><div class="x-bar ' + (g ? 'g' : '') + '"><i style="width:' + Math.max(1.5, pc) + '%"></i></div>'; };
      st.className = ''; st.innerHTML = row('📁 Files', u.file_bytes, u.file_limit_bytes) + row('💬 Messages & Data', u.db_bytes, u.db_limit_bytes, true);
    }
  } catch (e) {}
};

/* ---------------- bottom bar: Admin tab for admins only ---------------- */
const _goX = go;
go = function (tab) {
  if (tab === 'admin') { cleanupChannels(); ui.openConv = null; ui.tab = 'admin'; return viewAdmin(); }
  return _goX.apply(this, arguments);
};
function patchBar() {
  if (!state.profile || !boss()) return;
  document.querySelectorAll('.tabbar').forEach(nav => {
    const m = nav.querySelector('.tb[data-t="menu"]'); if (!m || nav.querySelector('.tb[data-t="admin"]')) return;
    m.dataset.t = 'admin'; m.innerHTML = '<span class="x-tbi"></span>Admin';
    m.classList.toggle('on', ui.tab === 'admin');
    m.onclick = () => go('admin');
  });
}
css();
new MutationObserver(() => patchBar()).observe(document.body, { childList: true, subtree: true });
}
