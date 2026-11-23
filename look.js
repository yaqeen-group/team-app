/* ✨ look: custom animated icons (bottom bar, home tiles, menu), soft animated backgrounds, task motivation strip */
{
const LK_CSS = `<style id="lkcss">
/* bottom bar */
.tb .ti.lk{filter:none!important;opacity:1!important;display:inline-flex;align-items:center;justify-content:center;width:46px;height:30px;border-radius:12px;color:#93a1b4;transition:background .25s,color .25s,transform .25s}
.tb .ti.lk svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;overflow:visible}
.tb.on .ti.lk{color:#fff;background:linear-gradient(135deg,#1E6FE0,#0B2A6F);box-shadow:0 4px 12px rgba(30,111,224,.35);animation:lkPop .45s cubic-bezier(.3,1.6,.5,1)}
.tb.on{color:#0B2A6F!important}
@keyframes lkPop{0%{transform:scale(.6)}100%{transform:scale(1)}}
.tb[data-t="home"].on .lk-roof{animation:lkRoof 2.8s ease-in-out infinite;transform-origin:12px 10px}
@keyframes lkRoof{0%,80%,100%{transform:translateY(0)}88%{transform:translateY(-2px)}}
.tb[data-t="notif"]:has(.bd:not([hidden])) .lk-bell{animation:lkRing 3.2s ease-in-out infinite;transform-origin:12px 3px}
@keyframes lkRing{0%,70%,100%{transform:rotate(0)}74%{transform:rotate(16deg)}78%{transform:rotate(-14deg)}82%{transform:rotate(10deg)}86%{transform:rotate(-6deg)}90%{transform:rotate(0)}}
.lk-chk{stroke-dasharray:14;stroke-dashoffset:0}
.tb[data-t="tasks"].on .lk-chk,.qi[data-q="tasks"] .lk-chk,.qi[data-q="admin"] .lk-chk{animation:lkDraw 2.6s ease-in-out infinite}
@keyframes lkDraw{0%{stroke-dashoffset:14}35%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:14}}
.tb[data-t="crm"].on .lk-b,.qi[data-q="crm"] .lk-b{animation:lkBar 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom}
.lk-b2{animation-delay:.25s!important}.lk-b3{animation-delay:.5s!important}
@keyframes lkBar{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1)}}
.tb[data-t="menu"].on .lk-sq{animation:lkSq 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.lk-sq2{animation-delay:.2s!important}.lk-sq3{animation-delay:.4s!important}.lk-sq4{animation-delay:.6s!important}
@keyframes lkSq{0%,60%,100%{transform:scale(1)}75%{transform:scale(.7) rotate(45deg)}}
/* home quick tiles */
.qi .qic.lk{position:relative;overflow:hidden;background:var(--lkg)!important;box-shadow:0 6px 14px var(--lks),inset 0 -3px 0 rgba(0,0,0,.08)!important;transition:transform .2s}
.qi .qic.lk svg{width:30px;height:30px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;overflow:visible;position:relative;z-index:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.15))}
.qi .qic.lk::after{content:"";position:absolute;inset:-40%;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.45) 50%,transparent 60%);transform:translateX(-100%);animation:lkShine 5s ease-in-out infinite;animation-delay:var(--lkd,0s)}
@keyframes lkShine{0%,70%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
.qi:active .qic.lk{transform:scale(.9)}
.qi .qic.lk{animation:lkIn .5s cubic-bezier(.3,1.5,.5,1) both;animation-delay:var(--lkd,0s)}
@keyframes lkIn{0%{transform:scale(.4) rotate(-12deg);opacity:0}100%{transform:none;opacity:1}}
.lk-dot{animation:lkDot 1.4s ease-in-out infinite}.lk-dot2{animation-delay:.2s}.lk-dot3{animation-delay:.4s}
@keyframes lkDot{0%,100%{opacity:.35;transform:translateY(0)}40%{opacity:1;transform:translateY(-1.5px)}}
.lk-w1,.lk-w2{animation:lkWave 1.8s ease-out infinite}.lk-w2{animation-delay:.35s}
@keyframes lkWave{0%{opacity:0}40%{opacity:1}100%{opacity:0}}
.lk-h1{animation:lkBob 2.4s ease-in-out infinite}.lk-h2{animation:lkBob 2.4s ease-in-out infinite .6s}
@keyframes lkBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.6px)}}
.lk-pl{animation:lkSpin 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes lkSpin{0%,60%{transform:rotate(0)}80%,100%{transform:rotate(180deg)}}
.lk-ln{stroke-dasharray:8;animation:lkWrite 3s ease-in-out infinite}.lk-ln2{animation-delay:.5s}.lk-ln3{animation-delay:1s}
@keyframes lkWrite{0%{stroke-dashoffset:8}30%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:8}}
.lk-pen{animation:lkPen 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:10% 90%}
@keyframes lkPen{0%,100%{transform:rotate(0) translate(0,0)}25%{transform:rotate(-12deg) translate(-1px,0)}50%{transform:rotate(4deg) translate(1px,0)}75%{transform:rotate(-8deg) translate(0,-.5px)}}
.lk-blink{animation:lkBlink 4s infinite;transform-box:fill-box;transform-origin:center}
@keyframes lkBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
/* menu tiles: gentle float */
.tile .ic{animation:lkFloat 3.6s ease-in-out infinite;animation-delay:var(--lkd,0s)}
@keyframes lkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.tile:active .ic{transform:scale(.9)}
/* soft moving background */
#lkbg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
#lkbg i{position:absolute;width:46vmax;height:46vmax;border-radius:50%;filter:blur(60px);opacity:.28;animation:lkBlob 22s ease-in-out infinite}
#lkbg i:nth-child(1){left:-15vmax;top:-10vmax;background:var(--lk1,#9CC3FF)}
#lkbg i:nth-child(2){right:-18vmax;top:30vh;background:var(--lk2,#B9F3DA);animation-delay:-7s}
#lkbg i:nth-child(3){left:10vw;bottom:-20vmax;background:var(--lk3,#FFD9A8);animation-delay:-14s}
@keyframes lkBlob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(6vmax,4vmax) scale(1.12)}66%{transform:translate(-4vmax,6vmax) scale(.92)}}
body[data-lk="tasks"]{--lk1:#A7F3D0;--lk2:#BFDBFE;--lk3:#FDE68A}
body[data-lk="notif"]{--lk1:#FDE68A;--lk2:#FBCFE8;--lk3:#BFDBFE}
body[data-lk="crm"]{--lk1:#FECACA;--lk2:#FED7AA;--lk3:#C7D2FE}
body[data-lk="menu"]{--lk1:#DDD6FE;--lk2:#BAE6FD;--lk3:#FBCFE8}
/* tasks: rising sparks */
#lkfx{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;display:none}
body[data-lk="tasks"] #lkfx{display:block}
#lkfx span{position:absolute;bottom:-40px;font-size:18px;opacity:0;animation:lkRise 14s linear infinite}
@keyframes lkRise{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:.5}80%{opacity:.35}100%{transform:translateY(-110vh) rotate(25deg);opacity:0}}
/* motivation strip */
.lk-moti{display:flex;align-items:center;gap:10px;margin:2px 0 10px;padding:11px 14px;border-radius:16px;background:linear-gradient(120deg,#0B2A6F,#1E6FE0 55%,#16a34a);background-size:200% 200%;color:#fff;font-size:13.5px;font-weight:600;box-shadow:0 6px 16px rgba(30,111,224,.25);animation:lkGrad 8s ease infinite}
.lk-moti .e{font-size:22px;animation:lkBob 2s ease-in-out infinite}
.lk-moti .t{transition:opacity .4s}
@keyframes lkGrad{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
/* page enter */
.view.lk-in>*{animation:lkFade .35s ease both}
@keyframes lkFade{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){#lkbg i,#lkfx span,.tile .ic,.qi .qic.lk,.qi .qic.lk::after,.lk-moti,[class*="lk-"]{animation:none!important}}
/* compact hero */
.hero{padding:14px 18px 14px!important}
.hero .hi{margin-top:10px!important}
.hero .hi b{font-size:20px!important}
.hero .kp{gap:6px!important;margin-top:10px!important}
.hero .kp>div{padding:7px 8px!important;border-radius:12px!important;display:flex;align-items:center;gap:6px;cursor:pointer;transition:transform .15s,background .2s}
.hero .kp>div:active{transform:scale(.96)}
.hero .kp .ki{font-size:15px!important;margin:0!important}
.hero .kp b{font-size:17px!important;line-height:1}
.hero .kp span:not(.ki){font-size:10.5px!important;line-height:1.15}
.hero .kp>div.lk-hot{background:rgba(239,68,68,.9)!important;box-shadow:0 0 0 0 rgba(239,68,68,.6);animation:lkHot 2s infinite}
@keyframes lkHot{0%{box-shadow:0 0 0 0 rgba(255,255,255,.55)}70%{box-shadow:0 0 0 8px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}
.lk-on{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;overflow-x:auto;scrollbar-width:none;white-space:nowrap}
.lk-on::-webkit-scrollbar{display:none}
.lk-on .p{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.16);border-radius:999px;padding:3px 9px 3px 3px}
.lk-on .p i{width:20px;height:20px;border-radius:50%;background:#fff;color:#0B2A6F;font-style:normal;font-weight:800;font-size:10px;display:inline-flex;align-items:center;justify-content:center;position:relative}
.lk-on .p i::after{content:"";position:absolute;right:-1px;bottom:-1px;width:7px;height:7px;border-radius:50%;background:#22c55e;border:1.5px solid #0B2A6F}
.lk-on .p img{width:20px;height:20px;border-radius:50%;object-fit:cover}
/* ===== v2: living background + glass surfaces ===== */
html,body{background:linear-gradient(160deg,#D6E4FF 0%,#E8DCFF 36%,#D4F3E7 70%,#FFE9CF 100%) fixed!important}
#app{background:transparent!important}
#lkbg i{opacity:.7!important;filter:blur(50px)!important}
#lkbg i:nth-child(1){background:var(--lk1,#93B8FF)!important}
#lkbg i:nth-child(2){background:var(--lk2,#C4B5FD)!important}
#lkbg i:nth-child(3){background:var(--lk3,#99F6E4)!important}
#lkbg::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(11,42,111,.09) 1px,transparent 1.2px);background-size:18px 18px;mask-image:linear-gradient(180deg,rgba(0,0,0,.7),transparent 70%);-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.7),transparent 70%)}
#lkbg b{position:absolute;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.95),rgba(255,255,255,.15));box-shadow:0 0 0 1px rgba(255,255,255,.5) inset;opacity:0;animation:lkBub 18s linear infinite}
@keyframes lkBub{0%{transform:translateY(0) scale(.7);opacity:0}10%{opacity:.6}90%{opacity:.4}100%{transform:translateY(-105vh) scale(1.1);opacity:0}}
#lkbg em{position:absolute;top:18%;left:-60px;font-style:normal;font-size:22px;opacity:.35;animation:lkFly 28s linear infinite;filter:drop-shadow(0 4px 6px rgba(11,42,111,.25))}
@keyframes lkFly{0%{transform:translate(0,0) rotate(8deg)}50%{transform:translate(55vw,-6vh) rotate(-4deg)}100%{transform:translate(120vw,4vh) rotate(8deg)}}
body[data-lk="tasks"]{--lk1:#86EFAC;--lk2:#93C5FD;--lk3:#FDE68A}
body[data-lk="notif"]{--lk1:#FCD34D;--lk2:#F9A8D4;--lk3:#A5B4FC}
body[data-lk="crm"]{--lk1:#FDA4AF;--lk2:#FDBA74;--lk3:#A5B4FC}
body[data-lk="menu"]{--lk1:#C4B5FD;--lk2:#7DD3FC;--lk3:#F9A8D4}
.top{background:rgba(255,255,255,.72)!important;backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);border-bottom-color:rgba(255,255,255,.6)!important}
.tabbar{background:rgba(255,255,255,.82)!important;backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5);border-top:1px solid rgba(255,255,255,.7)!important;box-shadow:0 -6px 24px rgba(11,42,111,.08)}
.card{background:rgba(255,255,255,.86)!important;border-color:rgba(255,255,255,.9)!important;box-shadow:0 6px 20px rgba(11,42,111,.07);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.card.amb{background:rgba(255,248,236,.92)!important}
.tile{background:rgba(255,255,255,.8)!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.9)!important;box-shadow:0 8px 24px rgba(11,42,111,.08)!important}
.chip{background:rgba(255,255,255,.75)!important;box-shadow:0 2px 8px rgba(11,42,111,.06)}
.chip.on{background:linear-gradient(135deg,#1E6FE0,#0B2A6F)!important;color:#fff!important}
.hero{box-shadow:0 14px 30px rgba(11,42,111,.28)}
/* menu tiles: gradient glyph icons */
.tile .ic.lkm{background:var(--lkg)!important;box-shadow:0 8px 18px var(--lks),inset 0 -3px 0 rgba(0,0,0,.08)!important;position:relative;overflow:hidden}
.tile .ic.lkm svg{width:30px;height:30px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;overflow:visible;position:relative;z-index:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.15))}
.tile .ic.lkm::after{content:"";position:absolute;inset:-40%;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.45) 50%,transparent 60%);transform:translateX(-100%);animation:lkShine 5.5s ease-in-out infinite;animation-delay:var(--lkd,0s)}
.lk-tick{transform-box:fill-box;transform-origin:center;animation:lkTick 4s steps(12) infinite}
@keyframes lkTick{to{transform:rotate(360deg)}}
.lk-glow{animation:lkGlow 2.4s ease-in-out infinite}
@keyframes lkGlow{0%,100%{opacity:.5}50%{opacity:1}}
.lk-sway{transform-box:fill-box;transform-origin:50% 100%;animation:lkSway 3s ease-in-out infinite}
@keyframes lkSway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
.lk-pulse{transform-box:fill-box;transform-origin:center;animation:lkPulse 2s ease-in-out infinite}
@keyframes lkPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
</style>`;

const NAV = {
  home: '<svg viewBox="0 0 24 24"><path class="lk-roof" d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-5.5h4V21h3.5a1 1 0 0 0 1-1V9.5"/></svg>',
  notif: '<svg viewBox="0 0 24 24"><g class="lk-bell"><path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.8 1.8H4.2z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></g></svg>',
  tasks: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17.5" rx="2.6"/><path d="M9 4.2V3h6v1.2"/><path class="lk-chk" d="m8.5 12.8 2.4 2.4 4.6-5"/></svg>',
  crm: '<svg viewBox="0 0 24 24"><path d="M3 21h18"/><rect class="lk-b" x="4.5" y="11" width="3.6" height="8" rx="1"/><rect class="lk-b lk-b2" x="10.2" y="5" width="3.6" height="14" rx="1"/><rect class="lk-b lk-b3" x="15.9" y="8.5" width="3.6" height="10.5" rx="1"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><rect class="lk-sq" x="4" y="4" width="6.5" height="6.5" rx="2"/><rect class="lk-sq lk-sq2" x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect class="lk-sq lk-sq3" x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect class="lk-sq lk-sq4" x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/></svg>'
};
const W = 'rgba(255,255,255,.28)';
const QI = {
  chats: ['#2DD4BF', '#0284C7', '<svg viewBox="0 0 24 24"><path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6a3.5 3.5 0 0 1-3.5 3.5H10l-4.5 4v-4.3A3.5 3.5 0 0 1 4 12.5z" fill="' + W + '"/><circle class="lk-dot" cx="8.5" cy="9.6" r="1.25" fill="#fff" stroke="none"/><circle class="lk-dot lk-dot2" cx="12" cy="9.6" r="1.25" fill="#fff" stroke="none"/><circle class="lk-dot lk-dot3" cx="15.5" cy="9.6" r="1.25" fill="#fff" stroke="none"/></svg>'],
  notices: ['#FBBF24', '#F97316', '<svg viewBox="0 0 24 24"><path d="M3.5 10v4h3l7.5 4.5V5.5L6.5 10z" fill="' + W + '"/><path d="M6.5 14.2 8 20h2.2"/><path class="lk-w1" d="M17 9.3a3.8 3.8 0 0 1 0 5.4"/><path class="lk-w2" d="M19.6 6.7a7.6 7.6 0 0 1 0 10.6"/></svg>'],
  tasks: ['#34D399', '#059669', '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17.5" rx="2.6" fill="' + W + '"/><path d="M9 4.2V3h6v1.2"/><path class="lk-chk" d="m8.5 12.8 2.4 2.4 4.6-5"/></svg>'],
  team: ['#818CF8', '#6D28D9', '<svg viewBox="0 0 24 24"><g class="lk-h1"><circle cx="9" cy="8" r="3.2" fill="' + W + '"/></g><path d="M3.3 20.3a5.7 5.7 0 0 1 11.4 0"/><g class="lk-h2"><circle cx="16.8" cy="9" r="2.6"/></g><path d="M15.4 14.1a4.8 4.8 0 0 1 5.8 4.7"/></svg>'],
  crm: ['#FB7185', '#E11D48', '<svg viewBox="0 0 24 24"><path d="M3 21h18"/><rect class="lk-b" x="4.5" y="11" width="3.6" height="8" rx="1" fill="#fff"/><rect class="lk-b lk-b2" x="10.2" y="5" width="3.6" height="14" rx="1" fill="#fff"/><rect class="lk-b lk-b3" x="15.9" y="8.5" width="3.6" height="10.5" rx="1" fill="#fff"/></svg>'],
  lead: ['#FCD34D', '#EA580C', '<svg viewBox="0 0 24 24"><circle cx="10" cy="8" r="3.6" fill="' + W + '"/><path d="M3.5 20.5a6.5 6.5 0 0 1 13 0"/><g class="lk-pl"><path d="M19 7.5v7M15.5 11h7"/></g></svg>'],
  report: ['#C084FC', '#7C3AED', '<svg viewBox="0 0 24 24"><path d="M6 3h8.5L19 7.5V21H6z" fill="' + W + '"/><path d="M14.5 3v4.5H19"/><path class="lk-ln" d="M9 12h7"/><path class="lk-ln lk-ln2" d="M9 15.5h7"/><path class="lk-ln lk-ln3" d="M9 19h4.5"/></svg>'],
  profile: ['#F472B6', '#DB2777', '<svg viewBox="0 0 24 24"><circle cx="10" cy="8.5" r="4.3" fill="' + W + '"/><g class="lk-blink"><circle cx="8.4" cy="8" r=".75" fill="#fff" stroke="none"/><circle cx="11.6" cy="8" r=".75" fill="#fff" stroke="none"/></g><path d="M8.4 10.3c.9.8 2.3.8 3.2 0"/><path d="M3.2 21a6.8 6.8 0 0 1 10.6-5.6"/><g class="lk-pen"><path d="m15.2 21.3.7-2.8 4.8-4.8a1.5 1.5 0 0 1 2.1 2.1L18 20.6z" fill="#fff" stroke="#fff"/></g></svg>'],
  admin: ['#64748B', '#1E293B', '<svg viewBox="0 0 24 24"><path d="M12 2.8 4.8 5.9v5.6c0 4.5 3 8.5 7.2 9.7 4.2-1.2 7.2-5.2 7.2-9.7V5.9z" fill="' + W + '"/><path class="lk-chk" d="m8.8 12 2.3 2.3 4.2-4.4"/></svg>'],
  group: ['#FDBA74', '#F59E0B', '<svg viewBox="0 0 24 24"><circle cx="8" cy="8.5" r="3" fill="' + W + '"/><path d="M2.8 20a5.2 5.2 0 0 1 10.4 0"/><circle cx="14.5" cy="9" r="2.4"/><g class="lk-pl"><path d="M19.5 13.5v6M16.5 16.5h6"/></g></svg>']
};

const GW = 'rgba(255,255,255,.28)';
const G = {
  doc: ['#FB923C', '#DC2626', '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z" fill="' + GW + '"/><path class="lk-ln" d="M9 10h7"/><path class="lk-ln lk-ln2" d="M9 13.5h7"/><circle class="lk-pulse" cx="15" cy="18" r="2"/></svg>'],
  note: ['#FDE047', '#EAB308', '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="13" height="18" rx="2" fill="' + GW + '"/><path d="M8.5 3v18"/><path class="lk-ln" d="M11 8h4.5"/><path class="lk-ln lk-ln2" d="M11 11.5h4.5"/><g class="lk-pen"><path d="m16 20.5.6-2.4 3.9-3.9a1.3 1.3 0 0 1 1.8 1.8l-3.9 3.9z" fill="#fff"/></g></svg>'],
  trophy: ['#FCD34D', '#D97706', '<svg viewBox="0 0 24 24"><g class="lk-sway"><path d="M7 4h10v5a5 5 0 0 1-10 0z" fill="' + GW + '"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.2M17 6h2.5a2.5 2.5 0 0 1-2.6 3.2"/><path d="M12 14v3.5M8.5 21h7l-1-3.5h-5z"/></g><path class="lk-glow" d="M12 1.5v1M20 3l-.7.7M4 3l.7.7"/></svg>'],
  target: ['#F87171', '#BE123C', '<svg viewBox="0 0 24 24"><circle cx="11" cy="13" r="8" fill="' + GW + '"/><circle cx="11" cy="13" r="4.5"/><circle class="lk-pulse" cx="11" cy="13" r="1.3" fill="#fff"/><path d="M11 13 19 5M16 4.5V8h3.5"/></svg>'],
  chart: ['#60A5FA', '#4F46E5', '<svg viewBox="0 0 24 24"><path d="M3 21h18"/><rect class="lk-b" x="4.5" y="11" width="3.6" height="8" rx="1" fill="#fff"/><rect class="lk-b lk-b2" x="10.2" y="5" width="3.6" height="14" rx="1" fill="#fff"/><rect class="lk-b lk-b3" x="15.9" y="8.5" width="3.6" height="10.5" rx="1" fill="#fff"/></svg>'],
  clock: ['#22D3EE', '#0369A1', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="' + GW + '"/><path d="M12 7.5V12"/><path class="lk-tick" d="M12 12h4"/><path d="M9 2.5h6"/></svg>'],
  cal: ['#A78BFA', '#7C3AED', '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15.5" rx="2.5" fill="' + GW + '"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4"/><path class="lk-chk" d="m9 14.5 2 2 4-4"/></svg>'],
  mic: ['#34D399', '#0F766E', '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="' + GW + '"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6"/><path class="lk-w1" d="M3.5 9.5v3"/><path class="lk-w2" d="M20.5 9.5v3"/></svg>'],
  moon: ['#2DD4BF', '#115E59', '<svg viewBox="0 0 24 24"><path d="M16.5 15.8A7.5 7.5 0 0 1 9.2 4a8 8 0 1 0 10.3 10.6 7.4 7.4 0 0 1-3 1.2z" fill="' + GW + '"/><path class="lk-glow" d="m17.5 5 .6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="#fff"/></svg>'],
  medal: ['#F59E0B', '#B45309', '<svg viewBox="0 0 24 24"><path d="M8 3h3l1 5M16 3h-3l-1 5"/><g class="lk-sway"><circle cx="12" cy="15" r="6" fill="' + GW + '"/><path d="m12 12 .9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="#fff"/></g></svg>'],
  mega: ['#FBBF24', '#F97316', '<svg viewBox="0 0 24 24"><path d="M3.5 10v4h3l7.5 4.5V5.5L6.5 10z" fill="' + GW + '"/><path d="M6.5 14.2 8 20h2.2"/><path class="lk-w1" d="M17 9.3a3.8 3.8 0 0 1 0 5.4"/><path class="lk-w2" d="M19.6 6.7a7.6 7.6 0 0 1 0 10.6"/></svg>'],
  globe: ['#38BDF8', '#1D4ED8', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="' + GW + '"/><g class="lk-sway"><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/></g></svg>'],
  bell: ['#FB7185', '#E11D48', '<svg viewBox="0 0 24 24"><g class="lk-sway"><path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.8 1.8H4.2z" fill="' + GW + '"/><path d="M10 20.5a2 2 0 0 0 4 0"/></g></svg>'],
  dl: ['#4ADE80', '#15803D', '<svg viewBox="0 0 24 24"><path d="M6 3h8.5L19 7.5V21H6z" fill="' + GW + '"/><g class="lk-h1"><path d="M12.5 9v7M9.5 13l3 3 3-3"/></g></svg>'],
  build: ['#94A3B8', '#334155', '<svg viewBox="0 0 24 24"><path d="M4 21V7l8-4 8 4v14" fill="' + GW + '"/><path d="M3 21h18M9 21v-5h6v5"/><path class="lk-glow" d="M8.5 9.5h1M14.5 9.5h1M8.5 12.5h1M14.5 12.5h1"/></svg>'],
  alert: ['#FCA5A5', '#B91C1C', '<svg viewBox="0 0 24 24"><path d="M12 3 2.5 20h19z" fill="' + GW + '"/><path class="lk-pulse" d="M12 9.5v5"/><circle cx="12" cy="17.3" r=".9" fill="#fff"/></svg>'],
  approve: ['#86EFAC', '#16A34A', '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" fill="' + GW + '"/><path d="M2.8 20a6.2 6.2 0 0 1 11-3.9"/><path class="lk-chk" d="m15 17 2.2 2.2 4.3-4.5"/></svg>'],
  repeat: ['#7DD3FC', '#0284C7', '<svg viewBox="0 0 24 24"><g class="lk-tick" style="animation-duration:6s"><path d="M4 12a8 8 0 0 1 13.6-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.6 5.7L4 15.5"/><path d="M4 20v-4.5h4.5"/></g></svg>']
};
G.profile = QI.profile; G.team = QI.team; G.report = QI.report; G.shield = QI.admin; G.group = QI.group; G.chats = QI.chats; G.tasks = QI.tasks; G.crm = QI.crm;
const TILE = { 'm-sc': 'doc', 'x-cs': 'approve', 'm-notes': 'note', 'm-fame': 'trophy', 'm-aw': 'trophy', 'x-aw': 'trophy', 'm-tg': 'target', 'x-tg': 'target', 'm-tgt': 'chart', 'x-tr': 'chart', 'm-att': 'clock', 'x-att': 'clock', 'm-lv': 'cal', 'x-lv': 'cal', 'x-lvs': 'cal', 'm-mt': 'mic', 'x-mt': 'mic', 'm-sal': 'moon', 'x-sal': 'moon', 'm-dc': 'medal', 'm-dct': 'medal', 'x-dc': 'medal', 'm-notices': 'mega', 'x-nt': 'mega', 'm-edit': 'profile', 'm-lang': 'globe', 'm-push': 'bell', 'm-team': 'team', 'x-mb': 'team', 'm-rep': 'report', 'x-rp': 'report', 'm-adm': 'shield', 'x-ap': 'approve', 'm-grp': 'group', 'x-gr': 'group', 'x-df': 'dl', 'x-off': 'build', 'x-co': 'build', 'x-stuck': 'alert', 'x-pf': 'chart' };
function lkTiles() {
  document.querySelectorAll('.tile[id]').forEach((t, i) => {
    const ic = t.querySelector('.ic'); if (!ic || ic.classList.contains('lkm')) return;
    if (t.id === 'm-wa') { ic.classList.add('lkm'); ic.style.setProperty('--lkg', 'linear-gradient(140deg,#4ADE80,#128C4A)'); ic.style.setProperty('--lks', '#128C4A55'); ic.innerHTML = '<svg viewBox="0 0 32 32" style="width:32px;height:32px;stroke:none"><path fill="#fff" d="M16 4C9.4 4 4 9.4 4 16c0 2.1.6 4.2 1.6 6L4 28l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S22.6 4 16 4z"/><path fill="#16A34A" d="M22.6 19.2c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.4-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.4-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.4.4-.6.1-.2 0-.5 0-.6-.1-.2-.8-1.9-1-2.6-.3-.7-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2 2.9 1.2 3.5 1 4.1.9.6-.1 2-.8 2.3-1.7.3-.8.3-1.5.2-1.7-.1-.1-.3-.2-.6-.3z"/></svg>'; return; }
    const g = G[TILE[t.id]]; if (!g) return;
    ic.classList.add('lkm'); ic.style.setProperty('--lkg', 'linear-gradient(140deg,' + g[0] + ',' + g[1] + ')'); ic.style.setProperty('--lks', g[1] + '55'); ic.style.setProperty('--lkd', ((i % 6) * 0.5).toFixed(1) + 's');
    ic.innerHTML = g[2];
  });
}

function lkApply() {
  document.querySelectorAll('.tabbar .tb').forEach(b => {
    const k = b.dataset.t, ti = b.querySelector('.ti');
    if (!ti || ti.classList.contains('lk') || !NAV[k]) return;
    ti.classList.add('lk'); ti.innerHTML = NAV[k];
  });
  const wa = document.querySelector('.tabbar .tb[data-t="whatsapp"] .ti'); if (wa && !wa.classList.contains('lkw')) { wa.classList.add('lkw'); wa.style.cssText += ';width:46px;height:30px'; }
  document.querySelectorAll('.qi[data-q]').forEach((q, i) => {
    const ic = q.querySelector('.qic'), d = QI[q.dataset.q];
    if (!ic || !d || ic.classList.contains('lk')) return;
    ic.classList.add('lk'); ic.style.setProperty('--lkg', 'linear-gradient(140deg,' + d[0] + ',' + d[1] + ')'); ic.style.setProperty('--lks', d[1] + '55'); ic.style.setProperty('--lkd', (i * 0.07).toFixed(2) + 's');
    ic.innerHTML = d[2];
  });
  document.querySelectorAll('.tile .ic:not([data-lk])').forEach((ic, i) => { ic.setAttribute('data-lk', '1'); ic.style.setProperty('--lkd', ((i % 6) * 0.4).toFixed(1) + 's'); });
  const tab = (typeof ui !== 'undefined' && ui.tab) || 'home';
  if (document.body.dataset.lk !== tab) document.body.dataset.lk = tab;
  lkMoti();
  lkHero();
  lkTiles();
}

const MOTI = [['🚀', 'আজকের কাজ আজই — সময়মতো শেষ করুন!'], ['🏆', 'প্রতিটা শেষ করা টাস্ক আপনাকে সেরা হওয়ার দিকে নেয়'], ['💪', 'ছোট ছোট কাজই বড় সাফল্য আনে'], ['⏳', 'ডেডলাইনের আগে শেষ = পয়েন্ট সুরক্ষিত'], ['🌟', 'আপনার পরিশ্রমই MY TravelMate-এর শক্তি'], ['✅', 'একটা একটা করে টিক দিন — দিন শেষে সব সম্পন্ন!']];
let lkMi = 0, lkMt = null;
function lkMoti() {
  const tl = document.getElementById('tl');
  if (!tl || tl.querySelector('.lk-moti') || tl.querySelector('.spin')) return;
  lkMi = Math.floor(Math.random() * MOTI.length);
  tl.insertAdjacentHTML('afterbegin', '<div class="lk-moti" data-noi18n><span class="e">' + MOTI[lkMi][0] + '</span><span class="t">' + MOTI[lkMi][1] + '</span></div>');
  clearInterval(lkMt);
  lkMt = setInterval(() => {
    const m = document.querySelector('.lk-moti'); if (!m) { clearInterval(lkMt); return; }
    const t = m.querySelector('.t'), e = m.querySelector('.e'); t.style.opacity = 0;
    setTimeout(() => { lkMi = (lkMi + 1) % MOTI.length; e.textContent = MOTI[lkMi][0]; t.textContent = MOTI[lkMi][1]; t.style.opacity = 1; }, 400);
  }, 6000);
}


/* hero: tasks · important notifications · overdue (highlighted) + who is online by name */
let lkHT = null;
async function lkHero() {
  const kp = document.querySelector('.hero .kp'); if (!kp || kp.dataset.lk) return;
  kp.dataset.lk = '1';
  const d = [...kp.children];
  if (d[0]) d[0].style.display = 'none';            // unread chats → not needed here
  if (d[2]) d[2].style.display = 'none';            // online count → shown with names below
  if (d[1]) d[1].onclick = () => go('tasks');
  d[1] && d[1].insertAdjacentHTML('afterend', '<div id="lknf"><span class="ki">🔔</span><b id="lknfv">–</b><span>নতুন নোটিফিকেশন</span></div><div id="lkod"><span class="ki">⏰</span><b id="lkodv">–</b><span>সময় পার হওয়া টাস্ক</span></div>');
  document.getElementById('lknf').onclick = () => go('notif');
  document.getElementById('lkod').onclick = () => { try { taskFilter = 'overdue'; } catch (e) {} go('tasks'); };
  kp.insertAdjacentHTML('afterend', '<div class="lk-on" id="lkon"></div>');
  const fill = async () => {
    if (!document.getElementById('lknf')) { clearInterval(lkHT); return; }
    try { if (typeof refreshNotifCount === 'function') await refreshNotifCount(); } catch (e) {}
    const n = (typeof ui !== 'undefined' && ui.nfUnread) || 0;
    const nf = document.getElementById('lknf'); if (!nf) return;
    document.getElementById('lknfv').textContent = n; nf.classList.toggle('lk-hot', n > 0);
    try {
      let q = sb.from('tasks').select('id', { count: 'exact', head: true }).neq('status', 'completed').lt('due_date', new Date().toISOString());
      const team = (typeof isObserver === 'function' && isObserver()) || isAdmin();
      if (!team) q = q.eq('assigned_to', state.profile.id);
      const { count } = await q;
      const od = document.getElementById('lkod'); if (!od) return;
      document.getElementById('lkodv').textContent = count || 0; od.classList.toggle('lk-hot', (count || 0) > 0);
      od.querySelector('span:last-child').textContent = team ? 'টিমের দেরি টাস্ক' : 'সময় পার হওয়া টাস্ক';
    } catch (e) {}
    try { if (typeof loadPeople === 'function') await loadPeople(); } catch (e) {}
    const on = Object.values(ui.people || {}).filter(p => p.id !== state.profile.id && !p.observer && isOnline(p)).sort((a, b) => a.full_name.localeCompare(b.full_name));
    const box = document.getElementById('lkon'); if (!box) return;
    const ini = n => (n || '?').replace(/^(Md\.?|Mohammad|Muhammad)\s+/i, '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const first = n => (n || '').replace(/^(Md\.?|Mohammad|Muhammad)\s+/i, '').trim().split(/\s+/)[0];
    box.innerHTML = on.length ? '<span>🟢 অনলাইন:</span>' + on.map(p => '<span class="p">' + (p.avatar_url ? '<img src="' + esc(p.avatar_url) + '" alt="">' : '<i>' + esc(ini(p.full_name)) + '</i>') + esc(first(p.full_name)) + '</span>').join('') : '<span style="opacity:.8">⚪ এখন কেউ অনলাইনে নেই</span>';
  };
  fill(); clearInterval(lkHT); lkHT = setInterval(fill, 60000);
}

function lkInit() {
  if (!document.getElementById('lkcss')) document.head.insertAdjacentHTML('beforeend', LK_CSS);
  if (!document.getElementById('lkbg')) document.body.insertAdjacentHTML('afterbegin', '<div id="lkbg" aria-hidden="true"><i></i><i></i><i></i>' + [8, 22, 37, 55, 71, 86].map((l, i) => '<b style="left:' + l + '%;bottom:-30px;width:' + (10 + (i % 3) * 8) + 'px;height:' + (10 + (i % 3) * 8) + 'px;animation-delay:' + (i * 3) + 's"></b>').join('') + '<em>✈️</em></div><div id="lkfx" aria-hidden="true">' + ['✅', '⭐', '🏆', '💪', '🚀', '✨', '✅', '⭐'].map((s, i) => '<span style="left:' + (6 + i * 12) + '%;animation-delay:' + (i * 1.7).toFixed(1) + 's;font-size:' + (14 + (i % 3) * 5) + 'px">' + s + '</span>').join('') + '</div>');
  lkApply();
}
let lkQ = false;
new MutationObserver(muts => {
  for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1 && n.classList && n.classList.contains('shell')) { const v = n.querySelector('.view'); if (v) { v.classList.add('lk-in'); setTimeout(() => v.classList.remove('lk-in'), 600); } }
  if (lkQ) return; lkQ = true; requestAnimationFrame(() => { lkQ = false; lkApply(); });
}).observe(document.body, { childList: true, subtree: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lkInit); else lkInit();
}
