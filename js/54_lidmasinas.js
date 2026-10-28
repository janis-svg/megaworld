// 54_lidmasinas.js - Reālākas lidmašīnas: F-16, Rafale, MiG-29 un Su-25. Visām ir gaiss-gaiss raķetes (🎯, notriec lidmašīnas un helikopterus)
// un gaiss-zeme raķetes (🚀, pa zemi). Šaujot: ja priekšā ir pretinieka lidaparāts un ir 🎯, lido gaiss-gaiss raķete, citādi gaiss-zeme.
// Modeļu atslēgas paliek vecās (hawk, bison, bolt, eagle), jo tās izmanto kopīgā spēle.
Object.assign(T.lv,{jm_hawk:'F-16: ātrs un līdzsvarots, 2 🎯 + 3 🚀',jm_bison:'Su-25: uzbrukuma lidmašīna, lēna, ļoti izturīga, 1 🎯 + 6 🚀',jm_bolt:'MiG-29: visātrākā, gaisa kaujai, 4 🎯 + 2 🚀',jm_eagle:'Rafale: visveiklākā, 3 🎯 + 4 🚀',
 jet_in2:'✈️ {m} (❤️ {h})',jet_fly2:'✈️ ❤️ {h} · 🎯 {a} gaiss-gaiss · 🚀 {n} gaiss-zeme · 🤚 katapultēties'});
Object.assign(T.en,{jm_hawk:'F-16: fast and balanced, 2 🎯 + 3 🚀',jm_bison:'Su-25: attack jet, slow, very tough, 1 🎯 + 6 🚀',jm_bolt:'MiG-29: fastest, built for dogfights, 4 🎯 + 2 🚀',jm_eagle:'Rafale: most agile, 3 🎯 + 4 🚀',
 jet_in2:'✈️ {m} (❤️ {h})',jet_fly2:'✈️ ❤️ {h} · 🎯 {a} air-to-air · 🚀 {n} air-to-ground · 🤚 eject'});
// rk = gaiss-zeme, aam = gaiss-gaiss
Object.assign(JM.hawk,{c:0x8c949c,s:1,spd:30,turn:1.35,rk:3,aam:2,hp:2,boom:1,aa:true});
Object.assign(JM.bison,{c:0x6f6a48,s:1.12,spd:21,turn:.95,rk:6,aam:1,hp:4,boom:1.5,aa:true});
Object.assign(JM.bolt,{c:0x7d95a3,s:.98,spd:36,turn:1.45,rk:2,aam:4,hp:2,boom:1,aa:true});
Object.assign(JM.eagle,{c:0x5f6873,s:1,spd:29,turn:1.6,rk:4,aam:3,hp:3,boom:1.2,aa:true});
const jaInit=J=>{if(J.aa===undefined)J.aa=(JM[J.mk]||JM.hawk).aam;};
// ---------- modeļi ----------
function jPlate(g,pts,y,c,vert){const s=new THREE.Shape();pts.forEach(([a,b],i)=>i?s.lineTo(a,b):s.moveTo(a,b));const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.1,bevelEnabled:false}),mat(c,.6));
 if(vert){m.rotation.y=Math.PI/2;m.position.set(-.05,y,0);}else{m.rotation.x=Math.PI/2;m.position.y=y;}m.castShadow=true;g.add(m);return m;}
function jTube(g,r1,r2,l,c,x,y,z,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,l,seg||12),mat(c,.55));m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;}
function jMissile(g,x,y,z,aa){const r=new THREE.Group();jTube(r,.09,.09,aa?1.5:1.7,aa?0xf2f2f2:0x9e9e8e,0,0,0,8);const n=new THREE.Mesh(new THREE.ConeGeometry(.09,.3,8),mat(aa?0xc62828:0x555555,.5));n.rotation.x=-Math.PI/2;n.position.z=aa?-.9:-1;r.add(n);
 for(const s of [-1,1])jPlate(r,[[0,.55],[s*.22,.75],[s*.22,.85],[0,.85]],0,0x777777);r.position.set(x,y,z);g.add(r);return r;}
function jetMesh2(k){const M=JM[k]||JM.hawk,g=new THREE.Group(),c=M.c,dk=0x3d434a,gl=0x4fc3f7;const plate=(p,y,cc)=>jPlate(g,p,y,cc||c),fin=(p,x,cc)=>{const f=jPlate(g,p,0,cc||c,true);f.position.x=x;return f;};
 let aaP,agP,noz;
 if(k==='hawk'){ // F-16: viens dzinējs, trapeces spārni, viena ķīļa virsma, gaisa ieplūde zem korpusa
  jTube(g,.55,.6,7.6,c,0,0,.4);const n=new THREE.Mesh(new THREE.ConeGeometry(.55,2.3,14),mat(c,.55));n.rotation.x=-Math.PI/2;n.position.z=-4.6;g.add(n);
  vadd(g,.95,.55,2.2,dk,0,-.55,-.9);plate([[.4,-1.6],[4.1,1.3],[4.1,1.9],[.4,2.2]],-.05);plate([[-.4,-1.6],[-4.1,1.3],[-4.1,1.9],[-.4,2.2]],-.05);
  plate([[.4,3.2],[2.1,4.1],[2.1,4.5],[.4,4.4]],-.05);plate([[-.4,3.2],[-2.1,4.1],[-2.1,4.5],[-.4,4.4]],-.05);
  fin([[-2.6,.4],[-4.3,2.6],[-4.8,2.6],[-4.4,.4]],0);aaP=[[4.15,-.05,1.5],[-4.15,-.05,1.5]];agP=[[2.3,-.35,1],[-2.3,-.35,1],[0,-.65,.4]];noz=[[0,4.3]];}
 else if(k==='eagle'){ // Rafale: delta spārni, priekšējie spārniņi, divi dzinēji
  jTube(g,.6,.6,7.4,c,0,0,.5);const n=new THREE.Mesh(new THREE.ConeGeometry(.6,2.4,14),mat(c,.55));n.rotation.x=-Math.PI/2;n.position.z=-4.4;g.add(n);
  plate([[.45,-1.4],[3.9,2.4],[3.9,2.8],[.45,3.3]],-.1);plate([[-.45,-1.4],[-3.9,2.4],[-3.9,2.8],[-.45,3.3]],-.1);
  plate([[.4,-2.9],[1.5,-2.2],[1.5,-1.9],[.4,-2.1]],.15);plate([[-.4,-2.9],[-1.5,-2.2],[-1.5,-1.9],[-.4,-2.1]],.15);
  for(const s of [-1,1])vadd(g,.55,.5,1.8,dk,s*.75,-.35,-.4);fin([[-1.9,.4],[-3.8,2.4],[-4.3,2.4],[-4.1,.4]],0);
  aaP=[[3.9,-.1,2.6],[-3.9,-.1,2.6],[1.6,-.4,1.6]];agP=[[2.4,-.45,1.6],[-2.4,-.45,1.6],[-1.6,-.4,1.6],[0,-.65,.6]];noz=[[-.35,4.3],[.35,4.3]];}
 else if(k==='bolt'){ // MiG-29: divi dzinēji zem korpusa, divas ķīļa virsmas
  jTube(g,.5,.55,7,c,0,.15,.2);const n=new THREE.Mesh(new THREE.ConeGeometry(.5,2.4,14),mat(c,.55));n.rotation.x=-Math.PI/2;n.position.set(0,.15,-4.5);g.add(n);
  for(const s of [-1,1]){jTube(g,.42,.45,5.4,c,s*.8,-.2,1.2);vadd(g,.75,.6,1,dk,s*.8,-.25,-1.6);}
  plate([[.9,-.9],[4.3,1.7],[4.3,2.3],[.9,2.6]],-.1);plate([[-.9,-.9],[-4.3,1.7],[-4.3,2.3],[-.9,2.6]],-.1);
  plate([[1,3.3],[2.6,4.2],[2.6,4.6],[1,4.5]],-.15);plate([[-1,3.3],[-2.6,4.2],[-2.6,4.6],[-1,4.5]],-.15);
  for(const s of [-1,1]){const f=fin([[-2.4,.3],[-3.9,2.3],[-4.4,2.3],[-4.3,.3]],s*.85);f.rotation.z=-s*.25;}
  aaP=[[4.2,-.15,2],[-4.2,-.15,2],[2.8,-.4,1.6],[-2.8,-.4,1.6]];agP=[[1.9,-.45,1.3],[-1.9,-.45,1.3]];noz=[[-.8,4]];noz.push([.8,4]);}
 else{ // Su-25: taisni spārni, divi dzinēju pākstis sānos, augsta ķīļa virsma, kamuflāža
  jTube(g,.6,.55,7.2,c,0,0,.3);const n=new THREE.Mesh(new THREE.ConeGeometry(.6,1.6,12),mat(c,.6));n.rotation.x=-Math.PI/2;n.position.z=-4.7;g.add(n);
  for(const s of [-1,1])jTube(g,.5,.5,3.6,0x5a5638,s*.95,-.05,1.4);
  plate([[.6,-.6],[5.3,.5],[5.3,1.3],[.6,1.7]],0);plate([[-.6,-.6],[-5.3,.5],[-5.3,1.3],[-.6,1.7]],0);
  plate([[.4,3.1],[2.2,3.5],[2.2,4],[.4,4.1]],.4);plate([[-.4,3.1],[-2.2,3.5],[-2.2,4],[-.4,4.1]],.4);fin([[-2.6,.4],[-3.8,3],[-4.4,3],[-4.3,.4]],0);
  for(let i=0;i<6;i++)vadd(g,.9+Math.random()*.8,.02,.6+Math.random()*.8,0x4e4a30,(Math.random()-.5)*7,.04,Math.random()*1.4-.3);
  aaP=[[4.9,-.15,.9]];agP=[[1.6,-.4,.6],[-1.6,-.4,.6],[2.6,-.4,.7],[-2.6,-.4,.7],[3.7,-.4,.8],[-3.7,-.4,.8]];noz=[[-.95,3.3],[.95,3.3]];}
 // kabīne, zvaigznes, sprauslas, liesma, šasija
 const cp=new THREE.Mesh(new THREE.SphereGeometry(.5,14,10),new THREE.MeshStandardMaterial({color:gl,roughness:.1,metalness:.3,transparent:true,opacity:.85}));cp.scale.set(.85,.7,2.2);cp.position.set(0,k==='bolt'?.75:.55,-2.4);g.add(cp);
 for(const s of [-1,1]){const st=cube(.6,.03,.6,0xc62828,.6);st.position.set(s*2.6,k==='bison'?.06:-.0,k==='bison'?.6:1.2);g.add(st);}
 for(const [x,z] of noz)jTube(g,.38,.46,.7,0x262626,x,k==='bolt'?-.2:0,z,12);
 const fl=new THREE.Mesh(new THREE.ConeGeometry(.42,1.8,8),new THREE.MeshBasicMaterial({color:0xffa726}));fl.rotation.x=-Math.PI/2;fl.position.set(noz[0][0]*0,0,noz[0][1]+1.2);fl.visible=false;g.add(fl);
 const rk=agP.slice(0,M.rk).map(p=>jMissile(g,...p,false)),aa=aaP.slice(0,M.aam).map(p=>jMissile(g,...p,true));
 const gear=new THREE.Group();for(const [x,z] of [[0,-3.2],[-1.2,1],[1.2,1]]){const l=cube(.15,1,.15,0x222222,.8);l.position.set(x,-.95,z);gear.add(l);const wh=cube(.25,.4,.4,0x111111,1);wh.position.set(x,-1.4,z);gear.add(wh);}g.add(gear);
 g.scale.setScalar(M.s);g.rotation.order='YXZ';g.userData={rk,aa,gear,fl};scene.add(g);return g;}
jetMesh=jetMesh2;
const _jetPaint54=jetPaint;jetPaint=function(J){_jetPaint54(J);jaInit(J);const u=J.g.userData;if(u.aa)u.aa.forEach((r,i)=>r.visible=i<J.aa);};
const _spawnJet54=spawnJet;spawnJet=function(i){const J=_spawnJet54(i);J.m=Object.assign({},J.m);jaInit(J);jetPaint(J);return J;};
// ---------- spēlētājs šauj: gaiss-gaiss, ja priekšā ir lidaparāts, citādi gaiss-zeme ----------
fireJet=function(){const J=jetMode;if(!J||attackWait>0||J.y<4)return;jaInit(J);const air=J.aa>0?jetAirLocal(J):null;if(!air&&!(J.rk>0))return;attackWait=.8;const tp=air||jetAimLocal(J);
 if(air)J.aa--;else J.rk--;
 if(NET.role==='guest')netSend({t:'jf',id:J.id,x:r2(J.x),y:r2(J.y-.8),z:r2(J.z),tx:r2(tp.x),ty:r2(tp.y),tz:r2(tp.z),tid:air?air.id:0});
 else spawnJetRocket(J.x,J.y-.8,J.z,tp.x,tp.y,tp.z,PT,true,'P',air,air?1:J.m.boom);
 if(J.rk<=0&&J.aa<=0){J.ejT=1.3;say(t('jet_out'),2.5);}renderW();};
const _netHostMsg54=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='jf'){const J=JETS.find(q=>q.id===d.id);if(!J||J.pilot!==G)return;jaInit(J);const tj=d.tid?JETS.find(q=>q.id===d.tid)||HELIS.find(q=>q.id===d.tid&&q.st==='fly'):null;
  if(d.tid&&J.aa>0)J.aa--;else if(J.rk>0)J.rk--;else return;spawnJetRocket(+d.x,+d.y,+d.z,+d.tx,+d.ty,+d.tz,GT(G),true,G,tj||null,tj?1:J.m.boom);return;}
 _netHostMsg54(G,d);};
// gaiss-gaiss raķetes mērķē arī helikopterus
const _jetAirLocal54=jetAirLocal;jetAirLocal=function(J){const a=_jetAirLocal54(J);if(a||NET.role==='guest')return a;const fx=-Math.sin(J.a),fz=-Math.cos(J.a);let best=null,bs=1e9;
 for(const H of HELIS){if(H.st!=='fly'||H.pilot==='P'||(H.pilot&&H.pilot.pos))continue;const HT=heliTeam(H);if(HT===PT||(HT&&HT.friendly))continue;const dx=H.x-J.x,dz=H.z-J.z,d=Math.hypot(dx,dz);if(d<6||d>140)continue;
  const df=Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(df>.6)continue;const sc=df*60+d*.2;if(sc<bs){bs=sc;best=H;}}return best;};
// ---------- boti: tās pašas divas raķešu kopas ----------
const _botFly54=botFly;botFly=function(J,b,dt){jaInit(J);J.m.aa=J.aa>0;if(!J.m.aa)J.ta=null;const rk=J.rk,fcd=J.fcd;J.rk=0;J.fcd=99;_botFly54(J,b,dt);J.rk=rk;J.fcd=fcd-dt;
 if(J.pilot!==b||J.st!=='fly')return;
 const aim=(x,z)=>{let df=Math.atan2(-(x-J.x),-(z-J.z))-J.a;return Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));};
 if(J.ta&&J.ta.st==='fly'&&J.aa>0){if(J.fcd<=0){const ad=Math.hypot(J.ta.x-J.x,J.ta.z-J.z);if(ad<120&&ad>8&&aim(J.ta.x,J.ta.z)<.45){J.fcd=2.5;J.aa--;spawnJetRocket(J.x,J.y-.8,J.z,J.ta.x,J.ta.y,J.ta.z,b.team,false,b,J.ta,1);}}}
 else if(J.tg&&J.rk>0&&J.fcd<=0&&J.y>8){const hd=Math.hypot(J.tg.x-J.x,J.tg.z-J.z);if(hd>22&&hd<75&&aim(J.tg.x,J.tg.z)<.3){J.fcd=3.5;J.rk--;spawnJetRocket(J.x,J.y-.8,J.z,J.tg.x,0,J.tg.z,b.team,false,b,null,J.m.boom);}}
 if(J.rk<=0&&J.aa<=0&&J.fcd<2)botEject(b,J);};
// ---------- norādes ----------
const _updateHint54=updateHint;updateHint=function(){const o=nearInter(),h=$('hint');
 if(o&&o.type==='eject'&&jetMode){jaInit(jetMode);h.textContent=tf('jet_fly2',{n:jetMode.rk,a:jetMode.aa,h:jetMode.hp});h.style.display='block';setAct('🪂');return;}
 if(o&&o.type==='jet'){h.textContent=(TOUCH?'':'E / ')+tf('jet_in2',{m:t('jm_'+o.j.mk),h:o.j.hp});h.style.display='block';setAct('✈️');return;}
 _updateHint54();};
