// 50_tanku_veidi.js - Tanku un bruņumašīnu veidi ar savu izskatu un īpašībām:
// T-72 (reaktīvās bruņas noņem 2 trāpījumus, ātra pārlāde), Leopard 2 (ātrākais, šāviņš lido tālāk), Abrams (kompozītbruņas iztur Javelin, 12 šāviņi, ložmetējs),
// BTR-80 (ātra, 400 lodes, turbo), Bradley (kāpurķēdes, 25 mm sprāgstošie šāviņi, iztur raķeti, 2 TOW raķetes). Īpašā darbība: 🔄 poga vai R.
Object.assign(T.lv,{tk_in:'{n}: {d}',tkd_t72:'reaktīvās bruņas noņem 2 trāpījumus, ātra pārlāde',tkd_leo:'ātrākais tanks, šāviņš lido tālāk un ātrāk',tkd_abr:'kompozītbruņas iztur pat Javelin, 12 šāviņi, {k} = ložmetējs',
 tkd_btr:'ātra, 400 lodes, {k} = turbo',tkd_brad:'kāpurķēdes, 25 mm sprāgstošie šāviņi, iztur raķeti, {k} = TOW raķete',tk_era:'💥 Reaktīvās bruņas noturēja trāpījumu! Atlikuši bloki: {n}',
 tk_turbo:'💨 Turbo!',tk_cool:'💨 Turbo atkal pēc {n} s',tk_tow:'🚀 TOW raķete! Atlikušas: {n}',tk_none:'Nav vairs'});
Object.assign(T.en,{tk_in:'{n}: {d}',tkd_t72:'reactive armour stops 2 hits, fast reload',tkd_leo:'fastest tank, its shell flies further and faster',tkd_abr:'composite armour even survives a Javelin, 12 shells, {k} = machine gun',
 tkd_btr:'fast, 400 bullets, {k} = turbo',tkd_brad:'tracks, 25 mm explosive rounds, survives a rocket, {k} = TOW missile',tk_era:'💥 Reactive armour stopped the hit! Blocks left: {n}',
 tk_turbo:'💨 Turbo!',tk_cool:'💨 Turbo again in {n} s',tk_tow:'🚀 TOW missile! Left: {n}',tk_none:'None left'});
// spd = ātrums pret parasto, rl = pārlāde (s), sv = šāviņa ātrums, hp = dzīvība (tanks 2, bruņumašīna 1 = parastā)
const TKM={
 t72:{k:'tank',n:'T-72',c:0x4b5320,cm:0x3a4119,hp:2,sh:10,spd:1,rl:.9,sv:40,era:2},
 leo:{k:'tank',n:'Leopard 2',c:0x5d6a52,cm:0x3f4a37,hp:2,sh:10,spd:1.3,rl:1.2,sv:60},
 abr:{k:'tank',n:'Abrams',c:0xb9a47c,cm:0x8f7b55,hp:3,sh:12,spd:1.15,rl:1.4,sv:45,heavy:true,mg:200,sp:'mg'},
 btr:{k:'apc',n:'BTR-80',c:0x5b6b3a,cm:0x46542c,hp:1,am:400,spd:1.25,sp:'turbo'},
 brad:{k:'apc',n:'Bradley',c:0x6e6a4c,cm:0x55513a,hp:1.5,am:90,spd:.8,cannon:true,tow:2,sp:'tow'}};
const TKT=['t72','leo','abr'],TKA=['btr','brad'];
// ---------- izskats: parastais modelis + savas detaļas un krāsa ----------
function tkRecolor(g,from,M){g.traverse(o=>{if(!o.isMesh||!o.material||!o.material.color)return;const h=o.material.color.getHex();if(h===from[0])o.material.color.setHex(M.c);else if(h===from[1])o.material.color.setHex(M.cm);});}
function tkMesh(m){const M=TKM[m],bk=0x161616;
 if(M.k==='tank'){const g=tankMesh(),tur=g.userData.tur,dk=0x2b2f1a;tkRecolor(g,[0x4b5320,0x3a4119],M);
  if(m==='t72'){const era=[];for(let i=-3;i<=3;i++){era.push(vadd(tur,.24,.12,.3,0x3e4a2a,i*.25,.86,-.85),vadd(g,.38,.14,.32,0x3e4a2a,i*.4,1.48,-1.95));}g.userData.era=era;
   for(const s of [-1,1])vcyl(g,.3,.3,.9,0x5a5a3a,s*1.2,1.5,2.25,'x',10);}
  else if(m==='leo'){for(const s of [-1,1]){const w=vadd(tur,.95,.62,.9,M.c,s*.55,.4,-1.3);w.rotation.y=-s*.55;vadd(g,.08,.55,4.4,M.c,s*1.86,.85,0);}
   vcyl(tur,.15,.15,1.3,dk,0,.45,-4.5,'z',10);vadd(tur,.4,.3,.35,bk,.55,.95,-.5);}
  else{g.scale.setScalar(1.08);vadd(tur,2.5,.5,2.9,M.c,0,.32,.1);vadd(tur,2.3,.06,.8,dk,0,.6,1.85);for(const s of [-1,1])vadd(tur,.05,.3,.8,bk,s*1.1,.75,1.85);
   vcyl(tur,.16,.16,1.5,dk,0,.45,-4.5,'z',10);for(const s of [-1,1]){vadd(g,.1,.6,4.7,M.c,s*1.88,.85,0);for(let i=0;i<5;i++)vadd(g,.02,.5,.04,M.cm,s*1.94,.85,-1.9+i*.95);}
   vcyl(tur,.05,.05,1.1,bk,.65,1.12,-.35,'z',6);vadd(tur,.3,.25,.4,bk,.65,1.0,.15);vadd(tur,.45,.35,.45,dk,-.6,.95,.2);}
  return g;}
 const g=apcMesh(),tur=g.userData.tur;tkRecolor(g,[0x5b6b3a,0x46542c],M);
 if(m==='btr'){vcyl(tur,.06,.06,1.2,bk,.25,.42,-1.6,'z',6);for(const s of [-1,1])vadd(g,.05,.7,.9,0x37422a,s*1.31,1.25,.3);vadd(g,1.8,.06,.9,bk,0,1.72,2.3);}
 else{for(const s of [-1,1]){vadd(g,.66,.95,5.3,0x1c1c1c,s*1.36,.5,0,.9);for(let i=0;i<6;i++)vcyl(g,.26,.26,.7,0x2e2e2e,s*1.36,.42,-2.1+i*.84,'x',8);vadd(g,.08,.5,5,M.c,s*1.72,1.2,0);}
  vcyl(tur,.08,.08,1.8,bk,0,.4,-1.6,'z',8);vcyl(tur,.11,.11,.4,0x2e2e2e,0,.4,-.8,'z',8);const tw=vadd(tur,.45,.42,1.1,M.c,.85,.55,0);
  for(const y of [.45,.65])vcyl(tur,.1,.1,.06,bk,.85,y,-.56,'z',8);g.userData.tow=tw;}
 return g;}
// ---------- piešķiršana ----------
function tkStats(t,keepAmmo){const M=TKM[t.mdl];t.hp=M.hp;if(!keepAmmo){if(M.k==='tank')t.shells=M.sh;else t.ammo=M.am;}t.era=M.era||0;t.mg=M.mg||0;t.tow=M.tow||0;t.tb=0;t.tbCd=0;
 const e=t.g.userData.era;if(e)e.forEach(q=>{q.visible=true;});if(t.g.userData.tow)t.g.userData.tow.visible=true;}
function tkApply(t,m,keepAmmo){const o=t.g,g=tkMesh(m);g.position.copy(o.position);g.rotation.copy(o.rotation);g.visible=o.visible;scene.remove(o);freeObj(o);scene.add(g);t.g=g;t.mdl=m;
 if(t.dead)g.userData.hull.material.color.setHex(0x2a2a22);tkStats(t,keepAmmo);}
const tkRnd=a=>a[Math.floor(Math.random()*a.length)];
const _addTank50=addTank;addTank=function(x,z,a){const t=_addTank50(x,z,a);tkApply(t,tkRnd(TKT));return t;};
let tkApcN=0;
const _addApc50=addApc;addApc=function(x,z,a){const t=_addApc50(x,z,a);tkApply(t,TKA[tkApcN++%2]);return t;};
// izdzīvošanā pilsētas tanki saglabā savus 3 šāviņus
const _spawnTanks50=spawnTanks;spawnTanks=function(){_spawnTanks50();for(const t of tanks)if(!t.mdl)tkApply(t,t.kind==='apc'?TKA[tkApcN++%2]:tkRnd(TKT),t.kind!=='apc');};
// karā katrai armijai: Abrams + T-72 vai Leopard, BTR + Bradley; tanku kaujā katrai pusei pa 2 no katra tanka
const _warSetup50=warSetup;warSetup=function(){_warSetup50();for(const T2 of ARMY){const L=tanks.filter(t=>t.army===T2&&t.kind!=='apc'),A=tanks.filter(t=>t.army===T2&&t.kind==='apc');
  const want=typeof MS!=='undefined'&&MS&&MS.k==='armor'?['abr','abr','leo','leo','t72','t72']:['abr',tkRnd(['t72','leo'])];L.forEach((t,i)=>tkApply(t,want[i%want.length]));A.forEach((t,i)=>tkApply(t,TKA[i%2]));}
 if(NET.role==='host')tkNetT=0;};
// ---------- bojājumi: reaktīvās bruņas, kompozītbruņas ----------
const _destroyTank50=destroyTank;destroyTank=function(t,team,n){const M=TKM[t.mdl];if(!t.dead&&M){
  if(n&&n>=.5&&t.era>0){t.era--;const e=t.g.userData.era;if(e){let k=0;for(const q of e)if(q.visible&&k<7){q.visible=false;k++;}}
   explosionFx(t.g.position.x,1.6,t.g.position.z,1.6,0xffcc66);sfxAt('boom',t.g.position.x,t.g.position.z,60);if(t===inTank)say(tf('tk_era',{n:t.era}),2);return;}
  if(!n&&M.heavy)n=2;}
 _destroyTank50(t,team,n);};
// ---------- spēlētājs tehnikā ----------
const tkMy=()=>inTank&&TKM[inTank.mdl]?TKM[inTank.mdl]:null;
const _move50=move;move=function(dt){const t=inTank,M=tkMy(),x0=player.position.x,z0=player.position.z;_move50(dt);if(!M)return;
 const f=M.spd*(gtime<t.tb?1.7:1)-1;if(Math.abs(f)<.01)return;player.position.x+=(player.position.x-x0)*f;player.position.z+=(player.position.z-z0)*f;pushOut(player.position,1.7,0,PT);clampW(player.position);};
const _fireTank50=fireTank;fireTank=function(){const t=inTank,M=tkMy();if(!M)return _fireTank50();if(M.cannon){bradFire(t);return;}
 const s0=t.shells,n=bullets.length;_fireTank50();if(M.k!=='tank'||t.shells>=s0)return;attackWait=M.rl;
 if(bullets.length>n){const b=bullets[bullets.length-1];if(b.shell){const k=M.sv/40;b.vx*=k;b.vz*=k;}}};
// Bradley: 25 mm sprāgstošs šāviņš (mazs sprādziens, tehnikai -1/4)
function tkTeam(q){return q===inTank?PT:q.driver?q.driver.team:q.army||null;}
function bradBoom(x,y,z,team,pl){explosionFx(x,y,z,1.2,0xffb74d);if(Math.random()<.5)sfxAt('boom',x,z,40);
 for(const m of [...zombies]){const u=m.userData;if(u.dead)continue;const d=Math.hypot(m.position.x-x,m.position.z-z);if(d<2.6)dmgMonster(m,130*(1-d/3.2),pl,false);}
 for(const h of [...HL]){if(h.team===team)continue;const d=Math.hypot(h.p.x-x,h.p.z-z);if(d<2.4&&Math.abs((h.y||0)+1-y)<3)hurt(h,55*(1-d/3),team,pl);}
 for(const q of tanks){if(q.dead)continue;const tt=tkTeam(q);if(!tt||tt===team)continue;if(Math.hypot(q.g.position.x-x,q.g.position.z-z)<2.8)destroyTank(q,team,.25);}
 for(const H of HELIS)if(H.st!=='gone'&&heliTeam(H)!==team&&Math.hypot(H.x-x,H.y+1.5-y,H.z-z)<3.5)heliDamage(H,30,team);
 for(const J of JETS)if((J.st==='fly'||J.st==='fall')&&pilotTeam(J)!==team&&Math.hypot(J.x-x,J.y-y,J.z-z)<4)jetDamage(J,.5,team,pl);}
// mērķis: tuvākais no cilvēkiem/gaisa (apcAim) un ienaidnieku tehnikas priekšā
function bradAim(px,pz,a,team){let best=apcAim(px,pz,a,team),bd=best?Math.hypot(best.x-px,best.z-pz):1e9;
 for(const q of tanks){if(q.dead||q===inTank)continue;const tt=tkTeam(q);if(!tt||tt===team||(team!==PT&&!team.enemies.has(tt)))continue;const dx=q.g.position.x-px,dz=q.g.position.z-pz,d=Math.hypot(dx,dz);if(d>70||d>=bd)continue;
  let df=Math.atan2(-dx,-dz)-a;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));if(df>.45)continue;bd=d;best={x:q.g.position.x,y:1.4,z:q.g.position.z};}
 return best;}
function bradFire(t){if(attackWait>0)return;if(!(t.ammo>0)){say(T[L].heli_noammo,1.5);return;}attackWait=.45;t.ammo--;
 const px=player.position.x,pz=player.position.z,tg=bradAim(px,pz,yaw,PT),tx=tg?tg.x:px-Math.sin(yaw)*45,ty=tg?tg.y:.5,tz=tg?tg.z:pz-Math.cos(yaw)*45;
 const gx=px-Math.sin(yaw)*2,gz=pz-Math.cos(yaw)*2;tracer(gx,2.4,gz,tx,ty,tz);muzzle(gx,2.4,gz,WP.rpg);tone(110,.12,'square',.1,60);bradBoom(tx,ty,tz,PT,true);
 t.g.userData.tur.position.z=.5;setTimeout(()=>{t.g.userData.tur.position.z=.3;},90);renderW();}
// īpašā darbība: Abrams ložmetējs, BTR turbo, Bradley TOW
function tkSpecial(){const v=inTank,M=tkMy();if(!active||!M||!M.sp)return;const px=player.position.x,pz=player.position.z;
 if(M.sp==='mg'){if(v.mgOn)return;if(!(v.mg>0)){say(t('tk_none'),1.2);return;}v.mgOn=true;let n=0;const iv=setInterval(()=>{if(inTank!==v||!(v.mg>0)||++n>8){clearInterval(iv);v.mgOn=false;renderW();return;}v.mg--;
   const x=player.position.x,z=player.position.z,tg=apcAim(x,z,yaw,PT),tx=tg?tg.x:x-Math.sin(yaw)*40,ty=tg?tg.y:1,tz=tg?tg.z:z-Math.cos(yaw)*40;mgShot(x-Math.sin(yaw)*1.5,2.9,z-Math.cos(yaw)*1.5,tx+(Math.random()-.5),ty,tz+(Math.random()-.5),PT,true,18);tone(170,.04,'square',.05,90);},90);return;}
 if(M.sp==='turbo'){if(gtime<v.tbCd){say(tf('tk_cool',{n:Math.ceil(v.tbCd-gtime)}),1.2);return;}v.tb=gtime+4;v.tbCd=gtime+20;say(t('tk_turbo'),1.5);noise(.6,.2,900);return;}
 if(M.sp==='tow'){if(!(v.tow>0)){say(t('tk_none'),1.2);return;}v.tow--;const tg=towTarget(px,pz,yaw,PT);if(tg)JFORCE=tg;try{javelinFire(px,2.6,pz,yaw,PT,true);}finally{JFORCE=null;}
  if(!v.tow&&v.g.userData.tow)v.g.userData.tow.visible=false;say(tf('tk_tow',{n:v.tow}),1.5);renderW();}}
function towTarget(px,pz,a,team){let best=null,bs=1e9;const look=(x,z,ref,kind)=>{const dx=x-px,dz=z-pz,d=Math.hypot(dx,dz);if(d<5||d>150)return;let df=Math.atan2(-dx,-dz)-a;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));if(df>.55)return;const s=df*50+d*.2;if(s<bs){bs=s;best={ref,kind};}};
 const foe=T2=>T2&&T2!==team&&(team===PT?!T2.friendly:team.enemies.has(T2));
 for(const q of tanks)if(!q.dead&&q!==inTank&&foe(tkTeam(q)))look(q.g.position.x,q.g.position.z,q,'tank');if(team!==PT&&inTank&&foe(PT))look(inTank.g.position.x,inTank.g.position.z,inTank,'tank');
 for(const H of HELIS)if(H.st==='fly'&&foe(heliTeam(H)))look(H.x,H.z,H,'heli');return best;}
const _nextW50=nextW;nextW=function(){if(tkMy()&&tkMy().sp)return;_nextW50();};
$('wsw').addEventListener('pointerdown',()=>{if(tkMy())tkSpecial();});
document.addEventListener('keydown',e=>{if(e.code==='KeyR'&&!e.repeat&&tkMy()&&!buildMode)tkSpecial();});
const _renderW50=renderW;renderW=function(){_renderW50();const t=inTank,M=tkMy();if(!TOUCH||!M)return;
 if(M.cannon)$('atk').innerHTML='💥<small>'+(t.ammo||0)+'</small>';$('wsw').innerHTML=M.sp==='mg'?'🔫<small>'+(t.mg||0)+'</small>':M.sp==='tow'?'🚀<small>'+(t.tow||0)+'</small>':M.sp==='turbo'?'💨':'🔄';};
const _enterTank50=enterTank;enterTank=function(tk){_enterTank50(tk);if(inTank!==tk||!tk.mdl)return;const M=TKM[tk.mdl];setTimeout(()=>{if(inTank===tk)say(tf('tk_in',{n:M.n,d:tf('tkd_'+tk.mdl,{k:TOUCH?'🔄':'R'})}),5);},1400);renderW();};
const _updateHint50=updateHint;updateHint=function(){_updateHint50();const o=nearInter(),h=$('hint');if(o&&o.type==='tank'&&o.t.mdl&&!o.t.dead&&h.style.display==='block'&&h.textContent.indexOf(TKM[o.t.mdl].n)<0)h.textContent=TKM[o.t.mdl].n+' · '+h.textContent;};
// ---------- boti: ātrums pēc veida, Abrams ložmetējs, Bradley TOW ----------
const _botTankDrive50=botTankDrive;botTankDrive=function(t,b,dt){const p=t.g.position,x0=p.x,z0=p.z;_botTankDrive50(t,b,dt);const M=TKM[t.mdl];if(!M)return;
 const f=M.spd-1;if(Math.abs(f)>.01&&Math.hypot(p.x-x0,p.z-z0)>.001){p.x+=(p.x-x0)*f;p.z+=(p.z-z0)*f;pushOut(p,1.7,0,b.team);b.g.position.set(p.x,0,p.z);}
 if(M.sp==='mg'&&t.mg>0&&(t.mgT=(t.mgT||0)-dt)<=0){t.mgT=.2;let tg=null,bd=45;for(const h of HL){if(h.team===b.team||!b.team.enemies.has(h.team))continue;const d=Math.hypot(h.p.x-p.x,h.p.z-p.z);if(d<bd){bd=d;tg=h;}}
  if(tg){t.mg--;mgShot(p.x,2.9,p.z,tg.p.x+(Math.random()-.5)*1.4,(tg.y||0)+1.2,tg.p.z+(Math.random()-.5)*1.4,b.team,false,12);sfxAt('shoot',p.x,p.z,40);}}
 if(M.sp==='tow'&&t.tow>0&&(t.towT=(t.towT===undefined?4:t.towT)-dt)<=0){t.towT=7;let best=null,bd=90;for(const q of tanks){if(q.dead||q===t)continue;const tt=tkTeam(q);if(!tt||!b.team.enemies.has(tt))continue;const d=Math.hypot(q.g.position.x-p.x,q.g.position.z-p.z);if(d<bd){bd=d;best=q;}}
  if(best){t.tow--;JFORCE={ref:best,kind:'tank'};try{javelinFire(p.x,2.6,p.z,Math.atan2(-(best.g.position.x-p.x),-(best.g.position.z-p.z)),b.team,false);}finally{JFORCE=null;}if(!t.tow&&t.g.userData.tow)t.g.userData.tow.visible=false;}}};
// ---------- atdzimusi tehnika atgūst sava veida īpašības; draugiem veidu saraksts ----------
let tkNetT=0,TKMS=[];
const _updateFx50=updateFx;updateFx=function(dt){_updateFx50(dt);
 if(NET.role!=='guest'){for(const t of tanks){if(!t.mdl)continue;if(t.wasD&&!t.dead){tkStats(t);t.g.userData.hull.material.color.setHex(TKM[t.mdl].c);}t.wasD=t.dead;}
  if(NET.role==='host'&&NET.guests.size&&(tkNetT-=dt)<=0){tkNetT=3;netQ.push({e:'tkm',L:tanks.map(t=>t.mdl||'')});}}
 else for(const [i,o] of netTk){const m=TKMS[i];if(!m||!TKM[m]||o.mdl===m)continue;const p=o.g.position.clone(),r=o.g.rotation.clone();scene.remove(o.g);freeObj(o.g);o.g=tkMesh(m);o.g.position.copy(p);o.g.rotation.copy(r);scene.add(o.g);o.mdl=m;o.apc=TKM[m].k==='apc';}};
const _netExtraEv50=netExtraEv2;netExtraEv2=function(e){if(e.e==='tkm'){TKMS=e.L||[];return;}_netExtraEv50(e);};
