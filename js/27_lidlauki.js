// 27_lidlauki.js - Divi lidlauki ar 4 pamestām kara lidmašīnām: lido, 3 raķetes (katra iznīcina jebkuru briesmoni vai tanku), katapultēšanās ar izpletni,
// lidmašīna ietriecas un ap to 5 m deg 2 minūtes; boti arī lido (īpaši karotāji); tanks ar pretgaisa šāviņu var notriekt lidmašīnu
Object.assign(T.lv,{jet_in:'✈️ {m} (🚀 {n} ❤️ {h})',jet_go:'✈️ Lido! Uz augšu/leju = augstums, pa kreisi/labi = pagrieziens, ⚔️ = raķete, 🤚 = katapultēties',jet_ej:'🪂 Katapultēties',jet_fly:'✈️ ❤️ {h} · 🚀 {n} · 🤚 katapultēties',
 jet_out:'🚀 Raķetes beigušās: katapultējies!',jet_hit:'💥 Lidmašīna ietriecās!',jet_down:'💥 Tanks notrieca lidmašīnu!',jet_busy:'✈️ Šī lidmašīna ir aizņemta',jet_new:'✈️ Lidlaukos atkal ir lidmašīnas',
 jet_bot:'✈️ {n} paceļas gaisā ar kara lidmašīnu!',tank_kill:'💥 Tanks iznīcināts!',jet_shot:'💥 Tavu lidmašīnu notrieca! Katapultējies!',jet_dn:'💥 Lidmašīna notriekta!',jet_dmg:'💥 Trāpījums! ❤️ {n}',
 jm_hawk:'Vanags: iznīcinātājs, raķetes notriec arī lidmašīnas',jm_bison:'Bizons: bumbvedējs, 5 raķetes, liels sprādziens, izturīgs',jm_bolt:'Zibens: visātrākais un veiklākais, bet trausls',jm_eagle:'Ērglis: līdzsvarots, 4 raķetes, notriec arī lidmašīnas'});
Object.assign(T.en,{jet_in:'✈️ {m} (🚀 {n} ❤️ {h})',jet_go:'✈️ Flying! Up/down = height, left/right = turn, ⚔️ = rocket, 🤚 = eject',jet_ej:'🪂 Eject',jet_fly:'✈️ ❤️ {h} · 🚀 {n} · 🤚 eject',
 jet_out:'🚀 Out of rockets: eject!',jet_hit:'💥 The plane crashed!',jet_down:'💥 A tank shot down a plane!',jet_busy:'✈️ This plane is taken',jet_new:'✈️ The airfields have planes again',
 jet_bot:'✈️ {n} takes off in a fighter jet!',tank_kill:'💥 Tank destroyed!',jet_shot:'💥 Your plane was shot down! Eject!',jet_dn:'💥 A plane was shot down!',jet_dmg:'💥 Hit! ❤️ {n}',
 jm_hawk:'Hawk: fighter, rockets also shoot down planes',jm_bison:'Bison: bomber, 5 rockets, big blast, tough',jm_bolt:'Bolt: fastest and most agile, but fragile',jm_eagle:'Eagle: balanced, 4 rockets, also shoots down planes'});
// ---------- lidlauki mežā (koki tur neaug, sk. 07_pilseta.js) ----------
const AIRF=[{x:200,z:-110},{x:-200,z:110}];
function nearAirfield(x,z,m){m=m||0;return AIRF.some(a=>Math.abs(x-a.x)<22+m&&Math.abs(z-a.z)<44+m);}
// lidmašīnu modeļi: ātrums, pagrieziens, raķetes, izturība, sprādziena lielums, vai raķetes notriec lidmašīnas
const JM={hawk:{c:0x55634d,s:1,spd:28,turn:1.3,rk:3,hp:2,boom:1,aa:true},bison:{c:0x6d5c3d,s:1.3,spd:20,turn:.85,rk:5,hp:4,boom:1.5,aa:false},bolt:{c:0x37474f,s:.85,spd:38,turn:1.65,rk:2,hp:1,boom:1,aa:true},eagle:{c:0x8d2b2b,s:1.05,spd:26,turn:1.2,rk:4,hp:3,boom:1.2,aa:true}},JMK=['hawk','bison','bolt','eagle'];
const AFOB=[];
function buildAirfields(){for(const a of AIRF){const g=new THREE.Group();
 const c=document.createElement('canvas');c.width=64;c.height=512;const x=c.getContext('2d');x.fillStyle='#3b3e42';x.fillRect(0,0,64,512);x.fillStyle='#d8d8d0';x.fillRect(3,0,3,512);x.fillRect(58,0,3,512);
 for(let i=0;i<512;i+=40)x.fillRect(30,i+8,4,22);for(let i=0;i<6;i++){x.fillRect(10+i*8,4,4,26);x.fillRect(10+i*8,482,4,26);}
 x.strokeStyle='#26282b';x.lineWidth=1.5;for(let i=0;i<18;i++){x.beginPath();const sx=Math.random()*64,sy=Math.random()*512;x.moveTo(sx,sy);x.lineTo(sx+(Math.random()-.5)*24,sy+(Math.random()-.5)*50);x.stroke();}
 const rw=new THREE.Mesh(new THREE.PlaneGeometry(14,84),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:1}));rw.rotation.x=-Math.PI/2;rw.position.set(a.x,.03,a.z);rw.receiveShadow=true;g.add(rw);
 const ap=new THREE.Mesh(new THREE.PlaneGeometry(10,40),new THREE.MeshStandardMaterial({color:0x4a4d50,roughness:1}));ap.rotation.x=-Math.PI/2;ap.position.set(a.x+12,.025,a.z-4);ap.receiveShadow=true;g.add(ap);
 const hg=cube(10,6,12,0x5f6b5c,.9);hg.position.set(a.x+15,3,a.z+28);g.add(hg);const hr=cube(10.8,.5,12.8,0x3e463c,.9);hr.position.set(a.x+15,6.2,a.z+28);g.add(hr);
 const hd=cube(.1,4.6,9,0x111111,1);hd.position.set(a.x+9.95,2.3,a.z+28);g.add(hd);
 const tw=cube(3,7,3,0x9e9e8e,.9);tw.position.set(a.x-11,3.5,a.z-30);g.add(tw);const cab=cube(4,2,4,0x4fa3c7,.2);cab.position.set(a.x-11,8,a.z-30);g.add(cab);const an=cube(.1,2.5,.1,0x333333,.5);an.position.set(a.x-11,10.2,a.z-30);g.add(an);
 const sp=cube(.1,4,.1,0x777777,.5);sp.position.set(a.x-9,2,a.z+38);g.add(sp);const sock=new THREE.Mesh(new THREE.ConeGeometry(.35,1.6,8),mat(0xff6d00,.8));sock.rotation.z=Math.PI/2;sock.position.set(a.x-8.2,3.8,a.z+38);g.add(sock);
 for(let i=0;i<4;i++){const cr=cube(1.1,1.1,1.1,0x7a5c34,1);cr.position.set(a.x+18+(i%2)*1.2,.55+(i>1?1.1:0),a.z+12);g.add(cr);}
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);
 AFOB.push({x:a.x+15,z:a.z+28,hx:5.4,hz:6.4},{x:a.x-11,z:a.z-30,hx:1.6,hz:1.6},{x:a.x+18.6,z:a.z+12,hx:1.2,hz:.6});}}
buildAirfields();
function afObs(){for(const o of AFOB){remOb(o);addOb(o);}for(const J of JETS)if(J.st==='park'){remOb(J.ob);addOb(J.ob);}}
// ---------- lidmašīna ----------
function jetMesh(k){const M=JM[k]||JM.hawk,g=new THREE.Group(),c=M.c;
 const b=cube(1.3,1.1,8.5,c,.6);g.add(b);const n=new THREE.Mesh(new THREE.ConeGeometry(.65,2.4,10),mat(0x4a5644,.6));n.rotation.x=-Math.PI/2;n.position.z=-5.45;g.add(n);
 const cp=cube(.8,.55,2.2,0x4fc3f7,.15);cp.position.set(0,.75,-2.4);g.add(cp);
 const w=cube(8.6,.16,2.8,c,.6);w.position.set(0,-.1,.5);g.add(w);for(const x of [-3,3]){const s=cube(.7,.03,.7,0xc62828,.6);s.position.set(x,0,.5);g.add(s);}
 const f=cube(.16,2,1.8,c,.6);f.position.set(0,1.3,3.5);g.add(f);const st=cube(3.6,.14,1.3,c,.6);st.position.set(0,.2,3.8);g.add(st);
 const ex=new THREE.Mesh(new THREE.CylinderGeometry(.45,.55,.8,10),mat(0x222222,.6));ex.rotation.x=Math.PI/2;ex.position.z=4.6;g.add(ex);
 const fl=new THREE.Mesh(new THREE.ConeGeometry(.42,1.8,8),new THREE.MeshBasicMaterial({color:0xffa726}));fl.rotation.x=-Math.PI/2;fl.position.z=5.8;fl.visible=false;g.add(fl);
 const rk=[];for(const x of [-2.6,0,2.6,-1.5,1.5].slice(0,M.rk)){const r=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,1.5,8),mat(0xeeeeee,.5));r.rotation.x=Math.PI/2;r.position.set(x,x?-.35:-.7,x?.3:-.5);g.add(r);rk.push(r);}
 const gear=new THREE.Group();for(const [x,z] of [[0,-3.2],[-1.2,1],[1.2,1]]){const l=cube(.15,1,.15,0x222222,.8);l.position.set(x,-.95,z);gear.add(l);const wh=cube(.25,.4,.4,0x111111,1);wh.position.set(x,-1.4,z);gear.add(wh);}g.add(gear);
 g.scale.setScalar(M.s);g.rotation.order='YXZ';g.userData={rk,gear,fl};scene.add(g);return g;}
const JETS=[],JR=[],WRECKS=[],AAS=[];let jetId=0,jetMode=null,paraMode=false,jetNetT=0,botJetT=0,engT=0,fogKeep=null;
const SLOTS=[];for(const a of AIRF)SLOTS.push([a.x+11,a.z-16],[a.x+11,a.z+4]);
function spawnJet(i){const [x,z]=SLOTS[i],mk=JMK[i%4],M=JM[mk],J={id:++jetId,slot:i,mk,m:M,g:jetMesh(mk),st:'park',rk:M.rk,hp:M.hp,pilot:null,x,y:1.45*M.s,z,a:0,v:0,tAlt:30,ob:{x,z,hx:.9,hz:4.4},roll:0};
 J.g.position.set(x,J.y,z);addOb(J.ob);JETS.push(J);return J;}
function clearJets(){for(const J of JETS){scene.remove(J.g);freeObj(J.g);remOb(J.ob);}JETS.length=0;for(const r of JR){scene.remove(r.m);}JR.length=0;for(const s of AAS)scene.remove(s.m);AAS.length=0;for(const w of WRECKS){scene.remove(w.g);freeObj(w.g);}WRECKS.length=0;}
function jetPaint(J){const u=J.g.userData;u.rk.forEach((r,i)=>r.visible=i<J.rk);u.gear.visible=J.y<3.5;u.fl.visible=J.st==='fly'&&J.v>4;}
// cik augsti ēkas zem/priekšā (lai saprastu, vai ietriecas)
function jetHits(x,z,y){if(y<.6)return true;
 for(const ch of chunks.values())for(const b of ch.blds||[]){if(b.burnt)continue;if(Math.abs(x-b.x)<b.hx+1&&Math.abs(z-b.z)<b.hz+1&&y<b.h+1.5)return true;}
 if(y<8)for(const o of AFOB)if(Math.abs(x-o.x)<o.hx+1&&Math.abs(z-o.z)<o.hz+1)return true;
 if(y<6)for(const ch of chunks.values())for(const tr of ch.trees||[])if(!tr.burnt&&Math.abs(tr.x-x)<1.5&&Math.abs(tr.z-z)<1.5&&y<4.8*(tr.s||1))return true;
 return colTop(Math.round(x),Math.round(z))>y;}
function bldHit(x,z,y){for(const ch of chunks.values())for(const b of ch.blds||[])if(!b.burnt&&Math.abs(x-b.x)<b.hx&&Math.abs(z-b.z)<b.hz&&y<b.h)return true;return false;}
function maxHAhead(x,z,a,dist){let m=0;for(let k=1;k<=4;k++){const px=x-Math.sin(a)*dist*k/4,pz=z-Math.cos(a)*dist*k/4;for(const ch of chunks.values())for(const b of ch.blds||[])if(!b.burnt&&Math.abs(px-b.x)<b.hx+3&&Math.abs(pz-b.z)<b.hz+3)m=Math.max(m,b.h);}return m;}
// ---------- raķetes un sprādzieni ----------
function spawnJetRocket(x,y,z,tx,ty,tz,team,pl,owner,tj,boom){const dx=tx-x,dy=ty-y,dz=tz-z,l=Math.hypot(dx,dy,dz)||1,sp=60;
 const m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0xff7043}));m.scale.setScalar(1.6);m.position.set(x,y,z);m.lookAt(x+dx,y+dy,z+dz);scene.add(m);
 JR.push({m,x,y,z,vx:dx/l*sp,vy:dy/l*sp,vz:dz/l*sp,life:tj?3.5:Math.min(3,l/sp+.6),tx,ty,tz,team,pl,owner,tj:tj||null,boom:boom||1});sfxAt('rocket',x,z,80);}
function destroyTank(t,team){if(t.dead)return;t.dead=true;t.shells=0;t.g.userData.hull.material.color.setHex(0x2a2a22);explosionFx(t.g.position.x,1.5,t.g.position.z,4,0xff7a1a);
 if(inTank===t){exitTank();damagePlayer(30,team);}jsay('tank_kill');}
function jetBoom(x,z,team,pl,power,rad,th){power=power||1;rad=rad||1;explosionFx(x,1,z,6*rad,0xff7a1a);explosionFx(x,2,z,3.5,0xffd23f);sfxAt('boom',x,z,130);
 for(const m of [...zombies]){if(m.userData.dead)continue;const d=Math.hypot(m.position.x-x,m.position.z-z);if(d<7*rad)dmgMonster(m,99999,pl,true);}
 for(const h of [...HL]){if(team&&h.team===team)continue;const d=Math.hypot(h.p.x-x,h.p.z-z);if(d<6*rad&&(h.y||0)<6)hurt(h,(h.b&&!h.gst?160:110)*power*(1-d/(7*rad)),team,pl);}
 for(const t of tanks){if(Math.hypot(t.g.position.x-x,t.g.position.z-z)<6*rad)destroyTank(t,team,th);}
 const hitB=new Set();eachOb(x,z,3.5,o=>{if(o.y1!==undefined&&!o.dead&&o.team!==team&&Math.hypot(o.x-x,o.z-z)<3.5)hitB.add(o);return false;});hitB.forEach(o=>damageBlock(o,300));
 for(const ch of chunks.values())for(const o of ch.inter)if(o.type==='door'&&o.hp>0&&Math.hypot(o.x-x,o.z-z)<4){o.hp=0;o.dob.off=true;o.piv.visible=false;o.r=0;o.open=true;}}
// ---------- avārija: sprādziens, viss 5 m apkārt deg 2 minūtes, māja nodeg ----------
function wreckAt(x,z){const g=new THREE.Group();for(let i=0;i<7;i++){const c=cube(.6+Math.random()*1.6,.3+Math.random()*.8,.6+Math.random()*2.2,i?0x1a1a1a:0x2b3326,1);c.position.set(x+(Math.random()-.5)*5,.3,z+(Math.random()-.5)*5);c.rotation.set(Math.random(),Math.random()*3,Math.random());g.add(c);}scene.add(g);WRECKS.push({g,t:120});}
function crashFire(x,z,host){fires.push({x,z,w:5,d:5,h:2.5,t:120,dmg:host,fin(){}});wreckAt(x,z);
 if(!host)return;for(const ch of chunks.values()){for(const tr of ch.trees||[])if(!tr.burnt&&Math.hypot(tr.x-x,tr.z-z)<5)startBurn('t',tr,false);
  for(const b of ch.blds||[]){if(b.burnt)continue;const dx=Math.max(0,Math.abs(x-b.x)-b.hx),dz=Math.max(0,Math.abs(z-b.z)-b.hz);if(Math.hypot(dx,dz)<5)startBurn('h',b,false);}}
 for(const p of [...plants])if(!p.burnt&&Math.hypot(p.x-x,p.z-z)<5)startBurn('p',p,false);
 if(NET.role==='host')netQ.push({e:'cf',x:r2(x),z:r2(z)});}
function crashJet(J){if(J.st==='gone')return;const x=J.x,z=J.z;J.st='gone';
 if(J.pilot&&J.pilot.g){const b=J.pilot;b.jet=null;b.inside=false;killBot(b,null);}J.pilot=null;
 scene.remove(J.g);freeObj(J.g);jetBoom(x,z,null,false,.6);crashFire(x,z,true);}
const jsay=bcastMsgOf((k,o,d)=>say(o?tf(k,o):t(k),d||3));
// ---------- spēlētājs lido (saimnieks un draugs: katrs savā ierīcē) ----------
function enterJet(J){jetMode=J;J.v=0;J.tAlt=30;yaw=J.a;buildMode=false;if(fogKeep===null){fogKeep=scene.fog.far;scene.fog.far=150;}
 if(NET.role!=='guest'){J.st='fly';J.pilot='P';remOb(J.ob);}say(t('jet_go'),5);sfx('door');renderW();}
function leaveFog(){if(fogKeep!==null){scene.fog.far=fogKeep;fogKeep=null;}}
function ejectJet(){const J=jetMode;if(!J)return;jetMode=null;leaveFog();player.position.set(J.x,0,J.z);pY=Math.max(J.y,1);vy=0;onGround=false;
 if(J.y>4){paraMode=true;chute().visible=true;}
 if(NET.role==='guest')netSend({t:'jej',id:J.id,x:r2(J.x),y:r2(J.y),z:r2(J.z),a:r2(J.a),v:r2(J.v)});else{J.st='fall';J.pilot=null;}
 sfx('door');noise(.4,.2,900);renderW();}
let chuteM=null;
function chuteMesh(col){const g=new THREE.Group(),d=new THREE.Mesh(new THREE.SphereGeometry(1.7,12,6,0,6.283,0,Math.PI/2),mat(col,.8));d.position.y=3.6;d.scale.y=.6;g.add(d);
 for(const [x,z] of [[-1.2,-1.2],[1.2,-1.2],[-1.2,1.2],[1.2,1.2]]){const l=cube(.03,1.8,.03,0xffffff,1);l.position.set(x*.55,2.6,z*.55);l.rotation.set(z*.3,0,-x*.3);g.add(l);}g.visible=false;return g;}
function chute(){if(!chuteM){chuteM=chuteMesh(0xff7043);player.add(chuteM);}return chuteM;}
function jetAirLocal(J){if(!J.m.aa)return null;const fx=-Math.sin(J.a),fz=-Math.cos(J.a);let best=null,bs=1e9;
 const L=NET.role==='guest'?[...netJets].filter(([id,o])=>(o.st===1||o.st===2)&&o.pid===-1&&id!==J.id).map(([id,o])=>({id,x:o.x,y:o.y,z:o.z})):JETS.filter(q=>q!==J&&(q.st==='fly'||q.st==='fall')&&q.pilot!=='P'&&!(q.pilot&&q.pilot.pos)&&!(q.pilot&&q.pilot.team&&q.pilot.team.friendly));
 for(const q of L){const dx=q.x-J.x,dz=q.z-J.z,d=Math.hypot(dx,dz);if(d<6||d>140)continue;const df=Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(df>.6)continue;const sc=df*60+d*.2;if(sc<bs){bs=sc;best=q;}}return best;}
function jetAimLocal(J){const fx=-Math.sin(J.a),fz=-Math.cos(J.a);let best=null,bs=1e9;
 const look=(x,y,z)=>{const dx=x-J.x,dz=z-J.z,d=Math.hypot(dx,dz);if(d<8||d>110)return;const df=Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(df>.55)return;const s=df*60+d*.3;if(s<bs){bs=s;best={x,y,z};}};
 if(NET.role==='guest'){for(const o of netMon.values())if(o.z.userData.kind!=='f'||true)look(o.z.position.x,1,o.z.position.z);for(const o of netBot.values())if(o.rel===2)look(o.g.position.x,1,o.g.position.z);}
 else{for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,1,z.position.z);}for(const b of humans)if(!b.dead&&!b.inside&&PT.enemies.has(b.team))look(b.g.position.x,1,b.g.position.z);}
 return best||{x:J.x+fx*40,y:0,z:J.z+fz*40};}
function fireJet(){const J=jetMode;if(!J||attackWait>0||J.rk<=0||J.y<4)return;attackWait=.8;const air=jetAirLocal(J),tp=air||jetAimLocal(J);
 if(NET.role==='guest'){netSend({t:'jf',id:J.id,x:r2(J.x),y:r2(J.y-.8),z:r2(J.z),tx:r2(tp.x),ty:r2(tp.y),tz:r2(tp.z),tid:air?air.id:0});J.rk--;}
 else{J.rk--;spawnJetRocket(J.x,J.y-.8,J.z,tp.x,tp.y,tp.z,PT,true,'P',air,J.m.boom);}
 if(J.rk<=0){J.ejT=1.3;say(t('jet_out'),2.5);}renderW();}
function jetFly(dt){const J=jetMode;
 J.v=Math.min(J.m.spd,J.v+dt*11);const tin=(keys.KeyD?1:0)-(keys.KeyA?1:0)+jx,cin=(keys.KeyW?1:0)-(keys.KeyS?1:0)-jy;
 if(J.v>8)yaw-=tin*J.m.turn*dt;J.a=yaw;if(J.v>15)J.tAlt=Math.max(12,Math.min(70,J.tAlt+cin*13*dt));
 if(J.v>15)J.y+=(J.tAlt-J.y)*Math.min(1,dt*1.3);
 J.x+=-Math.sin(J.a)*J.v*dt;J.z+=-Math.cos(J.a)*J.v*dt;
 if(Math.abs(J.x)>EDGE-12||Math.abs(J.z)>EDGE-12){const ta=Math.atan2(J.x,J.z);let df=ta-yaw;df=Math.atan2(Math.sin(df),Math.cos(df));yaw+=df*Math.min(1,dt*2);J.x=Math.max(-EDGE+6,Math.min(EDGE-6,J.x));J.z=Math.max(-EDGE+6,Math.min(EDGE-6,J.z));}
 J.roll+=(tin*.6-J.roll)*Math.min(1,dt*4);J.g.position.set(J.x,J.y,J.z);J.g.rotation.set(-cin*.12*(J.v>15?1:0),J.a,J.roll);jetPaint(J);
 player.position.set(J.x,0,J.z);pY=J.y;player.visible=false;
 engT-=dt;if(engT<=0){engT=.3;noise(.35,.035,320);}
 if(J.ejT!==undefined){J.ejT-=dt;if(J.ejT<=0){J.ejT=undefined;ejectJet();return;}}
 // ietriecas debesskrāpī vai citā ēkā: lidmašīna uzsprāgst, pilots paspēj katapultēties
 if(J.y>3&&jetHits(J.x,J.z,J.y)){say(t('jet_hit'),2.5);const x=J.x,z=J.z,y=J.y;ejectJet();player.position.x+=Math.sin(J.a)*12;player.position.z+=Math.cos(J.a)*12;pushOut(player.position,.35,pY,PT);pY=y+4;
  if(NET.role==='guest')netSend({t:'jcr',id:J.id,x:r2(x),z:r2(z)});else crashJet(J);}}
function paraMove(dt){const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),d=new THREE.Vector3();
 if(keys.KeyW)d.add(f);if(keys.KeyS)d.sub(f);if(keys.KeyD)d.add(r);if(keys.KeyA)d.sub(r);if(jx||jy){d.addScaledVector(f,-jy);d.addScaledVector(r,jx);}if(d.lengthSq()>0)d.normalize();
 player.position.addScaledVector(d,4*dt);pushOut(player.position,.35,pY,PT);clampW(player.position);pY-=3.2*dt;const gnd=groundAt(player.position.x,player.position.z,pY,.35);
 player.visible=true;player.rotation.y=yaw;const u=player.userData;u.leg1.rotation.x=.3;u.leg2.rotation.x=-.3;u.arm1.rotation.x=u.arm2.rotation.x=Math.PI*.9;
 if(pY<=gnd){pY=gnd;paraMode=false;onGround=true;vy=0;chute().visible=false;u.arm1.rotation.x=u.arm2.rotation.x=0;if(overlapAt(player.position.x,player.position.z,.35,pY,PT)||bldAt(player.position.x,player.position.z,0)){const s=freeSpot(player.position.x,player.position.z,.35,1,25);if(s){player.position.x=s[0];player.position.z=s[1];pY=0;}}}
 player.position.y=pY;}
const _move10=move;move=function(dt){if(jetMode){jetFly(dt);return;}if(paraMode){paraMove(dt);return;}_move10(dt);};
const _updateCamera10=updateCamera;updateCamera=function(){if(!jetMode)return _updateCamera10();const J=jetMode,fx=-Math.sin(J.a),fz=-Math.cos(J.a);player.visible=false;
 camera.position.set(J.x-fx*17,J.y+5.5+pitch*6,J.z-fz*17);camera.lookAt(J.x+fx*14,J.y-2+pitch*8,J.z+fz*14);};
const _hit10=hit;hit=function(){if(jetMode){fireJet();return;}_hit10();};
const _damagePlayer10=damagePlayer;damagePlayer=function(d,s,p){if(jetMode)return;_damagePlayer10(d,s,p);};
const _gameOver10=gameOver;gameOver=function(){if(jetMode)ejectJet();paraMode=false;if(chuteM)chuteM.visible=false;_gameOver10();};
function jetNear(){const px=player.position.x,pz=player.position.z;if(NET.role==='guest'){for(const [id,o] of netJets)if(o.st===0&&Math.hypot(o.x-px,o.z-pz)<4.6*JM[o.mk].s)return{id,rk:o.rk,hp:o.hp,mk:o.mk};return null;}
 for(const J of JETS)if(J.st==='park'&&Math.hypot(J.x-px,J.z-pz)<4.6*J.m.s)return{id:J.id,rk:J.rk,hp:J.hp,mk:J.mk,J};return null;}
const _nearInter10=nearInter;nearInter=function(){if(jetMode)return{type:'eject'};if(paraMode)return null;if(!inTank&&pY<1.5){const j=jetNear();if(j)return{type:'jet',j};}return _nearInter10();};
const _updateHint10=updateHint;updateHint=function(){const o=nearInter(),h=$('hint');
 if(o&&o.type==='eject'){h.textContent=tf('jet_fly',{n:jetMode.rk,h:jetMode.hp});h.style.display='block';setAct('🪂');return;}
 if(o&&o.type==='jet'){h.textContent=(TOUCH?'':'E / ')+tf('jet_in',{n:o.j.rk,h:o.j.hp,m:t('jm_'+o.j.mk)});h.style.display='block';setAct('✈️');return;}_updateHint10();};
const _interact10=interact;interact=function(){if(!active)return _interact10();const o=nearInter();
 if(o&&o.type==='eject'){ejectJet();return;}
 if(o&&o.type==='jet'){if(NET.role==='guest')netSend({t:'jet',id:o.j.id});else if(o.j.J.res&&!o.j.J.res.dead&&o.j.J.res.jetGoal===o.j.J){o.j.J.res.jetGoal=null;o.j.J.res=null;enterJet(o.j.J);}else enterJet(o.j.J);return;}
 _interact10();};
// ---------- boti lido: karotāji aiziet uz lidlauku, paceļas, šauj ienaidniekiem un briesmoņiem, beigās katapultējas ----------
function botJetPick(){if(JETS.filter(J=>J.pilot&&J.pilot.g).length+humans.filter(b=>b.jetGoal).length>=2)return;
 const free=JETS.filter(J=>J.st==='park'&&!J.res);if(!free.length)return;const J=free[Math.floor(Math.random()*free.length)];
 const C=humans.filter(b=>!b.dead&&!b.inside&&!b.trader&&!b.jet&&!b.para&&!b.team.isPlayer&&!b.team.calm&&!b.team.farm&&!b.team.friendly&&!b.team.traderT&&Math.hypot(b.g.position.x-J.x,b.g.position.z-J.z)<230);
 if(!C.length)return;C.sort((a,b)=>(b.team.enemies.size-a.team.enemies.size)||(Math.hypot(a.g.position.x-J.x,a.g.position.z-J.z)-Math.hypot(b.g.position.x-J.x,b.g.position.z-J.z)));
 const b=C[0];b.jetGoal=J;J.res=b;}
function botBoard(b,J){b.jetGoal=null;J.res=null;b.jet=J;b.inside=true;b.tg=null;b.gx=null;b.follow=false;J.st='fly';J.pilot=b;remOb(J.ob);J.v=0;J.tAlt=34+Math.random()*10;J.t=0;J.fcd=4;J.wpT=0;
 if(Math.hypot(J.x-player.position.x,J.z-player.position.z)<160||PT.enemies.has(b.team))jsay('jet_bot',{n:b.name});}
function botEject(b,J){b.jet=null;b.para=true;b.inside=true;b.g.position.set(J.x,J.y,J.z);b.g.visible=true;const c=chuteMesh(b.team.color);c.visible=true;b.g.add(c);b.chute=c;J.st='fall';J.pilot=null;}
function botFly(J,b,dt){J.t+=dt;J.fcd-=dt;J.v=Math.min(J.m.spd*.9,J.v+dt*10);
 J.ttT=(J.ttT||0)-dt;if(J.ttT<=0){J.ttT=1;let best=null,bd=170;const T=b.team;
  for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0||u.kind==='f')continue;const d=Math.hypot(z.position.x-J.x,z.position.z-J.z);if(d<bd){bd=d;best={x:z.position.x,z:z.position.z};}}
  for(const h of HL){if(h.team===T||!T.enemies.has(h.team)||((h.y||0)>5&&!(typeof onRoofH==='function'&&onRoofH(h)))||(typeof underCanopy==='function'&&underCanopy(h.p.x,h.p.z)))continue;const d=Math.hypot(h.p.x-J.x,h.p.z-J.z)-25;if(d<bd){bd=d;best={x:h.p.x,z:h.p.z};}}
  J.tg=best;J.ta=null;
  if(J.m.aa){let ad=160;for(const q of JETS){if(q===J||q.st!=='fly'||!q.pilot)continue;const T2=pilotTeam(q);if(!T2||T2===T||T2.friendly||T2.traderT)continue;const d=Math.hypot(q.x-J.x,q.z-J.z);if(d>ad)continue;
    if(!T.enemies.has(T2)){J.pc=J.pc||new Set();if(J.pc.has(T2.id)||d>110)continue;J.pc.add(T2.id);if(Math.random()<(T2===PT?.45:.6))war(T,T2);else continue;}
    ad=d;J.ta=q;}}}
 if(J.ta&&J.ta.st!=='fly')J.ta=null;let tx,tz;if(J.ta){tx=J.ta.x;tz=J.ta.z;J.tAlt=Math.max(14,Math.min(70,J.ta.y));}else if(J.tg){tx=J.tg.x;tz=J.tg.z;}else{J.wpT-=dt;if(J.wpT<=0||!J.wp){J.wpT=14;J.wp=[(Math.random()*2-1)*140,(Math.random()*2-1)*140];}tx=J.wp[0];tz=J.wp[1];}
 const ta=Math.atan2(-(tx-J.x),-(tz-J.z));let df=ta-J.a;df=Math.atan2(Math.sin(df),Math.cos(df));const tr=Math.max(-J.m.turn*.8*dt,Math.min(J.m.turn*.8*dt,df));J.a+=tr;J.roll+=(-tr/dt*.5-J.roll)*Math.min(1,dt*3);
 if(J.v>15){const hA=maxHAhead(J.x,J.z,J.a,35);J.y+=(Math.max(J.tAlt,hA+7)-J.y)*Math.min(1,dt*1.4);}
 J.x+=-Math.sin(J.a)*J.v*dt;J.z+=-Math.cos(J.a)*J.v*dt;J.x=Math.max(-EDGE+6,Math.min(EDGE-6,J.x));J.z=Math.max(-EDGE+6,Math.min(EDGE-6,J.z));
 const hd=J.tg?Math.hypot(J.tg.x-J.x,J.tg.z-J.z):1e9;
 if(J.ta&&J.rk>0&&J.fcd<=0&&Math.abs(df)<.45){const ad=Math.hypot(J.ta.x-J.x,J.ta.z-J.z);if(ad<120&&ad>8){J.fcd=3;J.rk--;spawnJetRocket(J.x,J.y-.8,J.z,J.ta.x,J.ta.y,J.ta.z,b.team,false,b,J.ta,J.m.boom);}}
 else if(!J.ta&&J.tg&&J.rk>0&&J.fcd<=0&&hd>22&&hd<75&&Math.abs(df)<.3&&J.y>8){J.fcd=3.5;J.rk--;spawnJetRocket(J.x,J.y-.8,J.z,J.tg.x,0,J.tg.z,b.team,false,b,null,J.m.boom);}
 if((J.rk<=0&&J.fcd<2)||J.t>95)botEject(b,J);
 else if(J.y>3&&jetHits(J.x,J.z,J.y))crashJet(J);
 b.g.position.set(J.x,0,J.z);b.g.visible=false;b.lab.visible=b.bar.bg.visible=b.bar.f.visible=false;}
const _botThink10=botThink;botThink=function(b){if(b.jet||b.para)return;
 if(b.jetGoal){const J=b.jetGoal;if(J.st!=='park'||J.res!==b){b.jetGoal=null;}else if(!nearestThreat(b)){const p=b.g.position;if(Math.hypot(p.x-J.x,p.z-J.z)<3.6){botBoard(b,J);return;}b.tg=null;b.follow=false;goal(b,J.x+2.6,J.z,false);return;}}
 _botThink10(b);};
// ---------- tanks: labāka tēmēšana un pretgaisa šāviņš pret lidmašīnām ----------
const _fireTank10=fireTank;fireTank=function(){const t=inTank;if(!t||attackWait>0||t.shells<=0)return _fireTank10();
 const px=player.position.x,pz=player.position.z,ang=(x,z)=>{const a=Math.atan2(-(x-px),-(z-pz));let df=a-yaw;return[a,Math.abs(Math.atan2(Math.sin(df),Math.cos(df)))];};
 let best=null,bs=1e9;for(const J of JETS){if((J.st!=='fly'&&J.st!=='fall')||J.pilot==='P'||(J.pilot&&J.pilot.pos))continue;const d=Math.hypot(J.x-px,J.z-pz),[a,df]=ang(J.x,J.z);if(d>120||df>.8)continue;const s=df*40+d*.2;if(s<bs){bs=s;best=J;}}
 if(best){fireAA(t,best);return;}
 // uz zemes: tornis pats pagriežas pret tuvāko mērķi priekšā
 let ga=null;bs=1e9;const look=(x,z)=>{const d=Math.hypot(x-px,z-pz);if(d>65||d<2)return;const [a,df]=ang(x,z);if(df>.6)return;const s=df*20+d*.2;if(s<bs&&!blockedLine(player.position,{x,z},1.9,PT)){bs=s;ga=a;}};
 for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,z.position.z);}for(const b of humans)if(PT.enemies.has(b.team)&&!b.inside)look(b.g.position.x,b.g.position.z);
 if(ga!==null)yaw=ga;_fireTank10();};
function fireAA(t,J){t.shells--;attackWait=1.2;const gx=t.g.position.x,gz=t.g.position.z,d=Math.hypot(J.x-gx,J.y-2,J.z-gz),tt=d/75;
 const ax=J.x-Math.sin(J.a)*J.v*tt,az=J.z-Math.cos(J.a)*J.v*tt,ay=J.y-(J.st==='fall'?5*tt:0),l=Math.hypot(ax-gx,ay-2,az-gz)||1;
 yaw=Math.atan2(-(ax-gx),-(az-gz));const m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0x222222}));m.scale.setScalar(1.5);m.position.set(gx,2.2,gz);scene.add(m);
 AAS.push({m,vx:(ax-gx)/l*75,vy:(ay-2)/l*75,vz:(az-gz)/l*75,life:tt+1.5,J});sfx('rocket');sfx('boom');explosionFx(gx-Math.sin(yaw)*3,2,gz-Math.cos(yaw)*3,1,0xffcc66);renderW();
 if(t.shells<=0){t.dead=true;say(t_('tank_empty'),4);setTimeout(()=>{if(inTank===t)exitTank();t.g.userData.hull.material.color.setHex(0x2a2a22);},1500);}}
const pilotTeam=J=>J.pilot==='P'?PT:J.pilot&&J.pilot.pos?GT(J.pilot):J.pilot&&J.pilot.team?J.pilot.team:null;
function jetDamage(J,d,team,pl){if(J.st!=='fly'&&J.st!=='fall')return;const PTm=pilotTeam(J);if(team&&PTm&&team!==PTm)war(team,PTm);J.hp-=d;sfxAt('boom',J.x,J.z,120);
 if(J.hp<=0){shootDown(J,team);return;}if(J.pilot==='P')say(tf('jet_dmg',{n:J.hp}),1.5);else if(J.pilot&&J.pilot.pos)netTo(J.pilot,{t:'msg',s:tf('jet_dmg',{n:J.hp}),d:1.5});}
function shootDown(J,team){const P=J.pilot;J.burn=true;explosionFx(J.x,J.y,J.z,4,0xff7a1a);sfxAt('boom',J.x,J.z,150);
 if(P==='P'){say(t('jet_shot'),3);ejectJet();}else if(P&&P.pos){netTo(P,{t:'jdown'});P.inJet=null;P.para=J.y>4;}else if(P&&P.g){P.jet=null;P.inside=false;killBot(P,team||PT);}
 J.pilot=null;J.st='fall';J.v=Math.max(J.v,18);jsay(team===PT&&inTank?'jet_down':'jet_dn');}
// ---------- saimnieka cikls ----------
function jetsTick(dt){
 for(const J of JETS){if(J.st==='gone')continue;
  if(J.st==='fly'&&J.pilot&&J.pilot.pos){const G=J.pilot;if(!NET.guests.has(G.id)||G.dead){J.st='fall';J.pilot=null;G.inJet=null;}else{const ox=J.x,oz=J.z;J.x=G.pos.x;J.z=G.pos.z;J.y=G.y;J.a=G.yaw;J.v=Math.hypot(J.x-ox,J.z-oz)/dt||J.v;J.g.position.set(J.x,J.y,J.z);J.g.rotation.set(0,J.a,0);}}
  else if(J.st==='fly'&&J.pilot&&J.pilot.g){if(J.pilot.dead){J.st='fall';J.pilot=null;}else{botFly(J,J.pilot,dt);if(J.st==='gone')continue;J.g.position.set(J.x,J.y,J.z);J.g.rotation.set(0,J.a,J.roll);}}
  else if(J.st==='fall'){J.v=Math.max(16,J.v-dt*2);J.y-=dt*6;J.x+=-Math.sin(J.a)*J.v*dt;J.z+=-Math.cos(J.a)*J.v*dt;J.roll+=dt*2.5;J.g.position.set(J.x,J.y,J.z);J.g.rotation.set(.35,J.a,J.roll);
   if(Math.random()<dt*12)debris(J.x,J.y,J.z,J.burn?0xff7a1a:0x444444,1);if(jetHits(J.x,J.z,J.y))crashJet(J);}
  if(J.st!=='gone')jetPaint(J);}
 for(let i=JR.length-1;i>=0;i--){const r=JR[i];if(r.gd)continue;r.life-=dt;
  if(r.tj){const q=r.tj;if(q.st==='fly'||q.st==='fall'){const dx=q.x-r.x,dy=q.y-r.y,dz=q.z-r.z,l=Math.hypot(dx,dy,dz)||1,k=Math.min(1,dt*3.5);r.vx+=(dx/l*62-r.vx)*k;r.vy+=(dy/l*62-r.vy)*k;r.vz+=(dz/l*62-r.vz)*k;
    if(l<4.5){scene.remove(r.m);JR.splice(i,1);explosionFx(q.x,q.y,q.z,3,0xff9e40);SHOOTER=ownId(r.owner);jetDamage(q,2,r.team,r.pl);SHOOTER=0;continue;}}
   r.x+=r.vx*dt;r.y+=r.vy*dt;r.z+=r.vz*dt;r.m.position.set(r.x,r.y,r.z);r.m.lookAt(r.x+r.vx,r.y+r.vy,r.z+r.vz);if(Math.random()<dt*20)debris(r.x,r.y,r.z,0xffb74d,1);
   if(r.life<=0||r.y<.4){scene.remove(r.m);JR.splice(i,1);explosionFx(r.x,r.y,r.z,2,0xff9e40);if(r.y<.4){SHOOTER=ownId(r.owner);jetBoom(r.x,r.z,r.team,r.pl,1,r.boom,r.th);SHOOTER=0;}}continue;}r.x+=r.vx*dt;r.y+=r.vy*dt;r.z+=r.vz*dt;r.m.position.set(r.x,r.y,r.z);if(Math.random()<dt*20)debris(r.x,r.y,r.z,0xffb74d,1);
  if(r.y<=.4||r.life<=0||Math.hypot(r.x-r.tx,r.y-r.ty,r.z-r.tz)<1.5||(r.y<45&&bldHit(r.x,r.z,r.y))){scene.remove(r.m);JR.splice(i,1);SHOOTER=ownId(r.owner);jetBoom(r.x,r.z,r.team,r.pl,1,r.boom,r.th);SHOOTER=0;}}
 for(let i=AAS.length-1;i>=0;i--){const s=AAS[i];s.life-=dt;if(s.J&&(s.J.st==='fly'||s.J.st==='fall')){const p=s.m.position,dx=s.J.x-p.x,dy=s.J.y-p.y,dz=s.J.z-p.z,l=Math.hypot(dx,dy,dz)||1,k=Math.min(1,dt*3);s.vx+=(dx/l*75-s.vx)*k;s.vy+=(dy/l*75-s.vy)*k;s.vz+=(dz/l*75-s.vz)*k;}s.m.position.x+=s.vx*dt;s.m.position.y+=s.vy*dt;s.m.position.z+=s.vz*dt;const p=s.m.position;let hit=null;
  for(const J of JETS)if((J.st==='fly'||J.st==='fall')&&J.pilot!=='P'&&!(J.pilot&&J.pilot.pos)&&Math.hypot(J.x-p.x,J.y-p.y,J.z-p.z)<5)hit=J;
  if(hit||s.life<=0){scene.remove(s.m);AAS.splice(i,1);explosionFx(p.x,p.y,p.z,hit?4:2,0xff9e40);if(hit)jetDamage(hit,2,PT,true);}}
 botJetT-=dt;if(botJetT<=0){botJetT=2;if(Math.random()<.1)botJetPick();}
 for(const b of humans)if(b.para){b.g.position.y-=dt*3.2;if(b.g.position.y<=0){b.g.position.y=0;b.para=false;b.inside=false;if(b.chute){b.g.remove(b.chute);freeObj(b.chute);b.chute=null;}const s=(overlapAt(b.g.position.x,b.g.position.z,.35)||bldAt(b.g.position.x,b.g.position.z,0))&&freeSpot(b.g.position.x,b.g.position.z,.35,1,25);if(s){b.g.position.x=s[0];b.g.position.z=s[1];}}}
 for(const G of NET.guests.values()){if(!G.mesh)continue;if(G.para&&G.y<.3)G.para=false;if(!!G.para!==!!G.chute){if(G.para){G.chute=chuteMesh(G.col);G.chute.visible=true;G.mesh.add(G.chute);}else{G.mesh.remove(G.chute);freeObj(G.chute);G.chute=null;}}}
 if(NET.role==='host'&&NET.guests.size){jetNetT-=dt;if(jetNetT<=0){jetNetT=.1;const ST={park:0,fly:1,fall:2};
  const msg={t:'jt',J:JETS.filter(J=>J.st!=='gone').map(J=>[J.id,ST[J.st],r2(J.x),r2(J.y),r2(J.z),r2(J.a),J.rk,J.pilot==='P'?0:J.pilot&&J.pilot.pos?J.pilot.id:J.pilot?-1:-2,r2(J.roll),JMK.indexOf(J.mk),J.hp]),R:JR.map(r=>[r2(r.x),r2(r.y),r2(r.z)]).concat(AAS.map(s=>[r2(s.m.position.x),r2(s.m.position.y),r2(s.m.position.z)]))};
  for(const G of NET.guests.values())if(G.ready)netTo(G,msg);}}
}
function wrecksTick(dt){for(let i=WRECKS.length-1;i>=0;i--){const w=WRECKS[i];w.t-=dt;if(w.t<=0){scene.remove(w.g);freeObj(w.g);WRECKS.splice(i,1);}}}
const _netHostFrame10=netHostFrame;netHostFrame=function(dt){_netHostFrame10(dt);for(const G of NET.guests.values())if(G.inJet&&G.mesh){G.mesh.visible=false;G.lab.visible=G.bar.bg.visible=G.bar.f.visible=false;}};
const _updateFx10=updateFx;updateFx=function(dt){_updateFx10(dt);if(NET.role!=='guest'&&(active||NET.guests.size))jetsTick(dt);else if(NET.role==='guest')guestJets(dt);wrecksTick(dt);};
const _start10=start;start=function(){jetMode=null;paraMode=false;leaveFog();if(chuteM)chuteM.visible=false;clearJets();_start10();for(let i=0;i<SLOTS.length;i++)spawnJet(i);afObs();};
const _dawn10=dawn;dawn=function(){_dawn10();if(NET.role==='guest')return;let n=0;for(let i=0;i<SLOTS.length;i++)if(!JETS.some(J=>J.slot===i&&J.st!=='gone')){for(let k=JETS.length-1;k>=0;k--)if(JETS[k].slot===i)JETS.splice(k,1);spawnJet(i);n++;}if(n)jsay('jet_new');};
// ---------- kopīgā spēle ----------
const netJets=new Map(),netJR=[];
function guestJets(dt){const k=Math.min(1,dt*10);for(const [id,o] of netJets){if(jetMode&&jetMode.id===id)continue;o.g.position.x+=(o.x-o.g.position.x)*k;o.g.position.y+=(o.y-o.g.position.y)*k;o.g.position.z+=(o.z-o.g.position.z)*k;o.g.rotation.set(o.st===2?.35:0,lerpA(o.g.rotation.y,o.a,k),o.roll||0);}}
const _netHostMsg10=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='jet'){const J=JETS.find(q=>q.id===d.id);if(!J||J.st!=='park'||G.dead){netTo(G,{t:'msg',s:t('jet_busy'),d:1.5});return;}if(J.res){J.res.jetGoal=null;J.res=null;}
  J.st='fly';J.pilot=G;G.inJet=J;remOb(J.ob);netTo(G,{t:'jetok',id:J.id,x:J.x,z:J.z,y:J.y,a:J.a,rk:J.rk,hp:J.hp,mk:J.mk});return;}
 if(d&&G.ready&&d.t==='jf'){const J=JETS.find(q=>q.id===d.id);if(J&&J.pilot===G&&J.rk>0){J.rk--;const tj=d.tid?JETS.find(q=>q.id===d.tid):null;spawnJetRocket(+d.x,+d.y,+d.z,+d.tx,+d.ty,+d.tz,GT(G),true,G,tj,J.m.boom);}return;}
 if(d&&G.ready&&(d.t==='jej'||d.t==='jcr')){const J=JETS.find(q=>q.id===d.id);if(J&&J.pilot===G){J.pilot=null;G.inJet=null;if(d.t==='jcr'){J.x=+d.x;J.z=+d.z;crashJet(J);}else{J.st='fall';J.x=+d.x;J.y=+d.y;J.z=+d.z;J.a=+d.a;J.v=+d.v||20;G.para=+d.y>4;}}return;}
 _netHostMsg10(G,d);};
const _netGuestMsg10=netGuestMsg;netGuestMsg=function(d){
 if(d&&d.t==='jt'){const seen=new Set();for(const [id,st,x,y,z,a,rk,pid,roll,mi,hp] of d.J){seen.add(id);let o=netJets.get(id);if(!o){o={g:jetMesh(JMK[mi])};o.g.position.set(x,y,z);netJets.set(id,o);}Object.assign(o,{st,x,y,z,a,rk,pid,roll,mk:JMK[mi],hp});
   const u=o.g.userData;u.rk.forEach((r,i)=>r.visible=i<rk);u.gear.visible=y<3.5;u.fl.visible=st===1;if(jetMode&&jetMode.id===id){if(rk<jetMode.rk)jetMode.rk=rk;jetMode.hp=hp;}}
  for(const [id,o] of netJets)if(!seen.has(id)){scene.remove(o.g);freeObj(o.g);netJets.delete(id);}
  while(netJR.length<d.R.length){const m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0xff7043}));m.scale.setScalar(1.6);scene.add(m);netJR.push(m);}
  netJR.forEach((m,i)=>{m.visible=i<d.R.length;if(m.visible)m.position.set(...d.R[i]);});return;}
 if(d&&d.t==='jetok'){const o=netJets.get(d.id);if(!o)return;enterJet({id:d.id,g:o.g,x:d.x,y:d.y,z:d.z,a:d.a,rk:d.rk,hp:d.hp,mk:d.mk,m:JM[d.mk]||JM.hawk,v:0,tAlt:30,roll:0});return;}
 if(d&&d.t==='jdown'){if(jetMode){say(t('jet_shot'),3);ejectJet();}return;}
 if(d&&d.t==='wel'){jetMode=null;paraMode=false;leaveFog();for(const o of netJets.values()){scene.remove(o.g);freeObj(o.g);}netJets.clear();for(const w of WRECKS){scene.remove(w.g);freeObj(w.g);}WRECKS.length=0;}
 _netGuestMsg10(d);if(d&&d.t==='wel')afObs();};
const _netExtraEv210=netExtraEv2;netExtraEv2=function(e){if(e.e==='cf'){crashFire(e.x,e.z,false);return;}_netExtraEv210(e);};
// minikartē: ✈️ lidmašīnas
const _drawMap10=drawMap;drawMap=function(){_drawMap10();const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R;
 g.font=Math.round(W*.075)+'px serif';const L=NET.role==='guest'?[...netJets.values()].map(o=>[o.x,o.z]):JETS.filter(J=>J.st!=='gone').map(J=>[J.x,J.z]);for(const [x,z] of L)g.fillText('✈️',W/2+(x-cx)*sc,W/2+(z-cz)*sc);};
