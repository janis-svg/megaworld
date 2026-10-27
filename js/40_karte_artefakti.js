// 40_karte_artefakti.js - Nakts redzamības brilles kā spīdoši artefakti kartē, botiem par 20% sliktāka precizitāte, tīra kara minikarte (savējie zaļi, pretinieki sarkani, tu balts)
// ---------- 1. nakts redzamības brilles mētājas apkārt kā artefakti ----------
const NVART=new Set();let nvArtT=5;const NVART_N=6;
function nvArtMesh(){const g=new THREE.Group(),it=itemMesh('nv');it.scale.setScalar(1.8);it.position.y=.35;g.add(it);
 const r=new THREE.Mesh(new THREE.TorusGeometry(.55,.05,6,24),new THREE.MeshBasicMaterial({color:0x76ff03}));r.rotation.x=Math.PI/2;r.position.y=-.3;g.add(r);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:nvTex(),color:0x76ff03,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.7}));s.material.userData.keep=true;s.scale.set(2.2,2.2,1);s.position.y=.35;g.add(s);
 g.userData.nva=it;NVART.add(g);return g;}
const _prodMesh27=prodMesh;prodMesh=function(k){if(k==='w:nv')return nvArtMesh();return _prodMesh27(k);};
const _dropMeshFor27=dropMeshFor;dropMeshFor=function(k){if(k==='w:nv')return nvArtMesh();return _dropMeshFor27(k);};
// boti artefaktus neņem, tie paliek cilvēkiem
const _takeDrop27=takeDrop;takeDrop=function(d,who){if(d&&d.kind==='w:nv'&&who&&!who.pos)return '';return _takeDrop27(d,who);};
function nvArtSpot(){for(let k=0;k<30;k++){const x=(Math.random()*2-1)*(EDGE-25),z=(Math.random()*2-1)*(EDGE-25);
  if(inWall(x,z)||(isWar()&&WB.some(B=>Math.abs(x-B.x)<BR+4&&Math.abs(z-B.z)<BR+4)))continue;if(Math.hypot(x-player.position.x,z-player.position.z)<15)continue;return[x,z];}return null;}
function nvArtTick(dt){for(const g of NVART){if(!g.parent){NVART.delete(g);continue;}const it=g.userData.nva;it.rotation.y+=dt*1.6;it.position.y=.35+Math.sin(clock.elapsedTime*2.4+g.id)*.12;}
 if(NET.role==='guest'||(nvArtT-=dt)>0)return;nvArtT=20;if(drops.filter(d=>d.kind==='w:nv').length>=NVART_N)return;const p=nvArtSpot();if(p)dropItem(p[0],p[1],'w:nv');}
// ---------- 2. botiem šaušanas precizitāte par 20% mazāka (izkliede x1,25) ----------
const _botFire27=botFire;botFire=function(b,tp,w,human){const W=WP[w];if(!W||W.rocket)return _botFire27(b,tp,w,human);const sp=W.sp;W.sp=sp*1.25+(human?.025:.009);try{_botFire27(b,tp,w,human);}finally{W.sp=sp;}};
// ---------- 3. tīra kara minikarte ----------
const _drawMap27=drawMap;drawMap=function(){if(!(typeof isWar==='function'&&isWar()))return _drawMap27();warMap();};
function warMapBg(g,X,Y,sc,W){g.fillStyle='#243326';g.fillRect(0,0,W,W);g.fillStyle='#3a4044';g.fillRect(X(-CITY),Y(-CITY),2*CITY*sc,2*CITY*sc);
 g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=Math.max(1,5*sc);g.beginPath();for(let k=-4;k<4;k++){const r=k*40+20;g.moveTo(X(r),Y(-CITY));g.lineTo(X(r),Y(CITY));g.moveTo(X(-CITY),Y(r));g.lineTo(X(CITY),Y(r));}g.stroke();}
function warMap(){const S=TOUCH?116:170;if(mm.width!==S*2){mm.width=mm.height=S*2;mm.style.width=mm.style.height=S+'px';}
 const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R,X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc,guest=NET.role==='guest';
 // krāsas kā pasaulē: sarkanā armija sarkana, zaļā zaļa
 const OWN=MYSIDE===0?'#ff3b3b':'#43e06b',FOE=MYSIDE===0?'#43e06b':'#ff3b3b';
 // fons: mežs un pilsēta vienkāršos toņos
 warMapBg(g,X,Y,sc,W);
 // bāzes un karogi
 WB.forEach((B,i)=>{const mine=i===MYSIDE,c=mine?OWN:FOE;g.strokeStyle=c;g.lineWidth=3;g.globalAlpha=.9;g.strokeRect(X(B.x-BR),Y(B.z-BR),2*BR*sc,2*BR*sc);g.globalAlpha=.12;g.fillStyle=c;g.fillRect(X(B.x-BR),Y(B.z-BR),2*BR*sc,2*BR*sc);g.globalAlpha=1;});
 const blink=Math.floor(clock.elapsedTime*3)%2;
 FL.forEach((F,i)=>{const moved=F.carrier||(F.cid!==undefined&&F.cid!==-2)||F.cd!=null;if(moved&&blink)return;const x=X(F.x),y=Y(F.z),c=i===MYSIDE?OWN:FOE,s=W*.03;
  g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.moveTo(x,y+s);g.lineTo(x,y-s*1.4);g.stroke();g.fillStyle=c;g.beginPath();g.moveTo(x,y-s*1.4);g.lineTo(x+s*1.3,y-s*.9);g.lineTo(x,y-s*.4);g.closePath();g.fill();g.strokeStyle='#000';g.lineWidth=1;g.stroke();});
 const dot=(x,z,c,r,ring)=>{g.fillStyle=c;g.beginPath();g.arc(X(x),Y(z),r,0,6.283);g.fill();if(ring){g.strokeStyle=ring;g.lineWidth=1.5;g.stroke();}};
 const sq=(x,z,c,s)=>{g.fillStyle=c;g.fillRect(X(x)-s/2,Y(z)-s/2,s,s);g.strokeStyle='#000';g.lineWidth=1;g.strokeRect(X(x)-s/2,Y(z)-s/2,s,s);};
 const tri=(x,z,c,s)=>{g.fillStyle=c;g.beginPath();g.moveTo(X(x),Y(z)-s);g.lineTo(X(x)+s*.85,Y(z)+s*.6);g.lineTo(X(x)-s*.85,Y(z)+s*.6);g.closePath();g.fill();g.strokeStyle='#000';g.lineWidth=1;g.stroke();};
 // savējie: zaļi punkti; savējā tehnika: zaļi kvadrāti, gaisā trīsstūri
 if(guest){for(const o of netBot.values())if(o.rel===1)dot(o.g.position.x,o.g.position.z,OWN,2.6);}
 else{for(const b of PT.members)if(!b.inside)dot(b.g.position.x,b.g.position.z,OWN,2.6);
  for(const t of tanks)if(!t.dead&&((t.driver&&t.driver.team===PT)||t===inTank))sq(t.g.position.x,t.g.position.z,OWN,7);
  for(const H of HELIS)if(H.st==='fly'&&heliTeam(H)===PT)tri(H.x,H.z,OWN,6);for(const J of JETS)if((J.st==='fly')&&pilotTeam(J)===PT)tri(J.x,J.z,OWN,6);}
 // pretinieki: tikai tie, kurus kāds no savējiem redzējis (izbalē 3 minūtēs)
 const L=guest?(typeof myMarks!=='undefined'?myMarks:[]).map(([x,z,a,k])=>({x,z,a,k})):[...SPOT.values()].filter(m=>m.T===PT).map(m=>({x:m.x,z:m.z,a:gtime-m.t,k:m.kind}));
 for(const m of L){g.globalAlpha=Math.max(.2,1-m.a/180);if(m.k==='s'||m.k==='r')dot(m.x,m.z,FOE,m.k==='r'?4:3);else if(m.k==='t')sq(m.x,m.z,FOE,7);else tri(m.x,m.z,FOE,6);}g.globalAlpha=1;
 // gaisa piegādes un artefakti mazi
 g.textAlign='center';g.textBaseline='middle';g.font=Math.round(W*.05)+'px serif';
 const air=guest?[...netDr.values()].filter(o=>o.g.children.length>2&&!o.g.userData.nva).map(o=>o.g.position):drops.filter(d=>d.chute).map(d=>d.m.position);for(const p of air)g.fillText('🪂',X(p.x),Y(p.z));
 // draugi (cilvēki): lieli, ar baltu malu un vārda burtu
 const fr=guest?[...netPl.values()].filter(o=>!o.dead).map(o=>({x:o.g.position.x,z:o.g.position.z,n:''})):[...NET.guests.values()].filter(G=>G.ready&&!G.dead&&GT(G)===PT).map(G=>({x:G.pos.x,z:G.pos.z,n:G.name}));
 for(const f of fr){dot(f.x,f.z,'#29b6f6',5.5,'#fff');if(f.n){g.fillStyle='#fff';g.font='bold '+Math.round(W*.04)+'px sans-serif';g.fillText(f.n[0].toUpperCase(),X(f.x),Y(f.z)-W*.045);}}
 // tu: liela balta bulta ar pulsējošu apli
 const px=X(player.position.x),pz=Y(player.position.z),pr=W*(.05+.02*Math.sin(clock.elapsedTime*5));g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=2;g.beginPath();g.arc(px,pz,pr,0,6.283);g.stroke();
 g.save();g.translate(px,pz);g.rotate(-yaw);g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=2.5;g.beginPath();g.moveTo(0,-W*.05);g.lineTo(W*.034,W*.032);g.lineTo(0,W*.015);g.lineTo(-W*.034,W*.032);g.closePath();g.fill();g.stroke();g.restore();}
const _updateFx27=updateFx;updateFx=function(dt){_updateFx27(dt);if(active||NET.guests.size)nvArtTick(dt);};
