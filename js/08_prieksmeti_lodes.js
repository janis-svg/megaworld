// 08_prieksmeti_lodes.js - Priekšmetu pacelšana, lodes, raķetes
// ---------- priekšmeti ----------
function autoGun(){if(cur==='hands'){const g=[...GUNS].reverse().find(w=>inv.has[w]&&inv.ammo[w]>0)||GUNS.find(w=>inv.has[w]);if(g)selectW(g);}}
function takeItem(ch,it,who){const i=ch.items.indexOf(it);if(i<0)return;ch.group.remove(it.m);freeObj(it.m);ch.items.splice(i,1);taken.add(it.id);
 if(who){giveLoot(it.type,who.I,who.team);return;}
 const s=giveLoot(it.type,inv,PT);say(t('found')+' '+s);sfx('pick');autoGun();renderInv();updateAmmo();updateHealth();}
function takeDrop(d,who){const i=drops.indexOf(d);if(i<0)return;scene.remove(d.m);freeObj(d.m);drops.splice(i,1);const I=who?who.I:inv,parts=[];
 for(const w of GUNS){if(d.I.has[w]){if(!I.has[w])parts.push(WP[w].ic);I.has[w]=true;}if(d.I.ammo[w]>0){I.ammo[w]=Math.min(WP[w].max,I.ammo[w]+d.I.ammo[w]);parts.push('+'+d.I.ammo[w]+' '+WP[w].ic);}}
 if(d.I.meds){I.meds+=d.I.meds;parts.push('+'+d.I.meds+' ➕');}if(d.I.armor>0){I.armor=Math.min(100,I.armor+d.I.armor);parts.push('🛡️');}
 if(!who){say(t('bag')+' '+(parts.join(', ')||'-'));sfx('pick');autoGun();renderInv();updateAmmo();updateHealth();}}
function updateItems(dt){
 for(const ch of chunks.values())for(let i=ch.items.length-1;i>=0;i--){
  const it=ch.items[i];it.m.rotation.y+=dt*2;it.m.position.y=.6+Math.sin(clock.elapsedTime*3+it.x)*.1;
  if(pY<1.5&&Math.hypot(it.x-player.position.x,it.z-player.position.z)<1.5)takeItem(ch,it,null);
 }
 for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.m.rotation.y+=dt;if(pY<1.5&&Math.hypot(d.x-player.position.x,d.z-player.position.z)<1.5)takeDrop(d,null);}
}
// ---------- lodes ----------
const BGEO=new THREE.SphereGeometry(.09,8,8),RGEO=new THREE.SphereGeometry(.17,8,8);let PBM=null,ABM,EBM,RBM;
function spawnBullet(x,y,z,vx,vz,W,team,pl){
 if(!PBM){PBM=new THREE.MeshBasicMaterial({color:0xffe07a});ABM=new THREE.MeshBasicMaterial({color:0x9be7ff});EBM=new THREE.MeshBasicMaterial({color:0xff6b6b});RBM=new THREE.MeshBasicMaterial({color:0xff7a1a});}
 const m=new THREE.Mesh(W.rocket?RGEO:BGEO,W.rocket?RBM:pl?PBM:team===PT?ABM:EBM);m.position.set(x,y,z);scene.add(m);
 const sp=W.rocket?28:45;bullets.push({m,vx:vx*sp,vz:vz*sp,life:W.life,dmg:pl?W.dmg:W.dmg*.55,team,pl,rocket:!!W.rocket});
}
// tēmēšanas palīdzība: ja priekšā (konusā) ir monstrs vai ienaidnieks, lode iet uz viņu (telefonā plašāks konuss)
function assistYaw(rng){
 const cone=TOUCH?.7:.22,px=player.position.x,pz=player.position.z;let best=null,bs=1e9;
 const look=(x,z)=>{const dx=x-px,dz=z-pz,d=Math.hypot(dx,dz);if(d>rng||d<.5)return;const a=Math.atan2(-dx,-dz);let df=a-yaw;df=Math.atan2(Math.sin(df),Math.cos(df));if(Math.abs(df)>cone)return;const s=Math.abs(df)*12+d*.15;if(s<bs&&!blockedLine(player.position,{x,z},pY+1.2,PT)){bs=s;best=a;}};
 for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,z.position.z);}
 for(const b of humans)if(PT.enemies.has(b.team))look(b.g.position.x,b.g.position.z);
 return best;
}
function shoot(w){
 const W=WP[w];attackWait=W.rate;inv.ammo[w]--;sfx(W.rocket?'rocket':'shoot');
 const ay=assistYaw(W.rng+4),base=ay===null?yaw:ay;if(ay!==null&&TOUCH){let df=ay-yaw;df=Math.atan2(Math.sin(df),Math.cos(df));yaw+=df*.35;}
 for(let k=0;k<W.pel;k++){const a=base+(Math.random()-.5)*W.sp*2,fx=-Math.sin(a),fz=-Math.cos(a);spawnBullet(player.position.x+fx*.8,pY+1.2,player.position.z+fz*.8,fx,fz,W,PT,true);}
 updateAmmo();renderInv();
}
function updateBullets(dt){
 for(let i=bullets.length-1;i>=0;i--){
  const b=bullets[i],p=b.m.position;b.life-=dt;let done=b.life<=0,boom=done&&b.rocket;
  for(let s2=0;s2<4&&!done;s2++){
   p.x+=b.vx*dt/4;p.z+=b.vz*dt/4;
   if(Math.abs(p.x)>EDGE||Math.abs(p.z)>EDGE||wallAt(p.x,p.z,p.y,b.team)){done=true;boom=b.rocket;break;}
   for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0)continue;if(Math.hypot(z.position.x-p.x,z.position.z-p.z)<(u.kind==='zw'?1.6:1)){done=true;if(b.rocket)boom=true;else dmgMonster(z,b.dmg,b.pl);break;}}
   if(done)break;
   for(const h of HL){if(h.team===b.team||(!b.pl&&!b.team.enemies.has(h.team)))continue;if(h.b&&h.b.dead)continue;if(Math.hypot(h.p.x-p.x,h.p.z-p.z)<.6&&Math.abs(p.y-(h.y+1.1))<1.2){done=true;if(b.rocket)boom=true;else hurt(h,b.pl?b.dmg:b.dmg*.65,b.team,b.pl);break;}}
  }
  if(boom)rocketBoom(p,b.team,b.pl);
  if(done){scene.remove(b.m);bullets.splice(i,1);}
 }
}
function rocketBoom(p,team,pl){
 const x=p.x,z=p.z;explosionFx(x,p.y,z,3,0xff8a2a);sfxAt('boom',x,z,70);
 for(const m of [...zombies]){const d=Math.hypot(m.position.x-x,m.position.z-z);if(d<4.5)dmgMonster(m,(pl?260:150)*(1-d/5.5),pl);}
 for(const h of [...HL]){if(h.team===team)continue;const d=Math.hypot(h.p.x-x,h.p.z-z);if(d<3.5)hurt(h,(pl?80:55)*(1-d/4.5),team,pl);}
 const hitB=new Set();eachOb(x,z,2.4,o=>{if(o.y1!==undefined&&!o.dead&&o.team!==team&&Math.hypot(o.x-x,o.z-z)<2.4&&o.y0<p.y+2)hitB.add(o);return false;});hitB.forEach(o=>damageBlock(o,o.door?170:120));
 for(const ch of chunks.values())for(const o of ch.inter)if(o.type==='door'&&o.hp>0&&Math.hypot(o.x-x,o.z-z)<3){o.hp=0;o.dob.off=true;o.piv.visible=false;o.r=0;o.open=true;}
}
