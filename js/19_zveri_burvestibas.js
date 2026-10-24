// 19_zveri_burvestibas.js - Saimniecība: nauda, tirgotāji (sēklas, zvēri, ieroči, burvis) ar mājām, suņi, lāči, vistas,
// koki un puķes no sēklām, burvestība pārvērst vistā, saimnieku boti
const pets=[],chickens=[],plants=[],traders=[];let petId=0,plantId=0,petT=0,botSpT=0;
// tirgotāji ielu galos meža malā: [stends x,z, māja x,z]
const TRADER_DEF=[['seeds',20,-170,27,-173],['animals',-20,170,-27,173],['weapons',170,20,173,27],['wizard',-170,-20,-173,-27]];
const SHOPS={seeds:[['grow',15],['flow',8],['match',10]],animals:[['dog',25],['bear',100],['chicken',8],['pig',40],['cow',60],['dh',10]],weapons:[['pistol',30],['m16',60],['shot',50],['rpg',90],['a_pistol',8],['a_m16',12],['armor',40]],wizard:[['poly',40],['grow',15],['match',10]]};
const TCOL2={seeds:0x2e7d32,animals:0x8d6e63,weapons:0x37474f,wizard:0x6c3483};
function nearTrader(x,z){return TRADER_DEF.some(d=>Math.hypot(d[1]-x,d[2]-z)<5||Math.hypot(d[3]-x,d[4]-z)<4);}
// ---------- modeļi ----------
function dogMesh(){const g=new THREE.Group(),c=[0x8d6e63,0x5d4037,0xd7ccc8,0x212121][Math.floor(Math.random()*4)],legs=[];
 const b=cube(.36,.36,.85,c,1);b.position.y=.55;g.add(b);const h=cube(.32,.32,.36,c,1);h.position.set(0,.85,-.5);g.add(h);
 const sn=cube(.18,.14,.2,0x3e2723,1);sn.position.set(0,.78,-.75);g.add(sn);
 for(const x of [-.11,.11]){const e=cube(.08,.16,.06,0x3e2723,1);e.position.set(x,1.06,-.45);g.add(e);}
 const tl=cube(.08,.08,.4,c,1);tl.position.set(0,.72,.55);tl.rotation.x=-.7;g.add(tl);g.userData.tail=tl;
 for(const [x,z] of [[-.12,-.3],[.12,-.3],[-.12,.3],[.12,.3]]){const l=cube(.1,.4,.1,c,1);l.position.set(x,.2,z);g.add(l);legs.push(l);}
 g.userData.legs=legs;scene.add(g);return g;}
function bearMesh(){const g=new THREE.Group(),c=0x4e342e,legs=[];
 const b=cube(1,.9,1.6,c,1);b.position.y=1.05;g.add(b);const h=cube(.7,.6,.6,c,1);h.position.set(0,1.45,-1);g.add(h);
 const sn=cube(.3,.25,.3,0x8d6e63,1);sn.position.set(0,1.35,-1.35);g.add(sn);
 for(const x of [-.25,.25]){const e=cube(.18,.18,.1,c,1);e.position.set(x,1.8,-.9);g.add(e);}
 for(const [x,z] of [[-.32,-.55],[.32,-.55],[-.32,.55],[.32,.55]]){const l=cube(.3,.7,.3,c,1);l.position.set(x,.35,z);g.add(l);legs.push(l);}
 g.userData.legs=legs;scene.add(g);return g;}
function liveMesh(k){if(k==='cow'||k==='pig')return bigLiveMesh(k);return chickenMesh();}
function chickenMesh(){const g=new THREE.Group(),legs=[];
 const b=cube(.34,.3,.42,0xf5f5f5,1);b.position.y=.42;g.add(b);const h=cube(.18,.2,.18,0xf5f5f5,1);h.position.set(0,.66,-.2);g.add(h);
 const k=cube(.06,.08,.1,0xe53935,1);k.position.set(0,.8,-.2);g.add(k);const bk=cube(.06,.05,.1,0xffb300,1);bk.position.set(0,.64,-.33);g.add(bk);
 for(const x of [-.07,.07]){const l=cube(.04,.26,.04,0xffb300,1);l.position.set(x,.13,0);g.add(l);legs.push(l);}
 g.userData.legs=legs;scene.add(g);return g;}
function plantMesh(k){const g=new THREE.Group();
 if(k==='tree'){const tr=new THREE.Mesh(new THREE.CylinderGeometry(.28,.38,2.2,7),mat(0x6b4a2f,.95));tr.position.y=1.1;tr.castShadow=true;g.add(tr);for(let j=0;j<2;j++){const c=new THREE.Mesh(new THREE.ConeGeometry(1.5-j*.4,1.8,8),mat(0x2e7d32,.9));c.position.y=2.5+j;c.castShadow=true;g.add(c);}
  for(let i=0;i<3;i++){const a=cube(.18,.18,.18,0xd32f2f,.6);a.position.set(Math.cos(i*2.1)*1.1,2.3,Math.sin(i*2.1)*1.1);g.add(a);}}
 else{const col=[0xe53935,0xfdd835,0x8e24aa,0xff7043,0x42a5f5][Math.floor(Math.random()*5)];const st=cube(.05,.5,.05,0x388e3c,1);st.position.y=.25;g.add(st);const pe=cube(.26,.12,.26,col,.8);pe.position.y=.55;g.add(pe);const c=cube(.1,.13,.1,0xfff176,.8);c.position.y=.6;g.add(c);}
 scene.add(g);return g;}
function coinMesh(){const g=new THREE.Group(),c=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.06,12),mat(0xffc107,.3));c.material.emissive.set(0x664400);c.material.metalness=.6;c.rotation.x=Math.PI/2;g.add(c);return g;}
function stallMesh(kind){const g=new THREE.Group(),col=TCOL2[kind];
 const fl=cube(3.6,.15,2.4,0x6b4a2f,1);fl.position.y=.08;g.add(fl);for(const x of [-1.6,1.6])for(const z of [-1,1]){const p=cube(.16,2.4,.16,0x5d4037,1);p.position.set(x,1.2,z);g.add(p);}
 const rf=cube(4,.15,2.8,col,.8);rf.position.y=2.45;g.add(rf);const tb=cube(2.6,.8,.6,0x8d6e63,1);tb.position.set(0,.55,-.8);g.add(tb);
 const goods={seeds:[0x66bb6a,0xfdd835,0x8d6e63],animals:[0xd7ccc8,0x5d4037,0xffffff],weapons:[0x222a33,0x4b5d3a,0xd4a537],wizard:[0xce93d8,0x7e57c2,0x42a5f5]}[kind];
 for(let i=0;i<4;i++){const it=cube(.3,.25,.3,goods[i%3],.5);it.position.set(-.9+i*.6,1.08,-.8);g.add(it);}scene.add(g);return g;}
function houseMesh(kind){const g=new THREE.Group();const w=cube(3.6,3,3.6,0x8a6a45,.95);w.position.y=1.5;g.add(w);
 const r=new THREE.Mesh(new THREE.ConeGeometry(3.2,1.6,4),mat(TCOL2[kind],.85));r.position.y=3.8;r.rotation.y=Math.PI/4;r.castShadow=true;g.add(r);
 const d=cube(1,2,.1,0x4a2f1a,.9);d.position.set(0,1,-1.83);g.add(d);const wn=cube(.7,.6,.06,0xffe082,.4);wn.material.emissive.set(0x332200);wn.position.set(1,1.8,-1.82);g.add(wn);scene.add(g);return g;}
// ---------- tirgotāji: īsti cilvēki ar savu māju; naktī iet iekšā ----------
function spawnTraders(withBots){
 for(const tr of traders){scene.remove(tr.stall);freeObj(tr.stall);scene.remove(tr.house);freeObj(tr.house);remOb(tr.ob);}traders.length=0;
 for(const [kind,sx,sz,hx,hz] of TRADER_DEF){
  const stall=stallMesh(kind);stall.position.set(sx,0,sz);stall.rotation.y=Math.atan2(-sx,-sz);
  const house=houseMesh(kind);house.position.set(hx,0,hz);house.rotation.y=Math.atan2(sx-hx,sz-hz)+Math.PI;
  const ob={x:hx,z:hz,hx:1.8,hz:1.8};addOb(ob); // mājā neviens cits nevar ieiet
  const tr={kind,sx,sz,hx,hz,stall,house,ob,b:null};traders.push(tr);
  if(withBots){const T=newTeam(TCOL2[kind]);T.calm=true;T.noOffer=true;T.traderT=true;
   const I=newInv();I.has.m16=true;I.ammo.m16=20;if(kind==='weapons'){I.has.pistol=true;I.ammo.pistol=40;I.has.rpg=true;I.ammo.rpg=2;I.armor=50;}
   const b=newBot(T,sx,sz,t('tr_'+kind),I,kind==='weapons');b.trader=tr;tr.b=b;relabel(b);
   if(kind==='wizard'){const hat=new THREE.Mesh(new THREE.ConeGeometry(.32,.7,6),mat(0x4a148c,.8));hat.position.y=2.35;b.g.add(hat);}}
 }
}
// tirgotāja prāts: dienā pie stenda; naktī mājā; ja šauj - sēklu/zvēru/burvis bēg un šauj pretī, ieroču tirgotājs uzbrūk
function traderThink(b){
 const tr=b.trader,p=b.g.position,night=hour>=20||hour<6.5;
 if(b.inside){if(!night){b.inside=false;p.set(tr.hx-(tr.hx-tr.sx)*.6,0,tr.hz-(tr.hz-tr.sz)*.6);b.g.position.y=0;}else return;}
 let th=nearestThreat(b);if(th&&th.e.m&&th.e.m.userData.kind==='f')th=null; // ar meža ļaudīm tirgotāji sadzīvo
 b.tg=th?th.e:null;
 if(th){b.w=bestW(b,th.e,th.ed);
  if(tr.kind==='weapons'){if(th.ed>WP[b.w].rng*.7)goal(b,th.e.p.x,th.e.p.z);else b.gx=null;}
  else{const ax=p.x-th.e.p.x,az=p.z-th.e.p.z,l=Math.hypot(ax,az)||1;goal(b,p.x+ax/l*10,p.z+az/l*10);}
  return;}
 const tx=night?tr.hx-(tr.hx-tr.sx)*.45:tr.sx+(tr.hx-tr.sx)*.08,tz=night?tr.hz-(tr.hz-tr.sz)*.45:tr.sz+(tr.hz-tr.sz)*.08;
 if(Math.hypot(p.x-tx,p.z-tz)>1.2)goal(b,tx,tz);else{b.gx=null;if(night){b.inside=true;b.g.position.y=-60;}}
}
function traderOf(b){return b&&b.trader;}
function stallNear(x,z){for(const tr of traders){const b=tr.b;if(b&&!b.dead&&!b.inside&&!PT.enemies.has(b.team)&&Math.hypot(tr.sx-x,tr.sz-z)<4&&Math.hypot(b.g.position.x-x,b.g.position.z-z)<12)return tr;}return null;}
function renderShop(kind){
 const el=$('shop');if(!el)return;const list=SHOPS[kind]||[];el.dataset.kind=kind;
 let h='<button class="corner" data-x="1" style="float:right;margin:0">✖</button><b>🛒 '+t('tr_'+kind)+'</b> · 🪙 '+(PT.coins||0);
 for(const [k] of list){const p=priceOf(k,kind);h+='<div class="row"><span>'+t('shop_'+k)+' · '+p+' 🪙'+trendIc(k)+'</span><button class="corner" data-k="'+k+'"'+((PT.coins||0)<p?' style="opacity:.45"':'')+'>'+t('buy')+'</button></div>';}
 const pr=(inv.prod||{});h+='<div style="margin-top:8px"><b>'+t('sellt')+'</b></div>';
 for(const k of PROD){const n=pr[k]||0,p=sellPrice(k);h+='<div class="row"><span>'+PRODIC[k]+' '+t('pr_'+k)+' ('+n+') · '+p+' 🪙'+trendIc('s_'+k)+'</span><button class="corner" data-s="'+k+'"'+(n?'':' style="opacity:.45"')+'>'+t('sell')+'</button></div>';}
 el.innerHTML=h;el.style.display='block';$('inv').style.display='none';$('team').style.display='none';
 el.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();if(b.dataset.x){el.style.display='none';return;}
  if(b.dataset.s){if(NET.role==='guest'){netSend({t:'sell',k:b.dataset.s});return;}say(sell(b.dataset.s,'P'),1.5);renderShop(kind);renderInv();return;}
  if(NET.role==='guest'){netSend({t:'buy',k:b.dataset.k,kind});return;}say(buy(b.dataset.k,'P',kind),2);renderShop(kind);renderInv();updateHealth();});
}
// pirkums: owner = 'P' (saimnieks) vai drauga objekts G
function buy(k,owner,kind){
 const it=(SHOPS[kind]||[]).find(s=>s[0]===k);if(!it)return '';const pr=priceOf(k,kind);if((PT.coins||0)<pr)return t('nocoins');
 const I=owner==='P'?inv:owner.I,pos=owner==='P'?player.position:owner.pos;
 if((k==='dog'||k==='bear')&&pets.filter(p=>p.owner===owner).length>=3)return t('petmax');
 PT.coins-=pr;bumpPrice(k);
 if(k==='dog'||k==='bear')spawnPet(k,pos.x+1.5,pos.z+1.5,owner);
 else if(k==='chicken'||k==='pig'||k==='cow'){const c=spawnChicken(pos.x+1.2,pos.z+1.2,null,k);c.home=[pos.x,pos.z];c.owned=true;if(NET.role==='host')netQ.push({e:'ck',id:c.id,x:r2(c.g.position.x),z:r2(c.g.position.z)});}
 else if(k==='dh'){const a=owner==='P'?yaw:(owner.yaw||0);placeDoghouse(Math.round(pos.x-Math.sin(a)*2.2),Math.round(pos.z-Math.cos(a)*2.2),owner);}
 else if(k==='poly'){I.has.poly=true;I.ammo.poly=Math.min(20,(I.ammo.poly||0)+3);}
 else if(k==='grow'||k==='flow'){I.has[k]=true;I.ammo[k]=Math.min(40,(I.ammo[k]||0)+5);}
 else giveLoot(k,I,PT);
 sfx('pick');return t('bought')+' '+t('shop_'+k);
}
// ---------- zvēri ----------
function spawnPet(kind,x,z,owner){const g=kind==='dog'?dogMesh():bearMesh();g.position.set(x,0,z);const p={id:++petId,kind,g,owner:owner||null,hp:kind==='dog'?1:300,st:{},bark:0,cd:0,wx:x,wz:z,slot:Math.random()*6.283};pets.push(p);return p;}
function killPet(p){const i=pets.indexOf(p);if(i<0)return;pets.splice(i,1);scatter(p.g.children,1);p.g.userData.corpseParts=p.g.children;corpses.push({group:p.g,life:6});if(Math.hypot(p.g.position.x-player.position.x,p.g.position.z-player.position.z)<30)sfx('hurt');}
const ownerPos=o=>o==='P'?(active?player.position:null):o&&o.pos?(o.dead?null:o.pos):o&&o.g?(o.dead||o.inside?null:o.g.position):null;
const ownerTeam=o=>o==='P'||(o&&o.pos)?PT:o&&o.team?o.team:null;
function updatePets(dt){
 for(let i=pets.length-1;i>=0;i--){
  const p=pets[i],g=p.g,pos=g.position;
  if(p.owner&&p.owner!=='P'&&(p.owner.dead||(p.owner.pos&&!NET.guests.has(p.owner.id))))p.owner=null; // saimnieks krita: atkal savvaļā
  const op=ownerPos(p.owner),tm=ownerTeam(p.owner);
  let en=null,ed=p.kind==='bear'?14:18;
  for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0)continue;const d=Math.hypot(z.position.x-pos.x,z.position.z-pos.z);if(d<ed){ed=d;en=z;}}
  let tx,tz,sp;
  if(p.kind==='bear'&&en&&p.owner){tx=en.position.x;tz=en.position.z;sp=4.5;p.cd-=dt;if(ed<2.2&&p.cd<=0){p.cd=1;dmgMonster(en,25,false);}}
  else if(p.kind==='dog'&&p.owner&&(hour>=21||hour<7)&&doghouseOf(p.owner)){const dh=doghouseOf(p.owner);tx=dh.x;tz=dh.z+1.3;sp=5;p.guard=true;}
  else if(op){p.guard=false;p.slot+=dt*.2;tx=op.x+Math.cos(p.slot)*2.6;tz=op.z+Math.sin(p.slot)*2.6;sp=Math.hypot(tx-pos.x,tz-pos.z)>8?8:4.5;if(Math.hypot(tx-pos.x,tz-pos.z)>60){pos.x=tx;pos.z=tz;}}
  else{if(Math.hypot(p.wx-pos.x,p.wz-pos.z)<1){p.wx=pos.x+(Math.random()-.5)*14;p.wz=pos.z+(Math.random()-.5)*14;}tx=p.wx;tz=p.wz;sp=1.6;}
  const ox=pos.x,oz=pos.z;if(Math.hypot(tx-pos.x,tz-pos.z)>.6)stepTo(pos,tx,tz,sp,dt,p.kind==='bear'?.6:.3,tm,p.st);
  const mv=Math.hypot(pos.x-ox,pos.z-oz)>.002;if(mv)g.rotation.y=Math.atan2(-(pos.x-ox),-(pos.z-oz));
  const sw=mv?Math.sin(clock.elapsedTime*14+p.id)*.6:0;g.userData.legs.forEach((l,k)=>l.rotation.x=k%2?sw:-sw);if(g.userData.tail)g.userData.tail.rotation.y=Math.sin(clock.elapsedTime*10)*.5;
  // suns rej, kad tuvojas ienaidnieks (monstrs vai pretinieks)
  p.bark-=dt;if(p.kind==='dog'&&p.owner&&p.bark<=0){if(p.guard&&!en)for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0)&&Math.hypot(z.position.x-pos.x,z.position.z-pos.z)<25){en=z;break;}}let foe=en;if(!foe&&tm)for(const b of humans)if(tm.enemies.has(b.team)&&Math.hypot(b.g.position.x-pos.x,b.g.position.z-pos.z)<18){foe=b;break;}
   if(foe){p.bark=2.5;if(Math.hypot(pos.x-player.position.x,pos.z-player.position.z)<35){woof();popup('🐕 '+t('woof'),pos.clone().add(new THREE.Vector3(0,1.4,0)));}else if(p.guard&&p.owner==='P'&&gtime>(p.alertT||0)){p.alertT=gtime+25;say(t('dhbark'),2.5);}if(NET.role==='host')netQ.push({e:'bark',x:r2(pos.x),z:r2(pos.z)});}}
  // ienaidnieki suni nogalina ar vienu šāvienu vai kodienu; lāci tikai pamazām
  for(const b of bullets){if(b.team===tm||b.rocket)continue;if(Math.hypot(b.m.position.x-pos.x,b.m.position.z-pos.z)<.6){p.hp-=p.kind==='dog'?99:b.dmg;b.life=0;}}
  for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0)&&Math.hypot(z.position.x-pos.x,z.position.z-pos.z)<1.4+(p.kind==='bear'?.6:0)){if(p.kind==='dog'){if(p.owner&&Math.random()<dt*1.5)p.hp=0;}else p.hp-=10*dt;}}
  if(p.hp<=0){killPet(p);continue;}
  g.visible=Math.hypot(pos.x-player.position.x,pos.z-player.position.z)<85;
 }
 for(let i=chickens.length-1;i>=0;i--){const c=chickens[i],pos=c.g.position;
  if(Math.hypot(c.wx-pos.x,c.wz-pos.z)<.5||Math.random()<dt*.3){const hx=c.home?c.home[0]:pos.x,hz=c.home?c.home[1]:pos.z;c.wx=hx+(Math.random()-.5)*6;c.wz=hz+(Math.random()-.5)*6;}
  const ox=pos.x,oz=pos.z;stepTo(pos,c.wx,c.wz,c.kind==='cow'?.8:1.2,dt,c.kind==='cow'?.5:.2,null,c.st);if(Math.hypot(pos.x-ox,pos.z-oz)>.001)c.g.rotation.y=Math.atan2(-(pos.x-ox),-(pos.z-oz));
  const sw=Math.sin(clock.elapsedTime*16+i)*.5;c.g.userData.legs[0].rotation.x=sw;c.g.userData.legs[1].rotation.x=-sw;
  // saimniecības lopi dod ražu: vista olas, govs pienu, cūka izrok sēnes (pārdod tirgotājam)
  if(c.home){const pk=LIVE[c.kind||'chicken'];c.egg=(c.egg??(pk.t*.8+Math.random()*30))-dt;if(c.egg<=0){c.egg=pk.t+Math.random()*30;dropItem(pos.x+(Math.random()-.5),pos.z+(Math.random()-.5),pk.p);}}
  let shot=false;const big=c.kind==='cow'||c.kind==='pig';for(const b of bullets)if(Math.hypot(b.m.position.x-pos.x,b.m.position.z-pos.z)<(big?.9:.5)){b.life=0;c.hp=(c.hp??(big?3:1))-1;if(c.hp<=0)shot=true;break;}
  for(const z of zombies)if(!z.userData.dead&&Math.hypot(z.position.x-pos.x,z.position.z-pos.z)<1.2&&Math.random()<dt){shot=true;break;}
  if(shot)removeChicken(c);}
 // iestādītie koki ik pa laikam nomet ābolu (+15 dzīvības)
 for(const p of plants)if(p.k==='tree'&&(p.gr||0)>=1){p.ap=(p.ap??(80+Math.random()*60))-dt;if(p.ap<=0){p.ap=110+Math.random()*60;const a=Math.random()*6.283;dropItem(p.x+Math.cos(a)*1.4,p.z+Math.sin(a)*1.4,'apple');}}
 if(NET.role==='host'&&NET.guests.size){petT-=dt;if(petT<=0){petT=.1;
  const E=pets.map(p=>[p.id,p.kind==='dog'?0:1,r2(p.g.position.x),r2(p.g.position.z),r2(p.g.rotation.y),p.owner?1:0]),C=chickens.map(c=>[c.id,r2(c.g.position.x),r2(c.g.position.z),LIVEK.indexOf(c.kind||'chicken')]),D=drops.filter(d=>d.kind).map(d=>[d.id,d.kind,r2(d.x),r2(d.z)]);
  for(const G of NET.guests.values())if(G.ready)netTo(G,{t:'pe',E,C,D,co:PT.coins||0,pr:prices});}}
}
function woof(){tone(520,.08,'square',.09,300);tone(480,.1,'square',.08,260,.15);}
function spawnChicken(x,z,id,kind){kind=kind||'chicken';const g=liveMesh(kind);g.position.set(x,0,z);const c={id:id||++petId,g,wx:x,wz:z,st:{},kind};chickens.push(c);explosionFx(x,.8,z,1.2,0xce93d8);return c;}
function removeChicken(c){const i=chickens.indexOf(c);if(i<0)return;chickens.splice(i,1);debris(c.g.position.x,.5,c.g.position.z,0xffffff,6);scene.remove(c.g);freeObj(c.g);}
// ---------- nauda un āboli zemē (izmanto drops sarakstu) ----------
let dropId=0;
function dropItem(x,z,kind,coins){const m=kind==='coin'?coinMesh():prodMesh(kind);m.position.set(x,.4,z);scene.add(m);const d={m,x,z,I:newInv(),kind,coins:coins||0,id:++dropId};drops.push(d);return d;}
function dropCoins(x,z,n){return dropItem(x,z,'coin',n);}
const _takeDrop=takeDrop;takeDrop=function(d,who){
 if(!d.kind)return _takeDrop(d,who);
 const i=drops.indexOf(d);if(i<0)return;scene.remove(d.m);freeObj(d.m);drops.splice(i,1);
 const tm=who?who.team:PT;
 if(d.kind==='coin'){tm.coins=(tm.coins||0)+d.coins;if(!who){say('+'+d.coins+' 🪙',1.2);sfx('pick');}}
 else if(who&&who.g){tm.coins=(tm.coins||0)+sellPrice(d.kind);} // boti ražu uzreiz pārdod
 else{const I=who?who.I:inv;I.prod=I.prod||{};I.prod[d.kind]=(I.prod[d.kind]||0)+1;if(!who){say(PRODIC[d.kind]+' +1',1.2);sfx('pick');renderInv();}}
};
// ---------- augi ----------
function addPlant(k,x,z,id,born){
 const g=plantMesh(k);g.position.set(x,0,z);const p={id:id||('p'+(++plantId)),k,x,z,g,ob:null,s:1,born:born??(day*24+hour),gr:0};growPlant(p);
 if(k==='tree'){p.ob={x,z,hx:.3,hz:.3};addOb(p.ob);}plants.push(p);
 if(NET.role==='host'&&NET.guests.size)netQ.push({e:'plant',id:p.id,k,x:r2(x),z:r2(z),b:r2(p.born)});return p;}
function removePlant(p){const i=plants.indexOf(p);if(i>=0)plants.splice(i,1);if(p.ob){remOb(p.ob);p.ob.dead=true;}scene.remove(p.g);freeObj(p.g);}
// ---------- burvestības un sēklas ----------
function polyTarget(px,pz,a,team){
 let best=null,bs=1e9;const look=(x,z,o,kind)=>{const dx=x-px,dz=z-pz,d=Math.hypot(dx,dz);if(d>22||d<.3)return;let df=Math.atan2(-dx,-dz)-a;df=Math.atan2(Math.sin(df),Math.cos(df));if(Math.abs(df)>.6)return;const s=Math.abs(df)*10+d*.2;if(s<bs){bs=s;best={o,kind};}};
 for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0||u.kind==='c'||u.kind==='zw')continue;look(z.position.x,z.position.z,z,'m');}
 for(const b of humans)if(team&&team.enemies.has(b.team)&&!b.inside)look(b.g.position.x,b.g.position.z,b,'b');
 return best;
}
// no pozīcijas (spēlētājs, draugs vai bots); atgriež true, ja izdevās
function castSpell(k,px,pz,a,I,team,src){
 if(!I.has[k]||I.ammo[k]<=0)return false;
 if(k==='poly'){
  const tg=polyTarget(px,pz,a,team);if(!tg){if(src==='P')say(t('notarget'),1);return false;}
  let x,z;if(tg.kind==='m'){x=tg.o.position.x;z=tg.o.position.z;removeMonster(tg.o);}else{x=tg.o.g.position.x;z=tg.o.g.position.z;killBot(tg.o,team);}
  const c=spawnChicken(x,z);if(NET.role==='host')netQ.push({e:'ck',id:c.id,x:r2(x),z:r2(z)});sfxAt('heal',x,z,40);
 }else{
  const x=Math.round(px-Math.sin(a)*1.8),z=Math.round(pz-Math.cos(a)*1.8);
  if(overlapAt(x,z,.45)||Math.abs(x)>EDGE-3||Math.abs(z)>EDGE-3||plants.length>400){if(src==='P')say(t('noplace'),1);return false;}
  addPlant(k==='grow'?'tree':'flower',x+(Math.random()-.5)*.3,z+(Math.random()-.5)*.3);sfxAt('pick',x,z,30);
 }
 I.ammo[k]--;if(I.ammo[k]<=0)I.has[k]=false;return true;
}
// ---------- piesaiste spēlei ----------
const _hit=hit;hit=function(){
 if(active&&attackWait<=0&&!buildMode&&!inTank&&WP[cur]&&WP[cur].spell){
  attackWait=WP[cur].rate;player.userData.arm2.rotation.x=1.6;const fx=()=>explosionFx(player.position.x-Math.sin(yaw)*1.5,1.2,player.position.z-Math.cos(yaw)*1.5,.6,cur==='poly'?0xce93d8:0x81c784);
  if(NET.role==='guest'){if(inv.ammo[cur]>0){inv.ammo[cur]--;netSend({t:'cast',k:cur,a:r2(yaw)});fx();}}
  else if(castSpell(cur,player.position.x,player.position.z,yaw,inv,PT,'P'))fx();
  if(!inv.has[cur]||inv.ammo[cur]<=0)selectW('hands');renderInv();updateAmmo();return;}
 _hit();
};
function nearPetShop(px,pz){let best=null,bd=1e9;
 for(const p of pets){if(p.owner)continue;const d=Math.hypot(p.g.position.x-px,p.g.position.z-pz);if(d<2.6&&d<bd){bd=d;best={type:'pet',p};}}
 return best;}
const _nearInter=nearInter;nearInter=function(){
 const o=_nearInter();
 if(o&&o.type==='bot'&&traderOf(o.b))return o.b.inside?null:{type:'shop',b:o.b};
 if(o&&o.type!=='burn')return o;
 const st=stallNear(player.position.x,player.position.z);if(st)return{type:'shop',b:st.b};return nearPetShop(player.position.x,player.position.z)||o;};
const _updateHint=updateHint;updateHint=function(){
 const o=nearInter();if(o&&(o.type==='pet'||o.type==='shop')){const h=$('hint');h.textContent=(TOUCH?'':'E / ')+(o.type==='pet'?'🐕 '+t('tame'):'🛒 '+t('tr_'+o.b.trader.kind));h.style.display='block';setAct(o.type==='pet'?'🐕':'🛒');return;}
 _updateHint();};
const _interact=interact;interact=function(){
 if(active&&NET.role!=='guest'){const o=nearInter();
  if(o&&o.type==='pet'){if(pets.filter(p=>p.owner==='P').length>=3){say(t('petmax'));return;}o.p.owner='P';say(t('tamed'),2);woof();return;}
  if(o&&o.type==='shop'){renderShop(o.b.trader.kind);return;}}
 _interact();
};
// saimnieki un tirgotāji komandā nenāk
const _askJoin=askJoin;askJoin=function(b){if(b.team.farm){say(tf('farmno',{n:b.name}),2.5);return;}if(traderOf(b))return;_askJoin(b);};
// nauda: monstri dažreiz izmet monētas (lielie vienmēr), nogalināts cilvēks izmet savu naudu
const _killZombie2=killZombie;killZombie=function(z,pl,boom){const u=z.userData,was=!u.dead;_killZombie2(z,pl,boom);if(!was||boom||NET.role==='guest')return;
 const ch={z:.3,s:.3,w:.5,f:.5,zw:1,c:1}[u.kind]||0,n={z:5,s:4,w:10,f:8,zw:30,c:60}[u.kind]||0;if(Math.random()<ch)dropCoins(z.position.x,z.position.z,n);};
const _killBot2=killBot;killBot=function(b,src){const was=!b.dead,p=b.g.position.clone();_killBot2(b,src);if(was&&NET.role!=='guest')dropCoins(p.x+.6,p.z,5+Math.floor(Math.random()*10));};
const _updatePpl=updatePpl;updatePpl=function(){_updatePpl();if(PT)$('ppl').textContent+='  🪙 '+(PT.coins||0);};
// tirgotāji mājā naktī nav redzami monstriem un lodēm
const _buildHL=buildHL;buildHL=function(){_buildHL();for(let i=HL.length-1;i>=0;i--)if(HL[i].b&&HL[i].b.inside)HL.splice(i,1);};
const _botThink=botThink;botThink=function(b){
 if(b.trader)return traderThink(b);
 if(b.team.farm&&!nearestThreat(b)&&farmThink(b))return;
 _botThink(b);
};
// saimnieks: stāda kokus un puķes ap savu sētu, pieradina suni, nav sekotājs; ja uzbrūk - aizstāvas (parastais prāts)
function farmThink(b){
 const T=b.team,p=b.g.position;if(!T.base)return false;if(hour>=21||hour<7)return false;
 if(T.plan&&T.plan.length&&T.blocks>0)return false; // vispirms žogs (būvē kā parasts būvētājs)
 b.ft2=(b.ft2||0)-.4;if(b.ft2>0)return true;b.ft2=2+Math.random()*3;
 if(Math.random()<.35)return false; // dažreiz iet vākt ieročus un resursus
 const r=(T.size||3)+1.5+Math.random()*5,a=Math.random()*6.283,x=Math.round(T.base.x+Math.cos(a)*r),z=Math.round(T.base.z+Math.sin(a)*r);
 if(Math.hypot(p.x-x,p.z-z)>3){goal(b,x,z,true);return true;}
 if(plants.length<400&&!overlapAt(x,z,.45)&&!wallAt(x,z,.5))addPlant(Math.random()<.55?'flower':'tree',x,z);
 return true;
}
// spēles sākumā: tirgotāji, savvaļas suņi, saimnieki, botiem burvestības un sēklas
const _spawnBots=spawnBots;spawnBots=function(){
 _spawnBots();
 for(const p of pets){scene.remove(p.g);freeObj(p.g);}pets.length=0;clearDoghouses();resetPrices();for(const c of [...chickens])removeChicken(c);for(const p of [...plants])removePlant(p);
 for(const d of [...drops]){scene.remove(d.m);freeObj(d.m);}drops.length=0;
 spawnTraders(true);PT.coins=0;
 for(let i=0;i<9;i++){const [x,z]=roadPoint(0,0,1e9);spawnPet('dog',x+(Math.random()-.5)*6,z+(Math.random()-.5)*6,null);}
 // ~10% saimnieki: veido saimniecību, nekaro, neseko; ja uzbrūk - aizstāvas
 let fN=0;const need=Math.max(1,Math.round(humans.length*.1));
 for(const T of teams.filter(x=>!x.isPlayer&&!x.friendly&&!x.calm&&!x.pal&&!x.traderT).sort((a,b)=>a.members.length-b.members.length)){if(fN>=need)break;if(fN+T.members.length>need)continue;
  T.farm=true;T.calm=true;T.noOffer=true;fN+=T.members.length;T.base=farmSpot();T.inner=0;T.blocks=60;makePlan(T);
  for(const m of T.members){m.I.has.grow=true;m.I.ammo.grow=20;m.I.has.flow=true;m.I.ammo.flow=20;m.role='build';relabel(m);}
  for(const k of ['chicken','chicken','chicken','pig','cow']){const c=spawnChicken(T.base.x+(Math.random()-.5)*4,T.base.z+(Math.random()-.5)*4,null,k);c.home=[T.base.x,T.base.z];}
  const fm=T.members[0];placeDoghouse(Math.round(T.base.x)+1,Math.round(T.base.z)-1,fm);spawnPet('dog',T.base.x,T.base.z,fm);}
 for(const b of humans){if(b.trader||b.team.farm)continue;const q=Math.random();if(q<.15){b.I.has.poly=true;b.I.ammo.poly=2;}else if(q<.3){b.I.has.grow=true;b.I.ammo.grow=5;}}
 // pilsētā izmētātas dažas monētas sākumam
 for(let i=0;i<14;i++){const [x,z]=roadPoint(0,0,1e9);dropCoins(x+(Math.random()-.5)*3,z+(Math.random()-.5)*3,5+Math.floor(Math.random()*6));}
};
const _relabel=relabel;relabel=function(b){_relabel(b);if(b.team.farm){delLabel(b.lab);b.lab=mkLabel('🌻 '+b.name,b.team.color);}else if(b.trader){delLabel(b.lab);b.lab=mkLabel('🛒 '+b.name,b.team.color);}};
// boti: pieradina suņus, pārvērš monstrus vistās, stāda kokus ap savu nocietinājumu
function botSpells(dt){
 botSpT-=dt;if(botSpT>0)return;botSpT=1;
 for(const b of humans){if(b.dead||b.inside)continue;const p=b.g.position;
  if(b.I.ammo.poly>0&&b.tg&&b.tg.m&&Math.random()<.5){const z=b.tg.m,u=z.userData;if(!u.dead&&u.kind!=='c'&&u.kind!=='zw'&&Math.hypot(z.position.x-p.x,z.position.z-p.z)<14)castSpell('poly',p.x,p.z,Math.atan2(-(z.position.x-p.x),-(z.position.z-p.z)),b.I,b.team,b);}
  if(!b.team.farm&&b.I.ammo.grow>0&&b.team.base&&hour>8&&hour<18&&Math.random()<.08){const s=(b.team.size||2)+2+Math.random()*2,a=Math.random()*6.283,x=Math.round(b.team.base.x+Math.cos(a)*s),z=Math.round(b.team.base.z+Math.sin(a)*s);if(!overlapAt(x,z,.45)&&!wallAt(x,z,.5)){addPlant('tree',x,z);b.I.ammo.grow--;if(!b.I.ammo.grow)b.I.has.grow=false;}}
  if(!b.tg&&!b.trader&&Math.random()<.3)for(const d of pets)if(!d.owner&&d.kind==='dog'&&Math.hypot(d.g.position.x-p.x,d.g.position.z-p.z)<6&&!pets.some(q=>q.owner===b)){d.owner=b;break;}
 }
}
const _updateFx2=updateFx;updateFx=function(dt){_updateFx2(dt);if(NET.role!=='guest'){if(active||NET.guests.size){updatePets(dt);botSpells(dt);}}else guestPets(dt);};
// ---------- kopīgā spēle ----------
const _guestAct=guestAct;guestAct=function(G){
 if(!G.dead){const o=nearPetShop(G.pos.x,G.pos.z);if(o){o.p.owner=G;netTo(G,{t:'msg',s:t('tamed')});return;}
  const st=stallNear(G.pos.x,G.pos.z);if(st){netTo(G,{t:'shop',kind:st.kind});return;}
  for(const b of humans)if(b.trader&&!b.inside&&!PT.enemies.has(b.team)&&Math.hypot(b.g.position.x-G.pos.x,b.g.position.z-G.pos.z)<2.6){netTo(G,{t:'shop',kind:b.trader.kind});return;}}
 _guestAct(G);
};
const _netHostMsg=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='buy'){netTo(G,{t:'msg',s:buy(d.k,G,d.kind)});netMe(G);return;}
 if(d&&G.ready&&d.t==='cast'&&!G.dead){if(!castSpell(d.k,G.pos.x,G.pos.z,+d.a||0,G.I,PT,G))netTo(G,{t:'msg',s:t(d.k==='poly'?'notarget':'noplace'),d:1});netMe(G);return;}
 _netHostMsg(G,d);
};
const _netHostFrame=netHostFrame;netHostFrame=function(dt){
 for(const G of NET.guests.values())if(G.ready&&!G.dead&&G.y<1.5)for(const d of [...drops])if(d.kind&&Math.hypot(d.x-G.pos.x,d.z-G.pos.z)<1.5){const c0=PT.coins||0;takeDrop(d,{I:G.I,team:PT,pos:G.pos,hp:G.hp});if(d.kind==='apple')G.hp=Math.min(100,G.hp+15);netTo(G,{t:'msg',s:d.kind==='coin'?'+'+((PT.coins||0)-c0)+' 🪙':'🍎 +15',d:1.2});netMe(G);}
 _netHostFrame(dt);
};
const _netWelcome=netWelcome;netWelcome=function(G){_netWelcome(G);netTo(G,{t:'pl',P:plants.map(p=>[p.id,p.k,r2(p.x),r2(p.z),r2(p.born)]),DH:doghouses.map(d=>[d.x,d.z])});};
const netPets=new Map(),netCk=new Map(),netDr=new Map();
const _netGuestMsg=netGuestMsg;netGuestMsg=function(d){
 if(d&&d.t==='wel'){_netGuestMsg(d);for(const M of [netPets,netCk,netDr]){for(const o of M.values()){scene.remove(o.g);freeObj(o.g);}M.clear();}for(const p of [...plants])removePlant(p);if(!traders.length)spawnTraders(false);return;}
 if(d&&d.t==='pe'){PT.coins=d.co;if(d.pr)Object.assign(prices,d.pr);
  for(const [id,k,x,z,ry] of d.E){let o=netPets.get(id);if(!o){o={g:k?bearMesh():dogMesh()};o.g.position.set(x,0,z);netPets.set(id,o);}o.tx=x;o.tz=z;o.ry=ry;o.seen=gtime;}
  for(const [id,x,z,ki] of d.C){let o=netCk.get(id);if(!o){o={g:liveMesh(LIVEK[ki||0])};o.g.position.set(x,0,z);netCk.set(id,o);}o.tx=x;o.tz=z;o.seen=gtime;}
  for(const [id,k,x,z] of d.D){let o=netDr.get(id);if(!o){const g=k==='coin'?coinMesh():(()=>{const q=new THREE.Group();q.add(cube(.25,.25,.25,0xd32f2f,.6));return q;})();g.position.set(x,.4,z);scene.add(g);o={g,coin:1};netDr.set(id,o);}o.tx=x;o.tz=z;o.seen=gtime;}
  return;}
 if(d&&d.t==='pl'){for(const [id,k,x,z,b] of d.P)if(!plants.some(p=>p.id===id))addPlant(k,x,z,id,b);if(d.DH)for(const [x,z] of d.DH)placeDoghouse(x,z,null);return;}
 if(d&&d.t==='shop'){renderShop(d.kind);return;}
 _netGuestMsg(d);
};
function netExtraEv2(e){
 if(e.e==='plant'){if(!plants.some(p=>p.id===e.id))addPlant(e.k,e.x,e.z,e.id,e.b);}
 else if(e.e==='dh')placeDoghouse(e.x,e.z,null);
 else if(e.e==='ck')explosionFx(e.x,.8,e.z,1.2,0xce93d8);
 else if(e.e==='bark'){if(Math.hypot(e.x-player.position.x,e.z-player.position.z)<35)woof();}
}
function guestPets(dt){const k=Math.min(1,dt*10);shopAutoClose();
 for(const M of [netPets,netCk,netDr])for(const [id,o] of M){
  if(gtime-o.seen>1.5){M.delete(id);if(M!==netDr)debris(o.g.position.x,.5,o.g.position.z,M===netCk?0xffffff:0x8d6e63,4);scene.remove(o.g);freeObj(o.g);continue;}
  const g=o.g,ox=g.position.x,oz=g.position.z;g.position.x+=(o.tx-ox)*k;g.position.z+=(o.tz-oz)*k;
  if(M===netDr){g.rotation.y+=dt*2;continue;}
  if(o.ry!==undefined)g.rotation.y=lerpA(g.rotation.y,o.ry,k);else if(Math.hypot(g.position.x-ox,g.position.z-oz)>.001)g.rotation.y=Math.atan2(-(g.position.x-ox),-(g.position.z-oz));
  const mv=Math.hypot(g.position.x-ox,g.position.z-oz)>.002,sw=mv?Math.sin(clock.elapsedTime*14+id)*.6:0;g.userData.legs.forEach((l,j)=>l.rotation.x=j%2?sw:-sw);}
 if(!traders.length&&active)spawnTraders(false);
}
// monētas un āboli griežas zemē
const _updateItems=updateItems;updateItems=function(dt){_updateItems(dt);for(const d of drops)if(d.kind)d.m.rotation.y+=dt*2;shopAutoClose();};
// tirgotāja logs aizveras, kad aizej prom
function shopAutoClose(){const el=$('shop');if(el.style.display!=='block')return;const k=el.dataset.kind,tr=traders.find(x=>x.kind===k);if(!tr||Math.hypot(tr.sx-player.position.x,tr.sz-player.position.z)>8)el.style.display='none';}

// ---------- saimniecības: vieta ārpus pilsētas pie meža; sākumā maza ar žogu (1 kluča), lai zombiji netiek pie lopiem ----------
function farmSpot(){for(let k=0;k<40;k++){const side=Math.floor(Math.random()*4),v=(Math.random()*2-1)*120,d=CITY+7+Math.random()*10,x=Math.round(side===0?d:side===1?-d:v),z=Math.round(side===2?d:side===3?-d:v);
 if(TRADER_DEF.some(q=>Math.hypot(q[1]-x,q[2]-z)<30))continue;if(teams.some(T=>T.farm&&T.base&&Math.hypot(T.base.x-x,T.base.z-z)<40))continue;return{x,z};}return{x:CITY+10,z:0};}
const _makePlan=makePlan;makePlan=function(Tm){
 if(!Tm.farm)return _makePlan(Tm);
 const s=3+Math.min(2,day-1),bx=Math.round(Tm.base.x),bz=Math.round(Tm.base.z);Tm.size=s;Tm.inner=Tm.inner?Math.min(Tm.inner,s):s;Tm.plan=[];
 for(let dx=-s;dx<=s;dx++)for(let dz=-s;dz<=s;dz++){if(Math.max(Math.abs(dx),Math.abs(dz))!==s)continue;const x=bx+dx,z=bz+dz;if(colTop(x,z)>0)continue;Tm.plan.push({x,z,l:0,door:dx===0&&dz===s});}
};
// vilkači medī dzīvniekus: apēdot vistu vai suni, atgūst dzīvību
function nearestAnimal(p,r){let best=null,bd=r+9;for(const c of chickens){const big=c.kind==='cow'||c.kind==='pig',d=Math.hypot(c.g.position.x-p.x,c.g.position.z-p.z),dd=big?d-9:d;if(dd<bd&&d<(big?r+9:r)){bd=dd;best={a:c,ck:true,d,big};}}
 for(const q of pets){if(q.kind!=='dog')continue;const d=Math.hypot(q.g.position.x-p.x,q.g.position.z-p.z);if(d<bd){bd=d;best={a:q,ck:false,d};}}return best;}
const _updateWolf=updateWolf;updateWolf=function(z,u,dt){
 if(NET.role!=='guest'&&!(u.heal>0)){const an=nearestAnimal(z.position,16),td=u.tg&&okH(u.tg)?Math.hypot(u.tg.p.x-z.position.x,u.tg.p.z-z.position.z):1e9;
  if(an&&an.d+5<td){const ap=an.a.g.position;stepTo(z.position,ap.x,ap.z,u.speed*1.4,dt,.4,null,u,1.05);z.rotation.y=Math.atan2(-(ap.x-z.position.x),-(ap.z-z.position.z));
   const sw=Math.sin(clock.elapsedTime*12+u.phase)*.6;u.legs[0].rotation.x=sw;u.legs[1].rotation.x=-sw;z.position.y=groundAt(z.position.x,z.position.z,1.15,.4);
   if(an.d<1.4){if(an.ck)removeChicken(an.a);else killPet(an.a);u.hp=Math.min(u.max,u.hp+(an.big?100:60));sfxAt('roar',z.position.x,z.position.z,40);if(Math.hypot(z.position.x-player.position.x,z.position.z-player.position.z)<40)say(t('weat'),1.5);}
   return;}}
 _updateWolf(z,u,dt);
};
