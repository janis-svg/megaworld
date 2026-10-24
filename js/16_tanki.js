// 16_tanki.js - Tanki: atrodami pilsētā, 3 šāviņi, liels sprādziens; kad šāviņi beidzas, tanks vairs neiet
const tanks=[];let inTank=null;
function tankMesh(){
 const g=new THREE.Group(),ol=0x4b5320,dk=0x2b2f1a;
 const hull=cube(3.2,1,4.6,ol,.8);hull.position.y=.9;g.add(hull);
 for(const x of [-1.45,1.45]){const tr=cube(.7,.8,4.8,0x1a1a1a,.9);tr.position.set(x,.45,0);g.add(tr);}
 const tur=new THREE.Group();tur.position.y=1.4;g.add(tur);
 const top=cube(1.9,.8,2.2,ol,.75);top.position.y=.4;tur.add(top);
 const barrel=cube(.28,.28,2.8,dk,.6);barrel.position.set(0,.45,-2.3);tur.add(barrel);
 const hatch=cube(.6,.15,.6,dk,.8);hatch.position.set(.3,.85,.3);tur.add(hatch);
 const star=cube(.5,.5,.05,0xc0392b,.6);star.position.set(0,.95,2.32);g.add(star);
 g.userData.tur=tur;g.userData.hull=hull;return g;
}
function spawnTanks(){
 for(const t of tanks){scene.remove(t.g);freeObj(t.g);remOb(t.ob);}tanks.length=0;inTank=null;
 const spots=[[20,4]]; // viens netālu no sākuma, uz ielas
 for(let i=0;i<3;i++){let x=0,z=0;for(let k=0;k<30;k++){[x,z]=roadPoint(0,0,1e9);if(Math.hypot(x,z)>50)break;}spots.push([x,z]);}
 for(const [x,z] of spots){const g=tankMesh();g.position.set(x,0,z);g.rotation.y=Math.random()*6.283;scene.add(g);const t={g,shells:3,dead:false,ob:{x,z,hx:1.8,hz:1.8}};addOb(t.ob);tanks.push(t);}
}
function enterTank(t){
 if(t.dead){say(t_('tank_dead'));return;}
 inTank=t;remOb(t.ob);buildMode=false;
 player.position.set(t.g.position.x,0,t.g.position.z);pY=0;vy=0;onGround=true;
 say(tf('tank_go',{n:t.shells}));sfx('door');renderW();
}
function exitTank(){
 const t=inTank;if(!t)return;inTank=null;
 t.ob.x=t.g.position.x;t.ob.z=t.g.position.z;addOb(t.ob);
 const a=t.g.rotation.y;player.position.set(t.g.position.x+Math.cos(a)*2.9,0,t.g.position.z-Math.sin(a)*2.9);pushOut(player.position,.35,0,PT);
 sfx('door');renderW();
}
function fireTank(){
 const t=inTank;if(!t||attackWait>0||t.shells<=0)return;
 t.shells--;attackWait=1.2;
 const ay=assistYaw(40),a=ay===null?yaw:ay,fx=-Math.sin(a),fz=-Math.cos(a);
 const m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0x222222}));m.scale.setScalar(1.5);
 m.position.set(t.g.position.x+fx*3.6,1.9,t.g.position.z+fz*3.6);scene.add(m);
 bullets.push({m,vx:fx*40,vz:fz*40,life:2,dmg:0,team:PT,pl:true,rocket:true,shell:true});
 sfx('rocket');sfx('boom');explosionFx(m.position.x,1.9,m.position.z,1,0xffcc66);
 t.g.userData.tur.position.z=.25;setTimeout(()=>{t.g.userData.tur.position.z=0;},150);
 renderW();
 if(t.shells<=0){t.dead=true;say(t_('tank_empty'),4);setTimeout(()=>{if(inTank===t)exitTank();t.g.userData.hull.material.color.setHex(0x2a2a22);},1500);}
}
// tanka šāviņš: liels sprādziens, zombiji tuvumā iet bojā, cilvēkēdājs ar vienu šāvienu
function tankBoom(p){
 const x=p.x,z=p.z;explosionFx(x,1,z,5,0xff7a1a);sfxAt('boom',x,z,90);
 for(const m of [...zombies]){const d=Math.hypot(m.position.x-x,m.position.z-z);if(d<6.5)dmgMonster(m,m.userData.kind==='c'?2:900,true,true);}
 for(const h of [...HL]){if(h.team===PT)continue;const d=Math.hypot(h.p.x-x,h.p.z-z);if(d<5)hurt(h,150*(1-d/6),PT,true);}
 const hitB=new Set();eachOb(x,z,3,o=>{if(o.y1!==undefined&&!o.dead&&o.team!==PT&&Math.hypot(o.x-x,o.z-z)<3)hitB.add(o);return false;});hitB.forEach(o=>damageBlock(o,300));
 for(const ch of chunks.values())for(const o of ch.inter)if(o.type==='door'&&o.hp>0&&Math.hypot(o.x-x,o.z-z)<4){o.hp=0;o.dob.off=true;o.piv.visible=false;o.r=0;o.open=true;}
}
function updateTanks(dt){
 for(const t of tanks){
  const g=t.g;
  if(t===inTank){
   const dx=player.position.x-g.position.x,dz=player.position.z-g.position.z;
   if(Math.hypot(dx,dz)>.01){const ta=Math.atan2(-dx,-dz);let df=ta-g.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));if(Math.abs(df)>Math.PI/2){df=Math.atan2(Math.sin(df+Math.PI),Math.cos(df+Math.PI));}g.rotation.y+=df*Math.min(1,dt*4);}
   g.position.set(player.position.x,0,player.position.z);
   g.userData.tur.rotation.y=yaw-g.rotation.y;
  }
  g.visible=Math.hypot(g.position.x-player.position.x,g.position.z-player.position.z)<120;
  if(t.dead&&g.visible&&Math.random()<dt*1.5)debris(g.position.x,2.2,g.position.z,0x333333,1);
 }
}
const t_=k=>t(k);
