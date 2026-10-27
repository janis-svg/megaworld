// 51_kara_karte.js - Otra kara karte "Kaujas lauks": atklāts lauks starp bāzēm stūros. Prettanku zobu līnijas (kājnieki iziet starp zobiem, tehnika tikai pa ejām),
// ezīši, zemes vaļņi, smilšu maisu ligzdas, betona bunkuri, sagrauti ciemati, dīķi (tehnika un cilvēki neiziet, lodes lido pāri), birztalas, tanku vraki, krāteri, lauku ceļi.
// Bāzes šajā kartē nostiprinātas: betona bloku līkloči pie vārtiem, bunkuri pie stūra, ezīšu josla. Karte ir simetriska, lai abām pusēm vienādi.
// Izvēle: admins sākuma ekrānā (nejauši, pilsēta, lauks); vienam spēlējot nejauši; misijās pārmaiņus (vienā misijā viena karte, nākamajā otra).
Object.assign(T.lv,{wm_rnd:'🎲 Nejauša karte',wm_city:'🏙️ Pilsēta',wm_field:'🌾 Kaujas lauks',wm_now:'🗺️ Karte: {n}'});
Object.assign(T.en,{wm_rnd:'🎲 Random map',wm_city:'🏙️ City',wm_field:'🌾 Battlefield',wm_now:'🗺️ Map: {n}'});
let WMAP='city',WMC=LS.get('wmapc','rnd');if(!['rnd','city','field','ozo'].includes(WMC))WMC='rnd';
const fieldOn=()=>(WMAP==='field'||WMAP==='ozo')&&isWar(); // Ozolnieki (56. fails) izmanto to pašu lauka ģenerēšanu
// ---------- kartes plāns (vienreiz, no fiksētas sēklas; spoguļots ap centru) ----------
let FPL=null,FROAD=[];
function fieldPlan(){if(FPL)return FPL;const R=rng(424242),P=[],C=[],put=(p)=>{P.push(p);P.push({...p,x:-p.x,z:-p.z,a:(p.a||0)+Math.PI});};
 const TR=TRENCH.map(([x,z])=>[x,z]);
 const ok=(x,z,r)=>Math.abs(x)<EDGE-6-r&&Math.abs(z)<EDGE-6-r&&!nearAirfield(x,z,r+4)&&!TR.some(([a,b])=>Math.hypot(x-a,z-b)<r+7)&&!C.some(c=>Math.hypot(x-c[0],z-c[1])<r+c[2]+1)&&!C.some(c=>Math.hypot(-x-c[0],-z-c[1])<r+c[2]+1);
 const claim=(x,z,r)=>{C.push([x,z,r],[-x,-z,r]);};
 // lauku ceļi pa uzbrukuma maršrutiem (ar abām bāzēm kopīgi)
 const roads=[[[-156,-198],[-119,119],[156,198]],[[-198,-156],[119,-119],[198,156]],[[-156,-198],[0,0],[156,198]]];FROAD=[];
 for(const L of roads)for(let i=0;i<L.length-1;i++){const[a,b]=[L[i],L[i+1]],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/5),an=Math.atan2(b[0]-a[0],b[1]-a[1]);for(let k=0;k<n;k++){const x=a[0]+(b[0]-a[0])*k/n,z=a[1]+(b[1]-a[1])*k/n;P.push({k:'road',x,z,a:an});FROAD.push([x,z]);}}
 // dīķi (nost no maršrutiem)
 for(const[x,z,r]of[[100,40,11]]){claim(x,z,r+3);put({k:'pond',x,z,r});}
 // sagrauti ciemati
 for(const[cx,cz]of[[-80,80]]){claim(cx,cz,22);for(let i=0;i<5;i++){const a=i/5*Math.PI*2+R()*.5,d=10+R()*7,x=cx+Math.sin(a)*d,z=cz+Math.cos(a)*d,w=6+R()*3,dd=5+R()*3;
  // māja: 4 sienas ar caurumiem
  for(const[sx,sz,ww,ddd]of[[0,-dd/2,w,.5],[0,dd/2,w,.5],[-w/2,0,.5,dd],[w/2,0,.5,dd]])if(R()<.85){const parts=R()<.5?2:1;for(let q=0;q<parts;q++){const pw=parts===2?(ww>1?ww*.38:ww):ww,pd=parts===2?(ddd>1?ddd*.38:ddd):ddd,off=parts===2?(q?1:-1)*(ww>1?ww*.31:ddd*.31):0;
   put({k:'wall',x:x+sx+(ww>1?off:0),z:z+sz+(ww>1?0:off),w:pw,d:pd,h:1.8+R()*2.4});}}}}
 // centrs: bunkuri un smilšu maisu ligzdas ap krustojumu
 for(const[x,z]of[[34,-12]]){claim(x,z,4);put({k:'bunk',x,z});}
 for(let i=0;i<3;i++){const a=i*2.1+.4,x=Math.sin(a)*20,z=Math.cos(a)*20;if(ok(x,z,3)){claim(x,z,3);put({k:'nest',x,z,a});}}
 // prettanku zobu līnijas šķērsām (ar ejām tehnikai)
 const s2=Math.SQRT1_2;for(const u of[70]){for(let v=-160;v<=160;v+=2.3){if([-118,-45,25,95].some(g=>Math.abs(v-g)<8))continue;const x=(u+v)*s2,z=(u-v)*s2;if(!ok(x,z,.8))continue;put({k:'tooth',x,z});}}
 // ezīši, vaļņi, ligzdas, vraki, birztalas, krāteri
 const tries=(n,r,fn)=>{let m=0;for(let i=0;i<n*20&&m<n;i++){const x=(R()*2-1)*(EDGE-12),z=(R()*2-1)*(EDGE-12);if(!ok(x,z,r))continue;claim(x,z,r);fn(x,z);m++;}};
 tries(8,4,(x,z)=>{const n=3+Math.floor(R()*4);for(let i=0;i<n;i++)put({k:'hog',x:x+(R()-.5)*7,z:z+(R()-.5)*7,a:R()*3});});
 tries(7,8,(x,z)=>{const al=R()<.5;put({k:'berm',x,z,w:al?13:2.6,d:al?2.6:13});});
 tries(7,3,(x,z)=>put({k:'nest',x,z,a:R()*6.28}));
 tries(4,3.5,(x,z)=>put({k:'wreck',x,z,a:R()<.5?0:Math.PI/2}));
 tries(6,10,(x,z)=>{const n=10+Math.floor(R()*8);for(let i=0;i<n;i++){const a=R()*6.28,d=R()*9;put({k:'tree',x:x+Math.sin(a)*d,z:z+Math.cos(a)*d,s:.8+R()*.6});}});
 tries(5,4,(x,z)=>{claim(x,z,4);put({k:'bunk',x,z});});
 for(let i=0;i<26;i++){const x=(R()*2-1)*(EDGE-10),z=(R()*2-1)*(EDGE-10);if(!nearAirfield(x,z,2))put({k:'crater',x,z,r:1.4+R()*2});}
 FPL=new Map();for(const p of P){const key=Math.floor(p.x/CS)+','+Math.floor(p.z/CS);if(!FPL.has(key))FPL.set(key,[]);FPL.get(key).push(p);}return FPL;}
// ---------- detaļas ----------
const FB={
 road(ch,p){const m=new THREE.Mesh(new THREE.PlaneGeometry(5.5,6.2),mat(0x7a6849,1));m.rotation.set(-Math.PI/2,0,p.a);m.position.set(p.x,.012,p.z);m.receiveShadow=true;ch.group.add(m);},
 pond(ch,p){const w=new THREE.Mesh(new THREE.CircleGeometry(p.r,28),new THREE.MeshStandardMaterial({color:0x2e6d8c,roughness:.15,metalness:.4}));w.rotation.x=-Math.PI/2;w.position.set(p.x,.03,p.z);ch.group.add(w);
  const sh=new THREE.Mesh(new THREE.RingGeometry(p.r,p.r+1.6,28),mat(0x7b6a45,1));sh.rotation.x=-Math.PI/2;sh.position.set(p.x,.02,p.z);ch.group.add(sh);
  for(let i=0;i<10;i++){const a=i/10*6.283,r=vcyl(ch.group,.04,.04,1.2,0x6f8f3a,p.x+Math.sin(a)*(p.r+.4),.6,p.z+Math.cos(a)*(p.r+.4),null,4);r.rotation.z=.2;}
  const k=p.r*.72;for(const[hx,hz]of[[p.r*.95,k*.6],[k*.6,p.r*.95],[k,k]])ch.obs.push({x:p.x,z:p.z,hx,hz,y0:0,y1:3,win:true});},
 wall(ch,p){const c=p.h>3?0x8d8a80:0x9a6b52,q=vadd(ch.group,p.w,p.h,p.d,c,p.x,p.h/2,p.z,.95);q.castShadow=true;
  for(let i=0;i<2;i++)vadd(ch.group,Math.max(.4,p.w*.3),.5,Math.max(.4,p.d*.3),c,p.x+(p.w>1?(i?1:-1)*p.w*.3:0),p.h+.2,p.z+(p.d>1?(i?1:-1)*p.d*.3:0),.95);
  for(let i=0;i<3;i++)vadd(ch.group,.5,.3,.5,0x6d6a62,p.x+(Math.random()-.5)*p.w*1.4,.15,p.z+(Math.random()-.5)*p.d*1.4+.8,1);ch.obs.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2});},
 bunk(ch,p){vadd(ch.group,5,2.3,5,0x8d8d86,p.x,1.15,p.z,.9);vadd(ch.group,5.6,.35,5.6,0x7a7a73,p.x,2.45,p.z,.9);for(const[sx,sz,w,d]of[[0,-2.52,2.6,.1],[0,2.52,2.6,.1],[-2.52,0,.1,2.6],[2.52,0,.1,2.6]])vadd(ch.group,w,.3,d,0x111111,p.x+sx,1.6,p.z+sz,.5);
  for(let i=0;i<6;i++)vadd(ch.group,1.1,.5,.6,0x9e8a5a,p.x-2.5+i,.25,p.z-3.2,1);ch.obs.push({x:p.x,z:p.z,hx:2.5,hz:2.5});},
 nest(ch,p){const c=Math.cos(p.a||0)>0;for(const[ox,oz,w,d]of(c?[[0,-1.8,4.4,.9],[-2.2,0,.9,3.6],[2.2,0,.9,3.6]]:[[-1.8,0,.9,4.4],[0,-2.2,3.6,.9],[0,2.2,3.6,.9]])){
  vadd(ch.group,w,1.05,d,0x9e8a5a,p.x+ox,.52,p.z+oz,1);vadd(ch.group,w*.9,.12,d*.9,0x8a774c,p.x+ox,1.1,p.z+oz,1);ch.obs.push({x:p.x+ox,z:p.z+oz,hx:w/2,hz:d/2,y0:0,y1:1.1});}},
 tooth(ch,p){const m=new THREE.Mesh(new THREE.CylinderGeometry(.08,.62,1.15,4),mat(0xa3a29b,.9));m.position.set(p.x,.57,p.z);m.rotation.y=Math.PI/4;m.castShadow=true;ch.group.add(m);ch.obs.push({x:p.x,z:p.z,hx:.48,hz:.48,y0:0,y1:1.1});},
 hog(ch,p){for(let i=0;i<3;i++){const b=vadd(ch.group,1.7,.14,.14,0x3d3d3d,p.x,.62,p.z,.5);b.rotation.set(i===0?0:.95,(p.a||0)+i*1.05,i===2?.95:.6);}ch.obs.push({x:p.x,z:p.z,hx:.6,hz:.6,y0:0,y1:1.2});},
 berm(ch,p){const b=vadd(ch.group,p.w,1.5,p.d,0x6b5a3a,p.x,.75,p.z,1);b.castShadow=true;vadd(ch.group,p.w*.92,.1,p.d*.6,0x55713a,p.x,1.52,p.z,1);
  vadd(ch.group,p.w>p.d?p.w:p.d*.4+2,.6,p.w>p.d?p.d+1.4:p.d,0x6b5a3a,p.x,.3,p.z,1);ch.obs.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2,y0:0,y1:1.5});},
 wreck(ch,p){const g=tankMesh();g.position.set(p.x,0,p.z);g.rotation.set(0,p.a,.06);g.userData.tur.rotation.y=.7;g.traverse(o=>{if(o.isMesh&&o.material&&o.material.color)o.material.color.lerp(new THREE.Color(0x1d1b18),.75);});ch.group.add(g);
  const a=Math.abs(Math.sin(p.a))>.5;ch.obs.push({x:p.x,z:p.z,hx:a?2.4:1.8,hz:a?1.8:2.4,y0:0,y1:1.9});},
 crater(ch,p){const c=new THREE.Mesh(new THREE.CircleGeometry(p.r,14),mat(0x3b3226,1));c.rotation.x=-Math.PI/2;c.position.set(p.x,.018,p.z);ch.group.add(c);
  const r=new THREE.Mesh(new THREE.RingGeometry(p.r,p.r+.6,14),mat(0x5a4a34,1));r.rotation.x=-Math.PI/2;r.position.set(p.x,.022,p.z);ch.group.add(r);}};
function fieldChunk(ch,ox,oz,key){const R=rng(Math.imul(ox,7919)^Math.imul(oz,104729)^99);
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(CS,CS),mat([0x5b7a3c,0x60803f,0x56743a,0x637a3e][Math.floor(R()*4)],1));gr.rotation.x=-Math.PI/2;gr.position.set(ox+20,.005,oz+20);gr.receiveShadow=true;ch.group.add(gr);
 for(let i=0;i<3;i++){const p=new THREE.Mesh(new THREE.CircleGeometry(3+R()*5,10),mat(R()<.5?0x6f8a42:0x7a6a45,1));p.rotation.x=-Math.PI/2;p.position.set(ox+R()*CS,.008,oz+R()*CS);ch.group.add(p);}
 const L=fieldPlan().get(key)||[],trees=[];
 for(const p of L){if(p.k==='tree'){const ob={x:p.x,z:p.z,hx:.3*p.s,hz:.3*p.s};trees.push([p.x,p.z,p.s,ob]);ch.obs.push(ob);}else FB[p.k](ch,p);}
 if(trees.length)makeTreesIM(ch,trees,0x5a3f28,0x2d5a2a,6,7);
 const free=(x,z)=>!ch.obs.some(o=>Math.abs(x-o.x)<o.hx+.8&&Math.abs(z-o.z)<o.hz+.8)&&!nearAirfield(x,z,2);
 for(let i=0;i<6;i++){const x=ox+R()*CS,z=oz+R()*CS;if(!free(x,z))continue;const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.4+R()*.5,0),mat(0x3f6a2e,1));b.position.set(x,.25,z);b.scale.y=.6;ch.group.add(b);}
 if(R()<.5){const x=ox+R()*CS,z=oz+R()*CS;if(free(x,z))makeItem(ch,R()<.5?pickWeapon(R):pickGround(R),x,z,key+'f');}}
const _genChunk51=genChunk;genChunk=function(cx,cz){const ox=cx*CS,oz=cz*CS;if(!fieldOn()||Math.max(Math.abs(ox+20),Math.abs(oz+20))>EDGE)return _genChunk51(cx,cz);
 const key=cx+','+cz,ch={group:new THREE.Group(),obs:[],items:[],inter:[],cn:0,key,blds:[],trees:[]};fieldChunk(ch,ox,oz,key);
 for(const o of ch.obs)addOb(o);mergeChunk(ch);scene.add(ch.group);chunks.set(key,ch);try{chunkSurfaces(ch);}catch(e){}};
// laupījums un piegādes uz lauka ceļiem
const _roadPoint51=roadPoint;roadPoint=function(x,z,r){if(!fieldOn())return _roadPoint51(x,z,r);fieldPlan();for(let k=0;k<20;k++){const p=FROAD[Math.floor(Math.random()*FROAD.length)];if(Math.hypot(p[0]-x,p[1]-z)<r&&!nearAirfield(p[0],p[1],0))return[p[0]+(Math.random()-.5)*3,p[1]+(Math.random()-.5)*3];}
 return[x+(Math.random()-.5)*20,z+(Math.random()-.5)*20];};
// ---------- bāzes nostiprinājumi šajā kartē ----------
function fieldBaseMods(){const g=new THREE.Group(),n0=WOB.length,ob=(x,z,hx,hz,y1)=>WOB.push(y1?{x,z,hx,hz,y0:0,y1}:{x,z,hx,hz});
 for(const B of WB){const R=BR,d=B.d;
  for(const side of[0,1]){// vārti uz kartes centra pusi: z puse (side 0) un x puse (side 1)
   const at=(u,w)=>side?[B.x+d*w,B.z+u]:[B.x+u,B.z+d*w];
   // betona bloku līkloči: tehnika lēnām apbrauc, kājnieki aizsegā
   for(const[u,w]of[[-4,R+6],[4,R+11]]){const[x,z]=at(u,w),hx=side?.5:3.5,hz=side?3.5:.5;vadd(g,hx*2,1.1,hz*2,0xb0aea6,x,.55,z,.9);vadd(g,hx*2-.2,.12,hz*2-.2,0xd4c94a,x,1.0,z,.6);ob(x,z,hx,hz,1.1);}
   // ezīšu josla ar eju vidū
   for(const u of[-24,-18,-12,12,18,24]){const[x,z]=at(u,R+15);for(let i=0;i<3;i++){const b=vadd(g,1.7,.14,.14,0x3d3d3d,x,.62,z,.5);b.rotation.set(i===0?0:.95,i*1.05,i===2?.95:.6);}ob(x,z,.6,.6,1.2);}
   // smilšu maisu ligzda iekšpusē pie vārtiem
   const[nx,nz]=at(-11,R-6);vadd(g,side?1:4,1.1,side?4:1,0x9e8a5a,nx,.55,nz,1);ob(nx,nz,side?.5:2,side?2:.5,1.1);}
  // bunkurs ārpusē pie stūra uz centra pusi
  const bx=B.x+d*(R+8),bz=B.z+d*(R+8);vadd(g,5,2.3,5,0x8d8d86,bx,1.15,bz,.9);vadd(g,5.6,.35,5.6,0x7a7a73,bx,2.45,bz,.9);for(const[sx,sz,w,dd]of[[0,-2.52,2.6,.1],[0,2.52,2.6,.1],[-2.52,0,.1,2.6],[2.52,0,.1,2.6]])vadd(g,w,.3,dd,0x111111,bx+sx,1.6,bz+sz,.5);ob(bx,bz,2.5,2.5);}
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);WG.push(g);for(let i=n0;i<WOB.length;i++)addOb(WOB[i]);}
const _buildBases51=buildBases;buildBases=function(){_buildBases51();if(WMAP==='field')fieldBaseMods();};
// ---------- izvēle ----------
function wmapPick(){if(!isWar())return'city';if(NET.role==='guest')return WMAP;const solo=!NET.guests.size&&!(typeof misLobby!=='undefined'&&misLobby);
 if(isAdmin()&&WMC!=='rnd')return WMC;
 const WL=['city','field','ozo'];if(solo&&typeof MIS!=='undefined'&&MIS){const last=LS.get('wmapLast','ozo'),m=WL[(WL.indexOf(last)+1)%WL.length];LS.set('wmapLast',m);return m;}
 return WL[Math.floor(Math.random()*WL.length)];}
const _start51=start;start=function(){if(NET.role!=='guest')WMAP=wmapPick();_start51();if(isWar()&&NET.role!=='guest'){const m=WMAP;setTimeout(()=>{if(active&&isWar()&&WMAP===m)say(tf('wm_now',{n:t('wm_'+m)}),3);},8000);}};
{const row=document.createElement('div');row.id='maprow';row.innerHTML=['rnd','city','field','ozo'].map(k=>'<button class="corner" data-k="'+k+'"></button>').join('');$('diffrow').before(row);
 row.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();WMC=b.dataset.k;LS.set('wmapc',WMC);paintMap();});}
function paintMap(){const row=$('maprow');row.style.display=MODE==='war'&&isAdmin()&&!/[?&]join=/.test(location.search)?'flex':'none';row.querySelectorAll('button').forEach(b=>{b.textContent=t('wm_'+b.dataset.k);b.classList.toggle('on',b.dataset.k===WMC);});}
const _paintMode51=paintMode;paintMode=function(){_paintMode51();paintMap();};paintMap();
const _gateApply51=gateApply;gateApply=function(){_gateApply51();paintMap();};
const _applyLang51=applyLang;applyLang=function(){_applyLang51();paintMap();};
// ---------- kopīgā spēle: karte draugam pirms pasaules ielādes ----------
const _netWelcome51=netWelcome;netWelcome=function(G){netTo(G,{t:'wmap',m:WMAP});_netWelcome51(G);};
const _netGuestMsg51=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='wmap'){WMAP=['field','ozo'].includes(d.m)?d.m:'city';return;}_netGuestMsg51(d);};
// ---------- minikarte ----------
const _warMapBg51=warMapBg;warMapBg=function(g,X,Y,sc,W){if(WMAP!=='field')return _warMapBg51(g,X,Y,sc,W);g.fillStyle='#2b3a26';g.fillRect(0,0,W,W);g.fillStyle='#4d6633';g.fillRect(X(-EDGE),Y(-EDGE),2*EDGE*sc,2*EDGE*sc);
 const L=fieldPlan();g.lineWidth=Math.max(1,4*sc);for(const A of L.values())for(const p of A){const x=X(p.x),y=Y(p.z);
  if(p.k==='road'){g.fillStyle='#7a6849';g.fillRect(x-3*sc,y-3*sc,6*sc,6*sc);}else if(p.k==='pond'){g.fillStyle='#2e6d8c';g.beginPath();g.arc(x,y,p.r*sc,0,6.283);g.fill();}
  else if(p.k==='tooth'||p.k==='hog'){g.fillStyle='#b8b6ae';g.fillRect(x-sc,y-sc,2*sc,2*sc);}else if(p.k==='wall'||p.k==='bunk'||p.k==='wreck'){g.fillStyle='#9b9284';g.fillRect(x-2*sc,y-2*sc,4*sc,4*sc);}
  else if(p.k==='tree'){g.fillStyle='#24452a';g.fillRect(x-1.5*sc,y-1.5*sc,3*sc,3*sc);}else if(p.k==='berm'){g.fillStyle='#6b5a3a';g.fillRect(X(p.x-p.w/2),Y(p.z-p.d/2),p.w*sc,p.d*sc);}}};
