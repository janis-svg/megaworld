// 18_uguns.js - Sērkociņi un dedzināšana: koks vai puķe 10 sērkociņi, māja jo lielāka, jo vairāk
const fires=[];const _M0=new THREE.Matrix4().makeScale(0,0,0);
let FIREM=null;
function treeCost(){return 10;}
// tuvākais, ko var aizdedzināt: koks (līdz 2.2 m) vai māja (stāvot ārpusē, līdz 1.6 m no sienas)
function findBurnable(px,pz){
 let best=null,bd=1e9;
 for(const ch of chunks.values()){
  for(const tr of ch.trees||[]){if(tr.burnt)continue;const d=Math.hypot(tr.x-px,tr.z-pz);if(d<2.2&&d<bd){bd=d;best={type:'burn',k:'t',ch,o:tr,cost:treeCost()};}}
  for(const b of ch.blds||[]){if(b.burnt)continue;const dx=Math.max(0,Math.abs(px-b.x)-b.hx),dz=Math.max(0,Math.abs(pz-b.z)-b.hz),d=Math.hypot(dx,dz);if(d>0&&d<1.6&&d+.5<bd){bd=d+.5;best={type:'burn',k:'h',ch,o:b,cost:b.cost};}}
 }
 if(typeof plants!=='undefined')for(const pl of plants){if(pl.burnt)continue;const d=Math.hypot(pl.x-px,pl.z-pz);if(d<1.8&&d<bd){bd=d;best={type:'burn',k:'p',o:pl,cost:treeCost()};}}
 return best;
}
// sāk degt (no spēlētāja, drauga vai pēc tīkla ziņas); instant = bez uguns (jau nodedzināts agrāk)
function startBurn(k,o,instant){
 if(o.burnt)return;o.burnt=true;burnt.add(o.id);
 if(NET.role==='host'&&!instant)netQ.push({e:'burn',k,id:o.id});
 const fin=()=>{if(k==='t')hideTree(o);else if(k==='h')ruinHouse(o);else if(typeof removePlant==='function')removePlant(o);};
 if(instant){fin();return;}
 if(k==='h')fires.push({x:o.x,z:o.z,w:o.hx,d:o.hz,h:Math.min(8,o.h),t:6,dmg:true,fin});
 else fires.push({x:o.x,z:o.z,w:.6,d:.6,h:k==='t'?4.5*(o.s||1):1,t:3,fin});
 sfxAt('boom',o.x,o.z,40);
}
function hideTree(tr){tr.tr.setMatrixAt(tr.i,_M0);tr.co.setMatrixAt(tr.i*2,_M0);tr.co.setMatrixAt(tr.i*2+1,_M0);tr.tr.instanceMatrix.needsUpdate=true;tr.co.instanceMatrix.needsUpdate=true;remOb(tr.ob);tr.ob.dead=true;}
function ruinHouse(b){
 if(b.g.parent)b.g.parent.remove(b.g);freeObj(b.g);
 for(const o of b.obs){remOb(o);o.dead=true;}for(const o of b.inter){o.r=0;o.open=true;o.loot=[];}
 const ch=[...chunks.values()].find(c=>c.blds&&c.blds.includes(b));if(!ch)return;
 const r=cube(b.hx*2,.15,b.hz*2,0x1c1a18,1);r.position.set(b.x,.08,b.z);r.castShadow=false;ch.group.add(r);
 for(let i=0;i<6;i++){const c=cube(.4+Math.random()*.8,.3+Math.random()*.8,.4+Math.random()*.8,0x111111,1);c.position.set(b.x+(Math.random()-.5)*b.hx*1.6,.3,b.z+(Math.random()-.5)*b.hz*1.6);c.rotation.y=Math.random()*3;ch.group.add(c);}
}
function updateFires(dt){
 if(!FIREM)FIREM=[new THREE.MeshBasicMaterial({color:0xff7a1a}),new THREE.MeshBasicMaterial({color:0xffd23f}),new THREE.MeshBasicMaterial({color:0x333333})];
 for(let i=fires.length-1;i>=0;i--){
  const f=fires[i];f.t-=dt;const near=Math.hypot(f.x-player.position.x,f.z-player.position.z)<70;
  if(near&&fxs.length<320){const big=f.w>1,n=big?7:3;for(let k=0;k<n;k++){const smoke=f.t<1.5&&Math.random()<.5,m=new THREE.Mesh(FXG,FIREM[smoke?2:Math.random()<.5?0:1]);m.scale.setScalar((smoke?2.2:1.4+Math.random())*(big?3:1.3));m.position.set(f.x+(Math.random()-.5)*f.w*2,.3+Math.random()*f.h*.7,f.z+(Math.random()-.5)*f.d*2);scene.add(m);fxs.push({m,vx:(Math.random()-.5)*.6,vy:1.5+Math.random()*2.5,vz:(Math.random()-.5)*.6,life:.5+Math.random()*.5,up:true,shared:true});}}
  if(near&&Math.random()<dt*6)noise(.12,.06,1800);
  if(f.dmg&&(f.tick=(f.tick||0)-dt)<=0){f.tick=.5; // kas iekšā deg, tas saņem bojājumu
   const inside=(x,z)=>Math.abs(x-f.x)<f.w+.3&&Math.abs(z-f.z)<f.d+.3;
   for(const h of [...HL])if(inside(h.p.x,h.p.z))hurt(h,8,null,false);
   for(const z of [...zombies])if(!z.userData.dead&&inside(z.position.x,z.position.z))dmgMonster(z,15,false);}
  if(f.t<=0){fires.splice(i,1);f.fin();}
 }
}
const _updateFx=updateFx;updateFx=function(dt){_updateFx(dt);updateFires(dt);};
// pasaules gabalā atjauno to, kas jau nodedzināts (arī draugiem)
const _genChunk2=genChunk;genChunk=function(cx,cz){_genChunk2(cx,cz);if(!burnt.size)return;const ch=chunks.get(cx+','+cz);if(!ch)return;for(const tr of ch.trees||[])if(burnt.has(tr.id))startBurn('t',tr,true);for(const b of ch.blds||[])if(burnt.has(b.id))startBurn('h',b,true);};
// drauga pusē: saimnieks paziņo, ka kaut kas sāk degt
function netExtraEv(e){
 if(e.e==='burn'){burnt.add(e.id);for(const ch of chunks.values()){const list=e.k==='t'?ch.trees:e.k==='h'?ch.blds:null;if(!list)continue;const o=list.find(q=>q.id===e.id);if(o){o.burnt=false;burnt.delete(e.id);startBurn(e.k,o,false);}}
  if(e.k==='p'&&typeof plants!=='undefined'){const o=plants.find(q=>q.id===e.id);if(o)startBurn('p',o,false);}}
 else if(typeof netExtraEv2==='function')netExtraEv2(e);
}
