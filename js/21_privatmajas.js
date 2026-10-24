// 21_privatmajas.js - Privātmājas pilsētas malā pie meža: tajās dzīvo saimnieki, brīvu māju var apdzīvot; saimniecības apvienojas; bandas mēģina ieņemt saimniecības
Object.assign(T.lv,{hfree:'🏠 Apdzīvot šo māju (tava bāze)',hown:'🏠 Šī ir tava māja',hbusy:'🏠 Šeit dzīvo {n}',hclaim:'🏠 Tagad šī ir tava māja! Šeit tu atdzimsti, un pagalmā ir tava bāze.',
 fmerge:'🌻 Saimniecības apvienojas: {a} + {b}',settle:'🏠 {n} apdzīvo privātmāju pie meža',raid:'⚔️ Banda {a} nāk ieņemt {b} saimniecību!',raidme:'⚔️ Banda {a} nāk ieņemt tavu māju! Aizstāvi to.',
 raidok:'🌻 {b} nosargāja savu saimniecību!',took:'⚔️ {a} ieņēma {b} saimniecību',tookme:'⚔️ {a} ieņēma tavu māju! Tu to vari atgūt, ja viņu vairs nav.'});
Object.assign(T.en,{hfree:'🏠 Move into this house (your base)',hown:'🏠 This is your house',hbusy:'🏠 {n} lives here',hclaim:'🏠 This is your house now! You respawn here and your base is in the yard.',
 fmerge:'🌻 Farms join together: {a} + {b}',settle:'🏠 {n} moves into a house by the forest',raid:'⚔️ Gang {a} is coming to take the farm of {b}!',raidme:'⚔️ Gang {a} is coming to take your house! Defend it.',
 raidok:'🌻 {b} defended their farm!',took:'⚔️ {a} took the farm of {b}',tookme:'⚔️ {a} took your house! You can win it back when they are gone.'});
// ---------- mājas vietas: pilsētas malējā rindā, pagalms uz meža pusi (visiem spēlētājiem vienādas) ----------
const HOUSES=(()=>{const Q=[],a=[],E=152;for(let c=-4;c<4;c++)Q.push(c*40+8,c*40+32);
 for(const x of Q)for(const z of Q){if(Math.abs(x)!==E&&Math.abs(z)!==E)continue;const ox=Math.abs(x)===E,sx=ox?Math.sign(x):0,sz=ox?0:Math.sign(z),yx=x+sx*12,yz=z+sz*12;
  if(TRADER_DEF.some(d=>Math.hypot(d[1]-yx,d[2]-yz)<22||Math.hypot(d[3]-x,d[4]-z)<16))continue;a.push({x,z,yx,yz,ang:Math.atan2(z,x)});}
 a.sort((p,q)=>p.ang-q.ang);return a.filter((h,i)=>i%5<2).map((h,i)=>Object.assign(h,{i,T:null,col:null,free:true,on:''}));})();
const HMAP=new Map(HOUSES.map(h=>[h.x+','+h.z,h]));
function houseAtQ(x,z){return HMAP.get(x+','+z);}
function houseIn(px,pz){return HOUSES.find(h=>Math.abs(px-h.x)<2.8&&Math.abs(pz-h.z)<2.5);}
function ownerAlive(H){return !!H.T&&(H.T===PT||(H.T.members.length>0&&teams.includes(H.T)));}
function setOwner(H,Tm){H.T=Tm||null;H.col=Tm?Tm.color:null;H.free=!ownerAlive(H);H.on=Tm?(Tm===PT?'★':leader(Tm)):'';if(Tm){Tm.houses=Tm.houses||[];if(!Tm.houses.includes(H))Tm.houses.push(H);}paintFlag(H);
 if(NET.role==='host')netQ.push({e:'ho',h:[H.i,H.col??-1,H.free?1:0,H.on]});}
function paintFlag(H){if(H.flag)H.flag.material.color.setHex(H.free||H.col==null?0x9e9e9e:H.col);}
// privātmāja: lielāka par būdiņu, durvis +z pusē, logi, gulta, atvilknes; karogs uz jumta rāda saimnieka krāsu
function makeHouse(ch,H,R,key){
 const g=ch.group,x=H.x,z=H.z,w=6,d=5.5,h=2.8,th=.25,col=[0xc9b28f,0xb0bec5,0xd7a86e,0xa5c8a0,0xe0c9a6][H.i%5];
 const wall=(sx,sz,px,pz)=>{const m=cube(sx,h,sz,col,.95);m.position.set(x+px,h/2,z+pz);g.add(m);ch.obs.push({x:x+px,z:z+pz,hx:sx/2,hz:sz/2});};
 const sw=(w-1.4)/2;wall(w,th,0,-d/2);wall(th,d,-w/2,0);wall(th,d,w/2,0);wall(sw,th,-(w/2-sw/2),d/2);wall(sw,th,w/2-sw/2,d/2);
 for(const [px,pz,rx] of [[-w/2-.16,-.8,1],[w/2+.16,-.8,1],[-1.8,-d/2-.16,0],[1.8,-d/2-.16,0],[-2.1,d/2+.16,0],[2.1,d/2+.16,0]]){const wn=cube(rx?.06:.9,.7,rx?.9:.06,0x9fd3ff,.2);wn.material.emissive=new THREE.Color(0x203040);wn.position.set(x+px,1.6,z+pz);g.add(wn);}
 const roof=new THREE.Mesh(new THREE.ConeGeometry(4.7,1.9,4),mat(0x5d4037,.9));roof.position.set(x,h+.95,z);roof.rotation.y=Math.PI/4;roof.scale.z=.95;roof.castShadow=true;g.add(roof);
 const chim=cube(.5,1.2,.5,0x8d6e63,1);chim.position.set(x+1.5,h+1.3,z-1);g.add(chim);
 const pole=cube(.06,1.4,.06,0x424242,1);pole.position.set(x,h+2.4,z);g.add(pole);
 const fl=new THREE.Mesh(new THREE.BoxGeometry(.7,.42,.04),new THREE.MeshStandardMaterial({color:0x9e9e9e,roughness:.8}));fl.position.set(x+.37,h+2.88,z);fl.userData.dyn=true;g.add(fl);H.flag=fl;paintFlag(H);
 const bed=cube(1.1,.5,2,0x6d4c41,.9),bl=cube(1,.12,1.4,0x1e88e5,.8);bed.position.set(x+2.2,.25,z-1.5);bl.position.set(x+2.2,.56,z-1.2);g.add(bed,bl);ch.obs.push({x:x+2.2,z:z-1.5,hx:.55,hz:1});
 const tb=cube(1.2,.75,.8,0x8d6e63,.9);tb.position.set(x+.3,.38,z-1.4);g.add(tb);ch.obs.push({x:x+.3,z:z-1.4,hx:.6,hz:.4});
 const sh=cube(1.4,1.6,.4,0x7a5632,.9);sh.position.set(x-1.3,.8,z-d/2+.33);g.add(sh);ch.obs.push({x:x-1.3,z:z-d/2+.33,hx:.7,hz:.2});
 const piv=new THREE.Group();piv.position.set(x-.7,0,z+d/2);piv.userData.dyn=true;
 const dm=cube(1.4,2.2,.1,0x4e342e,.9);dm.position.set(.7,1.1,0);piv.add(dm);g.add(piv);
 const dob={x,z:z+d/2,hx:.7,hz:.12};ch.obs.push(dob);
 ch.inter.push({type:'door',id:ch.key+'d'+(ch.dn=(ch.dn||0)+1),x,z:z+d/2,r:2.2,open:false,piv,dob,dm,hp:100});
 const cont=o=>{o.id=key+'k'+(ch.cn++);o.ch=ch;if(o.mesh)o.mesh.userData.dyn=true;if(taken.has(o.id)){o.open=true;o.loot=[];if(o.mesh)o.mesh.position[o.ax||'x']+=o.sgn*.4;}ch.inter.push(o);};
 const body=cube(.5,.9,1.1,0x6e4a2a,.9);body.position.set(x-2.62,.45,z-.6);g.add(body);ch.obs.push({x:x-2.62,z:z-.6,hx:.25,hz:.55});
 const dr=cube(.06,.26,.9,0x9a7040,.7);dr.position.set(x-2.35,.62,z-.6);g.add(dr);
 cont({type:'drawer',x:x-1.9,z:z-.6,r:1.4,open:false,mesh:dr,sgn:1,loot:rollLoot(R,.55)});
 cont({type:'shelf',x:x-1.3,z:z-1.9,r:1.2,open:false,loot:rollLoot(R,.5)});
 return {h};
}
// ---------- saimniecība mājas pagalmā: dārzkopji 🌻 (vairāk augu) un lopkopji 🐄 (vairāk lopu) ----------
function farmHome(Tm){
 const free=HOUSES.filter(h=>h.free&&!h.T),mine=HOUSES.filter(h=>h.T&&h.T.farm);if(!free.length){const s=farmSpot();return s;}
 let H=free[Math.floor(Math.random()*free.length)];
 if(mine.length&&Math.random()<.6){let bd=1e9;for(const f of free)for(const m of mine){const d=Math.hypot(f.x-m.x,f.z-m.z);if(d<bd){bd=d;H=f;}}} // jaunas saimniecības bieži rodas blakus esošajām
 setOwner(H,Tm);return{x:H.yx,z:H.yz};
}
let farmKind=0;
function makeFarm(Tm,first){
 Tm.farm=true;Tm.calm=true;Tm.noOffer=true;Tm.ftype=farmKind++%2?'live':'garden';Tm.base=farmHome(Tm);Tm.inner=0;Tm.blocks=60;makePlan(Tm);
 for(const m of Tm.members){m.I.has.grow=true;m.I.ammo.grow=Tm.ftype==='garden'?30:12;m.I.has.flow=true;m.I.ammo.flow=Tm.ftype==='garden'?30:12;m.role='build';relabel(m);}
 const bx=Tm.base.x,bz=Tm.base.z;
 for(const k of Tm.ftype==='live'?['chicken','chicken','chicken','pig','pig','cow','cow']:['chicken','chicken','pig']){const c=spawnChicken(bx+(Math.random()-.5)*4,bz+(Math.random()-.5)*4,null,k);c.home=[bx,bz];}
 if(Tm.ftype==='garden'&&first)for(let i=0;i<6;i++){const a=i*1.05,x=Math.round(bx+Math.cos(a)*2),z=Math.round(bz+Math.sin(a)*2);if(!overlapAt(x,z,.45))addPlant(i%2?'tree':'flower',x,z,null,day*24+hour-(i%2?20:5));}
 const fm=Tm.members[0];placeDoghouse(Math.round(bx)+1,Math.round(bz)-1,fm);spawnPet('dog',bx,bz,fm);
}
// lielāka saimniecība = lielāks žogs
const _makePlan4=makePlan;makePlan=function(Tm){if(!Tm.farm||!Tm.base)return _makePlan4(Tm);const n=Tm.members.length,s=Math.min(6,3+Math.min(2,day-1)+(n>=3?1:0)+(n>=5?1:0)),bx=Math.round(Tm.base.x),bz=Math.round(Tm.base.z);
 Tm.size=s;Tm.inner=Tm.inner?Math.min(Tm.inner,s):s;Tm.plan=[];
 for(let dx=-s;dx<=s;dx++)for(let dz=-s;dz<=s;dz++){if(Math.max(Math.abs(dx),Math.abs(dz))!==s)continue;const x=bx+dx,z=bz+dz;if(colTop(x,z)>0)continue;Tm.plan.push({x,z,l:0,door:dx===0&&dz===s});}};
const _relabel4=relabel;relabel=function(b){_relabel4(b);if(b.team.farm&&b.team.ftype==='live'){delLabel(b.lab);b.lab=mkLabel('🐄 '+b.name,b.team.color);}};
// dārzkopji stāda biežāk un neiet tik bieži vākt ieročus
const _farmThink4=farmThink;farmThink=function(b){if(b.team.ftype==='garden'&&!(hour>=21||hour<7)&&!(b.team.plan.length&&b.team.blocks>0)&&Math.random()<.3){b.ft2=0;}return _farmThink4(b);};
// ---------- apvienošanās, apdzīvošana, uzbrukumi saimniecībām ----------
let raid=null,raidAt=0,hTick=0,mergeDay=0;
const fsay=bcastMsgOf((k,o,d)=>say(tf(k,o),d||3));
function farmMerge(){
 const F=teams.filter(x=>x.farm&&x.base&&x.members.length&&!x.traderT);
 for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){const A=F[i],B=F[j];if(A.enemies.has(B)||A.members.length+B.members.length>6)continue;
  if(Math.hypot(A.base.x-B.base.x,A.base.z-B.base.z)>45||Math.random()>.3)continue;
  const big=A.members.length>=B.members.length?A:B,sm=big===A?B:A,a=leader(big),bn=leader(sm);
  for(const c of chickens)if(c.home&&Math.hypot(c.home[0]-sm.base.x,c.home[1]-sm.base.z)<3)c.home=[big.base.x,big.base.z];
  for(const H of sm.houses||[])setOwner(H,big);big.blocks+=sm.blocks;if(sm.ftype!==big.ftype)big.ftype='live';
  mergeDay=day;mergeTeams(sm,big);big.members.forEach(m=>{m.role='build';relabel(m);});fsay('fmerge',{a,b:bn});return;}
}
function settleTick(){ // no rīta kāds mierīgais vai bezpajumtnieks apdzīvo brīvu māju un kļūst par saimnieku
 const c=teams.filter(x=>!x.isPlayer&&!x.friendly&&!x.pal&&!x.traderT&&x.members.length&&x.members.length<=3&&((x.calm&&!x.farm)||(x.farm&&!x.base)));
 if(!c.length||!HOUSES.some(h=>h.free&&!h.T)||Math.random()<.4)return;const Tm=c[Math.floor(Math.random()*c.length)];makeFarm(Tm,true);fsay('settle',{n:leader(Tm)});
}
function startRaid(){
 const G=teams.filter(x=>!x.isPlayer&&!x.farm&&!x.calm&&!x.friendly&&!x.traderT&&x.members.length>=2&&x.members.some(m=>GUNS.some(w=>m.I.has[w]&&m.I.ammo[w]>0)));
 const D=HOUSES.filter(h=>h.T&&!h.free&&(h.T===PT?active:h.T.farm));if(!G.length||!D.length)return;
 const mine=D.find(h=>h.T===PT),H=mine&&Math.random()<.35?mine:D.filter(h=>h.T!==PT)[Math.floor(Math.random()*D.length)]||D[0],A=G[Math.floor(Math.random()*G.length)];
 if(!H||H.T===A)return;raid={A,D:H.T,H,until:gtime+160,hold:0};war(A,H.T);
 if(H.T===PT)fsay('raidme',{a:leader(A)},4);else if(Math.hypot(H.x-player.position.x,H.z-player.position.z)<90)fsay('raid',{a:leader(A),b:leader(H.T)},3.5);
}
function raidTick(){
 const R=raid,H=R.H,aliveA=teams.includes(R.A)&&R.A.members.length>0,aliveD=R.D===PT||(teams.includes(R.D)&&R.D.members.length>0);
 if(!aliveA){if(aliveD)fsay('raidok',{b:R.D===PT?'★':leader(R.D)});raid=null;return;}
 if(gtime>R.until||hour>=20){raid=null;return;}
 const near=(ps,r)=>ps.some(p=>Math.hypot(p.x-H.yx,p.z-H.yz)<r);
 const ap=R.A.members.map(m=>m.g.position),dp=R.D===PT?[...(active?[player.position]:[]),...PT.members.map(m=>m.g.position),...[...NET.guests.values()].filter(G=>G.ready&&!G.dead).map(G=>G.pos)]:R.D.members.map(m=>m.g.position);
 if(near(ap,45)&&R.D!==PT)R.D.alarm={T:R.A,until:gtime+20}; // saimnieki redz uzbrucējus un iet viņiem pretī
 if(near(ap,8)&&(!aliveD||!near(dp,R.D===PT?22:14)))R.hold+=2;else R.hold=Math.max(0,R.hold-2);
 if(R.hold>=8){const a=leader(R.A),b=R.D===PT?'★':leader(R.D);setOwner(H,R.A);R.A.base={x:H.yx,z:H.yz};R.A.inner=0;makePlan(R.A);
  if(R.D===PT){if(PT.base&&Math.hypot(PT.base.x-H.yx,PT.base.z-H.yz)<3)PT.base=null;fsay('tookme',{a},4);}else{if(R.D.base&&Math.hypot(R.D.base.x-H.yx,R.D.base.z-H.yz)<3)R.D.base=null;R.D.houses=(R.D.houses||[]).filter(x=>x!==H);fsay('took',{a,b},3.5);}
  raid=null;}
}
function houseTick(dt){
 hTick-=dt;if(hTick>0)return;hTick=2;
 for(const H of HOUSES){const f=!ownerAlive(H);if(f!==H.free){H.free=f;paintFlag(H);if(NET.role==='host')netQ.push({e:'ho',h:[H.i,H.col??-1,f?1:0,H.on]});}}
 if(hour>=10&&hour<18&&mergeDay<day&&Math.random()<.15)farmMerge(); // ne vairāk kā viena apvienošanās dienā
 if(raid)raidTick();else if(hour>=9&&hour<16&&gtime>raidAt){raidAt=gtime+220+Math.random()*160;startRaid();}
}
const _onHour4=onHour;onHour=function(h){_onHour4(h);if(h===8&&NET.role!=='guest')settleTick();};
const _updateFx4=updateFx;updateFx=function(dt){_updateFx4(dt);if(NET.role!=='guest'&&(active||NET.guests.size))houseTick(dt);};
// uzbrucēji iet uz saimniecību, ja tuvumā nav ar ko cīnīties
const _botThink4=botThink;botThink=function(b){if(raid&&b.team===raid.A&&hour<20&&!nearestThreat(b)){const p=b.g.position,H=raid.H;b.tg=null;b.follow=false;if(Math.hypot(p.x-H.yx,p.z-H.yz)>3)goal(b,H.yx+(Math.random()-.5)*4,H.yz+(Math.random()-.5)*4,true);else b.gx=null;return;}_botThink4(b);};
// spēles sākumā visas mājas brīvas; saimnieki tās saņem (19_zveri_burvestibas.js)
const _spawnBots4=spawnBots;spawnBots=function(){raid=null;raidAt=gtime+120;farmKind=0;mergeDay=0;for(const H of HOUSES){H.T=null;H.col=null;H.free=true;H.on='';paintFlag(H);}_spawnBots4();};
// ---------- spēlētājs: apdzīvo brīvu māju (arī tādu, kuras iedzīvotāju vairs nav) ----------
function claimHouse(H){for(const o of HOUSES)if(o.T===PT&&o!==H)setOwner(o,null);setOwner(H,PT);PT.base={x:H.yx,z:H.yz};PT.inner=0;PT.plan=[];}
const _nearInter4=nearInter;nearInter=function(){const o=_nearInter4();if((!o||o.type==='burn'||(o.open&&(o.type==='drawer'||o.type==='shelf')))&&pY<1.5){const H=houseIn(player.position.x,player.position.z);if(H)return{type:'house',H};}return o;};
const _updateHint4=updateHint;updateHint=function(){const o=nearInter();if(o&&o.type==='house'){const h=$('hint'),H=o.H,mine=H.on==='★'&&!H.free;
 h.textContent=(TOUCH?'':'E / ')+(mine?t('hown'):H.free?t('hfree'):tf('hbusy',{n:H.on}));h.style.display='block';setAct(H.free&&!mine?'🏠':'');return;}_updateHint4();};
const _interact4=interact;interact=function(){if(active&&NET.role!=='guest'){const o=nearInter();if(o&&o.type==='house'){if(o.H.free){claimHouse(o.H);say(t('hclaim'),4);sfx('pick');}return;}}_interact4();};
const _guestAct4=guestAct;guestAct=function(G){if(!G.dead){const H=houseIn(G.pos.x,G.pos.z);if(H&&H.free){let other=false;for(const ch of chunks.values())for(const o of ch.inter)if(!o.open&&Math.hypot(o.x-G.pos.x,o.z-G.pos.z)<o.r)other=true;
 if(!other){claimHouse(H);netTo(G,{t:'msg',s:t('hclaim'),d:4});return;}}}_guestAct4(G);};
// ---------- kopīgā spēle: māju saimnieki un karogu krāsas ----------
function applyHo([i,c,f,n]){const H=HOUSES[i];if(!H)return;H.col=c<0?null:c;H.free=!!f;H.on=n||'';paintFlag(H);}
const _netWelcome4=netWelcome;netWelcome=function(G){_netWelcome4(G);netTo(G,{t:'ho',L:HOUSES.map(H=>[H.i,H.col??-1,H.free?1:0,H.on])});};
const _netGuestMsg4=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='ho'){for(const h of d.L)applyHo(h);return;}_netGuestMsg4(d);};
const _netExtraEv24=netExtraEv2;netExtraEv2=function(e){if(e.e==='ho'){applyHo(e.h);return;}_netExtraEv24(e);};
// atdzimst savā mājā, ja tur nav monstru
const _resume4=resume;resume=function(){_resume4();const H=HOUSES.find(h=>h.T===PT);if(!H)return;for(const z of zombies)if(!z.userData.dead&&Math.hypot(z.position.x-H.x,z.position.z-H.z)<15)return;player.position.set(H.x,0,H.z+.3);};
