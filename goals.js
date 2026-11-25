/* 🎯 live company sales targets on home — admins log achievements, everyone sees progress */
{
const GL_CSS = '<style id="glcss">.gl{position:relative;margin:0 0 12px;border-radius:22px;background:linear-gradient(180deg,#FFF5F6 0%,#fff 34%);border:1.5px solid #FCA5A5;box-shadow:0 10px 26px rgba(220,38,38,.13);overflow:hidden;color:#0f1d3a;padding:14px 14px 13px}.gl-h{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:700;color:#B91C1C}.gl-h svg{width:18px;height:18px;flex-shrink:0}.gl-h small{margin-left:auto;font-size:11.5px;font-weight:600;color:#64748b}.gl-top{display:flex;align-items:center;gap:12px;margin-top:8px}.gl-d b{font-size:34px;font-weight:800;color:#DC2626;line-height:1;font-family:Inter,system-ui,sans-serif}.gl-d b span{font-size:15px;margin-left:4px}.gl-d p{font-size:12px;color:#64748b;margin-top:3px}.gl-ring{margin-left:auto;width:70px;height:70px;position:relative;flex-shrink:0}.gl-ring svg{width:70px;height:70px;transform:rotate(-90deg)}.gl-ring circle{fill:none;stroke-width:7}.gl-ring .bg{stroke:#FDE2E7}.gl-ring .fg{stroke:#DC2626;stroke-linecap:round;stroke-dasharray:188.5;stroke-dashoffset:188.5;transition:stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)}.gl-ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13.5px;font-weight:800;color:#0B2A6F}.gl-c{font-size:11.5px;color:#64748b;margin-top:6px}.gl-m{display:flex;align-items:center;gap:10px;margin-top:11px}.gl-ic{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.gl-ic svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.gl-mb{flex:1;min-width:0}.gl-mt{display:flex;justify-content:space-between;gap:6px;font-size:13px}.gl-mt b{font-weight:600;color:#0f1d3a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gl-mt span{font-size:12px;color:#475569;white-space:nowrap}.gl-mt span em{font-style:normal;font-size:11px;color:#94a3b8;margin-left:4px}.gl-b{height:6px;border-radius:99px;background:#EEF2F7;margin-top:5px;overflow:hidden}.gl-b i{display:block;height:100%;border-radius:99px;width:0;transition:width 1.2s cubic-bezier(.2,.9,.3,1)}.gl-s{margin-top:13px;padding-top:11px;border-top:1.5px dashed #FBC4CC}.gl-sh{display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:#0f1d3a}.gl-sh span{font-size:11.5px;font-weight:500;color:#64748b}.gl-seg{display:grid;gap:4px;margin-top:7px}.gl-seg i{height:5px;border-radius:4px;background:#E5E7EB}.gl-seg i.on{background:#DC2626}.gl-seg i.past{background:#FCA5A5}.gl-bx{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.gl-x{border-radius:14px;padding:9px 10px;background:#F8FAFC;border:1px solid #E8EEF6;min-width:0}.gl-x small{display:block;font-size:11.5px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gl-x b{display:block;font-size:16px;font-weight:800;color:#0f1d3a;font-family:Inter,system-ui,sans-serif}.gl-x em{font-style:normal;font-size:11px;font-weight:700;color:#DC2626}.gl-x.ok{background:#ECFDF5;border-color:#A7F3D0}.gl-x.ok em{color:#16A34A}.gl-a{display:flex;gap:8px;margin-top:12px}.gl-a button{flex:1;background:linear-gradient(135deg,#DC2626,#BE123C);color:#fff;font-weight:700;font-size:13px;border-radius:13px;padding:10px;box-shadow:0 6px 14px rgba(220,38,38,.22)}.gl-a button.gh{background:#fff;color:#B91C1C;border:1.5px solid #FBCFE8;box-shadow:none}</style>';
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
const MET_ICON = {
  student: ['#EEF2FF', '#4F46E5', '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1 3 3 6 3s6-2 6-3v-5"/>'],
  visa: ['#ECFEFF', '#0891B2', '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 17h6"/>'],
  ticket: ['#FFF7ED', '#EA580C', '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>'],
  pakulla: ['#F0FDF4', '#16A34A', '<path d="M3 9 5 4h14l2 5M4 9v11h16V9M3 9h18M9 20v-6h6v6"/>']
};
const pctOf = (a, t) => t ? a / t * 100 : 0;
const bnD = x => String(x).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
const bnP = p => bnN(Math.round(p)) + '%';
function row(goal, logs) {
  const a = achieved(goal, logs), t = Number(goal.target), p = pctOf(a, t), ic = MET_ICON[goal.metric] || ['#F1F5F9', '#0B2A6F', '<circle cx="12" cy="12" r="8"/>'];
  return '<div class="gl-m"><div class="gl-ic" style="background:' + ic[0] + ';color:' + ic[1] + '"><svg viewBox="0 0 24 24">' + ic[2] + '</svg></div><div class="gl-mb"><div class="gl-mt"><b>' + esc(goal.label.replace(/^\S+\s/, '')) + '</b><span>' + fmt(a, goal.unit) + ' / ' + fmt(t, goal.unit) + '<em>' + bnP(p) + '</em></span></div><div class="gl-b"><i data-w="' + Math.min(100, Math.max(p, p > 0 ? 2 : 1.5)).toFixed(1) + '" style="background:' + (p >= 100 ? '#16A34A' : ic[1]) + '"></i></div></div></div>';
}
async function glHome() {
  try {
    if (!state.profile || document.getElementById('hgl')) return;
    const pad = document.querySelector('.hero') && document.querySelector('.hero').nextElementSibling; if (!pad) return;
    if (!document.getElementById('glcss')) document.head.insertAdjacentHTML('beforeend', GL_CSS);
    pad.insertAdjacentHTML('afterbegin', '<div class="gl" id="hgl" data-noi18n><div class="gl-h">🎯 টার্গেট<small>লোড হচ্ছে…</small></div></div>');
    const { goals, logs } = await glLoad();
    const box = document.getElementById('hgl'); if (!box) return;
    if (!goals.length) { box.remove(); return; }
    const t0 = todayBD(), stages = [...new Set(goals.filter(g => g.grp !== 'main').map(g => g.grp))].sort();
    const cur = stages.find(k => goals.some(g => g.grp === k && t0 >= g.start_date && t0 <= g.end_date)) || stages.filter(k => goals.some(g => g.grp === k && g.start_date <= t0)).pop() || stages[0];
    const stN = stages.indexOf(cur) + 1;
    const main = goals.filter(g => g.grp === 'main'), ph = goals.filter(g => g.grp === cur);
    const mEnd = main.length ? main[0].end_date : null, pEnd = ph.length ? ph[0].end_date : null;
    const endTxt = d => { const [, m, dd] = d.split('-').map(Number); return bnN(dd) + ' ' + ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'][m - 1]; };
    const MON = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const tot = main.filter(g => g.period !== 'daily'), sa = tot.reduce((x, g) => x + achieved(g, logs), 0), st = tot.reduce((x, g) => x + Number(g.target), 0), cp = pctOf(sa, st);
    const dl = mEnd ? daysLeft(mEnd) : 0;
    box.innerHTML = '<div class="gl-h"><svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="#DC2626"/></svg>Mission ' + (mEnd ? MON[Number(mEnd.slice(5, 7)) - 1] : 'Target') + (mEnd ? '<small>' + endTxt(mEnd) + ' পর্যন্ত</small>' : '') + '</div>'
      + '<div class="gl-top"><div class="gl-d"><b>' + bnN(dl) + '<span>দিন</span></b><p>টার্গেট পূরণের সময় বাকি</p></div><div class="gl-ring"><svg viewBox="0 0 70 70"><circle class="bg" cx="35" cy="35" r="30"/><circle class="fg" cx="35" cy="35" r="30" data-p="' + Math.min(100, cp).toFixed(1) + '"/></svg><b>' + bnN(cp.toFixed(1)) + '%</b></div></div>'
      + (tot.length ? '<div class="gl-c">সম্মিলিত অগ্রগতি' + (tot.length < main.length ? ' (দৈনিক টার্গেট বাদে)' : '') + ': ' + bnN(sa) + ' / ' + bnN(st) + '</div>' : '')
      + main.map(g => row(g, logs)).join('')
      + (ph.length ? '<div class="gl-s"><div class="gl-sh">Stage ' + bnD(String(stN).padStart(2, '0')) + ' / ' + bnD(String(stages.length).padStart(2, '0')) + '<span>' + endTxt(ph[0].start_date) + ' – ' + endTxt(pEnd) + (daysLeft(pEnd) ? ' · ' + bnN(daysLeft(pEnd)) + ' দিন বাকি' : ' · সময় শেষ') + '</span></div>'
        + '<div class="gl-seg" style="grid-template-columns:repeat(' + stages.length + ',1fr)">' + stages.map((k, i) => '<i class="' + (i + 1 === stN ? 'on' : i + 1 < stN ? 'past' : '') + '"></i>').join('') + '</div>'
        + '<div class="gl-bx">' + ph.map(g => { const a = achieved(g, logs), t = Number(g.target), p = pctOf(a, t); return '<div class="gl-x' + (p >= 100 ? ' ok' : '') + '"><small>' + esc(g.label.replace(/^\S+\s/, '')) + '</small><b>' + fmt(a, g.unit) + '/' + fmt(t, g.unit) + '</b><em>' + bnP(p) + ' অর্জন' + (p >= 100 ? ' ✓' : '') + '</em></div>'; }).join('') + '</div></div>' : '')
      + (isAdmin() ? '<div class="gl-a"><button id="gladd">＋ অর্জন যোগ করুন</button><button class="gh" id="glhis">🧾 রিপোর্ট / এডিট</button></div>' : '');
    requestAnimationFrame(() => setTimeout(() => {
      box.querySelectorAll('.gl-b i').forEach(i => i.style.width = i.dataset.w + '%');
      const fg = box.querySelector('.gl-ring .fg'); if (fg) fg.style.strokeDashoffset = 188.5 * (1 - Number(fg.dataset.p) / 100);
    }, 60));
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
    + '<div class="sec" style="margin-top:14px">🎯 টার্গেট এডিট</div>' + goals.map(g => '<div class="card" style="margin-top:6px;padding:9px 12px"><b style="font-size:13px">' + esc(g.label) + ' <small style="color:#64748b">(' + (g.grp === 'main' ? 'মূল' : 'স্টেজ ' + bnN(g.grp.replace('stage', '')) + ' · ' + g.start_date.slice(5) + '→' + g.end_date.slice(5)) + (g.period === 'daily' ? ', দৈনিক' : '') + ')</small></b><div class="two" style="margin-top:6px"><input class="in" data-gt="' + g.id + '" type="number" value="' + g.target + '" style="margin-top:0"><input class="in" data-ge="' + g.id + '" type="date" value="' + g.end_date + '" style="margin-top:0"></div></div>').join('')
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

/* 🏠 home: profile button on the hero (top-right) + section heading before the app icons */
function homeExtras() {
  try {
    const hero = document.querySelector('.hero');
    if (hero && state.profile && !document.getElementById('hpf')) {
      if (!document.getElementById('hpfcss')) document.head.insertAdjacentHTML('beforeend', '<style id="hpfcss">#hpf{position:absolute;top:12px;right:14px;z-index:3;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:24px;padding:3px 10px 3px 3px;color:#fff;font-size:11.5px;font-weight:600;backdrop-filter:blur(6px)}#hpf .av{box-shadow:0 0 0 2px rgba(255,255,255,.7)}#hpf span{max-width:86px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style>');
      const nm = state.profile.full_name || '';
      hero.insertAdjacentHTML('beforeend', '<button id="hpf" title="আমার প্রোফাইল" data-noi18n>' + avatar(nm, state.profile.id, 30) + '<span>' + esc(nm.split(' ').slice(-1)[0] || 'প্রোফাইল') + '</span></button>');
      document.getElementById('hpf').onclick = e => { e.stopPropagation(); renderProfile(); };
    }
    const g = document.querySelector('.qgrid');
    if (g && !document.getElementById('hqw')) g.insertAdjacentHTML('beforebegin', '<div class="hsec" id="hqw">⚡ Quick Workspace</div>');
  } catch (e) {}
}
const _vhGl = viewHome;
viewHome = async function () { const pr = _vhGl(); setTimeout(glHome, 800); setTimeout(homeExtras, 900); return pr; };
if (document.querySelector('.qgrid')) { setTimeout(glHome, 800); setTimeout(homeExtras, 900); }
}
