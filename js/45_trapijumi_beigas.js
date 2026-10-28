// 45_trapijumi_beigas.js - Trāpījuma zīme tēmeklī, paziņojums "Tu nošāvi ...", telefona vibrācija, kara statistika un beigu ekrāns ar spēles varoni,
// vārdu birkas tuvu kamerai paslēptas (citādi pāri ekrānam milzīgs "★ A...")
Object.assign(T.lv,{kf_you:'🎯 Tu nošāvi: {n}',kf_mon:'🎯 Briesmonis pieveikts',ws_hero:'⭐ Spēles varonis',ws_k:'nošauti',ws_f:'karogi',ws_d:'krita',ws_mine:'Tava armija',ws_foe:'Labākie pretinieki',vib_on:'Vibrācija ieslēgta',vib_off:'Vibrācija izslēgta'});
Object.assign(T.en,{kf_you:'🎯 You took down: {n}',kf_mon:'🎯 Monster defeated',ws_hero:'⭐ Hero of the battle',ws_k:'kills',ws_f:'flags',ws_d:'fell',ws_mine:'Your army',ws_foe:'Best enemies',vib_on:'Vibration on',vib_off:'Vibration off'});
// ---------- vibrācija ----------
let vibOn=LS.get('vib',true);const vib=p=>{if(vibOn&&navigator.vibrate)try{navigator.vibrate(p);}catch(e){}};
{const b=document.createElement('button');b.className='corner';b.id='vibb';const paint=()=>{b.textContent=vibOn?'📳':'📴';};paint();
 b.onclick=e=>{vibOn=!vibOn;LS.set('vib',vibOn);paint();say(t(vibOn?'vib_on':'vib_off'),1.5);if(vibOn)vib(40);e.currentTarget.blur();};($('mus')||$('snd')).after(b);}
const _flashHurt45=flashHurt;flashHurt=function(){_flashHurt45();vib(60);};
{const b0=SFX.boom;SFX.boom=()=>{b0();vib([0,90]);};}
// ---------- trāpījuma zīme un paziņojums ----------
const hitEl=document.createElement('div');hitEl.id='hitm';document.body.appendChild(hitEl);
const kfEl=document.createElement('div');kfEl.id='killf';document.body.appendChild(kfEl);let kfT=null;
function hitMark(kill){hitEl.className='';void hitEl.offsetWidth;hitEl.className=kill?'on kill':'on';}
function killFeed(s){kfEl.textContent=s;kfEl.classList.add('on');clearTimeout(kfT);kfT=setTimeout(()=>kfEl.classList.remove('on'),1800);vib([30,40,30]);sfx('pick');}
const hmT=new Map();
// sh: 0 = saimnieks, >0 = drauga id; n: nošautā vārds (ja nošauts)
function hitFor(sh,kill,n){if(sh===0){hitMark(kill);if(kill)killFeed(n?tf('kf_you',{n}):t('kf_mon'));return;}
 const G=NET.guests.get(sh);if(!G)return;if(!kill&&gtime-(hmT.get(sh)||0)<.08)return;hmT.set(sh,gtime);netTo(G,{t:'hm',k:kill?1:0,n:n||''});}
const _netGuestMsg45=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='hm'){hitMark(d.k);if(d.k)killFeed(d.n?tf('kf_you',{n:d.n}):t('kf_mon'));return;}
 if(d&&d.t==='wst'){WST=d.S;if(winEl.style.display==='block')wstRender();return;}_netGuestMsg45(d);};
const shNow=()=>typeof SHOOTER==='number'?SHOOTER:0;
const _dmgMonster45=dmgMonster;dmgMonster=function(z,d,pl,rocket){const was=z.userData.dead,sh=shNow();_dmgMonster45(z,d,pl,rocket);if(pl&&sh>=0&&!was)hitFor(sh,!!z.userData.dead,'');};
// ---------- kara statistika (saimnieks skaita, draugiem aizsūta beigās) ----------
let WS=new Map(),WST=null;
function wsGet(key,n,side){let s=WS.get(key);if(!s){s={n,side,k:0,f:0,r:0,d:0,v:0,c:0};WS.set(key,s);}if(n)s.n=n;return s;}
const keyOf=c=>c==='P'?'P':c&&c.conn?'G'+c.id:c&&c.g?'B'+c.nid:null;
function humanKey(sh){if(sh===0)return['P',$('nickname').value||'?',MYSIDE];const G=NET.guests.get(sh);return G?['G'+G.id,G.name,ARMY.indexOf(GT(G))]:null;}
// bots, kurš šāva uz kritušo (ja nošāva bots)
function botKiller(v){let best=null,bd=60;const vp=v.p;for(const b of humans){if(b.dead||!b.tg)continue;const tg=b.tg;if(!(v.b?tg.b===v.b:v.G?tg.gst===v.G:tg.pl))continue;const d=Math.hypot(b.g.position.x-vp.x,b.g.position.z-vp.z);if(d<bd){bd=d;best=b;}}return best;}
function wsKill(victim,vKey,vName,vSide){if(!isWar()||NET.role==='guest')return null;wsGet(vKey,vName,vSide).d++;
 const lh=victim.b&&victim.b.lastHit,sh=lh&&gtime-lh.t<2?lh.sh:victim.sh;let K=null;
 if(sh!=null&&sh>=0){const h=humanKey(sh);if(h){const s=wsGet(h[0],h[1],h[2]);s.k++;K=sh;}}
 else{const b=botKiller(victim);if(b)wsGet('B'+b.nid,b.name,ARMY.indexOf(b.team)).k++;}
 return K;}
const _killBot45=killBot;killBot=function(b,src){const was=b.dead,sh=shNow(),lh=b.lastHit;_killBot45(b,src);if(was||!b.dead)return;
 const recent=lh&&gtime-lh.t<2&&lh.sh>=0?lh.sh:null;if(recent!=null)hitFor(recent,true,b.name);
 wsKill({b,p:b.g.position,sh:recent},'B'+b.nid,b.name,ARMY.indexOf(b.team));};
const _hurt45=hurt;hurt=function(h,dmg,src,pl,pierce){const sh=shNow();let pre=null;if(h.gst)pre=h.gst.dead;else if(h.pl)pre=health<=0;
 _hurt45(h,dmg,src,pl,pierce);if(h.b){if(pl&&sh>=0&&!h.b.dead)hitFor(sh,false,'');return;}
 if(pl&&sh>=0&&!(h.pl&&sh===0))hitFor(sh,false,'');
 if(h.gst&&!pre&&h.gst.dead){const G=h.gst;if(pl&&sh>=0)hitFor(sh,true,G.name);wsKill({G,p:G.pos,sh:pl?sh:null},'G'+G.id,G.name,ARMY.indexOf(GT(G)));}
 else if(h.pl&&!pre&&health<=0){const n=$('nickname').value||'?';if(pl&&sh>0)hitFor(sh,true,n);wsKill({p:player.position,sh:pl?sh:null},'P',n,MYSIDE);}};
// karogi: kas atnesa pretinieku karogu uz savu bāzi (+5) un kas atguva savējo (+2)
const _flagTick45=flagTick;flagTick=function(dt){const pre=FL.map(F=>F.carrier);_flagTick45(dt);if(NET.role==='guest')return;
 FL.forEach((F,i)=>{const c=pre[i];if(!c||F.carrier)return;const k=keyOf(c);if(!k)return;
  const side=c==='P'?MYSIDE:c.conn?ARMY.indexOf(GT(c)):ARMY.indexOf(c.team),n=c==='P'?($('nickname').value||'?'):c.name;
  if(F.held&&F.held!==F.team)wsGet(k,n,side).f++;else if(!F.held&&Math.hypot(F.x-F.home[0],F.z-F.home[1])<1)wsGet(k,n,side).r++;});};
const _warSetup45=warSetup;warSetup=function(){_warSetup45();WS=new Map();WST=null;};
const wsScore=s=>s.k+s.f*5+s.r*2+s.v*3+s.c*2;
function wsPack(){const L=[...WS.entries()].map(([key,s])=>[key[0]==='B'?0:1,s.n,s.side,s.k,s.f,s.r,s.d,s.v,s.c]);
 // cilvēki vienmēr sarakstā, arī ar nullēm
 const add=(key,n,side)=>{if(!WS.has(key))L.push([1,n,side,0,0,0,0,0,0]);};add('P',$('nickname').value||'?',MYSIDE);for(const G of NET.guests.values())if(G.ready)add('G'+G.id,G.name,ARMY.indexOf(GT(G)));return L;}
const _warWin45=warWin;warWin=function(T){if(NET.role!=='guest'&&isWar()){WST=wsPack();for(const G of NET.guests.values())if(G.ready)netTo(G,{t:'wst',S:WST});}_warWin45(T);};
function wstRender(){if(!WST||!winEl)return;const old=winEl.querySelector('.wst');if(old)old.remove();
 const sc=r=>r[3]+r[4]*5+r[5]*2+(r[7]||0)*3+(r[8]||0)*2,all=WST.slice().sort((a,b)=>sc(b)-sc(a)||b[0]-a[0]),hero=all[0],me=$('nickname').value||'?';
 const col=s=>s===0?'#ff3b3b':'#43e06b',row=r=>'<tr class="'+(r[0]&&r[1]===me?'me':'')+'"><td class="n"><span class="dot" style="background:'+col(r[2])+'"></span>'+(r[0]?'👤 ':'')+esc(r[1])+'</td><td class="v">🎯 '+r[3]+'</td><td class="v">🛡️ '+(r[7]||0)+'</td><td class="v">⭕ '+(r[8]||0)+'</td><td class="v">🚩 '+(r[4]+r[5])+'</td><td class="v">💀 '+r[6]+'</td></tr>';
 const mine=all.filter(r=>r[2]===MYSIDE),hum=mine.filter(r=>r[0]),top=mine.filter(r=>!r[0]).slice(0,Math.max(2,6-hum.length)),foe=all.filter(r=>r[2]!==MYSIDE).slice(0,3);
 const d=document.createElement('div');d.className='wst';
 d.innerHTML=(hero&&sc(hero)>0?'<div class="hero">'+t('ws_hero')+'<b>'+(hero[0]?'👤 ':'')+esc(hero[1])+'</b>🎯 '+hero[3]+' '+t('ws_k')+' · 🛡️ '+(hero[7]||0)+' '+t('ws_v')+' · ⭕ '+(hero[8]||0)+' '+t('ws_c')+' · 🚩 '+(hero[4]+hero[5])+' '+t('ws_f')+'</div>':'')+
  '<b>'+t('ws_mine')+'</b><table>'+hum.concat(top).sort((a,b)=>sc(b)-sc(a)).map(row).join('')+'</table>'+(foe.length?'<b>'+t('ws_foe')+'</b><table>'+foe.map(row).join('')+'</table>':'');
 const h1=winEl.querySelector('h1');if(h1)h1.after(d);else winEl.prepend(d);}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const _showWin45=showWin;showWin=function(w){_showWin45(w);if(NET.role!=='guest'&&!WST&&isWar())WST=wsPack();wstRender();};
// ---------- vārdu birkas tuvāk par 5 m kamerai neredz ----------
{const _render45=renderer.render.bind(renderer);renderer.render=function(s,c){const hid=[],cp=camera.position;
 for(const b of humans){const l=b.lab;if(l&&l.visible&&Math.hypot(l.position.x-cp.x,l.position.y-cp.y,l.position.z-cp.z)<5){l.visible=false;hid.push(l);if(b.bar){b.bar.bg.visible=b.bar.f.visible=false;hid.push(b.bar.bg,b.bar.f);}}}
 _render45(s,c);for(const o of hid)o.visible=true;};}
