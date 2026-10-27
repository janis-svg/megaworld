// 53_tehnika_labojumi.js - Tehnikas labojumi: draugs var vadīt tankus un bruņumašīnas (arī pretinieka), boti labprāt iekāpj jebkurā brīvā tehnikā,
// bruņumašīnu tornis vairs nekarājas gaisā, radars tehnikā rāda pretinieka tehniku 100 m attālumā, tehnika uz zemes nebrauc cauri viena otrai,
// gaisā saskrējušās lidmašīnas un helikopteri uzsprāgst.
Object.assign(T.lv,{gtk_in:'🚜 {n}: iekāpt',gtk_go:'🚜 Tu vadi tehniku. Šauj ar uzbrukuma pogu, izkāp ar 🤚.',air_col:'💥 Gaisā saskrējās tehnika!'});
Object.assign(T.en,{gtk_in:'🚜 {n}: get in',gtk_go:'🚜 You are driving. Fire with the attack button, get out with 🤚.',air_col:'💥 Aircraft collided in mid-air!'});
// ---------- modeļi: tornis uz korpusa, torņa gredzens, lielgabala maska ----------
const _tankMesh53=tankMesh;tankMesh=function(){const g=_tankMesh53(),tur=g.userData.tur;g.userData.turZ=0;
 vcyl(tur,1.05,1.05,.14,0x22261a,0,.05,0,null,16);vadd(tur,.7,.5,.35,0x2b2f1a,0,.42,-1.2);return g;};
const _apcMesh53=apcMesh;apcMesh=function(){const g=_apcMesh53(),tur=g.userData.tur;tur.position.y=1.72;g.userData.turZ=.3;
 vcyl(tur,.68,.68,.12,0x2a3320,0,.04,0,null,14);return g;};
// atsitiens: tornis atgriežas savā vietā (bruņumašīnai tā ir .3, tankam 0)
const _fireTank53=fireTank;fireTank=function(){const t=inTank;if(t&&t.gst)return gtkFire();_fireTank53();if(t&&t.g)setTimeout(()=>{if(t.g.userData.tur)t.g.userData.tur.position.z=t.g.userData.turZ||0;},220);};
// ---------- draugs tehnikā (saimnieks) ----------
function gtkOut(G,tell){const t=G.gtk;G.gtk=null;G.tankV=null;if(t){if(t.driver===G)t.driver=null;t.ob.x=t.g.position.x;t.ob.z=t.g.position.z;remOb(t.ob);addOb(t.ob);
  const a=t.g.rotation.y;G.pos.set(t.g.position.x+Math.cos(a)*2.9,0,t.g.position.z-Math.sin(a)*2.9);pushOut(G.pos,.35,0,GT(G));netTo(G,{t:'tp',x:r2(G.pos.x),z:r2(G.pos.z)});}
 if(tell)netTo(G,{t:'tkoff'});}
const _guestAct53=guestAct;guestAct=function(G){if(G.dead)return;if(G.gtk){gtkOut(G,true);return;}
 let best=null,bd=3.6;if((G.y||0)<1.5)for(const t of tanks){const d=Math.hypot(t.g.position.x-G.pos.x,t.g.position.z-G.pos.z);if(d<bd){bd=d;best=t;}}
 if(!best)return _guestAct53(G);
 if(best.dead){netTo(G,{t:'msg',s:t('tank_dead'),d:1.5});return;}if(best.driver||best===inTank){netTo(G,{t:'msg',s:t('busy'),d:1.5});return;}
 if(best.res){best.res.tankGoal=null;best.res=null;}best.driver=G;G.gtk=best;G.tankV=best;G.tkr=best.g.rotation.y;G.tkt=0;remOb(best.ob);
 netTo(G,{t:'tkon',i:tanks.indexOf(best),x:r2(best.g.position.x),z:r2(best.g.position.z),r:r2(best.g.rotation.y),m:best.mdl||'',k:best.kind||'tank',sh:best.shells||0,am:best.ammo||0});};
function gtkHostFire(G,a){const t=G.gtk;if(!t||t.dead||t.driver!==G)return;if((t.gcd||0)>gtime)return;const p=t.g.position,fx=-Math.sin(a),fz=-Math.cos(a),T=GT(G);
 if(t.kind==='apc'){if(!(t.ammo>0))return;t.gcd=gtime+.15;t.ammo--;mgShot(p.x,2.4,p.z,p.x+fx*55,1.2,p.z+fz*55,T,false,14);sfxAt('shoot',p.x,p.z,40);}
 else{if(!(t.shells>0))return;const M=typeof TKM!=='undefined'&&TKM[t.mdl];t.gcd=gtime+1.2*(M&&M.rl||1);t.shells--;botShell(p.x+fx*3.6,p.z+fz*3.6,p.x+fx*55,p.z+fz*55,T);explosionFx(p.x+fx*3.6,1.9,p.z+fz*3.6,1,0xffcc66);}
 netTo(G,{t:'tkam',sh:t.shells||0,am:t.ammo||0});}
const _netHostMsg53=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='tkp'){if(G.gtk){G.tkr=+d.r||0;G.tkt=+d.tr||0;}return;}
 if(d&&G.ready&&d.t==='tkf'){gtkHostFire(G,+d.a||0);return;}
 _netHostMsg53(G,d);};
// boti nevada drauga tanku; izdzīvošanas tehnikas cikls drauga tankam neko nedara
const _botTankDrive53=botTankDrive;botTankDrive=function(t,b,dt){if(b&&b.pos&&!b.g)return;_botTankDrive53(t,b,dt);};
if(typeof survTankTick==='function'){const _s=survTankTick;survTankTick=function(dt){const L=tanks.filter(t=>t.driver&&t.driver.pos&&!t.driver.g),D=L.map(t=>t.driver);L.forEach(t=>t.driver=null);try{_s(dt);}finally{L.forEach((t,i)=>{if(!t.dead)t.driver=D[i];});}};}
// draugs nav bots: vecais kods vadītāju nogalina, tāpēc draugu uz brīdi atvieno un pēc sprādziena izsēdina ar 30 bojājumu
const _destroyTank53=destroyTank;destroyTank=function(t,team,n){const G=t.driver&&t.driver.pos&&!t.driver.g?t.driver:null;if(!G)return _destroyTank53(t,team,n);
 t.driver=null;try{_destroyTank53(t,team,n);}finally{if(!t.dead)t.driver=G;}if(t.dead&&G.gtk===t){gtkOut(G,true);damageGuest(G,30,team);}};
function gtkHostTick(){for(const G of NET.guests.values()){const t=G.gtk;if(!t)continue;
  if(!G.ready||G.dead||t.dead||t.driver!==G){gtkOut(G,G.ready);continue;}
  t.g.position.set(G.pos.x,0,G.pos.z);t.g.rotation.y=G.tkr;t.g.userData.tur.rotation.y=G.tkt;
  if(G.mesh){G.mesh.visible=false;G.lab.visible=G.bar.bg.visible=G.bar.f.visible=false;}}}
// ---------- draugs tehnikā (draugs) ----------
let gtkSendT=0;
function gtkFire(){const v=inTank;if(!v||attackWait>0)return;if(v.kind==='apc'?!(v.ammo>0):!(v.shells>0))return;
 attackWait=v.kind==='apc'?.15:1.2*(typeof TKM!=='undefined'&&TKM[v.mdl]&&TKM[v.mdl].rl||1);netSend({t:'tkf',a:r2(yaw)});
 if(v.kind!=='apc'){v.g.userData.tur.position.z=(v.g.userData.turZ||0)+.25;setTimeout(()=>{v.g.userData.tur.position.z=v.g.userData.turZ||0;},150);sfx('boom');}else sfx('shoot');}
function gtkGuestTick(dt){const v=inTank;if(!v||!v.gst)return;const g=v.g;
 const dx=player.position.x-g.position.x,dz=player.position.z-g.position.z;
 if(Math.hypot(dx,dz)>.01){const ta=Math.atan2(-dx,-dz);let df=ta-g.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));if(Math.abs(df)>Math.PI/2)df=Math.atan2(Math.sin(df+Math.PI),Math.cos(df+Math.PI));g.rotation.y+=df*Math.min(1,dt*4);}
 // citas tehnikas neizbrauc cauri
 for(const [i,o] of netTk){if(i===v.i)continue;const ox=o.g.position.x-player.position.x,oz=o.g.position.z-player.position.z,d=Math.hypot(ox,oz),m=4;if(d<m&&d>.01){player.position.x-=ox/d*(m-d);player.position.z-=oz/d*(m-d);}}
 g.position.set(player.position.x,0,player.position.z);g.userData.tur.rotation.y=yaw-g.rotation.y;
 gtkSendT-=dt;if(gtkSendT<=0){gtkSendT=.1;netSend({t:'tkp',r:r2(g.rotation.y),tr:r2(g.userData.tur.rotation.y)});}}
const _netGuestMsg53=netGuestMsg;netGuestMsg=function(d){
 if(d&&d.t==='tkon'){const o=netTk.get(d.i);if(!o)return;inTank={g:o.g,i:d.i,gst:true,dead:false,kind:d.k,mdl:d.m||undefined,shells:d.sh,ammo:d.am,tb:0,tbCd:0};
  o.g.position.set(d.x,0,d.z);o.g.rotation.y=d.r;player.position.set(d.x,0,d.z);pY=0;vy=0;onGround=true;buildMode=false;say(t('gtk_go'),4);sfx('door');renderW();return;}
 if(d&&d.t==='tkoff'){if(inTank&&inTank.gst){inTank=null;sfx('door');renderW();}return;}
 if(d&&d.t==='tkam'){if(inTank&&inTank.gst){inTank.shells=d.sh;inTank.ammo=d.am;renderW();}return;}
 const v=inTank&&inTank.gst?inTank:null,keep=v&&{x:v.g.position.x,z:v.g.position.z,r:v.g.rotation.y,tr:v.g.userData.tur.rotation.y};
 _netGuestMsg53(d);
 if(v&&keep&&inTank===v){const g=netTk.get(v.i);if(g&&g.g!==v.g){v.g=g.g;}v.g.position.set(keep.x,0,keep.z);v.g.rotation.y=keep.r;v.g.userData.tur.rotation.y=keep.tr;}};
// drauga norāde pie tanka un iekāpšana
const _nearInter53=nearInter;nearInter=function(){if(NET.role==='guest'&&!inTank&&pY<1.5&&!(typeof jetMode!=='undefined'&&jetMode)&&!(typeof heliMode!=='undefined'&&heliMode)){
  let best=null,bd=3.6;for(const [i,o] of netTk){const d=Math.hypot(o.g.position.x-player.position.x,o.g.position.z-player.position.z);if(d<bd){bd=d;best={i,o};}}
  if(best)return{type:'gtank',o:best.o};}return _nearInter53();};
const _updateHint53=updateHint;updateHint=function(){const o=nearInter();if(o&&o.type==='gtank'){const h=$('hint'),m=o.o.mdl&&typeof TKM!=='undefined'&&TKM[o.o.mdl];
  h.textContent=(TOUCH?'':'E / ')+(o.o.dead?'🚜 '+t('tank_dead'):tf('gtk_in',{n:m?m.n:(o.o.apc?'🚙':'🚜')}));h.style.display='block';setAct(o.o.dead?'':'🚜');return;}_updateHint53();};
if(typeof tkSpecial==='function'){const _k=tkSpecial;tkSpecial=function(){if(inTank&&inTank.gst&&inTank.mdl!=='btr')return;_k();};}
// ---------- boti labprāt iekāpj jebkurā brīvā tehnikā, arī pretinieka ----------
// savas armijas tehnikai līdz 4 vadītājiem 60 m rādiusā; pretinieka brīvu tehniku 30 m rādiusā paņem vienmēr
const _warVehPick53=warVehPick;warVehPick=function(){_warVehPick53();for(const T2 of ARMY){
  let driven=tanks.filter(t=>t.driver&&t.driver.team===T2).length+humans.filter(b=>b.team===T2&&b.tankGoal).length;
  const free=humans.filter(b=>b.team===T2&&!b.dead&&!b.inside&&b.wrole!=='esc'&&!b.jetGoal&&!b.heliGoal&&!b.tankGoal&&!b.para&&!b.ord&&!b.gen);
  for(const t of tanks){if(t.dead||t.driver||t.res||t===inTank)continue;const foe=t.army&&t.army!==T2;if(!foe&&driven>=4)continue;
   let bb=null,bd=foe?30:60;for(const b of free){const d=Math.hypot(b.g.position.x-t.g.position.x,b.g.position.z-t.g.position.z);if(d<bd){bd=d;bb=b;}}
   if(bb){bb.tankGoal=t;t.res=bb;free.splice(free.indexOf(bb),1);driven++;}}}};
// ---------- radars: tehnikā redz pretinieka tehniku 100 m attālumā ----------
const RADR=100;
function radarTick(){for(const T2 of ARMY){const E=ARMY[0]===T2?ARMY[1]:ARMY[0],eyes=[];
  if(PT===T2&&active){if(inTank)eyes.push(inTank.g.position);else if(typeof heliMode!=='undefined'&&heliMode)eyes.push({x:heliMode.x,z:heliMode.z});else if(typeof jetMode!=='undefined'&&jetMode)eyes.push({x:jetMode.x,z:jetMode.z});}
  for(const G of NET.guests.values()){if(!G.ready||G.dead||GT(G)!==T2)continue;if(G.gtk||G.inHeli||G.inJet)eyes.push(G.pos);}
  for(const b of humans)if(b.team===T2&&!b.dead&&(b.tankV||b.heli||b.jet))eyes.push(b.g.position);
  if(!eyes.length)continue;const near=(x,z)=>eyes.some(p=>Math.hypot(p.x-x,p.z-z)<RADR);
  tanks.forEach((t,i)=>{if(t.dead)return;const own=t===inTank?PT:t.driver?t.driver.team||(t.driver.pos?GT(t.driver):null):t.army;if(own===E&&near(t.g.position.x,t.g.position.z))mark(T2,t.g.position.x,t.g.position.z,'t',i);});
  for(const H of HELIS){if(H.st==='gone')continue;const own=H.st==='fly'?heliTeam(H):H.owner;if(own===E&&near(H.x,H.z))mark(T2,H.x,H.z,H.st==='fly'?'h':'t','h'+H.id);}
  for(const J of JETS)if(J.st==='fly'&&pilotTeam(J)===E&&near(J.x,J.z))mark(T2,J.x,J.z,'j',J.id);}}
const _spotTick53=spotTick;spotTick=function(){_spotTick53();if(isWar()&&ARMY.length===2)radarTick();};
// ---------- tehnika uz zemes nebrauc cauri viena otrai ----------
const vehR=t=>t.kind==='apc'?1.9:2.1;
function groundCol(){const L=tanks;for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const a=L[i],b=L[j];
  const mvA=!a.dead&&(a===inTank||(a.driver&&a.driver.g)),mvB=!b.dead&&(b===inTank||(b.driver&&b.driver.g));if(!mvA&&!mvB)continue;
  const pa=a.g.position,pb=b.g.position,dx=pb.x-pa.x,dz=pb.z-pa.z,d=Math.hypot(dx,dz),m=vehR(a)+vehR(b);if(d>=m||d<.01)continue;
  const ov=m-d,nx=dx/d,nz=dz/d,ka=mvA&&mvB?.5:mvA?1:0,kb=mvA&&mvB?.5:mvB?1:0;
  if(ka){pa.x-=nx*ov*ka;pa.z-=nz*ov*ka;if(a===inTank){player.position.x=pa.x;player.position.z=pa.z;}}
  if(kb){pb.x+=nx*ov*kb;pb.z+=nz*ov*kb;if(b===inTank){player.position.x=pb.x;player.position.z=pb.z;}}}}
// ---------- gaisā saskrējusies tehnika uzsprāgst ----------
function airCol(){const A=[];for(const J of JETS)if(J.st==='fly'&&J.y>3)A.push({k:'j',o:J,x:J.x,y:J.y,z:J.z,r:2.6*(J.m.s||1)});
 for(const H of HELIS)if(H.st==='fly'&&H.y>2.5)A.push({k:'h',o:H,x:H.x,y:H.y+1,z:H.z,r:2.4});
 const hitS=new Set();for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],b=A[j];if(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<a.r+b.r){hitS.add(a);hitS.add(b);}}
 if(!hitS.size)return;let seen=false;
 for(const q of hitS){if(Math.hypot(q.x-player.position.x,q.z-player.position.z)<150)seen=true;explosionFx(q.x,q.y,q.z,4,0xff7a1a);if(q.k==='j'){q.o.hp=1;jetDamage(q.o,99,null,false);}else destroyHeli(q.o,null);}
 if(seen)jsay('air_col');}
const _updateFx53=updateFx;updateFx=function(dt){_updateFx53(dt);
 if(NET.role==='guest'){gtkGuestTick(dt);return;}
 if(NET.guests.size)gtkHostTick();if(!active&&!NET.guests.size)return;groundCol();airCol();};
