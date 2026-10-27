// 46_izdzivosana_no_kara.js - Kara spēles lietas arī izdzīvošanā: novērošanas torņi krustojumos (ar snaipera šauteni), bandas brauc ar tankiem un bruņumašīnām,
// boti bēg no molotova uguns, pamanītie bandīti un lielie briesmoņi kartē (3 min), radio brīdinājumi komandai, gaisa piegādes ar izpletni
Object.assign(T.lv,{sv_canib:'📻 Redzam cilvēkēdāju! Vajag 2 raķetes vai Javelin.',sv_gang:'📻 Bandīti tuvojas: {n}!',sv_wolf:'📻 Zombvilks tuvumā!',sv_tank:'📻 Bandīti brauc ar tehniku!',sv_tw:'🗼 Krustojumos ir novērošanas torņi: no augšas redz tālu, augšā snaipera šautene'});
Object.assign(T.en,{sv_canib:'📻 Cannibal spotted! You need 2 rockets or a Javelin.',sv_gang:'📻 Bandits approaching: {n}!',sv_wolf:'📻 Zombie wolf nearby!',sv_tank:'📻 Bandits are driving vehicles!',sv_tw:'🗼 Watchtowers stand at crossroads: you see far from the top, a sniper rifle waits up there'});
const surv=()=>!(typeof isWar==='function'&&isWar());
// ---------- 1. novērošanas torņi četros krustojumos ----------
const STW=[[-60,-60],[60,60],[-100,100],[100,-100]];
function survTowers(){TOWERS.length=0;for(const g of WG){scene.remove(g);freeObj(g);}WG=[];for(const o of WOB)remOb(o);WOB=[];
 for(const[x,z]of STW)watchTower(null,x,z);for(const o of WOB)addOb(o);}
const _start46=start;start=function(){_start46();if(surv()&&NET.role!=='guest'){survTowers();svSpot.clear();svSaid={};svAirT=90;setTimeout(()=>{if(active&&surv())say(t('sv_tw'),4);},14000);}};
// draugs uzbūvē tos pašus torņus, saņemot sveicienu
const _netWelcome46=netWelcome;netWelcome=function(G){_netWelcome46(G);if(surv())netTo(G,{t:'stw'});};
const _netGuestMsg46=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='stw'){if(surv())survTowers();return;}
 if(d&&d.t==='sp2'){svMarks=d.L;return;}_netGuestMsg46(d);};
// ---------- 2. bandas brauc ar tehniku (līdz 2 vienlaikus), boti bēg no molotova uguns ----------
const _botThink46=botThink;botThink=function(b){if(!surv()||b.ord||b.trader||b.jet||b.para||b.heli||b.tankV||b.jetGoal||b.heliGoal)return _botThink46(b);
 const p=b.g.position,fi=typeof inMoloFire==='function'&&inMoloFire(p.x,p.z);
 if(fi){const dx=p.x-fi.x,dz=p.z-fi.z,l=Math.hypot(dx,dz)||1;b.follow=false;b.tg=null;goal(b,fi.x+dx/l*(fi.w+3),fi.z+dz/l*(fi.d+3),false);return;}
 if(b.tankGoal){const t=b.tankGoal;if(t.dead||t.driver||t===inTank||t.res!==b)b.tankGoal=null;else{if(Math.hypot(p.x-t.g.position.x,p.z-t.g.position.z)<3.5){botTankBoard(b,t);return;}b.tg=null;b.follow=false;goal(b,t.g.position.x+2.5,t.g.position.z,false);return;}}
 return _botThink46(b);};
function survVehPick(){const driven=tanks.filter(t=>t.driver).length+humans.filter(b=>b.tankGoal).length;if(driven>=2)return;
 for(const t of tanks){if(t.dead||t.driver||t.res||t===inTank||!(t.kind==='apc'?(t.ammo||0)>0:(t.shells||0)>0))continue;const tp=t.g.position;let best=null,bd=50;
  for(const b of humans){if(b.dead||b.inside||b.trader||b.team.isPlayer||b.team.calm||b.team.pal||b.team.farm||!b.team.enemies.size||b.jetGoal||b.heliGoal||b.tankGoal||b.ord)continue;
   const d=Math.hypot(b.g.position.x-tp.x,b.g.position.z-tp.z);if(d<bd){bd=d;best=b;}}
  if(best){best.tankGoal=t;t.res=best;return;}}}
function survTankTick(dt){for(const t of tanks)if(t.driver){if(t.driver.dead||t.dead){t.driver.tankV=null;t.driver.inside=false;t.driver=null;}else if(!(t.kind==='apc'?(t.ammo||0)>0:(t.shells||0)>0)){const d=t.driver;t.driver=null;d.tankV=null;d.inside=false;d.g.position.x+=2.5;addOb(t.ob);}else botTankDrive(t,t.driver,dt);}
 for(let i=BSH.length-1;i>=0;i--){const s=BSH[i],p=s.m.position;s.life-=dt;p.x+=s.vx*dt;p.z+=s.vz*dt;if(s.life<=0||wallAt(p.x,p.z,1.9)){scene.remove(s.m);BSH.splice(i,1);jetBoom(p.x,p.z,s.T,false,.8,.8);}}}
// ---------- 3. izlūkošana: ko redz tava komanda, parādās kartē 3 minūtes ----------
const svSpot=new Map();let svMarks=[],svSaid={},svT=0,svNetT=0;
function svRadio(k,o){if(gtime<(svSaid[k]||0))return;svSaid[k]=gtime+40;radio(PT,k,o);}
function svEyes(){const E=[];if(active)E.push(player.position);for(const G of NET.guests.values())if(G.ready&&!G.dead&&GT(G)===PT)E.push(G.pos);for(const b of PT.members)if(!b.dead&&!b.inside)E.push(b.g.position);return E;}
function svTick(){const E=svEyes(),R=isNight()?24:38,seen=(x,z)=>E.some(e=>Math.abs(e.x-x)<R&&Math.abs(e.z-z)<R&&Math.hypot(e.x-x,e.z-z)<R);let gang=0;
 for(const h of HL){if(!h.b||h.team===PT||!PT.enemies.has(h.team)||!seen(h.p.x,h.p.z))continue;svSpot.set('b'+h.b.nid,{x:h.p.x,z:h.p.z,t:gtime,k:h.b.tankV?'v':'s'});gang++;if(h.b.tankV)svRadio('sv_tank');}
 for(const t of tanks){const d=t.driver;if(t.dead||!d||!PT.enemies.has(d.team)||!seen(t.g.position.x,t.g.position.z))continue;svSpot.set('t'+tanks.indexOf(t),{x:t.g.position.x,z:t.g.position.z,t:gtime,k:'v'});svRadio('sv_tank');}
 for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0||(u.kind!=='c'&&u.kind!=='zw'))continue;if(!seen(z.position.x,z.position.z))continue;svSpot.set('m'+z.id,{x:z.position.x,z:z.position.z,t:gtime,k:u.kind});svRadio(u.kind==='c'?'sv_canib':'sv_wolf');}
 if(gang>=3)svRadio('sv_gang',{n:gang});
 for(const[k,m]of svSpot)if(gtime-m.t>180)svSpot.delete(k);
 svMarks=[...svSpot.values()].map(m=>[Math.round(m.x),Math.round(m.z),Math.round(gtime-m.t),m.k]);
 if(NET.role==='host'&&(svNetT-=1)<=0){svNetT=2;for(const G of NET.guests.values())if(G.ready&&GT(G)===PT)netTo(G,{t:'sp2',L:svMarks});}}
const _drawMap46=drawMap;drawMap=function(){_drawMap46();if(!surv()||!active)return;const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R,X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc;
 g.textAlign='center';g.textBaseline='middle';
 for(const[x,z,a,k]of svMarks){g.globalAlpha=Math.max(.25,1-a/180);if(k==='s'){g.fillStyle='#ff3b3b';g.beginPath();g.arc(X(x),Y(z),3.2,0,6.283);g.fill();g.strokeStyle='#000';g.lineWidth=1;g.stroke();}
  else if(k==='v'){g.fillStyle='#ff3b3b';g.fillRect(X(x)-4,Y(z)-4,8,8);g.strokeStyle='#000';g.strokeRect(X(x)-4,Y(z)-4,8,8);}
  else{g.font=Math.round(W*.065)+'px serif';g.fillText(k==='c'?'👹':'🐺',X(x),Y(z));}}g.globalAlpha=1;
 // novērošanas torņi un gaisa piegādes
 g.font=Math.round(W*.05)+'px serif';for(const T of TOWERS)if(!T.dead)g.fillText('🗼',X(T.x),Y(T.z));
 const air=NET.role==='guest'?[...netDr.values()].filter(o=>o.g.children.length>2&&!o.g.userData.nva).map(o=>o.g.position):drops.filter(d=>d.chute||d.air>0).map(d=>d.m.position);for(const p of air)g.fillText('🪂',X(p.x),Y(p.z));};
// ---------- 4. gaisa piegāde ar izpletni ik ~2,5 min ----------
const SVDROP=['snip','jav','a_jav','a_rpg','harmor','m16','a_m16','med','armor'];let svAirT=90;
function svAirTick(dt){svAirT-=dt;if(svAirT<=0){svAirT=150;const[x,z]=roadPoint(player.position.x,player.position.z,110),d=dropItem(x,z,'w:'+SVDROP[Math.floor(Math.random()*SVDROP.length)]);d.air=34;d.m.position.y=34;
  const ch=new THREE.Mesh(new THREE.SphereGeometry(1.4,10,6,0,6.283,0,Math.PI/2),mat(0xff7043,.8));ch.position.y=2.2;ch.scale.y=.6;d.m.add(ch);d.chute=ch;radio(PT,'air_drop');}
 for(const d of drops)if(d.air>0){d.air=Math.max(0,d.air-dt*2.5);d.m.position.y=.4+d.air;if(!d.air&&d.chute){d.m.remove(d.chute);d.chute=null;}}}
// ---------- cikls ----------
let svVehT=3;
const _updateFx46=updateFx;updateFx=function(dt){_updateFx46(dt);if(!surv())return;rifleTick();
 if(NET.role==='guest'||!(active||NET.guests.size))return;
 survTankTick(dt);if((svVehT-=dt)<=0){svVehT=3;survVehPick();}if((svT-=dt)<=0){svT=1;svTick();}svAirTick(dt);};
