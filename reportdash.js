/* 📊 Daily report dashboard (management) + questions on reports (members answer) */
{
const RD_CSS = '<style id="rdcss">'
+ '.rd-nav{display:flex;align-items:center;gap:8px;margin-top:6px}.rd-nav button{border-radius:12px;padding:8px 12px;background:#EEF2FF;color:#3730A3;font-weight:800}.rd-nav input{flex:1}'
+ '.rd-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.rd-sum div{background:#fff;border-radius:14px;padding:10px;text-align:center;box-shadow:0 4px 14px rgba(11,42,111,.06)}.rd-sum b{display:block;font-size:20px;color:#0B2A6F}.rd-sum small{font-size:11.5px;color:#64748b}'
+ '.rd-week{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px;background:#fff;border-radius:12px;overflow:hidden}.rd-week th{background:#0B2A6F;color:#fff;padding:6px 3px;font-weight:600}.rd-week td{padding:6px 3px;text-align:center;border-bottom:1px solid #eef2f6}.rd-week td:first-child{text-align:left;font-weight:600;white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis}'
+ '.rd-c{background:#fff;border-radius:16px;padding:12px;margin-top:10px;box-shadow:0 6px 18px rgba(11,42,111,.07)}.rd-h{display:flex;align-items:center;gap:10px}.rd-h b{color:#0B2A6F;font-size:14.5px}.rd-h small{display:block;color:#64748b;font-size:12px}'
+ '.rd-w{margin-top:8px;font-size:13.8px;line-height:1.6;white-space:pre-wrap}.rd-is{margin-top:8px;background:#FFFBEB;border-left:3px solid #F59E0B;border-radius:10px;padding:8px 10px;font-size:13px}'
+ '.rd-q{margin-top:8px;border-radius:12px;background:#F1F5F9;padding:8px 10px;font-size:13px;line-height:1.55}.rd-q .a{margin-top:6px;background:#ECFDF5;border-radius:10px;padding:6px 8px}.rd-q .p{margin-top:6px;color:#B45309;font-weight:700;font-size:12px}'
+ '.rd-act{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.rd-act button{border-radius:10px;padding:7px 11px;font-size:12.5px;font-weight:700;background:#EEF2FF;color:#3730A3}'
+ '.rd-miss{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;border-radius:12px;padding:8px 10px;margin-top:6px;font-size:13.5px}.rd-miss button{border-radius:10px;padding:6px 10px;font-size:12px;font-weight:700;background:#FEF2F2;color:#B91C1C}'
+ '.rd-my{background:#FFF7ED;border:1.5px solid #FDBA74;border-radius:16px;padding:12px;margin-bottom:12px}.rd-my h4{color:#9A3412;font-size:14.5px}'
+ '.rd-days{display:flex;gap:6px;overflow-x:auto;padding:8px 0 2px;scrollbar-width:none}.rd-days::-webkit-scrollbar{display:none}.rd-days button{flex:0 0 auto;border-radius:12px;padding:6px 9px;background:#fff;color:#0B2A6F;font-size:12px;font-weight:700;box-shadow:0 2px 8px rgba(11,42,111,.07);line-height:1.25;text-align:center}.rd-days button small{display:block;font-weight:600;color:#64748b;font-size:10.5px}.rd-days button.on{background:#0B2A6F;color:#fff}.rd-days button.on small{color:#cbd5e1}'
+ '.rd-week td[data-d]{cursor:pointer}.rd-week td.pn{cursor:pointer;color:#1D4ED8;text-decoration:underline dotted}.rd-hb{font-size:12px;font-weight:700;border-radius:10px;padding:6px 10px;background:#F0FDF4;color:#166534}'
+ '</style>';
const css = () => { if (!document.getElementById('rdcss')) document.head.insertAdjacentHTML('beforeend', RD_CSS); };
const boss = () => (typeof isMgr === 'function' && isMgr()) || (typeof isAdmin === 'function' && isAdmin()) || !!(state.profile && state.profile.observer);
const bn = n => Number(n).toLocaleString('bn-BD');
const addDay = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const tm = t => { try { return new Date(t).toLocaleTimeString('bn-BD', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } };
const dm = d => d.slice(8, 10) + '/' + d.slice(5, 7);
const qaHtml = (q, me) => '<div class="rd-q" data-q="' + q.id + '">❓ <b>' + esc(personName(q.asked_by)) + ':</b> ' + esc(q.question)
  + (q.answer ? '<div class="a">💬 <b>' + (me ? 'আপনার উত্তর' : 'উত্তর') + ':</b> ' + esc(q.answer) + '</div>' : (me ? '<textarea class="in" placeholder="উত্তর লিখুন…" style="min-height:56px;margin-top:6px"></textarea><button class="btn" data-ans="' + q.id + '" style="margin-top:6px;padding:9px">📨 উত্তর পাঠান</button>' : '<div class="p">⏳ উত্তরের অপেক্ষায়</div>')) + '</div>';

let rdDate = null;
async function dashboard(date) {
  css(); cleanupChannels(); await loadPeople();
  rdDate = date || rdDate || todayDhaka();
  $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>📊 ডেইলি রিপোর্ট ড্যাশবোর্ড</h1></div><div class="pad" style="padding-top:6px">'
    + '<div class="rd-nav"><button id="rdp">‹</button><input class="in" type="date" id="rdd" value="' + rdDate + '" style="margin:0"><button id="rdn">›</button></div>'
    + '<div class="rd-days" id="rddays">' + Array.from({ length: 14 }, (_, i) => addDay(todayDhaka(), -i)).map((d, i) => '<button data-day="' + d + '" class="' + (d === rdDate ? 'on' : '') + '">' + (i === 0 ? 'আজ' : i === 1 ? 'গতকাল' : new Date(d + 'T00:00:00').toLocaleDateString('bn-BD', { weekday: 'short' })) + '<small>' + dm(d) + '</small></button>').join('') + '</div>'
    + '<div id="rdb"><div class="cen"><div class="spin dark"></div></div></div></div>';
  document.getElementById('bk').onclick = () => go('menu');
  document.getElementById('rdp').onclick = () => dashboard(addDay(rdDate, -1));
  document.getElementById('rdn').onclick = () => dashboard(addDay(rdDate, 1));
  document.getElementById('rdd').onchange = e => dashboard(e.target.value);
  document.querySelectorAll('#rddays [data-day]').forEach(b => b.onclick = () => dashboard(b.dataset.day));
  const from7 = addDay(rdDate, -6);
  const [{ data: reps, error }, { data: wk }, { data: qa }] = await Promise.all([
    sb.from('daily_reports').select('*').eq('report_date', rdDate),
    sb.from('daily_reports').select('user_id,report_date').gte('report_date', from7).lte('report_date', rdDate),
    sb.from('yg_report_qa').select('*').eq('report_date', rdDate).order('created_at')
  ]);
  const box = document.getElementById('rdb'); if (!box) return;
  if (error) { box.innerHTML = '<div class="msg err">' + esc(friendlyError(error)) + '</div>'; return; }
  const people = Object.values(ui.people).filter(p => p.daily_report !== false && !p.observer && p.status !== 'inactive').sort((a, b) => a.full_name.localeCompare(b.full_name));
  const got = new Map((reps || []).map(r => [r.user_id, r]));
  const missing = people.filter(p => !got.has(p.id));
  const withIssue = (reps || []).filter(r => r.issues).length, pend = (qa || []).filter(q => !q.answer).length;
  const days = Array.from({ length: 7 }, (_, i) => addDay(from7, i)), has = new Set((wk || []).map(r => r.user_id + '|' + r.report_date));
  const qBy = {}; (qa || []).forEach(q => (qBy[q.report_user] = qBy[q.report_user] || []).push(q));
  box.innerHTML = '<div class="rd-sum"><div><b>' + bn(got.size) + '/' + bn(people.length) + '</b><small>জমা দিয়েছে</small></div><div><b>' + bn(withIssue) + '</b><small>সমস্যা উল্লেখ</small></div><div><b>' + bn(pend) + '</b><small>উত্তর বাকি</small></div></div>'
    + '<div class="sec">🗓️ গত ৭ দিন</div><table class="rd-week"><tr><th>সদস্য</th>' + days.map(d => '<th>' + dm(d) + '</th>').join('') + '</tr>'
    + people.map(p => '<tr><td class="pn" data-hist="' + p.id + '">' + esc(p.full_name.split(' ').slice(0, 2).join(' ')) + '</td>' + days.map(d => '<td data-d="' + d + '">' + (has.has(p.id + '|' + d) ? '✅' : (d > todayDhaka() ? '·' : '❌')) + '</td>').join('') + '</tr>').join('') + '</table>'
    + (missing.length ? '<div class="sec">⏳ এখনো জমা দেননি (' + bn(missing.length) + ')</div>' + missing.map(p => '<div class="rd-miss"><span>' + esc(p.full_name) + '</span>' + (rdDate === todayDhaka() ? '<button data-nudge="' + p.id + '">🔔 মনে করিয়ে দিন</button>' : '') + '</div>').join('') : '')
    + '<div class="sec">📝 জমা দেওয়া রিপোর্ট</div>' + ((reps || []).sort((a, b) => (personName(a.user_id)).localeCompare(personName(b.user_id))).map(r => '<div class="rd-c" data-u="' + r.user_id + '"><div class="rd-h">' + avatar(personName(r.user_id), r.user_id, 40) + '<div><b>' + esc(personName(r.user_id)) + '</b><small>' + (r.updated_at || r.created_at ? 'জমা: ' + tm(r.updated_at || r.created_at) : '') + (r.leads_count != null ? ' · লিড: ' + bn(r.leads_count) : '') + '</small></div></div>'
      + '<div class="rd-w">' + linkify(r.work_done || '') + '</div>' + (r.issues ? '<div class="rd-is">⚠️ <b>সমস্যা/সাহায্য:</b> ' + linkify(r.issues) + '</div>' : '') + (r.attachment_link ? '<div style="margin-top:6px;font-size:13px">' + linkify(r.attachment_link) + '</div>' : '')
      + (qBy[r.user_id] || []).map(q => qaHtml(q, false)).join('') + '<div class="rd-act"><button data-ask="' + r.user_id + '">❓ প্রশ্ন করুন</button><button data-hist="' + r.user_id + '">🗂️ আগের রিপোর্ট</button></div></div>').join('') || '<div class="empty">এই দিনে কোনো রিপোর্ট জমা হয়নি</div>');
  box.querySelectorAll('[data-ask]').forEach(b => b.onclick = () => {
    const u = b.dataset.ask;
    sheet('<h3>❓ ' + esc(personName(u)) + '-কে প্রশ্ন</h3><p class="mut" style="margin:0">' + dm(rdDate) + '-এর রিপোর্ট নিয়ে। উত্তর দিলে আপনি নোটিফিকেশন পাবেন।</p><textarea class="in" id="rdqq" maxlength="1500" placeholder="যেমন: ৩টা ফলো-আপের মধ্যে কয়জন আগ্রহী? কোন ভিসা ফাইল আটকে আছে কেন?"></textarea><button class="btn" id="rdqs">📨 প্রশ্ন পাঠান</button>', (el, close) => {
      el.querySelector('#rdqs').onclick = async () => {
        const q = el.querySelector('#rdqq').value.trim(); if (q.length < 3) return toast('প্রশ্নটা লিখুন');
        const { error: e } = await sb.rpc('yg_report_ask', { p_user: u, p_date: rdDate, p_q: q }); if (e) return toast(friendlyError(e));
        close(); toast('✅ প্রশ্ন পাঠানো হয়েছে'); dashboard(rdDate);
      };
    });
  });
  box.querySelectorAll('[data-hist]').forEach(b => b.onclick = () => rdHistory(b.dataset.hist));
  box.querySelectorAll('.rd-week td[data-d]').forEach(c => c.onclick = () => dashboard(c.dataset.d));
  box.querySelectorAll('[data-nudge]').forEach(b => b.onclick = async () => {
    b.disabled = true; const { error: e } = await sb.rpc('yg_report_nudge', { p_user: b.dataset.nudge, p_date: rdDate });
    if (e) { b.disabled = false; return toast(friendlyError(e)); } b.textContent = '✓ জানানো হয়েছে';
  });
}
async function rdHistory(uid) {
  sheet('<h3>🗂️ ' + esc(personName(uid)) + ' — আগের রিপোর্ট</h3><div id="rdhist"><div class="cen"><div class="spin dark"></div></div></div>', async el => {
    const { data, error } = await sb.from('daily_reports').select('*').eq('user_id', uid).order('report_date', { ascending: false }).limit(60);
    const box = el.querySelector('#rdhist'); if (!box) return;
    if (error) { box.innerHTML = '<div class="msg err">' + esc(friendlyError(error)) + '</div>'; return; }
    box.innerHTML = (data || []).map(r => '<div class="rd-c"><div class="rd-h"><b>📅 ' + new Date(r.report_date + 'T00:00:00').toLocaleDateString('bn-BD', { weekday: 'short', day: 'numeric', month: 'short' }) + '</b>' + (r.leads_count != null ? '<small style="margin-left:auto">Leads: ' + bn(r.leads_count) + '</small>' : '') + '</div><div class="rd-w">' + linkify(r.work_done || '') + '</div>' + (r.issues ? '<div class="rd-is">⚠️ ' + linkify(r.issues) + '</div>' : '') + (r.attachment_link ? '<div style="margin-top:6px;font-size:13px">' + linkify(r.attachment_link) + '</div>' : '') + '</div>').join('') || '<div class="empty">কোনো রিপোর্ট নেই</div>';
  });
}
window.ygReportHistory = rdHistory;
window.ygReportDash = dashboard;
teamReports = function (date) { return dashboard(date); };

/* member side: questions on my reports, shown at the top of the Daily report page */
const _vrQa = viewReport;
viewReport = async function () {
  const r = await _vrQa.apply(this, arguments);
  try {
    const mine = document.getElementById('mine');
    if (mine) {
      const { data: all } = await sb.from('daily_reports').select('*').eq('user_id', state.profile.id).order('report_date', { ascending: false }).limit(30);
      if (all && all.length && typeof reportCard === 'function') { mine.innerHTML = all.map(x => reportCard(x)).join(''); const sec = mine.previousElementSibling; if (sec && sec.classList.contains('sec')) sec.textContent = 'আমার আগের রিপোর্ট (' + bn(all.length) + ')'; }
    }
  } catch (e) {}
  try {
    css();
    const { data: qa } = await sb.from('yg_report_qa').select('*').eq('report_user', state.profile.id).order('created_at', { ascending: false }).limit(15);
    if (!qa || !qa.length) return r;
    await loadPeople();
    const open = qa.filter(q => !q.answer), done = qa.filter(q => q.answer).slice(0, 5);
    const pad = document.querySelector('#app .pad, .pad'); if (!pad) return r;
    const html = '<div class="rd-my" id="rdmy"><h4>❓ ম্যানেজমেন্টের প্রশ্ন' + (open.length ? ' — ' + bn(open.length) + 'টার উত্তর বাকি' : '') + '</h4>'
      + open.concat(done).map(q => '<div style="margin-top:6px;font-size:12px;color:#64748b">' + dm(q.report_date) + '-এর রিপোর্ট</div>' + qaHtml(q, true)).join('') + '</div>';
    const old = document.getElementById('rdmy'); if (old) old.remove();
    pad.insertAdjacentHTML('afterbegin', html);
    document.querySelectorAll('#rdmy [data-ans]').forEach(b => b.onclick = async () => {
      const ta = b.parentElement.querySelector('textarea'), a = (ta.value || '').trim(); if (a.length < 2) return toast('উত্তর লিখুন');
      b.disabled = true; const { error } = await sb.rpc('yg_report_answer', { p_id: b.dataset.ans, p_a: a }); b.disabled = false;
      if (error) return toast(friendlyError(error)); toast('✅ উত্তর পাঠানো হয়েছে'); viewReport();
    });
  } catch (e) {}
  return r;
};

/* deep links: ?rq= (member: question) · ?rd= (boss: dashboard date) · ?rp=1 (member: report page) */
const _hdlRd = handleDeepLink;
handleDeepLink = function (href) {
  try {
    const u = new URL(href || location.href, location.href);
    const rq = u.searchParams.get('rq'), rd = u.searchParams.get('rd'), rp = u.searchParams.get('rp');
    if (rq || rd || rp) {
      if (location.search) history.replaceState(null, '', location.pathname);
      if (rd && boss()) return dashboard(rd);
      return viewReport();
    }
  } catch (e) {}
  return _hdlRd.apply(this, arguments);
};

/* menu tile for management */
const _vmRd = viewMenu;
viewMenu = function () {
  const r = _vmRd.apply(this, arguments);
  const t = document.querySelector('.tiles');
  if (t && boss() && !document.getElementById('m-rdash')) {
    t.insertAdjacentHTML('beforeend', '<button class="tile" id="m-rdash"><span class="ic" style="background:linear-gradient(140deg,#14B8A6,#0F766E);font-size:26px">📊</span><b>রিপোর্ট ড্যাশবোর্ড</b><small>সবার ডেইলি রিপোর্ট</small></button>');
    document.getElementById('m-rdash').onclick = () => dashboard(todayDhaka());
  }
  return r;
};
}
