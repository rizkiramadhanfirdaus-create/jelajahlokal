// ===== LOGIKA TAMPILAN (butuh data.js dimuat lebih dulu) =====

const meta=(x,c)=>[['⭐ Menu rekomendasi',x.m],['💸 Kisaran harga',x.p],['🎫 Tiket masuk',x.t&&!/^Cek/.test(x.t)&&(x.t!=='Gratis'||c==='wisata'||c==='nongkrong')?x.t:''],['🕒 Jam buka',x.j],['📍 Alamat',x.a]].filter(r=>r[1]).map(r=>'<div><b>'+r[0]+':</b> '+esc(r[1])+'</div>').join('');
const CITY='Bandung',CE='🌄',LS='jl_bandung_wishlist';
const tt=q=>'https://www.tiktok.com/search?q='+encodeURIComponent(q);
const mp=q=>'https://www.google.com/maps/search/'+encodeURIComponent(q);
const ph=q=>'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(q);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=id=>document.getElementById(id);
const EMO={wisata:'🏞️',kopi:'☕',makan:'🍜',nongkrong:'🛋️',oleh:'🎁',jajan:'🍡'};
const ua=navigator.userAgent||'';
const isAnd=/Android/i.test(ua);
const isIOS=/iPhone|iPad|iPod/.test(ua)||(ua.includes('Mac')&&navigator.maxTouchPoints>1);
const qOf=u=>decodeURIComponent(u.split('?q=')[1]||'');
const ytU=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q);
const igU=n=>'https://www.instagram.com/explore/tags/'+encodeURIComponent(n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,''))+'/';
const app=u=>{if(u.indexOf('https://www.tiktok.com/')!==0)return u;if(isAnd)return 'intent://'+u.slice(8)+'#Intent;scheme=https;package=com.zhiliaoapp.musically;S.browser_fallback_url='+encodeURIComponent(u)+';end';if(isIOS)return 'snssdk1233://search?keyword='+encodeURIComponent(qOf(u));return u};

const ALLM={};
Object.keys(CATS).forEach(c=>(DATA[CITY][c]||[]).forEach(([n,d,v,h,x])=>{ALLM[n]={c,n,d,h,x,ar:AR[n]||'',v:v||tt(n+' '+CITY),m:mp(n+' '+((x&&x.a)||CITY)),f:ph(n+' '+CITY)}}));
let cat='semua';
let saved=[];
try{saved=JSON.parse(localStorage.getItem(LS)||'[]').filter(n=>ALLM[n])}catch(e){}
const persist=()=>{try{localStorage.setItem(LS,JSON.stringify(saved))}catch(e){}};

function items(){const list=[];Object.keys(CATS).forEach(c=>{if(cat!=='semua'&&cat!==c)return;(DATA[CITY][c]||[]).forEach(z=>list.push(ALLM[z[0]]))});return list}
function render(){
  const chips=[['semua','✨ Semua']].concat(Object.keys(CATS).filter(k=>DATA[CITY][k]).map(k=>[k,EMO[k]+' '+CATS[k]])).map(([k,l])=>'<button class="chip" data-c="'+k+'" aria-pressed="'+(cat===k)+'">'+l+'</button>').join('');
  const list=items();
  const cards=list.map((i,n)=>{const q=qOf(i.v);const v=i.x&&i.x.s;const mt=meta(i.x||{},i.c);const on=saved.includes(i.n);
    return '<article class="item" style="--k:var(--c-'+i.c+');--i:'+n+'">'+(i.h?'<span class="hot">'+(i.h==2?'🔥 Sering ramai':'⚡ Lagi hits')+'</span>':'')+'<div class="top"><div class="av">'+EMO[i.c]+'</div><div><span class="tag">'+CATS[i.c]+'</span><h3>'+esc(i.n)+'</h3><span class="loc">📍 '+esc(i.ar?CITY+', '+i.ar:CITY)+'</span><span class="rt" data-q="'+esc(i.n+' '+CITY)+'"></span></div></div><p>'+esc(i.d)+'</p>'+(mt?'<div class="meta">'+mt+'</div>':'')+(v?'<div class="st ok">✅ Dicek ke sumber: '+esc(v)+'</div>':'')+'<div class="links"><a class="v" href="'+esc(app(i.v))+'" target="_blank" rel="noopener noreferrer">▶ Tonton di TikTok</a><button class="cp" data-q="'+esc(q)+'" aria-label="Salin kata kunci TikTok" title="Salin kata kunci pencarian">📋</button><button class="wl'+(on?' on':'')+'" data-n="'+esc(i.n)+'" aria-pressed="'+on+'">'+(on?'✅ Ada di daftarku':'➕ Tambah ke daftarku')+'</button>'+(isIOS?'<a href="'+i.v+'" target="_blank" rel="noopener noreferrer">🌐 TikTok web</a>':'')+'<a class="yt" href="'+ytU(q)+'" target="_blank" rel="noopener noreferrer">▶ YouTube</a><a class="ig" href="'+igU(i.n)+'" target="_blank" rel="noopener noreferrer">📸 Instagram</a><a href="'+i.m+'" target="_blank" rel="noopener noreferrer">⭐ Peta &amp; rating</a><a href="'+i.f+'" target="_blank" rel="noopener noreferrer">📷 Foto</a></div></article>'}).join('');
  $('out').innerHTML='<div class="head"><h2>'+CE+' Rekomendasi di '+CITY+'</h2><span class="count">'+list.length+' tempat</span><button class="rndbtn" id="rnd">🎲 Kejutkan aku</button></div><div class="chips">'+chips+'</div><div class="disc">ℹ️ <b>Penting:</b> harga, jam buka, dan menu bisa berubah sewaktu-waktu sesuai kebijakan masing-masing tempat atau destinasi. Cek kembali informasi terbaru langsung ke tempatnya sebelum berkunjung.</div><div class="grid">'+cards+'</div>';
  syncUI();
  if(typeof loadRatings==='function')loadRatings();
}
function surprise(){
  cat='semua';render();
  const cs=document.querySelectorAll('.item');const el=cs[Math.floor(Math.random()*cs.length)];
  if(el){el.classList.add('pop');el.scrollIntoView({behavior:'smooth',block:'center'})}
}

/* ===== Daftar destinasi + rencana 1 hari ===== */
const LS2='jl_bandung_plan';
const SLOTS=[['pagi','🌅 Pagi','08.00–11.00'],['siang','☀️ Siang','11.00–15.00'],['sore','🌇 Sore','15.00–18.00'],['malam','🌙 Malam','18.00–22.00']];
const PREF={wisata:['pagi','siang','sore'],kopi:['pagi','sore','siang'],makan:['siang','malam'],nongkrong:['sore','malam'],oleh:['sore','malam'],jajan:['malam','sore']};
const CORD=['makan','wisata','kopi','nongkrong','jajan','oleh'];
let plan={},tab='list';
try{plan=JSON.parse(localStorage.getItem(LS2)||'{}')}catch(e){}
const persistPlan=()=>{try{localStorage.setItem(LS2,JSON.stringify(plan))}catch(e){}};
const inSlot=s=>saved.filter(n=>ALLM[n]&&plan[n]===s);
const planned=()=>SLOTS.flatMap(s=>inSlot(s[0]));
function toggle(n){const k=saved.indexOf(n);if(k>=0){saved.splice(k,1);delete plan[n]}else saved.push(n);persist();persistPlan();syncUI()}
function syncUI(){
  document.querySelectorAll('.wl').forEach(b=>{const on=saved.includes(b.dataset.n);b.classList.toggle('on',on);b.textContent=on?'✅ Ada di daftarku':'➕ Tambah ke daftarku';b.setAttribute('aria-pressed',on)});
  $('wlcount').textContent=saved.length;
  if($('sheet').classList.contains('open'))renderSheet();
}
function autoArrange(){
  const cnt={pagi:0,siang:0,sore:0,malam:0};plan={};
  [...saved].sort((a,b)=>CORD.indexOf(ALLM[a].c)-CORD.indexOf(ALLM[b].c)).forEach(n=>{
    const pf=PREF[ALLM[n].c]||['siang'];
    const s=pf.find(x=>cnt[x]<2)||pf.slice().sort((a,b)=>cnt[a]-cnt[b])[0];
    plan[n]=s;cnt[s]++;
  });
  persistPlan();
}
function move(n,d){const s=plan[n];if(!s)return;const g=inSlot(s);const k=g.indexOf(n),m=k+d;if(m<0||m>=g.length)return;const a=saved.indexOf(g[k]),b=saved.indexOf(g[m]);[saved[a],saved[b]]=[saved[b],saved[a]];persist()}
const info=i=>'<div class="nm"><b>'+esc(i.n)+'</b><small>'+esc(i.ar?CITY+', '+i.ar:CITY)+' · '+CATS[i.c]+'</small></div>';
const ctl=n=>'<div class="ctl"><select data-slot="'+esc(n)+'" aria-label="Waktu kunjungan"><option value="">Belum diatur</option>'+SLOTS.map(s=>'<option value="'+s[0]+'"'+(plan[n]===s[0]?' selected':'')+'>'+s[1]+' ('+s[2]+')</option>').join('')+'</select><button data-mv="'+esc(n)+'|-1" aria-label="Naikkan urutan">↑</button><button data-mv="'+esc(n)+'|1" aria-label="Turunkan urutan">↓</button></div>';
function renderSheet(){
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
  const L=saved.map(n=>ALLM[n]).filter(Boolean);
  if(!L.length){$('wlist').innerHTML='<div class="empty"><b>🧭</b>Belum ada destinasi. Tap “Tambah ke daftarku” di kartu untuk menyimpannya, lalu susun jadi rencana 1 hari.</div>';$('wact').innerHTML='';return}
  if(tab==='list'){
    $('wlist').innerHTML=L.map((i,k)=>'<div class="wi"><span class="av2">'+EMO[i.c]+'</span>'+info(i)+'<a href="'+i.m+'" target="_blank" rel="noopener noreferrer" aria-label="Buka peta">📍</a><button data-rm="'+esc(i.n)+'" aria-label="Hapus dari daftar">✕</button></div>').join('');
    $('wact').innerHTML='<button data-act="plan">🗓️ Susun rencana 1 hari</button><button data-act="copy">📋 Salin daftar</button><button data-act="wa">💬 WhatsApp</button><button data-act="clear">🗑️ Hapus semua</button>';
    return;
  }
  const sec=(label,list)=>list.length?'<div class="sl">'+label+'</div>'+list.map(i=>'<div class="wi"><span class="av2">'+EMO[i.c]+'</span>'+info(i)+'<a href="'+i.m+'" target="_blank" rel="noopener noreferrer" aria-label="Buka peta">📍</a>'+ctl(i.n)+'</div>').join(''):'';
  $('wlist').innerHTML=(planned().length?'':'<div class="note">Tap “Susun otomatis” atau pilih waktu kunjungan tiap tempat.</div>')+SLOTS.map(s=>sec(s[1]+' · '+s[2],inSlot(s[0]).map(n=>ALLM[n]))).join('')+sec('📝 Belum diatur',L.filter(i=>!plan[i.n]));
  $('wact').innerHTML='<button data-act="auto">✨ Susun otomatis</button><button data-act="route">🗺️ Rute di Maps</button><button data-act="copyplan">📋 Salin rencana</button><button data-act="waplan">💬 WhatsApp</button>';
}
const tag=n=>n+(AR[n]?' ('+AR[n]+')':'');
const listText=()=>'Daftar destinasi '+CITY+'-ku:\n'+saved.map((n,k)=>(k+1)+'. '+tag(n)).join('\n')+'\n\nDibuat lewat Jelajah '+CITY;
function planText(){
  let t='Rencana 1 hari di '+CITY+':\n';
  SLOTS.forEach(s=>{const g=inSlot(s[0]);if(g.length)t+='\n'+s[1]+' ('+s[2]+')\n'+g.map(n=>'- '+tag(n)).join('\n')+'\n'});
  const r=saved.filter(n=>!plan[n]);if(r.length)t+='\nBelum diatur\n'+r.map(n=>'- '+tag(n)).join('\n')+'\n';
  return t+'\nDibuat lewat Jelajah '+CITY;
}
function routeUrl(){
  const L=planned().slice(0,11).map(n=>encodeURIComponent(n+' '+CITY));
  if(L.length<2)return '';
  return 'https://www.google.com/maps/dir/?api=1&origin='+L[0]+'&destination='+L[L.length-1]+(L.length>2?'&waypoints='+L.slice(1,-1).join('%7C'):'')+'&travelmode=driving';
}
function openSheet(){renderSheet();$('sheet').classList.add('open')}
function closeSheet(){$('sheet').classList.remove('open')}

/* ===== Toast + salin ===== */
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2400)}
function copyText(q,msg){const ok=()=>toast(msg);
  const fb=()=>{const t=document.createElement('textarea');t.value=q;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){toast('Salin manual dari daftar')}t.remove()};
  try{navigator.clipboard.writeText(q).then(ok,fb)}catch(e){fb()}}

$('out').addEventListener('click',e=>{
  const c=e.target.closest('.chip');if(c){cat=c.dataset.c;render();return}
  const p=e.target.closest('.cp');if(p){copyText(p.dataset.q,'Kata kunci disalin. Tempel di pencarian TikTok.');return}
  const w=e.target.closest('.wl');if(w){toggle(w.dataset.n);return}
  if(e.target.closest('#rnd'))surprise();
});
$('wlbar').addEventListener('click',openSheet);
$('sheet').addEventListener('click',e=>{
  if(e.target.id==='wlbd'||e.target.closest('#wlx'))return closeSheet();
  const t=e.target.closest('[data-tab]');if(t){tab=t.dataset.tab;return renderSheet()}
  const r=e.target.closest('[data-rm]');if(r)return toggle(r.dataset.rm);
  const m=e.target.closest('[data-mv]');if(m){const p=m.dataset.mv.split('|');move(p[0],+p[1]);return renderSheet()}
  const a=e.target.closest('[data-act]');if(!a)return;
  const k=a.dataset.act;
  if(k==='copy')copyText(listText(),'Daftar disalin.');
  if(k==='wa')window.open('https://wa.me/?text='+encodeURIComponent(listText()),'_blank','noopener');
  if(k==='plan'){tab='plan';if(!planned().length)autoArrange();renderSheet()}
  if(k==='auto'){autoArrange();renderSheet()}
  if(k==='copyplan')copyText(planText(),'Rencana disalin.');
  if(k==='waplan')window.open('https://wa.me/?text='+encodeURIComponent(planText()),'_blank','noopener');
  if(k==='route'){const u=routeUrl();if(u)window.open(u,'_blank','noopener');else toast('Atur minimal 2 tempat ke dalam rencana dulu.')}
  if(k==='clear'&&confirm('Hapus semua destinasi dari daftarmu?')){saved=[];plan={};persist();persistPlan();syncUI()}
});
$('sheet').addEventListener('change',e=>{const s=e.target.closest('select[data-slot]');if(!s)return;if(s.value)plan[s.dataset.slot]=s.value;else delete plan[s.dataset.slot];persistPlan();renderSheet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
render();
