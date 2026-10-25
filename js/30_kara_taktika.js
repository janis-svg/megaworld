// 30_kara_taktika.js - Karā: armijas izvēle (arī draugam), botu vienības ar plānu un piesegumu no gaisa, zvaigznes par uzvarām un pakāpes,
// snaipera šautene novērošanas torņos, raķete sagrauj torni, iznīcinātā tehnika drīz atjaunojas bāzē, gaisa piegādes
Object.assign(T.lv,{side:'Mana armija',s_red:'🔴 Sarkanā',s_green:'🟢 Zaļā',sidepick:'Izvēlies savu armiju',joined_r:'{n} pievienojās sarkanajai armijai',joined_g:'{n} pievienojās zaļajai armijai',
 r_plan:'📻 Komandieris: plāns „{p}”. {d}',p_flang:'Flangi',p_zibens:'Zibens uzbrukums',p_viltiba:'Viltība',p_cietoksnis:'Cietoksnis',
 rd_flang:'Divas vienības iet no sāniem, trešā vēlāk pa vidu.',rd_zibens:'Visi kopā pa vidu, tehnika palīdz.',rd_viltiba:'Viena vienība uzbrūk pa vidu, pārējās pēc tam no sāniem.',rd_cietoksnis:'Sargājam bāzi, viena vienība iet no sāna.',
 r_go:'📻 {n}: dodamies uzbrukumā!',r_att:'📻 {n}: esam pie ienaidnieka bāzes!',r_ret:'📻 {n}: lieli zaudējumi, atkāpjamies!',r_new:'📻 Komandieris: jauna vienība {n} dodas uzbrukumā!',r_air:'📻 Helikopters piesedz vienību {n}',
 st_long:'tālais šāviens',st_multi:'vēl viens!',st_flag:'karoga nesējs',st_heavy:'bruņots',st_pilot:'pilots',st_tank:'tanks',st_apc:'bruņmašīna',st_heli:'helikopters',st_jet:'lidmašīna',
 rank_up:'🎖️ Jauna pakāpe: {n}!',ranks:'Kareivis,Kaprālis,Seržants,Virsseržants,Leitnants,Kapteinis,Majors,Pulkvedis,Ģenerālis',
 wsnip:'Snaipera šautene',snip_got:'🔭 Tornī atradi snaipera šauteni! Viens trāpījums notriec cilvēku.',tw_fall:'💥 Novērošanas tornis sabruka!',air_drop:'📻 Gaisa piegāde! Meklē 🪂 kartē.'});
Object.assign(T.en,{side:'My army',s_red:'🔴 Red',s_green:'🟢 Green',sidepick:'Choose your army',joined_r:'{n} joined the red army',joined_g:'{n} joined the green army',
 r_plan:'📻 Commander: plan "{p}". {d}',p_flang:'Flanks',p_zibens:'Blitz',p_viltiba:'Feint',p_cietoksnis:'Fortress',
 rd_flang:'Two squads go round the sides, the third later through the middle.',rd_zibens:'Everyone together through the middle, vehicles help.',rd_viltiba:'One squad attacks the middle, the others then from the sides.',rd_cietoksnis:'We guard the base, one squad goes round a side.',
 r_go:'📻 {n}: moving out!',r_att:'📻 {n}: we are at the enemy base!',r_ret:'📻 {n}: heavy losses, falling back!',r_new:'📻 Commander: new squad {n} is attacking!',r_air:'📻 Helicopter covers squad {n}',
 st_long:'long shot',st_multi:'another one!',st_flag:'flag carrier',st_heavy:'armoured',st_pilot:'pilot',st_tank:'tank',st_apc:'armoured car',st_heli:'helicopter',st_jet:'jet',
 rank_up:'🎖️ New rank: {n}!',ranks:'Private,Corporal,Sergeant,Staff sergeant,Lieutenant,Captain,Major,Colonel,General',
 wsnip:'Sniper rifle',snip_got:'🔭 You found a sniper rifle in the tower! One hit takes down a person.',tw_fall:'💥 A watchtower collapsed!',air_drop:'📻 Air drop! Look for 🪂 on the map.'});
// ---------- armijas izvēle ----------
{const row=document.createElement('div');row.id='siderow';row.innerHTML='<small>'+'</small>'+[0,1].map(k=>'<button class="corner" data-s="'+k+'"></button>').join('');$('diffrow').before(row);
 row.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();MYSIDE=+b.dataset.s;LS.set('side',MYSIDE);paintSide();});}
function paintSide(){const row=$('siderow');row.style.display=MODE==='war'&&!/[?&]join=/.test(location.search)?'flex':'none';row.querySelector('small').textContent=t('side')+':';
 row.querySelectorAll('button').forEach(b=>{b.textContent=t(+b.dataset.s?'s_green':'s_red');b.classList.toggle('on',+b.dataset.s===MYSIDE);});}
const _paintMode15=paintMode;paintMode=function(){_paintMode15();paintSide();};paintSide();
const _applyLang15=applyLang;applyLang=function(){_applyLang15();paintSide();};
// draugs pēc pievienošanās izvēlas armiju
let sideChosen=false; // draugs armiju izvēlas vienreiz; jaunā spēlē tā pati
const spEl=document.createElement('div');spEl.id='sidepick';spEl.className='panel';document.body.appendChild(spEl);
function showSidePick(def){spEl.innerHTML='<b>'+t('sidepick')+'</b><br>'+[0,1].map(k=>'<button class="corner'+(k===def?' on':'')+'" data-s="'+k+'">'+t(k?'s_green':'s_red')+'</button>').join('');spEl.style.display='block';
 spEl.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();MYSIDE=+b.dataset.s;sideChosen=true;netSend({t:'side',s:MYSIDE});spEl.style.display='none';});}
// ---------- zvaigznes par uzvarām un pakāpes ----------
let SHOOTER=0,HITPL=false,myStars=0;const lastKill={};
const ownId=o=>o==='P'?0:o&&o.pos?o.id:-1;
const RANKT=[0,5,15,30,50,80,120,170,230];
const rankOf=s=>{let r=0;for(let i=0;i<RANKT.length;i++)if(s>=RANKT[i])r=i;return r;};
const rankName=i=>t('ranks').split(',')[i]||'';
const starEl=document.createElement('div');starEl.id='starpop';document.body.appendChild(starEl);let starT=null;
function showStars(n,why){const r0=rankOf(myStars);myStars+=n;starEl.innerHTML='<b>'+'⭐'.repeat(n)+'</b>'+(why&&why.length?'<small>'+why.map(k=>t('st_'+k)).join(' · ')+'</small>':'');starEl.className='show';
 clearTimeout(starT);starT=setTimeout(()=>starEl.className='',1600);[880,1175,1568].slice(0,Math.min(3,n)).forEach((f,i)=>tone(f,.12,'triangle',.09,0,i*.08));
 const r1=rankOf(myStars);if(r1>r0){say(tf('rank_up',{n:rankName(r1)}),3.5);fanfare();}}
function giveStars(sh,n,why){n=Math.max(1,Math.min(5,n));if(sh===0)showStars(n,why);else{const G=NET.guests.get(sh);if(G)netTo(G,{t:'stars',n,w:why});}}
function shooterTeam(sh){return sh===0?PT:GT(NET.guests.get(sh));}
function shooterPos(sh){return sh===0?player.position:(NET.guests.get(sh)||{}).pos;}
function multiBonus(sh,why){const m=gtime-(lastKill[sh]||-99)<5;lastKill[sh]=gtime;if(m)why.push('multi');return m?1:0;}
const _hurtBot15=hurtBot;hurtBot=function(b,d,s,pl,pi){if(pl)b.lastHit={sh:SHOOTER,t:gtime};_hurtBot15(b,d,s,pl,pi);};
const _killBot15=killBot;killBot=function(b,src){const was=!b.dead,lh=b.lastHit,wasPilot=!!(b.jet||b.heli||b.tankV),carrier=FL.some(F=>F.carrier===b);_killBot15(b,src);
 if(!was||!isWar()||NET.role==='guest'||!lh||gtime-lh.t>2||lh.sh<0)return;const sh=lh.sh,ST=shooterTeam(sh);if(!ST||b.team===ST||!ST.enemies.has(b.team))return;
 const why=[];let n=1;if(b.heavy){n++;why.push('heavy');}if(carrier){n++;why.push('flag');}if(wasPilot){n+=2;why.push('pilot');}
 const sp=shooterPos(sh);if(sp&&Math.hypot(sp.x-b.g.position.x,sp.z-b.g.position.z)>55){n++;why.push('long');}n+=multiBonus(sh,why);giveStars(sh,n,why);};
function vehStars(kind,owner){if(!isWar()||!HITPL||SHOOTER<0||NET.role==='guest')return;const ST=shooterTeam(SHOOTER);if(!ST||!owner||owner===ST||!ST.enemies.has(owner))return;
 const why=[kind];giveStars(SHOOTER,{apc:3,tank:4,heli:4,jet:5}[kind]+multiBonus(SHOOTER,why),why);}
const _destroyTank15=destroyTank;destroyTank=function(t,team,n){const was=!t.dead,own=t.driver?t.driver.team:t===inTank?PT:t.army;_destroyTank15(t,team,n);if(was&&t.dead)vehStars(t.kind==='apc'?'apc':'tank',own);};
const _destroyHeli15=destroyHeli;destroyHeli=function(H,team){const was=H.st!=='gone',own=heliTeam(H)||H.owner;_destroyHeli15(H,team);if(was)vehStars('heli',own);if(isWar())H.rs=15;};
const _shootDown15=shootDown;shootDown=function(J,team){const own=pilotTeam(J);_shootDown15(J,team);vehStars('jet',own);};
const hl=(fn,setter)=>function(...a){const o=HITPL;HITPL=setter(a);try{return fn.apply(this,a);}finally{HITPL=o;}};
jetBoom=hl(jetBoom,a=>!!a[3]);rocketBoom=hl(rocketBoom,a=>!!a[2]);tankBoom=hl(tankBoom,()=>true);jetDamage=hl(jetDamage,a=>!!a[3]);
const _heliShot15=heliShot;heliShot=function(H,x,y,z,tx,ty,tz,team,pl){const s0=SHOOTER,h0=HITPL;if(!pl)SHOOTER=-1;else if(H&&H.pilot)SHOOTER=ownId(H.pilot);HITPL=pl;try{_heliShot15(H,x,y,z,tx,ty,tz,team,pl);}finally{SHOOTER=s0;HITPL=h0;}};
const _spawnBullet15=spawnBullet;spawnBullet=function(x,y,z,vx,vz,W,team,pl){_spawnBullet15(x,y,z,vx,vz,W,team,pl);const b=bullets[bullets.length-1];if(b){b.own=pl?netCurOwner:-1;if(W===WP.snip){b.vx*=3;b.vz*=3;b.life=1.1;}}};
const _javelinFire15=javelinFire;javelinFire=function(px,py,pz,a,team,pl){_javelinFire15(px,py,pz,a,team,pl);const j=JV[JV.length-1];if(j)j.own=pl?netCurOwner:-1;};
const _javHit15=javHit;javHit=function(j){const s0=SHOOTER,h0=HITPL;SHOOTER=j.own??-1;HITPL=j.pl;try{_javHit15(j);}finally{SHOOTER=s0;HITPL=h0;}};
// ---------- botu vienības ar plānu ----------
const SQN=['Alfa','Bravo','Čārlija','Delta','Eho','Fokstrots','Golfs','Hotelis'];let SQ=[],sqT=0,sqId=0;
function radio(T,k,o){const s=o?tf(k,o):t(k);if(T===PT)say(s,4);for(const G of NET.guests.values())if(G.ready&&GT(G)===T)netTo(G,{t:'msg',s,d:4});}
function armyGeo(T){const i=ARMY.indexOf(T),B=WB[i],E=WB[1-i];return{B,E,P0:[B.x+B.d*42,B.z],EGx:[E.x+E.d*42,E.z],EGz:[E.x,E.z+E.d*42],A:[B.x*.6,E.z*.6],C:[E.x*.6,B.z*.6],F:[E.x,E.z]};}
function makeSquad(T,mem,role,kind,delay){const g=armyGeo(T),j=()=>(Math.random()-.5)*30;
 const route=kind==='A'?[g.P0,g.A,g.EGz,g.F]:kind==='C'?[g.P0,g.C,g.EGx,g.F]:[g.P0,[j(),j()],g.EGx,g.F];
 const S={id:++sqId,name:SQN[(sqId-1)%SQN.length],team:T,mem,init:mem.length,role,kind,route,wi:0,phase:role==='def'?'def':'wait',startT:gtime+(delay||0)};
 mem.forEach((b,k)=>{b.sq=S;b.wrole=role==='def'?'def':'att';b.fo=[((k%3)-1)*3,-Math.floor(k/3)*3];});SQ.push(S);return S;}
function planArmy(T){const bots=T.members.filter(b=>b.wrole!=='esc').sort(()=>Math.random()-.5);const plans=['flang','zibens','viltiba','cietoksnis'],p=plans[Math.floor(Math.random()*plans.length)];
 const def=bots.splice(0,p==='cietoksnis'?12:6);makeSquad(T,def,'def');const n=Math.ceil(bots.length/3),g=[bots.slice(0,n),bots.slice(n,2*n),bots.slice(2*n)];
 if(p==='flang'){makeSquad(T,g[0],'att','A',0);makeSquad(T,g[1],'att','C',0);makeSquad(T,g[2],'att','M',60);}
 else if(p==='zibens'){g.forEach((m,i)=>makeSquad(T,m,'att','M',i*8));}
 else if(p==='viltiba'){makeSquad(T,g[0],'att','M',0);makeSquad(T,g[1],'att','A',90);makeSquad(T,g[2],'att','C',90);}
 else{makeSquad(T,[...g[0],...g[1].slice(0,3)],'att','A',30);const rest=[...g[1].slice(3),...g[2]];const D=SQ.find(S=>S.team===T&&S.role==='def');rest.forEach(b=>{b.sq=D;b.wrole='def';D.mem.push(b);});}
 T.plan2=p;radio(T,'r_plan',{p:t('p_'+p),d:t('rd_'+p)});}
const leaderOf=S=>S.mem.find(b=>!b.dead&&!b.inside&&!b.para)||S.mem.find(b=>!b.dead);
function squadTick(){
 for(const S of [...SQ]){S.mem=S.mem.filter(b=>!b.dead&&humans.includes(b));if(!S.mem.length){SQ.splice(SQ.indexOf(S),1);continue;}if(S.role==='def')continue;const L=leaderOf(S);if(!L)continue;const lp=L.g.position;
  if(S.phase==='wait'&&gtime>=S.startT){S.phase='move';radio(S.team,'r_go',{n:S.name});}
  if(S.phase==='move'){const w=S.route[S.wi],near=S.mem.filter(b=>Math.hypot(b.g.position.x-lp.x,b.g.position.z-lp.z)<20).length;
   if(Math.hypot(lp.x-w[0],lp.z-w[1])<12&&near>=S.mem.length*.6){S.wi++;if(S.wi>=S.route.length-1){S.phase='attack';radio(S.team,'r_att',{n:S.name});}}}
  if(S.phase!=='retreat'&&S.mem.length<S.init*.4){S.phase='retreat';radio(S.team,'r_ret',{n:S.name});}
  if(S.phase==='retreat'){const B=WB[ARMY.indexOf(S.team)];if(Math.hypot(lp.x-B.x,lp.z-B.z)<30){const D=SQ.find(q=>q.team===S.team&&q.role==='def');if(D){S.mem.forEach(b=>{b.sq=D;b.wrole='def';D.mem.push(b);});}SQ.splice(SQ.indexOf(S),1);}}}
 // aizsargi, kuru ir daudz, izveido jaunu uzbrukuma vienību
 for(const T of ARMY){const D=SQ.find(q=>q.team===T&&q.role==='def');if(!D||D.mem.length<12||SQ.some(q=>q.team===T&&q.role==='att'&&q.phase!=='retreat'))continue;
  const m=D.mem.splice(0,D.mem.length-6);const S=makeSquad(T,m,'att',['A','C','M'][Math.floor(Math.random()*3)],10);radio(T,'r_new',{n:S.name});}
 // tehnika un gaiss piesedz vienības
 const front=T=>{let best=null;for(const S of SQ)if(S.team===T&&S.role==='att'&&S.phase!=='wait'&&S.phase!=='retreat'&&(!best||S.wi>best.wi))best=S;return best;};
 for(const t of tanks){const d=t.driver;t.supp=null;if(!d)continue;const S=d.sq&&d.sq.role==='att'&&d.sq.phase!=='wait'?d.sq:front(d.team);const L=S&&leaderOf(S);if(L&&L!==d){const w=S.route[Math.min(S.wi,S.route.length-1)];t.supp={x:L.g.position.x+(w[0]-L.g.position.x)*.15,z:L.g.position.z+(w[1]-L.g.position.z)*.15};}}
 for(const H of HELIS){const b=H.pilot;if(!b||!b.g||H.st!=='fly')continue;const S=front(b.team);const L=S&&leaderOf(S);if(!L)continue;H.wp=[L.g.position.x+(Math.random()-.5)*12,L.g.position.z+(Math.random()-.5)*12];H.wpT=4;H.mis=Math.max(H.mis||0,H.t+20);
  if(H.cov!==S.id){H.cov=S.id;radio(b.team,'r_air',{n:S.name});}}
 for(const J of JETS){const b=J.pilot;if(!b||!b.g||J.st!=='fly')continue;const S=front(b.team);const L=S&&leaderOf(S);if(!L)continue;const w=S.route[Math.min(S.wi+1,S.route.length-1)];J.wp=[w[0],w[1]];J.wpT=6;}}
const _botThink15=botThink;botThink=function(b){
 if(!isWar()||!b.sq||b.sq.role!=='att'||b.trader||b.jet||b.para||b.heli||b.tankV||b.jetGoal||b.heliGoal||b.tankGoal||b.wrole==='esc')return _botThink15(b);
 const S=b.sq;if(S.phase==='attack'||nearestThreat(b))return _botThink15(b);
 const E=FL.find(F=>F.team!==b.team),M=FL.find(F=>F.team===b.team);if((E&&E.carrier===b)||(M&&(M.carrier||Math.hypot(M.x-M.home[0],M.z-M.home[1])>2)&&Math.hypot(M.x-b.g.position.x,M.z-b.g.position.z)<60))return _botThink15(b);
 const p=b.g.position,L=leaderOf(S);let tx,tz;
 if(S.phase==='wait'){const g=armyGeo(b.team);tx=g.P0[0]-g.B.d*12+b.fo[0];tz=g.P0[1]+b.fo[1];}
 else if(S.phase==='retreat'){tx=b.team.base.x+b.fo[0];tz=b.team.base.z+b.fo[1];}
 else if(L===b){const w=S.route[S.wi];tx=w[0];tz=w[1];}
 else{const lp=L.g.position,a=Math.atan2(S.route[S.wi][0]-lp.x,S.route[S.wi][1]-lp.z),c=Math.cos(a),s=Math.sin(a);tx=lp.x+b.fo[0]*c+b.fo[1]*s;tz=lp.z-b.fo[0]*s+b.fo[1]*c;}
 b.follow=false;b.tg=null;if(Math.hypot(tx-p.x,tz-p.z)>2)goal(b,tx,tz,false);else b.gx=null;};
const _warSetup15=warSetup;warSetup=function(){SQ=[];sqId=0;myStars=0;for(const k in lastKill)delete lastKill[k];_warSetup15();for(const T of TOWERS){T.rifle=true;T.dead=false;}for(const T of ARMY)planArmy(T);dropAirT=60;};
// ---------- snaipera šautene (novērošanas torņos) ----------
WP.snip={ic:'🔭',dmg:999,rate:1.4,max:15,give:5,add:5,pel:1,sp:.002,life:3,brate:2,rng:120,val:40,av:3};WL.push('snip');GUNS.push('snip');
const _giveLoot15=giveLoot;giveLoot=function(k,I,Tm){if(I&&I.ammo&&I.ammo.snip===undefined){I.ammo.snip=0;I.has.snip=false;}return _giveLoot15(k,I,Tm);};
let zoomFov=75;
function rifleTick(){if(!active||!TOWERS.length)return;const a=towerAt();if(!a||!a.up)return;const T=a.T;if(T.dead)return;
 if(NET.role==='guest'){if(!T.req){T.req=true;netSend({t:'twr',i:T.i});}return;}
 if(T.rifle){T.rifle=false;giveLoot('snip',inv,null);selectW('snip');renderInv();say(t('snip_got'),3.5);sfx('pick');}}
const _dawn15=dawn;dawn=function(){_dawn15();for(const T of TOWERS){T.rifle=!T.dead;T.req=false;}};
// ---------- raķete sagrauj novērošanas torni (neatjaunojas) ----------
function collapseTower(T){if(T.dead)return;T.dead=true;T.rifle=false;for(const o of T.obs)remOb(o);T.fall=1.2;sfxAt('boom',T.x,T.z,120);debris(T.x,4,T.z,0x6d4c41,12);explosionFx(T.x,3,T.z,3,0xff9e40);
 if(NET.role==='host')netQ.push({e:'twc',i:T.i});if(Math.hypot(player.position.x-T.x,player.position.z-T.z)<60)say(t('tw_fall'),2.5);if(onTowerOf(T))damagePlayer(15,null);}
function onTowerOf(T){return pY>T.h-.6&&Math.abs(player.position.x-T.x)<2&&Math.abs(player.position.z-T.z)<2;}
function towerBoom(x,z){if(NET.role==='guest')return;for(const T of TOWERS)if(!T.dead&&Math.hypot(T.x-x,T.z-z)<4.5)collapseTower(T);}
{const rb=rocketBoom;rocketBoom=function(p,team,pl){rb(p,team,pl);towerBoom(p.x,p.z);};const tb=tankBoom;tankBoom=function(p){tb(p);towerBoom(p.x,p.z);};const jb=jetBoom;jetBoom=function(x,z,...a){jb(x,z,...a);towerBoom(x,z);};}
function towerAnim(dt){for(const T of TOWERS)if(T.fall>0){T.fall-=dt;T.g.scale.y=Math.max(.05,T.fall/1.2);if(T.fall<=0){T.g.scale.y=.05;const r=new THREE.Group();for(let i=0;i<6;i++){const c=cube(.6+Math.random(),.3+Math.random()*.5,.6+Math.random(),0x4e342e,1);c.position.set(T.x+(Math.random()-.5)*4,.3,T.z+(Math.random()-.5)*4);r.add(c);}scene.add(r);WG.push(r);}}}
// ---------- tehnika drīz atjaunojas bāzē; gaisa piegādes ----------
const slotT={};let dropAirT=60;
function respawnTick(dt){
 for(const t of tanks){if(!t.home||!t.dead)continue;if(t.rT===undefined)t.rT=gtime+15;if(gtime<t.rT)continue;t.rT=undefined;t.dead=false;t.hp=t.kind==='apc'?1:2;t.shells=10;t.ammo=300;t.driver=null;t.res=null;
  t.g.userData.hull.material.color.setHex(t.kind==='apc'?0x5b6b3a:0x4b5320);t.g.position.set(t.home.x,0,t.home.z);t.g.rotation.y=t.home.a;t.ob.x=t.home.x;t.ob.z=t.home.z;remOb(t.ob);addOb(t.ob);}
 for(let i=0;i<SLOTS.length;i++){if(JETS.some(J=>J.slot===i&&J.st!=='gone')){slotT[i]=undefined;continue;}if(slotT[i]===undefined)slotT[i]=gtime+15;if(gtime<slotT[i])continue;slotT[i]=undefined;
  for(let k=JETS.length-1;k>=0;k--)if(JETS[k].slot===i)JETS.splice(k,1);const J=spawnJet(i);J.army=ARMY[i<4?0:1];J.a=WB[i<4?0:1].d>0?Math.PI:0;J.g.rotation.y=J.a;}
 dropAirT-=dt;if(dropAirT<=0){dropAirT=75;const x=(Math.random()-.5)*160,z=(Math.random()-.5)*160,d=dropItem(x,z,'w:'+['snip','jav','harmor','a_jav','a_rpg'][Math.floor(Math.random()*5)]);d.air=34;d.m.position.y=34;
  const ch=new THREE.Mesh(new THREE.SphereGeometry(1.4,10,6,0,6.283,0,Math.PI/2),mat(0xff7043,.8));ch.position.y=2.2;ch.scale.y=.6;d.m.add(ch);d.chute=ch;radio(ARMY[0],'air_drop');radio(ARMY[1],'air_drop');}
 for(const d of drops)if(d.air>0){d.air=Math.max(0,d.air-dt*2.5);d.m.position.y=.4+d.air;if(!d.air&&d.chute){d.m.remove(d.chute);d.chute=null;}}}
const _takeDrop15=takeDrop;takeDrop=function(d,who){if(d.air>0)return;return _takeDrop15(d,who);};
// ---------- cikls un tīkls ----------
const _updateFx15=updateFx;updateFx=function(dt){_updateFx15(dt);const host=NET.role!=='guest'&&(active||NET.guests.size);
 if(isWar()&&host){sqT-=dt;if(sqT<=0){sqT=1;squadTick();}respawnTick(dt);}towerAnim(dt);if(isWar())rifleTick();
 const want=active&&cur==='snip'&&!inTank&&!jetMode&&!heliMode?42:75;if(want!==zoomFov){zoomFov=want;camera.fov=want;camera.updateProjectionMatrix();}};
const _netHostMsg15=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='side'&&isWar()){G.side=d.s?1:0;G.team=ARMY[G.side]||PT;const B=WB[G.side];G.pos.set(B.x+2,0,B.z+4);netTo(G,{t:'tp',x:G.pos.x,z:G.pos.z});sayAll(tf(G.side?'joined_g':'joined_r',{n:G.name}));return;}
 if(d&&G.ready&&d.t==='twr'){const T=TOWERS[d.i];if(T&&T.rifle&&!T.dead&&G.y>T.h-1&&Math.hypot(G.pos.x-T.x,G.pos.z-T.z)<3){T.rifle=false;giveLoot('snip',G.I,null);netTo(G,{t:'msg',s:t('snip_got'),d:3.5});netMe(G);}return;}
 const s0=SHOOTER;SHOOTER=G.id;try{_netHostMsg15(G,d);}finally{SHOOTER=s0;}};
const _netWelcome15=netWelcome;netWelcome=function(G){_netWelcome15(G);netTo(G,{t:'hside',s:MYSIDE});const dead=TOWERS.filter(T=>T.dead).map(T=>T.i);if(dead.length)netTo(G,{t:'twd',L:dead});};
const _netGuestMsg15=netGuestMsg;netGuestMsg=function(d){
 if(d&&d.t==='hside'){if(sideChosen&&isWar()){netSend({t:'side',s:MYSIDE});return;}if(isWar())showSidePick(d.s);MYSIDE=d.s;return;}
 if(d&&d.t==='stars'){showStars(d.n,d.w);return;}
 if(d&&d.t==='twd'){for(const i of d.L)if(TOWERS[i]){collapseTower(TOWERS[i]);TOWERS[i].fall=.01;}return;}
 _netGuestMsg15(d);};
const _netExtraEv215=netExtraEv2;netExtraEv2=function(e){if(e.e==='twc'){if(TOWERS[e.i])collapseTower(TOWERS[e.i]);return;}_netExtraEv215(e);};
// joslā: zvaigznes un pakāpe; minikartē gaisa piegādes
const _warHud15=warHud;warHud=function(){_warHud15();if(isWar()&&active)wbar.textContent+=' · 🎖️ '+rankName(rankOf(myStars))+' ⭐ '+myStars;};
const _drawMap15=drawMap;drawMap=function(){_drawMap15();if(!isWar())return;const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R;
 if(Math.floor(clock.elapsedTime*2)%2)return;g.font=Math.round(W*.08)+'px serif';const L=NET.role==='guest'?[...netDr.values()].filter(o=>o.g.children.length>2).map(o=>o.g.position):drops.filter(d=>d.chute||String(d.kind).match(/^w:(snip|harmor|jav)$/)).map(d=>d.m.position);
 for(const p of L)g.fillText('🪂',W/2+(p.x-cx)*sc,W/2+(p.z-cz)*sc);};
// ---------- karā: tikai 2 mērķi (nevis uzdevumi), nav dzīvnieku, kritušais pretinieks atstāj ieroci vai lodes ----------
Object.assign(T.lv,{goals:'Mērķi',g_kill:'🎯 Iznīcini visus pretiniekus ({n} palikuši)',g_flag:'🚩 Nozodz pretinieku karogu un noturi savā bāzē 2 diennaktis',g_hold:'🚩 Karogs pie mums: vēl {n} h',noanim:'Karā dzīvnieku nav'});
Object.assign(T.en,{goals:'Goals',g_kill:'🎯 Destroy all enemies ({n} left)',g_flag:'🚩 Steal the enemy flag and hold it at your base for 2 days',g_hold:'🚩 Flag is with us: {n} h left',noanim:'There are no animals in war'});
const _newQuests16=newQuests;newQuests=function(){if(isWar()){QS.q=[];qDirty=true;return;}_newQuests16();};
const _renderQuests16=renderQuests;renderQuests=function(){if(!isWar())return _renderQuests16();const E=ARMY.length===2?ARMY[1-MYSIDE]:null,n=NET.role==='guest'?((warN||[0,0])[1-MYSIDE]):(E?E.members.length:0),F=FL[1-MYSIDE];
 qEl.innerHTML='<b>⚔️ '+t('goals')+'</b><div class="ql">'+tf('g_kill',{n})+'</div><div class="ql">'+(F&&F.held?tf('g_hold',{n:Math.max(0,48-Math.round(F.holdH))}):t('g_flag'))+'</div>';qEl.style.display=active?'block':'none';};
function clearAnimals(){for(const p of [...pets]){delLabel(p.lab);scene.remove(p.g);freeObj(p.g);}pets.length=0;for(const c of [...chickens])removeChicken(c);clearDoghouses();}
const _warSetup16=warSetup;warSetup=function(){_warSetup16();clearAnimals();QS.q=[];travelShow(false,0,0);renderQuests();};
const _travelArrive16=travelArrive;travelArrive=function(){if(isWar())return;_travelArrive16();};
const _buy16=buy;buy=function(k,owner,kind){if(isWar()&&(kind==='animals'||kind==='travel'))return t('noanim');return _buy16(k,owner,kind);};
const _nearInter16=nearInter;nearInter=function(){const o=_nearInter16();if(isWar()&&o&&o.type==='pet')return null;return o;};
const WKILL=['pistol','m16','shot','rpg','a_pistol','a_m16','a_m16','a_shot','a_rpg','a_jav','med','armor'];
const _killBot16=killBot;killBot=function(b,src){const was=!b.dead,p=b.g.position.clone();_killBot16(b,src);if(was&&isWar()&&NET.role!=='guest'&&!b.trader)dropItem(p.x-.6,p.z+.4,'w:'+WKILL[Math.floor(Math.random()*WKILL.length)]);};
let qgT=0;const _updateFx16=updateFx;updateFx=function(dt){_updateFx16(dt);if(isWar()){qgT-=dt;if(qgT<=0){qgT=1;renderQuests();}}};
// savienojumi, kas 60 s neatvērās, neaizņem draugu vietas (citādi pēc 3 neveiksmīgiem mēģinājumiem neviens vairs nevarētu pievienoties)
setInterval(()=>{if(NET.role!=='host')return;for(const G of [...NET.guests.values()])if(!G.ready&&Date.now()-(G.t0||0)>60000){try{G.conn.close();}catch(e){}NET.guests.delete(G.id);renderMP();}},5000);
Object.assign(T.lv,{mp_s1:'savienojas ar serveri',mp_s2:'Meklē drauga spēli...',mp_s3:'Savienots! Ielādē pasauli...'});Object.assign(T.en,{mp_s1:'connecting to the server',mp_s2:'Looking for the game of your friend...',mp_s3:'Connected! Loading the world...'});
// versija redzama sākuma ekrānā (lai var pārbaudīt, vai visiem telefoniem ir viena un tā pati)
{const v=document.createElement('p');v.id='mwver';v.textContent='v'+MWV;v.style.cssText='font-size:11px;color:#5f7689;margin-top:6px';document.querySelector('#menu .card').appendChild(v);}
