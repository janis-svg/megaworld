// 38_nakts_redze.js - Nakts redzamības brilles: atrodamas kastēs un mežā, naktī ieslēdzas pašas; viss gaišāks un zaļš, cilvēki, briesmoņi un tehnika spīd kā infrasarkanajā
Object.assign(T.lv,{nv:'Nakts redzamības brilles',nv_got:'🥽 Nakts redzamības brilles! Naktī tās ieslēdzas pašas (N vai 🥽 izslēdz).',nv_on:'🥽 Nakts redze ieslēgta',nv_off:'🥽 Nakts redze izslēgta',shop_nv:'🥽 Nakts redzamības brilles (naktī redz cilvēkus)'});
Object.assign(T.en,{nv:'Night vision goggles',nv_got:'🥽 Night vision goggles! They switch on by themselves at night (N or 🥽 turns them off).',nv_on:'🥽 Night vision on',nv_off:'🥽 Night vision off',shop_nv:'🥽 Night vision goggles (see people at night)'});
SHOPS.weapons.push(['nv',40]);WDROP.push('nv');
const _giveLoot25=giveLoot;giveLoot=function(k,I,Tm){if(k==='nv'){const had=I.nv;I.nv=true;if(I===inv&&!had)setTimeout(()=>say(t('nv_got'),4),50);return '🥽 '+t('nv');}return _giveLoot25(k,I,Tm);};
const _pickForest25=pickForest;pickForest=function(R){if(R()<.04)return 'nv';return _pickForest25(R);};
const _itemMesh25=itemMesh;itemMesh=function(type){if(type!=='nv')return _itemMesh25(type);const m=new THREE.Group();vadd(m,.42,.14,.14,0x263238,0,0,0);for(const x of [-.11,.11]){const l=vcyl(m,.07,.07,.12,0x111111,x,0,-.1,'z',10);const g=vcyl(m,.055,.055,.02,0x76ff03,x,0,-.17,'z',10);g.material.emissive=new THREE.Color(0x4caf50);}return m;};
// spīdums ap ķermeni: siltuma plankums
let NVTX=null,nvOn=false,nvOff=false;
function nvTex(){if(NVTX)return NVTX;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,240,200,.75)');g.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=g;x.fillRect(0,0,64,64);NVTX=new THREE.CanvasTexture(c);return NVTX;}
function nvGlow(g,sx,sy,y){if(!g)return;let s=g.userData.nvs;if(!s){s=new THREE.Sprite(new THREE.SpriteMaterial({map:nvTex(),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.5}));s.material.userData.keep=true;s.scale.set(sx,sy,1);s.position.y=y;s.userData.y0=y;g.add(s);g.userData.nvs=s;}s.visible=true;return s;}
const NVSEEN=new Set();
function nvMarkAll(){const L=[];
 if(NET.role==='guest'){for(const o of netBot.values())L.push([o.g,1.2,2.2,1.1]);for(const o of netMon.values())L.push([o.z,2,2.8,1.2]);for(const o of netPl.values())L.push([o.g,1.2,2.2,1.1]);for(const o of netTk.values())L.push([o.g,4,2.6,1.2]);for(const o of netHelis.values())L.push([o.g,4,3,1.8]);}
 else{for(const b of humans)L.push([b.g,1.2,2.2,1.1]);for(const z of zombies)L.push([z,2,2.8,1.2]);for(const G of NET.guests.values())L.push([G.mesh,1.2,2.2,1.1]);for(const t of tanks)if(!t.dead)L.push([t.g,4,2.6,1.2]);for(const H of HELIS)if(H.st!=='gone')L.push([H.g,4,3,1.8]);}
 for(const [g,sx,sy,y] of L){const s=nvGlow(g,sx,sy,y);if(s)NVSEEN.add(s);}}
function nvHideAll(){for(const s of NVSEEN)s.visible=false;NVSEEN.clear();}
// spīdums nedaudz kameras pusē, lai to neaizsedz pats ķermenis
const NVV=new THREE.Vector3(),NVC=new THREE.Vector3();
function nvFace(){for(const s of NVSEEN){const g=s.parent;if(!g||!g.parent){NVSEEN.delete(s);continue;}g.getWorldPosition(NVV);NVV.y+=s.userData.y0;NVC.copy(camera.position).sub(NVV);const l=NVC.length();if(l<.01)continue;NVV.addScaledVector(NVC,Math.min(.9,l*.5)/l);s.position.copy(g.worldToLocal(NVV));}}
// naktī ar brillēm gaišāka apkārtne
let nvK=0;const _drawSky25=drawSky;drawSky=function(k){nvK=k;_drawSky25(k);if(nvOn){amb.intensity+=1.1;hemi.intensity+=.6;}};
const nvov=document.createElement('div');nvov.id='nvov';document.body.appendChild(nvov);
const nvb=document.createElement('button');nvb.id='nvb';nvb.className='corner';nvb.textContent='🥽';document.body.appendChild(nvb);
nvb.onpointerdown=e=>{e.stopPropagation();e.preventDefault();nvToggle();};
function nvToggle(){if(!inv||!inv.nv)return;nvOff=!nvOff;say(t(nvOff?'nv_off':'nv_on'),1.5);}
document.addEventListener('keydown',e=>{if(e.code==='KeyN'&&!e.repeat&&active&&document.activeElement.tagName!=='INPUT')nvToggle();});
const isNight=()=>hour>=20||hour<6;
let nvT=0;
function nvTick(dt){const want=active&&inv&&inv.nv&&isNight()&&!nvOff;nvb.style.display=active&&inv&&inv.nv?'block':'none';nvb.classList.toggle('on',!!want);
 if(want!==nvOn){nvOn=want;document.documentElement.classList.toggle('nv',nvOn);if(renderer)renderer.domElement.style.filter=nvOn?'brightness(2.3) contrast(1.15) sepia(1) hue-rotate(55deg) saturate(2.4)':'';if(!nvOn)nvHideAll();drawSky(nvK);}
 if(nvOn&&(nvT-=dt)<=0){nvT=.5;nvMarkAll();}if(nvOn)nvFace();}
const _updateFx25=updateFx;updateFx=function(dt){_updateFx25(dt);nvTick(dt);};
// nakts (20:00-6:00) paiet 1,8 reizes ātrāk nekā diena
const _updateTime25=updateTime;updateTime=function(dt){_updateTime25(dt);if(isNight()){hour+=dt*24/600*.8;if(hour>=24)hour-=24;}};
