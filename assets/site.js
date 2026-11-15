/* rein-digital · Redesign v2 · shared behaviour */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ---- mobile menu + dropdown ---- */
const burger=$('.burger');
if(burger) burger.onclick=()=>{const o=document.body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o)};
$$('.dd > button').forEach(b=>b.onclick=()=>{const o=b.parentElement.classList.toggle('open');b.setAttribute('aria-expanded',o)});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

/* ---- ticker ---- */
const tk=$('#ticker');
if(tk){
  const pairs=[["Projektüberlastung","Transparenz"],["Widersprüchliche Prioritäten","Fokus"],["Informelle Absprachen","Klare Steuerung"],["Strategie auf Folien","Gelebte Realität"],["Meeting-Theater","Entscheidungen"],["Bauchgefühl","Messbare KPIs"]];
  const line=pairs.map(p=>`<s>${p[0]}</s> → <b>${p[1]}</b><span class="sep">✦</span>`).join('');
  tk.innerHTML=`<p>${line}${line}</p><p>${line}${line}</p>`;
}

/* ---- clients marquee ---- */
const mq=$('#marquee');
if(mq){
  const c="adidas,Aktion Mensch,Barclaycard,Boehringer Ingelheim,British Telecom,Deutsche Post DHL,Deichmann,Deutsche Telekom,EnBW,Fraunhofer IIS,Fraport,Harman,Ratiopharm,s.Oliver,Uniper,Unitymedia,Vitra,Vodafone,Vorwerk,web.de,GMX,1&1,Yello Strom".split(',');
  const h=c.map(x=>`<span>${x}</span>`).join('');mq.innerHTML=h+h;
}

/* ---- counters ---- */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.to,suf=el.dataset.suf||'';let t0=null;
  const step=ts=>{t0=t0||ts;const p=Math.min((ts-t0)/1400,1);el.innerHTML=Math.round(to*(1-Math.pow(1-p,3)))+(suf?`<sup>${suf}</sup>`:'');if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step);cio.unobserve(el)}),{threshold:.5});
$$('[data-to]').forEach(el=>cio.observe(el));

/* ---- badges toggle ---- */
const bt=$('#badgesToggle');
if(bt) bt.onclick=()=>{const b=$('#badges');const o=b.classList.toggle('all');bt.textContent=o?'Weniger anzeigen':'Alle Zertifikate anzeigen';};

/* ---- career scroller ---- */
const ct=$('.career-track');
$$('.career-nav button').forEach(b=>b.onclick=()=>ct.scrollBy({left:(+b.dataset.d)*ct.clientWidth*.8,behavior:'smooth'}));

/* ---- venn coherence ---- */
const venn=$('#venn');
if(venn){
  const bs=$$('#cohSeg button');
  bs.forEach(b=>b.onclick=()=>{venn.classList.toggle('apart',b.dataset.v==='apart');bs.forEach(x=>x.setAttribute('aria-pressed',x===b))});
}

/* ---- pulse check ---- */
const qs=$('#qs');
if(qs){
  const Q=[["Bei uns ist fast jedes Projekt „Prio 1“.","p","Fluss"],["Wichtige Entscheidungen fallen oft informell – auf dem Flur oder per Chat.","d","Struktur"],["Führung ist überwiegend mit Feuerlöschen beschäftigt.","o","Haltung"],["Wir wissen nicht genau, wo unsere Kapazitäten gebunden sind.","o","Fluss"],["Die Strategie ist präsentiert, aber im Alltag kaum spürbar.","c","Haltung"],["Erfolg ist schwer messbar – KPIs fehlen oder sagen wenig.","p","Struktur"]];
  qs.innerHTML=Q.map(q=>`<label class="q"><input type="checkbox" data-k="${q[1]}" data-d="${q[2]}"><span>${q[0]}</span><em>${q[2]}</em></label>`).join('');
  const REC={p:["Project Health Check","health-series.html#project"],d:["Department Health Check","health-series.html#department"],o:["Operational Relief & Steering","health-series.html#relief"],c:["Organisational Coherence Assessment","health-series.html#coherence"]};
  const LC=['#0E1B2E','#177EC2','#D2553A','#B23A22'];
  const score=()=>{
    const ch=$$('.q input:checked'),n=ch.length,l=n===0?0:n<=2?1:n<=4?2:3,bf=$('#befund');
    bf.dataset.l=l;bf.style.setProperty('--lc',LC[l]);$('#sc').textContent=n;
    $$('#meter i').forEach((m,i)=>m.classList.toggle('on',i<n));
    $$('.dim-row').forEach(r=>{const c=ch.filter(x=>x.dataset.d===r.dataset.d).length;$$('i',r).forEach((m,i)=>m.classList.toggle('on',i<c))});
    const v=$('#verdict');
    if(!n){v.innerHTML='<h3>Noch alles ruhig.</h3><p>Hake ab, was Dir bekannt vorkommt.</p>';return}
    const cnt={};ch.forEach(c=>cnt[c.dataset.k]=(cnt[c.dataset.k]||0)+1);
    const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0],r=REC[n>=5?'c':top];
    v.innerHTML=`<h3>${['','Leicht erhöhter Puls.','Deutlich angespannt.','Zeit zu handeln.'][l]}</h3><p>Passt: <strong>${r[0]}</strong></p><a href="${r[1]}">Format ansehen →</a>`;
  };
  $$('.q input').forEach(i=>i.onchange=score);score();
}

/* ---- flight levels ---- */
const fl=$('#flsvg');
if(fl){
  const tabs=$$('.fl-tab'),planes=$$('.plane',fl);
  const act=l=>{fl.classList.add('focus');planes.forEach(p=>p.classList.toggle('act',p.dataset.l===l));tabs.forEach(t=>{t.classList.toggle('act',t.dataset.l===l);t.setAttribute('aria-selected',t.dataset.l===l)})};
  tabs.forEach(t=>t.onclick=()=>act(t.dataset.l));planes.forEach(p=>p.onclick=()=>act(p.dataset.l));act('2');
  /* flowing work items: strategy -> coordination -> teams */
  const items=$$('.item',fl);const paths=[[[250,70],[250,190],[150,300]],[[250,70],[250,190],[350,300]],[[250,70],[250,190],[250,310]]];
  items.forEach((it,i)=>{let t=i/items.length;const p=paths[i%3];const run=()=>{t=(t+.0035)%1;const seg=t<.5?0:1,lt=(t%.5)*2,a=p[seg],b=p[seg+1];it.setAttribute('transform',`translate(${a[0]+(b[0]-a[0])*lt},${a[1]+(b[1]-a[1])*lt})`);it.style.opacity=t>.92?(1-t)*12:1;requestAnimationFrame(run)};run()});
}

/* ---- before/after slider ---- */
$$('.ba').forEach(ba=>{const r=$('input[type=range]',ba);const set=()=>ba.style.setProperty('--x',r.value+'%');r.oninput=set;set();
  /* gentle intro sweep */
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();let v=85;const s=()=>{v-=1.4;r.value=v;set();if(v>50)requestAnimationFrame(s)};s()}},{threshold:.5});io.observe(ba)});

/* ---- gears ---- */
function gear(cx,cy,r,teeth,depth){let d='';const st=Math.PI*2/teeth;for(let i=0;i<teeth;i++){const a=i*st;[[a,r],[a+st*.15,r+depth],[a+st*.45,r+depth],[a+st*.6,r]].forEach((p,j)=>{d+=(i===0&&j===0?'M':'L')+(cx+p[1]*Math.cos(p[0])).toFixed(1)+' '+(cy+p[1]*Math.sin(p[0])).toFixed(1)})}d+='Z';d+=`M${cx+r*.35} ${cy}A${r*.35} ${r*.35} 0 1 0 ${cx-r*.35} ${cy}A${r*.35} ${r*.35} 0 1 0 ${cx+r*.35} ${cy}Z`;for(let i=0;i<6;i++){const a=i*Math.PI/3;d+=`M${cx+r*.38*Math.cos(a)} ${cy+r*.38*Math.sin(a)}L${cx+r*.85*Math.cos(a)} ${cy+r*.85*Math.sin(a)}`}return d}
$$('svg.gears').forEach(svg=>{
  const G=[[380,320,200,28,22,1,'g1'],[608,128,92,13,20,-28/13,'g2'],[160,560,80,11,18,-28/11,'g2']];
  svg.innerHTML=G.map((g,i)=>`<g class="${g[6]}" style="transform-origin:${g[0]}px ${g[1]}px"><path d="${gear(g[0],g[1],g[2],g[3],g[4])}"/></g>`).join('');
  const gs=$$('g',svg);let base=0;
  const tick=()=>{base+=.12;const r=svg.parentElement.getBoundingClientRect();const sc=(innerHeight-r.top)*.12;gs.forEach((g,i)=>g.style.transform=`rotate(${(base+sc)*G[i][5]}deg)`);requestAnimationFrame(tick)};tick();
});

/* ---- floating talk button ---- */
const fab=$('.talk-fab');
if(fab){const hide=$$('#termin,#check');const upd=()=>{const past=scrollY>innerHeight*.7;const inBook=hide.some(t=>{const r=t.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0});fab.classList.toggle('show',past&&!inBook)};addEventListener('scroll',upd,{passive:true});upd()}

/* ---- booking prototype ----
   Live version: replace load()/save() with the booking tool's API (e.g. Cal.com),
   which knows real availability and blocks booked slots for everyone. */
const bk=$('#booker');
if(bk){
  const SLOTS=['15:00','16:00','17:00','18:00'], KEY='rd-bookings', DUR=30;
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return []}};
  const save=a=>{try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}};
  const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const fmt=(d,o)=>d.toLocaleDateString('de-DE',o);
  const weeks=[];{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+1);while(d.getDay()!==1)d.setDate(d.getDate()+1);
    for(let w=0;w<3;w++){const wk=[];for(let i=0;i<5;i++){const x=new Date(d);x.setDate(d.getDate()+w*7+i);wk.push(x)}weeks.push(wk)}}
  const fresh=()=>({step:1,week:0,day:null,time:null,last:null});
  let st=fresh();
  const free=day=>{const b=load();return SLOTS.filter(t=>!b.some(x=>x.d===iso(day)&&x.t===t))};
  const steps=()=>`<div class="bk-steps">${['Tag','Uhrzeit','Deine Daten'].map((l,i)=>`<span class="${st.step===i+1?'on':st.step>i+1?'done':''}">${i+1} · ${l}</span>`).join('')}</div>`;
  const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const render=()=>{
    let h='';
    if(st.step===4){const d=new Date(st.last.d);
      h=`<div class="bk-steps"><span class="done">1 · Tag</span><span class="done">2 · Uhrzeit</span><span class="on">✓ Gebucht</span></div><div class="bk-body bk-done">
        <div class="big">Danke, ${esc(st.last.name.split(' ')[0])}!</div>
        <div class="when">${fmt(d,{weekday:'long',day:'numeric',month:'long'})}, ${st.last.t} Uhr</div>
        <p style="color:var(--ink-soft)">Der Termin ist für Dich reserviert und für alle anderen nicht mehr buchbar. Im Live-Betrieb kommt jetzt automatisch eine Bestätigung per E-Mail mit Kalendereinladung.</p>
        <div class="acts"><button class="btn primary" id="bkIcs" type="button">In meinen Kalender (.ics)</button><button class="btn" id="bkNew" type="button">Weiteren Termin ansehen</button></div></div>`;
    } else if(st.step===3){
      h=steps()+`<div class="bk-body"><div class="bk-chosen"><b>${fmt(st.day,{weekday:'short',day:'numeric',month:'long'})} · ${st.time} Uhr</b><button type="button" id="bkBack">ändern</button></div>
        <form class="bk-form" id="bkForm" novalidate>
          <div class="row"><label>Name*<input type="text" name="name" autocomplete="name"></label><label>E-Mail*<input type="email" name="email" autocomplete="email"></label></div>
          <label>Telefon (optional)<input type="tel" name="tel" autocomplete="tel"></label>
          <label>Worum geht es Dir?*<textarea name="msg" placeholder="Ein, zwei Sätze reichen völlig."></textarea></label>
          <label class="consent"><input type="checkbox" name="ok"><span>Ich habe die <a href="https://www.rein-digital.com/datenschutzerklarung/">Datenschutzhinweise</a> gelesen und bin einverstanden, dass meine Angaben zur Terminvereinbarung verarbeitet werden.</span></label>
          <p class="bk-err" style="color:var(--rust);font-size:.85rem;min-height:1.2em"></p>
          <button class="btn primary" type="submit">Termin buchen <span class="arr">→</span></button>
        </form></div>`;
    } else {
      const wk=weeks[st.week];
      h=steps()+'<div class="bk-body">';
      h+=`<div class="bk-meta"><span>Kennenlernen</span><span>ca. ${DUR} Min.</span><span>Video · Telefon · vor Ort</span></div>`;
      h+=`<div class="wk-nav"><button type="button" id="wkPrev" ${st.week===0?'disabled':''}>← Woche</button><b>${fmt(wk[0],{day:'numeric',month:'short'})} – ${fmt(wk[4],{day:'numeric',month:'short'})}</b><button type="button" id="wkNext" ${st.week===weeks.length-1?'disabled':''}>Woche →</button></div>`;
      h+=`<div class="days">${wk.map(d=>{const n=free(d).length;return `<button type="button" class="day ${st.day&&iso(st.day)===iso(d)?'sel':''}" data-d="${iso(d)}" ${n?'':'disabled'}><small>${fmt(d,{weekday:'short'})}</small><b>${d.getDate()}</b><em>${n?n+' frei':'voll'}</em></button>`}).join('')}</div>`;
      if(st.step===1) h+=`<div class="bk-empty">Wähle einen Tag – dann siehst Du meine freien Uhrzeiten.</div>`;
      if(st.step===2&&st.day){const fr=free(st.day);
        h+=`<h3>${fmt(st.day,{weekday:'long',day:'numeric',month:'long'})}</h3><div class="slots">${SLOTS.map(t=>{const ok=fr.includes(t);return `<button type="button" class="slot" data-t="${t}" ${ok?'':'disabled'}>${t}<small>${ok?'frei':'vergeben'}</small></button>`}).join('')}</div>`;}
      h+='</div>';
    }
    bk.innerHTML=h;bind();
  };
  const bind=()=>{
    $$('.day',bk).forEach(b=>b.onclick=()=>{st.day=new Date(b.dataset.d+'T00:00');st.step=2;render()});
    $$('.slot',bk).forEach(b=>b.onclick=()=>{st.time=b.dataset.t;st.step=3;render();$('input[name=name]',bk).focus()});
    const p=$('#wkPrev'),n=$('#wkNext');
    if(p)p.onclick=()=>{st.week--;st.day=null;st.step=1;render()};
    if(n)n.onclick=()=>{st.week++;st.day=null;st.step=1;render()};
    const back=$('#bkBack');if(back)back.onclick=()=>{st.step=2;render()};
    const f=$('#bkForm');
    if(f)f.onsubmit=e=>{e.preventDefault();const fd=new FormData(f),err=$('.bk-err',f);
      if(!fd.get('name').trim()||!/^\S+@\S+\.\S+$/.test(fd.get('email'))||!fd.get('msg').trim()){err.textContent='Bitte Name, gültige E-Mail und Dein Anliegen ausfüllen.';return}
      if(!fd.get('ok')){err.textContent='Bitte bestätige noch die Datenschutzhinweise.';return}
      const all=load();
      if(all.some(x=>x.d===iso(st.day)&&x.t===st.time)){err.textContent='Dieser Termin wurde gerade vergeben – bitte wähle eine andere Uhrzeit.';setTimeout(()=>{st.step=2;render()},1400);return}
      st.last={d:iso(st.day)+'T00:00',t:st.time,name:fd.get('name').trim()};
      all.push({d:iso(st.day),t:st.time});save(all);st.step=4;render();
    };
    const ics=$('#bkIcs');
    if(ics)ics.onclick=()=>{const [hh,mm]=st.last.t.split(':').map(Number);const d=new Date(st.last.d);d.setHours(hh,mm);const e=new Date(d.getTime()+DUR*60000);
      const z=x=>x.getFullYear()+String(x.getMonth()+1).padStart(2,'0')+String(x.getDate()).padStart(2,'0')+'T'+String(x.getHours()).padStart(2,'0')+String(x.getMinutes()).padStart(2,'0')+'00';
      const txt=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//rein-digital//Termin//DE','BEGIN:VEVENT','UID:'+Date.now()+'@rein-digital','DTSTAMP:'+z(new Date()),'DTSTART:'+z(d),'DTEND:'+z(e),'SUMMARY:Gespräch mit Dr. Andreas Rein','END:VEVENT','END:VCALENDAR'].join('\r\n');
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/calendar'}));a.download='termin-andreas-rein.ics';a.click()};
    const nw=$('#bkNew');if(nw)nw.onclick=()=>{st=fresh();render()};
  };
  const rs=$('#demoReset');
  if(rs)rs.onclick=()=>{save([]);st=fresh();render()};
  render();
}

/* ---- reveal ---- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
})();
