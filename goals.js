/* 🎯 live company sales targets on home — admins log achievements, everyone sees progress */
{
const GL_CSS = '<style id="glcss">.gl{position:relative;margin:0 0 12px;border-radius:18px;background:rgba(255,255,255,.95);border:1.5px solid #FCA5A5;box-shadow:0 10px 26px rgba(220,38,38,.16);overflow:hidden;color:#1f2937}.gl h3{margin:0;padding:10px 14px;font-size:14px;display:flex;justify-content:space-between;align-items:center;gap:8px;color:#fff;background:linear-gradient(120deg,#B91C1C,#DC2626 50%,#F97316);background-size:200% 200%;animation:glGr 6s ease infinite}@keyframes glGr{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}.gl h3 small{font-size:11px;font-weight:800;background:#fff;color:#B91C1C;padding:2px 9px;border-radius:999px;white-space:nowrap;animation:glPu 1.8s ease-in-out infinite}@keyframes glPu{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}.gl-in{padding:8px 14px 12px}.gl-g{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px 14px}.gl-r{margin-top:6px}.gl-l{font-size:12px;line-height:1.35;min-width:0}.gl-l b{display:block;font-weight:700;color:#0B2A6F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gl-l span{display:block;font-size:11px;font-weight:600;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gl-l span em{font-style:normal;color:#DC2626;font-weight:800}.gl-b{height:8px;border-radius:99px;background:#FEE2E2;margin-top:4px;overflow:hidden}.gl-b i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#DC2626,#F97316);width:0;transition:width 1.2s cubic-bezier(.2,.9,.3,1)}.gl-b i.done{background:linear-gradient(90deg,#16A34A,#22C55E)}.gl-p{margin-top:10px;padding-top:9px;border-top:1.5px dashed #FECACA}.gl-p h4{font-size:12.5px;display:flex;justify-content:space-between;color:#B91C1C}.gl-p h4 small{font-size:11px;color:#DC2626;font-weight:700}.gl-a{display:flex;gap:8px;margin-top:10px}.gl-a button{flex:1;background:linear-gradient(135deg,#DC2626,#F97316);color:#fff;font-weight:700;font-size:12px;border-radius:11px;padding:8px}.gl-a button.gh{background:#FEF2F2;color:#B91C1C}</style>';
const bnN = n => Number(n || 0).toLocaleString('en-IN').replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
const fmt = (n, u) => u === '৳' ? '৳' + bnN(n) : bnN(n) + (u ? ' ' + u : '');
const todayBD = () => todayDhaka();
const daysLeft = end => Math.max(0, Math.round((Date.parse(end + 'T23:59:59+06:00') - Date.now()) / 86400000));
let glData = null;
async function glLoad() {
  const { data: goals } = await sb.from('yg_goals').select('*').eq('active', true).order('sort');
  const g = goals || []; if (!g.length) return { goals: [], logs: [] };
  const from = g.map(x => x.start_date).sort()[0];
  const { data: logs } = await sb.from('yg_goal_logs').select('*').gte('day', from).order('created_at', { ascending: false }).limit(2000);
  return (glData = { goals: g, logs: logs || [] });
}
const achieved = (goal, logs) => {
  const t = todayBD();
  return logs.filter(l => l.metric === goal.metric && (goal.period === 'daily' ? l.day === t : (l.day >= goal.start_date && l.day <= goal.end_date))).reduce((a, l) => a + Number(l.amount || 0), 0);
};
function row(goal, logs) {
  const a = achieved(goal, logs), t = Number(goal.target), pct = Math.min(100, t ? a / t * 100 : 0), left = Math.max(0, t - a);
  return '<div class="gl-r"><div class="gl-l"><b>' + esc(goal.label) + '</b><span>' + fmt(a, goal.unit) + ' / ' + fmt(t, goal.unit) + (left > 0 ? ' · <em>বাকি ' + fmt(left, goal.unit) + '</em>' : ' · 🎉 পূরণ!') + '</span></div><div class="gl-b"><i data-w="' + pct.toFixed(1) + '"' + (pct >= 100 ? ' class="done"' : '') + '></i></div></div>';
}
async function glHome() {
  try {
    if (!state.profile || document.getElementById('hgl')) return;
    const pad = document.querySelector('.hero') && document.querySelector('.hero').nextElementSibling; if (!pad) return;
    if (!document.getElementById('glcss')) document.head.insertAdjacentHTML('beforeend', GL_CSS);
    pad.insertAdjacentHTML('afterbegin', '<div class="gl" id="hgl" data-noi18n><h3>🎯 কোম্পানির টার্গেট<small>লোড হচ্ছে…</small></h3></div>');
    const { goals, logs } = await glLoad();
    const box = document.getElementById('hgl'); if (!box) return;
    if (!goals.length) { box.remove(); return; }
    const main = goals.filter(g => g.grp === 'main'), ph = goals.filter(g => g.grp !== 'main');
    const mEnd = main.length ? main[0].end_date : null, pEnd = ph.length ? ph[0].end_date : null;
    const endTxt = d => { const [, m, dd] = d.split('-').map(Number); return bnN(dd) + ' ' + ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'][m - 1]; };
    box.innerHTML = '<h3>🎯 ' + (mEnd ? endTxt(mEnd) + ' পর্যন্ত টার্গেট' : 'কোম্পানির টার্গেট') + (mEnd ? '<small>⏳ ' + bnN(daysLeft(mEnd)) + ' দিন বাকি</small>' : '') + '</h3><div class="gl-in">'
      + '<div class="gl-g">' + main.map(g => row(g, logs)).join('') + '</div>'
      + (ph.length ? '<div class="gl-p"><h4><span>🚀 প্রথম ১০ দিনের টার্গেট</span><small>' + (daysLeft(pEnd) ? '⏳ ' + bnN(daysLeft(pEnd)) + ' দিন বাকি' : 'সময় শেষ') + '</small></h4><div class="gl-g">' + ph.map(g => row(g, logs)).join('') + '</div></div>' : '')
      + (isAdmin() ? '<div class="gl-a"><button id="gladd">＋ অর্জন যোগ করুন</button><button class="gh" id="glhis">🧾 হিসাব / এডিট</button></div>' : '') + '</div>';
    requestAnimationFrame(() => setTimeout(() => box.querySelectorAll('.gl-b i').forEach(i => i.style.width = i.dataset.w + '%'), 60));
    const ad = document.getElementById('gladd'); if (ad) ad.onclick = glAdd;
    const hs = document.getElementById('glhis'); if (hs) hs.onclick = glHistory;
  } catch (e) { const b = document.getElementById('hgl'); if (b) b.remove(); }
}
const METRICS = [['student', '🎓 স্টুডেন্ট (জন)'], ['visa', '🛂 ভিসা (টি)'], ['ticket', '✈️ এয়ার টিকিট (টি)'], ['pakulla', '🏪 পাকুল্লা অফিসের সেল (৳)']];
function glAdd() {
  sheet('<h3>＋ অর্জন যোগ করুন</h3><label>কোনটা</label><select class="in" id="glm">' + METRICS.map(m => '<option value="' + m[0] + '">' + m[1] + '</option>').join('') + '</select>'
    + '<label>কতটা (সংখ্যা বা টাকা)</label><input class="in" id="gla" type="number" inputmode="decimal" placeholder="যেমন ১ বা ২৫০০">'
    + '<label>তারিখ</label><input class="in" id="gld" type="date" value="' + todayBD() + '">'
    + '<label>নোট (ঐচ্ছিক — ক্লায়েন্টের নাম ইত্যাদি)</label><input class="in" id="gln" maxlength="200">'
    + '<button class="btn" id="glok">যোগ করুন</button>', (el, close) => {
    el.querySelector('#glok').onclick = async () => {
      const amount = Number(el.querySelector('#gla').value);
      if (!amount || amount < 0) return toast('সঠিক সংখ্যা দিন');
      const { error } = await sb.from('yg_goal_logs').insert({ metric: el.querySelector('#glm').value, amount, day: el.querySelector('#gld').value || todayBD(), note: el.querySelector('#gln').value.trim() || null });
      if (error) return toast(friendlyError(error));
      close(); toast('যোগ হয়েছে ✓ টার্গেট আপডেট হলো'); const b = document.getElementById('hgl'); if (b) b.remove(); glHome();
    };
  });
}
async function glHistory() {
  const { goals, logs } = await glLoad(); await loadPeople();
  const ml = k => (METRICS.find(m => m[0] === k) || [k, k])[1];
  sheet('<h3>🧾 অর্জনের হিসাব</h3>' + (logs.length ? logs.slice(0, 60).map(l => '<div class="card" style="margin-top:6px;padding:9px 12px;display:flex;justify-content:space-between;gap:8px;align-items:center"><span style="font-size:13px"><b>' + ml(l.metric) + '</b> +' + bnN(l.amount) + '<small style="display:block;color:#64748b">' + esc(l.day) + (l.note ? ' · ' + esc(l.note) : '') + ' · ' + esc((ui.people[l.created_by] || {}).full_name || '') + '</small></span><button class="btn sm ghost" data-del="' + l.id + '" style="margin:0">🗑️</button></div>').join('') : '<div class="empty">এখনো কিছু যোগ হয়নি</div>')
    + '<div class="sec" style="margin-top:14px">🎯 টার্গেট এডিট</div>' + goals.map(g => '<div class="card" style="margin-top:6px;padding:9px 12px"><b style="font-size:13px">' + esc(g.label) + ' <small style="color:#64748b">(' + (g.grp === 'main' ? 'মূল' : '১০ দিন') + (g.period === 'daily' ? ', দৈনিক' : '') + ')</small></b><div class="two" style="margin-top:6px"><input class="in" data-gt="' + g.id + '" type="number" value="' + g.target + '" style="margin-top:0"><input class="in" data-ge="' + g.id + '" type="date" value="' + g.end_date + '" style="margin-top:0"></div></div>').join('')
    + '<button class="btn" id="glsv">টার্গেট সেভ করুন</button>', (el, close) => {
    el.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (!confirm('এই এন্ট্রি মুছে ফেলবেন?')) return; const { error } = await sb.from('yg_goal_logs').delete().eq('id', b.dataset.del); if (error) return toast(friendlyError(error)); b.closest('.card').remove(); toast('মুছে ফেলা হয়েছে'); });
    el.querySelector('#glsv').onclick = async () => {
      for (const g of goals) {
        const t = Number(el.querySelector('[data-gt="' + g.id + '"]').value), e = el.querySelector('[data-ge="' + g.id + '"]').value;
        if (t !== Number(g.target) || e !== g.end_date) { const { error } = await sb.from('yg_goals').update({ target: t, end_date: e }).eq('id', g.id); if (error) return toast(friendlyError(error)); }
      }
      close(); toast('সেভ হয়েছে ✓'); const b = document.getElementById('hgl'); if (b) b.remove(); glHome();
    };
  });
}
const _vhGl = viewHome;
viewHome = async function () { const pr = _vhGl(); setTimeout(glHome, 800); return pr; };
if (document.querySelector('.qgrid')) setTimeout(glHome, 800);
}
