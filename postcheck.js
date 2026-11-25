/* ✨ AI post check: banner + caption review before posting (Gemini via Edge Function post-check) */
{
const PC_CSS = '<style id="pccss">'
+ '.pc-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0 12px 10px 46px;background:#fff}'
+ '.pc-row button{border-radius:14px;padding:5px 11px;font-size:12px;font-weight:700;background:linear-gradient(135deg,#EEF2FF,#F5F3FF);color:#4338CA;border:1px solid #C7D2FE}'
+ '.pc-row small{font-size:11.5px;font-weight:700}.pc-ok{color:#15803D}.pc-fix{color:#B45309}.pc-redo{color:#B91C1C}'
+ '.pc-prev{margin-top:8px;max-height:180px;border-radius:12px;display:block;max-width:100%;border:1px solid #e2e8f0}'
+ '.pc-res{margin-top:14px}.pc-score{display:flex;align-items:center;gap:14px;padding:14px;border-radius:18px;color:#fff}'
+ '.pc-score b{font-size:34px;line-height:1}.pc-score span{font-size:14px;font-weight:600;line-height:1.5}'
+ '.pc-score.ok{background:linear-gradient(135deg,#15803D,#22C55E)}.pc-score.fix{background:linear-gradient(135deg,#B45309,#F59E0B)}.pc-score.redo{background:linear-gradient(135deg,#B91C1C,#F43F5E)}'
+ '.pc-sec{margin-top:12px;font-size:13px;font-weight:800;color:#0B2A6F}.pc-li{margin-top:6px;padding:8px 10px;border-radius:10px;font-size:13.2px;line-height:1.55;background:#F8FAFC}'
+ '.pc-li.high{background:#FEF2F2;border-left:3px solid #DC2626}.pc-li.medium{background:#FFFBEB;border-left:3px solid #F59E0B}.pc-li.low{background:#F1F5F9;border-left:3px solid #94A3B8}.pc-li.good{background:#F0FDF4;border-left:3px solid #16A34A}'
+ '.pc-cap{white-space:pre-wrap;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:12px;padding:10px;font-size:13.5px;line-height:1.6;margin-top:6px}'
+ '.pc-t{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid #e8eef6;border-radius:14px;margin-top:8px;background:#fff;width:100%;text-align:left}'
+ '.pc-t b{font-size:13.5px;color:#0B2A6F}.pc-t small{display:block;color:#64748b;font-size:12px;margin-top:2px}.pc-t .sc{font-size:18px;font-weight:800}'
+ '</style>';
const css = () => { if (!document.getElementById('pccss')) document.head.insertAdjacentHTML('beforeend', PC_CSS); };
const VL = { ok: ['✅', 'পোস্ট করা যাবে'], fix: ['🟠', 'একটু ঠিক করতে হবে'], redo: ['❌', 'আবার বানাতে হবে'] };
const bn = n => Number(n).toLocaleString('bn-BD');
const cleanTopic = l => String(l || '').replace(/^[^·]*·\s*/, '').trim() || String(l || '');

async function shrink(file) {
  try {
    const img = await createImageBitmap(file); const m = 1280, s = Math.min(1, m / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(b => r(b || file), 'image/jpeg', 0.86));
  } catch (e) { return file; }
}
function resultHtml(r) {
  const v = VL[r.verdict] || VL.fix;
  const li = (a, cls) => (a || []).map(x => '<div class="pc-li ' + (cls || x.severity || 'low') + '">' + (x.where ? (x.where === 'banner' ? '🖼️ ' : '✍️ ') : '') + esc(typeof x === 'string' ? x : x.text) + '</div>').join('');
  return '<div class="pc-res"><div class="pc-score ' + r.verdict + '"><b>' + bn(r.score) + '/১০</b><span>' + v[0] + ' ' + v[1] + '<br>' + esc(r.summary || '') + '</span></div>'
    + '<div class="mut" style="font-size:12px;margin-top:6px">' + (r.banner_match === false ? '🖼️ ব্যানার টপিকের সাথে মিলছে না · ' : r.banner_match ? '🖼️ ব্যানার টপিকের সাথে মিলছে · ' : '') + (r.caption_match === false ? '✍️ ক্যাপশন টপিকের সাথে মিলছে না' : '✍️ ক্যাপশন টপিকের সাথে মিলছে') + '</div>'
    + (r.issues && r.issues.length ? '<div class="pc-sec">⚠️ যা ঠিক করতে হবে</div>' + li(r.issues) : '')
    + (r.spelling && r.spelling.length ? '<div class="pc-sec">🔤 বানান</div>' + r.spelling.map(s => '<div class="pc-li medium"><s>' + esc(s.wrong) + '</s> → <b>' + esc(s.right) + '</b></div>').join('') : '')
    + (r.banner_tips && r.banner_tips.length ? '<div class="pc-sec">🎨 ব্যানারের জন্য পরামর্শ</div>' + li(r.banner_tips, 'low') : '')
    + (r.good && r.good.length ? '<div class="pc-sec">👍 যা ভালো হয়েছে</div>' + li(r.good, 'good') : '')
    + (r.improved_caption ? '<div class="pc-sec">✍️ সাজেস্ট করা ক্যাপশন</div><div class="pc-cap" id="pccap">' + esc(r.improved_caption) + '</div><button class="btn ghost" id="pccp" style="margin-top:8px">📋 ক্যাপশন কপি করুন</button>' : '')
    + '<div class="mut" style="font-size:11px;margin-top:10px">AI-এর পরামর্শ — ১০০% নিখুঁত না। দাম/ভাড়া সবসময় আসল পোর্টাল থেকে মিলিয়ে নিন।</div></div>';
}
function bindCopy(el, r) { const b = el.querySelector('#pccp'); if (b) b.onclick = async () => { try { await navigator.clipboard.writeText(r.improved_caption); toast('কপি হয়েছে ✓'); } catch (e) { toast('কপি করা যায়নি'); } }; }

function checkSheet(o) {
  css(); o = o || {};
  sheet('<h3>✨ পোস্টের আগে AI চেক</h3><p class="mut" style="margin:0">ব্যানার আর ক্যাপশন দিন — AI দেখে বলবে সব ঠিক আছে কিনা, কী বদলাতে হবে।</p>'
    + '<label>টপিক</label>' + (o.topic ? '<div class="pc-li" style="margin-top:4px"><b>' + esc(o.topic) + '</b></div>' : '<input class="in" id="pctp" maxlength="300" placeholder="পোস্টের টপিক লিখুন">')
    + '<label>ব্যানার / পোস্টার</label><input class="in" id="pcimg" type="file" accept="image/*"><img id="pcpv" class="pc-prev" hidden>'
    + '<label>ক্যাপশন</label><textarea class="in" id="pccp0" maxlength="4000" style="min-height:110px" placeholder="যে ক্যাপশন দেবেন সেটা এখানে পেস্ট করুন"></textarea>'
    + '<button class="btn" id="pcgo">✨ চেক করুন</button><div id="pcout"></div>', (el) => {
    const fi = el.querySelector('#pcimg'), pv = el.querySelector('#pcpv');
    fi.onchange = () => { const f = fi.files[0]; if (f) { pv.src = URL.createObjectURL(f); pv.hidden = false; } };
    el.querySelector('#pcgo').onclick = async () => {
      const topic = o.topic || (el.querySelector('#pctp').value || '').trim(), caption = el.querySelector('#pccp0').value.trim(), f = fi.files[0];
      if (!topic) return toast('টপিক লিখুন');
      if (!f && caption.length < 10) return toast('ব্যানার অথবা ক্যাপশন দিন');
      const btn = el.querySelector('#pcgo'), out = el.querySelector('#pcout'); btn.disabled = true; btn.textContent = '⏳ AI দেখছে… (১০–২০ সেকেন্ড)'; out.innerHTML = '';
      try {
        let path = null;
        if (f) { const b = await shrink(f); path = state.profile.id + '/check-' + Date.now() + '.jpg';
          const { error: ue } = await sb.storage.from('proofs').upload(path, b, { contentType: 'image/jpeg' }); if (ue) throw ue; }
        const { data, error } = await sb.functions.invoke('post-check', { body: { topic, caption, image_path: path, task_id: o.task_id || null, item_id: o.item_id || null, title: o.title || '' } });
        if (error) { let m = ''; try { const j = await error.context.json(); m = j.error === 'NO_KEY' ? 'AI চেক এখনো চালু হয়নি (অ্যাডমিন key বসাননি)' : j.error; } catch (e) {} throw new Error(m || 'চেক করা যায়নি, একটু পরে আবার চেষ্টা করুন'); }
        out.innerHTML = resultHtml(data); bindCopy(out, data);
        btn.textContent = '🔁 ঠিক করে আবার চেক করুন'; o.onDone && o.onDone(data);
        setTimeout(() => out.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      } catch (e) { toast(e.message || friendlyError(e)); btn.textContent = '✨ চেক করুন'; }
      btn.disabled = false;
    };
  });
}
window.ygPostCheck = checkSheet;

/* checklist decoration: a "✨ চেক" row under each post item */
let pcCache = null;
async function decorate(taskId) {
  const box = document.getElementById('ckbox'); if (!box || box.dataset.pc) return; box.dataset.pc = '1';
  if (!pcCache || pcCache.task !== taskId) {
    const { data: t } = await sb.from('tasks').select('id,title,assigned_to').eq('id', taskId).single();
    if (!t || !/পোস্ট|post/i.test(t.title)) { pcCache = { task: taskId, skip: true }; return; }
    const { data: items } = await sb.from('yg_task_items').select('id,label,need_link,done').eq('task_id', taskId).order('pos');
    const ids = (items || []).map(i => i.id);
    const { data: ch } = ids.length ? await sb.from('yg_post_checks').select('item_id,score,verdict,created_at').in('item_id', ids).order('created_at', { ascending: false }) : { data: [] };
    const last = {}; (ch || []).forEach(c => { if (!last[c.item_id]) last[c.item_id] = c; });
    pcCache = { task: taskId, t, items: items || [], last };
  }
  if (pcCache.skip || !document.body.contains(box)) return;
  css();
  const mine = pcCache.t.assigned_to === state.profile.id;
  pcCache.items.filter(i => i.need_link).forEach(i => {
    const b = box.querySelector('[data-ck="' + i.id + '"]'); if (!b) return;
    const c = pcCache.last[i.id], done = b.classList.contains('on');
    if (!c && (!mine || done)) { if (isMgr() && done) b.insertAdjacentHTML('afterend', '<div class="pc-row"><small class="pc-fix">⚪ AI চেক করা হয়নি</small></div>'); return; }
    b.insertAdjacentHTML('afterend', '<div class="pc-row">' + (mine && !done ? '<button data-pc="' + i.id + '">✨ পোস্টের আগে চেক</button>' : '')
      + (c ? '<small class="pc-' + c.verdict + '">' + VL[c.verdict][0] + ' শেষ চেক: ' + bn(c.score) + '/১০</small>' : '') + '</div>');
  });
  box.querySelectorAll('[data-pc]').forEach(btn => btn.onclick = e => {
    e.stopPropagation(); const it = pcCache.items.find(x => x.id === btn.dataset.pc);
    checkSheet({ topic: cleanTopic(it.label), item_id: it.id, task_id: taskId, title: pcCache.t.title, onDone: r => { pcCache.last[it.id] = { score: r.score, verdict: r.verdict }; const bx = document.getElementById('ckbox'); if (bx) { bx.querySelectorAll('.pc-row').forEach(x => x.remove()); delete bx.dataset.pc; decorate(taskId); } } });
  });
}
let pcTimer = null;
const _vtPc = viewTask;
viewTask = async function (id) {
  const r = await _vtPc(id); pcCache = null;
  clearInterval(pcTimer);
  pcTimer = setInterval(() => { const b = document.getElementById('ckbox'); if (!b) { if (!document.getElementById('ss')) clearInterval(pcTimer); return; } if (!b.dataset.pc) decorate(id); }, 800);
  return r;
};

/* admin report: today's checks + done post items without a check */
async function report() {
  css(); await loadPeople();
  const from = new Date(); from.setHours(0, 0, 0, 0);
  sheet('<h3>📋 পোস্ট চেক রিপোর্ট (আজ)</h3><div id="pcrp"><div class="cen"><div class="spin dark"></div></div></div>', async el => {
    const box = el.querySelector('#pcrp');
    const { data: ch, error } = await sb.from('yg_post_checks').select('*').gte('created_at', from.toISOString()).order('score', { ascending: true }).limit(300);
    if (error) { box.innerHTML = '<div class="empty">' + esc(friendlyError(error)) + '</div>'; return; }
    const { data: done } = await sb.from('yg_task_items').select('id,label,task_id,done_at').eq('need_link', true).eq('done', true).gte('done_at', from.toISOString()).limit(500);
    const checked = new Set((ch || []).map(c => c.item_id).filter(Boolean));
    const tids = [...new Set((done || []).map(d => d.task_id))];
    const { data: ts } = tids.length ? await sb.from('tasks').select('id,title,assigned_to').in('id', tids) : { data: [] };
    const tm = {}; (ts || []).forEach(t => tm[t.id] = t);
    const miss = (done || []).filter(d => !checked.has(d.id) && tm[d.task_id] && /পোস্ট|post/i.test(tm[d.task_id].title));
    const per = {}; (ch || []).forEach(c => { const p = per[c.user_id] = per[c.user_id] || { n: 0, s: 0 }; p.n++; p.s += c.score; });
    const nm = id => esc((ui.people[id] || {}).full_name || 'সদস্য');
    box.innerHTML = '<div class="pc-sec">👥 সদস্য অনুযায়ী</div>' + (Object.keys(per).length ? Object.entries(per).map(([u, p]) => '<div class="pc-li">' + nm(u) + ' — ' + bn(p.n) + 'টা চেক · গড় স্কোর <b>' + (p.s / p.n).toFixed(1) + '</b></div>').join('') : '<div class="empty">আজ কেউ চেক করেনি</div>')
      + '<div class="pc-sec">🧾 সব চেক (কম স্কোর আগে)</div>' + (ch || []).map((c, i) => '<button class="pc-t" data-x="' + i + '"><span><b>' + nm(c.user_id) + '</b><small>' + esc(c.topic || '') + '</small></span><span class="sc pc-' + c.verdict + '">' + bn(c.score) + '</span></button>').join('')
      + '<div class="pc-sec">⚪ চেক ছাড়াই পোস্ট করেছে (' + bn(miss.length) + ')</div>' + (miss.length ? miss.map(d => '<div class="pc-li low">' + nm(tm[d.task_id].assigned_to) + ' — ' + esc(cleanTopic(d.label)) + '</div>').join('') : '<div class="mut" style="font-size:12.5px;margin-top:6px">সবাই চেক করে পোস্ট দিয়েছে 👍</div>');
    box.querySelectorAll('[data-x]').forEach(b => b.onclick = async () => {
      const c = ch[+b.dataset.x]; let img = '';
      if (c.image_path) { try { const { data } = await sb.storage.from('proofs').createSignedUrl(c.image_path, 900); if (data) img = '<img class="pc-prev" src="' + data.signedUrl + '">'; } catch (e) {} }
      sheet('<h3>' + nm(c.user_id) + '</h3><div class="pc-li"><b>' + esc(c.topic || '') + '</b></div>' + img + (c.caption ? '<div class="pc-sec">ক্যাপশন (মেম্বারের)</div><div class="pc-cap">' + esc(c.caption) + '</div>' : '') + resultHtml(c.result || c), el2 => bindCopy(el2, c.result || {}));
    });
  });
}
window.ygPostReport = report;

const _vmPc = viewMenu;
viewMenu = function () {
  const r = _vmPc(); const t = document.querySelector('.tiles');
  if (t && !document.getElementById('m-pchk')) {
    t.insertAdjacentHTML('beforeend', '<button class="tile" id="m-pchk"><span class="ic" style="background:linear-gradient(140deg,#8B5CF6,#4F46E5);font-size:26px">✨</span><b>পোস্ট চেক</b><small>ব্যানার+ক্যাপশন AI যাচাই</small></button>'
      + (isAdmin() ? '<button class="tile" id="m-pchks"><span class="ic" style="background:linear-gradient(140deg,#0EA5E9,#0369A1);font-size:26px">📋</span><b>পোস্ট চেক রিপোর্ট</b><small>আজ কে কেমন করল</small></button>' : ''));
    document.getElementById('m-pchk').onclick = () => checkSheet({});
    const d = document.getElementById('m-pchks'); if (d) d.onclick = report;
  }
  return r;
};
}
