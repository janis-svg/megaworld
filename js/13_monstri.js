// 13_monstri.js - Zombiji, skeleti, vilkači (prāts, kaukšana), zombvilki
// ---------- monstri: zombiji, vilkači, zombvilki ----------
function monsterData(z,kind){
 const S={z:{hp:100,speed:1.0+Math.random()*.6,dmg:8,rate:.9,reach:1.5,sc:1,bh:2.35},w:{hp:200,speed:3.8+Math.random()*.8,dmg:13,rate:.8,reach:1.6,sc:1.05,bh:2.5},zw:{hp:600,speed:2.1,dmg:30,rate:1.3,reach:2.4,sc:1.9,bh:4.5},s:{hp:50,speed:2.1+Math.random()*.5,dmg:6,rate:.8,reach:1.4,sc:1,bh:2.25},f:{hp:160,speed:5.4+Math.random()*.6,dmg:10,rate:1.2,reach:1.6,sc:1.15,bh:2.65},c:{hp:2,speed:.75,dmg:34,rate:1.7,reach:2.7,sc:2.3,bh:5.4}}[kind];
 z.userData=Object.assign(z.userData||{},{nid:++NID,kind,hp:S.hp,max:S.hp,speed:S.speed,dmg:S.dmg,rate:S.rate,reach:S.reach,sc:S.sc,bh:S.bh,attack:0,parts:z.children,dead:false,phase:Math.random()*10,ba:0});
 z.scale.setScalar(S.sc);z.userData.bar=mkBar(kind==='zw'||kind==='c'?1.8:1,{z:0xe74c3c,w:0xe67e22,zw:0x9b59b6,s:0xdfe6e9,c:0x8e0000,f:0x27ae60}[kind]);scene.add(z);zombies.push(z);
}
function spawnAround(r0,r1){
 let c=Math.random()<.65||!humans.length?player.position:humans[Math.floor(Math.random()*humans.length)].g.position;
 const gs=[...NET.guests.values()].filter(G=>G.ready&&!G.dead);if(gs.length&&Math.random()<gs.length/(gs.length+1))c=gs[Math.floor(Math.random()*gs.length)].pos;
 for(let k=0;k<12;k++){const a=Math.random()*6.283,r=r0+Math.random()*(r1-r0),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;
  if(Math.abs(x)>EDGE-4||Math.abs(z)>EDGE-4||wallAt(x,z,.5))continue;
  if(teams.some(Tm=>Tm.base&&Math.abs(x-Tm.base.x)<Tm.size+1.5&&Math.abs(z-Tm.base.z)<Tm.size+1.5))continue;
  return[x,z];}
 return[Math.max(-EDGE+4,Math.min(EDGE-4,c.x+r0)),c.z];
}
function spawnZombie(fromB){
 const z=zombieMesh();
 let spot=null;
 if(fromB){const c=[];for(const ch of chunks.values())for(const o of ch.inter){if(o.apt&&!o.open&&o.hp>0){const d=Math.hypot(o.x-player.position.x,o.z-player.position.z);if(d>18&&d<62)c.push(o);}}if(c.length)spot=c[Math.floor(Math.random()*c.length)];}
 monsterData(z,'z');z.userData.dr=spot;
 if(spot)z.position.set(spot.x+(Math.random()-.5)*1.2,0,spot.z-1.3);
 else{const c=spawnAround(14,40);z.position.set(c[0],-1.9,c[1]);z.userData.rise=1.6;debris(c[0],.1,c[1],0x4a3a28,8);sfxAt('rise',c[0],c[1],40);}
}
function zombieMesh(){
 const z=new THREE.Group();
 const body=cube(.68,.82,.38,0x4a5a3a,.95);body.position.y=1.08;z.add(body);
 const chest=cube(.7,.3,.4,0x3a4a2e,.95);chest.position.y=1.32;z.add(chest);
 const head=cube(.5,.48,.46,0x6b8a45,.9);head.position.y=1.72;z.add(head);
 for(let x of [-.12,.12]){const eye=cube(.08,.07,.03,0xff2200,.4);eye.position.set(x,1.76,-.24);z.add(eye);}
 const jaw=cube(.18,.06,.04,0x1a0a0a,.5);jaw.position.set(0,1.62,-.23);z.add(jaw);
 for(let x of [-.48,.48]){const arm=cube(.18,.6,.22,0x6b8a45,.9);arm.position.set(x,1.08,0);arm.rotation.x=-.15;z.add(arm);}
 for(let x of [-.18,.18]){const leg=cube(.24,.58,.26,0x2e3a24,.95);leg.position.set(x,.35,0);z.add(leg);}
 for(let x of [-.18,.18]){const foot=cube(.26,.12,.32,0x1a1f14,.95);foot.position.set(x,.06,.02);z.add(foot);}
 return z;
}
// skelets: ātrāks par zombiju, bet vājāks (50 dzīvības)
function skelMesh(){
 const z=new THREE.Group(),bn=0xe8e2d0,legs=[];
 const sk=cube(.4,.4,.38,bn,.7);sk.position.y=1.72;z.add(sk);
 for(const x of [-.09,.09]){const e=cube(.1,.09,.03,0x330000,.9);e.material.emissive.set(0x550000);e.position.set(x,1.76,-.19);z.add(e);}
 const jaw=cube(.3,.08,.3,bn,.7);jaw.position.set(0,1.5,-.03);z.add(jaw);
 const sp=cube(.1,.72,.1,bn,.7);sp.position.y=1.1;z.add(sp);
 for(let i=0;i<3;i++){const r=cube(.5-i*.06,.05,.26,bn,.7);r.position.set(0,1.36-i*.14,-.02);z.add(r);}
 const pel=cube(.38,.12,.2,bn,.7);pel.position.y=.75;z.add(pel);
 for(const x of [-.31,.31]){const a=cube(.08,.62,.08,bn,.7);a.position.set(x,1.12,-.05);a.rotation.x=-.5;z.add(a);}
 for(const x of [-.12,.12]){const l=cube(.09,.7,.09,bn,.7);l.position.set(x,.36,0);z.add(l);legs.push(l);}
 z.userData.legs=legs;return z;
}
function spawnSkeleton(){const z=skelMesh();monsterData(z,'s');const c=spawnAround(14,40);z.position.set(c[0],-1.9,c[1]);z.userData.rise=1.3;debris(c[0],.1,c[1],0xcfc8b4,6);sfxAt('rise',c[0],c[1],40);}
function wolfMesh(){
 const z=new THREE.Group(),fur=0x4a3b2f,dk=0x2e241c,legs=[];
 const body=cube(.8,.9,.5,fur,1);body.position.set(0,1.15,.05);body.rotation.x=.35;z.add(body);
 const head=cube(.46,.42,.5,fur,1);head.position.set(0,1.75,-.3);z.add(head);
 const snout=cube(.26,.2,.32,dk,1);snout.position.set(0,1.66,-.66);z.add(snout);
 for(const x of [-.14,.14]){const e=cube(.08,.06,.03,0xffdd00,.4);e.material.emissive.set(0xaa6600);e.position.set(x,1.82,-.56);z.add(e);}
 for(const x of [-.15,.15]){const ear=cube(.12,.22,.08,dk,1);ear.position.set(x,2.02,-.25);z.add(ear);}
 for(const x of [-.52,.52]){const a=cube(.2,.8,.24,fur,1);a.position.set(x,1.05,-.15);a.rotation.x=-.5;z.add(a);}
 for(const x of [-.2,.2]){const l=cube(.26,.7,.3,dk,1);l.position.set(x,.38,.05);z.add(l);legs.push(l);}
 const tail=cube(.12,.12,.6,fur,1);tail.position.set(0,.95,.45);tail.rotation.x=-.6;z.add(tail);
 z.userData.legs=legs;z.userData.head=[head,snout];return z;
}
function zwMesh(){
 const z=new THREE.Group(),sk=0x4a5a3a,fur=0x3d342b,legs=[];
 const body=cube(.9,.95,.55,sk,.95);body.position.set(0,1.15,0);body.rotation.x=.25;z.add(body);
 const head=cube(.52,.46,.56,fur,1);head.position.set(0,1.78,-.32);z.add(head);
 const snout=cube(.28,.22,.34,0x1f1a14,1);snout.position.set(0,1.68,-.72);z.add(snout);
 for(const x of [-.15,.15]){const e=cube(.09,.07,.03,0xff2200,.4);e.material.emissive.set(0xff2200);e.position.set(x,1.85,-.61);z.add(e);}
 for(const x of [-.16,.16]){const ear=cube(.12,.24,.08,fur,1);ear.position.set(x,2.08,-.25);z.add(ear);}
 for(let i=0;i<3;i++){const s=cube(.12,.3,.12,0x1a1f14,1);s.position.set(0,1.55-i*.3,.3+i*.05);s.rotation.x=-.5;z.add(s);}
 for(const x of [-.56,.56]){const a=cube(.24,.85,.28,0x6b8a45,.9);a.position.set(x,1.05,-.15);a.rotation.x=-.4;z.add(a);}
 for(const x of [-.22,.22]){const l=cube(.3,.72,.34,fur,.95);l.position.set(x,.38,0);z.add(l);legs.push(l);}
 z.userData.legs=legs;return z;
}
// cilvēkēdājs: viens naktī, lielāks par vilkaci, lēnākais, 3 sitieni nogalina cilvēku, nogalināms tikai ar 2 raķetēm
function cannMesh(){
 const z=new THREE.Group(),sk=0xc9a28a,legs=[];
 const body=cube(.95,1.0,.6,sk,.9);body.position.y=1.15;z.add(body);
 const apron=cube(.82,.95,.05,0x7a1010,.8);apron.position.set(0,1.0,-.32);z.add(apron);
 const head=cube(.5,.5,.48,sk,.85);head.position.y=1.92;z.add(head);
 const hair=cube(.52,.1,.5,0x2a1a10,.9);hair.position.y=2.2;z.add(hair);
 const mouth=cube(.32,.1,.04,0x3a0000,.6);mouth.position.set(0,1.8,-.25);z.add(mouth);
 for(const x of [-.12,.12]){const e=cube(.09,.07,.03,0xffcc00,.4);e.material.emissive.set(0xaa5500);e.position.set(x,1.98,-.25);z.add(e);}
 for(const x of [-.62,.62]){const a=cube(.26,.95,.3,sk,.9);a.position.set(x,1.2,-.05);a.rotation.x=-.25;z.add(a);}
 const club=cube(.16,.95,.16,0x5a3a1c,.9);club.position.set(.62,.65,-.42);club.rotation.x=-.9;z.add(club);
 for(const x of [-.24,.24]){const l=cube(.34,.75,.38,0x3b2f2a,.95);l.position.set(x,.38,0);z.add(l);legs.push(l);}
 z.userData.legs=legs;return z;
}
function spawnCannibal(){const z=cannMesh();monsterData(z,'c');const c=spawnAround(30,50);z.position.set(c[0],-4.5,c[1]);z.userData.rise=2.5;debris(c[0],.1,c[1],0x4a3a28,12);say(t('cnew'),5);sfx('roar');}
// meža cilvēki: dienā dzīvo mežā, uzbrūk ar nažiem, nedraudzējas; 22:00 pārvēršas vilkačos; katru rītu atkal 20
function forestMesh(){
 const z=new THREE.Group(),skin=0xb8a48c,cl=[0x3d4a2a,0x4a3b2a,0x2f3d2a][Math.floor(Math.random()*3)],legs=[];
 const body=cube(.72,.85,.4,cl,1);body.position.y=1.12;z.add(body);
 const head=cube(.46,.46,.44,skin,.85);head.position.y=1.78;z.add(head);
 const hood=cube(.54,.32,.52,0x2a2418,1);hood.position.set(0,1.98,.03);z.add(hood);
 for(const x of [-.11,.11]){const e=cube(.07,.05,.03,0xddcc33,.4);e.material.emissive.set(0x665500);e.position.set(x,1.8,-.23);z.add(e);}
 const armL=cube(.2,.65,.24,cl,1);armL.position.set(-.48,1.1,0);z.add(armL);
 const armR=cube(.2,.65,.24,cl,1);armR.position.set(.48,1.1,0);z.add(armR);
 const knife=cube(.05,.07,.42,0xbfc5cc,.25);knife.material.metalness=.8;knife.position.set(0,-.34,-.18);armR.add(knife);
 for(const x of [-.18,.18]){const l=cube(.26,.7,.28,0x2a2418,1);l.position.set(x,.38,0);z.add(l);legs.push(l);}
 z.userData.legs=legs;z.userData.arm=armR;return z;
}
function forestPoint(nx,nz){let best=null,bd=1e9;for(let k=0;k<8;k++){const side=Math.floor(Math.random()*4),v=(Math.random()*2-1)*(EDGE-12),d=CITY+8+Math.random()*(EDGE-CITY-16),x=side===0?d:side===1?-d:v,z=side===2?d:side===3?-d:v,dd=Math.hypot(x-nx,z-nz);if(dd<bd){bd=dd;best=[x,z];}}return best;}
function spawnForestMan(){const z=forestMesh();monsterData(z,'f');const[x,zz]=forestPoint((Math.random()*2-1)*EDGE,(Math.random()*2-1)*EDGE);z.position.set(x,0,zz);}
function respawnForest(){let n=zombies.filter(z=>z.userData.kind==='f'&&!z.userData.dead).length;for(;n<20;n++)spawnForestMan();}
function transformForest(){let n=0;for(const z of [...zombies]){const u=z.userData;if(u.kind!=='f'||u.dead)continue;const x=z.position.x,zz=z.position.z;removeMonster(z);const w=wolfMesh();monsterData(w,'w');w.position.set(x,0,zz);w.userData.hw=.5+Math.random()*4;explosionFx(x,1,zz,1.5,0x6b4a2f);n++;}return n;}
function updateForest(z,u,dt){
 const p=z.position;u.cd=(u.cd||0)-dt;
 const angry=u.angry>gtime;let tg=null,best=angry?60:24;
 for(const h of HL){if(h.b&&(h.b.trader||(h.b.team&&h.b.team.farm)))continue;const d=Math.hypot(h.p.x-p.x,h.p.z-p.z);if(d<best&&yOf(h)<1.3){best=d;tg=h;}} // ar tirgotājiem meža ļaudis nekaujas
 if(tg&&!angry&&Math.max(Math.abs(p.x),Math.abs(p.z))<CITY-40)tg=null; // dziļi pilsētā pakaļ nedzenas
 let gx,gz,sp;
 if(tg){gx=tg.p.x;gz=tg.p.z;sp=u.speed;}
 else{if(!u.wp||Math.hypot(u.wp[0]-p.x,u.wp[1]-p.z)<2)u.wp=forestPoint(p.x+(Math.random()-.5)*60,p.z+(Math.random()-.5)*60);gx=u.wp[0];gz=u.wp[1];sp=2;}
 const ox=p.x,oz=p.z;stepTo(p,gx,gz,sp,dt,.4,null,u);const mv=Math.hypot(p.x-ox,p.z-oz)>.001;
 if(mv)z.rotation.y=Math.atan2(-(p.x-ox),-(p.z-oz));
 const sw=mv?Math.sin(clock.elapsedTime*(tg?13:7)+u.phase)*.6:0;u.legs[0].rotation.x=sw;u.legs[1].rotation.x=-sw;
 if(u.armT>0){u.armT-=dt;u.arm.rotation.x=1.3;}else u.arm.rotation.x=-sw*.5;
 if(!tg)return;
 const d=Math.hypot(tg.p.x-p.x,tg.p.z-p.z);if(d<3)z.rotation.y=Math.atan2(-(tg.p.x-p.x),-(tg.p.z-p.z));
 if(d<u.reach&&u.cd<=0&&!blockedLine(p,tg.p,.8)){if(tg.pl){if(hurtWait>0)return;hurtWait=.28;}hurt(tg,u.dmg,null,false);u.cd=u.rate;u.armT=.2;}
}
function spawnWolf(){
 const z=wolfMesh();let best=null,bd=1e9;
 for(let k=0;k<14;k++){const side=Math.floor(Math.random()*4),v=(Math.random()*2-1)*(EDGE-10),d=CITY+6+Math.random()*30,x=side===0?d:side===1?-d:v,zz=side===2?d:side===3?-d:v,dd=Math.hypot(x-player.position.x,zz-player.position.z);if(dd<bd){bd=dd;best=[x,zz];}}
 monsterData(z,'w');z.position.set(best[0],0,best[1]);z.userData.hw=.5+Math.random()*2;
}
// ---------- vilkaču prāts: bars, apiešana, uzbrukums un atkāpšanās, lēciens pār zemu sienu, kaukšana ----------
const yOf=h=>h.pl?pY:(h.y||0),okH=h=>!!h&&(h.pl?active:!h.b.dead),hid=h=>h.pl?'P':h.b;
function howlAt(x,z){const d=Math.hypot(x-player.position.x,z-player.position.z);if(d>150)return;const v=Math.max(.012,.075*(1-d/150)),f=330+Math.random()*80;tone(f,1.1,'sine',v,f*1.75);tone(f*1.75,1.2,'sine',v*.8,f*.9,1.05);}
function wolfTarget(z,u){let best=null,bs=1e9;
 for(const h of HL){const d=Math.hypot(h.p.x-z.position.x,h.p.z-z.position.z);if(d>110||yOf(h)>1.2)continue;if(u.bad===hid(h)&&u.badT>gtime)continue;
  let near=0;for(const o of HL)if(o!==h&&o.team===h.team&&Math.hypot(o.p.x-h.p.x,o.p.z-h.p.z)<7)near++;
  const s=d+near*6+(h.pl?health:h.b.hp)*.06;if(s<bs){bs=s;best=h;}}
 return best||(active?HL[0]:null);}
function updateWolf(z,u,dt){
 const p=z.position;
 if(u.hw===undefined)u.hw=2+Math.random()*12;
 u.hw-=dt;if(u.hw<=0){u.hw=16+Math.random()*18;u.howlT=1.6;u.lh=gtime;howlAt(p.x,p.z);
  for(const o of zombies){const v=o.userData;if(o!==z&&v.kind==='w'&&!v.dead&&v.hw>4&&gtime-(v.lh??-99)>14&&Math.hypot(o.position.x-p.x,o.position.z-p.z)<80)v.hw=1+Math.random()*2.5;}}
 if(u.howlT>0){u.howlT-=dt;const a=-.9*Math.sin(Math.max(0,u.howlT)/1.6*Math.PI);u.head.forEach(m=>m.rotation.x=a);if(!u.tg||Math.hypot(u.tg.p.x-p.x,u.tg.p.z-p.z)>12)return;}
 u.tt=(u.tt||0)-dt;
 if(u.tt<=0||!okH(u.tg)){u.tt=1+Math.random()*.5;let tg=wolfTarget(z,u);
  if(Math.random()<.6)for(const o of zombies){const v=o.userData;if(o!==z&&v.kind==='w'&&!v.dead&&okH(v.tg)&&Math.hypot(o.position.x-p.x,o.position.z-p.z)<25&&!(u.bad===hid(v.tg)&&u.badT>gtime)){tg=v.tg;break;}}
  u.tg=tg;}
 const tg=u.tg;if(!okH(tg))return;
 const tx=tg.p.x,tz=tg.p.z,dist=Math.hypot(tx-p.x,tz-p.z);
 if(u.ang===undefined)u.ang=Math.random()*6.283;
 if(u.hp<u.max*.3&&!u.fled){u.fled=true;u.heal=8;}
 let gx=tx,gz=tz,sp=u.speed;u.cd=(u.cd||0)-dt;
 if(u.heal>0){u.heal-=dt;u.hp=Math.min(u.max,u.hp+7*dt);const l=dist||1;gx=p.x-(tx-p.x)/l*10;gz=p.z-(tz-p.z)/l*10;sp=u.speed*1.3;}
 else if(dist<16){
  let pack=0,guard=0;for(const o of zombies){const v=o.userData;if(v.kind==='w'&&!v.dead&&Math.hypot(o.position.x-tx,o.position.z-tz)<14)pack++;}
  for(const o of HL)if(o.team===tg.team&&Math.hypot(o.p.x-tx,o.p.z-tz)<8)guard++;
  if(guard>=3&&pack<3){u.ang+=dt*.35;gx=tx+Math.cos(u.ang)*13;gz=tz+Math.sin(u.ang)*13;sp=3.2;}
  else if(u.cd>0){u.ang+=dt*.8;gx=tx+Math.cos(u.ang)*5.5;gz=tz+Math.sin(u.ang)*5.5;}
  else sp=u.speed*1.6;
 }
 const ox=p.x,oz=p.z,d=stepTo(p,gx,gz,sp,dt,.4,null,u,1.05),mv=Math.hypot(p.x-ox,p.z-oz)>.001;
 if(mv)z.rotation.y=Math.atan2(-(p.x-ox),-(p.z-oz));
 if(dist<3&&!(u.heal>0))z.rotation.y=Math.atan2(-(tx-p.x),-(tz-p.z));
 p.y=groundAt(p.x,p.z,1.15,.4)+(mv?Math.abs(Math.sin(clock.elapsedTime*12+u.phase))*.08:0);
 const sw=mv?Math.sin(clock.elapsedTime*12+u.phase)*.6:0;u.legs[0].rotation.x=sw;u.legs[1].rotation.x=-sw;
 smashDoor(z,tg.p,dt);
 if(dist<20){if(blockedLine(p,tg.p,1.5)===2){u.ublk=(u.ublk||0)+dt;if(u.ublk>4){u.bad=hid(tg);u.badT=gtime+12;u.tt=0;u.ublk=0;}}else u.ublk=0;}
 if(!(u.heal>0)&&dist<u.reach&&u.cd<=0&&yOf(tg)<=p.y+1.25&&!blockedLine(p,tg.p,p.y+.8)){
  if(tg.pl){if(hurtWait>0)return;hurtWait=.28;}
  hurt(tg,u.dmg,null,false);u.cd=1.8+Math.random()*.9;u.ang=Math.atan2(p.z-tz,p.x-tx);
 }
}
// monstri neiet viens otram cauri (un savā starpā nekaro)
function sepMonsters(){for(let i=0;i<zombies.length;i++){const a=zombies[i],ua=a.userData;if(ua.dead||ua.rise>0)continue;for(let j=i+1;j<zombies.length;j++){const b=zombies[j],ub=b.userData;if(ub.dead||ub.rise>0)continue;const dx=b.position.x-a.position.x,dz=b.position.z-a.position.z,d=Math.hypot(dx,dz),r=.4*(ua.sc+ub.sc);if(d<r&&d>.001){const k=(r-d)/d*.5;a.position.x-=dx*k;a.position.z-=dz*k;b.position.x+=dx*k;b.position.z+=dz*k;}}}}
// atbrīvo atmiņu (ģeometrijas un materiālus), lai ilgā spēlē nekrājas
function freeObj(o){o.traverse(c=>{if(c.isMesh){if(c.geometry!==FXG&&c.geometry!==BGEO&&c.geometry!==RGEO)c.geometry.dispose();(Array.isArray(c.material)?c.material:[c.material]).forEach(m=>{if(!m.userData.keep)m.dispose();});}});}
function removeMonster(z){const u=z.userData;if(u.dead)return;u.dead=true;delBar(u.bar);scene.remove(z);freeObj(z);const i=zombies.indexOf(z);if(i>=0)zombies.splice(i,1);debris(z.position.x,.5,z.position.z,0x555555,5);}
function tryMerge(){
 if(madeZW>=4)return;
 const ok=o=>{const u=o.userData;return!u.dead&&!(u.rise>0)&&!u.dr&&!(u.flee>0)&&u.boom===undefined;};
 for(const w of zombies){if(w.userData.kind!=='w'||!ok(w))continue;
  const near=zombies.filter(o=>o!==w&&ok(o)&&Math.hypot(o.position.x-w.position.x,o.position.z-w.position.z)<6);
  const zs=near.filter(o=>o.userData.kind==='z'),ws=near.filter(o=>o.userData.kind==='w');
  if(zs.length<3||ws.length<1||Math.random()>.5)continue;
  const grp=[w,ws[0],zs[0],zs[1],zs[2]];let cx=0,cz=0;grp.forEach(o=>{cx+=o.position.x/5;cz+=o.position.z/5;removeMonster(o);});
  const zw=zwMesh();monsterData(zw,'zw');zw.position.set(cx,0,cz);madeZW++;explosionFx(cx,1.5,cz,3,0x9b59b6);
  if(Math.hypot(cx-player.position.x,cz-player.position.z)<60){say(t('zwmade'));sfx('roar');}
  return;}
}
function breakBlock(z,tg,dt){
 const u=z.userData;u.ba-=dt;if(u.ba>0)return;let best=null,bd=1e9;
 eachOb(z.position.x,z.position.z,2.7,o=>{if(o.y1===undefined||o.dead)return false;if(Math.hypot(o.x-z.position.x,o.z-z.position.z)>2.7)return false;const s=Math.hypot(o.x-tg.p.x,o.z-tg.p.z)+o.y0*.3;if(s<bd){bd=s;best=o;}return false;});
 if(!best)return;u.ba=1.2;damageBlock(best,best.door?60:25);sfxAt('bang',best.x,best.z,40);
}
function zombieBoom(z){
 const u=z.userData,R=u.kind==='zw'?6:4.5,D=u.kind==='zw'?55:35,x=z.position.x,zz=z.position.z;
 explosionFx(x,1,zz,R*.7,0xff7a1a);sfxAt('boom',x,zz,60);
 for(const h of [...HL]){const d=Math.hypot(h.p.x-x,h.p.z-zz);if(d<R)hurt(h,D*(1-d/R),null,false);}
 killZombie(z,false,true);
}
