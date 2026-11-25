/* 🛠️ App problem reports (members → admin dashboard) + 👑 level card colours, Master card, level-up celebration */
{
/* ---------------- level / master card on the menu profile ---------------- */
const TIER_CSS = `<style id="tiercss">
#pf.mgpf.tier{position:relative;overflow:hidden}
#pf.mgpf.tier::after{content:"";position:absolute;inset:-60%;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.28) 50%,transparent 58%);transform:translateX(-70%);animation:tierShine 5s ease-in-out infinite;pointer-events:none}
@keyframes tierShine{0%,55%{transform:translateX(-70%)}100%{transform:translateX(70%)}}
#pf.tier-bronze{background:linear-gradient(135deg,#6b3a16,#b87333 55%,#e0a96d)!important}
#pf.tier-silver{background:linear-gradient(135deg,#374151,#8b95a5 55%,#d6dbe3)!important}
#pf.tier-gold{background:linear-gradient(135deg,#7a5a0c,#c9971c 50%,#f6d365)!important}
#pf.tier-platinum{background:linear-gradient(135deg,#1e3a5f,#5b7fa6 55%,#c7d7ea)!important}
#pf.tier-diamond{background:linear-gradient(135deg,#0c4a6e,#0ea5e9 55%,#67e8f9)!important}
#pf.tier-heroic{background:linear-gradient(135deg,#7f1d1d,#dc2626 55%,#f97316)!important}
#pf.tier *{text-shadow:0 1px 2px rgba(0,0,0,.25)}
#pf.tier-master{background:radial-gradient(120% 120% at 100% 0%,#3b2f0b 0%,transparent 55%),linear-gradient(140deg,#0b0b0f,#17151c 55%,#2a2108)!important;border:1.5px solid #d4af37!important;box-shadow:0 12px 30px rgba(212,175,55,.28)!important}
#pf.tier-master::after{background:linear-gradient(115deg,transparent 42%,rgba(246,211,101,.32) 50%,transparent 58%)!important}
#pf.tier-master .rt b{color:#F6D365!important}
#pf.tier-master .av{box-shadow:0 0 0 3px #d4af37!important}
#pf .mstr{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-size:11.5px;font-weight:800;letter-spacing:1.5px;color:#1a1405!important;text-shadow:none!important;background:linear-gradient(135deg,#f6d365,#d4af37);padding:3px 11px;border-radius:20px}
#pf .mstr-s{display:block;margin-top:5px;font-size:11.5px;color:#e9d9a6!important;opacity:.9}
.lvup{position:fixed;inset:0;z-index:90;background:rgba(7,14,36,.72);display:flex;align-items:center;justify-content:center;padding:24px;animation:lvIn .3s ease}
@keyframes lvIn{from{opacity:0}}
.lvup .bx{position:relative;width:100%;max-width:340px;background:#fff;border-radius:26px;padding:26px 20px 20px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.4);animation:lvPop .45s cubic-bezier(.3,1.5,.5,1)}
@keyframes lvPop{from{transform:scale(.6)}}
.lvup .em{font-size:66px;line-height:1}.lvup h2{font-size:21px;color:#0B2A6F;margin-top:10px}.lvup p{font-size:14px;color:#475569;margin-top:6px;line-height:1.6}
.lvup .btn{margin-top:16px}
.lvup i.cf{position:absolute;top:-10px;width:8px;height:14px;border-radius:2px;animation:cfFall 2.6s linear forwards}
@keyframes cfFall{to{transform:translateY(520px) rotate(540deg);opacity:0}}
</style>`;
const LVN = { bronze: '🥉 ব্রোঞ্জ', silver: '🥈 সিলভার', gold: '🥇 গোল্ড', platinum: '💠 প্লাটিনাম', diamond: '💎 ডায়মন্ড', heroic: '🔥 হিরোইক' };
function tierCard() {
  try {
    const pf = document.getElementById('pf'); if (!pf || !state.profile) return;
    if (!document.getElementById('tiercss')) document.head.insertAdjacentHTML('beforeend', TIER_CSS);
    pf.classList.add('mgpf', 'tier');
    if (state.profile.observer) {
      pf.classList.add('tier-master');
      const ln = pf.querySelector('.lvln'), bar = pf.querySelector('.lvbar');
      if (bar) bar.remove();
      const M = '<span class="mstr">👑 MASTER</span><small class="mstr-s">Yaqeen Group পরিচালনা · প্রিমিয়াম অ্যাকাউন্ট</small>';
      if (!pf.querySelector('.mstr')) { if (ln) ln.outerHTML = M; else { const rt = pf.querySelector('.rt'); if (rt) rt.insertAdjacentHTML('beforeend', M); } }
    } else {
      const L = (ui.levels && ui.levels[state.profile.id]) || {}; const k = L.level || 'bronze';
      pf.classList.add('tier-' + k);
    }
  } catch (e) {}
}
function celebrate(level) {
  if (!document.getElementById('tiercss')) document.head.insertAdjacentHTML('beforeend', TIER_CSS);
  const cols = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
  const d = document.createElement('div'); d.className = 'lvup';
  d.innerHTML = '<div class="bx">' + Array.from({ length: 28 }, (_, i) => '<i class="cf" style="left:' + (i * 3.6) + '%;background:' + cols[i % cols.length] + ';animation-delay:' + (i % 7) * 0.12 + 's"></i>').join('')
    + '<div class="em">🎉</div><h2>অভিনন্দন!</h2><p>আপনি এখন <b>' + (LVN[level] || level) + '</b> মেম্বার।<br>আপনার পরিশ্রমের ফল — এভাবেই এগিয়ে চলুন! 👏</p><button class="btn" id="lvok">ধন্যবাদ</button></div>';
  document.body.appendChild(d);
  try { window.ygSound && window.ygSound.play('notice'); } catch (e) {}
  d.querySelector('#lvok').onclick = () => d.remove();
}
let lvChecked = false;
async function checkLevelUp() {
  if (lvChecked || !state.profile || state.profile.observer) return; lvChecked = true;
  try { const { data } = await sb.rpc('yg_level_announce'); if (data && data.up) celebrate(data.level); } catch (e) {}
}
window.ygCelebrate = celebrate;

/* ---------------- problem reports ---------------- */
const CATS = ['🔗 লিংক জমা', '🕒 হাজিরা', '✅ টাস্ক', '🔔 নোটিফিকেশন/সাউন্ড', '📞 কল', '💬 চ্যাট', '🧩 অন্যান্য'];
const ST = { open: ['🟡', 'নতুন'], in_progress: ['🔵', 'কাজ চলছে'], solved: ['🟢', 'সমাধান হয়েছে'] };
const ICSS = '<style id="isscss">.iss-cats{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 2px}.iss-cats button{border:1.5px solid #dbe3ef;background:#fff;border-radius:16px;padding:6px 11px;font-size:13px}.iss-cats button.on{border-color:#1a73e8;background:#e8f0fe;color:#1a56db;font-weight:700}.iss{border:1px solid #e8eef6;border-radius:16px;padding:11px 12px;margin-top:8px;background:#fff}.iss .h{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;color:#64748b}.iss .h b{color:#0B2A6F;font-size:13.5px}.iss p{font-size:13.5px;margin-top:5px;line-height:1.55;white-space:pre-wrap}.iss .rp{margin-top:8px;background:#F0FDF4;border-radius:10px;padding:8px 10px;font-size:13px}.iss .act{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.iss .act button{border-radius:10px;padding:7px 10px;font-size:12.5px;font-weight:700;background:#EEF2FF;color:#3730A3}.iss .act button.ok{background:#DCFCE7;color:#166534}.iss .stars button{font-size:22px;background:none;padding:0 2px}.iss-tabs{display:flex;gap:6px;margin-top:8px}.iss-tabs button{flex:1;border-radius:12px;padding:8px;font-size:12.5px;font-weight:700;background:#F1F5F9;color:#475569}.iss-tabs button.on{background:#0B2A6F;color:#fff}.iss-badge{position:absolute;top:6px;right:8px;background:#E11D48;color:#fff;font-size:10.5px;font-weight:800;border-radius:9px;padding:1px 6px}</style>';
const is = () => { if (!document.getElementById('isscss')) document.head.insertAdjacentHTML('beforeend', ICSS); };
const when = t => { try { return new Date(t).toLocaleString('bn-BD', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } };
async function fileLink(path) { try { const { data } = await sb.storage.from('proofs').createSignedUrl(path, 900); return data && data.signedUrl; } catch (e) { return null; } }

function reportSheet() {
  is(); let cat = CATS[0];
  sheet('<h3>🛠️ অ্যাপের সমস্যা জানান</h3><p class="mut" style="margin:0">কী সমস্যা হচ্ছে লিখুন — অ্যাডমিন দেখে সমাধান করে আপনাকে জানাবেন।</p>'
    + '<label>কোন ধরনের সমস্যা</label><div class="iss-cats">' + CATS.map((c, i) => '<button type="button" data-c="' + i + '" class="' + (i ? '' : 'on') + '">' + c + '</button>').join('') + '</div>'
    + '<label>সমস্যাটা লিখুন</label><textarea class="in" id="isb" maxlength="2000" placeholder="যেমন: ২৬ নভেম্বরের টাস্কে ৫ নম্বর ঘরে লিংক দিলে এরর আসছে…"></textarea>'
    + '<label>স্ক্রিনশট (ঐচ্ছিক)</label><input class="in" id="isf" type="file" accept="image/*,application/pdf">'
    + '<button class="btn" id="iss">📨 পাঠান</button><div class="sec" style="margin-top:16px">আমার পাঠানো সমস্যা</div><div id="ismine"><div class="cen"><div class="spin dark"></div></div></div>',
  (el, close) => {
    el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { cat = CATS[+b.dataset.c]; el.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b)); });
    el.querySelector('#iss').onclick = async () => {
      const body = el.querySelector('#isb').value.trim(); if (body.length < 5) return toast('সমস্যাটা একটু লিখে বলুন');
      const btn = el.querySelector('#iss'); btn.disabled = true; btn.textContent = 'পাঠানো হচ্ছে…';
      let path = null, name = null; const f = el.querySelector('#isf').files[0];
      try {
        if (f) { if (f.size > 5 * 1024 * 1024) throw new Error('ফাইল ৫ MB-এর কম হতে হবে'); name = f.name; path = state.profile.id + '/issue-' + Date.now() + '-' + f.name.replace(/[^\w.\-]+/g, '_').slice(-60);
          const { error: ue } = await sb.storage.from('proofs').upload(path, f, { contentType: f.type || 'application/octet-stream' }); if (ue) throw ue; }
        const { error } = await sb.rpc('yg_issue_submit', { p_cat: cat, p_body: body, p_path: path, p_name: name }); if (error) throw error;
        close(); toast('✅ পাঠানো হয়েছে — অ্যাডমিন দেখে জানাবেন');
      } catch (e) { btn.disabled = false; btn.textContent = '📨 পাঠান'; toast(friendlyError(e)); }
    };
    loadMine(el.querySelector('#ismine'));
  });
}
async function loadMine(box) {
  const { data } = await sb.from('yg_issues').select('*').eq('user_id', state.profile.id).order('created_at', { ascending: false }).limit(20);
  if (!box) return;
  if (!data || !data.length) { box.innerHTML = '<div class="empty">এখনো কোনো সমস্যা পাঠাননি</div>'; return; }
  box.innerHTML = data.map(i => '<div class="iss"><div class="h"><b>' + esc(i.category) + '</b><span>' + ST[i.status][0] + ' ' + ST[i.status][1] + ' · ' + when(i.created_at) + '</span></div><p>' + esc(i.body) + '</p>'
    + (i.admin_reply ? '<div class="rp">💬 <b>অ্যাডমিনের জবাব:</b> ' + esc(i.admin_reply) + '</div>' : '')
    + (i.status === 'solved' ? (i.rating ? '<div class="h" style="margin-top:6px">আপনার রেটিং: ' + '⭐'.repeat(i.rating) + '</div>' : '<div class="act stars" data-r="' + i.id + '">সমাধানে খুশি? ' + [1, 2, 3, 4, 5].map(n => '<button data-n="' + n + '">☆</button>').join('') + '</div>') : '') + '</div>').join('');
  box.querySelectorAll('[data-r]').forEach(s => s.querySelectorAll('[data-n]').forEach(b => b.onclick = async () => {
    const { error } = await sb.rpc('yg_issue_rate', { p_id: s.dataset.r, p_rating: +b.dataset.n }); if (error) return toast(friendlyError(error)); toast('ধন্যবাদ! ⭐'); loadMine(box);
  }));
}
let admTab = 'open';
async function issueDashboard() {
  is(); await loadPeople();
  sheet('<h3>🛠️ সমস্যা ড্যাশবোর্ড</h3><div class="iss-tabs"><button data-t="open">🟡 নতুন</button><button data-t="in_progress">🔵 চলছে</button><button data-t="solved">🟢 সমাধান</button></div><div id="isadm"><div class="cen"><div class="spin dark"></div></div></div>', el => {
    const draw = async () => {
      el.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === admTab));
      const box = el.querySelector('#isadm');
      const { data, error } = await sb.from('yg_issues').select('*').eq('status', admTab).order('created_at', { ascending: false }).limit(60);
      if (error) { box.innerHTML = '<div class="empty">' + esc(friendlyError(error)) + '</div>'; return; }
      if (!data.length) { box.innerHTML = '<div class="empty">এখানে কিছু নেই 👍</div>'; return; }
      box.innerHTML = data.map(i => '<div class="iss" data-i="' + i.id + '"><div class="h"><b>' + esc((ui.people[i.user_id] || {}).full_name || 'সদস্য') + ' · ' + esc(i.category) + '</b><span>' + when(i.created_at) + '</span></div><p>' + esc(i.body) + '</p>'
        + (i.file_path ? '<div class="act"><button data-f="' + esc(i.file_path) + '">📎 স্ক্রিনশট দেখুন</button></div>' : '')
        + (i.admin_reply ? '<div class="rp">💬 ' + esc(i.admin_reply) + '</div>' : '') + (i.rating ? '<div class="h" style="margin-top:6px">রেটিং: ' + '⭐'.repeat(i.rating) + '</div>' : '')
        + (i.status !== 'solved' ? '<textarea class="in" placeholder="জবাব / কী সমাধান করলেন (ঐচ্ছিক)" style="min-height:60px;margin-top:8px"></textarea><div class="act">' + (i.status === 'open' ? '<button data-s="in_progress">🔧 কাজ চলছে</button>' : '') + '<button class="ok" data-s="solved">✅ সমাধান হয়েছে</button></div>' : '') + '</div>').join('');
      box.querySelectorAll('[data-f]').forEach(b => b.onclick = async () => { const u = await fileLink(b.dataset.f); if (!u) return toast('ফাইল খোলা যায়নি'); window.open(u, '_blank', 'noopener'); });
      box.querySelectorAll('[data-s]').forEach(b => b.onclick = async () => {
        const card = b.closest('[data-i]'), reply = (card.querySelector('textarea') || {}).value || '';
        if (b.dataset.s === 'solved' && reply.trim().length < 3 && !confirm('জবাব ছাড়াই সমাধান হয়েছে বলে জানাবেন?')) return;
        const { error } = await sb.rpc('yg_issue_update', { p_id: card.dataset.i, p_status: b.dataset.s, p_reply: reply });
        if (error) return toast(friendlyError(error)); toast('আপডেট হয়েছে ✓ সদস্যকে জানানো হলো'); draw(); badge();
      });
    };
    el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { admTab = b.dataset.t; draw(); });
    draw();
  });
}
async function badge() {
  try { if (!isAdmin()) return; const { count } = await sb.from('yg_issues').select('id', { count: 'exact', head: true }).neq('status', 'solved');
    const t = document.getElementById('m-issues'); if (!t) return; let b = t.querySelector('.iss-badge'); if (!count) { if (b) b.remove(); return; }
    if (!b) { t.style.position = 'relative'; t.insertAdjacentHTML('beforeend', '<span class="iss-badge"></span>'); b = t.querySelector('.iss-badge'); } b.textContent = count; } catch (e) {}
}
window.reportSheet = reportSheet; window.issueDashboard = issueDashboard;

const _vmIss = viewMenu;
viewMenu = function () {
  const r = _vmIss(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-issue')) {
    is();
    t.insertAdjacentHTML('beforeend', '<button class="tile" id="m-issue"><span class="ic" style="background:linear-gradient(140deg,#64748B,#334155);font-size:26px">🛠️</span><b>সমস্যা জানান</b><small>অ্যাপের সমস্যা অ্যাডমিনকে</small></button>'
      + (isAdmin() ? '<button class="tile" id="m-issues"><span class="ic" style="background:linear-gradient(140deg,#F43F5E,#BE123C);font-size:26px">🧰</span><b>সমস্যা ড্যাশবোর্ড</b><small>সবার রিপোর্ট</small></button>' : ''));
    document.getElementById('m-issue').onclick = reportSheet;
    const d = document.getElementById('m-issues'); if (d) { d.onclick = issueDashboard; badge(); }
  }
  setTimeout(tierCard, 50);
  return r;
};
const _vhIss = viewHome;
viewHome = async function () { const pr = _vhIss(); setTimeout(checkLevelUp, 3500); return pr; };
}
