// 37_molotovs_karogs.js - Smalkāka tehnika, lielie koki, molotova kokteilis, Kalašņikovs, karoga atgūšana visai armijai, atdzimšana pie drauga
Object.assign(T.lv,{wmolo:'Molotova kokteilis',wak:'Kalašņikovs',molo_one:'🍾 Līdzi var nest tikai vienu kokteili',molo_hit:'🔥 Tehnika deg!',molo_house:'🔥 Māja deg!',molo_tower:'🔥 Tornis deg!',
 r_flagl:'📻 Mūsu karogs nozagts! Visi atpakaļ, atgūstam karogu!',r_flaga:'📻 Zaglis ar mūsu karogu lido! Javelin šāvēji, notriecam viņu! Pārējie uz pretinieku bāzi atgūt karogu!',r_flagb:'📻 {n} ved karogu pa gaisu! Visi uz bāzi, sargājam nolaišanos!',r_flagw:'📻 {n} nes pretinieku karogu! Visi sargājam viņu līdz bāzei!',r_flagok:'📻 Karogs atkal mājās. Atgriežamies pie uzdevumiem.',r_flagg:'📻 Pretinieku karogs guļ zemē! Paņemiet to!',
 rs_friend:'🤝 Tu atgriezies pie {n}',ak_base:'📦 Bāzē atvesti Kalašņikovi',shop_ak:'AK Kalašņikovs (spēcīgāks, bet neprecīzāks par M16)',shop_a_ak:'AK Kalašņikova lodes (+20)',shop_molo:'🍾 Molotova kokteilis (deg 30 s)'});
Object.assign(T.en,{wmolo:'Molotov cocktail',wak:'Kalashnikov',molo_one:'🍾 You can carry only one cocktail',molo_hit:'🔥 The vehicle is burning!',molo_house:'🔥 The house is burning!',molo_tower:'🔥 The tower is burning!',
 r_flagl:'📻 Our flag is stolen! Everyone back, get the flag!',r_flaga:'📻 The thief is flying away with our flag! Javelin shooters, shoot them down! Everyone else to the enemy base to get the flag back!',r_flagb:'📻 {n} is flying the flag home! Everyone to the base, guard the landing!',r_flagw:'📻 {n} carries the enemy flag! Everyone protect them to the base!',r_flagok:'📻 The flag is back home. Back to our tasks.',r_flagg:'📻 The enemy flag is on the ground! Grab it!',
 rs_friend:'🤝 You are back with {n}',ak_base:'📦 Kalashnikovs delivered to the base',shop_ak:'AK Kalashnikov (stronger but less accurate than the M16)',shop_a_ak:'AK Kalashnikov ammo (+20)',shop_molo:'🍾 Molotov cocktail (burns 30 s)'});
// ---------- 1. tehnikai vairāk detaļu ----------
function vadd(par,w,h,d,c,x,y,z,r){const q=cube(w,h,d,c,r===undefined?.7:r);q.position.set(x,y,z);par.add(q);return q;}
function vcyl(par,r1,r2,h,c,x,y,z,ax,seg){const q=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg||10),mat(c,.6));q.position.set(x,y,z);if(ax==='x')q.rotation.z=Math.PI/2;else if(ax==='z')q.rotation.x=Math.PI/2;q.castShadow=true;par.add(q);return q;}
function camo(par,w,y,d,c){for(let i=0;i<5;i++){const p=cube(.5+Math.random()*.7,.03,.4+Math.random()*.6,c,.9);p.position.set((Math.random()-.5)*(w-.6),y,(Math.random()-.5)*(d-.6));p.rotation.y=Math.random()*3;par.add(p);}}
const _tankMesh24=tankMesh;tankMesh=function(){const g=_tankMesh24(),tur=g.userData.tur,ol=0x4b5320,dk=0x2b2f1a,bk=0x161616;
 for(const x of [-1.45,1.45]){vadd(g,.82,.1,4.9,ol,x,.9,0);for(let i=0;i<6;i++)vcyl(g,.3,.3,.74,0x2a2a2a,x,.38,-1.9+i*.76,'x',8);vcyl(g,.22,.22,.74,bk,x,.62,-2.35,'x',8);vcyl(g,.22,.22,.74,bk,x,.62,2.35,'x',8);}
 vadd(g,3.2,.1,.5,dk,0,1.45,-2.1);vadd(g,1.2,.3,.3,bk,-.8,1.2,2.45);vadd(g,1.2,.3,.3,bk,.8,1.2,2.45);
 for(const x of [-1.1,1.1])vadd(g,.24,.16,.1,0xfff3c4,x,1.2,-2.33,.3).material.emissive=new THREE.Color(0x665c30);
 for(const x of [-.9,.9])vcyl(g,.25,.25,.8,0x3e4a2a,x,1.55,2.1,'x',10);
 camo(g,3.2,1.41,4.6,0x3a4119);camo(tur,1.9,.81,2.2,0x3a4119);
 vadd(tur,2,.55,.9,ol,0,.32,1.4);vadd(tur,1.7,.08,.7,dk,0,.62,1.45);vadd(tur,.75,.62,.5,dk,0,.4,-1.15);
 vcyl(tur,.24,.24,.55,bk,0,.45,-3.75,'z',10);vcyl(tur,.17,.17,.9,0x3a3a2a,0,.45,-2.2,'z',10);
 vcyl(tur,.27,.27,.25,dk,-.4,.95,.35,null,10);const mg=vadd(tur,.06,.06,.7,bk,-.4,1.15,0,.4);mg.position.z=-.05;
 vcyl(tur,.02,.02,2.2,bk,.75,1.9,.9,null,4);
 for(const s of [-1,1])for(let i=0;i<3;i++)vcyl(tur,.07,.07,.22,0x30361f,s*1.02,.55,-.5+i*.2,'x',6);
 return g;};
const _apcMesh24=apcMesh;apcMesh=function(){const g=_apcMesh24(),tur=g.userData.tur,c=0x5b6b3a,dk=0x37422a,bk=0x161616;
 for(const x of [-1.35,1.35])for(const z of [-1.9,-.65,.65,1.9])vcyl(g,.2,.2,.38,0x777777,x*1.01,.5,z,'x',8);
 for(const x of [-1.32,1.32]){vadd(g,.06,.1,4.6,dk,x,1.6,0);for(const z of [-1.2,0,1.2])vadd(g,.04,.16,.36,0x1d2a33,x*1.005,1.35,z,.2);}
 vadd(g,2.2,.08,1.2,dk,0,1.72,-1.8);for(const x of [-.6,.6])vadd(g,.5,.08,.6,dk,x,1.74,1.6);
 for(const x of [-.9,.9])vadd(g,.24,.16,.1,0xfff3c4,x,1.3,-3.58,.3).material.emissive=new THREE.Color(0x665c30);
 vcyl(g,.5,.5,.3,bk,0,1.4,2.75,'z',12);vadd(g,.3,.4,.3,bk,1,1.75,2.45);vcyl(g,.02,.02,1.8,bk,-1,2.5,2,null,4);
 vadd(g,.9,.6,.08,dk,0,1.3,2.62);camo(g,2.6,1.71,5.2,0x46542c);
 vadd(tur,.4,.35,.3,dk,0,.4,-.8);for(const s of [-1,1])for(let i=0;i<2;i++)vcyl(tur,.06,.06,.2,0x30361f,s*.6,.5,-.2+i*.18,'x',6);vadd(tur,.5,.2,.3,0x1d2a33,.25,.55,.2,.2);
 return g;};
const _heliMesh24=heliMesh;heliMesh=function(k){const g=_heliMesh24(k),M=HM[k]||HM.pred,c=M.c,shark=k==='shark',bk=0x1b1b1b;
 const dk=new THREE.Color(c).multiplyScalar(.7).getHex();
 for(const x of [-.75,.75]){vcyl(g,.32,.32,1.8,dk,x,2.45,.5,'z',10);vcyl(g,.22,.26,.3,bk,x,2.45,1.5,'z',10);}
 vcyl(g,.28,.34,.4,bk,0,2.95,0,null,10);vcyl(g,.25,.25,.3,0x263238,0,.85,-3.2,null,10);vadd(g,.34,.2,.3,0x111111,0,.68,-3.2,.2);
 vadd(g,1.32,.08,4,dk,0,2.28,-.4);vadd(g,1.32,.25,.06,0xffffff,0,1.7,2.3,.5);
 for(const [x,col] of [[-1.92,0xff1744],[1.92,0x00e676]]){const l=vadd(g,.12,.12,.12,col,x,1.4,-.2,.3);l.material.emissive=new THREE.Color(col).multiplyScalar(.8);}
 const tl=vadd(g,.1,.1,.1,0xffffff,0,3.4,7.1,.3);tl.material.emissive=new THREE.Color(0xffffff);
 for(const x of [-1.6,1.6])for(const dz of [-.08,.08])for(const dy of [-.08,.08])vcyl(g,.05,.03,.12,0xb0bec5,x+dy,1.2+dz,-.85,'z',6);
 for(const x of [-.53,.53])vadd(g,.04,.8,.05,0x263238,x,2.15,shark?-1.5:-.3,.3);
 if(!shark){vadd(g,.6,.4,.6,dk,0,2.75,-.6);vcyl(g,.06,.06,.8,bk,0,.55,-3.95,'z',6);}else{vadd(g,.9,.3,.9,dk,0,3.2,0);}
 return g;};
// ---------- 2. lielie koki mežā: augsts vainags, zem tā var iet un braukt ----------
let BTG=null;
function bigTreeGeo(){if(!BTG)BTG={tr:new THREE.CylinderGeometry(.32,.55,1,8),co:new THREE.IcosahedronGeometry(1,1),tm:mat(0x4e3826,.95),cm:[mat(0x1d4a24,.9),mat(0x255c2c,.9),mat(0x183d1f,.9)]};return BTG;}
const _genWild24=genWild;genWild=function(ch,R,ox,oz,deep,free,key){_genWild24(ch,R,ox,oz,deep,free,key);
 const R2=rng((Math.imul(ox|0,2654435761)^Math.imul(oz|0,40503)^0x5bd1e995)|0),n=(deep?5:3)+Math.floor(R2()*3),pts=[];
 for(let i=0;i<n*3&&pts.length<n;i++){const x=ox+3+R2()*(CS-6),z=oz+3+R2()*(CS-6);const r=3.4+R2()*1.8,h=8.5+R2()*3.5;
  if(nearAirfield(x,z,6)||(typeof nearTrader==='function'&&nearTrader(x,z))||pts.some(p=>Math.hypot(p.x-x,p.z-z)<p.r+r))continue;
  if(ch.obs.some(o=>o.hx>1.2&&Math.abs(x-o.x)<o.hx+1&&Math.abs(z-o.z)<o.hz+1))continue;pts.push({x,z,r,h,c:Math.floor(R2()*3)});}
 if(!pts.length)return;const G=bigTreeGeo(),tr=new THREE.InstancedMesh(G.tr,G.tm,pts.length),cos=G.cm.map(m=>new THREE.InstancedMesh(G.co,m,pts.length*3)),cnt=[0,0,0];
 const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3();
 pts.forEach((p,i)=>{S.set(1,p.h,1);P.set(p.x,p.h/2,p.z);M.compose(P,Q,S);tr.setMatrixAt(i,M);
  for(let j=0;j<3;j++){const a=j*2.1+p.x,rr=p.r*(j?.72:1),k=(p.c+j)%3;S.set(rr,rr*.62,rr);P.set(p.x+(j?Math.cos(a)*p.r*.45:0),p.h+(j?.6:0),p.z+(j?Math.sin(a)*p.r*.45:0));M.compose(P,Q,S);cos[k].setMatrixAt(cnt[k]++,M);}});
 cos.forEach((m,k)=>{m.count=cnt[k];m.castShadow=true;m.receiveShadow=true;ch.group.add(m);});tr.castShadow=true;ch.group.add(tr);ch.bigT=pts;};
// vai vieta ir zem liela koka vainaga (no augšas to grūti redzēt)
function underCanopy(x,z){const cx=Math.floor(x/CS),cz=Math.floor(z/CS);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const ch=chunks.get((cx+i)+','+(cz+j));if(!ch||!ch.bigT)continue;for(const p of ch.bigT)if(Math.hypot(p.x-x,p.z-z)<p.r*.85)return true;}return false;}
// ---------- 3. Kalašņikovs: nedaudz spēcīgāks, bet neprecīzāks par M16 ----------
WP.ak={ic:'AK',dmg:42,rate:.12,max:60,give:20,add:20,pel:1,sp:.055,life:75/45,brate:.45,rng:60,val:35,av:1.2,auto:true};WL.push('ak');GUNS.push('ak');RANGE.ak=75;
SHOPS.weapons.push(['ak',45],['a_ak',12],['molo',15]);WDROP.push('ak','a_ak','a_ak','molo');WKILL.push('ak','a_ak','molo');
// ---------- 4. molotova kokteilis ----------
WP.molo={ic:'🍾',dmg:0,rate:1,max:1,give:1,add:1,pel:1,sp:0,life:1,brate:2,rng:16,val:20,av:2};WL.push('molo');
const _giveLoot24=giveLoot;giveLoot=function(k,I,Tm){if(I&&I.ammo){if(I.ammo.ak===undefined){I.ammo.ak=0;I.has.ak=false;}if(I.ammo.molo===undefined){I.ammo.molo=0;I.has.molo=false;}}
 if(k==='molo'){if(I.ammo.molo>=1)return t('molo_one');I.has.molo=true;I.ammo.molo=1;return WP.molo.ic+' '+t('wmolo');}return _giveLoot24(k,I,Tm);};
const _pickGround24=pickGround;pickGround=function(R){if(R()<.05)return 'molo';return _pickGround24(R);};
const _itemMesh24=itemMesh;itemMesh=function(type){if(type==='molo')return moloMesh();if(type==='ak'){const m=new THREE.Group();vadd(m,.9,.12,.08,0x1d1d1d,0,0,0);vadd(m,.3,.14,.09,0x6d4c41,.5,-.02,0);vadd(m,.1,.28,.07,0x222222,-.1,-.16,0).rotation.z=.3;return m;}
 if(type==='a_ak'){const m=new THREE.Group();vadd(m,.12,.3,.1,0x333333,0,0,0).rotation.z=.3;return m;}return _itemMesh24(type);};
function moloMesh(){const m=new THREE.Group();vcyl(m,.09,.11,.34,0x2e7d32,0,0,0,null,8).material.transparent=true;vcyl(m,.04,.05,.14,0x2e7d32,0,.22,0,null,6);const r=vadd(m,.07,.12,.07,0xffcc80,0,.33,0,.9);r.material.emissive=new THREE.Color(0x663300);return m;}
// spēlētāja rokā
const _selectW24=selectW;selectW=function(w){const gs=player&&player.userData.guns;if(gs&&!gs.ak&&gs.m16){const a=cube(.09,.15,.85,0x1d1d1d,.4),s=cube(.1,.13,.3,0x6d4c41,.8);s.position.z=.4;a.add(s);const mg=cube(.07,.24,.08,0x222222,.5);mg.position.set(0,-.15,-.1);mg.rotation.x=.4;a.add(mg);
  a.position.copy(gs.m16.position);a.rotation.copy(gs.m16.rotation);a.visible=false;gs.m16.parent.add(a);gs.ak=a;const b=moloMesh();b.position.copy(gs.pistol.position);b.rotation.x=-1.3;b.visible=false;gs.pistol.parent.add(b);gs.molo=b;}_selectW24(w);};
// boti dod priekšroku Kalašņikovam, ja tas ir
const _bestW24=bestW;bestW=function(b,e,d){const w=_bestW24(b,e,d);if((w==='m16'||w==='pistol')&&b.I.has.ak&&b.I.ammo.ak>0)return 'ak';return w;};
const MOLO=[];
function moloThrow(x,y,z,a,pit,team,own){const el=Math.max(.2,Math.min(1.1,(pit||0)+.5)),v=17,m=moloMesh();m.position.set(x,y,z);scene.add(m);
 const vx=-Math.sin(a)*v*Math.cos(el),vz=-Math.cos(a)*v*Math.cos(el),vy=v*Math.sin(el);MOLO.push({m,x,y,z,vx,vy,vz,team,own,t:0,vis:NET.role==='guest'});sfxAt('door',x,z,30);
 if(NET.role==='host')netQ.push({e:'mth',x:r2(x),y:r2(y),z:r2(z),vx:r2(vx),vy:r2(vy),vz:r2(vz)});}
function moloTick(dt){for(let i=MOLO.length-1;i>=0;i--){const q=MOLO[i];q.t+=dt;let hit=null;
  for(let s=0;s<3&&!hit;s++){const h=dt/3;q.vy-=20*h;q.x+=q.vx*h;q.y+=q.vy*h;q.z+=q.vz*h;if(q.vis){if(q.y<=.1)hit={k:'g'};continue;}hit=moloHitAt(q);}
  q.m.position.set(q.x,q.y,q.z);q.m.rotation.x+=dt*9;if(q.t>4&&!hit)hit={k:'g'};
  if(hit){MOLO.splice(i,1);scene.remove(q.m);freeObj(q.m);debris(q.x,Math.max(.3,q.y),q.z,0x2e7d32,6);sfxAt('boom',q.x,q.z,40);if(!q.vis)moloIgnite(Math.max(0,q.y),q,hit);}}}
function moloHitAt(q){const{x,y,z}=q;
 for(const t of tanks)if(!t.dead&&y<3.2&&Math.abs(x-t.g.position.x)<2.2&&Math.abs(z-t.g.position.z)<2.2)return{k:'tk',v:t};
 for(const H of HELIS)if(H.st!=='gone'&&y>H.y-.2&&y<H.y+3.2&&Math.hypot(x-H.x,z-H.z)<2.6)return{k:'he',v:H};
 if(typeof TOWERS!=='undefined')for(const T2 of TOWERS)if(!T2.dead&&y<T2.h+1.5&&Math.abs(x-T2.x)<2.2&&Math.abs(z-T2.z)<2.2)return{k:'tw',v:T2};
 if(q.t>.15)for(const h of HL){const hy=h.y||0;if(Math.hypot(h.p.x-x,h.p.z-z)<.8&&y>hy&&y<hy+2)return{k:'g'};}
 for(const ch of chunks.values())for(const b of ch.blds||[])if(!b.burnt&&Math.abs(x-b.x)<b.hx+.3&&Math.abs(z-b.z)<b.hz+.3&&y<b.h)return{k:'h',v:b};
 if(y<=.05)return{k:'g'};if(y<2.5&&wallAt(x,z,y,null))return{k:'g'};return null;}
// mazā māja nodeg pilnībā un neatjaunojas; lielā ēka deg tikai pie sienas
const smallHouse=b=>b.h<=7.5&&b.hx*b.hz<=60;
function moloIgnite(y,q,hit){let x=q.x,z=q.z;const f={x,z,w:1.2,d:1.2,h:2.2,t:30,dmg:true,molo:true,team:q.team,own:q.own,fin:()=>{}};let msg=null;
 if(hit.k==='tk'){f.veh=hit.v;f.fin=()=>moloVehDmg(hit.v,q.team);msg='molo_hit';}
 else if(hit.k==='he'){f.heli=hit.v;f.fin=()=>moloVehDmg(hit.v,q.team);msg='molo_hit';}
 else if(hit.k==='tw'){const T2=hit.v;f.x=T2.x;f.z=T2.z;f.w=f.d=1.6;f.h=Math.min(8,T2.h);f.tower=T2;f.fin=()=>{if(!T2.dead)collapseTower(T2);};msg='molo_tower';}
 else if(hit.k==='h'){const b=hit.v;if(smallHouse(b)){f.x=b.x;f.z=b.z;f.w=b.hx;f.d=b.hz;f.h=Math.min(7,b.h);f.fin=()=>{if(!b.burnt)startBurn('h',b,false);};msg='molo_house';}
  else{const dx=Math.max(-b.hx,Math.min(b.hx,x-b.x)),dz=Math.max(-b.hz,Math.min(b.hz,z-b.z));f.x=b.x+dx;f.z=b.z+dz;}}
 fires.push(f);if(msg&&Math.hypot(f.x-player.position.x,f.z-player.position.z)<60)say(t(msg),2);
 if(NET.role==='host')netQ.push({e:'mfi',x:r2(f.x),z:r2(f.z),w:r2(f.w),d:r2(f.d),h:r2(f.h),tk:f.veh?tanks.indexOf(f.veh):-1,he:f.heli?f.heli.id:-1});}
// tehnika pēc 30 s degšanas zaudē pusi dzīvības
function moloVehDmg(v,team){if(v.isHeli){if(v.st==='gone')return;v.hp-=(v.m.hp||2)*.5;if(v.hp<=.01)destroyHeli(v,team);else explosionFx(v.x,v.y+1.5,v.z,2,0xff9e40);return;}
 if(v.dead)return;const mx=v.kind==='apc'?1:2,hp=v.hp===undefined?mx:v.hp;if(hp-mx*.5<=.01){v.hp=0;destroyTank(v,team);}else{v.hp=hp-mx*.5;explosionFx(v.g.position.x,1.6,v.g.position.z,2,0xff9e40);sfxAt('boom',v.g.position.x,v.g.position.z,60);}}
// uguns seko tehnikai; tornī deg arī tie, kas augšā
function moloFireTick(dt){for(const f of fires){if(!f.molo&&!f.gv)continue;
  if(f.veh){if(f.veh.dead){f.t=Math.min(f.t,1);}else{f.x=f.veh.g.position.x;f.z=f.veh.g.position.z;}}
  if(f.heli){if(f.heli.st==='gone')f.t=Math.min(f.t,1);else if(f.heli.y<2){f.x=f.heli.x;f.z=f.heli.z;}}
  if(f.gtk){const o=netTk.get(f.gtk);if(o){f.x=o.g.position.x;f.z=o.g.position.z;}}if(f.ghe!==undefined){const o=netHelis.get(f.ghe);if(o&&o.g.position.y<2){f.x=o.g.position.x;f.z=o.g.position.z;}}
  if(f.tower&&NET.role!=='guest'&&(f.tt=(f.tt||0)-dt)<=0){f.tt=.5;for(const h of [...HL])if((h.y||0)>=3&&Math.abs(h.p.x-f.x)<2.2&&Math.abs(h.p.z-f.z)<2.2)hurt(h,8,null,false);}}}
const _shoot24=shoot;shoot=function(w){if(w!=='molo')return _shoot24(w);if(!(inv.ammo.molo>0))return;attackWait=1;inv.ammo.molo=0;inv.has.molo=false;
 moloThrow(player.position.x,pY+1.6,player.position.z,yaw,pitch,PT,0);cur='hands';autoGun();updateAmmo();renderInv();renderW();};
const _guestHit24=guestHit;guestHit=function(){if(cur==='molo'&&!NET.meDead&&!buildMode&&inv.ammo.molo>0){attackWait=1;inv.ammo.molo=0;inv.has.molo=false;netSend({t:'fire',w:'molo',a:r2(yaw),p:r2(pitch)});cur='hands';autoGun();updateAmmo();renderW();return;}_guestHit24();};
const _guestFire24=guestFire;guestFire=function(G,d){if(d.w!=='molo')return _guestFire24(G,d);if(G.dead||!(G.I.ammo.molo>0))return;G.I.ammo.molo=0;G.I.has.molo=false;moloThrow(G.pos.x,G.y+1.6,G.pos.z,+d.a||0,+d.p||0,GT(G),G.id);netMe(G);};
const _netExtraEv24b=netExtraEv2;netExtraEv2=function(e){
 if(e.e==='mth'){const m=moloMesh();m.position.set(e.x,e.y,e.z);scene.add(m);MOLO.push({m,x:e.x,y:e.y,z:e.z,vx:e.vx,vy:e.vy,vz:e.vz,t:0,vis:true});return;}
 if(e.e==='mfi'){fires.push({x:e.x,z:e.z,w:e.w,d:e.d,h:e.h,t:30,gv:true,gtk:e.tk>=0?e.tk:undefined,ghe:e.he>=0?e.he:undefined,fin:()=>{}});return;}_netExtraEv24b(e);};
// boti izbēg no uguns
function inMoloFire(x,z){return fires.find(f=>(f.molo||f.gv)&&Math.abs(x-f.x)<f.w+.4&&Math.abs(z-f.z)<f.d+.4);}
// ---------- 5. karogs: ja nozagts, visi atgūst; ja mūsējais nes, visi sargā ----------
const FLS={};let flagThinkT=0;
function flagState(T){const E=enemyArmy(T),my=FL.find(F=>F.team===T),th=FL.find(F=>F.team===E);if(!my||!th)return{};
 const lost=Math.hypot(my.x-my.home[0],my.z-my.home[1])>2,cp=th.carrier?carrierPos(th.carrier):null,esc=cp&&carrierArmy(th.carrier)===T?cp:null,grab=!th.carrier&&!th.held&&Math.hypot(th.x-th.home[0],th.z-th.home[1])>2;
 const air=my.carrier?carrierCraft(my.carrier):null,escAir=esc?carrierCraft(th.carrier):null;
 return{my,th,lost,esc,grab,air,escAir};}
// karoga nesējs helikopterā vai lidmašīnā (gaisā, nevis stāvvietā)
function carrierCraft(c){const A=c==='P'?(heliMode||jetMode):c&&c.pos?(c.inHeli||c.inJet):c&&(c.heli||c.jet);return A&&A.y>3&&A.st!=='gone'?A:null;}
function carrierAlt(c){if(c==='P')return pY;if(c&&c.pos)return c.y||0;if(!c)return 0;const A=c.heli||c.jet;return A?A.y:(c.g?c.g.position.y:0);}
function flagRadio(){if(!isWar()||NET.role==='guest')return;for(const T of ARMY){const s=flagState(T),k=(s.lost?'L':'')+(s.air?'A':'')+(s.esc?'E':'')+(s.escAir?'B':'')+(s.grab?'G':''),o=FLS[ARMY.indexOf(T)]||'';if(k===o)continue;FLS[ARMY.indexOf(T)]=k;
  if(s.lost&&!o.includes('L'))radio(T,'r_flagl');else if(!s.lost&&o.includes('L'))radio(T,'r_flagok');
  if(s.esc&&!o.includes('E'))radio(T,'r_flagw',{n:carrierName(s.th.carrier)});if(s.grab&&!o.includes('G'))radio(T,'r_flagg');if(s.air&&!o.includes('A'))radio(T,'r_flaga');if(s.escAir&&!o.includes('B'))radio(T,'r_flagb',{n:carrierName(s.th.carrier)});}}
const _botThink24=botThink;botThink=function(b){
 if(!isWar()||b.trader||b.jet||b.para||b.heli||b.tankV||b.jetGoal||b.heliGoal||ARMY.indexOf(b.team)<0)return _botThink24(b);
 const p=b.g.position,fi=inMoloFire(p.x,p.z);if(fi){const dx=p.x-fi.x,dz=p.z-fi.z,l=Math.hypot(dx,dz)||1;b.follow=false;b.tg=null;goal(b,fi.x+dx/l*(fi.w+3),fi.z+dz/l*(fi.d+3),false);return;}
 if(b.wrole==='esc')return _botThink24(b);const s=flagState(b.team);if(!s.my)return _botThink24(b);
 // karoga nesējs skrien uz mājām, neapstājoties kaujā
 if(s.th.carrier===b){b.follow=false;b.tg=null;b.tankGoal=null;if(b.gx==null||Math.hypot(b.gx-s.my.home[0],b.gz-s.my.home[1])>3)goal(b,s.my.home[0],s.my.home[1],Math.hypot(s.my.home[0]-p.x,s.my.home[1]-p.z)>70);return;}
 let tx=null,tz=null,near=4;
 // zaglis lido: Javelin šāvēji seko un notriec, pārējie dodas uz pretinieku bāzi, kur karogs nonāks
 if(s.air){if(b.I.ammo.jav>0){tx=s.air.x;tz=s.air.z;near=45;}else{const a=(b.nid%10)/10*6.283;tx=s.th.home[0]+Math.cos(a)*10;tz=s.th.home[1]+Math.sin(a)*10;near=4;}}
 else if(s.escAir){tx=s.my.home[0]+((b.nid%7)-3)*3;tz=s.my.home[1]+((b.nid%5)-2)*3;near=4;}
 else if(s.lost&&(b.wrole!=='att'||!s.esc)){const cp=s.my.carrier?carrierPos(s.my.carrier):null;tx=cp?cp.x:s.my.x;tz=cp?cp.z:s.my.z;near=1;
  // tālie skrien pārtvert: uz vietu starp zagli un viņa bāzi
  if(cp){const k=Math.min(.6,Math.hypot(cp.x-p.x,cp.z-p.z)/300);tx+=(s.th.home[0]-cp.x)*k;tz+=(s.th.home[1]-cp.z)*k;}}
 else if(s.esc){const a=(b.nid%8)/8*6.283,r=4+(b.nid%3)*2;tx=s.esc.x+Math.cos(a)*r;tz=s.esc.z+Math.sin(a)*r;}
 else if(s.grab&&(b.wrole==='att'||Math.hypot(s.th.x-p.x,s.th.z-p.z)<80)){tx=s.th.x;tz=s.th.z;near=1;}
 if(tx===null)return _botThink24(b);
 const d=Math.hypot(tx-p.x,tz-p.z),th=nearestThreat(b);if(th&&th.ed<16&&d<45)return _botThink24(b);
 b.tankGoal=null;b.follow=false;b.tg=null;
 // jaunu ceļu plāno tikai tad, ja mērķis aizgājis tālāk; citādi bots mīņājas uz vietas
 if(d<=near)b.gx=null;else if(b.gx==null||Math.hypot(b.gx-tx,b.gz-tz)>6)goal(b,tx+(Math.random()-.5)*2,tz+(Math.random()-.5)*2,d>70);};
// tehnika un helikopteri arī dodas uz karogu vai pavada nesēju
function flagVehTick(){for(const t of tanks){const d=t.driver;if(!d||!d.team)continue;const s=flagState(d.team);if(!s.my)continue;
  if(s.air)t.supp=t.kind==='apc'?{x:s.air.x,z:s.air.z}:{x:s.th.home[0],z:s.th.home[1]};else if(s.escAir)t.supp={x:s.my.home[0],z:s.my.home[1]};
  else if(s.lost){const cp=s.my.carrier?carrierPos(s.my.carrier):null;t.supp={x:cp?cp.x:s.my.x,z:cp?cp.z:s.my.z};}else if(s.esc)t.supp={x:s.esc.x,z:s.esc.z};}
 // savas lidmašīnas dzenas pakaļ lidojošam zaglim
 for(const J of JETS){const b=J.pilot;if(!b||!b.g||J.st!=='fly')continue;const s=flagState(b.team);if(s.air){J.wp=[s.air.x,s.air.z];J.wpT=4;}}
 for(const H of HELIS){const b=H.pilot;if(!b||!b.g||H.st!=='fly')continue;const s=flagState(b.team);if(!s.my)continue;const P=s.lost?(s.my.carrier?carrierPos(s.my.carrier):{x:s.my.x,z:s.my.z}):s.esc;if(!P)continue;H.wp=[P.x+(Math.random()-.5)*14,P.z+(Math.random()-.5)*14];H.wpT=3;H.mis=Math.max(H.mis||0,H.t+10);}}
// ---------- 6. Kalašņikovi bāzēs ----------
let akT=20;
function akTick(dt){akT-=dt;if(akT>0)return;akT=60;let any=false;WB.forEach((B,i)=>{const n=drops.filter(d=>d.kind==='w:ak'&&Math.hypot(d.x-B.x,d.z-B.z)<BR).length;
  for(let k=n;k<2;k++){dropItem(B.x+(k?-5:5),B.z-B.d*8,'w:ak');any=true;}if(any)radio(ARMY[i],'ak_base');});}
const _warSetup24=warSetup;warSetup=function(){_warSetup24();akT=3;for(const k in FLS)delete FLS[k];for(const b of humans)if(ARMY.includes(b.team)&&Math.random()<.2){b.I.has.ak=true;b.I.ammo.ak=40;}};
// ---------- 7. kopīgajā spēlē: atdzimst pie drauga, ja viņš nav kaujā ----------
function friendSpot(T,exclude){const list=[];if(active&&PT===T&&exclude!=='P'&&!inTank&&!jetMode&&!heliMode&&!paraMode&&pY<1)list.push({n:$('nickname').value,p:player.position});
 for(const G of NET.guests.values())if(G!==exclude&&G.ready&&!G.dead&&GT(G)===T&&!G.inJet&&!G.inHeli&&(G.y||0)<1)list.push({n:G.name,p:G.pos});
 for(const f of list.sort(()=>Math.random()-.5)){let safe=true;for(const h of HL)if(h.team!==T&&T.enemies.has(h.team)&&Math.hypot(h.p.x-f.p.x,h.p.z-f.p.z)<30){safe=false;break;}if(!safe)continue;
  for(let k=0;k<12;k++){const a=k/12*6.283,x=f.p.x+Math.cos(a)*2.5,z=f.p.z+Math.sin(a)*2.5;if(!overlapAt(x,z,.4,0,T))return{n:f.n,x,z};}}return null;}
// karā atdzimstot vienmēr ir M16 vai Kalašņikovs (nejauši) ar pilnu lodju komplektu
function warKit(I){const w=Math.random()<.5?'m16':'ak';I.has[w]=true;I.ammo[w]=Math.max(I.ammo[w]||0,WP[w].max);return w;}
const _resume24=resume;resume=function(){_resume24();if(isWar()&&NET.role!=='guest'){const w=warKit(inv);selectW(w);updateAmmo();renderInv();renderW();say(WP[w].ic+' '+t('w'+w)+' +'+WP[w].max,2.5);}if(!isWar()||!NET.guests.size||NET.role!=='host')return;const s=friendSpot(PT,'P');if(s){player.position.set(s.x,0,s.z);say(tf('rs_friend',{n:s.n}),3);}};
function friendRespTick(){if(NET.role!=='host')return;for(const G of NET.guests.values()){const was=G._wd;G._wd=!!G.dead;if(!was||G.dead||!isWar())continue;{const w=warKit(G.I);netTo(G,{t:'msg',s:WP[w].ic+' '+t('w'+w)+' +'+WP[w].max,d:2.5});netMe(G);}const s=friendSpot(GT(G),G);
  if(s){G.pos.set(s.x,0,s.z);G.y=0;netTo(G,{t:'tp',x:r2(s.x),z:r2(s.z)});netTo(G,{t:'msg',s:tf('rs_friend',{n:s.n}),d:3});netMe(G);}}}
// ---------- cikls ----------
const _updateFx24=updateFx;updateFx=function(dt){_updateFx24(dt);if(MOLO.length)moloTick(dt);moloFireTick(dt);
 if(isWar()&&NET.role!=='guest'){if((flagThinkT-=dt)<=0){flagThinkT=.5;flagRadio();flagVehTick();}akTick(dt);}friendRespTick();};
// lidojot karogs ir redzams pie zagļa, nevis uz zemes
const _flagDraw24=flagDraw;flagDraw=function(){_flagDraw24();if(NET.role==='guest')return;for(const F of FL)if(F.carrier&&F.g){const y=carrierAlt(F.carrier);if(y>2)F.g.position.y=y+1;}};
// ---------- 8. nozagts karogs: 5 minūšu atskaite, kurā tas jāatgūst ----------
Object.assign(T.lv,{fcd_my:'🚩 Mūsu karogs nozagts! Atgūsti to',fcd_their:'🚩 Pretinieku karogs ir mūsu rokās! Noturi to',fcd_1m:'📻 Atlikusi 1 minūte, lai atgūtu karogu!',fcd_10:'📻 10 sekundes!'});
Object.assign(T.en,{fcd_my:'🚩 Our flag is stolen! Get it back',fcd_their:'🚩 We have the enemy flag! Hold it',fcd_1m:'📻 1 minute left to get the flag back!',fcd_10:'📻 10 seconds!'});
const FCD=300;
const _flagTick24=flagTick;flagTick=function(dt){_flagTick24(dt);for(const F of FL){const away=!!F.carrier||Math.hypot(F.x-F.home[0],F.z-F.home[1])>2;
  if(!away){F.cd=null;continue;}const o=F.cd;if(F.cd==null)F.cd=FCD;F.cd-=dt;
  if(o>60&&F.cd<=60)radio(F.team,'fcd_1m');if(o>10&&F.cd<=10)radio(F.team,'fcd_10');
  if(F.cd<=0&&!winner)warWin(F.team===ARMY[0]?ARMY[1]:ARMY[0]);}};
const fcdEl=document.createElement('div');fcdEl.id='flagcd';document.body.appendChild(fcdEl);
let fcdLast='';
function fcdTick(){let h='';if(isWar()&&active&&!winner){const mine=FL[MYSIDE],their=FL[1-MYSIDE],f=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
  if(mine&&mine.cd!=null)h='<div class="bad"><small>'+t('fcd_my')+'</small>⏱️ '+f(Math.max(0,mine.cd))+'</div>';
  if(their&&their.cd!=null)h+='<div class="good"><small>'+t('fcd_their')+'</small>⏱️ '+f(Math.max(0,their.cd))+'</div>';}
 if(h!==fcdLast){fcdLast=h;fcdEl.innerHTML=h;fcdEl.style.display=h?'flex':'none';}}
const _updateFx24c=updateFx;updateFx=function(dt){_updateFx24c(dt);fcdTick();};
const _warSetup24c=warSetup;warSetup=function(){_warSetup24c();for(const F of FL)F.cd=null;};
