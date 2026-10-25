// 35_grafika.js - Grafika: krāsu apstrāde un diennakts gaisma, saule debesīs, zāles un asfalta virsmas, lodes kā gaismas strīpas,
// uzliesmojums pie stobra, sprādzieni ar dūmiem un dzirkstelēm, raķešu un lidmašīnu dūmu astes, helikoptera putekļi; kvalitāte 🎨 Zema / Vidēja / Augsta
Object.assign(T.lv,{gfx:'🎨 Grafika',g_low:'Zema',g_mid:'Vidēja',g_high:'Augsta'});Object.assign(T.en,{gfx:'🎨 Graphics',g_low:'Low',g_mid:'Medium',g_high:'High'});
let GFX=LS.get('gfx',TOUCH?'mid':'high');if(!['low','mid','high'].includes(GFX))GFX='mid';
const GQ={low:{parts:50,light:false},mid:{parts:140,light:true},high:{parts:280,light:true}};
// ---------- krāsu apstrāde (kā kino) ----------
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
scene.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);});
// ---------- debesis un gaisma pēc diennakts laika: zeltains rīts un vakars, zila diena, zilgana nakts ----------
const hx=s=>new THREE.Color(s);
function cmix(a,b,k){return hx(a).lerp(hx(b),Math.max(0,Math.min(1,k)));}
const _drawSky22=drawSky;drawSky=function(k){if(!skyC){_drawSky22(k);}const kk=Math.min(1,k/.68),h=typeof hour==='number'?hour:12,gold=Math.max(0,1-Math.abs(h-7.2)/1.6)+Math.max(0,1-Math.abs(h-18.6)/1.6),gd=Math.min(1,gold)*(1-kk*.6);
 const top=cmix('#4a7cc7','#0a0f1f',kk).lerp(hx('#6d5a8c'),gd*.35),mid=cmix('#9cc1ea','#22283f',kk).lerp(hx('#f2b27a'),gd*.55),hor=cmix('#e3ecf5','#3a3045',kk).lerp(hx('#ffae66'),gd*.75);
 const g=skyC.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#'+top.getHexString());gr.addColorStop(.55,'#'+mid.getHexString());gr.addColorStop(1,'#'+hor.getHexString());g.fillStyle=gr;g.fillRect(0,0,2,256);skyTex.needsUpdate=true;
 scene.fog.color.copy(cmix('#b7c3cf','#151a26',kk).lerp(hx('#d9a07a'),gd*.45));
 sun.color.copy(cmix('#fff1dc','#7f92c8',kk).lerp(hx('#ffa050'),gd*.7));sun.intensity=2.5-2*kk;hemi.intensity=1.15-.75*kk;hemi.color.copy(cmix('#c8daf0','#3a4870',kk));amb.intensity=.35-.15*kk;
 for(const o of skyline.children){const m=o.material;if(!m.userData.c0)m.userData.c0=m.color.clone();m.color.copy(m.userData.c0).multiplyScalar(1-.75*kk).lerp(hx('#9aa8b8'),.25*(1-kk));}
 if(sunDisc)sunDisc.material.opacity=Math.max(0,1-kk*1.6);};
// saules disks debesīs (gaismas virzienā)
function glowTex(inner,outer){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,inner);r.addColorStop(.35,inner);r.addColorStop(1,outer);g.fillStyle=r;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
const sunDisc=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('rgba(255,246,225,1)','rgba(255,220,160,0)'),fog:false,transparent:true,depthWrite:false}));sunDisc.scale.set(34,34,1);scene.add(sunDisc);
const SUNDIR=new THREE.Vector3(-25,40,15).normalize();
// ---------- virsmas: zāle un asfalts ar rakstu ----------
function noiseTex(base,vary,dots,size,lines){const c=document.createElement('canvas');c.width=c.height=size||128;const g=c.getContext('2d'),S=c.width;g.fillStyle=base;g.fillRect(0,0,S,S);
 for(let i=0;i<dots;i++){const v=vary[Math.floor(Math.random()*vary.length)];g.fillStyle=v;const s=1+Math.random()*2.5;g.fillRect(Math.random()*S,Math.random()*S,s,s);}
 if(lines){g.strokeStyle='rgba(20,20,20,.55)';g.lineWidth=1;for(let i=0;i<lines;i++){g.beginPath();let x=Math.random()*S,y=Math.random()*S;g.moveTo(x,y);for(let k=0;k<4;k++){x+=(Math.random()-.5)*22;y+=(Math.random()-.5)*22;g.lineTo(x,y);}g.stroke();}}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;}
const GRASS=noiseTex('#5f7f45',['#4f6d38','#6d8f50','#56743f','#7a9a58','#46622f'],2600,128),ASPH=noiseTex('#505357',['#484b4f','#585b5f','#44474b','#5c5f63'],1600,128,3);
GRASS.repeat.set(70,70);floor.material.map=GRASS;floor.material.color.set(0xb4c4a0);floor.material.needsUpdate=true;
const ASPHR=ASPH.clone();ASPHR.needsUpdate=true;ASPHR.repeat.set(3,3);
function chunkSurfaces(ch){if(!ch)return;ch.group.traverse(o=>{if(!o.isMesh||!o.material||!o.material.color)return;const m=o.material,hx2=m.color.getHex();
  if(hx2===0x2f4a2a&&!m.map){m.map=GRASS;m.color.set(0x9fb48a);m.needsUpdate=true;}else if(m===AM&&!m.map){m.map=ASPHR;m.color.set(0x8c8f93);m.needsUpdate=true;}});}
const _genChunk22=genChunk;genChunk=function(cx,cz){_genChunk22(cx,cz);chunkSurfaces(chunks.get(cx+','+cz));};
for(const ch of chunks.values())chunkSurfaces(ch);
// ---------- daļiņas: dūmi, uguns, dzirksteles, putekļi ----------
const PT_SMOKE=glowTex('rgba(150,150,150,.9)','rgba(120,120,120,0)'),PT_FIRE=glowTex('rgba(255,220,140,1)','rgba(255,110,20,0)'),PT_DUST=glowTex('rgba(170,140,100,.8)','rgba(150,120,80,0)'),PT_FLASH=glowTex('rgba(255,250,220,1)','rgba(255,200,80,0)');
const PARTS=[];
function part(tex,x,y,z,s,life,vx,vy,vz,grow,add,col){if(PARTS.length>=GQ[GFX].parts)return null;if(Math.hypot(x-player.position.x,z-player.position.z)>110)return null;
 const m=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending,color:col||0xffffff});const sp=new THREE.Sprite(m);sp.position.set(x,y,z);sp.scale.set(s,s,1);scene.add(sp);
 const p={sp,life,max:life,vx:vx||0,vy:vy||0,vz:vz||0,grow:grow||0,s,o:m.opacity};PARTS.push(p);return p;}
function partsTick(dt){for(let i=PARTS.length-1;i>=0;i--){const p=PARTS[i];p.life-=dt;const k=1-p.life/p.max;p.sp.position.x+=p.vx*dt;p.sp.position.y+=p.vy*dt;p.sp.position.z+=p.vz*dt;
  const s=p.s*(1+p.grow*k);p.sp.scale.set(s,s,1);p.sp.material.opacity=Math.max(0,1-k)*p.o;if(p.life<=0){scene.remove(p.sp);p.sp.material.dispose();PARTS.splice(i,1);}}}
// ---------- viena uzliesmojuma gaisma (sprādzieni naktī apgaismo apkārtni) ----------
const FLASH=new THREE.PointLight(0xffa040,0,28,2);scene.add(FLASH);let flashT=0;
function lightFlash(x,y,z,power){if(!GQ[GFX].light)return;FLASH.position.set(x,y+1.5,z);FLASH.intensity=Math.max(FLASH.intensity,power);flashT=.28;}
// ---------- sprādziens: uguns bumba, dūmu stabs, dzirksteles ----------
const _explosionFx22=explosionFx;explosionFx=function(x,y,z,r,col){_explosionFx22(x,y,z,r,col);if(Math.hypot(x-player.position.x,z-player.position.z)>110)return;const big=r>=2;
 part(PT_FLASH,x,y+.3,z,r*2.4,.22,0,0,0,.6,true);for(let i=0;i<(big?5:2);i++)part(PT_FIRE,x+(Math.random()-.5)*r,y+Math.random()*r*.6,z+(Math.random()-.5)*r,r*1.1,.45+Math.random()*.3,(Math.random()-.5)*2,1.5+Math.random()*2,(Math.random()-.5)*2,.8,true);
 if(big){for(let i=0;i<Math.min(8,2+r*1.2);i++)part(PT_SMOKE,x+(Math.random()-.5)*r,y+.5+Math.random()*r*.5,z+(Math.random()-.5)*r,r*1.2,2+Math.random()*1.5,(Math.random()-.5)*1.2,1.6+Math.random()*1.6,(Math.random()-.5)*1.2,1.8,false,0x9a9a9a);
  for(let i=0;i<6;i++)part(PT_FIRE,x,y+.5,z,.35,.5+Math.random()*.4,(Math.random()-.5)*14,4+Math.random()*7,(Math.random()-.5)*14,0,true);lightFlash(x,y,z,Math.min(8,2+r));}};
// ---------- lodes: gaismas strīpa lidojuma virzienā (garums atkarīgs no ieroča), uzliesmojums pie stobra ----------
const TRGEO={short:new THREE.BoxGeometry(.035,.035,.45),mid:new THREE.BoxGeometry(.03,.03,.85),long:new THREE.BoxGeometry(.025,.025,1.8),pel:new THREE.BoxGeometry(.03,.03,.3)};
const TRMAT={pl:new THREE.MeshBasicMaterial({color:0xffe9a8}),ally:new THREE.MeshBasicMaterial({color:0xbfe8ff}),en:new THREE.MeshBasicMaterial({color:0xff9a7a})};
function tracerize(m,vx,vz,W,cls){if(!m||!W||W.rocket)return;m.geometry=W===WP.snip?TRGEO.long:W===WP.m16?TRGEO.mid:W.pel>1?TRGEO.pel:TRGEO.short;m.material=TRMAT[cls]||TRMAT.pl;m.rotation.set(0,Math.atan2(vx,vz),0);}
function muzzle(x,y,z,W){if(!W)return;const big=W.pel>1||W===WP.snip||W.rocket;part(PT_FLASH,x,y,z,big?1.1:.6,.06,0,0,0,0,true);if(W.rocket)for(let i=0;i<3;i++)part(PT_SMOKE,x,y,z,.9,1.2,(Math.random()-.5),1,(Math.random()-.5),1.5,false,0xb0b0b0);}
const _spawnBullet22=spawnBullet;spawnBullet=function(x,y,z,vx,vz,W,team,pl){const n0=bullets.length;_spawnBullet22(x,y,z,vx,vz,W,team,pl);const b=bullets[bullets.length-1];
 if(b&&bullets.length>n0){tracerize(b.m,vx,vz,W,pl?'pl':team===PT?'ally':'en');if(bullets.length-n0===1||Math.random()<.2)muzzle(x,y,z,W);}};
const _visBullet22=visBullet;visBullet=function(e,mine){_visBullet22(e,mine);const v=netVB[netVB.length-1];if(v&&!e.r){v.m.geometry=TRGEO.mid;v.m.material=e.c===2?TRMAT.en:e.c===1?TRMAT.ally:TRMAT.pl;v.m.rotation.set(0,Math.atan2(e.vx,e.vz),0);}if(Math.random()<.5)muzzle(e.x,e.y,e.z,e.r?WP.rpg:WP.m16);};
// ---------- astes un putekļi ----------
let trailT=0;
function trailsTick(dt){trailT-=dt;if(trailT>0)return;trailT=GFX==='low'?.12:.05;
 for(const b of bullets)if(b.rocket)part(PT_SMOKE,b.m.position.x,b.m.position.y,b.m.position.z,.7,1.1,0,.4,0,1.6,false,0xc8c8c8);
 if(typeof JR!=='undefined')for(const r of JR)part(PT_SMOKE,r.x,r.y,r.z,.9,1.3,0,.3,0,1.8,false,0xd0d0d0);
 if(typeof JV!=='undefined')for(const j of JV)part(PT_SMOKE,j.x,j.y,j.z,.8,1.4,0,.3,0,1.8,false,0xe0e0e0);
 const jets=typeof JETS==='undefined'?[]:NET.role==='guest'?[...netJets.values()].filter(o=>o.st===1||o.st===2).map(o=>o.g.position):JETS.filter(J=>J.st==='fly'||J.st==='fall').map(J=>J.g.position);
 for(const p of jets)if(Math.random()<.6)part(PT_SMOKE,p.x,p.y,p.z,1.2,1.6,0,0,0,1.4,false,0xeeeeee);
 const hs=typeof HELIS==='undefined'?[]:NET.role==='guest'?[...netHelis.values()].filter(o=>o.st===1).map(o=>o.g.position):HELIS.filter(H=>H.st==='fly').map(H=>H.g.position);
 for(const p of hs){const gnd=typeof heliGround==='function'?heliGround(p.x,p.z):0;if(p.y-gnd<7&&Math.random()<.8){const a=Math.random()*6.283;part(PT_DUST,p.x+Math.cos(a)*3,gnd+.4,p.z+Math.sin(a)*3,2.2,1.2,Math.cos(a)*5,.6,Math.sin(a)*5,1.6,false);}}
 // degoša tehnika un uguns naktī mirgo
 if(GQ[GFX].light&&typeof fires!=='undefined'&&(hour>=19||hour<7)){let best=null,bd=50;for(const f of fires){const d=Math.hypot(f.x-player.position.x,f.z-player.position.z);if(d<bd){bd=d;best=f;}}if(best&&flashT<=0){FLASH.position.set(best.x,2,best.z);FLASH.intensity=1.6+Math.random()*.8;}}}
// ---------- cikls ----------
const _updateFx22=updateFx;updateFx=function(dt){_updateFx22(dt);partsTick(dt);trailsTick(dt);
 if(flashT>0){flashT-=dt;FLASH.intensity*=Math.max(0,1-dt*9);if(flashT<=0)FLASH.intensity=0;}else if(!(typeof fires!=='undefined'&&fires.length&&(hour>=19||hour<7)))FLASH.intensity=0;
 sunDisc.position.copy(player.position).addScaledVector(SUNDIR,200);sunDisc.visible=!(hour>=19.5||hour<5.5);};
// ---------- kvalitātes izvēle ----------
function applyGfx(){renderer.shadowMap.enabled=GFX!=='low';if(GFX==='low'){renderer.setPixelRatio(Math.min(devicePixelRatio,.85));}else if(GFX==='mid')renderer.setPixelRatio(Math.min(devicePixelRatio,TOUCH?1.1:1.25));else renderer.setPixelRatio(Math.min(devicePixelRatio,TOUCH?1.5:1.7));
 scene.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);});const b=$('gfxb');if(b)b.textContent='🎨 '+t('g_'+GFX);}
{const b=document.createElement('button');b.className='corner';b.id='gfxb';$('cfg').before(b);b.onclick=e=>{GFX=GFX==='low'?'mid':GFX==='mid'?'high':'low';LS.set('gfx',GFX);applyGfx();say(t('gfx')+': '+t('g_'+GFX),1.5);e.currentTarget.blur();};}
applyGfx();drawSky(0);
const _applyLang22=applyLang;applyLang=function(){_applyLang22();const b=$('gfxb');if(b)b.textContent='🎨 '+t('g_'+GFX);};
