/* 🔗 Every notification opens its own page: in-app list + phone push (tag/title based routing for links without parameters) */
{
const has = n => typeof window[n] === 'function' || (typeof globalThis[n] === 'function');
const yearOf = (dd, mm) => { const now = new Date(); let y = now.getFullYear(); if (+mm > now.getMonth() + 2) y--; return y; };
function allTeamChat() {
  try { const cv = (ui.convs || []).find(c => c.type !== 'direct' && /all\s*team/i.test(c.title || c.name || '')); if (cv) return openChat(cv.id); } catch (e) {}
  return go('chats');
}
/* route by tag (push) or title/kind/body (in-app list) */
function routeBy(tag, title, kind, body) {
  tag = String(tag || ''); title = String(title || ''); kind = String(kind || ''); body = String(body || '');
  const boss = (typeof isAdmin === 'function' && isAdmin()) || (state.profile && state.profile.observer);
  if (/^pchk-|^pcn-/.test(tag) || /AI চেক|পোস্টে মন্তব্য/.test(title)) return boss && window.ygPostReport ? ygPostReport() : go('tasks');
  if (/^issue-/.test(tag) || /সমস্যা/.test(title)) return /নতুন সমস্যা/.test(title) || (boss && !/আপনার সমস্যা/.test(title)) ? (window.issueDashboard ? issueDashboard() : go('menu')) : (window.reportSheet ? reportSheet() : go('menu'));
  if (/^mr-/.test(tag) || /মিটিং মিসের কারণ/.test(title)) {
    let day = null; const m = /(\d{2})\/(\d{2})/.exec(body); if (m) day = yearOf(m[1], m[2]) + '-' + m[2] + '-' + m[1];
    const tm = /^mr-[0-9a-f-]{36}-(\d{4}-\d{2}-\d{2})-(\w+)/.exec(tag); if (tm) day = tm[1];
    const mk = /রাতের|night/.test(body + tag) ? 'night' : 'morning';
    return has('viewMeetings') ? viewMeetings(day, mk) : go('home');
  }
  if (/^mtg-|meeting|মিটিং/i.test(tag + ' ' + title)) return allTeamChat();
  if (/^wkr-/.test(tag) || /সাপ্তাহিক রিভিউ|weekly review/i.test(title)) return has('viewWeekReview') && boss ? viewWeekReview() : go('home');
  if (/^sc|শোকজ|show.?cause/i.test(tag + ' ' + title)) return handleDeepLink(new URL('./?sc=1', location.href).href);
  if (/^ap|আপিল|appeal/i.test(tag + ' ' + title)) return has('viewAppeals') ? viewAppeals() : go('menu');
  if (/^lvl-/.test(tag) || /লেভেল|level/i.test(title)) return go('menu');
  if (kind === 'attendance' || /check.?in|check.?out|হাজিরা|চেক ইন/i.test(title)) return has('viewAttendance') ? viewAttendance() : go('home');
  if (kind === 'award') return has('viewAwards') ? viewAwards() : go('home');
  if (/নামাজ|salah|prayer/i.test(title)) return has('viewSalah') ? viewSalah() : go('home');
  if (/ছুটি|leave/i.test(title)) return has('viewLeave') ? viewLeave() : go('home');
  if (/রিপোর্ট|report/i.test(title)) return has('viewReport') ? viewReport() : go('home');
  if (kind === 'notice') return go('notices');
  if (kind === 'task' || kind === 'deadline') return go('tasks');
  if (kind === 'crm') return typeof openCRM === 'function' ? openCRM('') : go('crm');
  if (kind === 'message' || kind === 'group') return go('chats');
  return go('home');
}
window.ygRouteNotif = routeBy;

/* phone push: SW adds ?yt=<tag>&yh=<title> when the link has no parameters */
const _hdlNav = handleDeepLink;
handleDeepLink = function (href) {
  try {
    const u = new URL(href || location.href, location.href);
    if (u.searchParams.has('yt') || u.searchParams.has('yh')) {
      const tag = u.searchParams.get('yt'), title = u.searchParams.get('yh'), kind = u.searchParams.get('yk');
      if (location.search) history.replaceState(null, '', location.pathname);
      return setTimeout(() => routeBy(tag, title, kind, ''), 300);
    }
  } catch (e) {}
  return _hdlNav.apply(this, arguments);
};

/* in-app notification list: every item opens its page */
const _vnNav = viewNotif;
viewNotif = async function () {
  const r = await _vnNav.apply(this, arguments);
  try {
    const els = [...document.querySelectorAll('.nf-it')]; if (!els.length) return r;
    const ids = els.map(b => b.dataset.id);
    let { data, error } = await sb.from('yg_notifications').select('id,kind,title,body,url,tag,read_at').in('id', ids);
    if (error) ({ data } = await sb.from('yg_notifications').select('id,kind,title,body,url,read_at').in('id', ids));
    const map = {}; (data || []).forEach(n => map[String(n.id)] = n);
    els.forEach(b => b.onclick = () => {
      const n = map[b.dataset.id]; if (!n) return;
      if (!n.read_at) { n.read_at = new Date().toISOString(); sb.from('yg_notifications').update({ read_at: n.read_at }).eq('id', n.id).then(() => {}); }
      const u = new URL(n.url || './', location.href);
      if (n.kind === 'award' && u.searchParams.get('aw') && window.ygSpotlight) return ygSpotlight(u.searchParams.get('aw'));
      if ([...u.searchParams.keys()].length) return handleDeepLink(u.href);
      return routeBy(n.tag, n.title, n.kind, n.body);
    });
  } catch (e) {}
  return r;
};
}
