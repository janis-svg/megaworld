// 43_paveles.js - Pavēles botiem ar vienu pogu 📣: Nāc šurp, Uzbrūkam, Palīdzību, Uz bāzi, 📍 Atzīme.
// Katra pavēle atstāj atzīmi tavā vietā, ko redz tikai komandas biedri (kartē un pasaulē 30 s), un boti zina, kur tu esi. Pavēles dod tikai cilvēki.
Object.assign(T.lv,{o_come:'Nāc šurp!',o_atk:'Uzbrūkam!',o_help:'Palīdzību!',o_base:'Uz bāzi!',o_pin:'Esmu šeit',o_n:'📣 {k} - klausa {n}',o_none:'📣 Tuvumā nav neviena, kas klausa',o_nobase:'📣 Komandai vēl nav bāzes',o_noen:'📣 Tuvumā nav pretinieku: boti nāk pie tevis'});
Object.assign(T.en,{o_come:'Come here!',o_atk:'Attack!',o_help:'Help!',o_base:'Back to base!',o_pin:'I am here',o_n:'📣 {k} - {n} following',o_none:'📣 Nobody nearby to follow orders',o_nobase:'📣 Your team has no base yet',o_noen:'📣 No enemies nearby: bots come to you'});
const ORDK=[['come','👋',0x4fc3f7],['atk','⚔️',0xff5252],['help','🆘',0xffb300],['base','🏠',0x66bb6a],['pin','📍',0xffffff]];
const ORDI={};for(const[k,i,c]of ORDK)ORDI[k]={i,c};
// ---------- poga un izvēlne ----------
const cmdB=document.createElement('button');cmdB.className='tbtn';cmdB.id='cmdb';cmdB.textContent='📣';document.body.appendChild(cmdB);
const cmdP=document.createElement('div');cmdP.id='cmdp';cmdP.className='panel';document.body.appendChild(cmdP);let cmdPT=0;
function cmdRender(){cmdP.innerHTML=ORDK.map(([k,i],n)=>'<button class="corner" data-o="'+k+'">'+i+' '+t('o_'+k)+'<small>'+(n+1)+'</small></button>').join('');
 cmdP.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();cmdPick(b.dataset.o);});}
function cmdOpen(on){if(on===undefined)on=cmdP.style.display!=='flex';if(on){cmdRender();cmdPT=gtime+6;}cmdP.style.display=on?'flex':'none';cmdB.classList.toggle('on',on);}
cmdB.onpointerdown=e=>{e.stopPropagation();e.preventDefault();if(active)cmdOpen();};
function cmdPick(k){cmdOpen(false);if(!active)return;sfx('pick');if(navigator.vibrate)try{navigator.vibrate(25);}catch(e){}
 if(NET.role==='guest'){netSend({t:'ord',k});return;}ordExec(PT,{P:1},k);}
// datorā: C atver, 1-5 izvēlas
document.addEventListener('keydown',e=>{if(!active||document.activeElement.tagName==='INPUT')return;
 if(e.code==='KeyC'&&!e.repeat){cmdOpen();return;}
 if(cmdP.style.display==='flex'){const n=+e.key;if(n>=1&&n<=ORDK.length){e.stopImmediatePropagation();e.preventDefault();cmdPick(ORDK[n-1][0]);}}},true);
// ---------- izpilde (hostā) ----------
const cmdrPos=c=>c.P?player.position:(c.G&&!c.G.dead?c.G.pos:null);
const isCarrier=b=>typeof FL!=='undefined'&&FL.some(F=>F.carrier===b);
const canOrder=b=>!b.dead&&!b.jet&&!b.heli&&!b.para&&!b.tankV&&!b.inside&&!b.trader&&!isCarrier(b);
function ordExec(Tm,c,k){const cp=cmdrPos(c);if(!cp||!Tm)return;const tell=s=>{if(c.P)say(s,2.5);else netTo(c.G,{t:'msg',s,d:2.5});};
 const name=c.P?($('nickname').value||'?'):c.G.name;pingAdd(Tm,cp.x,cp.z,k,name);if(k==='pin')return;
 const war=typeof isWar==='function'&&isWar();
 const L=Tm.members.filter(canOrder).map(b=>({b,d:Math.hypot(b.g.position.x-cp.x,b.g.position.z-cp.z)})).sort((a,b)=>a.d-b.d);
 let pick=[],tx=null,tz=null,kk=k;
 if(k==='come')pick=L.slice(0,6);
 else if(k==='help')pick=L.filter(o=>o.d<150).slice(0,10);
 else if(k==='base'){const B=war?WB[ARMY.indexOf(Tm)]:Tm.base;if(!B){tell(t('o_nobase'));return;}tx=B.x;tz=B.z;pick=L.filter(o=>o.d<70);}
 else if(k==='atk'){pick=L.filter(o=>o.d<70).slice(0,15);if(pick.length<4)pick=L.slice(0,6);
  if(war){const E=FL.find(F=>F.team!==Tm);if(E){tx=E.x;tz=E.z;}else{const B=WB[1-ARMY.indexOf(Tm)];tx=B.x;tz=B.z;}}
  else{let best=null,bd=80;for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0)continue;const d=Math.hypot(z.position.x-cp.x,z.position.z-cp.z);if(d<bd){bd=d;best=z;}}
   for(const h of HL){if(h.team===Tm||!Tm.enemies.has(h.team))continue;const d=Math.hypot(h.p.x-cp.x,h.p.z-cp.z);if(d<bd){bd=d;best={position:h.p};}}
   if(best){tx=best.position.x;tz=best.position.z;}else{tell(t('o_noen'));kk='come';}}}
 if(!pick.length){tell(t('o_none'));return;}
 const dur={come:45,help:40,atk:60,base:60}[kk];
 pick.forEach((o,i)=>{const b=o.b;b.ord={k:kk,c,x:tx,z:tz,a:i*2.4,r:kk==='come'?2.5+i%3:kk==='help'?3+i%4:2+i%5,until:gtime+dur};b.th=0;});
 tell(tf('o_n',{k:ORDI[k].i+' '+t('o_'+k),n:pick.length}));}
const _botThink43=botThink;botThink=function(b){const o=b.ord;if(!o)return _botThink43(b);
 if(o.until<gtime||!canOrder(b)||!cmdrPos(o.c)){b.ord=null;return _botThink43(b);}
 const p=b.g.position,cp=cmdrPos(o.c),toMe=o.k==='come'||o.k==='help';
 const tx=(toMe?cp.x:o.x)+Math.cos(o.a)*o.r,tz=(toMe?cp.z:o.z)+Math.sin(o.a)*o.r,d=Math.hypot(tx-p.x,tz-p.z);
 const th=nearestThreat(b),eng=th&&(o.k==='help'||o.k==='atk'||th.ed<(o.k==='come'?18:14));
 b.follow=false;b.tankGoal=null;if(eng){b.tg=th.e;b.w=bestW(b,th.e,th.ed);}else b.tg=null;
 // uzbrukumā un palīgā pie mērķa cīnās kā parasti (pietuvojas līdz ieroča attālumam)
 if(eng&&((o.k==='atk'&&d<25)||(o.k==='help'&&d<12))){const W=WP[b.w];if(b.w==='hands'||th.ed>W.rng*.75)goal(b,th.e.p.x,th.e.p.z);else b.gx=null;return;}
 if(d>1.4)goal(b,tx,tz,d>30);else b.gx=null;};
// ---------- atzīmes: redz tikai komandas biedri ----------
let PINGS=[];const HPINGS=[];
function pingAdd(Tm,x,z,k,n){for(let i=HPINGS.length-1;i>=0;i--)if(HPINGS[i].n===n&&HPINGS[i].team===Tm)HPINGS.splice(i,1);HPINGS.push({team:Tm,x,z,k,n,until:gtime+30});pingSync();}
function pingSync(){for(let i=HPINGS.length-1;i>=0;i--)if(HPINGS[i].until<gtime)HPINGS.splice(i,1);
 const L=Tm=>HPINGS.filter(q=>q.team===Tm).map(q=>[Math.round(q.x),Math.round(q.z),q.k,Math.round(q.until-gtime),q.n]);
 PINGS=L(PT).map(([x,z,k,r,n])=>({x,z,k,n,until:gtime+r}));if(NET.role==='host')for(const G of NET.guests.values())if(G.ready)netTo(G,{t:'pg',L:L(GT(G))});pingDraw();}
const _netHostMsg43=netHostMsg;netHostMsg=function(G,d){if(d&&d.t==='ord'){if(ORDI[d.k]&&!G.dead)ordExec(GT(G),{G},d.k);return;}_netHostMsg43(G,d);};
const _netGuestMsg43=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='pg'){PINGS=d.L.map(([x,z,k,r,n])=>({x,z,k,n,until:gtime+r}));pingDraw();return;}_netGuestMsg43(d);};
// pasaulē: gaismas stabs ar ikonu un vārdu
const pingObj=new Map();
function pingSprite(k,n){const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');g.fillStyle='rgba(10,18,26,.75)';g.beginPath();g.roundRect?g.roundRect(4,8,248,80,18):g.rect(4,8,248,80);g.fill();
 g.font='48px serif';g.textAlign='left';g.textBaseline='middle';g.fillText(ORDI[k].i,14,50);g.font='bold 30px sans-serif';g.fillStyle='#fff';g.fillText(String(n).slice(0,10),80,50);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(3.2,1.2,1);s.renderOrder=5;return s;}
function pingDraw(){const keep=new Set();for(const q of PINGS){const key=q.n+'|'+q.k+'|'+q.x+'|'+q.z;keep.add(key);if(pingObj.has(key))continue;
  const g=new THREE.Group(),beam=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,14,8,1,true),new THREE.MeshBasicMaterial({color:ORDI[q.k].c,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));beam.position.y=7;g.add(beam);
  const s=pingSprite(q.k,q.n);s.position.y=4.2;g.add(s);g.position.set(q.x,0,q.z);scene.add(g);pingObj.set(key,{g,q});}
 for(const[key,o]of pingObj)if(!keep.has(key)){scene.remove(o.g);o.g.traverse(c=>{if(c.material){if(c.material.map)c.material.map.dispose();c.material.dispose();}if(c.geometry)c.geometry.dispose();});pingObj.delete(key);}}
// kartē: pulsējošs aplis ar ikonu
const _drawMap43=drawMap;drawMap=function(){_drawMap43();if(!PINGS.length)return;const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R;
 g.textAlign='center';g.textBaseline='middle';const pr=W*(.03+.012*Math.sin(clock.elapsedTime*6));
 for(const q of PINGS){const x=W/2+(q.x-cx)*sc,y=W/2+(q.z-cz)*sc;if(x<0||y<0||x>W||y>W)continue;g.strokeStyle='#'+new THREE.Color(ORDI[q.k].c).getHexString();g.lineWidth=3;g.beginPath();g.arc(x,y,pr,0,6.283);g.stroke();g.font=Math.round(W*.07)+'px serif';g.fillText(ORDI[q.k].i,x,y-W*.06);}};
// atzīmes noveco; izvēlne aizveras pati
const _updateFx43=updateFx;updateFx=function(dt){_updateFx43(dt);if(cmdP.style.display==='flex'&&gtime>cmdPT)cmdOpen(false);
 if(PINGS.some(q=>q.until<gtime)){PINGS=PINGS.filter(q=>q.until>=gtime);pingDraw();}if(NET.role!=='guest'&&HPINGS.some(q=>q.until<gtime))pingSync();
 for(const o of pingObj.values()){o.g.children[0].material.opacity=.25+.15*Math.sin(clock.elapsedTime*4);}};
