/* 🧑‍💼 CRM team: app admins add / edit CRM members (login + access) in one step */
{
const CS_FN = 'https://ipcokkkydppfbkacmxjx.supabase.co/functions/v1/crm-staff';
const CS_ROLE = { admin: '👑 অ্যাডমিন (সব কিছু)', counsellor: '🎓 কাউন্সেলর', operations: '🛠️ অপারেশনস' };
async function csCall(body) {
  const { data } = await sb.auth.getSession(); const s = data && data.session;
  if (!s) throw new Error('আবার লগইন করুন');
  const r = await fetch(CS_FN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ token: s.access_token }, body)) });
  const j = await r.json().catch(() => ({ ok: false, error: 'সার্ভার থেকে উত্তর আসেনি' }));
  return j;
}
const csPass = () => { const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; const a = new Uint32Array(10); crypto.getRandomValues(a); return 'Mt@' + [...a].map(x => c[x % c.length]).join(''); };

async function viewCrmStaff() {
  cleanupChannels();
  $app.innerHTML = '<div class="top"><button class="back" id="bk">←</button><h1>🧑‍💼 CRM টিম</h1></div><div class="pad" id="csb" style="padding-top:8px"><div class="cen"><div class="spin dark"></div></div></div>';
  document.getElementById('bk').onclick = () => viewAdmin();
  const box = document.getElementById('csb');
  let j; try { j = await csCall({ action: 'list' }); } catch (e) { j = { ok: false, error: e.message }; }
  if (!document.getElementById('csb')) return;
  if (!j.ok) { box.innerHTML = '<div class="msg err">' + esc(j.error || 'লোড করা যায়নি') + '</div>'; return; }
  const list = j.staff || [];
  box.innerHTML = '<button class="btn" id="csnew" style="margin-top:0">➕ নতুন সদস্য যোগ করুন</button><div class="mut" style="font-size:12px;margin-top:6px">এখান থেকে একবারেই CRM-এর লগইন তৈরি ও অ্যাক্সেস দেওয়া হয়। আলাদা করে Supabase-এ যেতে হবে না।</div>'
    + list.map(s => '<button class="card" data-cs="' + s.id + '" style="display:block;width:100%;text-align:left;margin-top:10px;cursor:pointer;opacity:' + (s.active ? 1 : .55) + '"><b>' + esc(s.full_name) + '</b>' + (s.active ? '' : ' <span style="color:#dc2626;font-size:12px">(বন্ধ)</span>') + '<small style="display:block;color:#64748b;font-size:12.5px;margin-top:2px">' + esc(s.email) + ' · ' + (CS_ROLE[s.role] || esc(s.role)) + '</small></button>').join('');
  document.getElementById('csnew').onclick = () => csForm(null);
  box.querySelectorAll('[data-cs]').forEach(b => b.onclick = () => csForm(list.find(x => x.id === b.dataset.cs)));
}

function csForm(s) {
  const roles = Object.keys(CS_ROLE).map(k => '<option value="' + k + '"' + ((s ? s.role : 'counsellor') === k ? ' selected' : '') + '>' + CS_ROLE[k] + '</option>').join('');
  sheet('<h3>' + (s ? '✏️ সদস্য এডিট' : '➕ নতুন CRM সদস্য') + '</h3>'
    + '<label>ইমেইল (লগইন)</label><input class="in" id="cse" type="email" autocomplete="off" placeholder="name@mytravelmateofficial.com" value="' + esc(s ? s.email : '') + '"' + (s ? ' disabled' : '') + '>'
    + '<label>নাম</label><input class="in" id="csn" maxlength="80" value="' + esc(s ? s.full_name : '') + '">'
    + '<label>অ্যাক্সেস</label><select class="in" id="csr">' + roles + '</select>'
    + '<label>' + (s ? 'নতুন পাসওয়ার্ড (বদলাতে চাইলে)' : 'পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)') + '</label><div class="two"><input class="in" id="csp" type="text" autocomplete="new-password" style="margin-top:0" placeholder="' + (s ? 'খালি রাখলে আগেরটাই থাকবে' : '') + '"><button class="btn ghost sm" id="csg" style="margin-top:0">🎲 তৈরি করুন</button></div>'
    + '<div class="mut" style="font-size:12px;margin-top:4px">পাসওয়ার্ডটা সদস্যকে দিন; প্রথম লগইনের পর CRM-এর "পাসওয়ার্ড বদলান" দিয়ে বদলে নিতে বলুন।</div>'
    + (s ? '<label class="wd" style="margin-top:10px"><input type="checkbox" id="csa"' + (s.active ? ' checked' : '') + '> CRM-এ ঢুকতে পারবেন (চালু)</label>' : '')
    + '<button class="btn" id="csok">' + (s ? 'সেভ করুন' : 'সদস্য যোগ করুন') + '</button>', (el, close) => {
    el.querySelector('#csg').onclick = () => { el.querySelector('#csp').value = csPass(); };
    const ok = el.querySelector('#csok');
    ok.onclick = async () => {
      const email = el.querySelector('#cse').value.trim(), name = el.querySelector('#csn').value.trim(), role = el.querySelector('#csr').value, pw = el.querySelector('#csp').value.trim();
      if (!s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('সঠিক ইমেইল দিন');
      if (!name) return toast('নাম দিন');
      if (!s && pw.length < 8) return toast('কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন (🎲 চাপলে নিজে তৈরি হবে)');
      if (s && pw && pw.length < 8) return toast('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের দিন');
      busy(ok, true);
      try {
        let j = s ? await csCall({ action: 'update', id: s.id, name, role, active: el.querySelector('#csa').checked, password: pw })
                  : await csCall({ action: 'add', email, name, role, password: pw });
        if (!s && j.exists) {
          if (!confirm(j.error + '। তাঁর নাম ও অ্যাক্সেস বদলে "' + name + '" করবেন?')) { busy(ok, false); return; }
          j = await csCall({ action: 'add', email, name, role, password: pw, confirmExisting: true });
        }
        if (!j.ok) throw new Error(j.error || 'হয়নি');
        close();
        toast(s ? 'সেভ হয়েছে ✓' : 'CRM অ্যাকাউন্ট তৈরি হয়েছে ✓');
        if (!s || pw) sheet('<h3>✅ লগইনের তথ্য</h3><p class="mut">এটা সদস্যকে পাঠিয়ে দিন:</p><div class="card" style="font-size:14px;line-height:1.8">🌐 mytravelmateofficial.com/crm<br>📧 ' + esc(s ? s.email : email) + '<br>🔑 ' + esc(pw) + '</div><button class="btn" id="cscp">📋 কপি করুন</button>', (e2, c2) => {
          e2.querySelector('#cscp').onclick = async () => { try { await navigator.clipboard.writeText('MY TravelMate CRM\nhttps://mytravelmateofficial.com/crm/\nEmail: ' + (s ? s.email : email) + '\nPassword: ' + pw + '\n(প্রথম লগইনের পর পাসওয়ার্ড বদলে নিন)'); toast('কপি হয়েছে ✓'); } catch (e) { toast('কপি করা যায়নি'); } };
        });
        viewCrmStaff();
      } catch (e) { busy(ok, false); toast(e.message || 'হয়নি'); }
    };
  });
}
window.viewCrmStaff = viewCrmStaff;

const _vaCs = viewAdmin;
viewAdmin = async function () {
  const pr = _vaCs();
  try {
    await pr;
    const t = document.querySelector('.tiles');
    if (t && isAdmin() && !document.getElementById('x-cs')) {
      t.insertAdjacentHTML('afterbegin', '<button class="tile hl" id="x-cs"><span class="ic">🧑‍💼</span><b>CRM টিম</b><small>সদস্য যোগ · অ্যাক্সেস</small></button>');
      document.getElementById('x-cs').onclick = () => viewCrmStaff();
    }
  } catch (e) {}
  return pr;
};
}
