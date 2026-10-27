// 49_misijas.js - Karā vienam spēlētājam: parastais karš vai viena no 5 misijām. Misijās tehnika neatjaunojas, spēlētājam 3 dzīvības.
// 1 ģenerālis: novāc pretinieka ģenerāli (20 pret 20). 2 nakts: noturi bāzi pret zombijiem, skeletiem, vilkiem, cilvēkēdāju un vilkati līdz rītam.
// 3 pilots: atrodi notriekto pilotu un nogādā bāzē (kājām vai ar helikopteru). 4 tanki: iznīcini visu pretinieka tehniku. 5 sabotāža: 7 minūtēs nojauc pretinieka torņus un helikopterus.
Object.assign(T.lv,{ms_:'⚔️ Karš',ms_gen:'🎖️ Ģenerālis',ms_night:'🌙 Nakts bāze',ms_rescue:'🪂 Pilots',ms_armor:'🛡️ Tanku kauja',ms_sabot:'💣 Sabotāža',
 md_:'Parastais karš: karogi, uzbrukumi, tehnika atjaunojas.',md_gen:'Novāc pretinieka ģenerāli viņa bāzē. 20 pret 20, tehnika neatjaunojas.',md_night:'Nakts. Noturi savu bāzi pret briesmoņu viļņiem līdz rītam. Beigās nāk vilkatis. Tev ir M16, bise, pistole, raķetes, molotovi un nakts brilles.',
 md_rescue:'Mūsu pilots notriekts. Atrodi viņu un atved uz bāzi, kājām vai ar helikopteru. Pretinieki arī viņu meklē.',md_armor:'Katrai pusei 6 tanki un helikopters. Iznīcini visu pretinieka tehniku. Visiem M16 vai Kalašņikovs ar 100 lodēm, bet savākt var tikai raķetes.',md_sabot:'7 minūtes. Nojauc pretinieka bāzes 4 torņus un 2 helikopterus. Tev ir raķetes, Javelin un molotovi.',
 mt_gen:'🎖️ Ģenerālis {n}: {d} m {a}',mt_night:'🌙 Līdz rītam {h} st. · vilnis {w} · 🧟 {z}',mt_find:'🪂 Pilots: {d} m {a}',mt_home:'🏠 Bāze: {d} m {a} · pilots ❤️ {hp}',mt_armor:'🛡️ Pretinieka tehnika: {n} · tuvākā {d} m {a}',mt_sabot:'💣 Mērķi: {n} · ⏱ {t} · tuvākais {d} m {a}',
 ms_win:'🏆 Misija izpildīta!',ms_fail:'💀 Misija neizdevās',ms_next:'▶️ Nākamā misija',ms_again:'🔁 Vēlreiz',ms_brief:'Uzdevums',ms_lives:'❤️ Dzīvības: {n}',
 mr_gen:'Ģenerālis {n} ir pieveikts!',mr_night:'Bāze nosargāta līdz rītam!',mr_rescue:'Pilots {n} ir mājās!',mr_armor:'Visa pretinieka tehnika iznīcināta!',mr_sabot:'Pretinieka bāze sagrauta!',
 mf_dead:'Dzīvības beigušās.',mf_pilot:'Pilots {n} krita.',mf_time:'Laiks beidzās.',
 m_found:'🪂 {n}: "Paldies! Vedam mani uz bāzi!"',m_board:'🚁 {n} iekāpa helikopterā. Lido uz bāzi!',m_wave:'🧟 Nāk vilnis {n}!',m_boss:'🐺 Vilkatis nāk! Visi pie ieročiem!',m_gen_r:'📻 Ģenerālis {n} ir savā bāzē, sargi ap viņu.',
 m_left:'❤️ Atlikušas dzīvības: {n}',m_tgt:'💣 Mērķis iznīcināts! Atlikuši: {n}',m_veh:'🛡️ Pretinieka tehnika iznīcināta! Atlikusi: {n}'});
Object.assign(T.en,{ms_:'⚔️ War',ms_gen:'🎖️ General',ms_night:'🌙 Night base',ms_rescue:'🪂 Pilot',ms_armor:'🛡️ Tank battle',ms_sabot:'💣 Sabotage',
 md_:'Normal war: flags, attacks, vehicles come back.',md_gen:'Take out the enemy general in his base. 20 against 20, no new vehicles.',md_night:'Night. Hold your base against waves of monsters until morning. A werewolf comes at the end. You get an M16, shotgun, pistol, rockets, molotovs and night goggles.',
 md_rescue:'Our pilot was shot down. Find him and bring him to base, on foot or by helicopter. The enemy is looking for him too.',md_armor:'Each side has 6 tanks and a helicopter. Destroy all enemy vehicles. Everyone gets an M16 or AK with 100 bullets, but you can only pick up rockets.',md_sabot:'7 minutes. Destroy the 4 towers and 2 helicopters in the enemy base. You get rockets, a Javelin and molotovs.',
 mt_gen:'🎖️ General {n}: {d} m {a}',mt_night:'🌙 Morning in {h} h · wave {w} · 🧟 {z}',mt_find:'🪂 Pilot: {d} m {a}',mt_home:'🏠 Base: {d} m {a} · pilot ❤️ {hp}',mt_armor:'🛡️ Enemy vehicles: {n} · nearest {d} m {a}',mt_sabot:'💣 Targets: {n} · ⏱ {t} · nearest {d} m {a}',
 ms_win:'🏆 Mission complete!',ms_fail:'💀 Mission failed',ms_next:'▶️ Next mission',ms_again:'🔁 Again',ms_brief:'Mission',ms_lives:'❤️ Lives: {n}',
 mr_gen:'General {n} is down!',mr_night:'The base held until morning!',mr_rescue:'Pilot {n} is home!',mr_armor:'All enemy vehicles destroyed!',mr_sabot:'The enemy base is wrecked!',
 mf_dead:'No lives left.',mf_pilot:'Pilot {n} fell.',mf_time:'Time is up.',
 m_found:'🪂 {n}: "Thank you! Get me to the base!"',m_board:'🚁 {n} is in the helicopter. Fly to base!',m_wave:'🧟 Wave {n} is coming!',m_boss:'🐺 The werewolf is coming! Everyone to arms!',m_gen_r:'📻 General {n} is in his base, guarded.',
 m_left:'❤️ Lives left: {n}',m_tgt:'💣 Target destroyed! Left: {n}',m_veh:'🛡️ Enemy vehicle destroyed! Left: {n}'});
const MISK=['','gen','night','rescue','armor','sabot'];
let MIS=LS.get('mis','');if(!MISK.includes(MIS))MIS='';
let MS=null,misAllow=false,misLobby=false;
const misOn=()=>!!(MS&&isWar());
// ---------- izvēle sākuma ekrānā (tikai karā, ne ar uzaicinājuma saiti) ----------
{const row=document.createElement('div');row.id='misrow';row.innerHTML=MISK.map(k=>'<button class="corner" data-k="'+k+'"></button>').join('')+'<small id="misdesc"></small>';$('diffrow').before(row);
 row.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();MIS=b.dataset.k;LS.set('mis',MIS);paintMis();});}
function paintMis(){const row=$('misrow');row.style.display=MODE==='war'&&!/[?&]join=/.test(location.search)?'flex':'none';
 row.querySelectorAll('button').forEach(b=>{b.textContent=t('ms_'+b.dataset.k);b.classList.toggle('on',b.dataset.k===MIS);});$('misdesc').textContent=t('md_'+MIS);}
const _paintMode49=paintMode;paintMode=function(){_paintMode49();paintMis();};paintMis();
const _applyLang49=applyLang;applyLang=function(){_applyLang49();paintMis();};
const _lobbyBegin49=lobbyBegin;lobbyBegin=function(){misLobby=true;try{_lobbyBegin49();}finally{misLobby=false;}};
// ---------- palīgi ----------
const misMy=()=>ARMY[MYSIDE],misEn=()=>ARMY[1-MYSIDE],misB=T=>WB[ARMY.indexOf(T)];
function misDrop(b){scene.remove(b.g);freeObj(b.g);delBar(b.bar);delLabel(b.lab);const i=humans.indexOf(b);if(i>=0)humans.splice(i,1);const k=b.team.members.indexOf(b);if(k>=0)b.team.members.splice(k,1);b.dead=true;}
// atstāj n botus (pavadoņus patur), vienības pārrēķina
function misTrim(T,n){const L=T.members.filter(b=>!b.trader).sort((a,b)=>(a.wrole==='esc')-(b.wrole==='esc'));while(L.length>n)misDrop(L.shift());
 for(let i=SQ.length-1;i>=0;i--){const S=SQ[i];S.mem=S.mem.filter(b=>humans.includes(b));S.init=S.mem.length;if(!S.mem.length)SQ.splice(i,1);}}
// virziens uz mērķi kā bulta attiecībā pret skatu
const MARW=['⬆️','↖️','⬅️','↙️','⬇️','↘️','➡️','↗️'];
function misPoint(x,z){const p=player.position,dx=x-p.x,dz=z-p.z,a=Math.atan2(-dx,-dz);let r=a-yaw;r=Math.atan2(Math.sin(r),Math.cos(r));return{d:Math.round(Math.hypot(dx,dz)),a:MARW[((Math.round(r/(Math.PI/4))%8)+8)%8]};}
function misSpawn(fn,x,z){const n=zombies.length;MODE='surv';try{fn();}finally{MODE='war';}const m=zombies.length>n?zombies[zombies.length-1]:null;if(!m)return null;
 const s=freeSpot(x,z,.6,0,12)||[x,z];m.position.x=s[0];m.position.z=s[1];return m;}
function misGun(b){const I=b.I,w=Math.random()<.5?'m16':'ak';I.has[w]=true;I.ammo[w]=100;b.misAm=true;return w;}
const MISGK=['gun','ammo','pistol','a_pistol','shot','a_shot','m16','a_m16','ak','a_ak','snip','a_snip'],MISRK=['a_rpg','a_rpg','rpg','a_jav','jav'];
const _giveLoot49=giveLoot;giveLoot=function(k,I,Tm){if(misOn()&&MS.k==='armor'&&MISGK.includes(k))k=MISRK[Math.floor(Math.random()*MISRK.length)];return _giveLoot49(k,I,Tm);};
function misGear(){inv.has.rpg=true;inv.ammo.rpg=Math.max(inv.ammo.rpg||0,8);inv.has.molo=true;inv.ammo.molo=Math.max(inv.ammo.molo||0,3);updateAmmo();renderInv();renderW();}
function misMarker(b){const c=new THREE.Mesh(new THREE.ConeGeometry(.45,.9,4),new THREE.MeshBasicMaterial({color:0xffd600}));c.rotation.x=Math.PI;c.position.y=3.4;b.g.add(c);b.mark=c;
 const cap=cube(.58,.16,.58,0xffc107,.4);cap.position.y=2.08;b.g.add(cap);}
// ---------- misiju sākums ----------
const MSET={
 gen(){misTrim(misMy(),20);misTrim(misEn(),20);const E=misEn(),B=misB(E);const D=SQ.find(S=>S.team===E&&S.role==='def');const b=(D&&D.mem[0])||E.members[0];if(!b)return;
  b.gen=true;b.heavy=true;b.lives=1;b.wrole='def';b.post={x:B.x-8*B.d,z:B.z+4*B.d};b.g.position.set(b.post.x,0,b.post.z);misMarker(b);MS.gen=b;setTimeout(()=>{if(MS&&MS.gen===b)say(tf('m_gen_r',{n:b.name}),4);},9000);},
 night(){misTrim(misMy(),12);misTrim(misEn(),0);for(const S of SQ)if(S.team===misMy()){S.role='def';S.phase='def';S.mem.forEach(b=>{b.wrole='def';});}
  hour=20.6;MS.wv=0;MS.wt=gtime+10;MS.boss=false;giveLoot('nv',inv);for(const w of ['pistol','shot','m16']){inv.has[w]=true;inv.ammo[w]=WP[w].max;}misGear();selectW('m16');},
 rescue(){misTrim(misMy(),12);misTrim(misEn(),20);const c=LMS.filter(l=>l.k==='stad'||l.k==='fab')[Math.floor(Math.random()*2)],x=c.x+(c.k==='stad'?0:-12),z=c.z+(c.k==='stad'?-12:10);
  wreckAt(x+4,z+2);const nm=NAMES[Math.floor(Math.random()*NAMES.length)],I=botInv(true);I.has.m16=true;I.ammo.m16=60;const b=newBot(misMy(),x,z,nm,I);b.pil=true;b.hp=70;b.wrole='pil';b.lives=1;MS.pil=b;MS.site={x,z};
  const E=misEn(),A=SQ.filter(S=>S.team===E&&S.role==='att').flatMap(S=>S.mem).slice(0,7);if(A.length){for(const S of SQ)S.mem=S.mem.filter(q=>!A.includes(q));const S=makeSquad(E,A,'att','M',20);S.route=[[x*.7,z*.7],[x,z]];}},
 armor(){misTrim(misMy(),12);misTrim(misEn(),14);
  // katrai pusei 6 tanki (bruņumašīnu nav) un 1 helikopters
  for(const t2 of [...tanks])if(t2.kind==='apc'){scene.remove(t2.g);freeObj(t2.g);remOb(t2.ob);tanks.splice(tanks.indexOf(t2),1);}
  WB.forEach((B,ai)=>{const a=B.d>0?Math.PI:0;for(let k=0;k<4;k++){const t2=addTank(B.x-12+k*8,B.z-26*B.d,a);t2.army=ARMY[ai];}});
  const keep=WB.map(B=>HELIS.find(H=>H.st!=='gone'&&Math.hypot(H.x-B.x,H.z-B.z)<45));
  for(const H of HELIS)if(H.st!=='gone'&&!keep.includes(H)){H.st='gone';H.rs=1e9;remOb(H.ob);scene.remove(H.g);}
  const E=misEn(),ds=E.members.filter(b=>b.wrole!=='esc');const off=b=>{for(const S of SQ)S.mem=S.mem.filter(q=>q!==b);b.sq=null;};
  for(const t2 of tanks)if(t2.army===E&&!t2.dead){const b=ds.shift();if(b){off(b);b.g.position.set(t2.g.position.x+2.5,0,t2.g.position.z);botTankBoard(b,t2);}}
  MS.eh=keep[ARMY.indexOf(E)]||null;if(MS.eh){const b=ds.shift();if(b){off(b);b.g.position.set(MS.eh.x+2,0,MS.eh.z);botHeliBoard(b,MS.eh);}}
  MS.veh=tanks.filter(t2=>t2.army===E).length+(MS.eh?1:0);
  for(const b of humans)if(ARMY.includes(b.team))misGun(b);selectW(misGun({I:inv}));renderInv();updateAmmo();renderW();},
 sabot(){misTrim(misMy(),8);misTrim(misEn(),22);const B=misB(misEn());MS.tw=TOWERS.filter(T2=>Math.hypot(T2.x-B.x,T2.z-B.z)<60);MS.he=HELIS.filter(H=>H.st!=='gone'&&Math.hypot(H.x-B.x,H.z-B.z)<45);
  MS.end=gtime+420;hour=22;giveLoot('nv',inv);misGear();inv.has.jav=true;inv.ammo.jav=Math.max(inv.ammo.jav||0,3);renderInv();}};
const _warSetup49=warSetup;warSetup=function(){_warSetup49();MS=null;$('misbrief').style.display='none';
 if(!MIS||misLobby||NET.role==='guest'||NET.guests.size)return;
 MS={k:MIS,lives:3,over:false};MSET[MIS]();misBrief();};
const _start49=start;start=function(){MS=null;_start49();paintMis();};
// ---------- uzdevuma kartīte ----------
{const d=document.createElement('div');d.id='misbrief';d.className='panel';d.onclick=()=>{d.style.display='none';};document.body.appendChild(d);}
let misBriefT=null;
function misBrief(){const d=$('misbrief');d.innerHTML='<small>'+t('ms_brief')+'</small><h2>'+t('ms_'+MS.k)+'</h2><p>'+t('md_'+MS.k)+'</p><small>'+tf('ms_lives',{n:MS.lives})+'</small>';d.style.display='block';clearTimeout(misBriefT);misBriefT=setTimeout(()=>{d.style.display='none';},9000);}
// ---------- beigas: uzvara vai zaudējums ----------
const _warWin49=warWin;warWin=function(T){if(misOn()&&!misAllow)return;_warWin49(T);};
function misEnd(win,why){if(!MS||MS.over)return;MS.over=true;RESP.length=0;winner=null;misAllow=true;try{warWin(win?misMy():misEn());}finally{misAllow=false;}
 const h=winEl.querySelector('h1');if(h)h.textContent=t(win?'ms_win':'ms_fail');const p=document.createElement('p');p.className='misres';p.textContent=why;if(h)h.after(p);
 const a=$('warnew');if(a)a.textContent=t('ms_again');const i=MISK.indexOf(MS.k);
 if(win&&a&&i<MISK.length-1){const n=document.createElement('button');n.id='misnext';n.textContent=t('ms_next');n.onclick=()=>{MIS=MISK[i+1];LS.set('mis',MIS);paintMis();winEl.style.display='none';start();};a.after(n);}}
const _gameOver49=gameOver;gameOver=function(){_gameOver49();if(!misOn()||MS.over)return;MS.lives--;
 if(MS.lives<=0)setTimeout(()=>{if(!MS||MS.over)return;$('dead').style.display='none';misEnd(false,t('mf_dead'));},1500);};
const _resume49=resume;resume=function(){_resume49();if(misOn()&&!MS.over){if(MS.k==='armor'){selectW(misGun({I:inv}));updateAmmo();renderInv();renderW();}say(tf('m_left',{n:MS.lives}),2.5);}};
// ---------- misijās tehnika neatjaunojas ----------
function misNoResp(){for(const H of HELIS)if(H.st==='gone')H.rs=1e9;for(const t2 of tanks)if(t2.dead)t2.home=null;for(let i=0;i<SLOTS.length;i++)if(!JETS.some(J=>J.slot===i&&J.st!=='gone'))slotT[i]=1e9;}
const _dawn49=dawn;dawn=function(){const had=new Set(JETS);_dawn49();if(!misOn())return;for(let k=JETS.length-1;k>=0;k--){const J=JETS[k];if(had.has(J))continue;scene.remove(J.g);freeObj(J.g);remOb(J.ob);JETS.splice(k,1);}};
// ---------- botu uzvedība misijās ----------
const _botThink49=botThink;botThink=function(b){
 if(b.gen&&!b.dead){for(const k of ['jetGoal','heliGoal','tankGoal']){if(b[k]&&b[k].res===b)b[k].res=null;b[k]=null;}if(b.sq){b.sq.mem=b.sq.mem.filter(q=>q!==b);b.sq=null;}
  if(!nearestThreat(b)){const p=b.g.position;if(Math.hypot(p.x-b.post.x,p.z-b.post.z)>3)goal(b,b.post.x,b.post.z,false);else b.gx=null;b.follow=false;b.tg=null;return;}return _botThink49(b);}
 if(b.pil&&!b.dead){if(b.carry)return;if(!MS||!MS.found){for(const k of ['jetGoal','heliGoal','tankGoal'])b[k]=null;if(nearestThreat(b))return _botThink49(b);const p=b.g.position,s=MS&&MS.site;if(s&&Math.hypot(p.x-s.x,p.z-s.z)>3)goal(b,s.x,s.z,false);else b.gx=null;b.follow=false;return;}
  b.wrole='esc';b.cmd='follow';}
 _botThink49(b);};
const _hurtBot49=hurtBot;hurtBot=function(b,d,s,pl,pi){_hurtBot49(b,b.gen?d/1.5:d,s,pl,pi);};
// ---------- misiju cikls ----------
const MTICK={
 gen(){const g=MS.gen;if(!g)return;if(g.mark)g.mark.rotation.y+=.08;if(g.dead||!humans.includes(g))misEnd(true,tf('mr_gen',{n:g.name}));},
 night(dt){const B=misB(misMy());
  if(gtime>=MS.wt&&(hour>=20.5||hour<5)&&zombies.filter(z=>!z.userData.dead).length<45){MS.wv++;MS.wt=gtime+12;const w=MS.wv,a0=Math.random()*Math.PI/2,sp=fn=>{const a=Math.max(0,Math.min(Math.PI/2,a0+(Math.random()-.5)*.7)),r=52+Math.random()*12;misSpawn(fn,B.x+B.d*Math.cos(a)*r,B.z+B.d*Math.sin(a)*r);};
   // katrs vilnis nāk no vienas puses un ir lielāks
   say(tf('m_wave',{n:w}),2.5);for(let i=0;i<Math.min(18,4+w*3);i++)sp(()=>spawnZombie(false));if(w>=2)for(let i=0;i<Math.min(6,w);i++)sp(spawnSkeleton);if(w>=2)for(let i=0;i<Math.min(4,w-1);i++)sp(spawnWolf);if(w===4||w===7||w===9)sp(spawnCannibal);}
  if(!MS.boss&&hour>=1.5&&hour<5){MS.boss=true;say(t('m_boss'),4);sfx('howl');const a=Math.PI/4;misSpawn(spawnBoss,B.x+B.d*Math.cos(a)*62,B.z+B.d*Math.sin(a)*62);}
  if(hour>=6&&hour<12)misEnd(true,t('mr_night'));},
 rescue(){const b=MS.pil;if(!b||b.dead||!humans.includes(b)){misEnd(false,tf('mf_pilot',{n:b?b.name:''}));return;}
  const p=b.g.position,P=player.position,H=heliMode;
  if(b.carry){const C=b.carry;if(C.st==='gone'){b.carry=null;b.inside=false;b.g.visible=true;killBot(b,misEn());return;}
   p.set(C.x,0,C.z);if(H!==C){b.carry=null;b.inside=false;b.g.visible=true;b.follow=true;}}
  else if(active){if(!MS.found&&!inTank&&!jetMode&&(H?H.y<3&&Math.hypot(H.x-p.x,H.z-p.z)<10:Math.hypot(P.x-p.x,P.z-p.z)<4)){MS.found=true;say(tf('m_found',{n:b.name}),3);sfx('pick');}
   if(MS.found&&H&&H.y<3&&Math.hypot(H.x-p.x,H.z-p.z)<10){b.carry=H;b.inside=true;b.g.visible=false;b.gx=null;b.tg=null;say(tf('m_board',{n:b.name}),3);}}
  const B=misB(misMy()),q=b.carry?{x:b.carry.x,z:b.carry.z}:p;if(MS.found&&Math.hypot(q.x-B.x,q.z-B.z)<32&&(!b.carry||b.carry.y<4))misEnd(true,tf('mr_rescue',{n:b.name}));},
 armor(){for(const b of humans)if(!b.misAm&&ARMY.includes(b.team))misGun(b);const n=tanks.filter(t2=>t2.army===misEn()&&!t2.dead).length+(MS.eh&&MS.eh.st!=='gone'?1:0);if(MS.left!==undefined&&n<MS.left&&n>0)say(tf('m_veh',{n}),2.5);MS.left=n;if(!n)misEnd(true,t('mr_armor'));},
 sabot(){const n=MS.tw.filter(T2=>!T2.dead).length+MS.he.filter(H=>H.st!=='gone').length;if(MS.left!==undefined&&n<MS.left&&n>0)say(tf('m_tgt',{n}),2.5);MS.left=n;
  if(!n){misEnd(true,t('mr_sabot'));return;}if(gtime>MS.end)misEnd(false,t('mf_time'));}};
const MHUD={
 gen(){const g=MS.gen;if(!g)return'';const q=misPoint(g.g.position.x,g.g.position.z);return tf('mt_gen',{n:g.name,d:q.d,a:q.a});},
 night(){return tf('mt_night',{h:Math.ceil((30-hour)%24),w:MS.wv,z:zombies.filter(z=>!z.userData.dead).length});},
 rescue(){const b=MS.pil;if(!b)return'';if(!MS.found){const q=misPoint(b.g.position.x,b.g.position.z);return tf('mt_find',{d:q.d,a:q.a});}const B=misB(misMy()),q=misPoint(B.x,B.z);return tf('mt_home',{d:q.d,a:q.a,hp:Math.max(0,Math.ceil(b.hp))});},
 armor(){const L=tanks.filter(t2=>t2.army===misEn()&&!t2.dead).map(t2=>[t2.g.position.x,t2.g.position.z]);if(MS.eh&&MS.eh.st!=='gone')L.push([MS.eh.x,MS.eh.z]);let best=null,bd=1e9;for(const c of L){const d=Math.hypot(c[0]-player.position.x,c[1]-player.position.z);if(d<bd){bd=d;best=c;}}
  const q=best?misPoint(best[0],best[1]):{d:0,a:''};return tf('mt_armor',{n:L.length+'/'+MS.veh,d:q.d,a:q.a});},
 sabot(){const L=[...MS.tw.filter(T2=>!T2.dead).map(T2=>[T2.x,T2.z]),...MS.he.filter(H=>H.st!=='gone').map(H=>[H.x,H.z])];let best=null,bd=1e9;for(const c of L){const d=Math.hypot(c[0]-player.position.x,c[1]-player.position.z);if(d<bd){bd=d;best=c;}}
  const q=best?misPoint(best[0],best[1]):{d:0,a:''},s=Math.max(0,Math.ceil(MS.end-gtime));return tf('mt_sabot',{n:L.length+'/'+(MS.tw.length+MS.he.length),t:Math.floor(s/60)+':'+String(s%60).padStart(2,'0'),d:q.d,a:q.a});}};
const _warHud49=warHud;warHud=function(){_warHud49();if(!misOn()||!active)return;wbar.textContent=MHUD[MS.k]()+' · '+'❤️'.repeat(Math.max(0,MS.lives));};
const _updateFx49=updateFx;updateFx=function(dt){_updateFx49(dt);if(!misOn()||MS.over||NET.role==='guest')return;misNoResp();MTICK[MS.k](dt);};
