// 48_heli_raketes.js - Helikoptera raķetes vada ar mērķīti: raķete lido pa līniju, kur rāda ekrāna vidus (⭕), tāpēc pilots to uzvada, pagriežot helikopteru vai skatu.
// Uzsprāgst pie ienaidnieku tehnikas, helikoptera, lidmašīnas vai novērošanas torņa (arī pa zemi). Lidmašīnu notriec ar vienu raķeti.
// Boti vada savas raķetes uz mērķi ar 60% precizitāti (40% gadījumu raķete aiziet garām); uz tehniku raidītu bota raķeti var novirzīt ar mānekļiem.
Object.assign(T.lv,{hr_tip:'🚀 Raķeti vada mērķītis ⭕: turi to uz tehnikas, lidmašīnas vai torņa, līdz raķete trāpa'});
Object.assign(T.en,{hr_tip:'🚀 The crosshair ⭕ guides the missile: keep it on the vehicle, plane or tower until it hits'});
const HRSP=50,HRBOT=.6; // raķetes ātrums, botu precizitāte
// botu mērķis: tehnika, helikopteri (arī lidojoši) un lidmašīnas priekšā līdz 85 m
heliRocketTarget=function(H,team){const fx=-Math.sin(H.a),fz=-Math.cos(H.a);let best=null,bs=1e9;
 const look=(x,z,y,ref,kind)=>{const dx=x-H.x,dz=z-H.z,d=Math.hypot(dx,dz);if(d>85)return;const df=d<2?0:Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(df>.6)return;if(df*40+d*.2<bs){bs=df*40+d*.2;best={x,y,z,ref,kind};}};
 const foe=T2=>T2&&T2!==team&&(team===PT?!T2.friendly:team.enemies.has(T2));
 for(const t of tanks)if(!t.dead&&t!==inTank&&(!t.driver||t.driver.team!==team))look(t.g.position.x,t.g.position.z,1.2,t,'tank');
 if(team!==PT&&inTank&&team.enemies.has(PT))look(inTank.g.position.x,inTank.g.position.z,1.2,inTank,'tank');
 for(const Q of HELIS)if(Q!==H){if(Q.st==='park'&&Q.owner!==team)look(Q.x,Q.z,Q.y+1,Q,'heli');else if(Q.st==='fly'&&foe(heliTeam(Q)))look(Q.x,Q.z,Q.y+1.5,Q,'heli');}
 for(const J of JETS)if(J.st==='fly'&&foe(pilotTeam(J)))look(J.x,J.z,J.y,J,'jet');
 return best||{x:H.x+fx*25,y:0,z:H.z+fz*25};};
heliRocket=function(H,team,pl,tp){if(!(H.rk>0))return;H.rk--;const fx=-Math.sin(H.a),fz=-Math.cos(H.a),x=H.x+fx*2,y=H.y+1,z=H.z+fz*2;
 spawnJetRocket(x,y,z,x+fx*30,y-3,z+fz*30,team,pl,H.pilot,null,.8);const r=JR[JR.length-1];r.th=1;r.gd=true;r.H=H;r.P=H.pilot;r.life=5;r.t=0;
 const v=Math.hypot(r.vx,r.vy,r.vz)||1;r.vx*=HRSP/v;r.vy*=HRSP/v;r.vz*=HRSP/v;
 if(H.pilot&&H.pilot.g){const q=tp&&tp.ref?tp:heliRocketTarget(H,team);if(q.ref){r.gv=q.ref;}else r.gp={x:q.x,y:q.y,z:q.z};
  if(Math.random()>HRBOT){const a=Math.random()*6.28,m=8+Math.random()*7;r.miss={x:Math.sin(a)*m,y:2+Math.random()*4,z:Math.cos(a)*m};}}};
// punkts uz mērķīša līnijas nedaudz priekšā raķetei
function hrBeam(o,d,r){const s=Math.max(0,(r.x-o.x)*d.x+(r.y-o.y)*d.y+(r.z-o.z)*d.z)+18;return{x:o.x+d.x*s,y:o.y+d.y*s,z:o.z+d.z*s};}
const hrDir=new THREE.Vector3();
function hrAim(r){const P=r.P,H=r.H;
 if(P==='P'&&heliMode===H){camera.getWorldDirection(hrDir);return hrBeam(camera.position,hrDir,r);}
 if(P&&P.pos){const R=P.hrRay;return R&&P.inHeli===H&&gtime-R.t<.6?hrBeam(R.o,R.d,r):null;}
 const m=r.miss||{x:0,y:0,z:0};
 if(r.gv){if(!flAlive(r.gv)){r.gv=null;return null;}const p=flPos(r.gv);return{x:p.x+m.x,y:p.y+m.y,z:p.z+m.z};}
 return r.gp?{x:r.gp.x+m.x,y:r.gp.y,z:r.gp.z+m.z}:null;}
// ko raķete aizķer: lidmašīna, helikopters, tehnika, tornis
function hrHit(r){const tm=r.team;
 for(const J of JETS)if((J.st==='fly'||J.st==='fall')&&pilotTeam(J)!==tm&&Math.hypot(J.x-r.x,J.y-r.y,J.z-r.z)<5)return{k:'jet',v:J};
 for(const Q of HELIS){if(Q===r.H||Q.st==='gone'||(Q.st==='park'?Q.owner===tm:heliTeam(Q)===tm))continue;if(Math.hypot(Q.x-r.x,Q.y+1.5-r.y,Q.z-r.z)<4)return{k:'heli',v:Q};}
 for(const t of tanks){if(t.dead)continue;const tt=t===inTank?PT:t.driver?t.driver.team:t.army;if(tt===tm)continue;if(Math.hypot(t.g.position.x-r.x,1.2-r.y,t.g.position.z-r.z)<3.5)return{k:'tank',v:t};}
 for(const T2 of TOWERS)if(!T2.dead&&Math.hypot(T2.x-r.x,T2.z-r.z)<2.6&&r.y<T2.h+2)return{k:'tw',v:T2};
 return null;}
function hrBoom(r,h){SHOOTER=ownId(r.owner);
 if(h&&h.k==='jet'){explosionFx(r.x,r.y,r.z,4,0xff7a1a);jetDamage(h.v,99,r.team,r.pl);}
 else if(h&&h.k==='heli'){explosionFx(r.x,r.y,r.z,4,0xff7a1a);destroyHeli(h.v,r.team);}
 else if(h&&h.k==='tw'){explosionFx(r.x,r.y,r.z,3,0xff9e40);collapseTower(h.v);}
 else if(h||r.y<2||bldHit(r.x,r.z,r.y))jetBoom(r.x,r.z,r.team,r.pl,1,r.boom,r.th);
 else explosionFx(r.x,r.y,r.z,2,0xff9e40);
 SHOOTER=0;}
function hrTick(dt){for(let i=JR.length-1;i>=0;i--){const r=JR[i];if(!r.gd)continue;r.life-=dt;r.t+=dt;
  const A=r.t>.12?hrAim(r):null;
  if(A){const dx=A.x-r.x,dy=A.y-r.y,dz=A.z-r.z,l=Math.hypot(dx,dy,dz)||1,k=Math.min(1,dt*(r.P&&r.P.g?3:5));r.vx+=(dx/l*HRSP-r.vx)*k;r.vy+=(dy/l*HRSP-r.vy)*k;r.vz+=(dz/l*HRSP-r.vz)*k;
   const v=Math.hypot(r.vx,r.vy,r.vz)||1;r.vx*=HRSP/v;r.vy*=HRSP/v;r.vz*=HRSP/v;}
  r.x+=r.vx*dt;r.y+=r.vy*dt;r.z+=r.vz*dt;r.m.position.set(r.x,r.y,r.z);r.m.lookAt(r.x+r.vx,r.y+r.vy,r.z+r.vz);if(Math.random()<dt*25)debris(r.x,r.y,r.z,0xffb74d,1);
  const h=hrHit(r);if(h||r.y<.4||r.life<=0||(r.y<45&&bldHit(r.x,r.z,r.y))){scene.remove(r.m);JR.splice(i,1);hrBoom(r,h);}}}
// ---------- spēlētājs: padoms pirmajā šāvienā; draugs sūta savu mērķīša līniju saimniekam ----------
let hrTipped=false,hrSendT=0,hrNetT=0;
const _heliRocketLocal48=heliRocketLocal;heliRocketLocal=function(){const H=heliMode,n=H&&H.rk;_heliRocketLocal48();if(!H||H.rk===n)return;hrSendT=gtime+5.2;if(!hrTipped){hrTipped=true;say(t('hr_tip'),4);}};
const _netHostMsg48=netHostMsg;netHostMsg=function(G,d){if(d&&G.ready&&d.t==='hrg'){if(Array.isArray(d.o)&&Array.isArray(d.d)){const o=d.o.map(Number),q=d.d.map(Number);G.hrRay={o:{x:o[0],y:o[1],z:o[2]},d:{x:q[0],y:q[1],z:q[2]},t:gtime};}return;}_netHostMsg48(G,d);};
const _updateFx48=updateFx;updateFx=function(dt){_updateFx48(dt);
 if(NET.role!=='guest')hrTick(dt);
 else if(heliMode&&gtime<hrSendT&&(hrNetT-=dt)<=0){hrNetT=.1;camera.getWorldDirection(hrDir);const c=camera.position;netSend({t:'hrg',o:[r2(c.x),r2(c.y),r2(c.z)],d:[r2(hrDir.x),r2(hrDir.y),r2(hrDir.z)]});}};
