// 34_izlukosana.js - Karā: pamanītie pretinieki kartē (3 min), trepes uz augsto māju plakanajiem jumtiem (karā tur Javelin komplekts),
// boti ziņo par pretinieku uz jumta un helikopteriem, Javelin jāuzvada 3 s (sarkans rāmis), pārlāde 5 s, ar Javelin rokās stāv uz vietas, gaisa trauksme
Object.assign(T.lv,{rf_up:'🪜 Kāpt uz jumta',rf_down:'🪜 Kāpt lejā',rf_kit:'🎯 Uz jumta Javelin komplekts: +3 raķetes!',rf_empty:'Javelin komplekts jau paņemts (būs atkal rīt)',
 r_roof:'📻 {n}: pretinieks uz jumta! Gaisa vienības, iznīciniet!',r_heli:'📻 {n}: redzu ienaidnieka helikopteru! Javelin, uz turieni!',r_air:'📻 Gaisa trauksme! Ienaidnieka tehnika virs bāzes!',
 jl_aim:'🎯 Turi tehniku rāmī: uzvada {n} s',jl_lock:'🔒 Mērķis uzvadīts! Šauj (⚔️)',jl_none:'🎯 Javelin: notēmē uz pretinieka tehniku',jl_rel:'🎯 Pārlādē: {n} s',jl_need:'🎯 Vispirms uzvadi mērķi (3 s rāmī)'});
Object.assign(T.en,{rf_up:'🪜 Climb onto the roof',rf_down:'🪜 Climb down',rf_kit:'🎯 Javelin kit on the roof: +3 missiles!',rf_empty:'The Javelin kit is already taken (back tomorrow)',
 r_roof:'📻 {n}: enemy on a roof! Air units, take it out!',r_heli:'📻 {n}: I see an enemy helicopter! Javelin, go there!',r_air:'📻 Air raid! Enemy aircraft over the base!',
 jl_aim:'🎯 Keep the vehicle in the frame: lock in {n} s',jl_lock:'🔒 Target locked! Fire (⚔️)',jl_none:'🎯 Javelin: aim at an enemy vehicle',jl_rel:'🎯 Reloading: {n} s',jl_need:'🎯 Lock a target first (3 s in the frame)'});
// ---------- augstās mājas: trepes pie sienas, plakans jumts, uz kura var stāvēt ----------
function onRoofH(h){const b=bldAt(h.p.x,h.p.z,0);return!!(b&&b.lad&&Math.abs((h.y||0)-b.h)<1.6);}
function setupRoof(ch,b){if(b.kind!=='tall'||b.burnt||b.lad)return;const R=rng(hashStr(b.id+'L')),side=Math.floor(R()*4),h=b.h;
 for(const o of b.obs){o.y0=0;o.y1=h;}const roof={x:b.x,z:b.z,hx:b.hx,hz:b.hz,y0:h-.3,y1:h};addOb(roof);ch.obs.push(roof);b.obs.push(roof);
 const ax=side<2,sg=side%2?1:-1,lx=ax?b.x+sg*(b.hx+.35):b.x+(R()-.5)*b.hx,lz=ax?b.z+(R()-.5)*b.hz:b.z+sg*(b.hz+.35);
 const g=new THREE.Group(),c=0x37474f;for(const o of [-.35,.35]){const r=cube(ax?.08:.08,h+1.2,.08,c,.6);r.position.set(lx+(ax?0:o),(h+1.2)/2,lz+(ax?o:0));g.add(r);}
 for(let y=.4;y<h;y+=.45){const r=cube(ax?.06:.7,.05,ax?.7:.06,c,.6);r.position.set(lx,y,lz);g.add(r);}
 if(isWar()){const k=cube(1.4,.6,.7,0x556b2f,.8);k.position.set(b.x,h+.3,b.z);g.add(k);const s=cube(1.42,.08,.72,0xd4a537,.5);s.position.set(b.x,h+.62,b.z);g.add(s);}
 g.updateMatrixWorld(true);mergeInto(g);b.g.add(g);
 b.lad={x:lx+(ax?sg*.8:0),z:lz+(ax?0:sg*.8),tx:ax?b.x+sg*(b.hx-1.2):lx,tz:ax?lz:b.z+sg*(b.hz-1.2)};}
const _genChunk21=genChunk;genChunk=function(cx,cz){_genChunk21(cx,cz);const ch=chunks.get(cx+','+cz);if(ch)for(const b of ch.blds||[])setupRoof(ch,b);};
function roofNear(){const p=player.position;for(const ch of chunks.values())for(const b of ch.blds||[]){const L=b.lad;if(!L||b.burnt)continue;
 if(pY<1.5&&Math.hypot(p.x-L.x,p.z-L.z)<1.8)return{b,up:true};if(Math.abs(pY-b.h)<1&&Math.hypot(p.x-L.tx,p.z-L.tz)<2)return{b,up:false};}return null;}
const KIT=new Map();
function roofOf(x,z,y){const b=bldAt(x,z,0);return b&&b.lad&&Math.abs(y-b.h)<1.2?b:null;}
function kitTry(b,I,who){if(!isWar()||!b||Math.abs(b.x-(who?who.pos.x:player.position.x))>2.5||Math.abs(b.z-(who?who.pos.z:player.position.z))>2.5)return;if(KIT.get(b.id)===false){if(!who&&gtime>(b.kmT||0)){b.kmT=gtime+8;say(t('rf_empty'),2);}return;}
 KIT.set(b.id,false);I.has.jav=true;I.ammo.jav=Math.min(WP.jav.max,(I.ammo.jav||0)+3);if(who){netTo(who,{t:'msg',s:t('rf_kit'),d:3});netMe(who);}else{say(t('rf_kit'),3);renderInv();renderW();}}
const _dawn21=dawn;dawn=function(){_dawn21();KIT.clear();};
// ---------- Javelin: uzvadīšana 3 s, pārlāde 5 s, stāv uz vietas ----------
const JL={tg:null,t:0,re:0};let JFORCE=null;
const jlEl=document.createElement('div');jlEl.id='jlock';document.body.appendChild(jlEl);
function jlCands(){const C=[];if(NET.role==='guest'){for(const [id,o] of netHelis)if(o.pid!==NET.myId)C.push({k:'heli',id,p:o.g.position,y:1.5});for(const [id,o] of netJets)if(o.pid!==NET.myId&&o.st!==0)C.push({k:'jet',id,p:o.g.position,y:0});for(const [i,o] of netTk)if(!o.dead)C.push({k:'tank',id:i,p:o.g.position,y:1.2});return C;}
 for(const H of HELIS)if(H.st!=='gone'&&heliTeam(H)!==PT&&H.owner!==PT)C.push({k:'heli',id:H.id,ref:H,p:H.g.position,y:1.5});
 for(const J of JETS)if((J.st==='fly'||J.st==='fall')&&pilotTeam(J)!==PT)C.push({k:'jet',id:J.id,ref:J,p:J.g.position,y:0});
 tanks.forEach((t,i)=>{if(t.dead||t===inTank)return;const own=t.driver?t.driver.team:t.army;if(own===PT)return;C.push({k:'tank',id:i,ref:t,p:t.g.position,y:1.2});});return C;}
const _v=new THREE.Vector3();
function jlTick(dt){const on=active&&cur==='jav'&&!inTank&&!jetMode&&!heliMode&&!paraMode;if(!on){jlEl.style.display='none';JL.tg=null;JL.t=0;return;}
 const now=gtime;if(JL.re>now){jlEl.style.display='none';hintOver=tf('jl_rel',{n:Math.ceil(JL.re-now)});return;}
 let best=null,bs=1e9;for(const c of jlCands()){const d=Math.hypot(c.p.x-player.position.x,c.p.z-player.position.z);if(d>170||d<5)continue;_v.set(c.p.x,c.p.y+c.y,c.p.z).project(camera);if(_v.z>1||Math.abs(_v.x)>.28||Math.abs(_v.y)>.32)continue;const s=Math.hypot(_v.x,_v.y)+d*.001;if(s<bs){bs=s;best={c,sx:_v.x,sy:_v.y,d};}}
 if(!best){JL.tg=null;JL.t=0;jlEl.style.display='none';hintOver=t('jl_none');return;}
 if(!JL.tg||JL.tg.k!==best.c.k||JL.tg.id!==best.c.id){JL.tg=best.c;JL.t=0;}JL.t+=dt;const lock=JL.t>=3,sz=Math.max(40,Math.min(160,3200/best.d));
 jlEl.style.display='flex';jlEl.style.left=((best.sx+1)*innerWidth/2-sz/2)+'px';jlEl.style.top=((-best.sy+1)*innerHeight/2-sz/2)+'px';jlEl.style.width=jlEl.style.height=sz+'px';jlEl.className=lock?'lock':'';
 jlEl.textContent=lock?'🔒':Math.ceil(3-JL.t)+'';hintOver=lock?t('jl_lock'):tf('jl_aim',{n:Math.ceil(3-JL.t)});if(lock&&!JL.beep){JL.beep=true;tone(1320,.15,'square',.08);}if(!lock)JL.beep=false;}
let hintOver=null;
const _updateHint21=updateHint;updateHint=function(){_updateHint21();const o=nearInter();if(o&&(o.type==='roofup'||o.type==='roofdown')){const h=$('hint');h.textContent=(TOUCH?'':'E / ')+t(o.type==='roofup'?'rf_up':'rf_down');h.style.display='block';setAct('🪜');}
 else if(hintOver&&cur==='jav'){const h=$('hint');h.textContent=hintOver;h.style.display='block';}hintOver=null;};
const _hit21=hit;hit=function(){if(!(active&&cur==='jav'&&!inTank&&!jetMode&&!heliMode&&!buildMode))return _hit21();if(attackWait>0)return;attackWait=.4;
 if(JL.re>gtime){say(tf('jl_rel',{n:Math.ceil(JL.re-gtime)}),1);return;}if(!(inv.ammo.jav>0)){say(t('noammo'),1);return;}if(!JL.tg||JL.t<3){say(t('jl_need'),1.5);return;}
 const tg=JL.tg;inv.ammo.jav--;JL.re=gtime+5;JL.t=0;sfx('rocket');
 if(NET.role==='guest')netSend({t:'fire',w:'jav',a:r2(yaw),lk:{k:tg.k,id:tg.id}});else{JFORCE={ref:tg.ref,kind:tg.k};javelinFire(player.position.x,pY+1.5,player.position.z,yaw,PT,true);JFORCE=null;}
 updateAmmo();renderW();renderInv();};
const _javTarget21=javTarget;javTarget=function(...a){return JFORCE||_javTarget21(...a);};
const _guestFire21=guestFire;guestFire=function(G,d){if(d&&d.w==='jav'&&d.lk){const L=d.lk,ref=L.k==='heli'?HELIS.find(q=>q.id===L.id):L.k==='jet'?JETS.find(q=>q.id===L.id):tanks[L.id];if(ref)JFORCE={ref,kind:L.k};}try{_guestFire21(G,d);}finally{JFORCE=null;}};
// ar Javelin rokās tēls stāv uz vietas (var tikai pagriezties)
const _move21=move;move=function(dt){const x0=player.position.x,z0=player.position.z;_move21(dt);if(active&&cur==='jav'&&!inTank&&!jetMode&&!heliMode&&!paraMode){player.position.x=x0;player.position.z=z0;}};
// skats caur tēmēkli ar Javelin
let jvOn=false,jvFp=false;
function jvView(){const want=active&&cur==='jav'&&!inTank&&!jetMode&&!heliMode&&!paraMode;if(want===jvOn)return;jvOn=want;if(want){jvFp=fp;fp=true;}else fp=jvFp;camera.fov=want?40:75;camera.updateProjectionMatrix();}
// ---------- izlūkošana: kas redzēts, to redz visa armija kartē 3 minūtes ----------
const SPOT=new Map();let spotT=0,spotNetT=0,myMarks=[];const radioCd=new Map();
function rcd(k,s){if((radioCd.get(k)||0)>gtime)return false;radioCd.set(k,gtime+s);return true;}
function mark(T,x,z,kind,id){const key=ARMY.indexOf(T)+':'+(id!==undefined?kind+id:Math.round(x/8)+','+Math.round(z/8)+kind);SPOT.set(key,{T,x,z,t:gtime,kind});}
function spotTick(){if(!isWar()||ARMY.length!==2)return;for(const [k,m] of SPOT)if(gtime-m.t>180)SPOT.delete(k);
 for(const T of ARMY){const E=ARMY[0]===T?ARMY[1]:ARMY[0];const eyes=humans.filter(b=>b.team===T&&!b.dead&&!b.inside).map(b=>({p:b.g.position,b}));
  if(PT===T&&active)eyes.push({p:player.position,pl:true});for(const G of NET.guests.values())if(G.ready&&!G.dead&&GT(G)===T)eyes.push({p:G.pos,g:G});
  const sees=(x,z,y,r)=>{for(const e of eyes){const d=Math.hypot(e.p.x-x,e.p.z-z);if(d>r)continue;if(y>3||!blockedLine(e.p,{x,z},1.2))return e;}return null;};
  for(const h of HL){if(h.team!==E)continue;const y=h.y||0,e=sees(h.p.x,h.p.z,y,y>3?80:55);if(!e)continue;const roof=y>3&&onRoofH(h);mark(T,h.p.x,h.p.z,roof?'r':'s');
   if(roof&&e.b&&rcd('roof'+ARMY.indexOf(T),40)){radio(T,'r_roof',{n:e.b.name});airStrike(T,{x:h.p.x,y,z:h.p.z});}}
  for(const H of HELIS){if(H.st!=='fly')continue;const HT=heliTeam(H);if(HT!==E)continue;const e=sees(H.x,H.z,H.y,120);if(!e)continue;mark(T,H.x,H.z,'h',H.id);
   if(e.b&&rcd('heli'+ARMY.indexOf(T),45)){radio(T,'r_heli',{n:e.b.name});sendAA(T,H);}airWarn(T,H.x,H.z);}
  for(const J of JETS){if(J.st!=='fly'||pilotTeam(J)!==E)continue;if(!sees(J.x,J.z,J.y,140))continue;mark(T,J.x,J.z,'j',J.id);airWarn(T,J.x,J.z);}
  for(const t of tanks){if(t.dead)continue;const own=t.driver?t.driver.team:t===inTank?PT:null;if(own!==E)continue;if(sees(t.g.position.x,t.g.position.z,0,70))mark(T,t.g.position.x,t.g.position.z,'t');}}
 if(NET.role==='host'&&NET.guests.size){spotNetT--;if(spotNetT<=0){spotNetT=2;for(const G of NET.guests.values())if(G.ready){const L=[];for(const m of SPOT.values())if(m.T===GT(G))L.push([Math.round(m.x),Math.round(m.z),Math.round(gtime-m.t),m.kind]);netTo(G,{t:'spot',L:L.slice(-80)});}}}}
// pretinieks uz jumta: tuvākā savas armijas helikopters vai lidmašīna lido to iznīcināt
function airStrike(T,p){for(const H of HELIS)if(H.st==='fly'&&H.pilot&&H.pilot.g&&H.pilot.team===T)H.force={x:p.x,y:p.y+1,z:p.z,until:gtime+25};for(const J of JETS)if(J.st==='fly'&&J.pilot&&J.pilot.g&&J.pilot.team===T)J.force={x:p.x,z:p.z,until:gtime+25};}
const _botHeliFly21=botHeliFly;botHeliFly=function(H,b,dt){if(H.force&&H.force.until>gtime){H.tg={x:H.force.x,y:H.force.y,z:H.force.z};H.tt=1;H.mis=Math.max(H.mis||0,H.t+20);}_botHeliFly21(H,b,dt);};
const _botFly21=botFly;botFly=function(J,b,dt){if(J.force&&J.force.until>gtime){J.tg={x:J.force.x,z:J.force.z};J.ttT=1;}_botFly21(J,b,dt);};
// redzēts helikopters: līdz 3 boti ar Javelin dodas tā virzienā
function sendAA(T,H){humans.filter(b=>b.team===T&&!b.dead&&!b.inside&&b.I.ammo.jav>0&&!b.jet&&!b.heli&&!b.tankV).sort((a,b)=>Math.hypot(a.g.position.x-H.x,a.g.position.z-H.z)-Math.hypot(b.g.position.x-H.x,b.g.position.z-H.z)).slice(0,3).forEach(b=>{b.aaGoal={H,until:gtime+40};});}
const _botThink21=botThink;botThink=function(b){if(isWar()&&b.aaGoal){const A=b.aaGoal;if(A.until<gtime||A.H.st!=='fly'||!(b.I.ammo.jav>0)||b.inside)b.aaGoal=null;else if(!nearestThreat(b)){const p=b.g.position,d=Math.hypot(A.H.x-p.x,A.H.z-p.z);b.follow=false;b.tg=null;if(d>55)goal(b,A.H.x,A.H.z,d>90);else b.gx=null;return;}}
 // mednieki un uzbrucēji bez mērķa iet uz pēdējo vietu, kur redzēts pretinieks
 if(isWar()&&b.wrole==='hunt'&&!nearestThreat(b)&&!b.jet&&!b.heli&&!b.tankV&&!b.para&&!b.inside){let best=null,bt=-1;for(const m of SPOT.values())if(m.T===b.team&&m.kind==='s'&&m.t>bt){bt=m.t;best=m;}if(best&&Math.hypot(best.x-b.g.position.x,best.z-b.g.position.z)>8){b.follow=false;goal(b,best.x,best.z,true);return;}}
 _botThink21(b);};
// gaisa trauksme: ienaidnieka tehnika virs savas bāzes
function airWarn(T,x,z){const B=WB[ARMY.indexOf(T)];if(Math.hypot(x-B.x,z-B.z)>110||!rcd('air'+ARMY.indexOf(T),60))return;radio(T,'r_air');
 const me=NET.role!=='guest'&&T===PT;if(me)siren();for(const G of NET.guests.values())if(G.ready&&GT(G)===T)netTo(G,{t:'siren'});}
function siren(){for(let i=0;i<4;i++){tone(440,.45,'sawtooth',.06,880,i*.9);tone(880,.45,'sawtooth',.06,440,i*.9+.45);}}
// ---------- vadība un tīkls ----------
const _nearInter21=nearInter;nearInter=function(){const o=_nearInter21();if(o&&o.type!=='burn'&&o.type!=='door'&&o.type!=='drawer'&&o.type!=='shelf')return o;const r=!inTank&&!jetMode&&!heliMode&&!paraMode&&roofNear();if(r)return{type:r.up?'roofup':'roofdown',b:r.b};return o;};
const _interact21=interact;interact=function(){if(active){const o=nearInter();if(o&&(o.type==='roofup'||o.type==='roofdown')){const L=o.b.lad;if(o.type==='roofup'){player.position.set(L.tx,o.b.h,L.tz);pY=o.b.h;}else{player.position.set(L.x,0,L.z);pY=0;}vy=0;onGround=true;sfx('drawer');return;}}_interact21();};
const _netHostMsg21=netHostMsg;netHostMsg=function(G,d){if(d&&G.ready&&d.t==='rkit'){const b=roofOf(G.pos.x,G.pos.z,G.y);if(b)kitTry(b,G.I,G);return;}_netHostMsg21(G,d);};
const _netGuestMsg21=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='spot'){myMarks=d.L;return;}if(d&&d.t==='siren'){siren();return;}_netGuestMsg21(d);};
let kitT=0;
const _updateFx21=updateFx;updateFx=function(dt){_updateFx21(dt);jlTick(dt);jvView();if(isWar()&&NET.role!=='guest'&&(active||NET.guests.size)){spotT-=dt;if(spotT<=0){spotT=1;spotTick();}}
 kitT-=dt;if(kitT<=0&&isWar()&&active){kitT=.5;const b=roofOf(player.position.x,player.position.z,pY);if(b&&Math.hypot(b.x-player.position.x,b.z-player.position.z)<2.5){if(NET.role==='guest'){if(!b.kreq){b.kreq=true;netSend({t:'rkit'});}}else kitTry(b,inv,null);}}};
// minikartē: pamanītie pretinieki (izgaist 3 minūtēs)
const _drawMap21=drawMap;drawMap=function(){_drawMap21();if(!isWar())return;const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R,X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc;
 const L=NET.role==='guest'?myMarks.map(([x,z,a,k])=>({x,z,a,k})):[...SPOT.values()].filter(m=>m.T===PT).map(m=>({x:m.x,z:m.z,a:gtime-m.t,k:m.kind}));
 for(const m of L){const al=Math.max(.15,1-m.a/180);g.globalAlpha=al;g.fillStyle={s:'#ff1744',r:'#d500f9',h:'#ff9100',j:'#ff9100',t:'#ffea00'}[m.k]||'#ff1744';
  if(m.k==='s'||m.k==='r'){g.beginPath();g.arc(X(m.x),Y(m.z),m.k==='r'?5:3.5,0,6.283);g.fill();}else{g.beginPath();g.moveTo(X(m.x),Y(m.z)-6);g.lineTo(X(m.x)+5,Y(m.z)+4);g.lineTo(X(m.x)-5,Y(m.z)+4);g.closePath();g.fill();}}
 g.globalAlpha=1;};
