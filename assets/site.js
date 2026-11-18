/* always start at the top on load/reload (unless a #anchor is targeted) */
if('scrollRestoration' in history)history.scrollRestoration='manual';
(()=>{const nav=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];if(nav&&nav.type==='reload'&&location.hash)history.replaceState(null,'',location.pathname+location.search);if(location.hash)return;let user=false;['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,()=>user=true,{once:true,passive:true}));const top=()=>{if(!user&&!location.hash)window.scrollTo(0,0)};top();addEventListener('DOMContentLoaded',top);addEventListener('load',()=>{top();requestAnimationFrame(top);setTimeout(top,120);setTimeout(top,400)});addEventListener('pageshow',e=>{if(e.persisted)top()})})();

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

/* ---- Calendly (two-click: loads only after consent click) ---- */
const cal=$('#cal');
if(cal){const load=()=>{if(cal.classList.contains('loaded'))return;cal.classList.add('loaded');
  const u=cal.dataset.url+'?hide_gdpr_banner=1&hide_landing_page_details=1&primary_color=177ec2&text_color=0e1b2e';
  cal.innerHTML='<div class="cal-frame calendly-inline-widget" data-url="'+u+'"></div>';
  const sc=document.createElement('script');sc.src='https://assets.calendly.com/assets/external/widget.js';sc.async=true;document.body.appendChild(sc);
  try{sessionStorage.setItem('rd-cal','1')}catch(e){}};
  const btn=$('#calLoad');if(btn)btn.onclick=load;
  try{if(sessionStorage.getItem('rd-cal'))load()}catch(e){}
}

/* ---- reveal ---- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
})();
