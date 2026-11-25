/* 📂 Menu: grouped sections (Work · Communication · Team & HR · Settings) — same icons, new arrangement */
{
const GROUPS = [
  { k: 'work', t: 'Work & Productivity', ic: '🎯', c: '#DC2626', ids: ['m-tg', 'm-tgt', 'm-pchk', 'm-notes', 'm-pf2', 'm-pchks'] },
  { k: 'comm', t: 'Communication & Tools', ic: '💬', c: '#4F46E5', ids: ['m-wa', 'm-gpt', 'm-gg', 'm-fb', 'm-notices'] },
  { k: 'hr', t: 'Team & HR', ic: '👥', c: '#7C3AED', ids: ['m-att', 'm-lv', 'm-team', 'm-rep', 'm-aw', 'm-fame', 'm-ap', 'm-sc', 'm-rb'] },
  { k: 'set', t: 'Settings & Administration', ic: '⚙️', c: '#0B2A6F', ids: ['m-edit', 'm-lang', 'm-push', 'm-snd', 'm-issue', 'm-issues', 'm-adm', 'm-grp'] },
  { k: 'more', t: 'অন্যান্য', ic: '✨', c: '#0891B2', ids: [] }
];
const CSS = `<style id="mgcss">
#mgwrap .mg{background:rgba(255,255,255,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.95);border-radius:22px;padding:12px 12px 13px;margin-top:12px;box-shadow:0 8px 24px rgba(11,42,111,.08)}
#mgwrap .mg-h{display:flex;align-items:center;gap:9px;width:100%;font-weight:700;font-size:15.5px;color:#0f1d3a;text-align:left}
#mgwrap .mg-h .mi{width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px}
#mgwrap .mg-h .ch{margin-left:auto;color:#94a3b8;font-size:20px;transition:transform .2s}
#mgwrap .mg.closed .ch{transform:rotate(90deg)}#mgwrap .mg.closed .mg-g{display:none}
#mgwrap .mg-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:11px}
#mgwrap .mg-g .tile{padding:10px 3px 9px!important;border-radius:16px!important;min-width:0}
#mgwrap .mg-g .tile .ic{width:44px!important;height:44px!important;border-radius:14px!important;font-size:22px!important}
#mgwrap .mg-g .tile .ic svg{width:24px;height:24px}
#mgwrap .mg-g .tile b{font-size:11.5px!important;margin-top:6px!important;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
#mgwrap .mg-g .tile small{display:none!important}
#pf.mgpf{background:linear-gradient(140deg,#0B2A6F,#1E4FC2 60%,#2563EB)!important;color:#fff!important;border:0!important;border-radius:22px!important;box-shadow:0 12px 28px rgba(11,42,111,.28)!important;padding:16px!important}
#pf.mgpf *{color:#fff!important}#pf.mgpf .editpill{background:rgba(255,255,255,.16)!important;border:1px solid rgba(255,255,255,.45)!important;border-radius:20px}#pf.mgpf .av{box-shadow:0 0 0 3px rgba(255,255,255,.75)}
#lo.mglo{width:100%;margin-top:16px;background:#FFF1F2!important;border:1.5px solid #FECDD3!important;color:#E11D48!important;font-weight:700;border-radius:16px;padding:13px}
</style>`;
let closed = {};
try { closed = JSON.parse(localStorage.getItem('yg_menu_closed') || '{}'); } catch (e) {}
function build() {
  const old = document.querySelector('.view .tiles'); if (!old) return;
  if (!document.getElementById('mgcss')) document.head.insertAdjacentHTML('beforeend', CSS);
  let wrap = document.getElementById('mgwrap');
  if (!wrap) {
    wrap = document.createElement('div'); wrap.id = 'mgwrap';
    wrap.innerHTML = GROUPS.map(g => '<section class="mg' + (closed[g.k] ? ' closed' : '') + '" data-g="' + g.k + '" hidden><button class="mg-h" type="button"><span class="mi" style="background:' + g.c + '1a">' + g.ic + '</span><span>' + g.t + '</span><span class="ch">›</span></button><div class="mg-g"></div></section>').join('');
    old.parentNode.insertBefore(wrap, old); old.style.display = 'none';
    wrap.querySelectorAll('.mg-h').forEach(h => h.onclick = () => { const s = h.parentNode; s.classList.toggle('closed'); closed[s.dataset.g] = s.classList.contains('closed'); try { localStorage.setItem('yg_menu_closed', JSON.stringify(closed)); } catch (e) {} });
    new MutationObserver(place).observe(old, { childList: true });
    const pf = document.getElementById('pf'); if (pf) pf.classList.add('mgpf');
    const lo = document.getElementById('lo'); if (lo) { lo.classList.add('mglo'); lo.innerHTML = '↪ ' + (lo.textContent.trim() || 'Log out'); }
  }
  place();
}
function place() {
  const old = document.querySelector('.view .tiles'), wrap = document.getElementById('mgwrap'); if (!old || !wrap) return;
  [...old.querySelectorAll(':scope > .tile')].forEach(t => {
    const g = GROUPS.find(x => x.ids.includes(t.id)) || GROUPS[GROUPS.length - 1];
    const box = wrap.querySelector('[data-g="' + g.k + '"] .mg-g');
    const order = g.ids.indexOf(t.id);
    const after = [...box.children].find(c => g.ids.indexOf(c.id) > order && order >= 0);
    box.insertBefore(t, after || null);
  });
  /* attendance only for people who work from the office (admins/managers keep it to see the team) */
  try { const at = document.getElementById('m-att'); if (at) { const show = state.profile.work_mode === 'office' || isMgr(); at.hidden = !show; at.style.display = show ? '' : 'none'; } } catch (e) {}
  wrap.querySelectorAll('.mg').forEach(s => s.hidden = !s.querySelector('.tile:not([hidden])'));
}
const _vmMg = viewMenu;
viewMenu = function () { const r = _vmMg(); try { build(); setTimeout(place, 300); setTimeout(place, 1200); } catch (e) {} return r; };
}
