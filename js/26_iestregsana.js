// 26_iestregsana.js - Lai neviens neuzkaras: briesmoņi neparādās un nepaliek ēkās, iestrēgušos pārliek brīvā vietā; spēlētājs izlec ar lēcienu + sānu kustību
Object.assign(T.lv,{unstuck:'↗️ Izlēci ārā!'});Object.assign(T.en,{unstuck:'↗️ You jumped free!'});
// ēka (būdiņa, tornis, privātmāja), kuras laukumā atrodas punkts
function bldAt(x,z,m){for(const ch of chunks.values())for(const b of ch.blds||[]){if(b.burnt)continue;if(Math.abs(x-b.x)<b.hx+m&&Math.abs(z-b.z)<b.hz+m)return b;}return null;}
// tuvākā brīvā vieta (nav sienas, nav ēkas iekšpuse)
function freeSpot(x,z,rad,r0,r1){for(let r=r0;r<=r1;r+=1)for(let k=0;k<14;k++){const a=k/14*6.283+r,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;
 if(Math.abs(px)>EDGE-4||Math.abs(pz)>EDGE-4||overlapAt(px,pz,rad)||bldAt(px,pz,rad+.3))continue;return[px,pz];}return null;}
// briesmoņi neizlien no zemes ēku iekšpusē
const _spawnAround9=spawnAround;spawnAround=function(r0,r1){const c=_spawnAround9(r0,r1);if(!bldAt(c[0],c[1],1.2))return c;return freeSpot(c[0],c[1],1.2,2,24)||c;};
// reizi sekundē: kas ilgi stāv uz vietas vai lielais briesmonis ir ēkā, to pārliek brīvā vietā
let stuckT=0;
function relocate(p,rad,x,z,r0,r1){const s=freeSpot(x,z,rad,r0,r1);if(!s)return false;debris(p.x,.6,p.z,0x555555,4);p.x=s[0];p.z=s[1];debris(p.x,.6,p.z,0x555555,4);return true;}
function stuckTick(dt){stuckT-=dt;if(stuckT>0)return;stuckT=1;
 for(const z of zombies){const u=z.userData,p=z.position;if(u.dead||u.rise>0||u.sink>0||u.flee>0||u.boom!==undefined||u.crumble!==undefined)continue;
  const rad=.45*Math.min(u.sc||1,2.2);let td=1e9,tg=null;for(const h of HL){const d=Math.hypot(h.p.x-p.x,h.p.z-p.z);if(d<td){td=d;tg=h;}}
  // lielie (zombvilks, cilvēkēdājs, milzis) nedrīkst iesprūst mājā, ja mērķis nav tajā pašā mājā
  const big=(u.sc||1)>=1.5,b=big?bldAt(p.x,p.z,0):null;
  if(b&&!(tg&&bldAt(tg.p.x,tg.p.z,0)===b)){u.inB=(u.inB||0)+1;if(u.inB>=3){u.inB=0;relocate(p,rad,b.x,b.z,Math.max(b.hx,b.hz)+2,Math.max(b.hx,b.hz)+14);}}else u.inB=0;
  // stāv uz vietas, kaut gan mērķis ir tālu
  const mv=u.lx===undefined?9:Math.hypot(p.x-u.lx,p.z-u.lz);u.lx=p.x;u.lz=p.z;
  if(mv<.5&&td>10&&td<200&&u.kind!=='w'&&u.kind!=='f'){u.still=(u.still||0)+1;if(u.still>=6){u.still=0;relocate(p,rad,p.x,p.z,3,16);}}else u.still=0;}
 for(const b of humans){if(b.dead||b.inside||b.jet)continue;const p=b.g.position,mv=b.lx===undefined?9:Math.hypot(p.x-b.lx,p.z-b.lz);b.lx=p.x;b.lz=p.z;
  const want=b.gx!=null&&Math.hypot(b.gx-p.x,b.gz-p.z)>3;if(want&&mv<.3){b.still=(b.still||0)+1;if(b.still>=8){b.still=0;if(relocate(p,.35,p.x,p.z,1,10)){b.gx=null;b.wps=[];b.co=null;b.bi=null;}}}else b.still=0;}
}
const _updateFx9=updateFx;updateFx=function(dt){_updateFx9(dt);if(NET.role!=='guest'&&(active||NET.guests.size))stuckTick(dt);};
// ---------- spēlētājs: ja iesprūdis, lēciens + kustība uz sāniem izlec ārā ----------
let pStuck=0,escCd=0,goodT=0;const goodPos=[];
function escapeNow(){escCd=1.2;pStuck=0;const p=player.position;
 let s=null;for(let i=goodPos.length-1;i>=0;i--){const g=goodPos[i];if(Math.hypot(g.x-p.x,g.z-p.z)>.8&&!overlapAt(g.x,g.z,.35,g.y,PT)){s=[g.x,g.z];pY=g.y;break;}}
 if(!s){s=freeSpot(p.x,p.z,.35,1,8);pY=0;}if(!s)return;
 p.x=s[0];p.z=s[1];vy=5;onGround=false;say(t('unstuck'),1.2);sfx('click');}
const _move9=move;move=function(dt){const x0=player.position.x,z0=player.position.z;_move9(dt);escCd-=dt;if(inTank||(typeof jetMode!=='undefined'&&jetMode))return;
 const p=player.position,inp=keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD||Math.abs(jx)>.25||Math.abs(jy)>.25,mv=Math.hypot(p.x-x0,p.z-z0),side=keys.KeyA||keys.KeyD||Math.abs(jx)>.3;
 if(inp&&mv<dt*1.4)pStuck+=dt;else pStuck=Math.max(0,pStuck-dt*2);
 // atceras pēdējās vietas, kur varēja brīvi iet
 goodT-=dt;if(goodT<=0&&mv>dt*3&&!overlapAt(p.x,p.z,.35,pY,PT)){goodT=.4;goodPos.push({x:p.x,z:p.z,y:pY});if(goodPos.length>8)goodPos.shift();}
 if(escCd<=0&&((pStuck>.25&&side&&(keys.Space||!onGround))||(pStuck>2.5&&overlapAt(p.x,p.z,.3,pY,PT))))escapeNow();};
