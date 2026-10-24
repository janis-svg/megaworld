// 14_spele.js - Uzbrukums, spēlētāja kustība, monstru gājiens, kamera, sākums, galvenais cikls, tastatūra
function popup(text,pos){
 const v=pos.clone().project(camera);
 if(v.z>1)return;
 const e=document.createElement('div');e.className='damage';e.textContent=text;
 e.style.left=((v.x+1)*innerWidth/2)+'px';
 e.style.top=((-v.y+1)*innerHeight/2)+'px';
 document.body.appendChild(e);setTimeout(()=>e.remove(),900);
}
function dmgMonster(z,d,pl,rocket){
 const u=z.userData;if(u.dead)return;
 if(u.kind==='c'){ // cilvēkēdāju ņem tikai raķete: katra raķete = viena no divām dzīvībām
  if(!rocket){if(gtime>(u.msgT||0)&&Math.hypot(z.position.x-player.position.x,z.position.z-player.position.z)<30){u.msgT=gtime+1.5;popup(t('onlyrpg'),z.position.clone().add(new THREE.Vector3(0,u.bh-.1,0)));}return;}
  if(d<=0)return;d=1;}
 u.hp-=d;if(pl)$('last').textContent='-'+Math.round(d)+' HP';
 if(Math.hypot(z.position.x-player.position.x,z.position.z-player.position.z)<30){if(pl)sfx('hit');popup('-'+Math.round(d)+' HP',z.position.clone().add(new THREE.Vector3(0,u.bh-.1,0)));}
 if(u.hp<=0)killZombie(z,pl);
}
function hit(){
 if(!active||attackWait>0)return;
 if(buildMode){buildAct(false);return;}
 attackWait=.42;
 if(cur!=='hands'){if(inv.ammo[cur]>0){shoot(cur);return;}sfx('click');const nx=GUNS.find(w=>inv.has[w]&&inv.ammo[w]>0);selectW(nx||'hands');say(t('noammo'),1);if(nx)return;}
 const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
 let target=null,best=2.7,isBot=false;
 if(pY<1.4){
  for(const z of zombies){
   if(z.userData.rise>0||z.userData.dead)continue;
   const d=new THREE.Vector3(z.position.x-player.position.x,0,z.position.z-player.position.z);
   const len=d.length();
   if(len<best&&d.normalize().dot(forward)>.05){best=len;target=z;}
  }
  for(const b of humans){if(b.team===PT)continue;const d=new THREE.Vector3(b.g.position.x-player.position.x,0,b.g.position.z-player.position.z),len=d.length();if(len<best&&d.normalize().dot(forward)>.05){best=len;target=b;isBot=true;}}
 }
 const arm=player.userData.arm1;
 arm.rotation.x=1.4;player.userData.punch=.18;
 sfx('melee');if(!target){say(t('near'),1);return;}
 if(isBot){hurtBot(target,25,PT,true);return;}
 dmgMonster(target,25,true);
 target.position.add(forward.clone().multiplyScalar(-.28));
}
function killZombie(z,pl,boom){
 const u=z.userData;if(u.dead)return;
 u.dead=true;
 const idx=zombies.indexOf(z);
 if(idx>=0)zombies.splice(idx,1);
 delBar(u.bar);
 scatter(z.children,boom?3:1);
 z.userData.corpseParts=z.children;
 corpses.push({group:z,life:boom?5:9});
 if(boom)return;
 sfxAt('kill',z.position.x,z.position.z,40);
 if(!pl)return;
 score+={zw:80,w:25,z:10,s:8,c:150}[u.kind];coins+={zw:30,w:10,z:5,s:3,c:60}[u.kind];
 $('score').textContent=score;$('coins').textContent=coins;
 say(t({zw:'kzw',w:'kw',z:'kill',s:'ks',c:'kc'}[u.kind]));
}
function move(dt){
 const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
 const r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
 const d=new THREE.Vector3();
 if(keys.KeyW)d.add(f);if(keys.KeyS)d.sub(f);
 if(keys.KeyD)d.add(r);if(keys.KeyA)d.sub(r);
 if(jx||jy){d.addScaledVector(f,-jy);d.addScaledVector(r,jx);}
 const moving=d.lengthSq()>0;
 if(moving)d.normalize();
 const speed=(keys.ShiftLeft||keys.ShiftRight)?8.5:5.2;
 player.position.addScaledVector(d,speed*dt);
 pushOut(player.position,.35,pY,PT);clampW(player.position);
 // lēciens + stāvēšana uz klucīšiem
 const gnd=groundAt(player.position.x,player.position.z,pY,.35);
 if(keys.Space&&onGround){vy=7.8;onGround=false;}
 if(!onGround){vy-=20*dt;pY+=vy*dt;if(pY<=gnd){pY=gnd;vy=0;onGround=true;}}
 else if(gnd<pY-.02){onGround=false;vy=0;}else pY=gnd;
 player.rotation.y=yaw;

 const tt=clock.elapsedTime;
 const u=player.userData;

 if(moving&&onGround){
  const swing=Math.sin(tt*13)*.55;
  // kājas
  u.leg1.rotation.x=swing;
  u.leg2.rotation.x=-swing;
  u.boot1.rotation.x=swing*.8;
  u.boot2.rotation.x=-swing*.8;
  // rokas - pretēji kājām
  u.arm1.rotation.x=-swing*.6;
  u.arm2.rotation.x=swing*.6;
  // ķermeņa bobs
  player.position.y=pY+Math.abs(Math.sin(tt*13))*.06;
 }else{
  u.leg1.rotation.x=0;
  u.leg2.rotation.x=0;
  u.boot1.rotation.x=0;
  u.boot2.rotation.x=0;
  u.arm1.rotation.x=0;
  u.arm2.rotation.x=0;
  player.position.y=pY;
 }
 if(cur!=='hands'&&!buildMode)u.arm2.rotation.x=1.3;
 if(u.punch>0){u.punch-=dt;u.arm1.rotation.x=1.4;}
}
function smashDoor(z,tg,dt){
 z.userData.da=(z.userData.da||0)-dt;
 for(const ch of chunks.values())for(const o of ch.inter){
  if(o.type!=='door'||o.open||o.hp<=0)continue;
  if(Math.hypot(o.x-z.position.x,o.z-z.position.z)>1.5*z.userData.sc)continue;
  if(!blockedLine(z.position,tg))continue;
  if(z.userData.da>0)return;
  z.userData.da=.9;o.hp-={zw:50,s:10,c:60}[z.userData.kind]||20;sfxAt('bang',o.x,o.z,40);
  o.dm.material.color.setHex(o.hp>60?0x5a3d22:o.hp>30?0x4a2a18:0x2e170d);
  if(o.hp<=0){o.dob.off=true;o.piv.visible=false;o.r=0;o.open=true;if(Math.hypot(o.x-player.position.x,o.z-player.position.z)<35)say(t('doorbroke'));}
  return;
 }
}
function updateZombies(dt){
 nc[0]=nc[1]=nc[2]=nc[3]=nc[4]=0;
 for(let i=zombies.length-1;i>=0;i--){
  const z=zombies[i],u=z.userData;if(!z||u.dead)continue;
  nc[{z:0,w:1,zw:2,s:3,c:4}[u.kind]]++;
  const pd=Math.hypot(z.position.x-player.position.x,z.position.z-player.position.z),vis=pd<60;u.bar.bg.visible=u.bar.f.visible=vis;z.visible=pd<82;
  if(vis)setBar(u.bar,z.position.x,Math.max(0,z.position.y)+u.bh,z.position.z,u.hp/u.max);
  if(u.rise>0){u.rise-=dt;z.position.y=-1.9*Math.max(0,u.rise)/1.6;if(u.rise<=0)z.position.y=0;continue;}
  if(u.sink>0){u.sink-=dt;z.position.y-=dt*2.2;if(u.sink<=0)removeMonster(z);continue;} // cilvēkēdājs rītā ielien zemē
  if(u.crumble!==undefined){u.crumble-=dt;if(u.crumble<=0){debris(z.position.x,1,z.position.z,0xe8e2d0,8);killZombie(z,false,true);}continue;}
  if(u.boom!==undefined){u.boom-=dt;z.scale.setScalar(u.sc*(1+Math.abs(Math.sin(clock.elapsedTime*25))*.12));if(u.boom<=0)zombieBoom(z);continue;}
  if(u.flee>0){u.flee-=dt;const l=Math.hypot(z.position.x,z.position.z)||1;z.position.x+=z.position.x/l*8*dt;z.position.z+=z.position.z/l*8*dt;z.rotation.y=Math.atan2(-z.position.x,-z.position.z);if(u.flee<=0||l>CITY+25)removeMonster(z);continue;}
  if(u.kind==='w'){updateWolf(z,u,dt);continue;}
  if(u.dr){const dr=u.dr;if(dr.open||dr.hp<=0||Math.hypot(dr.x-player.position.x,dr.z-player.position.z)>100){u.dr=null;}else{const dxd=dr.x-z.position.x,dzd=dr.z-1.0-z.position.z,dd=Math.hypot(dxd,dzd);if(dd>.4){z.position.x+=dxd/dd*u.speed*dt;z.position.z+=dzd/dd*u.speed*dt;}z.rotation.y=Math.PI;pushOut(z.position,.4);bashDoor(z,dr,dt);continue;}}
  let tg=null,dist=1e9;for(const h of HL){const d=Math.hypot(h.p.x-z.position.x,h.p.z-z.position.z);if(d<dist){dist=d;tg=h;}}
  if(!tg)continue;
  const dx=tg.p.x-z.position.x,dz=tg.p.z-z.position.z,canReach=tg.y<(u.kind==='zw'||u.kind==='c'?2.6:1.4);
  let mv=false;
  if(dist>u.reach*.7){stepTo(z.position,tg.p.x,tg.p.z,u.speed,dt,.4*Math.min(u.sc,1.4),null,u);mv=true;z.rotation.y=Math.atan2(-dx,-dz);z.position.y=Math.sin(clock.elapsedTime*6+u.phase)*.04;smashDoor(z,tg.p,dt);}
  if(u.legs){const sw=mv?Math.sin(clock.elapsedTime*(u.kind==='w'?12:7)+u.phase)*.6:0;u.legs[0].rotation.x=sw;u.legs[1].rotation.x=-sw;}
  if(dist<9){
   const bl=blockedLine(z.position,tg.p,.8);
   if((u.kind==='zw'||u.kind==='c')&&(bl===2||(!canReach&&dist<4)))breakBlock(z,tg,dt);
   if(dist<u.reach&&canReach&&!bl){u.attack-=dt;if(u.attack<=0){if(tg.pl){if(hurtWait>0)continue;hurtWait=.28;}u.attack=u.rate;hurt(tg,u.dmg,null,false,u.kind==='c');}}
  }
 }
 sepMonsters();
 $('zc').textContent=zombies.length;
}
function updateCorpses(dt){
 for(let i=corpses.length-1;i>=0;i--){
  const c=corpses[i];c.life-=dt;
  const parts=c.group.userData.corpseParts;
  parts.forEach(p=>{
   if(p.userData.vy===undefined)return;
   p.userData.vy-=14*dt;
   p.position.x+=p.userData.vx*dt;
   p.position.z+=p.userData.vz*dt;
   p.position.y+=p.userData.vy*dt;
   p.rotation.x+=p.userData.rx*dt;
   p.rotation.z+=p.userData.rz*dt;
   if(p.position.y<.1){
    p.position.y=.1;p.userData.vy=0;
    p.userData.vx*=.82;p.userData.vz*=.82;p.userData.rx*=.82;p.userData.rz*=.82;
   }
  });
  if(c.life<=0){scene.remove(c.group);freeObj(c.group);corpses.splice(i,1);}
 }
}
function updateCamera(){
 if(fp){player.visible=false;camera.rotation.order='YXZ';camera.position.set(player.position.x,player.position.y+1.65,player.position.z);camera.rotation.set(pitch,yaw,0);return;}
 player.visible=true;
 const target=player.position.clone().add(new THREE.Vector3(0,1.45,0));
 const dist=5.5;
 camera.position.set(target.x+Math.sin(yaw)*dist,target.y+1.6+pitch*2.5,target.z+Math.cos(yaw)*dist);
 camera.lookAt(target.clone().add(new THREE.Vector3(-Math.sin(yaw)*2,pitch*1.8,-Math.cos(yaw)*2)));
}
function gameOver(){
 active=false;mouseDown=false;
 document.exitPointerLock?.();
 $('result').innerHTML=t('sc')+'<b style="color:#ffd36b">'+score+'</b> &nbsp;·&nbsp; '+t('cn')+'<b style="color:#ffd36b">'+coins+'</b><br>'+t('dayl')+'<b style="color:#ffd36b">'+(day-1)+'</b><br><span style="font-size:12px">'+t('deadinfo')+'</span>';
 $('dead').style.display='flex';$('hint').style.display='none';renderW();sfx('over');
}
function resume(){
 $('dead').style.display='none';health=100;
 // atdzīvojas savā bāzē vai drošākajā vietā, tālāk no monstriem
 const danger=(x,z)=>{let m=1e9;for(const o of zombies)if(!o.userData.dead)m=Math.min(m,Math.hypot(o.position.x-x,o.position.z-z));return m;};
 let best=PT.base?[PT.base.x,PT.base.z]:[0,0],bs=PT.base?danger(PT.base.x,PT.base.z)+15:danger(0,0);
 for(let k=0;k<20;k++){const c=roadPoint(0,0,1e9),d=danger(c[0],c[1]);if(d>bs){bs=d;best=c;}}
 player.position.set(best[0],0,best[1]);pY=0;vy=0;onGround=true;invul=6;
 updateHealth();active=true;renderW();say(t('respawn'));
}
function buildHL(){HL.length=0;if(active)HL.push({p:player.position,y:pY,team:PT,pl:true});for(const b of humans)if(!b.dead)HL.push({p:b.g.position,y:0,team:b.team,b});}
function start(){
 if(!scene)init();
 $('menu').style.display='none';$('dead').style.display='none';
 health=100;score=0;coins=0;yaw=0;pitch=0;vy=0;pY=0;onGround=true;
 $('score').textContent=0;$('coins').textContent=0;
 player.position.set(0,0,0);
 chunks.forEach(c=>{scene.remove(c.group);freeObj(c.group);});chunks.clear();taken.clear();OG.clear();
 bullets.forEach(b=>scene.remove(b.m));bullets.length=0;
 blocks.forEach(c=>c.forEach(b=>{if(b.mesh)scene.remove(b.mesh);}));blocks.clear();doors.length=0;if(BIM){BIM.count=0;blkArr.length=0;}
 humans.forEach(b=>{scene.remove(b.g);freeObj(b.g);delBar(b.bar);delLabel(b.lab);});humans.length=0;teams.length=0;pairCd.clear();
 zombies.forEach(z=>{scene.remove(z);freeObj(z);delBar(z.userData.bar);});zombies.length=0;
 corpses.forEach(c=>{scene.remove(c.group);freeObj(c.group);});corpses.length=0;
 drops.forEach(d=>{scene.remove(d.m);freeObj(d.m);});drops.length=0;fxs.forEach(f=>scene.remove(f.m));fxs.length=0;
 inv=newInv();cur='hands';buildMode=false;bTool='blk';mouseDown=false;invul=0;
 hour=8;lastH=8;day=1;gtime=0;skyT=0;spawnedZ=0;spawnedW=0;spawnedS=0;madeZW=0;clkM=-1;nc[0]=nc[1]=nc[2]=nc[3]=nc[4]=0;spawnedC=0;offerAt=15;drawSky(0);
 PT=newTeam(0x3a7ab8,true);PT.blocks=40;
 active=true;selectW('hands');updateHealth();updateAmmo();renderInv();ac();updateChunks();spawnBots();updateClock();
 say(t('surv')+' '+t('dayhint'),5);renderTeam();
}
// ja kadru skaits krītas zem 30, grafiku automātiski padara vieglāku (izšķirtspēja, ēnas)
let qN=0,qT0=0,qLvl=0;
function autoQuality(){
 const now=performance.now();if(!qT0){qT0=now;qN=0;return;}qN++;
 if(now-qT0<4000)return;const fps=qN*1000/(now-qT0);qT0=now;qN=0;
 if(fps>=30||qLvl>=3)return;qLvl++;
 if(qLvl===1)renderer.setPixelRatio(Math.min(devicePixelRatio,1));
 else if(qLvl===2){renderer.shadowMap.enabled=false;scene.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);});}
 else{renderer.setPixelRatio(.75);scene.fog.far=66;}
}
function animate(){
 requestAnimationFrame(animate);
 if(!scene)return;
 const dt=Math.min(clock.getDelta(),.04);
 if(active){
  gtime+=dt;camR.set(1,0,0).applyQuaternion(camera.quaternion);buildHL();
  move(dt);updateChunks();updateItems(dt);updateHint();updateBullets(dt);updateBots(dt);updateZombies(dt);updateTime(dt);updateCorpses(dt);updateFx(dt);updateDoors();updateGhost();updateCamera();skyline.position.set(player.position.x*.96,0,player.position.z*.96);floor.position.x=player.position.x;floor.position.z=player.position.z;grid.position.x=Math.round(player.position.x/2)*2;grid.position.z=Math.round(player.position.z/2)*2;sun.position.set(player.position.x-25,40,player.position.z+15);sun.target.position.set(player.position.x,0,player.position.z);
  attackWait=Math.max(0,attackWait-dt);
  hurtWait=Math.max(0,hurtWait-dt);invul=Math.max(0,invul-dt);
  if(mouseDown&&!buildMode&&(cur==='m16'||TOUCH))hit();
  autoQuality();
  teamT-=dt;if(teamT<=0){teamT=2;teamTick();}
  teamUI-=dt;if(teamUI<=0){teamUI=1.5;renderTeam();}
  if(msgWait>0){msgWait-=dt;if(msgWait<=0)$('msg').classList.remove('show');}
 }
 renderer.render(scene,camera);
}
$('start').onclick=start;
$('again').onclick=start;
$('cont').onclick=resume;
document.addEventListener('keydown',e=>{
 if(e.target&&e.target.tagName==='INPUT')return;
 keys[e.code]=true;
 if(e.code==='KeyF')hit();
 if(!e.repeat){
  if(e.code==='KeyE')interact();if(e.code==='KeyV')toggleView();if(e.code==='KeyI')toggleInv();if(e.code==='KeyH')useMed();
  if(e.code==='KeyB')toggleBuild();if(e.code==='KeyR'&&buildMode)buildAct(true);if(e.code==='KeyT')toggleTeam();if(e.code==='KeyQ')nextW();
  const dg=e.code.match(/^Digit([1-5])$/);if(dg&&active){const n=+dg[1];if(buildMode){if(n<=2){bTool=n===1?'blk':'door';renderW();}}else selectW(WL[n-1]);}
 }
 if(e.code==='Space')e.preventDefault();
});
document.addEventListener('keyup',e=>keys[e.code]=false);
document.addEventListener('mousedown',e=>{if(!active||(e.target.closest&&e.target.closest('button,.panel')))return;if(e.button===0){mouseDown=true;hit();}else if(e.button===2&&buildMode)buildAct(true);});
document.addEventListener('mouseup',e=>{if(e.button===0)mouseDown=false;});
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('wheel',e=>{if(active&&document.pointerLockElement)nextW();},{passive:true});
init();animate();
