// 25_liela_nakts_maja.js - Lielā nakts ik 5. dienu (pilnmēness, divreiz vairāk monstru, Mēness milzis, kuru var uzvarēt tikai kopā) un savas mājas uzlabojumi
Object.assign(T.lv,{big19:'🌕 Šonakt ir pilnmēness! Būs divreiz vairāk monstru un Mēness milzis. Sagatavojieties kopā!',boss:'👹 Mēness milzis ir pamodies! Viņu var uzvarēt tikai kopā.',bossk:'👑 Mēness milzis uzvarēts! +150 🪙',
 hup:'🤚 uzlabot',hupt:'Mājas uzlabojumi',u_f:'🧱 Žogs ap pagalmu ar vārtiem',u_fd:'2 kluču augsts žogs, vārti atveras tikai tavējiem',u_l:'💡 Laterna',u_ld:'naktī pie mājas zombiji neizlien no zemes',
 u_s:'🏠 Otrais stāvs',u_sd:'atdzimstot mājā saņem 50 bruņas',u_b:'📦 Šķūnis',u_bd:'tavu dzīvnieku raža pagalmā sakrājas šķūnī',barn:'Paņemt ražu no šķūņa',barn0:'Šķūnis ir tukšs',done:'Ir'});
Object.assign(T.en,{big19:'🌕 Full moon tonight! Twice as many monsters and the Moon giant. Get ready together!',boss:'👹 The Moon giant has woken up! Only together can you defeat it.',bossk:'👑 The Moon giant is defeated! +150 🪙',
 hup:'🤚 upgrade',hupt:'House upgrades',u_f:'🧱 Yard fence with a gate',u_fd:'2 blocks high, the gate opens only for your team',u_l:'💡 Lantern',u_ld:'at night zombies do not rise near the house',
 u_s:'🏠 Second floor',u_sd:'you get 50 armour when you respawn at home',u_b:'📦 Barn',u_bd:'produce of your animals in the yard is collected in the barn',barn:'Take produce from the barn',barn0:'The barn is empty',done:'Done'});
// ---------- lielā nakts: 5., 10., 15. ... dienas nakts ----------
const bigNight=()=>day%5===0&&(hour>=19||hour<7);
let big2=0,bigS=0,bz2T=0,bs2T=0,moon=null;
const bigsay=bcastMsgOf((k,d)=>say(t(k),d||5));
function spawnBoss(){const m=zwMesh();monsterData(m,'zw');const u=m.userData,n=1+[...NET.guests.values()].filter(G=>G.ready).length;
 u.boss=true;u.hp=u.max=1500+900*(n-1)+150*PT.members.length;u.speed=1.5;u.dmg=35;u.rate=1.4;u.reach=3.3;u.sc=2.9;u.bh=7;u.sum=12;m.scale.setScalar(2.9);
 m.traverse(o=>{if(o.isMesh){o.material.color.lerp(new THREE.Color(0x4a148c),.45);o.material.emissive=new THREE.Color(0x220011);}});delBar(u.bar);u.bar=mkBar(3,0xff1744);
 // parādās pie kāda no spēlētājiem
 const ps=[...(active?[player.position]:[]),...[...NET.guests.values()].filter(G=>G.ready&&!G.dead).map(G=>G.pos)],o=ps[Math.floor(Math.random()*ps.length)]||player.position;let c=[o.x+28,o.z];
 for(let k=0;k<16;k++){const a=Math.random()*6.283,r=25+Math.random()*12,x=o.x+Math.cos(a)*r,z=o.z+Math.sin(a)*r;if(Math.abs(x)<EDGE-6&&Math.abs(z)<EDGE-6&&!wallAt(x,z,.5)&&!overlapAt(x,z,1.5)){c=[x,z];break;}}
 m.position.set(c[0],-6,c[1]);u.rise=3;sfx('roar');bigsay('boss',6);}
function bossLook(z){const u=z.userData;if(u.bigL)return;u.bigL=true;u.sc=2.9;u.bh=7;z.scale.setScalar(2.9);z.traverse(o=>{if(o.isMesh){o.material.color.lerp(new THREE.Color(0x4a148c),.45);o.material.emissive=new THREE.Color(0x220011);}});delBar(u.bar);u.bar=mkBar(3,0xff1744);}
const _onHour8=onHour;onHour=function(h){_onHour8(h);if(NET.role==='guest'||day%5!==0)return;
 if(h===19){bigsay('big19',6);sfx('bell');}else if(h===22){big2=0;bigS=0;bz2T=2;bs2T=4;}else if(h===23)spawnBoss();};
function bigTick(dt){
 if(bigNight()&&(hour>=22||hour<5)){const alive=zombies.filter(z=>!z.userData.dead&&z.userData.kind!=='f').length;
  bz2T-=dt;if(bz2T<=0&&big2<30&&alive<55){bz2T=3.2;spawnZombie(Math.random()<.3);big2++;}
  bs2T-=dt;if(bs2T<=0&&bigS<10&&alive<55){bs2T=8;spawnSkeleton();bigS++;}}
 for(const z of zombies){const u=z.userData;if(!u.boss||u.dead||u.rise>0||u.sink>0)continue;u.sum-=dt;
  if(u.sum<=0){u.sum=25;for(let i=0;i<2;i++){const n0=zombies.length;spawnSkeleton();for(let j=n0;j<zombies.length;j++){const s=zombies[j];s.position.x=z.position.x+(Math.random()-.5)*8;s.position.z=z.position.z+(Math.random()-.5)*8;}}sfxAt('roar',z.position.x,z.position.z,60);}}
}
const _killZombie8=killZombie;killZombie=function(z,pl,boom){const u=z.userData,was=!u.dead;_killZombie8(z,pl,boom);if(!was||!u.boss||NET.role==='guest')return;dropCoins(z.position.x,z.position.z,150);badge('boss');bigsay('bossk',5);fanfare();};
const _dawn8=dawn;dawn=function(){const was=day%5===0;if(NET.role!=='guest')for(const z of zombies)if(z.userData.boss&&!z.userData.dead)z.userData.sink=3;_dawn8();
 if(was&&NET.role!=='guest'&&(active||[...NET.guests.values()].some(G=>G.ready&&!G.dead)))badge('moon');};
function moonTick(){const on=bigNight();if(on&&!moon){moon=new THREE.Mesh(new THREE.CircleGeometry(9,32),new THREE.MeshBasicMaterial({color:0xfff3c4,fog:false}));scene.add(moon);}
 if(moon){moon.visible=on;if(on){moon.position.set(player.position.x-90,85,player.position.z-150);moon.lookAt(player.position.x,1,player.position.z);}}}
// ---------- mājas uzlabojumi ----------
const UPS=[['f',40],['l',15],['s',60],['b',30]];
for(const H of HOUSES){H.up={f:0,l:0,s:0,b:0};H.bn={};}
const myHouse=()=>HOUSES.find(H=>NET.role==='guest'?H.on==='★'&&!H.free:H.T===PT);
function houseUpVis(H){if(H.ug){scene.remove(H.ug);freeObj(H.ug);H.ug=null;}if(H.ugOb){remOb(H.ugOb);H.ugOb=null;}const U=H.up;if(!U.s&&!U.l&&!U.b)return;
 const g=new THREE.Group(),col=[0xc9b28f,0xb0bec5,0xd7a86e,0xa5c8a0,0xe0c9a6][H.i%5],x=H.x,z=H.z;
 if(U.s){const f2=cube(6,2.4,5.5,col,.95);f2.position.set(x,4,z);g.add(f2);for(const [px,pz] of [[-1.6,2.8],[1.6,2.8],[-1.6,-2.8],[1.6,-2.8]]){const w=cube(.9,.7,.06,0x9fd3ff,.2);w.material.emissive=new THREE.Color(0x203040);w.position.set(x+px,4.1,z+pz);g.add(w);}
  const r=new THREE.Mesh(new THREE.ConeGeometry(4.7,1.9,4),mat(0x5d4037,.9));r.position.set(x,6.15,z);r.rotation.y=Math.PI/4;r.scale.z=.95;r.castShadow=true;g.add(r);}
 if(U.l){const p=cube(.14,3,.14,0x37474f,.6);p.position.set(x+3.6,1.5,z+3.3);g.add(p);const bl=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),new THREE.MeshBasicMaterial({color:0xffe082}));bl.position.set(x+3.6,3.1,z+3.3);g.add(bl);
  const pool=new THREE.Mesh(new THREE.CircleGeometry(5,24),new THREE.MeshBasicMaterial({color:0xffd54f,transparent:true,opacity:.16,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.set(x+3.6,.04,z+3.3);g.add(pool);g.userData.pool=pool;}
 if(U.b){const dx=Math.sign(H.yx-x),dz=Math.sign(H.yz-z),sx=x+dx*5+(dz?4.5:0),sz=z+dz*5+(dx?4.5:0);const s=cube(2.4,1.8,2,0x8d6e63,1);s.position.set(sx,.9,sz);g.add(s);
  const rf=new THREE.Mesh(new THREE.ConeGeometry(1.9,1,4),mat(0xb71c1c,.8));rf.position.set(sx,2.3,sz);rf.rotation.y=Math.PI/4;g.add(rf);const dr=cube(.9,1.3,.05,0x4e342e,1);dr.position.set(sx,.65,sz+1.02);g.add(dr);
  H.ugOb={x:sx,z:sz,hx:1.2,hz:1};addOb(H.ugOb);}
 scene.add(g);H.ug=g;}
function sendUp(H){houseUpVis(H);if(NET.role==='host')netQ.push({e:'hu',h:[H.i,H.up,H.bn]});renderHouse();}
function buildFence(H){const s=5,bx=Math.round(H.yx),bz=Math.round(H.yz);noQ=true;
 for(let dx=-s;dx<=s;dx++)for(let dz=-s;dz<=s;dz++){if(Math.max(Math.abs(dx),Math.abs(dz))!==s)continue;const x=bx+dx,z=bz+dz,door=dx===0&&dz===s;
  if(colTop(x,z)===0&&canPlace(x,z,door?2:1))placeBlock(x,z,PT,door,false);if(!door&&colTop(x,z)===1)placeBlock(x,z,PT,false,false);}noQ=false;}
// pirkums: who = 'P' vai draugs G
function houseBuy(k,who){const H=myHouse(),it=UPS.find(u=>u[0]===k);if(!H||!it||H.up[k])return '';if((PT.coins||0)<it[1])return t('nocoins');
 PT.coins-=it[1];H.up[k]=1;if(k==='f')buildFence(H);sendUp(H);qEv('house');sfx('build');return t('bought')+' '+t('u_'+k);}
function barnTake(who){const H=myHouse();if(!H)return '';const I=who==='P'?inv:who.I;I.prod=I.prod||{};let n=0;for(const k in H.bn){I.prod[k]=(I.prod[k]||0)+H.bn[k];n+=H.bn[k];}H.bn={};sendUp(H);return n?'📦 +'+n:t('barn0');}
function barnTick(){for(const H of HOUSES){if(!H.up.b||!H.T)continue;let ch=false;for(const d of [...drops])if(d.kind&&d.kind!=='coin'&&Math.hypot(d.x-H.yx,d.z-H.yz)<11){H.bn[d.kind]=(H.bn[d.kind]||0)+1;scene.remove(d.m);freeObj(d.m);drops.splice(drops.indexOf(d),1);ch=true;}if(ch)sendUp(H);}}
let hupT=0;
// laterna: naktī monstri neizlien no zemes 28 m ap māju
const _spawnAround8=spawnAround;spawnAround=function(r0,r1){let c=_spawnAround8(r0,r1);for(let k=0;k<5;k++){if(!HOUSES.some(H=>H.up.l&&H.T&&Math.hypot(H.x-c[0],H.z-c[1])<28))break;c=_spawnAround8(r0,r1);}return c;};
// uzlabojumu logs
{const p=document.createElement('div');p.id='hpanel';p.className='panel';document.body.appendChild(p);}
function renderHouse(){const el=$('hpanel');if(!el||el.style.display!=='block')return;const H=myHouse();if(!H){el.style.display='none';return;}
 let h='<button class="corner" data-x="1" style="float:right;margin:0">✖</button><b>🏠 '+t('hupt')+'</b> · 🪙 '+((PT&&PT.coins)||0);
 for(const [k,p] of UPS)h+='<div class="row"><span>'+t('u_'+k)+'<br><small>'+t('u_'+k+'d')+'</small></span>'+(H.up[k]?'<b>✅ '+t('done')+'</b>':'<button class="corner" data-k="'+k+'"'+((PT.coins||0)<p?' style="opacity:.45"':'')+'>'+p+' 🪙</button>')+'</div>';
 if(H.up.b){const s=Object.entries(H.bn).map(([k,n])=>PRODIC[k]+' '+n).join(' ');h+='<div class="row"><span>📦 '+(s||t('barn0'))+'</span><button class="corner" data-b="1">'+t('barn')+'</button></div>';}
 el.innerHTML=h;el.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();if(b.dataset.x){el.style.display='none';return;}
  if(b.dataset.b){if(NET.role==='guest')netSend({t:'barn'});else{say(barnTake('P'),1.5);renderInv();}return;}
  if(NET.role==='guest'){netSend({t:'hbuy',k:b.dataset.k});return;}say(houseBuy(b.dataset.k,'P'),2);renderHouse();renderInv();});}
function openHouse(){const el=$('hpanel');el.style.display='block';$('inv').style.display='none';$('shop').style.display='none';renderHouse();}
const _updateHint8=updateHint;updateHint=function(){const o=nearInter();if(o&&o.type==='house'&&o.H===myHouse()){const h=$('hint');h.textContent=(TOUCH?'':'E / ')+t('hown')+' · '+t('hup');h.style.display='block';setAct('🏠');return;}_updateHint8();};
const _interact8=interact;interact=function(){if(active){const o=nearInter();if(o&&o.type==='house'&&o.H===myHouse()){openHouse();return;}}_interact8();};
// logs aizveras, kad izej no mājas
function hpanelClose(){const el=$('hpanel');if(el.style.display==='block'){const H=myHouse();if(!H||Math.hypot(H.x-player.position.x,H.z-player.position.z)>9)el.style.display='none';}}
// atdzimst mājā ar bruņām, ja ir otrais stāvs
const _resume8=resume;resume=function(){_resume8();const H=myHouse();if(H&&H.up.s){inv.armor=Math.max(inv.armor,50);updateHealth();}};
const _netHostFrame8=netHostFrame;netHostFrame=function(dt){const was=new Map();for(const G of NET.guests.values())was.set(G,G.dead);_netHostFrame8(dt);const H=myHouse();
 if(H)for(const [G,d] of was)if(d&&!G.dead){G.pos.set(H.x,0,H.z+.3);netTo(G,{t:'tp',x:H.x,z:H.z+.3});if(H.up.s)G.I.armor=Math.max(G.I.armor,50);netMe(G);}};
// ---------- kopīgā spēle ----------
const _netHostMsg8=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='hbuy'){netTo(G,{t:'msg',s:houseBuy(d.k,G),d:2});netMe(G);return;}
 if(d&&G.ready&&d.t==='barn'){netTo(G,{t:'msg',s:barnTake(G),d:1.5});netMe(G);return;}
 _netHostMsg8(G,d);};
function applyHu([i,u,bn]){const H=HOUSES[i];if(!H)return;H.up=u;H.bn=bn||{};houseUpVis(H);renderHouse();}
const _netWelcome8=netWelcome;netWelcome=function(G){_netWelcome8(G);netTo(G,{t:'hus',L:HOUSES.filter(H=>H.up.f||H.up.l||H.up.s||H.up.b).map(H=>[H.i,H.up,H.bn])});};
const _netGuestMsg8=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='hus'){for(const h of d.L)applyHu(h);return;}if(d&&d.t==='wel')for(const H of HOUSES){H.up={f:0,l:0,s:0,b:0};H.bn={};houseUpVis(H);}_netGuestMsg8(d);};
const _netExtraEv28=netExtraEv2;netExtraEv2=function(e){if(e.e==='hu'){applyHu(e.h);return;}_netExtraEv28(e);};
const _start8=start;start=function(){for(const H of HOUSES){H.up={f:0,l:0,s:0,b:0};H.bn={};houseUpVis(H);}_start8();};
const _updateFx8=updateFx;updateFx=function(dt){_updateFx8(dt);const host=NET.role!=='guest'&&(active||NET.guests.size);if(host)bigTick(dt);
 hupT-=dt;if(hupT<=0){hupT=1;if(host)barnTick();moonTick();hpanelClose();const nt=hour>=19||hour<7;for(const H of HOUSES)if(H.ug&&H.ug.userData.pool)H.ug.userData.pool.visible=nt;}
 if(NET.role==='guest')for(const o of netMon.values())if(o.z.userData.max>=1500)bossLook(o.z);};
