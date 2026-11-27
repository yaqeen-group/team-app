/* ✏️ admins can edit a task's checklist topics (label, time), remove or add items — the member gets a notification */
{
const boss = () => (typeof isMgr === 'function' && isMgr()) || !!(state.profile && state.profile.observer);
let curTask = null;
const hm = ts => { try { return new Date(ts).toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: false }); } catch (e) { return ''; } };
const dayOf = ts => { try { return new Date(ts).toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' }); } catch (e) { return todayDhaka(); } };

const _vt = viewTask;
viewTask = async function (id) { curTask = id; const r = await _vt.apply(this, arguments); setTimeout(deco, 400); setTimeout(deco, 1500); return r; };

function deco() {
  if (!boss() || !curTask) return;
  const box = document.getElementById('ckbox'); if (!box || box.querySelector('.ck-ed')) return;
  const h = box.querySelector('.ck-h'); if (!h) return;
  h.insertAdjacentHTML('beforeend', '<button class="ck-ed" style="margin-left:8px;border-radius:10px;padding:5px 10px;font-size:12.5px;font-weight:700;background:#EEF2FF;color:#3730A3">✏️ এডিট</button>');
  h.querySelector('.ck-ed').onclick = e => { e.stopPropagation(); editor(curTask); };
}
new MutationObserver(() => { if (document.getElementById('ckbox')) deco(); }).observe(document.body, { childList: true, subtree: true });

async function editor(taskId) {
  const { data: items, error } = await sb.from('yg_task_items').select('*').eq('task_id', taskId).order('pos');
  if (error) return toast(friendlyError(error));
  const row = i => '<div class="tie" data-id="' + (i.id || '') + '" style="background:#F8FAFC;border-radius:12px;padding:8px;margin-top:8px' + (i.done ? ';opacity:.75' : '') + '">'
    + '<textarea class="in tl" maxlength="300" style="min-height:52px;margin:0">' + esc(i.label || '') + '</textarea>'
    + '<div style="display:flex;gap:8px;align-items:center;margin-top:6px;font-size:12.5px"><span>⏰</span><input class="in tt" type="time" value="' + (i.due_at ? hm(i.due_at) : '') + '" style="margin:0;flex:0 0 120px"><label style="display:flex;align-items:center;gap:4px;margin:0"><input type="checkbox" class="tn"' + (i.need_link !== false ? ' checked' : '') + '> লিংক লাগবে</label>'
    + (i.done ? '<span style="color:#16a34a">✅ সম্পন্ন</span>' : '') + '<button class="tdel" style="margin-left:auto;border-radius:9px;padding:5px 9px;background:#FEF2F2;color:#B91C1C;font-weight:700">🗑️</button></div></div>';
  const baseDay = (items.find(i => i.due_at) || {}).due_at;
  sheet('<h3>✏️ চেকলিস্ট এডিট</h3><p class="mut" style="margin:0;font-size:12.5px">টপিক, সময় বদলান, মুছুন বা নতুন যোগ করুন। সেভ করলে সদস্য নোটিফিকেশন পাবেন।</p><div id="tieL">' + items.map(row).join('') + '</div>'
    + '<button class="btn ghost" id="tieAdd" style="margin-top:10px">➕ নতুন আইটেম</button><button class="btn" id="tieSave">💾 সেভ করুন</button>', (el, close) => {
    const L = el.querySelector('#tieL');
    const bindDel = () => L.querySelectorAll('.tdel').forEach(b => b.onclick = () => { const r = b.closest('.tie'); if (r.dataset.id) { r.dataset.del = '1'; r.style.display = 'none'; } else r.remove(); });
    bindDel();
    el.querySelector('#tieAdd').onclick = () => { L.insertAdjacentHTML('beforeend', row({ label: '', need_link: true })); bindDel(); const ta = L.lastElementChild.querySelector('.tl'); ta.focus(); };
    el.querySelector('#tieSave').onclick = async ev => {
      const btn = ev.currentTarget; btn.disabled = true; btn.textContent = 'সেভ হচ্ছে…';
      const day = baseDay ? dayOf(baseDay) : todayDhaka();
      const due = t => t ? new Date(day + 'T' + t + ':00+06:00').toISOString() : null;
      let pos = items.reduce((m, i) => Math.max(m, i.pos || 0), 0), changed = [], errs = 0;
      for (const r of L.querySelectorAll('.tie')) {
        const id = r.dataset.id, label = r.querySelector('.tl').value.trim(), t = r.querySelector('.tt').value, nl = r.querySelector('.tn').checked;
        if (id && r.dataset.del) { const { error: e } = await sb.from('yg_task_items').delete().eq('id', id); e ? errs++ : changed.push('মুছে ফেলা হয়েছে'); continue; }
        if (!label) continue;
        if (!id) { const { error: e } = await sb.from('yg_task_items').insert({ task_id: taskId, pos: ++pos, label, due_at: due(t), need_link: nl }); e ? errs++ : changed.push('নতুন: ' + label); continue; }
        const o = items.find(x => x.id === id); if (!o) continue;
        const nd = due(t), upd = {};
        if (o.label !== label) upd.label = label;
        if ((o.due_at ? hm(o.due_at) : '') !== t) upd.due_at = nd;
        if ((o.need_link !== false) !== nl) upd.need_link = nl;
        if (Object.keys(upd).length) { const { error: e } = await sb.from('yg_task_items').update(upd).eq('id', id); e ? errs++ : changed.push(upd.label ? 'বদলানো: ' + label : 'সময়/সেটিং বদলানো: ' + label); }
      }
      if (errs) toast('কিছু পরিবর্তন সেভ হয়নি (' + errs + ')');
      if (changed.length) { try { await sb.rpc('yg_task_items_edited', { p_task: taskId, p_note: changed.slice(0, 3).join(' · ') }); } catch (e) {} if (!errs) toast('✅ সেভ হয়েছে, সদস্যকে জানানো হয়েছে'); }
      else if (!errs) toast('কিছু বদলানো হয়নি');
      close(); viewTask(taskId);
    };
  });
}
window.ygTaskItemsEdit = editor;
}
