// 17_tikls.js - Kopīgā spēle (multiplayer) līdz 5 spēlētājiem.
// Saimnieks (kurš uzaicina) skaita visu pasauli; viesi sūta savu kustību un darbības, un saņem stāvokli 10x sekundē.
// Savienojums caur PeerJS (bezmaksas starpnieks, lai pārlūki atrastu viens otru).
const KIND=['z','w','zw','s','c','f'],MAXG=4,PCOL=[0x3a7ab8,0x27ae60,0xe67e22,0x8e44ad,0xf1c40f];
const r2=v=>Math.round(v*100)/100;
// savienojuma serveri: vairāki STUN (Google, Cloudflare) un ExpressTURN starpnieks (bezmaksas 1000 GB/mēn) tīkliem, kas ierīces izolē vai ir dažādi
const PEERCFG={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']},{urls:'stun:stun.cloudflare.com:3478'},{urls:['turn:free.expressturn.com:3478','turn:free.expressturn.com:3478?transport=tcp'],username:'000000002108404576',credential:'OOW2FE8VceiGAmUgjcKAmgcjZXc='}]};
const GT=G=>G&&G.team||PT; // drauga komanda (karā var būt arī pretējā armijā)
// spēles versija (no ?v= skripta adresē): draugam jābūt tai pašai, citādi viņa pārlūks ielādē jaunāko
const MWV=((document.querySelector('script[src*="01_sakums"]')||{}).src||'').replace(/.*[?&]v=(\d+).*/,'$1');
let peer=null,hostConn=null,netT=0,netBiT=0,netDoorT=0,netSt=0,netUiT=0,netQ=[],netGone=[],netCurOwner=0,netNextId=1,netLastP=null;
const doorState=new Map(),netMon=new Map(),netBot=new Map(),netPl=new Map(),netTk=new Map(),netTeams=new Map(),netVB=[];
function netSend(m){if(hostConn&&hostConn.open)hostConn.send(m);}
function netTo(G,m){if(G.conn&&G.conn.open)G.conn.send(m);}
function netGuestCenters(){const a=[];for(const G of NET.guests.values())if(G.ready)a.push(G.pos);return a;}
function code6(){const c='abcdefghjkmnpqrstuvwxyz23456789';let s='';for(let i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return s;}
function joinLink(){return location.origin+location.pathname+'?join='+NET.code;}
function avatarMesh(col){
 const g=new THREE.Group(),legs=[];
 const torso=cube(.7,.8,.36,col,.75);torso.position.y=1.1;g.add(torso);
 const head=cube(.46,.46,.44,0xe0b48f,.8);head.position.y=1.75;g.add(head);
 const hair=cube(.48,.12,.46,0x5a3a1c,.9);hair.position.y=2.0;g.add(hair);
 for(const x of [-.18,.18]){const l=cube(.26,.68,.28,0x1f2d42,.9);l.position.set(x,.4,0);g.add(l);legs.push(l);}
 for(const x of [-.48,.48]){const a=cube(.2,.62,.24,col,.8);a.position.set(x,1.1,0);g.add(a);}
 g.userData.legs=legs;scene.add(g);return g;
}
function meshFor(k){return k==='z'?zombieMesh():k==='w'?wolfMesh():k==='zw'?zwMesh():k==='s'?skelMesh():k==='c'?cannMesh():forestMesh();}
function lerpA(a,b,k){let d=b-a;d=Math.atan2(Math.sin(d),Math.cos(d));return a+d*k;}

// ---------- saimnieks ----------
function netHost(){
 if(NET.role)return;if(typeof Peer==='undefined'){say(t('mp_nolib'));return;}
 NET.code=code6();NET.role='host';NET.status=t('mp_wait');renderMP();
 peer=new Peer('megaworld-'+NET.code,{debug:0,config:PEERCFG});
 peer.on('open',()=>{NET.status='';renderMP();});
 // ja telefons uz brīdi pazaudē savienojumu ar serveri (piem., pārslēdzoties uz citu lietotni, lai nosūtītu saiti), pieslēdzas atpakaļ ar to pašu kodu
 peer.on('disconnected',()=>{NET.status=t('mp_recon');renderMP();netRecon();});
 peer.on('error',e=>{const ty=e&&e.type;if(ty==='unavailable-id'){peer.destroy();NET.role=null;netHost();return;}
  if(ty==='network'||ty==='server-error'||ty==='socket-error'||ty==='socket-closed'||ty==='disconnected'){NET.status=t('mp_recon');renderMP();netRecon();return;}
  NET.status=t('mp_err')+' ('+(ty||e)+')';renderMP();});
 peer.on('connection',conn=>{
  // tā paša drauga atkārtots mēģinājums un vecie neizdevušies mēģinājumi vietu neaizņem
  for(const O of [...NET.guests.values()])if(!O.ready&&(O.conn.peer===conn.peer||Date.now()-O.t0>20000)){try{O.conn.close();}catch(e){}NET.guests.delete(O.id);}
  const others=new Set([...NET.guests.values()].map(O=>O.conn.peer));others.delete(conn.peer);
  if(others.size>=MAXG){conn.on('open',()=>{conn.send({t:'full'});setTimeout(()=>conn.close(),500);});return;}
  const id=netNextId++,G={id,conn,t0:Date.now(),name:'?',pos:new THREE.Vector3(player.position.x+2,0,player.position.z+2),y:0,yaw:0,hp:100,dead:false,I:newInv(),ready:false,col:PCOL[id%5]};
  conn.on('data',d=>netHostMsg(G,d));
  conn.on('close',()=>netDropGuest(G));
  NET.guests.set(id,G);
 });
}
let reconT=null;
function netRecon(){if(reconT||!peer||peer.destroyed)return;reconT=setTimeout(()=>{reconT=null;if(!peer||peer.destroyed||NET.role!=='host')return;if(peer.disconnected){try{peer.reconnect();}catch(e){}setTimeout(()=>{if(peer&&peer.disconnected)netRecon();},4000);}},1500);}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&NET.role==='host'&&peer&&peer.disconnected)netRecon();});
function netStop(){
 if(NET.role==='host'){for(const G of [...NET.guests.values()]){netTo(G,{t:'bye'});netDropGuest(G);}}
 if(peer)peer.destroy();peer=null;NET.role=null;renderMP();
}
function netDropGuest(G){
 if(!NET.guests.has(G.id))return;NET.guests.delete(G.id);
 if(G.mesh){scene.remove(G.mesh);freeObj(G.mesh);}delLabel(G.lab);delBar(G.bar);
 if(G.ready)sayAll(tf('mp_left',{n:G.name}));renderMP();
}
function sayAll(s,d){say(s,d);if(NET.role==='host')netQ.push({e:'msg',s,d});}
function netHostMsg(G,d){
 if(!d||!d.t)return;
 if(d.t==='hello'){for(const O of [...NET.guests.values()])if(O!==G&&O.conn.peer===G.conn.peer)netDropGuest(O);G.name=String(d.name||'Draugs').slice(0,16);G.mesh=avatarMesh(G.col);G.lab=mkLabel('★ '+G.name,G.col);G.bar=mkBar(.9,0x2ecc71);G.ready=true;netWelcome(G);sayAll(tf('mp_joined',{n:G.name}));renderMP();return;}
 if(!G.ready)return;
 if(d.t==='p'){if(G.dead)return;G.pos.set(+d.x||0,0,+d.z||0);clampW(G.pos);G.y=+d.y||0;G.yaw=+d.a||0;G.mv=d.m;return;}
 if(d.t==='fire')return guestFire(G,d);
 if(d.t==='melee')return guestMelee(G,+d.a||0);
 if(d.t==='act')return guestAct(G);
 if(d.t==='bld')return guestBuild(G,d);
 if(d.t==='med'){if(G.I.meds>0&&G.hp<100&&!G.dead){G.I.meds--;G.hp=Math.min(100,G.hp+40);netTo(G,{t:'msg',s:t('healed')});netMe(G);}return;}
}
function netWelcome(G){
 const bl=[];blocks.forEach(c=>c.forEach(b=>bl.push([b.x,b.z,b.y0,b.door?1:0,b.team.id,b.team.color,b.win?1:0])));bl.sort((a,b)=>a[2]-b[2]);
 const dr=[];for(const ch of chunks.values())for(const o of ch.inter)if(o.type==='door'&&(o.open||o.hp<100))dr.push([o.id,o.open?1:0,o.hp]);
 netTo(G,{t:'wel',id:G.id,col:G.col,pt:[PT.id,PT.color],h:r2(hour),d:day,bl,tk:[...taken],br:[...burnt],dr,sp:[r2(G.pos.x),r2(G.pos.z)]});
 netMe(G);
}
function netWelcomeAll(){for(const G of NET.guests.values()){if(!G.ready)continue;G.hp=100;G.dead=false;G.I=newInv();G.pos.set(player.position.x+2,0,player.position.z+2);netWelcome(G);}}
function netMe(G){netTo(G,{t:'me',hp:r2(G.hp),inv:G.I,bl:PT.blocks,di:PT.doorI||0,wi:PT.winI||0,dead:G.dead?1:0,sc:score});}
function damageGuest(G,dmg,src,pierce){
 if(G.dead||gtime<(G.invul||0))return;
 const a=pierce?0:Math.min(G.I.armor,dmg*.6);G.I.armor-=a;G.hp-=dmg-a;
 if(src&&src!==GT(G)){war(GT(G),src);GT(G).alarm={T:src,until:gtime+15};}
 if(G.hp<=0){G.hp=0;G.dead=true;G.respawn=gtime+5;netTo(G,{t:'msg',s:t('mp_died'),d:4});}
 netMe(G);
}
function guestFire(G,d){
 const w=d.w,W=WP[w];if(!W||w==='hands'||G.dead||!G.I.has[w]||G.I.ammo[w]<=0)return;
 G.I.ammo[w]--;netCurOwner=G.id;
 for(let k=0;k<W.pel;k++){const a=(+d.a||0)+(Math.random()-.5)*W.sp*2,fx=-Math.sin(a),fz=-Math.cos(a);spawnBullet(G.pos.x+fx*.8,G.y+1.2,G.pos.z+fz*.8,fx,fz,W,GT(G),true);}
 netCurOwner=0;sfxAt(W.rocket?'rocket':'shoot',G.pos.x,G.pos.z,40);netMe(G);
}
function guestMelee(G,a){
 if(G.dead)return;const fx=-Math.sin(a),fz=-Math.cos(a);let tg=null,best=2.7,bot=false;
 for(const z of zombies){if(z.userData.rise>0||z.userData.dead)continue;const dx=z.position.x-G.pos.x,dz=z.position.z-G.pos.z,l=Math.hypot(dx,dz);if(l<best&&(dx*fx+dz*fz)/(l||1)>.05){best=l;tg=z;}}
 for(const b of humans){if(b.team===GT(G))continue;const dx=b.g.position.x-G.pos.x,dz=b.g.position.z-G.pos.z,l=Math.hypot(dx,dz);if(l<best&&(dx*fx+dz*fz)/(l||1)>.05){best=l;tg=b;bot=true;}}
 sfxAt('melee',G.pos.x,G.pos.z,25);if(!tg)return;
 if(bot)hurtBot(tg,25,GT(G),true);else dmgMonster(tg,25,true);
}
function guestAct(G){
 if(G.dead)return;const px=G.pos.x,pz=G.pos.z;let best=null,bd=1e9;
 for(const tk of tanks){const d=Math.hypot(tk.g.position.x-px,tk.g.position.z-pz);if(d<3.6&&d<bd){bd=d;best={type:'tank'};}}
 for(const ch of chunks.values())for(const o of ch.inter){const d=Math.hypot(o.x-px,o.z-pz);if(d<o.r&&d<bd){bd=d;best=o;}}
 for(const b of humans){if(b.team===PT||PT.enemies.has(b.team))continue;const d=Math.hypot(b.g.position.x-px,b.g.position.z-pz);if(d<2.6&&d<bd){bd=d;best={type:'bot',b};}}
 if(!best)best=findBurnable(px,pz);
 if(!best)return;
 if(best.type==='burn'){if((G.I.matches||0)<best.cost){netTo(G,{t:'msg',s:t('needm')+' ('+(G.I.matches||0)+'/'+best.cost+')'});return;}G.I.matches-=best.cost;startBurn(best.k,best.o,false);netMe(G);return;}
 if(best.type==='tank'){netTo(G,{t:'msg',s:t('mp_tank')});return;}
 if(best.type==='bot'){const m0=$('msg').textContent;askJoin(best.b);const m=$('msg').textContent;if(m!==m0)netTo(G,{t:'msg',s:m});return;}
 if(best.type==='door'){best.open=!best.open;best.piv.rotation.y=best.open?-Math.PI/2:0;best.dob.off=best.open;sfxAt('door',px,pz,30);return;}
 if(best.open)return;
 best.open=true;taken.add(best.id);if(best.mesh)best.mesh.position[best.ax||'x']+=best.sgn*.4;
 if(!best.loot.length){netTo(G,{t:'msg',s:t('empty')});return;}
 const parts=best.loot.map(k=>giveLoot(k,G.I,PT));best.loot=[];netTo(G,{t:'msg',s:t('found')+' '+parts.join(', ')});netMe(G);renderInv();
}
function guestBuild(G,d){
 if(G.dead)return;const x=Math.round(+d.x),z=Math.round(+d.z);
 if(Math.hypot(x-G.pos.x,z-G.pos.z)>4)return;
 const tool=['blk','door','win'].includes(d.tool)?d.tool:(d.d?'door':'blk');
 const err=tryBuild(x,z,tool,!!d.r);if(err)netTo(G,{t:'msg',s:err,d:1.2});
 netMe(G);renderInv();
}
function netHostFrame(dt){
 for(const G of NET.guests.values()){
  if(!G.ready)continue;
  if(G.dead&&gtime>G.respawn){G.dead=false;G.hp=100;G.invul=gtime+4;const b=GT(G).base;G.pos.set((b?b.x:player.position.x)+2,0,(b?b.z:player.position.z)+1);G.y=0;netTo(G,{t:'tp',x:r2(G.pos.x),z:r2(G.pos.z)});netMe(G);}
  if(!G.dead&&G.y<1.5){ // laupījums zemē viesim
   for(const ch of chunks.values())for(let i=ch.items.length-1;i>=0;i--){const it=ch.items[i];if(Math.hypot(it.x-G.pos.x,it.z-G.pos.z)<1.5){ch.group.remove(it.m);freeObj(it.m);ch.items.splice(i,1);taken.add(it.id);const s=giveLoot(it.type,G.I,PT);netTo(G,{t:'msg',s:t('found')+' '+s});netMe(G);}}
   for(const dp of [...drops])if(Math.hypot(dp.x-G.pos.x,dp.z-G.pos.z)<1.5){takeDrop(dp,{I:G.I,team:PT});netTo(G,{t:'msg',s:t('bag')});netMe(G);}
  }
  const m=G.mesh,k=Math.min(1,dt*12);m.visible=!G.dead;m.position.x+=(G.pos.x-m.position.x)*k;m.position.z+=(G.pos.z-m.position.z)*k;m.position.y=G.y;m.rotation.y=G.yaw;
  const sw=G.mv?Math.sin(clock.elapsedTime*13+G.id)*.55:0;m.userData.legs[0].rotation.x=sw;m.userData.legs[1].rotation.x=-sw;
  G.lab.visible=G.bar.bg.visible=G.bar.f.visible=!G.dead;G.lab.position.set(m.position.x,G.y+2.8,m.position.z);setBar(G.bar,m.position.x,G.y+2.45,m.position.z,G.hp/100);
 }
 netT-=dt;if(netT>0)return;netT=.1;
 const M=[],B=[],K=[];
 for(const z of zombies){const u=z.userData;if(u.dead)continue;M.push([u.nid,KIND.indexOf(u.kind),r2(z.position.x),r2(z.position.z),r2(z.position.y),r2(z.rotation.y),Math.ceil(u.hp),u.max,u.boom!==undefined?1:0]);}
 for(const b of humans)if(!b.dead&&!b.jet&&!b.para&&!b.heli)B.push([b.nid,r2(b.g.position.x),r2(b.g.position.z),r2(b.g.rotation.y),Math.ceil(b.hp),b.team.color,b.team===PT?1:PT.enemies.has(b.team)?2:0,b.team]);
 tanks.forEach((tk,i)=>K.push([i,r2(tk.g.position.x),r2(tk.g.position.z),r2(tk.g.rotation.y),r2(tk.g.userData.tur.rotation.y),tk.shells,tk.dead?1:0]));
 const P=[[0,r2(player.position.x),r2(pY),r2(player.position.z),r2(yaw),Math.ceil(health),active?0:1,inTank||(typeof jetMode!=='undefined'&&jetMode)||(typeof heliMode!=='undefined'&&heliMode)?1:0,PCOL[0],$('nickname').value.slice(0,16)]];
 for(const G of NET.guests.values())if(G.ready)P.push([G.id,r2(G.pos.x),r2(G.y),r2(G.pos.z),r2(G.yaw),Math.ceil(G.hp),G.dead?1:0,G.inJet||G.inHeli?1:0,G.col,G.name]);
 const near=(x,z,G)=>Math.hypot(x-G.pos.x,z-G.pos.z)<130;
 for(const G of NET.guests.values()){if(!G.ready)continue;
  netTo(G,{t:'s',h:r2(hour),d:day,sc:score,nb:humans.length,tm:PT.members.length,gone:netGone,
   M:M.filter(m=>near(m[2],m[3],G)),B:B.filter(b=>near(b[1],b[2],G)).map(b=>{const T=b[7],g=GT(G);return[b[0],b[1],b[2],b[3],b[4],b[5],T===g?1:g.enemies.has(T)?2:0];}),K,P:P.filter(p=>p[0]!==G.id),q:netQ.filter(e=>e.o!==G.id)});}
 netGone=[];netQ=[];
 netBiT-=.1;if(netBiT<=0){netBiT=4;for(const G of NET.guests.values())if(G.ready)netTo(G,{t:'bi',bi:humans.map(b=>[b.nid,b.name+(b.badges&&b.badges.size?' 🏅'+b.badges.size:''),b.helmet?1:0])});}
 netDoorT-=.1;if(netDoorT<=0){netDoorT=.5;const dr=[];for(const c of chunks.values())for(const o of c.inter)if(o.type==='door'){const s=(o.open?1:0)+':'+o.hp;if(o._ns===undefined){o._ns=s;if(s!=='0:100')dr.push([o.id,o.open?1:0,o.hp]);}else if(o._ns!==s){o._ns=s;dr.push([o.id,o.open?1:0,o.hp]);}}if(dr.length)for(const G of NET.guests.values())if(G.ready)netTo(G,{t:'dr',dr});}
}
// notikumi, ko saimnieks pārsūta viesiem (lodes, sprādzieni, kluči, atvērtās atvilknes, ziņas)
const _spawnBullet=spawnBullet;spawnBullet=function(x,y,z,vx,vz,W,team,pl){_spawnBullet(x,y,z,vx,vz,W,team,pl);if(NET.role==='host'&&NET.guests.size)netQ.push({e:'bu',x:r2(x),y:r2(y),z:r2(z),vx:r2(vx),vz:r2(vz),r:W.rocket?1:0,c:pl?0:team===PT?1:2,o:netCurOwner});};
const _explosionFx=explosionFx;explosionFx=function(x,y,z,r,col){_explosionFx(x,y,z,r,col);if(NET.role==='host'&&NET.guests.size)netQ.push({e:'fx',x:r2(x),y:r2(y),z:r2(z),r,c:col});};
const _tadd=taken.add.bind(taken);taken.add=v=>{_tadd(v);if(NET.role==='host'&&NET.guests.size)netQ.push({e:'tk',id:v});return taken;};
const _placeBlock=placeBlock;placeBlock=function(x,z,Tm,door,win){const b=_placeBlock(x,z,Tm,door,win);if(NET.role==='host'&&NET.guests.size&&b)netQ.push({e:'bk',a:1,x,z,d:door?1:0,w:win?1:0,tid:Tm.id,col:Tm.color});return b;};
const _removeBlock=removeBlock;removeBlock=function(b,fall){const was=!b.dead;_removeBlock(b,fall);if(was&&NET.role==='host'&&NET.guests.size)netQ.push({e:'bk',a:0,x:b.x,z:b.z,y0:b.y0,f:fall?1:0});};
const _killZombie=killZombie;killZombie=function(z,pl,boom){const was=!z.userData.dead;_killZombie(z,pl,boom);if(was&&NET.role==='host')netGone.push([z.userData.nid,0,boom?2:1]);};
const _removeMonster=removeMonster;removeMonster=function(z){const was=!z.userData.dead;_removeMonster(z);if(was&&NET.role==='host')netGone.push([z.userData.nid,0,0]);};
const _killBot=killBot;killBot=function(b,src){const was=!b.dead;_killBot(b,src);if(was&&NET.role==='host')netGone.push([b.nid,1,1]);};
function bcastMsgOf(fn){return function(...a){const m0=$('msg').textContent,w0=msgWait,r=fn.apply(this,a),m=$('msg').textContent;if(NET.role==='host'&&NET.guests.size&&(m!==m0||msgWait>w0))netQ.push({e:'msg',s:m,d:msgWait});return r;};}
onHour=bcastMsgOf(onHour);spawnCannibal=bcastMsgOf(spawnCannibal);tryMerge=bcastMsgOf(tryMerge);war=bcastMsgOf(war);

// ---------- viesis ----------
function netTeam(id,col){let tm=netTeams.get(id);if(!tm){tm={id,color:col,members:[],enemies:new Set(),blocks:0};netTeams.set(id,tm);}return tm;}
function netJoin(code){
 if(typeof Peer==='undefined'){netFail(t('mp_nolib'));return;}
 if(!scene)init();
 NET.role='guest';NET.code=code;$('mperr').textContent=t('mp_connecting');$('start').disabled=true;
 peer=new Peer({debug:0,config:PEERCFG});
 // laiks pievienoties: 60 s; ja draugs vēl nav gatavs vai uz brīdi pazaudējis savienojumu, mēģina vēlreiz ik pēc 3 s
 // kļūdas kods (err) redzams ekrānā, lai pēc ekrānuzņēmuma var saprast, kur apstājās
 let step='mp_s1',done=false,err='',tries=0;const fail=setTimeout(()=>{if(!active)netFail(t('mp_fail')+' ('+t(step)+(err?', '+err:'')+')');},60000);
 let pend=false;const retry=why=>{err=why||err;$('mperr').textContent=t('mp_retry')+' ['+err+', '+(++tries)+']';if(pend)return;pend=true;setTimeout(()=>{pend=false;if(done||!peer||peer.destroyed)return;if(peer.disconnected)try{peer.reconnect();}catch(e){}else tryConn();},3000);};
 const tryConn=()=>{if(done||!peer||peer.destroyed)return;step='mp_s2';$('mperr').textContent=t('mp_s2');
  hostConn=peer.connect('megaworld-'+code,{reliable:true,serialization:'json'});const hc=hostConn;
  hc.on('open',()=>{step='mp_s3';$('mperr').textContent=t('mp_s3');hc.send({t:'hello',name:$('nickname').value,v:MWV});});
  hc.on('error',e=>{err='conn:'+((e&&e.type)||e);$('mperr').textContent=t('mp_retry')+' ['+err+']';});
  hc.on('data',d=>{if(d&&d.t==='wel'){done=true;clearTimeout(fail);}netGuestMsg(d);});
  // aizvērts pirms spēles ielādes (piem., PeerJS pie peer-unavailable aizver savienojumu): mēģina vēlreiz, nevis padodas
  hc.on('close',()=>{if(hc!==hostConn)return;if(!active&&!done){retry(err||'close@'+step.slice(-2));return;}clearTimeout(fail);netFail(t(active?'mp_hostleft':'mp_fail'));});};
 peer.on('open',tryConn);
 peer.on('disconnected',()=>{if(!done&&peer&&!peer.destroyed)try{peer.reconnect();}catch(e){}});
 peer.on('error',e=>{const ty=e&&e.type;if(done)return;
  if(ty==='peer-unavailable'||ty==='network'||ty==='server-error'||ty==='socket-error'){step='mp_s2';retry(ty);return;}
  clearTimeout(fail);netFail(t('mp_fail')+' ('+(ty||e)+')');});
}
function netFail(msg){
 const was=active;active=false;NET.role=null;try{if(peer)peer.destroy();}catch(e){}peer=null;hostConn=null;
 document.exitPointerLock?.();$('menu').style.display='flex';$('start').disabled=false;$('mperr').textContent=msg;
 if(was){$('start').dataset.k='mp_joinbtn';applyLang();}
}
function guestClear(){
 chunks.forEach(c=>{c.obs.forEach(o=>remOb(o));scene.remove(c.group);freeObj(c.group);});chunks.clear();OG.clear();taken.clear();doorState.clear();
 blocks.forEach(c=>c.forEach(b=>{if(b.mesh)scene.remove(b.mesh);}));blocks.clear();doors.length=0;if(BIM){BIM.count=0;blkArr.length=0;}
 for(const o of netMon.values())removeMonster(o.z);netMon.clear();zombies.forEach(z=>{scene.remove(z);delBar(z.userData.bar);});zombies.length=0;
 for(const o of netBot.values()){scene.remove(o.g);freeObj(o.g);delBar(o.bar);delLabel(o.lab);}netBot.clear();
 for(const o of netPl.values()){scene.remove(o.g);freeObj(o.g);delBar(o.bar);delLabel(o.lab);}netPl.clear();
 for(const o of netTk.values()){scene.remove(o.g);freeObj(o.g);}netTk.clear();
 netVB.forEach(b=>scene.remove(b.m));netVB.length=0;corpses.forEach(c=>{scene.remove(c.group);freeObj(c.group);});corpses.length=0;
}
function netGuestMsg(d){
 if(!d||!d.t)return;
 if(d.t==='wel'){
  guestClear();NET.myId=d.id;NET.meDead=false;
  player.children[0].material.color.setHex(d.col);player.children[1].material.color.set(new THREE.Color(d.col).lerp(new THREE.Color(0xffffff),.2)); // tava krāsa, kā tevi redz citi
  PT=netTeam(d.pt[0],d.pt[1]);inv=newInv();health=100;hour=d.h;day=d.d;lastH=Math.floor(hour);clkM=-1;score=0;cur='hands';buildMode=false;
  burnt.clear();if(d.br)for(const id of d.br)burnt.add(id);fires.length=0;
  for(const id of d.tk)taken.add(id);for(const [id,o,hp] of d.dr)doorState.set(id,{o,hp});
  player.position.set(d.sp[0],0,d.sp[1]);pY=0;vy=0;onGround=true;
  updateChunks();for(const [x,z,y0,dr,tid,col,wn] of d.bl)placeBlock(x,z,netTeam(tid,col),!!dr,!!wn);
  drawSky(darkAt(hour));$('menu').style.display='none';$('dead').style.display='none';
  active=true;ac();selectW('hands');updateHealth();renderInv();updateClock();say(t('mp_welcome'),4);return;}
 if(!active)return;
 if(d.t==='s')return guestSnap(d);
 if(d.t==='me'){const old=health;health=d.hp;inv=d.inv;PT.blocks=d.bl;PT.doorI=d.di;PT.winI=d.wi;score=d.sc;$('score').textContent=score;NET.meDead=!!d.dead;if(health<old-.5){flashHurt();sfx('hurt');}autoGun();renderInv();updateHealth();updateAmmo();return;}
 if(d.t==='msg'){say(d.s,d.d);return;}
 if(d.t==='tp'){player.position.set(d.x,0,d.z);pY=0;vy=0;return;}
 if(d.t==='bi'){NET.bi=new Map(d.bi.map(([id,n,h])=>[id,{n,h}]));for(const [id,o] of netBot){const i=NET.bi.get(id);if(i&&o.name!==i.n){o.name=i.n;o.rel=-1;}}return;}
 if(d.t==='dr'){for(const [id,o,hp] of d.dr){doorState.set(id,{o,hp});for(const ch of chunks.values())for(const q of ch.inter)if(q.id===id)applyDoor(q,{o,hp});}return;}
 if(d.t==='full'){netFail(t('mp_full'));return;}
 if(d.t==='bye'){netFail(t('mp_hostleft'));return;}
}
function applyDoor(o,s){o.open=!!s.o;o.hp=s.hp;if(o.hp<=0){o.dob.off=true;o.piv.visible=false;o.r=0;o.open=true;}else{o.piv.rotation.y=o.open?-Math.PI/2:0;o.dob.off=o.open;o.dm.material.color.setHex(o.hp>60?0x5a3d22:o.hp>30?0x4a2a18:0x2e170d);}}
const _genChunk=genChunk;genChunk=function(cx,cz){_genChunk(cx,cz);if(NET.role==='guest'&&doorState.size){const ch=chunks.get(cx+','+cz);if(ch)for(const o of ch.inter)if(o.type==='door'&&doorState.has(o.id))applyDoor(o,doorState.get(o.id));}};
function applyTaken(id){
 taken.add(id);
 for(const ch of chunks.values()){
  for(let i=ch.items.length-1;i>=0;i--)if(ch.items[i].id===id){ch.group.remove(ch.items[i].m);freeObj(ch.items[i].m);ch.items.splice(i,1);}
  for(const o of ch.inter)if(o.id===id&&!o.open){o.open=true;o.loot=[];if(o.mesh)o.mesh.position[o.ax||'x']+=o.sgn*.4;}
 }
}
function visBullet(e,mine){
 if(!PBM){PBM=new THREE.MeshBasicMaterial({color:0xffe07a});ABM=new THREE.MeshBasicMaterial({color:0x9be7ff});EBM=new THREE.MeshBasicMaterial({color:0xff6b6b});RBM=new THREE.MeshBasicMaterial({color:0xff7a1a});}
 const m=new THREE.Mesh(e.r?RGEO:BGEO,e.r?RBM:[PBM,ABM,EBM][e.c]||PBM);m.position.set(e.x,e.y,e.z);scene.add(m);
 const sp=e.r?28:45;netVB.push({m,vx:e.vx*sp,vz:e.vz*sp,life:e.r?2.2:1.3});
 if(!mine)sfxAt(e.r?'rocket':'ally',e.x,e.z,35);
}
function guestSnap(d){
 hour=d.h;day=d.d;score=d.sc;NET.nb=d.nb;NET.tm=d.tm;
 for(const e of d.q){
  if(e.e==='bu')visBullet(e);
  else if(e.e==='fx'){explosionFx(e.x,e.y,e.z,e.r,e.c);if(e.r>=2)sfxAt('boom',e.x,e.z,70);}
  else if(e.e==='tk')applyTaken(e.id);
  else if(e.e==='bk'){if(e.a)placeBlock(e.x,e.z,netTeam(e.tid,e.col),!!e.d,!!e.w);else{const c=blocks.get(e.x+','+e.z),b=c&&c.find(q=>q.y0===e.y0);if(b)removeBlock(b,!!e.f);}}
  else if(e.e==='msg')say(e.s,e.d);
  else if(typeof netExtraEv==='function')netExtraEv(e);
 }
 for(const [id,ty,how] of d.gone){
  if(ty===0){const o=netMon.get(id);if(o){netMon.delete(id);if(how)killZombie(o.z,false,how===2);else removeMonster(o.z);}}
  else{const o=netBot.get(id);if(o){netBot.delete(id);delBar(o.bar);delLabel(o.lab);scatter(o.g.children,1);o.g.userData.corpseParts=o.g.children;corpses.push({group:o.g,life:9});}}
 }
 for(const [id,ki,x,z,y,ry,hp,max,boom] of d.M){
  let o=netMon.get(id);
  if(!o){const kind=KIND[ki],mesh=meshFor(kind);monsterData(mesh,kind);mesh.position.set(x,y,z);mesh.rotation.y=ry;o={z:mesh};netMon.set(id,o);}
  o.tx=x;o.tz=z;o.ty=y;o.ry=ry;o.seen=gtime;const u=o.z.userData;u.hp=hp;u.max=max;u.boomF=boom;
 }
 for(const [id,x,z,ry,hp,col,rel] of d.B){
  let o=netBot.get(id);
  if(!o){const i=NET.bi&&NET.bi.get(id),bb=buildBot(col,i?i.h:false);bb.g.position.set(x,0,z);scene.add(bb.g);o={g:bb.g,uni:bb.uni,col,bar:mkBar(.9,0xf1c40f),lab:null,name:i?i.n:'',rel:-1};netBot.set(id,o);}
  o.tx=x;o.tz=z;o.ry=ry;o.hp=hp;o.seen=gtime;
  if(o.col!==col){o.col=col;o.uni.forEach(m=>m.color.setHex(col));o.rel=-1;}
  if(o.rel!==rel){o.rel=rel;delLabel(o.lab);o.lab=mkLabel((rel===1?'★ ':rel===2?'⚔️ ':'')+(o.name||'...'),col);o.bar.f.material.color.setHex(rel===1?0x2ecc71:rel===2?0xe74c3c:0xf1c40f);}
 }
 for(const [id,x,y,z,a,hp,dead,tank,col,name] of d.P){
  let o=netPl.get(id);
  if(!o){const g=avatarMesh(col);g.position.set(x,y,z);o={g,lab:mkLabel('★ '+name,col),bar:mkBar(.9,0x2ecc71)};netPl.set(id,o);}
  o.tx=x;o.ty=y;o.tz=z;o.a=a;o.hp=hp;o.dead=dead;o.tank=tank;o.seen=gtime;
 }
 for(const [i,x,z,ry,tr,sh,dead] of d.K){
  let o=netTk.get(i);if(!o){const g=tankMesh();scene.add(g);o={g};netTk.set(i,o);}
  o.g.position.set(x,0,z);o.g.rotation.y=ry;o.g.userData.tur.rotation.y=tr;if(dead&&!o.dead){o.dead=true;o.g.userData.hull.material.color.setHex(0x2a2a22);}
 }
}
function guestHit(){
 if(NET.meDead)return;
 if(buildMode){buildAct(false);return;}
 if(cur!=='hands'){
  const W=WP[cur];
  if(inv.ammo[cur]>0){
   attackWait=W.rate;inv.ammo[cur]--;updateAmmo();renderW();sfx(W.rocket?'rocket':'shoot');
   const ay=assistYaw(W.rng+4),a=ay===null?yaw:ay;if(ay!==null&&TOUCH&&lid===null){let df=ay-yaw;df=Math.atan2(Math.sin(df),Math.cos(df));yaw+=df*.25;}
   for(let k=0;k<W.pel;k++){const aa=a+(Math.random()-.5)*W.sp*2;visBullet({x:player.position.x-Math.sin(aa)*.8,y:pY+1.2,z:player.position.z-Math.cos(aa)*.8,vx:-Math.sin(aa),vz:-Math.cos(aa),r:W.rocket?1:0,c:0},true);}
   netSend({t:'fire',w:cur,a:r2(a)});return;
  }
  sfx('click');attackWait=.3;const nx=GUNS.find(w=>inv.has[w]&&inv.ammo[w]>0);selectW(nx||'hands');say(t('noammo'),1);if(nx)return;
 }
 attackWait=.42;player.userData.arm1.rotation.x=1.4;player.userData.punch=.18;sfx('melee');netSend({t:'melee',a:r2(yaw)});
}
function netGuestFrame(dt){
 const k=Math.min(1,dt*10);
 nc[0]=nc[1]=nc[2]=nc[3]=nc[4]=0;
 for(const [id,o] of netMon){
  const z=o.z,u=z.userData;if(gtime-o.seen>2){netMon.delete(id);removeMonster(z);continue;}
  const ox=z.position.x,oz=z.position.z;z.position.x+=(o.tx-ox)*k;z.position.z+=(o.tz-oz)*k;z.position.y+=(o.ty-z.position.y)*k;z.rotation.y=lerpA(z.rotation.y,o.ry,k);
  const mv=Math.hypot(z.position.x-ox,z.position.z-oz)>.003;if(u.legs){const sw=mv?Math.sin(clock.elapsedTime*(u.kind==='w'||u.kind==='f'?12:7)+u.phase)*.6:0;u.legs[0].rotation.x=sw;u.legs[1].rotation.x=-sw;}
  if(u.boomF)z.scale.setScalar(u.sc*(1+Math.abs(Math.sin(clock.elapsedTime*25))*.12));
  const pd=Math.hypot(z.position.x-player.position.x,z.position.z-player.position.z);z.visible=pd<82;u.bar.bg.visible=u.bar.f.visible=pd<60;if(pd<60)setBar(u.bar,z.position.x,Math.max(0,z.position.y)+u.bh,z.position.z,u.hp/u.max);
  const ix={z:0,w:1,zw:2,s:3,c:4}[u.kind];if(ix!==undefined)nc[ix]++;
 }
 for(const [id,o] of netBot){
  if(gtime-o.seen>2){netBot.delete(id);scene.remove(o.g);freeObj(o.g);delBar(o.bar);delLabel(o.lab);continue;}
  const g=o.g,ox=g.position.x,oz=g.position.z;g.position.x+=(o.tx-ox)*k;g.position.z+=(o.tz-oz)*k;g.rotation.y=lerpA(g.rotation.y,o.ry,k);
  const mv=Math.hypot(g.position.x-ox,g.position.z-oz)>.003,sw=mv?Math.sin(clock.elapsedTime*10+id)*.5:0;g.children[3].rotation.x=sw;g.children[4].rotation.x=-sw;
  const pd=Math.hypot(g.position.x-player.position.x,g.position.z-player.position.z),vis=pd<40;g.visible=pd<85;
  if(o.lab)o.lab.visible=vis;o.bar.bg.visible=o.bar.f.visible=vis;if(vis){setBar(o.bar,g.position.x,2.45,g.position.z,o.hp/100);if(o.lab)o.lab.position.set(g.position.x,2.8,g.position.z);}
 }
 for(const [id,o] of netPl){
  if(gtime-o.seen>3){netPl.delete(id);scene.remove(o.g);freeObj(o.g);delBar(o.bar);delLabel(o.lab);continue;}
  const g=o.g,ox=g.position.x,oz=g.position.z;g.position.x+=(o.tx-ox)*k;g.position.z+=(o.tz-oz)*k;g.position.y=o.ty;g.rotation.y=lerpA(g.rotation.y,o.a,k);
  const mv=Math.hypot(g.position.x-ox,g.position.z-oz)>.003,sw=mv?Math.sin(clock.elapsedTime*13+id)*.55:0;g.userData.legs[0].rotation.x=sw;g.userData.legs[1].rotation.x=-sw;
  const show=!o.dead&&!o.tank;g.visible=show;o.lab.visible=o.bar.bg.visible=o.bar.f.visible=show;o.lab.position.set(g.position.x,o.ty+2.8,g.position.z);setBar(o.bar,g.position.x,o.ty+2.45,g.position.z,o.hp/100);
 }
 for(let i=netVB.length-1;i>=0;i--){const b=netVB[i],p=b.m.position;b.life-=dt;p.x+=b.vx*dt;p.z+=b.vz*dt;if(b.life<=0||wallAt(p.x,p.z,p.y)){scene.remove(b.m);netVB.splice(i,1);}}
 netSt-=dt;if(netSt<=0){netSt=.07;const p=player.position,mv=netLastP?Math.hypot(p.x-netLastP.x,p.z-netLastP.z)>.02:false;netLastP={x:p.x,z:p.z};netSend({t:'p',x:r2(p.x),z:r2(p.z),y:r2(pY),a:r2(yaw),m:mv?1:0});}
 skyT-=dt;if(skyT<=0){skyT=.5;drawSky(darkAt(hour));}updateClock();
 netUiT-=dt;if(netUiT<=0){netUiT=1;$('ppl').textContent='👥 '+((NET.nb||0)+netPl.size+1);$('pplsub').textContent=tf('pplsub',{n:NET.tm||0});}
}

// ---------- logs "Spēlēt kopā" ----------
function renderMP(){
 const el=$('mp');if(el.style.display!=='block')return;
 let h='<button class="corner" data-x="1" style="float:right;margin:0">✖</button><b>🌐 '+t('mp_title')+'</b><br>';
 if(NET.role==='guest')h+=t('mp_guestinfo')+'<br><button class="corner" data-a="leave">'+t('mp_leave')+'</button>';
 else if(NET.role!=='host')h+='<span style="font-size:12px">'+t('mp_info')+'</span><br><button class="corner" data-a="host">'+t('mp_start')+'</button>';
 else{
  if(NET.status)h+=NET.status+'<br>';
  else h+=t('mp_link')+'<br><input id="mplink" readonly value="'+joinLink()+'" style="margin:6px 0;padding:6px 8px;font-size:12px"><br><button class="corner" data-a="copy">'+t('mp_copy')+'</button>'+(navigator.share?'<button class="corner" data-a="share">'+t('mp_share')+'</button>':'');
  h+='<br><b>'+t('mp_players')+' ('+(1+[...NET.guests.values()].filter(G=>G.ready).length)+'/4)</b><br>★ '+$('nickname').value;
  for(const G of NET.guests.values())if(G.ready)h+='<br>★ '+G.name;
  h+='<br><button class="corner" data-a="stop">'+t('mp_stop')+'</button>';
 }
 el.innerHTML=h;
 el.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();const a=b.dataset.a;
  if(b.dataset.x){el.style.display='none';return;}
  if(a==='host')netHost();else if(a==='stop')netStop();else if(a==='leave')location.href=location.pathname;
  else if(a==='copy'){const i=$('mplink');i.select();try{navigator.clipboard.writeText(i.value);}catch(err){document.execCommand('copy');}say(t('mp_copied'),2);}
  else if(a==='share'){navigator.share({title:'MegaWorld',text:t('mp_sharetext'),url:joinLink()}).catch(()=>{});}});
}
function toggleMP(){const el=$('mp'),on=el.style.display!=='block';el.style.display=on?'block':'none';if(on){$('inv').style.display='none';$('team').style.display='none';renderMP();}}
$('mpb').onclick=e=>{toggleMP();e.currentTarget.blur();};
// ja atvērts ar ?join=kods, sākuma poga pievienojas drauga spēlei
{const m=location.search.match(/[?&]join=([a-z0-9]{4,10})/);if(m){$('start').dataset.k='mp_joinbtn';$('start').onclick=()=>netJoin(m[1]);applyLang();
 const a=document.createElement('a');a.href=location.pathname;a.dataset.k='mp_solo';a.style.cssText='display:block;margin-top:10px;font-size:12px;color:#8fb8d4';$('mperr').after(a);applyLang();}}
// ---------- Metered TURN: spēle no dažādiem tīkliem (mobilie dati, cits Wi-Fi) ----------
// Ja TURN_APP un TURN_KEY ir aizpildīti, lapai atveroties paņem TURN piekļuves datus no Metered (līdz pogas nospiešanai tie jau ir klāt)
const TURN_APP='',TURN_KEY='';
let turnReady=null;
function turnFetch(){if(!TURN_APP||!TURN_KEY)return Promise.resolve(false);if(turnReady)return turnReady;
 turnReady=fetch('https://'+TURN_APP+'.metered.live/api/v1/turn/credentials?apiKey='+encodeURIComponent(TURN_KEY)).then(r=>r.ok?r.json():null).then(L=>{
  if(!Array.isArray(L)||!L.length)return false;PEERCFG.iceServers=PEERCFG.iceServers.filter(s=>!String(s.urls).includes('turn:')).concat(L);return true;}).catch(()=>false);return turnReady;}
turnFetch();
