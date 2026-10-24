// 15_vadiba.js - Telefona pogas, kloķis, debug (?debug)
// touch controls
const joy=$('joy'),knob=$('knob');let jid=null;
function jset(e){let b=joy.getBoundingClientRect(),dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2),m=Math.hypot(dx,dy),max=45;if(m>max){dx*=max/m;dy*=max/m;}knob.style.transform='translate('+dx+'px,'+dy+'px)';jx=Math.abs(dx)>9?dx/max:0;jy=Math.abs(dy)>9?dy/max:0;}
joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);jset(e);});
joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)jset(e);});
const jend=e=>{if(e.pointerId===jid){jid=null;jx=0;jy=0;knob.style.transform='';}};
joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
const jb=$('jump');jb.addEventListener('pointerdown',()=>{keys.Space=true;});
['pointerup','pointercancel','pointerleave'].forEach(n=>jb.addEventListener(n,()=>{keys.Space=false;}));
const ab=$('atk');ab.addEventListener('pointerdown',()=>{mouseDown=true;hit();});
['pointerup','pointercancel','pointerleave'].forEach(n=>ab.addEventListener(n,()=>{mouseDown=false;}));
const cv=renderer.domElement;cv.style.touchAction='none';let lid=null,lx=0,ly=0;
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){lid=e.pointerId;lx=e.clientX;ly=e.clientY;}});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&e.pointerId===lid){yaw-=(e.clientX-lx)*.005;pitch=clampP(pitch-(e.clientY-ly)*.004);lx=e.clientX;ly=e.clientY;}});
cv.addEventListener('pointerup',()=>{lid=null;});
$('lang').onclick=e=>{L=L==='lv'?'en':'lv';applyLang();e.currentTarget.blur();};
$('info').onclick=e=>{const b=$('infobox');b.style.display=b.style.display==='block'?'none':'block';e.currentTarget.blur();};
$('invb').onclick=e=>{toggleInv();e.currentTarget.blur();};
$('tmb').onclick=e=>{toggleTeam();e.currentTarget.blur();};
$('bld').onclick=e=>{toggleBuild();e.currentTarget.blur();};
$('snd').onclick=e=>{muted=!muted;e.currentTarget.textContent=muted?'🔇':'🔊';e.currentTarget.blur();};
$('view').onclick=e=>{toggleView();e.currentTarget.blur();};
$('act').addEventListener('pointerdown',e=>{e.preventDefault();interact();});
$('wsw').addEventListener('pointerdown',e=>{e.preventDefault();if(!active)return;if(buildMode){bTool=bTool==='blk'?'door':'blk';renderW();}else nextW();});
$('bmb').addEventListener('pointerdown',e=>{e.preventDefault();toggleBuild();});
$('rmb').addEventListener('pointerdown',e=>{e.preventDefault();buildAct(true);});
$('cfg').onclick=e=>{document.documentElement.classList.toggle('cfg');e.currentTarget.blur();};
applyLang();
// testēšanai: atver ar ?debug
if(/debug/.test(location.search))window.MW={setHour:h=>{hour=h;lastH=Math.floor(h);clkM=-1;},get:()=>({hour,day,active,health,pY,cur,inv,blocks:PT&&PT.blocks,zombies:zombies.map(z=>z.userData.kind),humans:humans.length,teams:teams.map(x=>({id:x.id,n:x.members.length,isP:x.isPlayer,calm:!!x.calm,pal:!!x.pal,foes:x.enemies.size,plan:x.plan.length,base:x.base})),nblocks:[...blocks.values()].reduce((a,c)=>a+c.length,0),pos:player.position.clone()}),
 give:k=>{giveLoot(k,inv,PT);autoGun();renderInv();},tp:(x,z,y)=>{player.position.set(x,y||0,z);pY=y||0;onGround=!y;vy=0;},spawn:(k,dx,dz)=>{if(k==='w')spawnWolf();else if(k==='zw'){const m=zwMesh();monsterData(m,'zw');}else if(k==='s')spawnSkeleton();else if(k==='c'){const m=cannMesh();monsterData(m,'c');}else spawnZombie(false);const z=zombies[zombies.length-1];if(dx!==undefined){z.userData.rise=0;z.position.set(player.position.x+dx,0,player.position.z+dz);}},
 merge:()=>{const p=player.position;for(let i=0;i<3;i++){spawnZombie(false);const z=zombies[zombies.length-1];z.userData.rise=0;z.position.set(p.x+8+i*.5,0,p.z+8);}for(let i=0;i<2;i++){spawnWolf();const z=zombies[zombies.length-1];z.position.set(p.x+8,0,p.z+8.5+i*.5);}tryMerge();tryMerge();tryMerge();},
 yaw:v=>{yaw=v;},build:(d)=>{bTool=d?'door':'blk';buildAct(false);},cmd:(c)=>setCmd('all',c),
 recruit:n=>{const b=humans.find(x=>x.team!==PT&&!PT.enemies.has(x.team)&&(!n||x.name===n));if(b){b.g.position.set(player.position.x+1,0,player.position.z+1);askJoin(b);}},
 hurt:d=>damagePlayer(d,null),
 mons:()=>zombies.map(z=>({k:z.userData.kind,hp:Math.round(z.userData.hp),d:Math.round(Math.hypot(z.position.x-player.position.x,z.position.z-player.position.z)),rise:z.userData.rise>0,y:+z.position.y.toFixed(2),cd:+(z.userData.cd||0).toFixed(1),howl:z.userData.howlT>0,heal:z.userData.heal>0})),
 aim:()=>{let b=null,bd=1e9;for(const z of zombies){const d=Math.hypot(z.position.x-player.position.x,z.position.z-player.position.z);if(d<bd&&!(z.userData.rise>0)){bd=d;b=z;}}if(b)yaw=Math.atan2(-(b.position.x-player.position.x),-(b.position.z-player.position.z));return bd;},
 fire:()=>{attackWait=0;hit();},
 info:()=>({calls:renderer.info.render.calls,tris:renderer.info.render.triangles,geos:renderer.info.memory.geometries,tex:renderer.info.memory.textures,q:qLvl,pr:renderer.getPixelRatio(),touch:TOUCH}),
 bring:n=>{const b=humans.find(x=>x.name===n)||humans.find(x=>x.team!==PT);b.g.position.set(player.position.x+1.2,0,player.position.z);return b.name;},
 tap:id=>{$(id).dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));$(id).dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));},
 ring:(s,h)=>{const bx=Math.round(player.position.x),bz=Math.round(player.position.z);for(let l=0;l<h;l++)for(let dx=-s;dx<=s;dx++)for(let dz=-s;dz<=s;dz++)if(Math.max(Math.abs(dx),Math.abs(dz))===s)placeBlock(bx+dx,bz+dz,PT,false);player.position.set(bx,0,bz);},
 warNear:()=>{let b=null,bd=1e9;for(const x of humans){if(x.team===PT)continue;const d=Math.hypot(x.g.position.x-player.position.x,x.g.position.z-player.position.z);if(d<bd){bd=d;b=x;}}if(b){b.g.position.set(player.position.x+10,0,player.position.z);war(PT,b.team);return b.name+' '+b.team.members.length;}},sel:w=>selectW(w),bots:()=>humans.map(b=>({n:b.name,t:b.team.id,hp:Math.round(b.hp),role:b.role,cmd:b.cmd,x:Math.round(b.g.position.x),z:Math.round(b.g.position.z),tg:!!b.tg,stuck:b.st.stuck||0}))};
