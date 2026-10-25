// 28_helikopteri.js - Divi helikopteru laukumi ar 4 helikopteriem (Plēsoņa un Haizivs): ložmetējs, degviela, nosēšanās jebkur, boti lido un nosēžas savās bāzēs,
// helikopteri var nozagt; Javelin raķete (tēmē uz tehniku) un prettanku ierocis iznīcina tehniku no zemes
Object.assign(T.lv,{wjav:'Javelin',shop_jav:'🎯 Javelin (raķete pati tēmē uz tehniku)',shop_a_jav:'🎯 Javelin raķetes (+2)',shop_hbelt:'🔗 Ložmetēja lente helikopteram (+100)',shop_fuel:'⛽ Degvielas kanna (+40)',
 hbelt:'Ložmetēja lentes',fuel:'Degvielas kannas',hm_pred:'Plēsoņa: veikla, 400 lodes, radars rāda ienaidniekus kartē',hm_shark:'Haizivs: ātrāka un izturīgāka, spēcīgāks ložmetējs',
 heli_in:'🚁 {m} (⛽ {f} · 🔫 {a})',heli_fly:'🚁 ⛽ {f} · 🔫 {a} · ❤️ {h} · 🤚 nosēsties',heli_go:'🚁 Lido! ⬆ uz augšu, ⬇ uz leju (datorā Space un C), ⚔️ ložmetējs, 🤚 nosēsties. Helikopters paliek tur, kur nosēdies.',
 heli_nofuel:'⛽ Degviela beigusies! Helikopters nolaižas. Atrodi vai nopērc degvielas kannu.',heli_noammo:'🔫 Lodes beigušās. Atrodi vai nopērc ložmetēja lenti.',heli_load:'🚁 Iepildīts: ⛽ +{f} · 🔫 +{a}',
 heli_down:'💥 Helikopters iznīcināts!',heli_steal:'🚁 {n} nozaga helikopteri!',heli_mine:'🚁 Tu nozagi helikopteri! Saimnieki to neaizmirsīs.',heli_bot:'🚁 {n} paceļas ar helikopteru',heli_new:'🚁 Laukumā atkal ir helikopters'});
Object.assign(T.en,{wjav:'Javelin',shop_jav:'🎯 Javelin (missile locks on vehicles)',shop_a_jav:'🎯 Javelin missiles (+2)',shop_hbelt:'🔗 Helicopter gun belt (+100)',shop_fuel:'⛽ Fuel can (+40)',
 hbelt:'Gun belts',fuel:'Fuel cans',hm_pred:'Predator: agile, 400 rounds, radar shows enemies on the map',hm_shark:'Shark: faster and tougher, stronger gun',
 heli_in:'🚁 {m} (⛽ {f} · 🔫 {a})',heli_fly:'🚁 ⛽ {f} · 🔫 {a} · ❤️ {h} · 🤚 land',heli_go:'🚁 Flying! ⬆ up, ⬇ down (Space and C), ⚔️ machine gun, 🤚 land. The helicopter stays where it lands.',
 heli_nofuel:'⛽ Out of fuel! The helicopter is landing. Find or buy a fuel can.',heli_noammo:'🔫 Out of ammo. Find or buy a gun belt.',heli_load:'🚁 Loaded: ⛽ +{f} · 🔫 +{a}',
 heli_down:'💥 Helicopter destroyed!',heli_steal:'🚁 {n} stole a helicopter!',heli_mine:'🚁 You stole a helicopter! The owners will remember.',heli_bot:'🚁 {n} takes off in a helicopter',heli_new:'🚁 The helipad has a helicopter again'});
// ---------- Javelin: spēcīgākais ierocis no zemes ----------
WP.jav={ic:'🎯',dmg:0,rate:2,max:6,give:2,add:2,pel:1,sp:0,life:3,brate:3,rng:150,val:70,av:15,rocket:true};WL.push('jav');GUNS.push('jav');
SHOPS.weapons.push(['jav',150],['a_jav',30],['hbelt',20],['fuel',15]);
const _giveLoot11=giveLoot;giveLoot=function(k,I,Tm){if(I&&I.ammo&&I.ammo.jav===undefined){I.ammo.jav=0;I.has.jav=false;}
 if(k==='hbelt'){I.hbelt=(I.hbelt||0)+1;return '+1 🔗 '+t('hbelt');}if(k==='fuel'){I.fuel=(I.fuel||0)+1;return '+1 ⛽ '+t('fuel');}return _giveLoot11(k,I,Tm);};
const _rollLoot11=rollLoot;rollLoot=function(R,p){const r=_rollLoot11(R,p);if(r.length&&R()<.14){const q=R();return[q<.4?'fuel':q<.75?'hbelt':q<.93?'a_jav':'jav'];}return r;};
const _pickGround11=pickGround;pickGround=function(R){if(R()<.12){const q=R();return q<.45?'fuel':q<.85?'hbelt':'a_jav';}return _pickGround11(R);};
const _itemMesh11=itemMesh;itemMesh=function(type){if(type==='fuel'){const m=new THREE.Group(),b=cube(.36,.48,.2,0xc62828,.6),h=cube(.1,.1,.1,0x222222,.6);h.position.set(.1,.3,0);m.add(b,h);return m;}
 if(type==='hbelt'){const m=new THREE.Group();for(let i=0;i<5;i++){const c=cube(.06,.06,.28,0xd4a537,.4);c.position.x=-.16+i*.08;m.add(c);}const s=cube(.4,.03,.3,0x3e2723,.8);s.position.y=-.04;m.add(s);return m;}
 if(type==='jav'){const m=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,1.2,8),mat(0x556b2f,.7));b.rotation.z=Math.PI/2;const s=cube(.24,.22,.2,0x37474f,.6);s.position.set(-.2,.18,0);m.add(b,s);return m;}
 if(type==='a_jav'){const m=new THREE.Group(),b=cube(.5,.2,.2,0x556b2f,.6);b.material.emissive.set(0x1a2a10);m.add(b);return m;}return _itemMesh11(type);};
const _renderInv11=renderInv;renderInv=function(){_renderInv11();if(!inv)return;const d=document.createElement('div');d.innerHTML='🔗 '+t('hbelt')+': '+(inv.hbelt||0)+' · ⛽ '+t('fuel')+': '+(inv.fuel||0);$('inv').appendChild(d);};
const JV=[];
// mērķis: tehnika (helikopteri, lidmašīnas, tanks), citādi lielākie briesmoņi; pl = spēlētāja komanda
function javTarget(px,pz,a,team,cone){let best=null,bs=1e9;const foe=T2=>T2&&T2!==team&&(team!==PT?team.enemies.has(T2):!T2.friendly);
 const look=(x,z,ref,kind,bonus)=>{const dx=x-px,dz=z-pz,d=Math.hypot(dx,dz);if(d<4||d>160)return;let df=Math.atan2(-dx,-dz)-a;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));if(df>cone)return;const s=df*50+d*.2-bonus;if(s<bs){bs=s;best={ref,kind};}};
 for(const H of HELIS)if(H.st!=='gone'&&(H.st==='park'?(team===PT?H.owner!==PT:H.owner&&H.owner!==team&&team.enemies.has(H.owner)):foe(heliTeam(H))))look(H.x,H.z,H,'heli',40);
 if(typeof JETS!=='undefined')for(const J of JETS)if((J.st==='fly'||J.st==='fall')&&foe(pilotTeam(J)))look(J.x,J.z,J,'jet',40);
 if(team!==PT&&inTank&&team.enemies.has(PT))look(inTank.g.position.x,inTank.g.position.z,inTank,'tank',40);
 for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,z.position.z,z,'mon',u.sc>=1.5?20:0);}
 return best;}
function javelinFire(px,py,pz,a,team,pl){const tg=javTarget(px,pz,a,team,TOUCH||team!==PT?.8:.5);
 const m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0x8bc34a}));m.scale.setScalar(1.5);m.position.set(px,py,pz);scene.add(m);
 JV.push({m,x:px,y:py,z:pz,vx:-Math.sin(a)*14,vy:16,vz:-Math.cos(a)*14,t:0,life:6,tg,team,pl,gx:px-Math.sin(a)*60,gz:pz-Math.cos(a)*60});sfxAt('rocket',px,pz,60);}
function javPos(tg){const r=tg.ref;if(tg.kind==='heli')return{x:r.x,y:r.y+1.5,z:r.z,ok:r.st!=='gone'};if(tg.kind==='jet')return{x:r.x,y:r.y,z:r.z,ok:r.st==='fly'||r.st==='fall'};
 if(tg.kind==='tank')return{x:r.g.position.x,y:1.5,z:r.g.position.z,ok:!r.dead};return{x:r.position.x,y:1.2,z:r.position.z,ok:!r.userData.dead};}
function javHit(j){const tg=j.tg;if(tg){const r=tg.ref;if(tg.kind==='heli')destroyHeli(r,j.team);else if(tg.kind==='jet')jetDamage(r,99,j.team,j.pl);else if(tg.kind==='tank')destroyTank(r,j.team);else dmgMonster(r,99999,j.pl,true);}
 jetBoom(j.x,j.z,j.team,j.pl,.7,.6);}
function javTick(dt){for(let i=JV.length-1;i>=0;i--){const j=JV[i];j.t+=dt;j.life-=dt;
  let p=j.tg?javPos(j.tg):null;if(p&&!p.ok){j.tg=null;p=null;}const tx=p?p.x:j.gx,ty=p?p.y:0,tz=p?p.z:j.gz;
  if(j.t>.6){const dx=tx-j.x,dy=ty-j.y,dz=tz-j.z,l=Math.hypot(dx,dy,dz)||1,k=Math.min(1,dt*3.2);j.vx+=(dx/l*46-j.vx)*k;j.vy+=(dy/l*46-j.vy)*k;j.vz+=(dz/l*46-j.vz)*k;
   if(l<3){scene.remove(j.m);JV.splice(i,1);javHit(j);continue;}}
  j.x+=j.vx*dt;j.y+=j.vy*dt;j.z+=j.vz*dt;j.m.position.set(j.x,j.y,j.z);j.m.lookAt(j.x+j.vx,j.y+j.vy,j.z+j.vz);if(Math.random()<dt*25)debris(j.x,j.y,j.z,0xcccccc,1);
  if(j.y<.3||j.life<=0||(j.y<40&&bldHit(j.x,j.z,j.y))){scene.remove(j.m);JV.splice(i,1);j.tg=null;javHit(j);}}}
const _shoot11=shoot;shoot=function(w){if(w!=='jav')return _shoot11(w);attackWait=WP.jav.rate;inv.ammo.jav--;javelinFire(player.position.x,pY+1.5,player.position.z,yaw,PT,true);updateAmmo();renderInv();renderW();};
const _guestFire11=guestFire;guestFire=function(G,d){if(d.w!=='jav')return _guestFire11(G,d);if(G.dead||!G.I.has.jav||!(G.I.ammo.jav>0))return;G.I.ammo.jav--;javelinFire(G.pos.x,G.y+1.5,G.pos.z,+d.a||0,PT,true);netMe(G);};
// prettanku raķete un tanka šāviņš arī iznīcina tehniku
const _rocketBoom11=rocketBoom;rocketBoom=function(p,team,pl){_rocketBoom11(p,team,pl);for(const t of tanks)if(Math.hypot(t.g.position.x-p.x,t.g.position.z-p.z)<3.5)destroyTank(t,team,1);
 for(const H of HELIS)if(H.st!=='gone'&&H.y<5&&Math.hypot(H.x-p.x,H.z-p.z)<4)destroyHeli(H,team);};
const _tankBoom11=tankBoom;tankBoom=function(p){_tankBoom11(p);for(const H of HELIS)if(H.st!=='gone'&&H.y<6&&Math.hypot(H.x-p.x,H.z-p.z)<5)destroyHeli(H,PT);};
const _jetBoom11=jetBoom;jetBoom=function(x,z,team,pl,power,rad,th){_jetBoom11(x,z,team,pl,power,rad,th);for(const H of HELIS)if(H.st!=='gone'&&H.y<15&&Math.hypot(H.x-x,H.z-z)<7*(rad||1)&&heliTeam(H)!==team)destroyHeli(H,team);};
// lidmašīnas raķete tēmē arī uz helikopteriem; trāpot helikopteris uzreiz iet bojā
const _jetDamage11=jetDamage;jetDamage=function(J,d,team,pl){if(J.isHeli){destroyHeli(J,team);return;}_jetDamage11(J,d,team,pl);};
const _jetAirLocal11=jetAirLocal;jetAirLocal=function(J){const r=_jetAirLocal11(J);if(r||!J.m.aa||NET.role==='guest')return r;const fx=-Math.sin(J.a),fz=-Math.cos(J.a);let best=null,bs=1e9;
 for(const H of HELIS){if(H.st!=='fly'||heliTeam(H)===PT)continue;const dx=H.x-J.x,dz=H.z-J.z,d=Math.hypot(dx,dz);if(d<6||d>140)continue;const df=Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(df>.6)continue;if(df*60+d*.2<bs){bs=df*60+d*.2;best=H;}}return best;};
// ---------- helikopteru laukumi ----------
const HPAD=[{x:70,z:-205},{x:-70,z:205}];
function nearHeliport(x,z,m){m=m||0;return HPAD.some(a=>Math.abs(x-a.x)<18+m&&Math.abs(z-a.z)<16+m);}
const _nearAirfield11=nearAirfield;nearAirfield=function(x,z,m){return _nearAirfield11(x,z,m)||nearHeliport(x,z,m);};
const HPOB=[];
function buildHeliports(){for(const a of HPAD){const g=new THREE.Group();
 const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');x.fillStyle='#4a4d50';x.fillRect(0,0,256,256);
 for(const cx of [64,192]){x.strokeStyle='#f5f5f5';x.lineWidth=6;x.beginPath();x.arc(cx,128,52,0,6.283);x.stroke();x.fillStyle='#f5f5f5';x.fillRect(cx-22,100,10,56);x.fillRect(cx+12,100,10,56);x.fillRect(cx-22,123,44,10);}
 x.fillStyle='#ffd54f';for(let i=0;i<256;i+=24){x.fillRect(i,2,12,5);x.fillRect(i,249,12,5);}
 const pad=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:1}));pad.rotation.x=-Math.PI/2;pad.position.set(a.x,.03,a.z);pad.receiveShadow=true;g.add(pad);
 const tk=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,3,14),mat(0xc62828,.6));tk.rotation.z=Math.PI/2;tk.position.set(a.x,1.5,a.z-13);g.add(tk);
 const sh=cube(5,3,4,0x6d7a6a,.9);sh.position.set(a.x+13,1.5,a.z+12);g.add(sh);const sr=cube(5.4,.3,4.4,0x3e463c,.9);sr.position.set(a.x+13,3.1,a.z+12);g.add(sr);
 const sp=cube(.1,4,.1,0x777777,.5);sp.position.set(a.x-14,2,a.z+13);g.add(sp);const sock=new THREE.Mesh(new THREE.ConeGeometry(.35,1.6,8),mat(0xff6d00,.8));sock.rotation.z=Math.PI/2;sock.position.set(a.x-13.2,3.8,a.z+13);g.add(sock);
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);HPOB.push({x:a.x,z:a.z-13,hx:1.6,hz:1.5},{x:a.x+13,z:a.z+12,hx:2.6,hz:2.1});}}
buildHeliports();
// ---------- helikopteri ----------
const HM={pred:{c:0x4b5320,spd:16,hp:100,amax:400,dmg:16,rate:.07,fu:1/3,radar:true},shark:{c:0x263238,spd:22,hp:160,amax:250,dmg:24,rate:.09,fu:1/2.4}},HMK=['pred','shark'];
function heliMesh(k){const M=HM[k]||HM.pred,g=new THREE.Group(),c=M.c,shark=k==='shark';
 const b=cube(1.3,1.5,4.6,c,.7);b.position.y=1.5;g.add(b);const n=cube(1,1,1.4,c,.7);n.position.set(0,1.3,-2.9);g.add(n);
 const cp=cube(1.05,.8,shark?1.3:2.4,0x4fc3f7,.15);cp.position.set(0,2.15,shark?-2.1:-1.4);g.add(cp);
 const tb=cube(.45,.45,5,c,.7);tb.position.set(0,1.9,4.6);g.add(tb);const fin=cube(.12,1.6,1,c,.7);fin.position.set(0,2.6,6.8);g.add(fin);const hs=cube(2,.1,.6,c,.7);hs.position.set(0,1.9,6.4);g.add(hs);
 const gun=cube(.18,.18,1.1,0x222222,.5);gun.position.set(0,.75,-3.5);g.add(gun);
 for(const x of [-1.6,1.6]){const w=cube(1.4,.12,.8,c,.7);w.position.set(x*.8,1.4,-.2);g.add(w);const pod=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,1.2,8),mat(0x37474f,.6));pod.rotation.x=Math.PI/2;pod.position.set(x,1.2,-.2);g.add(pod);}
 for(const x of [-.8,.8]){const sk=cube(.12,.12,4,0x222222,.6);sk.position.set(x,.1,-.4);g.add(sk);for(const z of [-1.4,.8]){const st=cube(.1,.75,.1,0x222222,.6);st.position.set(x,.45,z);g.add(st);}}
 if(shark){const m=cube(1.02,.3,.6,0xc62828,.6);m.position.set(0,1.05,-3.35);g.add(m);for(let i=0;i<5;i++){const tt=cube(.12,.14,.05,0xffffff,.4);tt.position.set(-.4+i*.2,1.18,-3.66);g.add(tt);}
  for(const x of [-.36,.36]){const e=cube(.12,.12,.05,0xffffff,.4);e.position.set(x,1.55,-3.62);g.add(e);}}
 const rot=new THREE.Group();rot.position.y=3.15;for(let i=0;i<4;i++){const bl=cube(.32,.06,6.6,0x1b1b1b,.6);bl.rotation.y=i*Math.PI/4*2/2+i*Math.PI/4;rot.add(bl);}g.add(rot);
 let rot2=null;if(shark){rot2=rot.clone();rot2.position.y=3.6;g.add(rot2);}else{const tr=new THREE.Group();tr.position.set(.3,2.5,6.9);for(let i=0;i<2;i++){const bl=cube(.05,1.4,.18,0x1b1b1b,.6);bl.rotation.x=i*Math.PI/2;tr.add(bl);}g.add(tr);g.userData.tr=tr;}
 const mast=cube(.16,.4,.16,0x222222,.6);mast.position.y=3;g.add(mast);
 g.rotation.order='YXZ';g.userData.rot=rot;g.userData.rot2=rot2;scene.add(g);return g;}
const HELIS=[],HSH=[],TRC=[];let heliId=0,heliMode=null,hDown=false,heliNetT=0,botHeliT=0,hEngT=0,heliFogKeep=null;
const HSLOTS=[];for(const a of HPAD)HSLOTS.push([a.x-7,a.z],[a.x+7,a.z]);
const heliTeam=H=>H.pilot==='P'||(H.pilot&&H.pilot.pos)?PT:H.pilot&&H.pilot.team?H.pilot.team:null;
function spawnHeli(i){const [x,z]=HSLOTS[i],mk=HMK[i%2],M=HM[mk],H={id:++heliId,isHeli:true,slot:i,mk,m:M,g:heliMesh(mk),st:'park',x,y:0,z,a:0,vx:0,vz:0,pilot:null,fuel:60,ammo:150,hp:M.hp,ob:{x,z,hx:1.3,hz:3},owner:null,rs:0};
 H.g.position.set(x,0,z);addOb(H.ob);HELIS.push(H);return H;}
function clearHelis(){for(const H of HELIS){scene.remove(H.g);freeObj(H.g);remOb(H.ob);}HELIS.length=0;for(const j of JV)scene.remove(j.m);JV.length=0;for(const s of HSH)scene.remove(s.m);HSH.length=0;}
function heliPark(H){H.st='park';H.pilot=null;H.vx=H.vz=0;H.ob.x=H.x;H.ob.z=H.z;remOb(H.ob);addOb(H.ob);}
function heliGround(x,z){let g=colTop(Math.round(x),Math.round(z));for(const ch of chunks.values())for(const b of ch.blds||[])if(!b.burnt&&Math.abs(x-b.x)<b.hx&&Math.abs(z-b.z)<b.hz)g=Math.max(g,b.h);return g;}
const hsay=bcastMsgOf((k,o,d)=>say(o?tf(k,o):t(k),d||3));
function destroyHeli(H,team){if(H.st==='gone')return;const x=H.x,z=H.z,y=H.y,P=H.pilot;explosionFx(x,y+1.5,z,5,0xff7a1a);sfxAt('boom',x,z,130);
 if(P==='P'){heliMode=null;heliFog(false);player.position.set(x,0,z);pY=y+1;if(y>3){paraMode=true;chute().visible=true;}}
 else if(P&&P.pos){netTo(P,{t:'hdown'});P.inHeli=null;}
 else if(P&&P.g){P.heli=null;P.g.position.set(x,y,z);if(y>3){P.para=true;P.inside=true;P.g.visible=true;const c=chuteMesh(P.team.color);c.visible=true;P.g.add(c);P.chute=c;}else{P.inside=false;P.g.position.y=0;}}
 const PTm=heliTeam(H)||H.owner;if(team&&PTm&&team!==PTm)war(team,PTm);
 H.st='gone';H.pilot=null;remOb(H.ob);scene.remove(H.g);freeObj(H.g);crashFire(x,z,true);hsay('heli_down');H.rs=25;}
function heliDamage(H,d,team){if(H.st==='gone')return;const PTm=heliTeam(H);if(team&&PTm&&team!==PTm)war(team,PTm);H.hp-=d;if(H.hp<=0)destroyHeli(H,team);}
// ---------- spēlētājs lido ----------
function heliFog(on){if(on&&heliFogKeep===null){heliFogKeep=scene.fog.far;scene.fog.far=120;}if(!on&&heliFogKeep!==null){scene.fog.far=heliFogKeep;heliFogKeep=null;}}
function loadHeli(H,I){const f=Math.min(I.fuel||0,Math.ceil((100-H.fuel)/40)),a=Math.min(I.hbelt||0,Math.ceil((H.m.amax-H.ammo)/100));I.fuel-=f;I.hbelt-=a;const df=Math.min(100,H.fuel+f*40)-H.fuel,da=Math.min(H.m.amax,H.ammo+a*100)-H.ammo;H.fuel+=df;H.ammo+=da;return(df||da)?tf('heli_load',{f:Math.round(df),a:da}):'';}
function stealCheck(H,thief){if(H.owner&&H.owner!==thief&&teams.includes(H.owner)&&H.owner.members.length){if(H.owner.members.some(m=>Math.hypot(m.g.position.x-H.x,m.g.position.z-H.z)<60))war(H.owner,thief);return true;}return false;}
function enterHeli(H){heliMode=H;yaw=H.a;buildMode=false;heliFog(true);
 if(NET.role!=='guest'){H.st='fly';H.pilot='P';remOb(H.ob);const s=loadHeli(H,inv);if(stealCheck(H,PT))say(t('heli_mine'),3);H.owner=PT;say(s||t('heli_go'),5);renderInv();}else say(t('heli_go'),5);sfx('door');renderW();}
function exitHeli(){const H=heliMode;if(!H)return;heliMode=null;heliFog(false);hDown=false;const a=H.a;player.position.set(H.x+Math.cos(a)*2.4,0,H.z-Math.sin(a)*2.4);pY=heliGround(player.position.x,player.position.z);vy=0;onGround=true;player.visible=true;
 if(NET.role==='guest')netSend({t:'hexit',id:H.id,x:r2(H.x),y:r2(H.y),z:r2(H.z),a:r2(H.a),f:r2(H.fuel),am:H.ammo});else{heliPark(H);H.owner=PT;}
 pushOut(player.position,.35,pY,PT);sfx('door');renderW();}
function heliFly(dt){const H=heliMode,M=H.m,f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),d=new THREE.Vector3();
 if(keys.KeyW)d.add(f);if(keys.KeyS)d.sub(f);if(keys.KeyD)d.add(r);if(keys.KeyA)d.sub(r);if(jx||jy){d.addScaledVector(f,-jy);d.addScaledVector(r,jx);}if(d.lengthSq()>1)d.normalize();
 const gnd=heliGround(H.x,H.z),air=H.y>gnd+.4,noF=H.fuel<=0;
 let up=(keys.Space&&!noF?1:0)-(keys.KeyC||hDown||H.auto||noF?1:0);H.y=Math.max(gnd,Math.min(60,H.y+up*7*dt));
 if(H.y>gnd+.4){H.vx+=(d.x*M.spd-H.vx)*Math.min(1,dt*2);H.vz+=(d.z*M.spd-H.vz)*Math.min(1,dt*2);H.fuel=Math.max(0,H.fuel-M.fu*dt);if(noF&&!H.nfSaid){H.nfSaid=true;say(t('heli_nofuel'),4);}}else{H.vx*=.8;H.vz*=.8;}
 const nx=H.x+H.vx*dt,nz=H.z+H.vz*dt;if(heliGround(nx,nz)>H.y+.2){H.vx=H.vz=0;}else{H.x=nx;H.z=nz;}
 H.x=Math.max(-EDGE+4,Math.min(EDGE-4,H.x));H.z=Math.max(-EDGE+4,Math.min(EDGE-4,H.z));H.a=yaw;
 const ra=H.vx*r.x+H.vz*r.z,fa=H.vx*f.x+H.vz*f.z;H.g.position.set(H.x,H.y,H.z);H.g.rotation.set(-fa/M.spd*.2,H.a,-ra/M.spd*.25);heliSpin(H,dt,true);
 player.position.set(H.x,0,H.z);pY=H.y+1;player.visible=false;
 hEngT-=dt;if(hEngT<=0){hEngT=.12;noise(.1,.03,180);}
 if(H.auto&&H.y<=gnd+.05){H.auto=false;exitHeli();}}
function heliSpin(H,dt,on){const u=H.g.userData,s=on?28:0;u.rot.rotation.y+=s*dt;if(u.rot2)u.rot2.rotation.y-=s*dt;if(u.tr)u.tr.rotation.x+=s*1.5*dt;}
function heliAimLocal(H){const fx=-Math.sin(H.a),fz=-Math.cos(H.a);let best=null,bs=1e9;
 const look=(x,y,z,ref,kind)=>{const dx=x-H.x,dz=z-H.z,d=Math.hypot(dx,dz);if(d>75)return;const dy=y-(H.y+1);const d3=Math.hypot(d,dy);if(d3<2)return;const df=d<1?0:Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(df>.55&&d>6)return;const s=df*40+d3*.25;if(s<bs){bs=s;best={x,y,z,ref,kind};}};
 if(NET.role==='guest'){for(const o of netMon.values())look(o.z.position.x,1.2,o.z.position.z);for(const o of netBot.values())if(o.rel===2)look(o.g.position.x,1.2,o.g.position.z);for(const [id,o] of netHelis)if(o.st===1&&o.pid===-1&&id!==H.id)look(o.x,o.y+1.5,o.z);}
 else{for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,1.2,z.position.z,z,'m');}for(const b of humans)if(!b.dead&&!b.inside&&PT.enemies.has(b.team))look(b.g.position.x,1.2,b.g.position.z,b,'b');
  for(const Q of HELIS)if(Q!==H&&Q.st==='fly'&&heliTeam(Q)!==PT)look(Q.x,Q.y+1.5,Q.z,Q,'h');}
 return best;}
function tracer(x,y,z,tx,ty,tz){const l=Math.hypot(tx-x,ty-y,tz-z);if(l<.5||Math.hypot(x-player.position.x,z-player.position.z)>120)return;const m=new THREE.Mesh(new THREE.BoxGeometry(.07,.07,l),new THREE.MeshBasicMaterial({color:0xffe082}));
 m.position.set((x+tx)/2,(y+ty)/2,(z+tz)/2);m.lookAt(tx,ty,tz);scene.add(m);TRC.push({m,t:.07});}
// šāviens: saimnieks aprēķina trāpījumu (arī drauga šāvienam)
function heliShot(H,x,y,z,tx,ty,tz,team,pl){tracer(x,y,z,tx,ty,tz);if(NET.role==='host'&&NET.guests.size&&Math.random()<.5)netQ.push({e:'tr',a:[r2(x),r2(y),r2(z),r2(tx),r2(ty),r2(tz)]});
 const dmg=H.m.dmg;let hit=false;
 for(const zz of zombies){const u=zz.userData;if(u.dead||u.rise>0)continue;if(Math.hypot(zz.position.x-tx,zz.position.z-tz)<1.6*Math.max(1,u.sc)&&ty<u.bh+.5){dmgMonster(zz,dmg,pl);hit=true;break;}}
 if(!hit)for(const h of [...HL]){if(h.team===team)continue;if(Math.hypot(h.p.x-tx,h.p.z-tz)<1.4&&Math.abs((h.y||0)+1-ty)<2){hurt(h,dmg*.7,team,pl);hit=true;break;}}
 if(!hit)for(const Q of HELIS)if(Q!==H&&Q.st!=='gone'&&heliTeam(Q)!==team&&Math.hypot(Q.x-tx,Q.y+1.5-ty,Q.z-tz)<3.5){heliDamage(Q,dmg,team);hit=true;break;}
 if(!hit)debris(tx,Math.max(.2,ty),tz,0x8d8d8d,2);}
function heliFire(){const H=heliMode;if(!H||attackWait>0)return;if(H.ammo<=0){if(gtime>(H.naT||0)){H.naT=gtime+3;say(t('heli_noammo'),2);}return;}attackWait=H.m.rate;H.ammo--;
 const tg=heliAimLocal(H),fx=-Math.sin(H.a),fz=-Math.cos(H.a),gx=H.x+fx*3.6,gy=H.y+.75,gz=H.z+fz*3.6,sp=()=>(Math.random()-.5)*1.2;
 const tx=tg?tg.x+sp():H.x+fx*40,ty=tg?tg.y+sp()*.5:0,tz=tg?tg.z+sp():H.z+fz*40;
 if(Math.random()<.5)tone(140,.05,'square',.06,90);
 if(NET.role==='guest'){tracer(gx,gy,gz,tx,ty,tz);netSend({t:'hf',id:H.id,a:[r2(gx),r2(gy),r2(gz),r2(tx),r2(ty),r2(tz)]});}else heliShot(H,gx,gy,gz,tx,ty,tz,PT,true);
 renderW();}
// ---------- botu helikopteri: pacelšanās, kauja, nosēšanās savā bāzē; var nozagt ----------
function botHeliPick(){if(HELIS.filter(H=>H.pilot&&H.pilot.g).length+humans.filter(b=>b.heliGoal).length>=2)return;
 const C=humans.filter(b=>!b.dead&&!b.inside&&!b.trader&&!b.jet&&!b.heli&&!b.para&&!b.jetGoal&&!b.heliGoal&&!b.team.isPlayer&&!b.team.calm&&!b.team.farm&&!b.team.friendly&&!b.team.traderT);
 for(const H of HELIS.filter(q=>q.st==='park'&&!q.res).sort(()=>Math.random()-.5)){let best=null,bd=140;for(const b of C){const d=Math.hypot(b.g.position.x-H.x,b.g.position.z-H.z)-(H.owner===b.team?60:0);if(d<bd){bd=d;best=b;}}
  if(best){best.heliGoal=H;H.res=best;return;}}}
function botHeliBoard(b,H){b.heliGoal=null;H.res=null;b.heli=H;b.inside=true;b.tg=null;b.gx=null;b.follow=false;H.st='fly';H.pilot=b;remOb(H.ob);H.fuel=Math.max(H.fuel,60);H.ammo=Math.max(H.ammo,200);H.t=0;H.mis=60+Math.random()*50;H.tAlt=13+Math.random()*6;
 if(stealCheck(H,b.team)&&(H.owner===PT||Math.hypot(H.x-player.position.x,H.z-player.position.z)<120))hsay('heli_steal',{n:b.name});
 else if(Math.hypot(H.x-player.position.x,H.z-player.position.z)<120)hsay('heli_bot',{n:b.name});H.owner=b.team;}
function botHeliLand(H,b){heliPark(H);H.owner=b.team;b.heli=null;b.inside=false;b.g.position.set(H.x+2.2,0,H.z);b.g.visible=true;}
function botHeliFly(H,b,dt){H.t+=dt;const T=b.team;
 H.tt=(H.tt||0)-dt;if(H.tt<=0){H.tt=1;let best=null,bd=95;
  for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0||u.kind==='f')continue;const d=Math.hypot(z.position.x-H.x,z.position.z-H.z);if(d<bd){bd=d;best={x:z.position.x,y:1.2,z:z.position.z};}}
  for(const h of HL){if(h.team===T||!T.enemies.has(h.team)||(h.y||0)>4)continue;const d=Math.hypot(h.p.x-H.x,h.p.z-H.z)-10;if(d<bd){bd=d;best={x:h.p.x,y:(h.y||0)+1.2,z:h.p.z};}}
  for(const Q of HELIS){if(Q===H||Q.st!=='fly')continue;const T2=heliTeam(Q);if(!T2||!T.enemies.has(T2))continue;const d=Math.hypot(Q.x-H.x,Q.z-H.z)-20;if(d<bd){bd=d;best={x:Q.x,y:Q.y+1.5,z:Q.z,Q};}}
  H.tg=best;}
 const home=H.t>H.mis||H.ammo<15||H.fuel<12;let tx,tz,alt=H.tAlt;
 if(home){const B=T.base;tx=B?B.x+(T.size||3)+5:H.x;tz=B?B.z:H.z;}
 else if(H.tg){const dx=H.x-H.tg.x,dz=H.z-H.tg.z,l=Math.hypot(dx,dz)||1;tx=H.tg.x+dx/l*20;tz=H.tg.z+dz/l*20;if(H.tg.Q)alt=H.tg.Q.y;}
 else{H.wpT=(H.wpT||0)-dt;if(H.wpT<=0||!H.wp){H.wpT=10;H.wp=[(Math.random()*2-1)*140,(Math.random()*2-1)*140];}tx=H.wp[0];tz=H.wp[1];}
 const dx=tx-H.x,dz=tz-H.z,dl=Math.hypot(dx,dz),sp=Math.min(H.m.spd*.85,dl*.8);H.vx+=((dl>.5?dx/dl*sp:0)-H.vx)*Math.min(1,dt*1.5);H.vz+=((dl>.5?dz/dl*sp:0)-H.vz)*Math.min(1,dt*1.5);
 const fa=H.tg&&!home?Math.atan2(-(H.tg.x-H.x),-(H.tg.z-H.z)):dl>2?Math.atan2(-dx,-dz):H.a;let df=fa-H.a;df=Math.atan2(Math.sin(df),Math.cos(df));H.a+=Math.max(-2*dt,Math.min(2*dt,df));
 const g0=heliGround(H.x,H.z),hA=Math.max(g0,maxHAhead(H.x,H.z,Math.atan2(-H.vx,-H.vz),20));
 if(home&&dl<3){H.y=Math.max(g0,H.y-6*dt);if(H.y<=g0+.05){botHeliLand(H,b);return;}}else H.y+=(Math.max(alt,hA+5)-H.y)*Math.min(1,dt*1.2);
 const nx=H.x+H.vx*dt,nz=H.z+H.vz*dt;if(heliGround(nx,nz)>H.y+.2){H.vx=H.vz=0;}else{H.x=nx;H.z=nz;}H.fuel=Math.max(0,H.fuel-H.m.fu*dt*.5);
 H.fcd=(H.fcd||0)-dt;if(H.tg&&!home&&H.ammo>0&&H.fcd<=0&&Math.abs(df)<.4){const d=Math.hypot(H.tg.x-H.x,H.tg.z-H.z);if(d<60){H.fcd=H.m.rate*2.5;H.ammo--;const fx=-Math.sin(H.a),fz=-Math.cos(H.a),s=()=>(Math.random()-.5)*2.2;
   heliShot(H,H.x+fx*3.6,H.y+.75,H.z+fz*3.6,H.tg.x+s(),H.tg.y+s()*.4,H.tg.z+s(),T,false);sfxAt('shoot',H.x,H.z,50);}}
 H.g.position.set(H.x,H.y,H.z);H.g.rotation.set(0,H.a,0);b.g.position.set(H.x,0,H.z);b.g.visible=false;b.lab.visible=b.bar.bg.visible=b.bar.f.visible=false;}
const _botThink11=botThink;botThink=function(b){if(b.heli)return;
 if(b.heliGoal){const H=b.heliGoal;if(H.st!=='park'||H.res!==b)b.heliGoal=null;else if(!nearestThreat(b)){const p=b.g.position;if(Math.hypot(p.x-H.x,p.z-H.z)<3.6){botHeliBoard(b,H);return;}b.tg=null;b.follow=false;goal(b,H.x+2.4,H.z,false);return;}}
 _botThink11(b);};
// zemes boti ar Javelin šauj uz ienaidnieku tehniku gaisā
function botAA(){for(const b of humans){if(b.dead||b.inside||!(b.I.ammo.jav>0)||Math.random()>.35)continue;const p=b.g.position;let tg=null,bd=110;
  for(const H of HELIS)if(H.st==='fly'){const T2=heliTeam(H);if(T2&&b.team.enemies.has(T2)){const d=Math.hypot(H.x-p.x,H.z-p.z);if(d<bd){bd=d;tg=H;}}}
  if(typeof JETS!=='undefined')for(const J of JETS)if(J.st==='fly'){const T2=pilotTeam(J);if(T2&&b.team.enemies.has(T2)){const d=Math.hypot(J.x-p.x,J.z-p.z);if(d<bd){bd=d;tg=J;}}}
  if(tg){b.I.ammo.jav--;javelinFire(p.x,1.6,p.z,Math.atan2(-(tg.x-p.x),-(tg.z-p.z)),b.team,false);}}}
// tanks: pretgaisa šāviņš arī pret helikopteriem
const _fireTank11=fireTank;fireTank=function(){const t=inTank;if(!t||attackWait>0||t.shells<=0)return _fireTank11();const px=player.position.x,pz=player.position.z;let best=null,bs=1e9;
 for(const H of HELIS){if(H.st!=='fly'||heliTeam(H)===PT)continue;const d=Math.hypot(H.x-px,H.z-pz);let df=Math.atan2(-(H.x-px),-(H.z-pz))-yaw;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));if(d>110||df>.8)continue;if(df*40+d*.2<bs){bs=df*40+d*.2;best=H;}}
 if(!best)return _fireTank11();t.shells--;attackWait=1.2;yaw=Math.atan2(-(best.x-px),-(best.z-pz));const m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0x222222}));m.scale.setScalar(1.5);m.position.set(px,2.2,pz);scene.add(m);
 HSH.push({m,H:best,life:3});sfx('rocket');sfx('boom');renderW();if(t.shells<=0){t.dead=true;say(t_('tank_empty'),4);setTimeout(()=>{if(inTank===t)exitTank();t.g.userData.hull.material.color.setHex(0x2a2a22);},1500);}};
// ---------- saimnieka cikls ----------
function heliTick(dt){
 for(const H of HELIS){
  if(H.st==='gone'){H.rs-=dt;if(H.rs<=0){const i=HELIS.indexOf(H);HELIS.splice(i,1);spawnHeli(H.slot);hsay('heli_new');}continue;}
  const P=H.pilot;
  if(H.st==='fly'&&P&&P.pos){if(!NET.guests.has(P.id)||P.dead){P.inHeli=null;H.y=heliGround(H.x,H.z);heliPark(H);}else{H.x=P.pos.x;H.z=P.pos.z;H.y=Math.max(0,P.y-1);H.a=P.yaw;H.g.position.set(H.x,H.y,H.z);H.g.rotation.set(0,H.a,0);heliSpin(H,dt,true);}}
  else if(H.st==='fly'&&P&&P.g){if(P.dead){H.y=heliGround(H.x,H.z);heliPark(H);}else{botHeliFly(H,P,dt);heliSpin(H,dt,H.st==='fly');}}
  else if(H.st==='fly'&&!P){H.y=Math.max(heliGround(H.x,H.z),H.y-5*dt);H.g.position.y=H.y;if(H.y<=heliGround(H.x,H.z)+.05)heliPark(H);}
 }
 for(let i=HSH.length-1;i>=0;i--){const s=HSH[i],p=s.m.position;s.life-=dt;const H=s.H;if(H.st!=='gone'){const dx=H.x-p.x,dy=H.y+1.5-p.y,dz=H.z-p.z,l=Math.hypot(dx,dy,dz)||1;p.x+=dx/l*75*dt;p.y+=dy/l*75*dt;p.z+=dz/l*75*dt;if(l<3.5){scene.remove(s.m);HSH.splice(i,1);destroyHeli(H,PT);continue;}}
  if(s.life<=0||H.st==='gone'){scene.remove(s.m);HSH.splice(i,1);explosionFx(p.x,p.y,p.z,2,0xff9e40);}}
 javTick(dt);
 botHeliT-=dt;if(botHeliT<=0){botHeliT=1.5;if(Math.random()<.12)botHeliPick();botAA();}
 for(const b of humans)if(b.para&&b.heli===null&&!b.jet&&b.g.position.y<=0&&b.chute){b.g.remove(b.chute);freeObj(b.chute);b.chute=null;}
 if(NET.role==='host'&&NET.guests.size){heliNetT-=dt;if(heliNetT<=0){heliNetT=.1;
  const msg={t:'ht',H:HELIS.filter(H=>H.st!=='gone').map(H=>[H.id,H.st==='fly'?1:0,r2(H.x),r2(H.y),r2(H.z),r2(H.a),HMK.indexOf(H.mk),H.pilot==='P'?0:H.pilot&&H.pilot.pos?H.pilot.id:H.pilot?-1:-2,Math.round(H.fuel),H.ammo,Math.round(H.hp)]),V:JV.map(j=>[r2(j.x),r2(j.y),r2(j.z)])};
  for(const G of NET.guests.values())if(G.ready)netTo(G,msg);}}
}
function trcTick(dt){for(let i=TRC.length-1;i>=0;i--){TRC[i].t-=dt;if(TRC[i].t<=0){scene.remove(TRC[i].m);TRC[i].m.geometry.dispose();TRC[i].m.material.dispose();TRC.splice(i,1);}}}
// ---------- vadība ----------
const _move11=move;move=function(dt){if(heliMode){heliFly(dt);return;}_move11(dt);};
const _updateCamera11=updateCamera;updateCamera=function(){if(!heliMode)return _updateCamera11();const H=heliMode,fx=-Math.sin(yaw),fz=-Math.cos(yaw);player.visible=false;
 camera.position.set(H.x-fx*12,H.y+5+pitch*5,H.z-fz*12);camera.lookAt(H.x+fx*10,H.y-1+pitch*8,H.z+fz*10);};
const _hit11=hit;hit=function(){if(heliMode){heliFire();return;}_hit11();};
const _damagePlayer11=damagePlayer;damagePlayer=function(d,s,p){if(heliMode)return;_damagePlayer11(d,s,p);};
const _gameOver11=gameOver;gameOver=function(){if(heliMode)exitHeli();_gameOver11();};
const _toggleBuild11=toggleBuild;toggleBuild=function(){if(heliMode)return;_toggleBuild11();};
{const bm=$('bmb');bm.addEventListener('pointerdown',()=>{if(heliMode)hDown=true;});['pointerup','pointercancel','pointerleave'].forEach(n=>bm.addEventListener(n,()=>{hDown=false;}));}
const _renderW11=renderW;renderW=function(){_renderW11();if(!TOUCH||!heliMode)return;$('atk').innerHTML='🔫<small>'+heliMode.ammo+'</small>';$('bmb').textContent='⬇';};
function heliNear(){const px=player.position.x,pz=player.position.z;if(NET.role==='guest'){for(const [id,o] of netHelis)if(o.st===0&&Math.hypot(o.x-px,o.z-pz)<5.5)return{id,mk:o.mk,f:o.fuel,a:o.ammo};return null;}
 for(const H of HELIS)if(H.st==='park'&&Math.hypot(H.x-px,H.z-pz)<5.5&&Math.abs(H.y-pY)<2)return{id:H.id,mk:H.mk,f:Math.round(H.fuel),a:H.ammo,H};return null;}
const _nearInter11=nearInter;nearInter=function(){if(heliMode)return{type:'hland'};if(!inTank&&!(typeof jetMode!=='undefined'&&jetMode)&&!paraMode){const h=heliNear();if(h)return{type:'heli',h};}return _nearInter11();};
const _updateHint11=updateHint;updateHint=function(){const o=nearInter(),h=$('hint');
 if(o&&o.type==='hland'){const H=heliMode;h.textContent=tf('heli_fly',{f:Math.round(H.fuel),a:H.ammo,h:Math.round(H.hp)});h.style.display='block';setAct('🛬');return;}
 if(o&&o.type==='heli'){h.textContent=(TOUCH?'':'E / ')+tf('heli_in',{m:t('hm_'+o.h.mk),f:o.h.f,a:o.h.a});h.style.display='block';setAct('🚁');return;}_updateHint11();};
const _interact11=interact;interact=function(){if(!active)return _interact11();const o=nearInter();
 if(o&&o.type==='hland'){const H=heliMode;if(H.y<=heliGround(H.x,H.z)+.3)exitHeli();else H.auto=true;return;}
 if(o&&o.type==='heli'){if(NET.role==='guest')netSend({t:'heli',id:o.h.id});else{const H=o.h.H;if(H.res){H.res.heliGoal=null;H.res=null;}enterHeli(H);}return;}
 _interact11();};
const _updateFx11=updateFx;updateFx=function(dt){_updateFx11(dt);if(NET.role!=='guest'&&(active||NET.guests.size))heliTick(dt);else if(NET.role==='guest')guestHelis(dt);trcTick(dt);};
const _start11=start;start=function(){heliMode=null;hDown=false;heliFog(false);clearHelis();_start11();for(let i=0;i<HSLOTS.length;i++)spawnHeli(i);for(const o of HPOB){remOb(o);addOb(o);}
 for(const b of humans)if(!b.trader&&!b.team.calm&&!b.team.farm&&Math.random()<.12){b.I.has.jav=true;b.I.ammo.jav=2;}};
// ---------- kopīgā spēle ----------
const netHelis=new Map(),netJV=[];
function guestHelis(dt){const k=Math.min(1,dt*10);for(const [id,o] of netHelis){if(heliMode&&heliMode.id===id)continue;o.g.position.x+=(o.x-o.g.position.x)*k;o.g.position.y+=(o.y-o.g.position.y)*k;o.g.position.z+=(o.z-o.g.position.z)*k;o.g.rotation.y=lerpA(o.g.rotation.y,o.a,k);if(o.st===1)heliSpin({g:o.g},dt,true);}}
const _netHostMsg11=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='heli'){const H=HELIS.find(q=>q.id===d.id);if(!H||H.st!=='park'||G.dead){netTo(G,{t:'msg',s:t('jet_busy').replace('✈️','🚁'),d:1.5});return;}if(H.res){H.res.heliGoal=null;H.res=null;}H.st='fly';H.pilot=G;G.inHeli=H;remOb(H.ob);const s=loadHeli(H,G.I);if(stealCheck(H,PT))netTo(G,{t:'msg',s:t('heli_mine'),d:3});H.owner=PT;
  netTo(G,{t:'heliok',id:H.id,x:H.x,y:H.y,z:H.z,a:H.a,mk:H.mk,f:H.fuel,am:H.ammo,hp:H.hp});if(s)netTo(G,{t:'msg',s,d:3});netMe(G);return;}
 if(d&&G.ready&&d.t==='hf'){const H=HELIS.find(q=>q.id===d.id);if(H&&H.pilot===G&&H.ammo>0&&Array.isArray(d.a)){H.ammo--;const a=d.a.map(Number);heliShot(H,...a,PT,true);}return;}
 if(d&&G.ready&&d.t==='hexit'){const H=HELIS.find(q=>q.id===d.id);if(H&&H.pilot===G){H.x=+d.x;H.y=+d.y;H.z=+d.z;H.a=+d.a;H.fuel=Math.min(H.fuel,+d.f);heliPark(H);H.owner=PT;H.g.position.set(H.x,H.y,H.z);G.inHeli=null;}return;}
 _netHostMsg11(G,d);};
const _netHostFrame11=netHostFrame;netHostFrame=function(dt){_netHostFrame11(dt);for(const G of NET.guests.values())if(G.inHeli&&G.mesh){G.mesh.visible=false;G.lab.visible=G.bar.bg.visible=G.bar.f.visible=false;}};
const _netGuestMsg11=netGuestMsg;netGuestMsg=function(d){
 if(d&&d.t==='ht'){const seen=new Set();for(const [id,st,x,y,z,a,mi,pid,fuel,ammo,hp] of d.H){seen.add(id);let o=netHelis.get(id);if(!o){o={g:heliMesh(HMK[mi])};o.g.position.set(x,y,z);netHelis.set(id,o);}Object.assign(o,{st,x,y,z,a,mk:HMK[mi],pid,fuel,ammo,hp});
   if(heliMode&&heliMode.id===id){heliMode.ammo=Math.min(heliMode.ammo,ammo);heliMode.hp=hp;heliMode.fuel=Math.min(heliMode.fuel,fuel+1);}}
  for(const [id,o] of netHelis)if(!seen.has(id)){scene.remove(o.g);freeObj(o.g);netHelis.delete(id);}
  while(netJV.length<d.V.length){const m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0x8bc34a}));m.scale.setScalar(1.5);scene.add(m);netJV.push(m);}netJV.forEach((m,i)=>{m.visible=i<d.V.length;if(m.visible)m.position.set(...d.V[i]);});return;}
 if(d&&d.t==='heliok'){const o=netHelis.get(d.id);if(!o)return;enterHeli({id:d.id,isHeli:true,g:o.g,x:d.x,y:d.y,z:d.z,a:d.a,mk:d.mk,m:HM[d.mk]||HM.pred,fuel:d.f,ammo:d.am,hp:d.hp,vx:0,vz:0});return;}
 if(d&&d.t==='hdown'){if(heliMode){const H=heliMode;heliMode=null;heliFog(false);player.position.set(H.x,0,H.z);pY=H.y+1;if(H.y>3){paraMode=true;chute().visible=true;}say(t('heli_down'),3);}return;}
 if(d&&d.t==='wel'){heliMode=null;heliFog(false);for(const o of netHelis.values()){scene.remove(o.g);freeObj(o.g);}netHelis.clear();}
 _netGuestMsg11(d);if(d&&d.t==='wel')for(const o of HPOB){remOb(o);addOb(o);}};
const _netExtraEv211=netExtraEv2;netExtraEv2=function(e){if(e.e==='tr'){tracer(...e.a);return;}_netExtraEv211(e);};
// minikartē: 🚁 helikopteri; Plēsoņas radars rāda ienaidniekus
const _drawMap11=drawMap;drawMap=function(){_drawMap11();const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R,X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc;
 g.font=Math.round(W*.07)+'px serif';const L=NET.role==='guest'?[...netHelis.values()].map(o=>[o.x,o.z]):HELIS.filter(H=>H.st!=='gone').map(H=>[H.x,H.z]);for(const [x,z] of L)g.fillText('🚁',X(x),Y(z));
 if(heliMode&&heliMode.m.radar){g.fillStyle='#ff1744';const P=NET.role==='guest'?[...netMon.values()].map(o=>o.z.position).concat([...netBot.values()].filter(o=>o.rel===2).map(o=>o.g.position)):zombies.filter(z=>!z.userData.dead).map(z=>z.position).concat(humans.filter(b=>!b.dead&&PT.enemies.has(b.team)).map(b=>b.g.position));
  for(const p of P)if(Math.hypot(p.x-player.position.x,p.z-player.position.z)<150){g.beginPath();g.arc(X(p.x),Y(p.z),3,0,6.283);g.fill();}}};
// ---------- versiju pārbaude kopīgajā spēlē ----------
Object.assign(T.lv,{oldv:'⚠️ Tev ir veca spēles versija, tāpēc daļa lietu nestrādā. Aizver lapu un atver saiti vēlreiz.'});Object.assign(T.en,{oldv:'⚠️ You have an old version of the game, so some things do not work. Close the page and open the link again.'});
const _netHostMsg12=netHostMsg;netHostMsg=function(G,d){if(d&&d.t==='hello'){_netHostMsg12(G,d);const gv=+d.v||0,hv=+MWV||0;if(gv<hv){netTo(G,{t:'msg',s:t('oldv'),d:8});netTo(G,{t:'ver',v:MWV});}else if(gv>hv)say(t('oldv'),8);return;}_netHostMsg12(G,d);};
// jaunāka draugu versija pati pārlādējas ar svaigu lapu (vienu reizi)
const _netGuestMsg12=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='ver'){let n=0;try{n=+sessionStorage.getItem('mw_rl')||0;}catch(e){}if((+d.v||0)>(+MWV||0)&&n<2){try{sessionStorage.setItem('mw_rl',n+1);}catch(e){}const m=location.search.match(/[?&]join=([a-z0-9]+)/);location.replace(location.pathname+'?join='+(m?m[1]:'')+'&r='+Date.now());}return;}_netGuestMsg12(d);};
